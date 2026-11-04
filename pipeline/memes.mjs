// Animated meme stickers from GIPHY (GIPHY_API_KEY): dancing cats, reactions,
// characters, as GIFs with a transparent background, for the builder to play
// with the kit's <Meme>. Without the key, no memes.
//
//   node pipeline/memes.mjs <slug> "<english search>"   # adds one sticker
//   node pipeline/memes.mjs <slug>                      # fetches listed stickers the folder lacks
//
// Stickers land in public/videos/<slug>/memes/ and are listed in facts.json
// under "memes". They are not committed: facts.json keeps each download link.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { readJson, slugify, writeJson } from "./lib.mjs";

const factsFile = (slug) => `src/videos/${slug}/facts.json`;
// Big GIFs slow the render down for little gain.
const MAX_BYTES = 12 * 1024 * 1024;

export const memesOn = () => Boolean(process.env.GIPHY_API_KEY);

const download = async (link, path) => {
  const res = await fetch(link, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`meme download ${res.status}`);
  mkdirSync(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
};

// Finds a sticker for the search, downloads it and lists it in facts.json.
export const addMeme = async (slug, query, scene = null) => {
  const facts = readJson(factsFile(slug));
  const list = facts.memes ?? [];
  const used = list.map((m) => m.id);
  const params = new URLSearchParams({ api_key: process.env.GIPHY_API_KEY, q: query, limit: "25", rating: "pg-13", lang: "en" });
  const res = await fetch(`https://api.giphy.com/v1/stickers/search?${params}`, { signal: AbortSignal.timeout(30_000) }).catch(() => null);
  if (!res?.ok) throw new Error(`GIPHY search: ${res?.status ?? "no answer"}`);
  const hit = ((await res.json()).data ?? []).find((s) => {
    const o = s.images?.original;
    return o?.url && !used.includes(`giphy-${s.id}`) && Number(o.size) <= MAX_BYTES && Number(o.frames) > 1;
  });
  if (!hit) return null;
  const o = hit.images.original;
  const file = `memes/${slugify(query).slice(0, 40) || "meme"}-giphy-${hit.id}.gif`;
  const link = o.url.split("?")[0];
  await download(link, `public/videos/${slug}/${file}`);
  const entry = {
    scene,
    query,
    file,
    id: `giphy-${hit.id}`,
    title: hit.title ?? "",
    page: hit.url,
    author: hit.username || null,
    width: Number(o.width),
    height: Number(o.height),
    frames: Number(o.frames),
    link,
  };
  writeJson(factsFile(slug), { ...facts, memes: [...list, entry] });
  return entry;
};

// Downloads the stickers facts.json lists that are not on disk (a fresh checkout).
export const restoreMemes = async (slug) => {
  for (const meme of readJson(factsFile(slug), {}).memes ?? []) {
    const path = `public/videos/${slug}/${meme.file}`;
    if (!existsSync(path)) await download(meme.link, path).catch((err) => console.log(`${meme.file}: ${err.message}`));
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [slug, ...words] = process.argv.slice(2);
  if (!/^[a-z0-9-]+$/.test(slug ?? "") || !existsSync(factsFile(slug))) {
    throw new Error(`usage: node pipeline/memes.mjs <slug> ["<english search>"]`);
  }
  if (!words.length) {
    await restoreMemes(slug);
  } else if (!memesOn()) {
    console.log("No GIPHY_API_KEY: memes are off for this run.");
  } else {
    const entry = await addMeme(slug, words.join(" ").slice(0, 100));
    console.log(entry ? JSON.stringify(entry, null, 2) : "No animated sticker found; try other, simpler words.");
  }
}
