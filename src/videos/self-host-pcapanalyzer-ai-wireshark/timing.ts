import { FPS } from "../../kit";
import durations from "./durations.json";
import timeline from "./timeline.json";

// One scene = its timeline length, rounded to frames, in order.
const T = timeline.scenes as Record<string, { start: number; length: number }>;
const SCENE_IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

export const LEN = Object.fromEntries(
  SCENE_IDS.map((id) => [id, Math.round(T[id].length * FPS)]),
) as Record<SceneId, number>;

export const START = SCENE_IDS.reduce(
  (acc, id, i) => {
    const prev = i === 0 ? 0 : acc[SCENE_IDS[i - 1]] + LEN[SCENE_IDS[i - 1]];
    return { ...acc, [id]: prev };
  },
  {} as Record<SceneId, number>,
);

export const TOTAL = SCENE_IDS.reduce((sum, id) => sum + LEN[id], 0);

// Five visual shots grouped in three stories. The AI shot cuts on the drop
// (beatmap: 39.962 s) as shot C's last frame, 55 frames before s6 speaks, so
// the reveal lands on the music and the line follows it.
export const STORIES = [
  { id: 1, start: 0, len: START.s4 },
  { id: 2, start: START.s4, len: START.s9 - START.s4 },
  { id: 3, start: START.s9, len: TOTAL - START.s9 },
] as const;

export const SHOTS = {
  a: { start: 0, len: START.s3 },
  b: { start: START.s3, len: START.s4 - START.s3 },
  c: { start: START.s4, len: 2398 - START.s4 },
  d: { start: 2398, len: START.s9 - 2398 },
  e: { start: START.s9, len: TOTAL - START.s9 },
} as const;

// Drop measured from the track, and the two story wipes (centred on the cut).
export const DROP = 2398;
export const WIPE_LEN = 16;
export const WIPE_1 = START.s4 - WIPE_LEN / 2;
export const WIPE_2 = START.s9 - WIPE_LEN / 2;

const clip = (id: SceneId) => Math.round((durations as Record<string, number>)[id] * FPS);

// Frames where the narrator is talking, for ducking the music under the voice.
export const VOICE_RANGES: [number, number][] = SCENE_IDS.map((id) => [
  START[id],
  START[id] + clip(id),
]);

// The voice for s6 starts 55 frames into shot D; s5's clip ends on the drop.
export const VOICES: { id: SceneId; at: number; frames: number }[] = SCENE_IDS.map((id) => ({
  id,
  at: START[id],
  frames: clip(id) + 6,
}));

// Local frames at which s7 / s8 start inside shot D. s6 speaks 55 frames
// after the cut, on the drop.
export const D7 = START.s7 - SHOTS.d.start;
export const D8 = START.s8 - SHOTS.d.start;

// Local frames for story 1's second part and story 3's two later parts.
export const A2 = START.s2;
export const E2 = START.s10 - SHOTS.e.start;
export const E3 = START.s11 - SHOTS.e.start;
