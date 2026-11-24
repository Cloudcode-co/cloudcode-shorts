import { beatmap } from "../../kit";
import beatmapJson from "./beatmap.json";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";
import { SLUG } from "./theme";

export const MAP = beatmap(beatmapJson);

export const IDS = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
] as const;

export type SceneId = (typeof IDS)[number];

export const VO = durations as Record<SceneId, number>;

export const BASE = IDS.map((id) => Math.round(timeline.scenes[id].length * 60));
export const STARTS = BASE.map((_, i) => BASE.slice(0, i).reduce((a, b) => a + b, 0));

export const ONLOOK = facts.repos.find((r) => r.repo === "onlook-dev/onlook") ?? facts.repos[0];
export const BUILDER = facts.repos.find((r) => r.repo === "BuilderIO/builder") ?? facts.repos[1];

export type Clip = { file: string; duration: number };

const clip = (needle: string): Clip => {
  const found = facts.footage.find((f) => f.file.includes(needle));
  if (!found) throw new Error(`missing footage: ${needle}`);
  return found;
};

export const CLIP = {
  editor: clip("code-editor-screen-programming"),
  cloud: clip("cloud-data-center"),
  glasses: clip("laptop-screen-code-close-up"),
  devcode: clip("software-developer-coding-laptop"),
  deskcode: clip("programmer-working-at-desk"),
  tablet: clip("designer-using-tablet"),
  code: clip("programmer-code-on-computer-screen"),
  hands: clip("hands-typing-on-sleek-keyboard"),
  brain: clip("artificial-intelligence-ai-technology"),
  rack: clip("network-cables-server-rack"),
  designer: clip("designer-working-laptop"),
  mac: clip("laptop-computer-desk-workspace"),
  macbook: clip("macbook-laptop-on-desk"),
  smile: clip("smiling-developer-working-laptop"),
};

export const scene = (id: SceneId) => {
  const found = script.scenes.find((s) => s.id === id);
  if (!found) throw new Error(`missing scene: ${id}`);
  return found;
};

export { SLUG };
