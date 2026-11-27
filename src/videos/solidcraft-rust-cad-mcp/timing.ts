import { beatmap, snap, type BeatmapJson } from "../../kit";
import beats from "./beatmap.json";

// Frame lengths from timeline.json: Math.round(length * 60), in order.
// Every scene starts where the previous one ends, so the music stays locked.
export const LEN = {
  s1: 353,
  s2: 407,
  s3: 527,
  s4: 523,
  s5: 488,
  s6: 455,
  s7: 488,
  s8: 292,
  s9: 292,
  s10: 599,
  s11: 555,
} as const;

export type SceneId = keyof typeof LEN;

export const START: Record<SceneId, number> = {
  s1: 0,
  s2: 353,
  s3: 760,
  s4: 1287,
  s5: 1810,
  s6: 2298,
  s7: 2753,
  s8: 3241,
  s9: 3533,
  s10: 3825,
  s11: 4424,
};

export const TOTAL = 4979;

const MAP = beatmap(beats as BeatmapJson);

const local = (id: SceneId, marks: number[]) =>
  marks.map((m) => m - START[id]).filter((m) => m >= 0);

// Snap a moment inside a scene to the nearest beat of the whole track.
export const onBeat = (id: SceneId, frame: number) => {
  const marks = local(id, MAP.beats);
  return marks.length ? snap(marks, frame) : frame;
};

// Same, on the downbeats (the one of each bar) for a bigger change.
export const onBar = (id: SceneId, frame: number) => {
  const marks = local(id, MAP.downbeats);
  return marks.length ? snap(marks, frame) : frame;
};

export const BEAT = MAP.period;
export const DROP = MAP.drops[0] ?? 0;
