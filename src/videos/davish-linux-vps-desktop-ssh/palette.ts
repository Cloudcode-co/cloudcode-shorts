import { loadFont as loadSerif } from "@remotion/google-fonts/CormorantGaramond";
import script from "./script.json";

export const SLUG = script.slug;

// Pulled from the project avatar — blue water rings, green body, red crest —
// and pushed into a night-simulation palette.
export const INK = "#04080F";
export const DEEP = "#07131F";
export const PANEL = "#081A26";
export const ICE = "#A6E9FF";
export const BLUE = "#43BEEB";
export const GREEN = "#8FC93A";
export const MINT = "#C6F45B";
export const AMBER = "#F2A65A";
export const RED = "#FF4234";
export const WHITE = "#F3F8FF";
export const MUTED = "rgba(226,241,255,0.56)";

// Cinematic subtitle: a narrow serif italic that carries Vietnamese diacritics.
export const serif = loadSerif("italic", {
  weights: ["500", "600"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export type Tone = "cold" | "warm" | "warning" | "dawn";
export const TONE: Record<Tone, { accent: string; glow: string; haze: string }> = {
  cold: { accent: ICE, glow: "#1B6C9E", haze: "rgba(30,120,170,0.22)" },
  warm: { accent: AMBER, glow: "#8A4A17", haze: "rgba(190,108,44,0.24)" },
  warning: { accent: RED, glow: "#7A1710", haze: "rgba(180,36,24,0.26)" },
  dawn: { accent: MINT, glow: "#8B5A1E", haze: "rgba(220,140,60,0.22)" },
};
