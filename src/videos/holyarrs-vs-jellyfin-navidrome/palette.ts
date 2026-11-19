import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { Easing, spring } from "remotion";

export const SLUG = "holyarrs-vs-jellyfin-navidrome";

// Lifted from the three avatars the video compares: HolyArrs' black diamond
// with its red spark, Jellyfin's violet-to-cyan, Navidrome's blue.
export const C = {
  paper: "#F2EEE7",
  paperDim: "#E8E1D6",
  ink: "#141110",
  ink2: "#1E1917",
  ink3: "#2A2421",
  coral: "#D2352A",
  coralSoft: "#E4655B",
  grey: "#8B8680",
  warmGrey: "#BDB5A9",
  white: "#FFFFFF",
  green: "#1E9E5A",
  greenBright: "#3DDC84",
  blue: "#1D6FE8",
  jelly: "#8B5CF6",
  cyan: "#22B8E6",
  navidrome: "#1E7BF0",
  yellow: "#FFD43B",
};

export const serif = loadSerif("italic", {
  weights: ["600"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

// Everything readable lives inside TikTok's safe area. Background footage and
// panels may bleed, text may not.
export const SL = 103;
export const SR = 880;
export const SW = SR - SL;
export const CX = (SL + SR) / 2;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);

export const land = (frame: number, start: number, fps: number) =>
  spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 170, mass: 0.9 } });
