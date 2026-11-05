// Listens to a video's music (public/videos/<slug>/music.mp3) and writes what
// a DJ would hear into src/videos/<slug>/beatmap.json, in seconds: `bpm`,
// every `beat` (quiet stretches filled at the track's own beat length), the
// `downbeats` (the one of each bar), `phrases` (every 8 bars from the first
// downbeat, where a DJ mixes), `sections` by energy and the `drops` among
// them. The builder cuts to it (.claude/skills/dj-cut). Needs uv
// (scripts/beats.py runs librosa). Silence, or no music, writes nothing.
//
//   node scripts/beatmap.mjs <slug>
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const r3 = (x) => Number(x.toFixed(3));

// Measures the track; null when it cannot (no uv, no drums, silence).
export const measure = (slug) => {
  const audio = `public/videos/${slug}/music.mp3`;
  const out = `public/videos/${slug}/beats.json`;
  if (!existsSync(audio)) return null;
  const r = spawnSync("uv", ["run", "scripts/beats.py", audio, "--fps", "60", "--out", out], {
    stdio: ["ignore", "ignore", "inherit"],
    shell: process.platform === "win32",
  });
  if (r.status !== 0 || !existsSync(out)) return null;
  const m = JSON.parse(readFileSync(out, "utf8"));
  rmSync(out, { force: true });
  const raw = m.beats_s;
  if (raw.length < 8) return null;
  // Quiet parts (an intro without drums) leave gaps: fill them, and the
  // start, at the median beat length.
  const gaps = raw.slice(1).map((b, i) => b - raw[i]).sort((x, y) => x - y);
  const period = gaps[Math.floor(gaps.length / 2)];
  const beats = [];
  for (let b = raw[0] - period; b > -0.01; b -= period) beats.unshift(Math.max(0, b));
  raw.forEach((b, i) => {
    beats.push(b);
    const next = raw[i + 1];
    if (next && next - b > period * 1.5) {
      const n = Math.round((next - b) / period);
      for (let k = 1; k < n; k++) beats.push(b + ((next - b) * k) / n);
    }
  });
  // The bar's one, carried through the filled beats from the measured phase.
  const meter = m.meter || 4;
  const first = m.downbeats_s[0] ?? beats[0];
  let at = beats.reduce((best, b, i) => (Math.abs(b - first) < Math.abs(beats[best] - first) ? i : best), 0);
  // librosa often hears half the tempo (75 for a 150 track): below 85 BPM
  // the beat between every two is put back.
  let bpm = m.bpm;
  if (bpm < 85) {
    const half = beats.flatMap((b, i) => (i + 1 < beats.length ? [b, (b + beats[i + 1]) / 2] : [b, b + period / 2]));
    beats.splice(0, beats.length, ...half);
    at *= 2;
    bpm *= 2;
  }
  const downbeats = beats.filter((_, i) => i >= at % meter && (i - at) % meter === 0);
  const sections = m.sections.map((s) => ({ start: r3(s.start_s), end: r3(s.end_s), energy: s.energy, ...(s.drop ? { drop: true } : {}) }));
  return {
    bpm: Number(bpm.toFixed(2)),
    beats: beats.map(r3),
    downbeats: downbeats.map(r3),
    phrases: downbeats.filter((_, i) => i % 8 === 0).map(r3),
    sections,
    drops: sections.filter((s) => s.drop).map((s) => s.start),
  };
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const slug = process.argv[2];
  if (!slug) throw new Error("usage: beatmap.mjs <slug>");
  const map = measure(slug);
  const file = `src/videos/${slug}/beatmap.json`;
  if (!map) {
    rmSync(file, { force: true });
    console.log("beatmap: no beats to measure (no uv, silence or no drums); none written");
  } else {
    writeFileSync(file, JSON.stringify(map) + "\n");
    console.log(`beatmap: ${map.bpm} BPM, ${map.beats.length} beats, ${map.phrases.length} phrases, drops at ${map.drops.join(", ") || "none"}`);
  }
}
