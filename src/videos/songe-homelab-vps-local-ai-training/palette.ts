import { loadFont } from "@remotion/google-fonts/Archivo";
import { videoAsset } from "../../kit";

export const SLUG = "songe-homelab-vps-local-ai-training";

// File under public/videos/songe-homelab-vps-local-ai-training/.
export const a = (path: string) => videoAsset(SLUG, path);

// Wide grotesk with Vietnamese coverage: headlines and running prose.
export const grotesk = loadFont("normal", {
  weights: ["500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

// Palette sampled from the two projects' own artwork: Songe's soft blue mark
// on its warm-white tile, Unsloth's emerald tile; then pushed into a steel
// console at night.
export const C = {
  bg: "#070A0D",
  panel: "#0C1117",
  well: "#080C11",
  line: "#1D2A36",
  lineHi: "#2E4354",
  text: "#E4EDF4",
  dim: "#8DA0B0",
  faint: "#536575",
  songe: "#4FC0E6",
  songeDim: "#1E5A70",
  unsloth: "#1FB98B",
  unslothDim: "#12564A",
  warn: "#F0A43C",
  alarm: "#E4574F",
  white: "#FFFFFF",
};
