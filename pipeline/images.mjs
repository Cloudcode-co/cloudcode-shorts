// Free still images from Pixabay (PIXABAY_API_KEY) for the builder: stickers
// (PNG cut-outs with a transparent background: animals, people, objects) and
// plain photos (paper, textures, places). Free to use without attribution.
//
//   node pipeline/images.mjs <slug> "<english search>" --sticker   # adds a cut-out
//   node pipeline/images.mjs <slug> "<english search>"             # adds a photo
//   node pipeline/images.mjs <slug>                                # fetches listed images the folder lacks
//
// Images land in public/videos/<slug>/images/ and are listed in facts.json
// under "images". They are not committed: Pixabay's download links expire, so
// the last form asks Pixabay for each image again by its id.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { readJson, slugify, writeJson } from "./lib.mjs";

const factsFile = (slug) => `src/videos/${slug}/facts.json`;
const API = "https://pixabay.com/api/";

const search = async (params) => {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) throw new Error("No PIXABAY_API_KEY: images are off for this run.");
  const res = await fetch(`${API}?key=${key}&safesearch=true&${new URLSearchParams(params)}`, {
    signal: AbortSignal.timeout(30_000),
  }).catch(() => null);
  if (!res?.ok) throw new Error(`Pixabay image search: ${res?.status ?? "no answer"}`);
  return (await res.json()).hits ?? [];
};

const download = async (link, path) => {
  const res = await fetch(link, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`image download ${res.status}`);
  mkdirSync(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
};

// Finds an image for the search, downloads it and lists it in facts.json.
export const addImage = async (slug, query, { sticker = false, scene = null } = {}) => {
  const facts = readJson(factsFile(slug));
  const list = facts.images ?? [];
  const used = list.map((i) => i.id);
  const hits = await search({
    q: query,
    per_page: "30",
    ...(sticker ? { colors: "transparent" } : { image_type: "photo", orientation: "vertical" }),
  });
  // A sticker has to be a real cut-out (a PNG); a photo has to fill a phone screen.
  const hit = hits.find(
    (h) =>
      !used.includes(`pixabay-${h.id}`) &&
      (sticker ? /\.png$/i.test(h.largeImageURL) : h.imageHeight >= 1600),
  );
  if (!hit) return null;
  const ext = sticker ? "png" : "jpg";
  const file = `images/${slugify(query).slice(0, 40) || "image"}-pixabay-${hit.id}.${ext}`;
  await download(hit.largeImageURL, `public/videos/${slug}/${file}`);
  const scale = Math.min(1, 1280 / Math.max(hit.imageWidth, hit.imageHeight));
  const entry = {
    scene,
    query,
    file,
    sticker,
    id: `pixabay-${hit.id}`,
    page: hit.pageURL,
    author: hit.user ?? null,
    tags: hit.tags,
    width: Math.round(hit.imageWidth * scale),
    height: Math.round(hit.imageHeight * scale),
  };
  writeJson(factsFile(slug), { ...facts, images: [...list, entry] });
  return entry;
};

// Downloads the images facts.json lists that are not on disk (a fresh
// checkout), with fresh links. A missing image only costs that image.
export const restoreImages = async (slug) => {
  for (const image of readJson(factsFile(slug), {}).images ?? []) {
    const path = `public/videos/${slug}/${image.file}`;
    if (existsSync(path)) continue;
    try {
      const [hit] = await search({ id: image.id.replace(/^pixabay-/, "") });
      if (!hit) throw new Error("gone from Pixabay");
      await download(hit.largeImageURL, path);
    } catch (err) {
      console.log(`${image.file}: ${err.message}`);
    }
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const sticker = args.includes("--sticker");
  const [slug, ...words] = args.filter((a) => a !== "--sticker");
  if (!/^[a-z0-9-]+$/.test(slug ?? "") || !existsSync(factsFile(slug))) {
    throw new Error(`usage: node pipeline/images.mjs <slug> ["<english search>"] [--sticker]`);
  }
  if (!words.length) {
    await restoreImages(slug);
  } else {
    const entry = await addImage(slug, words.join(" ").slice(0, 100), { sticker });
    console.log(entry ? JSON.stringify(entry, null, 2) : "Nothing found; try other, simpler words.");
  }
}
