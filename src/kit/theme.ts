import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadSans } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import type { CSSProperties } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

export const display = loadDisplay("normal", {
  weights: ["600", "800"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const sans = loadSans("normal", {
  weights: ["500", "700"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const mono = loadMono("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
}).fontFamily;

// Phones taller than 9:16 (most iPhones) scale the video to fill the width
// and crop this much off each side, measured from a real iPhone screenshot.
export const SIDE_CROP = 53;

// Areas TikTok covers with its own UI on a 1080×1920 video, or crops away.
export const SAFE = {
  top: 250, // Following / For You tabs, or the search bar (down to y≈224)
  bottom: 480, // username, caption, sound, nav bar
  left: SIDE_CROP + 50,
  right: 200, // avatar + follow, like, comment, save, share (from x≈900)
};
export const CONTENT_W = 1080 - SAFE.left - SAFE.right;

export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// 0 → 1 over `dur` frames with a strong ease-out, starting at `delay`.
export const useIn = (delay = 0, dur = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
};

export const enter = (p: number, dy = 24): CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dy}px)`,
});
