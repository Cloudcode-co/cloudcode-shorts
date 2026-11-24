import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Easing, interpolate } from "remotion";
import { SAFE } from "../../kit/theme";

// Terminal phosphor amber against an editor's dark glass. The project's own
// logo is black on white, so the single accent comes from the CRT the whole
// video is framed in; green is reserved for success checks only.
export const C = {
  bg: "#060909",
  panel: "#0C1111",
  bar: "#101717",
  line: "#1E2A27",
  lineSoft: "#17211F",
  text: "#E9EDE7",
  white: "#F5F7F2",
  muted: "#8A9892",
  dim: "#5A6863",
  accent: "#FFB62E",
  accentSoft: "#6E4E12",
  green: "#57D68F",
};

// JetBrains Mono with the Vietnamese subset, so terminal copy keeps its
// diacritics instead of falling back to another face.
export const mono = loadMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export { SAFE };
export { sans } from "../../kit/theme";

export const CONTENT_W = 1080 - SAFE.left - SAFE.right;
export const WIN_INNER = CONTENT_W - 52;

export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// 0 → 1 from `start`, with the kit's strong ease-out.
export const appear = (f: number, start: number, dur = 12) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

// One-off accent hit. Never call interpolate with a high first value without
// gating on the frame, or it paints every earlier frame.
export const bloom = (f: number, start: number, dur = 7) =>
  f < start
    ? 0
    : interpolate(f - start, [0, dur], [0.3, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

export const blink = (f: number) => Math.floor(f / 16) % 2 === 0;

export const LENS = [330, 609, 574, 719, 709, 656, 560, 753, 660];
export const TOTAL = LENS.reduce((sum, n) => sum + n, 0);
export const STARTS = LENS.map((_, i) => LENS.slice(0, i).reduce((a, b) => a + b, 0));
