import { videoAsset } from "../../kit";

export const SLUG = "unkernel-linux-webassembly";

// File under public/videos/unkernel-linux-webassembly/.
export const a = (path: string) => videoAsset(SLUG, path);

// Drawn from pithings' mint glyph on white: a phosphor console, not the usual
// near-black + acid-green. Deep pine panels, mint for what is live, amber for
// what is emulated or slow, red only for a hard requirement.
export const C = {
  bg: "#06110D",
  panel: "#0A1B15",
  raised: "#0F251C",
  line: "#1D3B2F",
  lineLit: "#2D5A46",
  text: "#E9F6EF",
  dim: "#7E9C8D",
  faint: "#4C6A5C",
  mint: "#5CF2B4",
  mintDim: "#2C7D5E",
  amber: "#FFB454",
  amberDim: "#7A5222",
  red: "#FF6B6B",
  redDim: "#743032",
  black: "#03100B",
};
