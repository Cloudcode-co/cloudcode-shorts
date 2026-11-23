import { FPS } from "../../kit";
import durationsJson from "./durations.json";
import timeline from "./timeline.json";

export const IDS = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
  "s11",
] as const;
export type SceneId = (typeof IDS)[number];

const T = timeline.scenes as Record<SceneId, { start: number; length: number }>;
export const VO = durationsJson as Record<SceneId, number>;

// Rounded from the timeline so every scene starts where the voice does.
export const START = IDS.map((id) => Math.round(T[id].start * FPS));
export const END = IDS.map((id) => Math.round((T[id].start + T[id].length) * FPS));
export const LEN = END.map((end, i) => end - START[i]);
export const TOTAL = END[END.length - 1];

// Broadcast wipes at the three story boundaries: they overlap the cut, so the
// scene before each one gets that many extra frames and still starts the next
// scene on its own timeline frame.
export const TRANSITION_AFTER: Partial<Record<SceneId, number>> = {
  s2: 12,
  s6: 12,
  s8: 12,
};

// Story 0 = the cold open, 1 = fast-anything, 2 = rust-anything, 3 = workflow.
export const STORY_START = [0, START[2], START[6], START[8]];
export const STORY_END = [START[2], START[6], START[8], TOTAL];

export const storyAt = (globalFrame: number) =>
  globalFrame < STORY_END[0] ? 0 : globalFrame < STORY_END[1] ? 1 : globalFrame < STORY_END[2] ? 2 : 3;

export const VOICE_RANGES: [number, number][] = IDS.map((id, i) => [
  START[i],
  START[i] + Math.round(VO[id] * FPS),
]);
