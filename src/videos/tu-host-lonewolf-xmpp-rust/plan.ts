import { beatmap, easeOut, FPS, snap, type Beatmap } from "../../kit";
import beatsJson from "./beatmap.json";
import durationsJson from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";

export const MAP: Beatmap = beatmap(beatsJson);

const DUR = durationsJson as Record<string, number>;
const TL = timeline as { scenes: Record<string, { start: number; length: number }>; total: number };

export type SceneMeta = { id: string; start: number; len: number; voice: number };

// Scenes run back to back, each exactly its timeline length.
export const SCENES: SceneMeta[] = (() => {
  const out: SceneMeta[] = [];
  let at = 0;
  for (const s of script.scenes) {
    const len = Math.round((TL.scenes[s.id]?.length ?? 3) * FPS);
    out.push({ id: s.id, start: at, len, voice: Math.round((DUR[s.id] ?? 3) * FPS) });
    at += len;
  }
  return out;
})();

export const TOTAL = SCENES.reduce((n, s) => n + s.len, 0);

export const VOICE_RANGES: [number, number][] = SCENES.map((s) => [
  s.start,
  s.start + s.voice,
]);

export const byId = (id: string) => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`missing scene ${id}`);
  return s;
};

// Five long shots. Their cuts land on the music's section changes (hook,
// build, drop, outro); inside a shot the layout reframes in place.
export const SHOTS: { name: string; ids: string[] }[] = [
  { name: "Hook", ids: ["s1"] },
  { name: "Story 1", ids: ["s2"] },
  { name: "Story 2", ids: ["s3", "s4", "s5", "s6"] },
  { name: "Story 3", ids: ["s7", "s8"] },
  { name: "Outro", ids: ["s9", "s10"] },
];

export const shotLen = (ids: string[]) => ids.reduce((n, id) => n + byId(id).len, 0);

// Reveal frames are placed by the voice, then nudged onto the nearest beat
// (small items) or downbeat (a statement) when the music is close.
const near = (marks: number[], g: number, max: number) => {
  const m = snap(marks, g);
  return Math.abs(m - g) <= max ? m : g;
};

// Frame of `sec` after the scene's start, snapped to the beat grid.
export const at = (start: number, sec: number, kind: "beat" | "down" = "beat") => {
  const g = start + Math.round(sec * FPS);
  const marked = kind === "down" ? near(MAP.downbeats, g, 24) : near(MAP.beats, g, 13);
  return Math.max(3, marked - start);
};

export const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// 0 → 1 from frame `from`, eased out; the one entrance curve the video uses.
export const land = (f: number, from: number, dur = 12) => {
  if (f < from) return 0;
  const t = Math.min(1, (f - from) / dur);
  return easeOut(t);
};

export const sectionEnergy = (g: number) =>
  MAP.sections.find((s) => g >= s.from && g < s.to)?.energy ?? 0;
