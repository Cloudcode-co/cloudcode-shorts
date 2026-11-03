// Generates a video's background track with ElevenLabs Music into
// public/videos/<slug>/music.mp3. The track runs a little past the voiceover's
// total length (the video fades it out); `musicPrompt` in
// src/videos/<slug>/script.json overrides the default style.
//
//   node --env-file=.env scripts/music.mjs <slug>
//   node --env-file=.env scripts/music.mjs <slug> 114     # exact length in seconds
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error("ELEVENLABS_API_KEY is not set (put it in .env)");

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

mkdirSync(`public/videos/${slug}`, { recursive: true });
const res = await fetch("https://api.elevenlabs.io/v1/music", {
  method: "POST",
  headers: { "xi-api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: script.musicPrompt ?? DEFAULT_PROMPT,
    music_length_ms: Math.min(lengthMs, 300000),
    force_instrumental: true,
  }),
});
if (!res.ok) throw new Error(`music: ${res.status} ${await res.text()}`);
writeFileSync(`public/videos/${slug}/music.mp3`, Buffer.from(await res.arrayBuffer()));
console.log(`generated public/videos/${slug}/music.mp3 (${lengthMs / 1000}s)`);
