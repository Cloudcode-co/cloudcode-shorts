import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSans } from "@remotion/google-fonts/BeVietnamPro";
import { Easing } from "remotion";

// Cinematic serif for chapter titles and the italic subtitle; a technical mono
// for the live telemetry. Sans only for the small photo credit.
export const serif = loadPlayfair("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const serifItalic = loadPlayfair("italic", {
  weights: ["500", "600"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const mono = loadMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const sans = loadSans("normal", {
  weights: ["500", "600"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const SIDE_CROP = 53;

export const SAFE = {
  top: 250,
  bottom: 480,
  left: SIDE_CROP + 50,
  right: 200,
};

export const CONTENT_W = 1080 - SAFE.left - SAFE.right;
export const BRAND_SPACE = 84;

export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);
export const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);

export const INK = "#04070C";
export const WHITE = "#EEF4F7";
export const COLD = "#88DDFF";
export const COLD_DEEP = "#2E86C1";
export const AMBER = "#F2B36B";
export const WARM = "#FFD3A0";
export const RED = "#FF5140";
export const VIOLET = "#B9A2FF";
export const GREEN = "#7BE3B0";
export const STEEL = "#A9BECF";

export type Mood = "cold" | "green" | "warm" | "red" | "violet" | "amber" | "steel";

type MoodStyle = {
  accent: string;
  wash: string;
  filter: string;
  vignette: number;
};

export const MOODS: Record<Mood, MoodStyle> = {
  cold: {
    accent: COLD,
    wash: "linear-gradient(180deg, rgba(42,124,196,0.24) 0%, rgba(6,18,34,0.30) 52%, rgba(2,6,12,0.66) 100%)",
    filter: "saturate(0.86) contrast(1.08) brightness(0.82)",
    vignette: 0.9,
  },
  green: {
    accent: GREEN,
    wash: "linear-gradient(180deg, rgba(12,104,84,0.20) 0%, rgba(4,18,14,0.32) 52%, rgba(2,7,5,0.68) 100%)",
    filter: "saturate(0.88) contrast(1.06) brightness(0.8)",
    vignette: 0.88,
  },
  warm: {
    accent: AMBER,
    wash: "linear-gradient(180deg, rgba(146,82,32,0.18) 0%, rgba(30,14,5,0.32) 52%, rgba(9,4,2,0.7) 100%)",
    filter: "sepia(0.14) saturate(1.02) contrast(1.04) brightness(0.8)",
    vignette: 0.9,
  },
  red: {
    accent: RED,
    wash: "linear-gradient(180deg, rgba(148,18,8,0.22) 0%, rgba(38,4,1,0.38) 52%, rgba(11,1,0,0.74) 100%)",
    filter: "hue-rotate(140deg) saturate(1.45) contrast(1.16) brightness(0.7)",
    vignette: 1,
  },
  violet: {
    accent: VIOLET,
    wash: "linear-gradient(180deg, rgba(92,46,168,0.22) 0%, rgba(16,8,38,0.36) 52%, rgba(4,2,12,0.7) 100%)",
    filter: "saturate(1.12) hue-rotate(-8deg) contrast(1.05) brightness(0.8)",
    vignette: 0.94,
  },
  amber: {
    accent: AMBER,
    wash: "linear-gradient(180deg, rgba(132,82,24,0.16) 0%, rgba(24,16,7,0.36) 52%, rgba(7,5,3,0.7) 100%)",
    filter: "sepia(0.1) saturate(0.92) contrast(1.06) brightness(0.78)",
    vignette: 0.92,
  },
  steel: {
    accent: STEEL,
    wash: "linear-gradient(180deg, rgba(74,98,122,0.18) 0%, rgba(9,16,24,0.38) 52%, rgba(3,6,10,0.72) 100%)",
    filter: "saturate(0.45) contrast(1.06) brightness(0.8)",
    vignette: 0.92,
  },
};

// The mood of each shot, in whole-video frames. The waveform and chapter
// accents read the same table so the colour story stays coherent.
const MOOD_KEYS: [number, Mood][] = [
  [0, "cold"],
  [316, "green"],
  [624, "warm"],
  [843, "green"],
  [1009, "cold"],
  [1212, "cold"],
  [1402, "cold"],
  [1719, "warm"],
  [1925, "cold"],
  [2188, "steel"],
  [2318, "red"],
  [2580, "warm"],
  [2720, "violet"],
  [2786, "violet"],
  [2853, "violet"],
  [2984, "cold"],
  [3115, "violet"],
  [3247, "amber"],
  [3508, "steel"],
  [3639, "amber"],
  [3770, "green"],
  [4256, "warm"],
  [4428, "cold"],
  [4559, "warm"],
  [4720, "warm"],
];

export const moodAt = (f: number): Mood => {
  let mood: Mood = MOOD_KEYS[0][1];
  for (const [at, m] of MOOD_KEYS) {
    if (f >= at) mood = m;
  }
  return mood;
};

export const moodStyle = (f: number) => MOODS[moodAt(f)];

// A slow, layered hand-held shake. `amp` in px; the smallest values read as a
// camera operator breathing, the largest as a machine under load.
export const getShake = (frame: number, amp: number) => {
  if (amp <= 0) return { x: 0, y: 0, rot: 0 };
  const x = (Math.sin(frame * 0.47) + 0.45 * Math.sin(frame * 1.13 + 0.8)) * amp;
  const y = (Math.cos(frame * 0.61) + 0.45 * Math.sin(frame * 0.97 + 1.9)) * amp;
  const rot = Math.sin(frame * 0.37 + 0.4) * amp * 0.018;
  return { x, y, rot };
};

export const impulse = (frame: number, at: number, power: number, decay = 14) => {
  if (frame < at) return 0;
  return power * Math.max(0, 1 - (frame - at) / decay);
};

export const formatNumber = (n: number) =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Smooth linear read of a [frame, value] table. No easing on purpose: the
// digits update every frame, so a linear slope reads as a steady machine.
export const readCounter = (frame: number, keys: [number, number][]) => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (frame <= f1) {
      const t = f1 === f0 ? 1 : (frame - f0) / (f1 - f0);
      return v0 + (v1 - v0) * t;
    }
  }
  return keys[keys.length - 1][1];
};
