import { FPS, beatmap, videoAsset, type ScriptScene } from "../../kit";
import beats from "./beatmap.json";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

export const SLUG = script.slug;

// File under public/videos/<slug>/.
export const a = (path: string) => videoAsset(SLUG, path);

// Broadcast navy, white, one red. Red is the only accent.
export const C = {
  deep: "#050E1E",
  navy: "#071A33",
  navy2: "#0C2546",
  red: "#E52831",
  white: "#FFFFFF",
  mist: "#A9BAD1",
  hair: "rgba(255,255,255,0.16)",
};

export const MAP = beatmap(beats);

export const SCENES = script.scenes as ScriptScene[];
export const IDS = SCENES.map((s) => s.id);

const tl = timeline.scenes as Record<string, { start: number }>;
export const STARTS = IDS.map((id) => Math.round(tl[id].start * FPS));
export const TOTAL = Math.round(timeline.total * FPS);
export const LENS = STARTS.map((s, i) =>
  (i + 1 < STARTS.length ? STARTS[i + 1] : TOTAL) - s,
);
export const DUR = durations as Record<string, number>;

// Three stories plus an outro: 1/3, 2/3, 3/3, sign-off.
export const STORY_STARTS = [STARTS[0], STARTS[3], STARTS[6], STARTS[9]];
export const STORY_OF = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3];
export const STORY_NAMES = ["Gộp gói thuê bao", "So với LiteLLM", "Tự host trên VPS"];

export const storyAt = (g: number) => {
  let s = 0;
  for (let i = 0; i < STORY_STARTS.length; i++) if (g >= STORY_STARTS[i]) s = i;
  return s;
};

// One full-frame picture per story, always darkened and slowly zooming.
export type Bg = { kind: "vid" | "img"; file: string; pos: string };
export const BGS: Bg[] = [
  {
    kind: "vid",
    file: "footage/frustrated-developer-night-coding-desk-pixabay-32767.mp4",
    pos: "35% 50%",
  },
  {
    kind: "img",
    file: "images/server-room-data-center-racks-blue-pixabay-197303.jpg",
    pos: "50% 42%",
  },
  {
    kind: "img",
    file: "images/data-center-server-racks-corridor-pixabay-838378.jpg",
    pos: "50% 48%",
  },
  {
    kind: "img",
    file: "images/developer-working-laptop-desk-smiling-pixabay-2583442.jpg",
    pos: "64% 46%",
  },
];

export type Repo = {
  repo: string;
  name: string;
  stars: number;
  avatar: string;
  language: string;
  license: string;
};
export const REPOS = facts.repos as Repo[];
export const repoOf = (name: string) =>
  REPOS.find((r) => r.name === name) as Repo;

export const stars = (n: number) => n.toLocaleString("vi-VN");
