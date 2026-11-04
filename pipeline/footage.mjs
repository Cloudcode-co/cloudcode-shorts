// Real stock footage from Pexels (free to use, no attribution required):
// portrait clips of people and places for the builder to play in a scene.
// Needs PEXELS_API_KEY; without it, no footage.
//
//   node pipeline/footage.mjs <slug> "<english search>"   # adds one clip
//   node pipeline/footage.mjs <slug>                      # fetches listed clips the folder lacks
//
// Clips land in public/videos/<slug>/footage/ and are listed in facts.json
// under "footage". They are not committed: facts.json keeps each clip's
// download link, and the second form fetches them again.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { readJson, slugify, writeJson } from "./lib.mjs";

const factsFile = (slug) => `src/videos/${slug}/facts.json`;

// The portrait MP4 closest to 1080×1920 without going far above it.
const pickFile = (files) =>
  files
    .filter((f) => f.file_type === "video/mp4" && f.height > f.width && f.height >= 1280)
    .sort((a, b) => Math.abs(a.height - 1920) - Math.abs(b.height - 1920))[0];

export const searchFootage = async (query, skip = []) => {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  const url =
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}` +
    `&orientation=portrait&size=medium&per_page=10`;
  const res = await fetch(url, { headers: { Authorization: key }, signal: AbortSignal.timeout(30_000) }).catch(() => null);
  if (!res?.ok) {
    console.log(`Pexels search "${query}": ${res?.status ?? "no answer"}`);
    return null;
  }
  for (const v of (await res.json()).videos ?? []) {
    const file = pickFile(v.video_files ?? []);
    if (!file || skip.includes(v.id) || v.duration < 4) continue;
    return {
      id: v.id,
      page: v.url,
      author: v.user?.name ?? null,
      duration: v.duration,
      width: file.width,
      height: file.height,
      link: file.link,
    };
  }
  return null;
};

const download = async (link, path) => {
  const res = await fetch(link, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new Error(`footage download ${res.status}`);
  mkdirSync(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
};

// Finds a clip for the search, downloads it and lists it in facts.json.
export const addFootage = async (slug, query, scene = null) => {
  const facts = readJson(factsFile(slug));
  const list = facts.footage ?? [];
  const clip = await searchFootage(query, list.map((c) => c.id));
  if (!clip) return null;
  const file = `footage/${slugify(query).slice(0, 40) || "clip"}-${clip.id}.mp4`;
  await download(clip.link, `public/videos/${slug}/${file}`);
  const entry = { scene, query, file, ...clip };
  writeJson(factsFile(slug), { ...facts, footage: [...list, entry] });
  return entry;
};

// Downloads the clips facts.json lists that are not on disk (a fresh checkout).
export const restoreFootage = async (slug) => {
  for (const clip of readJson(factsFile(slug), {}).footage ?? []) {
    const path = `public/videos/${slug}/${clip.file}`;
    if (!existsSync(path)) await download(clip.link, path);
  }
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [slug, ...words] = process.argv.slice(2);
  if (!/^[a-z0-9-]+$/.test(slug ?? "") || !existsSync(factsFile(slug))) {
    throw new Error(`usage: node pipeline/footage.mjs <slug> ["<english search>"]`);
  }
  if (!words.length) {
    await restoreFootage(slug);
  } else if (!process.env.PEXELS_API_KEY) {
    console.log("No PEXELS_API_KEY: footage is off for this run.");
  } else {
    const entry = await addFootage(slug, words.join(" ").slice(0, 100));
    console.log(entry ? JSON.stringify(entry, null, 2) : "No portrait clip found; try other words.");
  }
}
