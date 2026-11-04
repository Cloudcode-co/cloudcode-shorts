// Real stock footage of people and places for the builder to play in a scene,
// from Pixabay (PIXABAY_API_KEY) or Pexels (PEXELS_API_KEY), both free to use
// without attribution. Without either key, no footage.
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

export const footageOn = () => Boolean(process.env.PIXABAY_API_KEY || process.env.PEXELS_API_KEY);

const get = async (name, url, headers = {}) => {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) }).catch(() => null);
  if (res?.ok) return res.json();
  console.log(`${name} search: ${res?.status ?? "no answer"}`);
  return null;
};

// Each source returns its clips best first, as
// { id, page, author, duration, width, height, link }.
const sources = {
  // Mostly landscape; portrait clips first, then the 1080p rendition of the
  // rest (the builder crops it to the frame).
  pixabay: async (query, key) => {
    const data = await get(
      "Pixabay",
      `https://pixabay.com/api/videos/?key=${key}&q=${encodeURIComponent(query)}&safesearch=true&per_page=20`,
    );
    const clips = (data?.hits ?? []).map((h) => {
      const file = [h.videos?.large, h.videos?.medium]
        .filter((v) => v?.url && Math.min(v.width, v.height) >= 1080 && Math.max(v.width, v.height) <= 2560)
        .sort((a, b) => b.height - a.height)[0];
      return file && {
        id: `pixabay-${h.id}`,
        page: h.pageURL,
        author: h.user ?? null,
        duration: h.duration,
        width: file.width,
        height: file.height,
        link: file.url,
      };
    });
    return clips.filter(Boolean).sort((a, b) => (b.height > b.width) - (a.height > a.width));
  },
  pexels: async (query, key) => {
    const data = await get(
      "Pexels",
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&orientation=portrait&size=medium&per_page=10`,
      { Authorization: key },
    );
    return (data?.videos ?? []).flatMap((v) => {
      // The portrait MP4 closest to 1080×1920.
      const file = (v.video_files ?? [])
        .filter((x) => x.file_type === "video/mp4" && x.height > x.width && x.height >= 1280)
        .sort((a, b) => Math.abs(a.height - 1920) - Math.abs(b.height - 1920))[0];
      if (!file) return [];
      return [{ id: `pexels-${v.id}`, page: v.url, author: v.user?.name ?? null, duration: v.duration, width: file.width, height: file.height, link: file.link }];
    });
  },
};

export const searchFootage = async (query, skip = []) => {
  for (const [name, key] of [["pixabay", process.env.PIXABAY_API_KEY], ["pexels", process.env.PEXELS_API_KEY]]) {
    if (!key) continue;
    const clip = (await sources[name](query, key)).find((c) => !skip.includes(c.id) && c.duration >= 4);
    if (clip) return clip;
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
// A link that stopped working only costs that clip.
export const restoreFootage = async (slug) => {
  for (const clip of readJson(factsFile(slug), {}).footage ?? []) {
    const path = `public/videos/${slug}/${clip.file}`;
    if (!existsSync(path)) await download(clip.link, path).catch((err) => console.log(`${clip.file}: ${err.message}`));
  }
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [slug, ...words] = process.argv.slice(2);
  if (!/^[a-z0-9-]+$/.test(slug ?? "") || !existsSync(factsFile(slug))) {
    throw new Error(`usage: node pipeline/footage.mjs <slug> ["<english search>"]`);
  }
  if (!words.length) {
    await restoreFootage(slug);
  } else if (!footageOn()) {
    console.log("No PIXABAY_API_KEY or PEXELS_API_KEY: footage is off for this run.");
  } else {
    const entry = await addFootage(slug, words.join(" ").slice(0, 100));
    console.log(entry ? JSON.stringify(entry, null, 2) : "No portrait clip found; try other words.");
  }
}
