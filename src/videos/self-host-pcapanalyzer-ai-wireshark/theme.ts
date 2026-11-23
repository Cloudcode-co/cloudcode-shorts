import { videoAsset } from "../../kit";

export const SLUG = "self-host-pcapanalyzer-ai-wireshark";

// File under public/videos/<slug>/.
export const a = (path: string) => videoAsset(SLUG, path);

// Broadcast palette: navy paper, white ink, one red. The red is the patch
// cable in the rack picture and the alert state of a capture, not decoration.
export const C = {
  navy: "#071326",
  navyMid: "#0B2038",
  navyLight: "#123253",
  white: "#F3F7FC",
  muted: "#A9BBD2",
  red: "#E2232B",
  redDeep: "#A51118",
  paper: "#F6F8FC",
  ink: "#081426",
  rule: "rgba(243,247,252,0.28)",
};

// The deck's own chrome positions, inside TikTok's safe area.
export const FRAME = {
  top: 334,
  barW: 540,
  barH: 56,
  counterX: 648,
  counterY: 326,
  counterW: 232,
  contentTop: 556,
  contentBottom: 1100,
  lowerTop: 1126,
  tickerTop: 1366,
  tickerH: 74,
};
