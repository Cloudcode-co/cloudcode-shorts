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
// the slug of a video to rework; FORMAT is the kind of video (pipeline/formats.mjs),
// each with its own art direction unless STYLE says otherwise.
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { readJson, run, runUrl, writeJson } from "./lib.mjs";
import { FORMATS, formatOf } from "./formats.mjs";
import { sendToDrafts, uploadVideo } from "./cdn.mjs";
import { notifyOn, sendMessage, sendResult } from "./notify.mjs";
import { resolveVoice } from "./voices.mjs";
import { restoreFootage } from "./footage.mjs";
import { restoreImages } from "./images.mjs";
import { restoreMemes } from "./memes.mjs";
import { restoreSatellite } from "./satellite.mjs";
import { glFor } from "../scripts/gl.mjs";

const args = process.argv.slice(2);
const topic = (args.filter((a) => !a.startsWith("--")).join(" ") || process.env.TOPIC || "").trim();
const render = Boolean(process.env.CI) || args.includes("--render");
const voice = (process.env.VOICE ?? "").trim();
const notes = (process.env.NOTES ?? "").trim();
const style = (process.env.STYLE ?? "").trim();
const revise = (process.env.REVISE ?? "").trim();
// The owner's own track for the video instead of generated music.
const music = (process.env.MUSIC_URL ?? "").trim();
// No music at all, for a sound picked in the TikTok app (scripts/music.mjs).
const musicOff = /^(1|true|yes)$/i.test(process.env.MUSIC_OFF ?? "");
// A daily run (SCHEDULED: "early", "morning" or "afternoon", from the bot
// worker's crons) makes what pipeline/schedule.json lists for that slot of
// this weekday in Vietnam (UTC+7), and nothing when the day leaves it out.
const slot = (process.env.SCHEDULED ?? "").trim();
const scheduled = () => {
  if (!slot) return "";
  const vn = new Date(Date.now() + 7 * 3600 * 1000);
  const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][vn.getUTCDay()];
  const pick = readJson("pipeline/schedule.json", {}).days?.[day]?.[slot] ?? "";
  console.log(pick ? `Schedule: ${day} ${slot} → ${pick}` : `Schedule: nothing for ${day} ${slot}`);
  return pick;
};
const pick = process.env.FORMAT?.trim() || scheduled();
if (slot && !pick) process.exit(0);
const format = formatOf(pick);
// The format's own look, unless the run asked for one.
if (!revise && !style && FORMATS[format].style) process.env.STYLE = FORMATS[format].style;
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

// The music's beats, downbeats and drops for the builder (scripts/beatmap.mjs);
// a video still gets made without them.
const beatmap = (slug) => spawnSync("node", ["scripts/beatmap.mjs", slug], { stdio: "inherit" });

// A new video: script, voice, music, Claude's build.
const makeNew = () => {
  const voiced = FORMATS[format].voiced;
  const slug = setSlug(nodeResult(voiced ? "pipeline/write-script.mjs" : "pipeline/write-meme.mjs", topic ? [topic] : []));
  if (voiced) run("node", ["scripts/voiceover.mjs", slug]);
  run("node", ["scripts/music.mjs", slug]);
  beatmap(slug);
  return { slug, build: { ...nodeResult("pipeline/build-video.mjs", [slug]), format } };
};

// A finished video, reworked: a new voice and/or Claude's changes. With
// nothing asked it is only rendered again (after a fix pushed to its code).
const rework = async () => {
  if (!/^[a-z0-9-]+$/.test(revise) || !existsSync(`src/videos/${revise}/script.json`)) {
    throw new Error(`không có video "${revise}" trong repo`);
  }
  const slug = setSlug(revise);
  // Footage is not committed; fetch the clips this video uses again.
  await restoreFootage(slug);
  await restoreImages(slug);
  await restoreMemes(slug);
  await restoreSatellite(slug);
  const past = readJson("pipeline/history.json", []).findLast((h) => h.slug === slug) ?? {};
  const silent = FORMATS[formatOf(readJson(`src/videos/${slug}/script.json`).format)].voiced === false;
  if (voice && !silent) {
    const { voiceId, name } = await resolveVoice(voice);
    console.log(`Voice: ${name}`);
    const file = `src/videos/${slug}/script.json`;
    writeJson(file, { ...readJson(file), voiceId });
    run("node", ["scripts/voiceover.mjs", slug, "--force"]);
  }
  // The owner's own track replaces the music (scripts/music.mjs reads MUSIC_URL).
  // A new style to or from one cut on a beat grid (a direction with `bpm`)
  // needs new music and a new timeline too.
  const hasBpm = (s) => readJson("pipeline/art-directions.json").directions.find((d) => d.id === s || d.name === s)?.bpm;
  const pastDirection = existsSync(`src/videos/${slug}/direction.json`) ? readJson(`src/videos/${slug}/direction.json`) : null;
  const regrid = style && (hasBpm(style) || pastDirection?.bpm);
  const remixed = music || musicOff || regrid;
  if (remixed) run("node", ["scripts/music.mjs", slug]);
  const rebuild = notes || style || chosenBuilder;
  if (remixed || (rebuild && !existsSync(`src/videos/${slug}/beatmap.json`))) beatmap(slug);
  const build = rebuild
    ? nodeResult("pipeline/build-video.mjs", [slug, "--revise"])
    : { direction: past.direction, pacing: past.pacing, built: past.built, costUsd: 0 };
  return { slug, build: { ...build, revision: asked } };
};

const asked = [
  style && `phong cách ${style}`,
  voice && `giọng ${voice}`,
  chosenBuilder && `dựng: ${chosenBuilder === "beag" ? "Gemini" : "Claude"}`,
  music && "nhạc riêng",
  !music && musicOff && "không nhạc (thêm sound trong TikTok)",
  notes,
]
  .filter(Boolean)
  .join("; ");
let slug = revise || null;
try {
  // Only runs someone asked for say they started; the daily ones speak once done.
  if (!slot) {
    await sendMessage(
      (revise
        ? `Bắt đầu sửa video ${revise}: ${asked || "chỉ xuất lại"}`
        : `Bắt đầu làm ${format === "explainer" ? "video" : FORMATS[format].label}: ${topic || "(Gemini tự chọn đề tài)"}${asked ? `\nYêu cầu: ${asked}` : ""}`) +
        (runUrl ? `\n<${runUrl}>` : ""),
    );
  }

  const made = revise ? await rework() : makeNew();
  slug = made.slug;
  const { build } = made;
  const script = readJson(`src/videos/${slug}/script.json`);
  run("node", ["scripts/qa-stills.mjs", slug]);

  const history = readJson("pipeline/history.json", []);
  history.push({
    slug,
    topic: script.topic,
    format: script.format ?? "explainer",
    date: new Date().toISOString().slice(0, 10),
    ...build,
  });
  writeJson("pipeline/history.json", history);
  // Each version gets its own file name, so the CDN never serves an old copy.
  const version = history.filter((h) => h.slug === slug).length;

  const caption = `${script.caption}\n\n${script.hashtags.join(" ")}`;
  const title = `${revise ? `Đã sửa (bản ${version})` : "Xong"}: ${script.title}`;
  const footer =
    `${build.direction}, ${{ claude: "Claude dựng", beag: "be-ag dựng" }[build.built] ?? "khuôn dự phòng"} ` +
    `$${(build.costUsd ?? 0).toFixed(2)} · sửa: /sua video:${slug}` +
    (runUrl ? ` · <${runUrl}>` : "");

  if (render) {
    const out = version > 1 ? `out/${slug}-v${version}.mp4` : `out/${slug}.mp4`;
    const gl = glFor(slug);
    run("npx", ["remotion", "render", slug, out, "--crf=23", "--log=info", ...(gl ? [`--gl=${gl}`] : [])]);
    const url = await uploadVideo(out, slug);
    if (url) console.log("Uploaded:", url);
    // The workflow keeps a copy as an artifact only when the CDN has none.
    if (url && process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `cdn=${url}\n`);
    // The video goes straight to TikTok (posted privately with its caption when
    // the account granted Direct Post, else to the drafts), then one message
    // says how it went; a failed send carries the drafts button to retry.
    let tiktok = "";
    let key;
    if (url) {
      const draft = await sendToDrafts(slug, out, caption);
      console.log("TikTok drafts:", JSON.stringify(draft));
      if (draft.error) {
        key = `${slug}/${out.split("/").pop()}`;
        // TikTok holds only a few unposted inbox videos per account (5 a day).
        tiktok = /spam_risk_too_many_pending_share/.test(draft.error)
          ? "TikTok: hộp thư đầy (tối đa 5 video chờ trong 24 giờ). Đăng hoặc xóa bớt rồi bấm nút ở tin dưới."
          : `TikTok: chưa gửi được (${draft.error}). Bấm nút ở tin dưới để thử lại.`;
      } else if (draft.mode === "post") {
        tiktok = "TikTok: đã đăng ở chế độ riêng tư, caption có sẵn. Đổi sang Mọi người để công khai.";
      } else {
        tiktok = musicOff && !music
          ? "TikTok: đã vào nháp, chưa có nhạc. Bấm Add sound chọn nhạc, dán caption ở tin dưới rồi đăng."
          : "TikTok: đã vào nháp. Dán caption ở tin dưới rồi đăng.";
      }
    }
    await sendResult(out, url, [title, tiktok, footer].filter(Boolean).join("\n\n"), caption, { key, ping: Boolean(url) });
  } else {
    await sendMessage([title, caption, footer].join("\n\n"));
  }
  console.log(`\nDone: ${slug}${notifyOn ? " (sent to Telegram/Discord)" : ""}`);
} catch (err) {
  await sendMessage(
    `Lỗi khi ${revise ? "sửa" : "làm"} video${slug ? ` ${slug}` : ""}:\n${err.message}`.slice(0, 3500) +
      (runUrl ? `\n${runUrl}` : ""),
  );
  throw err;
}
