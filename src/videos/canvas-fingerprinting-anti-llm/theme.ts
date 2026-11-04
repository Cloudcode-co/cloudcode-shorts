import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadLora } from "@remotion/google-fonts/Lora";
import { mono, sans, SAFE, SIDE_CROP, easeOut } from "../../kit";

// Documentary Serif fonts loaded with Vietnamese subset
export const serifDisplay = loadPlayfair("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const serifCaption = loadLora("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export { mono, sans, SAFE, SIDE_CROP, easeOut };

export const PALETTE = {
  black: "#000000",
  bgDark: "#08090C",
  cardBg: "rgba(13, 17, 23, 0.88)",
  cardBorder: "rgba(255, 255, 255, 0.12)",
  textPrimary: "#FFFFFF",
  textMuted: "#94A3B8",
  amber: "#E5A93C",
  amberBorder: "rgba(229, 169, 60, 0.4)",
  red: "#FF453A",
  redBg: "rgba(255, 69, 58, 0.16)",
  green: "#30D158",
  greenBg: "rgba(48, 209, 88, 0.16)",
};
