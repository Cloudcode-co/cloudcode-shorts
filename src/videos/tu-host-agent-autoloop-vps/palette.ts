import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { videoAsset } from "../../kit";

export const SLUG = "tu-host-agent-autoloop-vps";

// File under public/videos/tu-host-agent-autoloop-vps/.
export const a = (path: string) => videoAsset(SLUG, path);

// A literary screen serif for the lower thirds; the kit's sans and mono carry
// small metadata and the terminal.
export const serif = loadSerif("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

// Graded from the subject's own artwork: the avatar's charcoal sweater, warm
// grey ground and the muted lego amber, plus documentary paper white.
export const C = {
  black: "#08090A",
  ink: "#101214",
  terminal: "#15171A",
  paper: "#EFE9DD",
  dim: "#B7AD9D",
  amber: "#C79A4B",
  amberSoft: "#E0C48B",
  slate: "#7C8787",
};

export const REPO_NAME = "agent-autoloop";
export const REPO_FULL = "KKKKhazix / GitHub";
export const REPO_STARS = "6.348";
export const REPO_DATE = "23.11.2026";
export const REPO_LICENSE = "MIT · TypeScript";
