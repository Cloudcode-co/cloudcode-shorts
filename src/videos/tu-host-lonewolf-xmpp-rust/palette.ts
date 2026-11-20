import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { videoAsset } from "../../kit";

export const SLUG = "tu-host-lonewolf-xmpp-rust";

// File under public/videos/tu-host-lonewolf-xmpp-rust/.
export const a = (path: string) => videoAsset(SLUG, path);

// Broadcast grotesk for everything, a mono for machines (terminal, config,
// ticker). Both carry the Vietnamese subset. The kit's own fonts stay unused
// here so the bulletin has one voice.
export const F = {
  sans: loadArchivo("normal", {
    weights: ["600", "700", "800", "900"],
    subsets: ["latin", "vietnamese"],
  }).fontFamily,
  mono: loadMono("normal", {
    weights: ["500", "700"],
    subsets: ["latin", "vietnamese"],
  }).fontFamily,
};

// News desk: deep navy, paper white, one breaking-news red. The subject's
// avatars (teal wolf, blue/orange Prosody, salmon pixel face) stay inside
// their cards and do not tint the frame.
export const C = {
  ink: "#030C18",
  navy: "#071A2E",
  panel: "#0A2039",
  white: "#FFFFFF",
  paper: "#F5F8FC",
  red: "#E6212B",
  dim: "#A9BBD1",
  onPaper: "#0B2239",
  onPaperDim: "#4A5D75",
};

// Safe-area geometry from the kit, in whole-frame pixels.
export const SL = 103; // SAFE.left
export const SW = 777; // 1080 - SAFE.left - SAFE.right
export const BAR_TOP = 250; // SAFE.top
export const BAR_H = 76;
export const STAGE_TOP = 372; // first row of content under the bar
export const TICKER_TOP = 1330;
export const TICKER_H = 76;

// 4.944, not 4,944: the channel writes numbers the Vietnamese way.
export const stars = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
