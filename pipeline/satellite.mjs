// Satellite imagery around one place, for a continuous zoom from orbit to the
// ground (the kit's <SatelliteZoom>). Zoom 2–8 come from NASA's Blue Marble
// (GIBS, worldwide), zoom 9–16 from the USGS National Map's imagery (the United
// States only). Both are public domain; credit "NASA, USGS" on screen anyway.
//
//   node pipeline/satellite.mjs <slug> <lat> <lon> [from] [to]   # adds a place
//   node pipeline/satellite.mjs <slug>                           # fetches what facts.json lists
//
// Tiles land in public/videos/<slug>/satellite/<z>/<x>_<y>.jpg (not committed)
// and the place in facts.json under "satellite".
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { readJson, writeJson } from "./lib.mjs";

const factsFile = (slug) => `src/videos/${slug}/facts.json`;
const NASA_MAX = 8;
const MAX_ZOOM = 16;
const tileUrl = (z, x, y) =>
  z <= NASA_MAX
    ? `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/${z}/${y}/${x}.jpeg`
    : `https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/${z}/${y}/${x}`;

// Must match src/kit/SatelliteZoom.tsx: the tiles a 1080×1920 frame can show at
// each level, with room for the next level's scale (up to 2×) and some drift.
const HALF_W = 540 + 384;
const HALF_H = 960 + 384;

// The place in Web Mercator pixels at zoom z.
export const worldPixel = (lat, lon, z) => {
  const size = 256 * 2 ** z;
  const r = (lat * Math.PI) / 180;
  return [((lon + 180) / 360) * size, ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * size];
};

export const tilesFor = (lat, lon, z) => {
  const [cx, cy] = worldPixel(lat, lon, z);
  const n = 2 ** z;
  const out = [];
  for (let y = Math.floor((cy - HALF_H) / 256); y <= Math.floor((cy + HALF_H) / 256); y++) {
    if (y < 0 || y >= n) continue;
    for (let x = Math.floor((cx - HALF_W) / 256); x <= Math.floor((cx + HALF_W) / 256); x++) {
      out.push({ z, x: ((x % n) + n) % n, y });
    }
  }
  return out;
};

// The USGS imagery covers the United States (with Alaska and Hawaii).
const inUs = (lat, lon) =>
  (lat > 24 && lat < 50 && lon > -125 && lon < -66) || (lat > 51 && lat < 72 && lon > -170 && lon < -129) || (lat > 18 && lat < 23 && lon > -161 && lon < -154);

const fetchTiles = async (slug, tiles) => {
  let missing = 0;
  const queue = tiles.filter((t) => !existsSync(`public/videos/${slug}/satellite/${t.z}/${t.x}_${t.y}.jpg`));
  const worker = async () => {
    for (let t = queue.shift(); t; t = queue.shift()) {
      const res = await fetch(tileUrl(t.z, t.x, t.y), { signal: AbortSignal.timeout(30_000) }).catch(() => null);
      if (!res?.ok || !(res.headers.get("content-type") ?? "").startsWith("image/")) {
        missing++;
        continue;
      }
      mkdirSync(`public/videos/${slug}/satellite/${t.z}`, { recursive: true });
      writeFileSync(`public/videos/${slug}/satellite/${t.z}/${t.x}_${t.y}.jpg`, Buffer.from(await res.arrayBuffer()));
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  return missing;
};

// Downloads the zoom levels from..to around the place and lists it in facts.json.
export const addSatellite = async (slug, lat, lon, from = 3, to = 15) => {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 85) throw new Error("satellite: bad lat/lon");
  from = Math.max(2, Math.round(from));
  to = Math.min(inUs(lat, lon) ? MAX_ZOOM : NASA_MAX, Math.round(to));
  if (to < from) throw new Error("satellite: nothing to fetch at that zoom");
  const tiles = [];
  for (let z = from; z <= to; z++) tiles.push(...tilesFor(lat, lon, z));
  const missing = await fetchTiles(slug, tiles);
  const entry = { lat, lon, from, to, credit: to > NASA_MAX ? "NASA, USGS" : "NASA" };
  const facts = readJson(factsFile(slug));
  facts.satellite = entry;
  writeJson(factsFile(slug), facts);
  return { ...entry, tiles: tiles.length, missing };
};

export const restoreSatellite = async (slug) => {
  const s = readJson(factsFile(slug), {}).satellite;
  if (s) await addSatellite(slug, s.lat, s.lon, s.from, s.to);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [slug, lat, lon, from, to] = process.argv.slice(2);
  if (!slug || !existsSync(factsFile(slug))) throw new Error("usage: satellite.mjs <slug> [lat lon [from] [to]]");
  if (lat === undefined) await restoreSatellite(slug);
  else console.log(JSON.stringify(await addSatellite(slug, Number(lat), Number(lon), Number(from ?? 3), Number(to ?? 15))));
}
