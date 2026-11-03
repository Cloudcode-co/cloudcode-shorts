// Makes one video end to end: script (Gemini) → voice and music (ElevenLabs) →
// build (Claude Code, else the fallback) → QA stills → render → Telegram/Discord.
//
//   node --env-file=.env pipeline/run.mjs "Coolify vs Dokploy"
//   node --env-file=.env pipeline/run.mjs                  # Gemini picks the topic
//   node --env-file=.env pipeline/run.mjs "..." --render   # render locally too
//
// Renders only on CI or with --render. TOPIC in the environment works like the
// first argument (the GitHub workflow passes it that way).
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readdirSync } from "node:fs";
import { readJson, run, runUrl, writeJson } from "./lib.mjs";
import { uploadVideo } from "./cdn.mjs";
import { notifyOn, sendMessage, sendPhotos, sendVideo } from "./notify.mjs";

const args = process.argv.slice(2);
const topic = (args.filter((a) => !a.startsWith("--")).join(" ") || process.env.TOPIC || "").trim();
const render = Boolean(process.env.CI) || args.includes("--render");

// Runs a node script, echoing its output, and returns its last output line.
const nodeLast = (script, scriptArgs) => {
  console.log(`\n> node ${script} ${scriptArgs.join(" ")}`);
  const r = spawnSync("node", [script, ...scriptArgs], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  process.stdout.write(r.stdout ?? "");
  process.stderr.write(r.stderr ?? "");
  if (r.status !== 0) throw new Error(`${script} failed:\n${(r.stderr || r.stdout || "").slice(-1500)}`);
  return r.stdout.trim().split("\n").pop();
};

let slug = null;
try {
  await sendMessage(`Bắt đầu làm video: ${topic || "(Gemini tự chọn đề tài)"}${runUrl ? `\n${runUrl}` : ""}`);

  slug = nodeLast("pipeline/write-script.mjs", topic ? [topic] : []);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `slug=${slug}\n`);
  const script = readJson(`src/videos/${slug}/script.json`);

  run("node", ["scripts/voiceover.mjs", slug]);
  run("node", ["scripts/music.mjs", slug]);
  const build = JSON.parse(nodeLast("pipeline/build-video.mjs", [slug]));
  run("node", ["scripts/qa-stills.mjs", slug]);

  const history = readJson("pipeline/history.json", []);
  history.push({
    slug,
    topic: script.topic,
    date: new Date().toISOString().slice(0, 10),
    ...build,
  });
  writeJson("pipeline/history.json", history);

  const caption = `${script.caption}\n\n${script.hashtags.join(" ")}`;
  const summary =
    `Xong: ${script.title}\n` +
    `Phong cách: ${build.direction} (${build.built === "claude" ? "Claude dựng" : "khuôn dự phòng"}), ` +
    `Claude $${build.costUsd.toFixed(2)}\n\nCaption để đăng:\n${caption}` +
    (runUrl ? `\n\n${runUrl}` : "");

  const qa = `out/qa/${slug}`;
  const stills = existsSync(qa) ? readdirSync(qa).filter((f) => f.endsWith(".png")).sort() : [];
  await sendPhotos([1, 4, 8].map((i) => stills[i]).filter(Boolean).map((f) => `${qa}/${f}`));

  if (render) {
    const out = `out/${slug}.mp4`;
    run("npx", ["remotion", "render", slug, out, "--crf=23", "--log=info"]);
    const url = await uploadVideo(out, slug);
    if (url) console.log("Uploaded:", url);
    await sendVideo(out, script.title, url);
  }
  await sendMessage(summary);
  console.log(`\nDone: ${slug}${notifyOn ? " (sent to Telegram/Discord)" : ""}`);
} catch (err) {
  await sendMessage(`Lỗi khi làm video${slug ? ` ${slug}` : ""}:\n${err.message}`.slice(0, 3500) + (runUrl ? `\n${runUrl}` : ""));
  throw err;
}
