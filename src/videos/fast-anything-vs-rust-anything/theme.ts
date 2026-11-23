import { loadFont } from "@remotion/google-fonts/Archivo";
import { videoAsset } from "../../kit";

export const SLUG = "fast-anything-vs-rust-anything";

// File under public/videos/<slug>/.
export const a = (path: string) => videoAsset(SLUG, path);

// One strong grotesk for the whole bulletin; JetBrains Mono stays for commands.
export const grotesk = loadFont("normal", {
  weights: ["500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

// Navy and white with one red accent, the way a broadcast desk sets it.
export const C = {
  navy: "#06152E",
  navyDeep: "#030D1C",
  navyMid: "#0A2142",
  navyLight: "#12335F",
  white: "#F4F8FE",
  steel: "#9DB2CF",
  steelDim: "#6F86A6",
  red: "#E1132B",
  redDeep: "#A80D1F",
};

// 1.971, 8.033 — Vietnamese thousands separator.
export const fmt = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
