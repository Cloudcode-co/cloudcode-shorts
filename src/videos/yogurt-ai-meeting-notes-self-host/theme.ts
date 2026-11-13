import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { loadFont as loadSans } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import type { CSSProperties } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SAFE, SIDE_CROP, CONTENT_W } from "../../kit/theme";

// Documentary Serif fonts loaded with Vietnamese subset
export const serifDisplay = loadPlayfair("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const serifCaption = loadLora("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const sans = loadSans("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const mono = loadMono("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
}).fontFamily;

export { SAFE, SIDE_CROP, CONTENT_W };

export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// Documentary palette based on dark room grading, paper stamps, and tech accents
export const PALETTE = {
  black: "#000000",
  bgDark: "#08090C",
  cardBg: "rgba(13, 17, 23, 0.88)",
  cardBorder: "rgba(255, 255, 255, 0.12)",
  textPrimary: "#FFFFFF",
  textSecondary: "#E2E8F0",
  textMuted: "#94A3B8",
  amber: "#E5A93C",
  amberBorder: "rgba(229, 169, 60, 0.4)",
  cyan: "#38BDF8",
  cyanBg: "rgba(56, 189, 248, 0.15)",
  red: "#FF453A",
  redBg: "rgba(255, 69, 58, 0.18)",
  green: "#30D158",
  greenBg: "rgba(48, 209, 88, 0.18)",
  purple: "#A855F7",
  purpleBg: "rgba(168, 85, 247, 0.18)",
};

export const useIn = (delay = 0, dur = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
};

export const enter = (p: number, dy = 20): CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dy}px)`,
});
