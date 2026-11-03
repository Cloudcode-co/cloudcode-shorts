// Generates the video's sound effects with ElevenLabs into public/sfx/.
//
//   node --env-file=.env scripts/sfx.mjs           # only missing effects
//   node --env-file=.env scripts/sfx.mjs whoosh    # regenerate one
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error("ELEVENLABS_API_KEY is not set (put it in .env)");

const EFFECTS = {
  whoosh: { text: "quick soft air whoosh, short swipe transition", seconds: 0.6 },
  pop: { text: "short soft bubbly UI pop, clean, no reverb", seconds: 0.5 },
  thud: { text: "punchy deep impact hit with short tail, trailer style", seconds: 0.8 },
  pixel: { text: "8-bit retro arcade rising blip sweep, chiptune", seconds: 0.8 },
  typing: { text: "fast mechanical keyboard typing, close mic, dry", seconds: 2.5 },
  ding: { text: "bright clean success chime, single note", seconds: 0.8 },
};

const only = process.argv.slice(2);
mkdirSync("public/sfx", { recursive: true });

for (const [id, fx] of Object.entries(EFFECTS)) {
  const file = `public/sfx/${id}.mp3`;
  if (only.length ? !only.includes(id) : existsSync(file)) continue;
  const res = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: fx.text,
      duration_seconds: fx.seconds,
      prompt_influence: 0.6,
    }),
  });
  if (!res.ok) throw new Error(`${id}: ${res.status} ${await res.text()}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log("generated", id);
}
