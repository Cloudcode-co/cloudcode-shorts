// Makes one video end to end: script (Gemini) → voice and music (ElevenLabs) →
// build (Claude Code, else the fallback) → QA stills → render → Telegram.
//
//   node --env-file=.env pipeline/run.mjs "Coolify vs Dokploy"
//   node --env-file=.env pipeline/run.mjs                  # Gemini picks the topic
//   node --env-file=.env pipeline/run.mjs "..." --render   # render locally too
//
// Renders only on CI or with --render. TOPIC in the environment works like the
// first argument (the GitHub workflow passes it that way).
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readdirSync } from "node:fs";
import { readJson, run, writeJson } from "./lib.mjs";
import { sendMessage, sendPhotos, sendVideo, telegramOn } from "./telegram.mjs";

const args = process.argv.slice(2);
const topic = (args.filter((a) => !a.startsWith("--")).join(" ") || process.env.TOPIC || "").trim();
const render = Boolean(process.env.CI) || args.includes("--render");
const runUrl = process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null;

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
    const sent = await sendVideo(out, script.title);
    if (!sent) await sendMessage("Video lớn hơn 50 MB nên bot không gửi được; tải ở mục Artifacts của lần chạy.");
  }
  await sendMessage(summary);
  console.log(`\nDone: ${slug}${telegramOn ? " (sent to Telegram)" : ""}`);
} catch (err) {
  await sendMessage(`Lỗi khi làm video${slug ? ` ${slug}` : ""}:\n${err.message}`.slice(0, 3500) + (runUrl ? `\n${runUrl}` : ""));
  throw err;
}
