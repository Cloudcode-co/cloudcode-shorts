import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSans } from "@remotion/google-fonts/BeVietnamPro";
import { Easing } from "remotion";

export const serifItalic = loadLora("italic", {
  weights: ["500", "600", "700"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const mono = loadMono("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin"],
}).fontFamily;

export const sans = loadSans("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const SIDE_CROP = 53;

export const SAFE = {
  top: 250,
  bottom: 480,
  left: SIDE_CROP + 50,
  right: 200,
};

export const BRAND_SPACE = 84;

export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// Fast camera shake generator
export const getCameraShake = (frame: number, intensity: number) => {
  if (intensity <= 0) return { x: 0, y: 0, rot: 0 };
  const x = (Math.sin(frame * 0.45) * 0.65 + Math.cos(frame * 0.95) * 0.35) * intensity;
  const y = (Math.cos(frame * 0.55) * 0.65 + Math.sin(frame * 0.85) * 0.35) * intensity;
  const rot = Math.sin(frame * 0.3) * (intensity * 0.05);
  return { x, y, rot };
};
