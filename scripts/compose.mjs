// Composes a video's background track in code, with no service: a seeded
// generator (see the generative-music-composer and music-composition skills)
// that writes public/videos/<slug>/music.mp3 from src/videos/<slug>/timeline.json.
//
// Each music section of the timeline starts a fresh bar exactly at its second,
// so the music changes where the story does; the bar cut short before it gets
// a fill. A section's name sets its energy (Hook, Build, Drop, Outro, ...),
// which decides the layers: pad and chords always, then bass and hats, then
// drums, then a sparse lead. Harmony comes from a style's progressions with
// nearest-voice voicings; the lead is a weighted walk over scale degrees that
// lands on chord tones on strong beats and repeats its motif (A A' B A).
//
// When src/videos/<slug>/score.json exists (Gemini's score, pipeline/score.mjs)
// it sets the style, tempo, key, each section's chords, energy, drums and lead,
// and the motif; the generator fills in the rest.
//
//   node scripts/compose.mjs <slug> [lofi|synthwave|chiptune] [seed]
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const [slug, styleArg, seedArg] = process.argv.slice(2);
if (!slug) throw new Error("usage: compose.mjs <slug> [style] [seed]");

const SR = 44100;
let state = Number(seedArg ?? [...slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)) >>> 0;
const rnd = () => {
  state = (state + 0x6d2b79f5) >>> 0;
  let t = state;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pick = (xs) => xs[Math.floor(rnd() * xs.length)];
const weighted = (pairs) => {
  let r = rnd() * pairs.reduce((s, [, w]) => s + w, 0);
  for (const [v, w] of pairs) if ((r -= w) <= 0) return v;
  return pairs.at(-1)[0];
};
const midi = (n) => 440 * 2 ** ((n - 69) / 12);

// Progressions as scale degrees (1-7) of a major or minor key; 7ths in lofi.
const STYLES = {
  lofi: {
    bpm: [76, 84], swing: 0.62, mode: "major", sevenths: true,
    progressions: [[2, 5, 1, 6], [4, 3, 2, 1], [1, 6, 2, 5], [4, 5, 3, 6]],
    keys: [60, 62, 63, 65, 67], lead: "epiano", kit: "soft", crackle: true,
  },
  synthwave: {
    bpm: [88, 100], swing: 0.5, mode: "minor", sevenths: false,
    progressions: [[1, 6, 3, 7], [1, 4, 6, 5], [6, 7, 1, 1], [1, 7, 6, 7]],
    keys: [57, 59, 62, 64], lead: "saw", kit: "gated", crackle: false,
  },
  // Breakcore: chopped amen-style breaks in 16ths and a long reese bass, at the
  // exact tempo of an art direction cut on a beat grid.
  breakcore: {
    bpm: [150, 150], swing: 0.5, mode: "minor", sevenths: false,
    progressions: [[1, 6, 3, 7], [1, 4, 6, 5], [6, 7, 1, 1], [1, 7, 6, 4]],
    keys: [57, 59, 62], lead: "saw", kit: "break", crackle: false,
  },
  chiptune: {
    bpm: [112, 126], swing: 0.5, mode: "major", sevenths: false,
    progressions: [[1, 5, 6, 4], [6, 4, 1, 5], [1, 4, 5, 4], [4, 1, 5, 6]],
    keys: [60, 62, 64, 65, 67], lead: "square", kit: "noise", crackle: false,
  },
};
const scoreFile = `src/videos/${slug}/score.json`;
const score = existsSync(scoreFile) && !styleArg ? JSON.parse(readFileSync(scoreFile, "utf8")) : null;
const style = STYLES[score?.style ?? styleArg] ?? STYLES[pick(Object.keys(STYLES))];
const styleName = Object.keys(STYLES).find((k) => STYLES[k] === style);
const mode = score?.mode ?? style.mode;
const SCALE = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10] }[mode];
const NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
// A key's tonic between A3 and G#4.
const key = score ? 57 + ((NOTE_NAMES.indexOf(score.key) + 3) % 12) : pick(style.keys);
const bpm = score?.bpm ?? style.bpm[0] + rnd() * (style.bpm[1] - style.bpm[0]);
const beat = 60 / bpm;
const degree = (d) => key + SCALE[(((d - 1) % 7) + 7) % 7] + 12 * Math.floor((d - 1) / 7);
const chordOf = (root) => [0, 2, 4, ...(style.sevenths ? [6] : [])].map((s) => degree(root + s));

// Sections and their energy, from the timeline the scenes are built to.
const timeline = JSON.parse(readFileSync(`src/videos/${slug}/timeline.json`, "utf8"));
const total = timeline.total + 2;
const ENERGY = { hook: 0.45, intro: 0.3, build: 0.6, tension: 0.7, verse: 0.55, drop: 1, chaos: 1, reveal: 0.9, punchline: 0.85, chorus: 0.95, outro: 0.35 };
const sections = (timeline.sections?.length ? timeline.sections : [{ name: "Build", start: 0 }]).map((s, i, all) => {
  const e = score?.sections?.[i]?.energy ?? ENERGY[s.name.toLowerCase()] ?? 0.6;
  return {
    name: s.name,
    start: s.start,
    end: all[i + 1]?.start ?? total,
    energy: e,
    chords: score?.sections?.[i]?.chords,
    drums: score?.sections?.[i]?.drums ?? (e >= 0.6 ? "full" : e >= 0.45 ? "light" : "none"),
    lead: score?.sections?.[i]?.lead ?? e >= 0.8,
  };
});

const len = Math.ceil(total * SR);
const L = new Float32Array(len);
const R = new Float32Array(len);
const padL = new Float32Array(len);
const padR = new Float32Array(len);
const echo = new Float32Array(len);
const duck = new Float32Array(len).fill(1);
const put = (i, v, pan = 0) => {
  if (i < 0 || i >= len) return;
  L[i] += v * Math.min(1, 1 - pan);
  R[i] += v * Math.min(1, 1 + pan);
};
const human = () => Math.floor((rnd() - 0.5) * 0.01 * SR);

// --- Instruments --------------------------------------------------------
const kick = (t, v) => {
  const s = Math.floor(t * SR);
  let ph = 0;
  const hard = style.kit !== "soft";
  for (let i = 0; i < SR * 0.4; i++) {
    const x = i / SR;
    ph += (2 * Math.PI * (42 + (hard ? 120 : 80) * Math.exp(-x * 32))) / SR;
    put(s + i, Math.sin(ph) * Math.exp(-x * (hard ? 7 : 10)) * 0.8 * v);
  }
  for (let i = 0; i < SR * beat * 0.9; i++) if (s + i < len) duck[s + i] = Math.min(duck[s + i], 0.35 + 0.65 * Math.min(1, i / (SR * beat * 0.6)));
};
const snare = (t, v) => {
  const s = Math.floor(t * SR) + human();
  let lp = 0;
  const gated = style.kit === "gated";
  for (let i = 0; i < SR * (gated ? 0.28 : 0.18); i++) {
    const x = i / SR;
    lp += (style.kit === "soft" ? 0.25 : 0.5) * (rnd() * 2 - 1 - lp);
    const env = gated ? (x < 0.17 ? 0.4 + 0.6 * Math.exp(-x * 25) : Math.max(0, 1 - (x - 0.17) / 0.03)) : Math.exp(-x * 20);
    put(s + i, (lp * 0.7 + Math.sin(2 * Math.PI * 185 * x) * Math.exp(-x * 30) * 0.35) * env * 0.42 * v, -0.1);
  }
};
const hat = (t, v, open = false) => {
  const s = Math.floor(t * SR) + human();
  let prev = 0;
  for (let i = 0; i < SR * (open ? 0.16 : 0.04); i++) {
    const n = rnd() * 2 - 1;
    put(s + i, (n - prev) * Math.exp(-(i / SR) * (open ? 16 : 65)) * 0.1 * v, 0.3);
    prev = n;
  }
};
// A soft noise swell into the next section.
const riser = (from, to) => {
  const s = Math.floor(from * SR);
  const n = Math.floor((to - from) * SR);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const p = i / n;
    lp += (0.02 + 0.3 * p) * (rnd() * 2 - 1 - lp);
    put(s + i, lp * p * p * 0.25, Math.sin(p * 9) * 0.4);
  }
};
const bass = (t, note, dur, v) => {
  const s = Math.floor(t * SR);
  const f = midi(note);
  let lp = 0;
  for (let i = 0; i < SR * dur; i++) {
    const x = i / SR;
    const env = Math.min(1, x * 300, (dur - x) * 200);
    let w;
    if (style.lead === "square") w = 2 * Math.abs(2 * ((x * f) % 1) - 1) - 1; // NES triangle
    else {
      lp += 0.06 * (2 * ((x * f) % 1) - 1 - lp);
      w = lp * 0.8 + Math.sin(2 * Math.PI * f * x) * 0.6;
    }
    put(s + i, w * env * 0.4 * v);
  }
};
// Chords: FM electric piano (lofi), plucky square (chiptune), or a pad.
const chordHit = (t, notes, dur, v) => {
  notes.forEach((n, k) => {
    const s = Math.floor((t + k * 0.011) * SR) + human();
    const f = midi(n);
    for (let i = 0; i < SR * dur; i++) {
      const x = i / SR;
      const rel = Math.min(1, (dur - x) * 12);
      let w;
      if (style.lead === "square") w = ((x * f) % 1 < 0.5 ? 1 : -1) * Math.exp(-x * 9) * 0.35;
      else w = Math.sin(2 * Math.PI * f * x + 1.6 * Math.exp(-x * 5) * Math.sin(2 * Math.PI * f * x)) * Math.exp(-x * 1.8);
      put(s + i, w * rel * 0.05 * v, k % 2 ? 0.3 : -0.3);
    }
  });
};
const pad = (t, notes, dur, v) => {
  const s = Math.floor(t * SR);
  const lp = [0, 0];
  for (let i = 0; i < SR * dur && s + i < len; i++) {
    const x = i / SR;
    const env = Math.min(1, x / 0.8, (dur - x) / 0.3);
    let a = 0;
    let b = 0;
    for (const n of notes) {
      a += 2 * ((x * midi(n - 0.07)) % 1) - 1;
      b += 2 * ((x * midi(n + 0.07)) % 1) - 1;
    }
    lp[0] += 0.03 * (a / notes.length - lp[0]);
    lp[1] += 0.03 * (b / notes.length - lp[1]);
    padL[s + i] += lp[0] * env * 0.13 * v;
    padR[s + i] += lp[1] * env * 0.13 * v;
  }
};
const lead = (t, note, dur, v) => {
  const s = Math.floor(t * SR) + human();
  const f = midi(note);
  let ph = 0;
  let lp = 0;
  for (let i = 0; i < SR * dur; i++) {
    const x = i / SR;
    ph += (f * (1 + 0.004 * Math.sin(2 * Math.PI * 5.5 * x) * Math.min(1, x * 3))) / SR;
    const raw = style.lead === "epiano"
      ? Math.sin(2 * Math.PI * ph + 1.2 * Math.exp(-x * 6) * Math.sin(4 * Math.PI * ph)) * Math.exp(-x * 2.5)
      : style.lead === "square" ? (ph % 1 < 0.25 ? 1 : -1) : 2 * (ph % 1) - 1;
    lp += 0.15 * (raw - lp);
    const w = lp * Math.min(1, x * 50, (dur - x) * 20) * 0.075 * v;
    put(s + i, w);
    if (s + i < len) echo[s + i] += w;
  }
};

// One bar of chopped breaks (16 steps): a different chop each bar, ghost
// snares, a ride on the eighths, and a stuttered roll to end a phrase.
const BREAKS = [
  { k: [0, 2, 10, 11], s: [4, 7, 9, 12, 15], g: [6, 14] },
  { k: [0, 3, 8, 10], s: [4, 6, 12, 13], g: [9, 15] },
  { k: [0, 2, 5, 10], s: [4, 9, 12, 14, 15], g: [7] },
  { k: [0, 1, 8, 11, 14], s: [4, 12], g: [6, 7, 15] },
];
const breakBar = (t0, barEnd, e, drums, roll) => {
  const step = beat / 4;
  if (drums === "light") {
    kick(t0, e);
    for (const st of [4, 12]) snare(t0 + st * step, 0.7);
    for (let st = 0; st < 16; st += 2) if (t0 + st * step < barEnd) hat(t0 + st * step, 0.5);
    return;
  }
  const p = pick(BREAKS);
  for (let st = 0; st < 16; st++) {
    const t = t0 + st * step;
    if (t >= barEnd) break;
    if (roll && st >= 12) {
      snare(t, 0.5 + (st - 12) * 0.15);
      snare(t + step / 2, 0.4 + (st - 12) * 0.15);
      continue;
    }
    if (p.k.includes(st)) kick(t, e);
    if (p.s.includes(st)) snare(t, 0.85);
    if (p.g.includes(st)) snare(t, 0.3);
    if (st % 2 === 0) hat(t, st % 4 === 0 ? 0.65 : 0.45);
  }
};
const breaks = style.kit === "break";

// --- Composition --------------------------------------------------------
// Nearest voicing: the chord's notes moved by octaves to sit closest to the
// previous chord, inside 52-76, so the harmony moves smoothly.
let prevVoicing = chordOf(1).map((n) => n);
const voice = (notes) => {
  const v = notes.map((n) => {
    let best = n;
    for (let o = -2; o <= 2; o++) {
      const c = n + 12 * o;
      if (c < 52 || c > 76) continue;
      const d = Math.min(...prevVoicing.map((p) => Math.abs(p - c)));
      if (best < 52 || best > 76 || d < Math.min(...prevVoicing.map((p) => Math.abs(p - best)))) best = c;
    }
    return best;
  }).sort((a, b) => a - b);
  prevVoicing = v;
  return v;
};

// Lead: steps preferred, chord tones on strong beats, a 2-bar motif repeated
// with a varied ending (A A' B A).
const motif = () => {
  const rhythm = [];
  let at = 0;
  while (at < 8) {
    const d = weighted([[0.5, 3], [1, 4], [1.5, 2], [2, 1]]);
    if (rnd() < 0.25) rhythm.push({ at, d, rest: true });
    else rhythm.push({ at, d });
    at += d;
  }
  return rhythm.filter((n) => n.at < 8);
};
const walk = (rhythm, chordAt, start) => {
  let deg = start;
  return rhythm.map((n) => {
    if (n.rest) return null;
    const step = weighted([[0, 2], [1, 4], [-1, 4], [2, 2], [-2, 2], [3, 1], [-3, 1], [4, 0.5]]);
    deg = Math.max(3, Math.min(13, deg + step));
    const strong = n.at % 2 === 0;
    if (strong) {
      // Pull to the nearest chord tone on the beat.
      const tones = chordAt(n.at).map((d) => [d, d + 7, d - 7]).flat();
      deg = tones.reduce((b, d) => (Math.abs(d - deg) < Math.abs(b - deg) ? d : b), tones[0]);
    }
    return { ...n, deg };
  }).filter(Boolean);
};

const prog = pick(style.progressions);
// The score's motif as the A phrase, else a generated one.
const written = score?.motif?.length ? score.motif.map((n) => ({ at: n.beat, d: n.length, deg: n.degree })) : null;
let motifA = written ?? motif();
const motifB = motif();
let melodyA = null;

for (const [si, sec] of sections.entries()) {
  const e = sec.energy;
  const bars = (sec.end - sec.start) / (4 * beat);
  const chords = sec.chords ?? prog;
  const chordAt = (barIdx) => chords[barIdx % chords.length];
  if (si > 0 && sec.energy >= 0.8) riser(Math.max(sections[si - 1].start, sec.start - 2 * beat), sec.start);
  for (let b = 0; b < Math.ceil(bars); b++) {
    const t0 = sec.start + b * 4 * beat;
    if (t0 >= sec.end) break;
    const barEnd = Math.min(t0 + 4 * beat, sec.end);
    const lastBar = barEnd === sec.end;
    const root = chordAt(b);
    const notes = voice(chordOf(root));
    pad(t0, notes, barEnd - t0, 0.6 + 0.4 * e);
    // Chord rhythm by energy: one long hit, or a syncopated comp.
    const hits = e < 0.5 ? [0] : [0, 1.5, 2.5];
    for (const h of hits) if (t0 + h * beat < barEnd) chordHit(t0 + h * beat, notes, beat * (e < 0.5 ? 3.5 : 1), 0.7 + 0.3 * e);
    if (breaks && sec.drums !== "none") {
      breakBar(t0, barEnd, e, sec.drums, b % 4 === 3 || (lastBar && si < sections.length - 1));
      bass(t0, degree(root) - 24, (barEnd - t0) * 0.96, 0.9);
    }
    for (let q = 0; q < 4 && !breaks; q++) {
      const t = t0 + q * beat;
      if (t >= barEnd) break;
      const off = t + beat * style.swing;
      if (sec.drums !== "none") {
        bass(t, degree(root) - 24, beat * 0.45, 0.7 + 0.3 * e);
        if (e >= 0.6) bass(off, degree(root) - (q % 2 ? 12 : 24), beat * 0.35, 0.6);
        hat(off, 0.6 + 0.4 * e);
      }
      if (sec.drums === "full") {
        if (q === 0 || q === 2 || (q === 3 && rnd() < 0.25)) kick(q === 3 ? off : t, e);
        if (q === 1 || q === 3) snare(t, 0.8 + 0.2 * e);
        if (e >= 0.9) hat(t, 0.5);
      }
      // Fill on the last beat before the next section lands.
      if (lastBar && si < sections.length - 1 && t + beat >= barEnd - 0.01 && sec.drums !== "none") {
        for (let r = 0; r < 4; r++) snare(t + (r * beat) / 4, 0.4 + r * 0.15);
      }
    }
    // Lead in the loud parts only, so it never fights the voice for long.
    if (sec.lead && b % 2 === 0) {
      const phrase = Math.floor(b / 2) % 4; // A A' B A
      const rhythm = phrase === 2 ? motifB : phrase === 1 ? motifA.map((n, i, a) => (i === a.length - 1 ? { ...n, d: 2 } : n)) : motifA;
      const line = written && phrase !== 2 ? rhythm : phrase === 0 && melodyA ? melodyA : walk(rhythm, (at) => chordOf(chordAt(b + Math.floor(at / 4))).map((n) => SCALE.indexOf((n - key + 120) % 12) + 1), 8);
      if (phrase === 0) melodyA = line;
      for (const n of line) {
        const t = t0 + n.at * beat;
        if (t < sec.end) lead(t, degree(n.deg) + 12, Math.min(n.d * beat * 0.92, sec.end - t), 1);
      }
    }
  }
}

// Vinyl crackle for lofi: sparse clicks and a little hiss.
if (style.crackle) for (let i = 0; i < len; i++) {
  if (rnd() < 0.0004) put(i, (rnd() - 0.5) * 0.25, rnd() - 0.5);
  put(i, (rnd() - 0.5) * 0.004);
}

// Dotted-eighth ping-pong delay on the lead.
const dly = Math.floor(beat * 0.75 * SR);
const eL = new Float32Array(len);
const eR = new Float32Array(len);
for (let i = 0; i < len; i++) {
  eL[i] = echo[i] + (i >= dly ? eR[i - dly] * 0.4 : 0);
  eR[i] = i >= dly ? eL[i - dly] * 0.4 : 0;
}

const wav = `public/videos/${slug}/music.wav`;
const buf = Buffer.alloc(44 + len * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + len * 4, 4);
buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(len * 4, 40);
let peak = 0;
const mixL = new Float32Array(len);
const mixR = new Float32Array(len);
for (let i = 0; i < len; i++) {
  mixL[i] = Math.tanh((L[i] + padL[i] * duck[i] + eL[i] * 0.5) * 1.3);
  mixR[i] = Math.tanh((R[i] + padR[i] * duck[i] + eR[i] * 0.5) * 1.3);
  peak = Math.max(peak, Math.abs(mixL[i]), Math.abs(mixR[i]));
}
const gain = 0.9 / (peak || 1);
for (let i = 0; i < len; i++) {
  buf.writeInt16LE(Math.round(mixL[i] * gain * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(mixR[i] * gain * 32767), 46 + i * 4);
}
writeFileSync(wav, buf);
const out = process.env.COMPOSE_OUT || `public/videos/${slug}/music.mp3`;
const r = spawnSync("npx", ["remotion", "ffmpeg", "-y", "-v", "error", "-i", wav, "-c:a", "libmp3lame", "-b:a", "192k", out], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
rmSync(wav, { force: true });
if (r.status !== 0) throw new Error("compose: ffmpeg could not encode the track");
console.log(
  `composed ${out}: ${styleName}, ${Math.round(bpm)} BPM, key ${NOTE_NAMES[key % 12]} ${mode}${score ? " (Gemini's score)" : ""}, ` +
    `${sections.map((s) => `${s.name}@${s.start}s`).join(" ")} (${total.toFixed(1)}s)`,
);
