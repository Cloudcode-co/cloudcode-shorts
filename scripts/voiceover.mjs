// Generates one ElevenLabs voiceover clip per scene of a video, from
// src/videos/<slug>/script.json into public/videos/<slug>/voiceover/, and
// records each clip's length in seconds in src/videos/<slug>/durations.json.
//
//   node --env-file=.env scripts/voiceover.mjs <slug>            # only missing clips
//   node --env-file=.env scripts/voiceover.mjs <slug> --force    # regenerate all
//   node --env-file=.env scripts/voiceover.mjs <slug> row-2      # regenerate one scene
//
// Without ElevenLabs (no key, or it refuses: plan ended, out of credits) the
// clips come from Microsoft Edge's free neural voices through the edge-tts
// CLI (pip install edge-tts); EDGE_VOICE picks one (default vi-VN-NamMinhNeural).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

let key = process.env.ELEVENLABS_API_KEY;
const EDGE_VOICE = process.env.EDGE_VOICE || "vi-VN-NamMinhNeural";

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

// Edge would read Eleven v3's audio tags ([excited], [laughs]) aloud.
const edge = (text, file) =>
  execFileSync("edge-tts", [`--voice=${EDGE_VOICE}`, "--rate=+8%", `--text=${text.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim()}`, `--write-media=${file}`], {
    stdio: ["ignore", "ignore", "inherit"],
  });
const durations = existsSync(DURATIONS) ? JSON.parse(readFileSync(DURATIONS, "utf8")) : {};
const made = [];
for (const scene of scenes) {
  const file = `public/videos/${slug}/voiceover/${scene.id}.mp3`;
  const selected = only.length === 0 || only.includes(scene.id);
  if (selected && (force || only.includes(scene.id) || !existsSync(file))) {
    if (key) {
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
      if (res.ok) writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      else {
        // One voice per video: the clips made so far are redone with Edge too.
        console.log(`ElevenLabs refused ${scene.id} (${res.status} ${(await res.text()).slice(0, 200)}); using Edge TTS`);
        key = "";
        for (const s of made) edge(s.text, `public/videos/${slug}/voiceover/${s.id}.mp3`);
      }
    }
    if (!key) edge(scene.text, file);
    made.push(scene);
    console.log("generated", scene.id);
  }
}
for (const scene of scenes) {
  const file = `public/videos/${slug}/voiceover/${scene.id}.mp3`;
  if (existsSync(file)) durations[scene.id] = Number(durationOf(file).toFixed(3));
}

writeFileSync(DURATIONS, JSON.stringify(durations, null, 2) + "\n");
console.log(durations);
