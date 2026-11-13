import { loadFont as loadBarlowCondensed } from "@remotion/google-fonts/BarlowCondensed";
import { sans, mono, SAFE, CONTENT_W, FPS } from "../../kit";

// Bold condensed display font for top 5 countdown
export const condensed = loadBarlowCondensed("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export { sans, mono, SAFE, CONTENT_W, FPS };

export const SLUG = "omnidiff-linux-git-diff";

// 5 rank tiers with rising energy and brightness:
// #5 -> #4 -> #3 -> #2 -> #1 (Gold!)
export const RANK_THEMES = {
  5: {
    num: "5",
    label: "HẠNG 5",
    bg: "#0B111E",
    bgCard: "#131E33",
    border: "#1E2F4F",
    accent: "#60A5FA", // Electric cool blue
    accentGlow: "rgba(96, 165, 250, 0.25)",
    text: "#FFFFFF",
    subtext: "#94A3B8",
    watermarkColor: "rgba(96, 165, 250, 0.12)",
    gold: false,
  },
  4: {
    num: "4",
    label: "HẠNG 4",
    bg: "#081B20",
    bgCard: "#0D2E36",
    border: "#154A57",
    accent: "#2DD4BF", // Vivid teal
    accentGlow: "rgba(45, 212, 191, 0.3)",
    text: "#FFFFFF",
    subtext: "#99F6E4",
    watermarkColor: "rgba(45, 212, 191, 0.14)",
    gold: false,
  },
  3: {
    num: "3",
    label: "HẠNG 3",
    bg: "#121128",
    bgCard: "#1F1C45",
    border: "#312D6E",
    accent: "#A78BFA", // Vivid purple
    accentGlow: "rgba(167, 139, 250, 0.35)",
    text: "#FFFFFF",
    subtext: "#DDD6FE",
    watermarkColor: "rgba(167, 139, 250, 0.16)",
    gold: false,
  },
  2: {
    num: "2",
    label: "HẠNG 2",
    bg: "#1C0D1B",
    bgCard: "#31142F",
    border: "#541E50",
    accent: "#FB7185", // Neon rose coral
    accentGlow: "rgba(251, 113, 133, 0.4)",
    text: "#FFFFFF",
    subtext: "#FECDD3",
    watermarkColor: "rgba(251, 113, 133, 0.18)",
    gold: false,
  },
  1: {
    num: "1",
    label: "HẠNG 1",
    bg: "#1A1402",
    bgCard: "#2E2305",
    border: "#85650D",
    accent: "#FACC15", // Brilliant 24K Gold
    accentGlow: "rgba(250, 204, 21, 0.55)",
    text: "#FFFFFF",
    subtext: "#FEF08A",
    watermarkColor: "rgba(250, 204, 21, 0.25)",
    gold: true,
  },
} as const;

export type RankNumber = 1 | 2 | 3 | 4 | 5;
