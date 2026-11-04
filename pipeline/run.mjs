// Makes one video end to end: script (Gemini) → voice and music (ElevenLabs) →
// build (Claude Code, else the fallback) → QA stills → render → Telegram/Discord.
// With REVISE=<slug> it reworks a finished video instead: a new voice
// (VOICE) and/or Claude's changes (NOTES), then renders it again.
//
//   node --env-file=.env pipeline/run.mjs "Coolify vs Dokploy"
//   node --env-file=.env pipeline/run.mjs                  # Gemini picks the topic
//   node --env-file=.env pipeline/run.mjs "..." --render   # render locally too
//
// Renders only on CI or with --render. Env (the GitHub workflow passes these):
// TOPIC works like the first argument; VOICE is an ElevenLabs voice name, id
// or link; STYLE an art direction (see build-video.mjs); NOTES are requests for the script writer and Claude; REVISE is
// the slug of a video to rework.
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { readJson, run, runUrl, writeJson } from "./lib.mjs";
import { uploadVideo } from "./cdn.mjs";
import { notifyOn, sendMessage, sendPhotos, sendVideo } from "./notify.mjs";
import { sendDraftButton } from "./discord.mjs";
import { resolveVoice } from "./voices.mjs";
import { restoreFootage } from "./footage.mjs";
import { glFor } from "../scripts/gl.mjs";

const args = process.argv.slice(2);
const topic = (args.filter((a) => !a.startsWith("--")).join(" ") || process.env.TOPIC || "").trim();
const render = Boolean(process.env.CI) || args.includes("--render");
const voice = (process.env.VOICE ?? "").trim();
const notes = (process.env.NOTES ?? "").trim();
const style = (process.env.STYLE ?? "").trim();
const revise = (process.env.REVISE ?? "").trim();
// The builder asked for in this run (BUILDER also carries the repo default).
const chosenBuilder = (process.env.BUILDER_CHOSEN ?? "").trim();

// Runs a pipeline script with its output streaming into the log, and returns
// what it passed to report().
const RESULT = "out/.result.json";
const nodeResult = (script, scriptArgs) => {
  console.log(`\n> node ${script} ${scriptArgs.join(" ")}`);
  mkdirSync("out", { recursive: true });
  rmSync(RESULT, { force: true });
  const r = spawnSync("node", [script, ...scriptArgs], {
    stdio: "inherit",
    env: { ...process.env, RESULT_FILE: RESULT },
  });
  if (r.status !== 0) throw new Error(`${script} failed (exit ${r.status}); the run log has the details.`);
  return JSON.parse(readFileSync(RESULT, "utf8"));
};

// Tells the workflow which video to commit back.
const setSlug = (value) => {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `slug=${value}\n`);
  return value;
};

// A new video: script, voice, music, Claude's build.
const makeNew = () => {
  const slug = setSlug(nodeResult("pipeline/write-script.mjs", topic ? [topic] : []));
  run("node", ["scripts/voiceover.mjs", slug]);
  run("node", ["scripts/music.mjs", slug]);
  return { slug, build: nodeResult("pipeline/build-video.mjs", [slug]) };
};

// A finished video, reworked: a new voice and/or Claude's changes.
const rework = async () => {
  if (!/^[a-z0-9-]+$/.test(revise) || !existsSync(`src/videos/${revise}/script.json`)) {
    throw new Error(`không có video "${revise}" trong repo`);
  }
  if (!voice && !notes && !style && !chosenBuilder) {
    throw new Error("cần ít nhất một giọng mới, một phong cách, một yêu cầu sửa hoặc người dựng");
  }
  const slug = setSlug(revise);
  // Footage is not committed; fetch the clips this video uses again.
  await restoreFootage(slug);
  const past = readJson("pipeline/history.json", []).findLast((h) => h.slug === slug) ?? {};
  if (voice) {
    const { voiceId, name } = await resolveVoice(voice);
    console.log(`Voice: ${name}`);
    const file = `src/videos/${slug}/script.json`;
    writeJson(file, { ...readJson(file), voiceId });
    run("node", ["scripts/voiceover.mjs", slug, "--force"]);
  }
  const build = notes || style || chosenBuilder
    ? nodeResult("pipeline/build-video.mjs", [slug, "--revise"])
    : { direction: past.direction, pacing: past.pacing, built: past.built, costUsd: 0 };
  return { slug, build: { ...build, revision: asked } };
};

const asked = [
  style && `phong cách ${style}`,
  voice && `giọng ${voice}`,
  chosenBuilder && `dựng: ${chosenBuilder === "beag" ? "Gemini" : "Claude"}`,
  notes,
]
  .filter(Boolean)
  .join("; ");
let slug = revise || null;
try {
  await sendMessage(
    (revise
      ? `Bắt đầu sửa video ${revise}: ${asked}`
      : `Bắt đầu làm video: ${topic || "(Gemini tự chọn đề tài)"}${asked ? `\nYêu cầu: ${asked}` : ""}`) +
      (runUrl ? `\n${runUrl}` : ""),
  );

  const made = revise ? await rework() : makeNew();
  slug = made.slug;
  const { build } = made;
  const script = readJson(`src/videos/${slug}/script.json`);
  run("node", ["scripts/qa-stills.mjs", slug]);

  const history = readJson("pipeline/history.json", []);
  history.push({
    slug,
    topic: script.topic,
    date: new Date().toISOString().slice(0, 10),
    ...build,
  });
  writeJson("pipeline/history.json", history);
  // Each version gets its own file name, so the CDN never serves an old copy.
  const version = history.filter((h) => h.slug === slug).length;

  const caption = `${script.caption}\n\n${script.hashtags.join(" ")}`;
  const summary =
    `${revise ? `Đã sửa (bản ${version})` : "Xong"}: ${script.title}\n` +
    `Phong cách: ${build.direction} (${{ claude: "Claude dựng", beag: "Gemini qua be-ag dựng" }[build.built] ?? "khuôn dự phòng"}), ` +
    `Claude $${(build.costUsd ?? 0).toFixed(2)}\n\nCaption để đăng:\n${caption}\n\n` +
    `Muốn sửa: /sua video:${slug}` +
    (runUrl ? `\n\n${runUrl}` : "");

  const qa = `out/qa/${slug}`;
  const stills = existsSync(qa) ? readdirSync(qa).filter((f) => f.endsWith(".png")).sort() : [];
  await sendPhotos([1, 4, 8].map((i) => stills[i]).filter(Boolean).map((f) => `${qa}/${f}`));

  if (render) {
    const out = version > 1 ? `out/${slug}-v${version}.mp4` : `out/${slug}.mp4`;
    const gl = glFor(slug);
    run("npx", ["remotion", "render", slug, out, "--crf=23", "--log=info", ...(gl ? [`--gl=${gl}`] : [])]);
    const url = await uploadVideo(out, slug);
    if (url) console.log("Uploaded:", url);
    // The workflow keeps a copy as an artifact only when the CDN has none.
    if (url && process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `cdn=${url}\n`);
    await sendVideo(out, script.title, url);
    await sendMessage(summary);
    // The TikTok drafts button works from the copy on the CDN.
    if (url) await sendDraftButton(`${slug}/${out.split("/").pop()}`, caption);
  } else {
    await sendMessage(summary);
  }
  console.log(`\nDone: ${slug}${notifyOn ? " (sent to Telegram/Discord)" : ""}`);
} catch (err) {
  await sendMessage(
    `Lỗi khi ${revise ? "sửa" : "làm"} video${slug ? ` ${slug}` : ""}:\n${err.message}`.slice(0, 3500) +
      (runUrl ? `\n${runUrl}` : ""),
  );
  throw err;
}
