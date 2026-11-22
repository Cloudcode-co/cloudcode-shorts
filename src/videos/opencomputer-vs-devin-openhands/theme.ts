import { loadFont } from "@remotion/google-fonts/Baloo2";
import { Easing, interpolate } from "remotion";
import { videoAsset } from "../../kit";
import script from "./script.json";

export const SLUG = script.slug;

// Any file under public/videos/<slug>/.
export const a = (path: string) => videoAsset(SLUG, path);

// The quiz-show board face: rounded, heavy, Vietnamese-safe.
export const round = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

// Deep studio purple with gold, taken from the Digger/OpenComputer avatar
// (dark teal) and the OpenHands yellow artwork.
export const C = {
  bg: "#14082F",
  bgDeep: "#0E0524",
  floor: "#241052",
  panel: "#2B1268",
  panelDeep: "#1A0A45",
  console: "#1B0C46",
  gold: "#FFC94A",
  goldHot: "#FFE08A",
  cream: "#FFF4D8",
  btn: "#351A75",
  violet: "#7A5BC7",
  green: "#19C37D",
  greenBright: "#8BFFCB",
  red: "#FF4E64",
  redDeep: "#8E1730",
};

export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// 0 → 1 starting at `at`, strong ease-out, clamped both ends.
export const rise = (f: number, at: number, dur = 12) =>
  interpolate(f, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

// A headline's type size keeps long Vietnamese lines on two clean rows.
export const headingSize = (text: string) =>
  text.length > 27 ? 54 : text.length > 22 ? 60 : 68;
