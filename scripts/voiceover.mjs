// Generates one ElevenLabs voiceover clip per scene of a video, from
// src/videos/<slug>/script.json into public/videos/<slug>/voiceover/, and
// records each clip's length in seconds in src/videos/<slug>/durations.json.
//
//   node --env-file=.env scripts/voiceover.mjs <slug>            # only missing clips
//   node --env-file=.env scripts/voiceover.mjs <slug> --force    # regenerate all
//   node --env-file=.env scripts/voiceover.mjs <slug> row-2      # regenerate one scene
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error("ELEVENLABS_API_KEY is not set (put it in .env)");

const [slug, ...args] = process.argv.slice(2);
if (!slug) throw new Error("usage: voiceover.mjs <slug> [--force] [scene ids]");
const { voiceId, modelId, voiceSettings, scenes } = JSON.parse(
  readFileSync(`src/videos/${slug}/script.json`, "utf8"),
);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

mkdirSync(`public/videos/${slug}/voiceover`, { recursive: true });

const durationOf = (file) => {
  const out = execFileSync(
    "npx",
    ["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8", shell: true },
  );
  return Number(out.trim());
};

const DURATIONS = `src/videos/${slug}/durations.json`;
const durations = existsSync(DURATIONS) ? JSON.parse(readFileSync(DURATIONS, "utf8")) : {};
for (const scene of scenes) {
  const file = `public/videos/${slug}/voiceover/${scene.id}.mp3`;
  const selected = only.length === 0 || only.includes(scene.id);
  if (selected && (force || only.includes(scene.id) || !existsSync(file))) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: scene.text,
        model_id: modelId,
        language_code: "vi",
        voice_settings: voiceSettings ?? { stability: 0.5, similarity_boost: 0.75 },
      }),
    });
    if (!res.ok) throw new Error(`${scene.id}: ${res.status} ${await res.text()}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log("generated", scene.id);
  }
  if (existsSync(file)) durations[scene.id] = Number(durationOf(file).toFixed(3));
}

writeFileSync(DURATIONS, JSON.stringify(durations, null, 2) + "\n");
console.log(durations);
