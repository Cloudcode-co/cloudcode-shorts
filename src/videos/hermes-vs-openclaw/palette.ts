import { videoAsset } from "../../kit";

export const SLUG = "hermes-vs-openclaw";

// File under public/videos/hermes-vs-openclaw/.
export const a = (path: string) => videoAsset(SLUG, path);

// Colours lifted from each project's own artwork.
export const C = {
  lobster: "#E3141E", // OpenClaw mascot
  gold: "#FFC800", // Hermes Agent pixel banner
  hermesInk: "#141414", // Hermes banner background
  sea: "#0B2540", // the "Claw" family tank
  white: "#FFFFFF",
  mist: "#B9C4D0",
};
