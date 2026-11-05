// Moving with the music: src/videos/<slug>/beatmap.json (scripts/beatmap.mjs)
// lists the track's beats, downbeats, phrases and drops in seconds. Load it
// once with `beatmap(json)`; every helper then takes a frame of the whole
// video (not a Sequence's local frame). See .claude/skills/dj-cut.
import { FPS } from "./timing";

export type BeatmapJson = {
  bpm: number;
  beats: number[];
  downbeats: number[];
  phrases: number[];
  drops: number[];
  sections: { start: number; end: number; energy: number; drop?: boolean }[];
};

export type Beatmap = {
  bpm: number;
  // Frames per beat.
  period: number;
  beats: number[];
  downbeats: number[];
  phrases: number[];
  drops: number[];
  sections: { from: number; to: number; energy: number; drop: boolean }[];
};

const fr = (s: number) => Math.round(s * FPS);

export const beatmap = (json: BeatmapJson): Beatmap => ({
  bpm: json.bpm,
  period: (60 / json.bpm) * FPS,
  beats: json.beats.map(fr),
  downbeats: json.downbeats.map(fr),
  phrases: json.phrases.map(fr),
  drops: json.drops.map(fr),
  sections: json.sections.map((s) => ({ from: fr(s.start), to: fr(s.end), energy: s.energy, drop: Boolean(s.drop) })),
});

// The last mark at or before frame f (-Infinity before the first).
export const lastOf = (marks: number[], f: number) => {
  let best = -Infinity;
  for (const m of marks) {
    if (m > f) break;
    best = m;
  }
  return best;
};

// The first mark at or after frame f (Infinity after the last).
export const nextOf = (marks: number[], f: number) => marks.find((m) => m >= f) ?? Infinity;

// The mark nearest frame f: snap a cut or a slam to the music with it.
export const snap = (marks: number[], f: number) =>
  marks.reduce((a, b) => (Math.abs(b - f) < Math.abs(a - f) ? b : a), marks[0] ?? f);

// A kick: 1 on the mark, decaying to 0 over `decay` frames. Scale by it for a
// pump (`scale(1 + 0.04 * hit(map.beats, f))`), flash or shake on it.
export const hit = (marks: number[], f: number, decay = 10) => {
  const since = f - lastOf(marks, f);
  return since >= 0 && since < decay ? Math.pow(1 - since / decay, 2) : 0;
};

// How far frame f is through the current beat, 0 to 1: drive a loop that
// lands back on every beat.
export const beatPhase = (map: Beatmap, f: number) => {
  const last = lastOf(map.beats, f);
  if (!Number.isFinite(last)) return 0;
  return Math.min(1, (f - last) / map.period);
};

// The section frame f is in, with its energy (0 to 1).
export const sectionAt = (map: Beatmap, f: number) =>
  map.sections.find((s) => f >= s.from && f < s.to) ?? map.sections[map.sections.length - 1];

// 0 to 1 through the `beats` beats before the next drop: a riser. Speed cuts
// up, tighten the frame or brighten toward 1, then let the drop hit.
export const buildUp = (map: Beatmap, f: number, beats = 8) => {
  const drop = nextOf(map.drops, f);
  if (!Number.isFinite(drop)) return 0;
  const from = drop - beats * map.period;
  return f < from ? 0 : Math.min(1, (f - from) / (drop - from));
};
