import { loadFont } from "@remotion/google-fonts/SairaCondensed";
import { videoAsset } from "../../kit";

export const SLUG = "llm-asm-linux-qwen-assembly";

// Every asset lives under public/videos/<slug>/.
export const asset = (path: string) => videoAsset(SLUG, path);

// Bold condensed type for the whole countdown; Vietnamese is covered.
export const cond = loadFont("normal", {
  weights: ["600", "900"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export type Rank = 1 | 2 | 3 | 4 | 5;

export type RankTheme = {
  bg: string;
  accent: string;
  ink: string;
  dim: string;
  line: string;
  panel: string;
};

// Dusk to gold: each rank a step brighter, #1 is the sunset the avatar was
// painted in. Colours pulled from alesha-pro's pixel sunset and the assembly
// subject: cold steel first, warm gold last.
export const RANKS: Record<Rank, RankTheme> = {
  5: {
    bg: "#070B12",
    accent: "#5E88AA",
    ink: "#E6EEF6",
    dim: "rgba(230,238,246,0.6)",
    line: "rgba(230,238,246,0.2)",
    panel: "rgba(4,7,11,0.84)",
  },
  4: {
    bg: "#0A0C16",
    accent: "#9682CC",
    ink: "#EEEAF9",
    dim: "rgba(238,234,249,0.62)",
    line: "rgba(238,234,249,0.2)",
    panel: "rgba(6,6,14,0.84)",
  },
  3: {
    bg: "#120D16",
    accent: "#D07294",
    ink: "#F7EBF1",
    dim: "rgba(247,235,241,0.64)",
    line: "rgba(247,235,241,0.2)",
    panel: "rgba(12,6,12,0.84)",
  },
  2: {
    bg: "#150E09",
    accent: "#F07C3A",
    ink: "#FCECDE",
    dim: "rgba(252,236,222,0.66)",
    line: "rgba(252,236,222,0.2)",
    panel: "rgba(13,8,4,0.84)",
  },
  1: {
    bg: "#170F03",
    accent: "#FFC44E",
    ink: "#FFF3D2",
    dim: "rgba(255,243,210,0.66)",
    line: "rgba(255,243,210,0.22)",
    panel: "rgba(16,10,2,0.86)",
  },
};

// Layout inside TikTok's safe area. The progress rail lives in the right
// gutter; the text column never reaches it.
export const X = 103;
export const CW = 690;
export const TOP = 250;
export const BOTTOM = 1440;
export const RAIL_X = 850;
