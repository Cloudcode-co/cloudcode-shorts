// Generates one ElevenLabs voiceover clip per scene of a video, from
// src/videos/<slug>/script.json into public/videos/<slug>/voiceover/, and
// records each clip's length in seconds in src/videos/<slug>/durations.json.
//
//   node --env-file=.env scripts/voiceover.mjs <slug>            # only missing clips
//   node --env-file=.env scripts/voiceover.mjs <slug> --force    # regenerate all
//   node --env-file=.env scripts/voiceover.mjs <slug> row-2      # regenerate one scene
//
// The ElevenLabs voice comes through Vibi first (vibi.pro, an ElevenLabs
// reseller with cheaper credits, VIBI_API_KEY), then ElevenLabs itself when
// Vibi refuses (no key, out of credits). When both refuse, the clips come from Microsoft Edge's
// free neural voices through the edge-tts CLI (pip install edge-tts);
// EDGE_VOICE picks one (default vi-VN-NamMinhNeural).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

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

// A Vietnamese voice reads an acronym as a word ("IP" as "íp"), so acronyms
// are spelled out with the English letter names Vietnamese speakers use
// ("ai pi"). The few said as words stay. Only the spoken text changes.
const LETTERS = {
  A: "ây", B: "bi", C: "xi", D: "đi", E: "i", F: "ép", G: "gi", H: "ếch", I: "ai", J: "giây", K: "cây", L: "eo", M: "em",
  N: "en", O: "âu", P: "pi", Q: "kiu", R: "a", S: "ét", T: "ti", U: "u", V: "vi", W: "đắp bờ liu", X: "ích", Y: "oai", Z: "dét",
};
const WORDS = new Set(["RAM", "ROM", "NASA", "LAN", "WAN", "LED", "GIF", "JPEG", "CAPTCHA", "COVID", "UNESCO", "ASEAN", "OK", "WIFI", "SIM", "BIOS", "LOL"]);
const spell = (word) => [...word].map((c) => LETTERS[c]).join(" ");
// Units are said as words wherever they stand ("hai GB RAM", "8GB"); "ghi"
// keeps the hard g that "gi" loses ("di ga").
const UNITS = { KB: "ki lô bai", MB: "mê ga bai", GB: "ghi ga bai", TB: "tê ra bai", PB: "pê ta bai" };
const spoken = (text) =>
  text
    .replace(/(?<![\p{L}\d.\-–])(\d[\d.,]*)\s*[-–—]\s*(\d[\d.,]*)(?![\d\-–])/gu, "$1 đến $2") // 1.3 - 1.7, not 2026-11-07
    .replace(/(?<![\p{L}\[])([KMGTP]B)(?![\p{L}])/gu, (m, unit) => ` ${UNITS[unit]}`)
    .replace(/(?<![\p{L}\[])v([A-Z]{2,6})(?![\p{L}\]])/gu, (m, word) => `vi ${spell(word)}`) // vCPU
    .replace(/(?<![\p{L}\[])([A-Z]{2,6})v(\d)/gu, (m, word, n) => `${spell(word)} vi ${n}`) // IPv6
    .replace(/(?<![\p{L}\[])([A-Z]{2,6})s?(?![\p{L}\]])/gu, (m, word) => (WORDS.has(word) ? m : spell(word)));

// Edge would read Eleven v3's audio tags ([excited], [laughs]) aloud.
const edge = (text, file) =>
  execFileSync("edge-tts", [`--voice=${EDGE_VOICE}`, "--rate=+8%", `--text=${spoken(text).replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim()}`, `--write-media=${file}`], {
    stdio: ["ignore", "ignore", "inherit"],
  });
const body = (text) =>
  JSON.stringify({
    text: spoken(text),
    model_id: modelId,
    language_code: "vi",
    // Older scripts ask for stability 0 (Creative), where v3 repeats words and stutters.
    voice_settings: { similarity_boost: 0.75, ...voiceSettings, stability: Math.max(0.5, voiceSettings?.stability ?? 0.5) },
  });
const failed = async (res) => `${res.status} ${(await res.text()).slice(0, 200)}`;

// Each returns nothing when the clip is written, else why it was refused.
// Both read the same ElevenLabs voice, so a switch midway keeps one voice.
const elevenlabs = async (scene, file) => {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: body(scene.text),
  });
  if (!res.ok) return failed(res);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
};
// Vibi queues the clip and hands back a task to poll.
const VIBI = "https://api.vibi.pro/v1";
const vibi = async (scene, file) => {
  const headers = { "xi-api-key": process.env.VIBI_API_KEY, "Content-Type": "application/json" };
  const res = await fetch(`${VIBI}/text-to-speech/${voiceId}`, { method: "POST", headers, body: body(scene.text) });
  if (!res.ok) return failed(res);
  const { id } = await res.json();
  for (let i = 0; i < 100; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const task = await fetch(`${VIBI}/history/${id}`, { headers }).then((r) => r.json());
    if (task.status === "failed") return `task failed: ${task.error}`;
    if (task.status === "completed" && task.result?.audio_url) {
      const audio = await fetch(task.result.audio_url);
      if (!audio.ok) return failed(audio);
      writeFileSync(file, Buffer.from(await audio.arrayBuffer()));
      return;
    }
  }
  return "timed out after 5 minutes";
};
// Vibi first: its credits cost less than ElevenLabs' own.
const providers = [
  process.env.VIBI_API_KEY && { name: "Vibi", make: vibi },
  process.env.ELEVENLABS_API_KEY && { name: "ElevenLabs", make: elevenlabs },
].filter(Boolean);
let edgeOnly = false;

const durations = existsSync(DURATIONS) ? JSON.parse(readFileSync(DURATIONS, "utf8")) : {};
const made = [];
for (const scene of scenes) {
  const file = `public/videos/${slug}/voiceover/${scene.id}.mp3`;
  const selected = only.length === 0 || only.includes(scene.id);
  if (selected && (force || only.includes(scene.id) || !existsSync(file))) {
    let done = false;
    while (!done && providers.length) {
      const why = await providers[0].make(scene, file);
      if (!why) done = true;
      else {
        console.log(`${providers[0].name} refused ${scene.id} (${why}); trying ${providers[1]?.name ?? "Edge TTS"}`);
        providers.shift();
      }
    }
    if (!done) {
      // One voice per video: the clips made so far are redone with Edge too.
      if (!edgeOnly) for (const s of made) edge(s.text, `public/videos/${slug}/voiceover/${s.id}.mp3`);
      edgeOnly = true;
      edge(scene.text, file);
    }
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
