// Plain kinetic-type build straight from script.json (pipeline fallback).
import { makeFallbackVideo, type RepoFact, type ScriptScene } from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";

export const video = makeFallbackVideo({
  slug: script.slug,
  scenes: script.scenes as ScriptScene[],
  durations,
  repos: facts.repos as RepoFact[],
  silent: ["meme", "chat"].includes((script as { format?: string }).format ?? ""),
});
