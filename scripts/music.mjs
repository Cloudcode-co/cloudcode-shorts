// Generates a video's background track with ElevenLabs Music into
// public/videos/<slug>/music.mp3. The track runs a little past the voiceover's
// total length (the video fades it out); `musicPrompt` in
// src/videos/<slug>/script.json overrides the default style.
//
// When the script has `musicSections` (each starting at a scene, with its own
// styles), the track is composed section by section to the video's timeline:
// each scene's planned start and length (its voice line plus a breath, or a
// silent beat's length) go to src/videos/<slug>/timeline.json, and each music
// section lasts exactly as long as its scenes, so the music changes where the
// story does. The builder times the scenes to timeline.json.
//
// With MUSIC_URL (the owner's own track: an audio file, or a video whose sound
// is used), that track is used instead from MUSIC_START seconds in, looped or
// cut to the video's length (the kit's <Music> fades it out). Without
// ElevenLabs (no key, or it refuses) an earlier video's generated track from
// the repo is reused the same way. With MUSIC_OFF the track is silence, for
// a sound picked in the TikTok app instead (MUSIC_URL still wins).
//
//   node --env-file=.env scripts/music.mjs <slug>
//   node --env-file=.env scripts/music.mjs <slug> 114     # exact length in seconds
//   MUSIC_URL=https://... node scripts/music.mjs <slug>
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const custom = (process.env.MUSIC_URL ?? "").trim();
const key = process.env.ELEVENLABS_API_KEY;

const [slug, seconds] = process.argv.slice(2);
if (!slug) throw new Error("usage: music.mjs <slug> [seconds]");

const DEFAULT_PROMPT =
  "Upbeat lo-fi electronic instrumental for a tech explainer short, " +
  "punchy drums, warm synth bass, light 8-bit arpeggio accents, 110 BPM, " +
  "steady energy with no big drops, leaves room for a voiceover, no vocals";

const script = JSON.parse(readFileSync(`src/videos/${slug}/script.json`, "utf8"));
const durationsFile = `src/videos/${slug}/durations.json`;
const voice = existsSync(durationsFile)
  ? Object.values(JSON.parse(readFileSync(durationsFile, "utf8")))
  : [];
// Each shot adds about a second of breath and animation on top of its line;
// 20s more covers shots without a voice and the end card's hold.
const estimate = voice.reduce((sum, s) => sum + s + 1, 0) + 20;
const lengthMs = Math.round((seconds ? Number(seconds) : estimate) * 1000);

// The planned timeline: a voiced scene lasts its line plus a breath (longer
// when it types commands), a silent beat its own length; the last scene holds.
const BREATH = 0.9;
const LAST_HOLD = 1.5;
const timeline = () => {
  const lines = existsSync(durationsFile) ? JSON.parse(readFileSync(durationsFile, "utf8")) : {};
  const silent = !script.scenes.some((s) => s.text?.trim());
  let at = 0;
  const scenes = {};
  script.scenes.forEach((s, i) => {
    const line = lines[s.id] ?? 3;
    const typing = (s.commands ?? []).join("").length * 0.05 + 2.5;
    let length = silent ? line : Math.max(line + BREATH, s.commands?.length ? typing : 2.5);
    if (i === script.scenes.length - 1) length += LAST_HOLD;
    scenes[s.id] = { start: Number(at.toFixed(2)), length: Number(length.toFixed(2)) };
    at += length;
  });
  return { scenes, total: Number(at.toFixed(2)) };
};

// The writer's sections, as consecutive runs of scenes of at least 3 s
// (ElevenLabs' shortest section); a short one joins the one before it.
const sectionsFor = ({ scenes }) => {
  const ids = script.scenes.map((s) => s.id);
  const starts = (script.musicSections ?? [])
    .map((m) => ({ ...m, at: ids.indexOf(m.from) }))
    .filter((m) => m.at >= 0)
    .sort((a, b) => a.at - b.at);
  if (!starts.length) return null;
  starts[0].at = 0;
  const sections = [];
  starts.forEach((m, i) => {
    const run = ids.slice(m.at, i + 1 < starts.length ? starts[i + 1].at : ids.length);
    if (!run.length) return;
    const length = run.reduce((n, id) => n + scenes[id].length, 0);
    const prev = sections.at(-1);
    if (prev && length < 3) {
      prev.length += length;
      prev.scenes.push(...run);
    } else sections.push({ name: m.name, styles: m.styles ?? [], scenes: run, start: scenes[run[0]].start, length });
  });
  if (sections[0].length < 3 && sections.length > 1) {
    const [first, next] = sections.splice(0, 2);
    sections.unshift({ ...next, scenes: [...first.scenes, ...next.scenes], start: 0, length: first.length + next.length });
  }
  return sections.every((s) => s.length >= 3 && s.length <= 120) ? sections : null;
};

mkdirSync(`public/videos/${slug}`, { recursive: true });
const plan = seconds ? null : timeline();

// A given track (the owner's, or an earlier video's), looped or cut to the
// video; the scenes keep their planned timing, with no sections. A reused
// track is noted in timeline.json `reused`, so the next pick can skip it.
const useTrack = (src, start, temporary) => {
  const total = plan ? plan.total + 2 : lengthMs / 1000;
  if (plan) {
    const note = temporary ? {} : { reused: src };
    writeFileSync(`src/videos/${slug}/timeline.json`, JSON.stringify({ ...plan, ...note }, null, 2) + "\n");
  }
  const r = spawnSync(
    "npx",
    [
      "remotion", "ffmpeg", "-y", "-v", "error",
      "-stream_loop", "-1", "-ss", String(start), "-i", src,
      "-vn", "-t", total.toFixed(2),
      "-c:a", "libmp3lame", "-b:a", "192k",
      `public/videos/${slug}/music.mp3`,
    ],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  if (temporary) rmSync(src, { force: true });
  if (r.status !== 0) throw new Error("music: ffmpeg could not read the track");
  console.log(`used ${temporary ? "the given track" : src} for public/videos/${slug}/music.mp3 (${total.toFixed(1)}s from ${start}s)`);
  process.exit(0);
};
const lengthOf = (file) =>
  Number(
    spawnSync("npx", ["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], {
      encoding: "utf8",
      shell: process.platform === "win32",
    }).stdout.trim(),
  ) || 0;
// An earlier video's track long enough to play once without looping, the one
// reused least so far (ties at random); the longest when none is long enough.
const reuse = (why) => {
  const total = plan ? plan.total + 2 : lengthMs / 1000;
  const uses = {};
  for (const d of readdirSync("src/videos")) {
    const file = `src/videos/${d}/timeline.json`;
    const from = existsSync(file) && JSON.parse(readFileSync(file, "utf8")).reused;
    if (from) uses[from] = (uses[from] ?? 0) + 1;
  }
  const tracks = readdirSync("public/videos")
    .filter((d) => d !== slug && existsSync(`public/videos/${d}/music.mp3`))
    .map((d) => ({ file: `public/videos/${d}/music.mp3`, random: Math.random() }))
    .map((t) => ({ ...t, length: lengthOf(t.file), uses: uses[t.file] ?? 0 }));
  if (!tracks.length) throw new Error(`music: ${why}, and no earlier track to reuse`);
  const long = tracks.filter((t) => t.length >= total);
  const pick = long.length
    ? long.sort((x, y) => x.uses - y.uses || x.random - y.random)[0]
    : tracks.sort((x, y) => y.length - x.length)[0];
  console.log(`music: ${why}; reusing ${pick.file} (${pick.length.toFixed(0)}s, used ${pick.uses} times before)`);
  useTrack(pick.file, 0, false);
};

if (custom) {
  const res = await fetch(custom, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new Error(`music: could not download MUSIC_URL (${res.status})`);
  const src = `public/videos/${slug}/music-source`;
  writeFileSync(src, Buffer.from(await res.arrayBuffer()));
  useTrack(src, Math.max(0, Number(process.env.MUSIC_START) || 0), true);
}
if (/^(1|true|yes)$/i.test(process.env.MUSIC_OFF ?? "")) {
  if (plan) writeFileSync(`src/videos/${slug}/timeline.json`, JSON.stringify(plan, null, 2) + "\n");
  const total = plan ? plan.total + 2 : lengthMs / 1000;
  const r = spawnSync(
    "npx",
    [
      "remotion", "ffmpeg", "-y", "-v", "error",
      "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-t", total.toFixed(2),
      "-c:a", "libmp3lame", "-b:a", "64k",
      `public/videos/${slug}/music.mp3`,
    ],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  if (r.status !== 0) throw new Error("music: ffmpeg could not write silence");
  console.log(`no music: public/videos/${slug}/music.mp3 is ${total.toFixed(1)}s of silence`);
  process.exit(0);
}
if (!key) reuse("ELEVENLABS_API_KEY is not set");

const sections = plan && sectionsFor(plan);
let body;
if (sections) {
  const lead = sections.length > 1 && sections[0].length >= 4 ? 1 : 0;
  const style = (script.musicPrompt ?? DEFAULT_PROMPT).replace(/,?\s*no vocals\.?$/i, "");
  body = {
    model_id: "music_v1",
    respect_sections_durations: true,
    composition_plan: {
      positive_global_styles: [style, "instrumental"],
      negative_global_styles: ["vocals", "singing", "lyrics", "spoken word"],
      sections: sections.map((s, i) => ({
        section_name: s.name.slice(0, 100) || `Part ${i + 1}`,
        positive_local_styles: s.styles.slice(0, 8),
        negative_local_styles: [],
        // The model takes about a second to reach a new part, so every change is
        // asked for a second early: the first part is that much shorter and the
        // last longer, plus a tail since the very end fades out.
        duration_ms: Math.round((s.length - (i === 0 ? lead : 0) + (i === sections.length - 1 ? lead + 2 : 0)) * 1000),
        lines: [],
      })),
    },
  };
  writeFileSync(
    `src/videos/${slug}/timeline.json`,
    JSON.stringify({ ...plan, sections: sections.map(({ name, start, length, scenes }) => ({ name, start: Number(start.toFixed(2)), length: Number(length.toFixed(2)), scenes })) }, null, 2) + "\n",
  );
  console.log(`Music in ${sections.length} sections: ${sections.map((s) => `${s.name} ${s.length.toFixed(1)}s`).join(", ")}`);
} else {
  body = { prompt: script.musicPrompt ?? DEFAULT_PROMPT, music_length_ms: Math.min(lengthMs, 300000), force_instrumental: true };
}
const compose = (b) =>
  fetch("https://api.elevenlabs.io/v1/music", {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify(b),
  });
let res = await compose(body);
// A plan ElevenLabs refuses still gets a track, from the prompt.
if (!res.ok && sections) {
  console.log(`music plan refused: ${res.status} ${(await res.text()).slice(0, 300)}; composing from the prompt`);
  res = await compose({ prompt: script.musicPrompt ?? DEFAULT_PROMPT, music_length_ms: Math.min(lengthMs, 300000), force_instrumental: true });
}
if (!res.ok) reuse(`ElevenLabs refused (${res.status} ${(await res.text()).slice(0, 200)})`);
writeFileSync(`public/videos/${slug}/music.mp3`, Buffer.from(await res.arrayBuffer()));
console.log(`generated public/videos/${slug}/music.mp3 (${sections ? plan.total + 2 : lengthMs / 1000}s)`);
