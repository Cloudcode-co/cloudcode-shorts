import type { CSSProperties } from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";

// A continuous zoom onto one place from satellite tiles fetched by
// `npm run satellite` (facts.json `satellite`: lat, lon, from, to, credit).
// `zoom` is a Web Mercator zoom level, fractional; drive it with
// interpolate() or altitudeZoom() for a fall. Keep it within from..to: below
// `from` the edges are empty, above `to` the picture only enlarges.
// The tile ranges must match pipeline/satellite.mjs.
const HALF_W = 540 + 384;
const HALF_H = 960 + 384;

const worldPixel = (lat: number, lon: number, z: number) => {
  const size = 256 * 2 ** z;
  const r = (lat * Math.PI) / 180;
  return [((lon + 180) / 360) * size, ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * size];
};

// The zoom level whose ground fills a portrait frame as seen from `meters`
// up, looking straight down with a 60° view.
export const altitudeZoom = (meters: number, lat: number, frameHeight = 1920) =>
  Math.log2((156543.03 * Math.cos((lat * Math.PI) / 180) * frameHeight) / (2 * Math.max(1, meters) * Math.tan(Math.PI / 6)));

const Level: React.FC<{ slug: string; lat: number; lon: number; level: number; zoom: number; width: number; height: number }> = ({
  slug,
  lat,
  lon,
  level,
  zoom,
  width,
  height,
}) => {
  const scale = 2 ** (zoom - level);
  const [cx, cy] = worldPixel(lat, lon, level);
  const n = 2 ** level;
  const size = 256 * scale;
  const tiles: { x: number; y: number; left: number; top: number }[] = [];
  for (let y = Math.floor((cy - HALF_H) / 256); y <= Math.floor((cy + HALF_H) / 256); y++) {
    if (y < 0 || y >= n) continue;
    for (let x = Math.floor((cx - HALF_W) / 256); x <= Math.floor((cx + HALF_W) / 256); x++) {
      const left = (x * 256 - cx) * scale + width / 2;
      const top = (y * 256 - cy) * scale + height / 2;
      if (left > width || top > height || left + size < 0 || top + size < 0) continue;
      tiles.push({ x, y, left, top });
    }
  }
  return (
    <>
      {tiles.map((t) => (
        <Img
          key={`${level}-${t.x}-${t.y}`}
          src={staticFile(`videos/${slug}/satellite/${level}/${((t.x % n) + n) % n}_${t.y}.jpg`)}
          // A tile the source lacks stays empty instead of failing the render.
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
          style={{
            position: "absolute",
            left: t.left,
            top: t.top,
            // Half a pixel of overlap hides the seams between tiles.
            width: size + 0.5,
            height: size + 0.5,
          }}
        />
      ))}
    </>
  );
};

export const SatelliteZoom: React.FC<{
  slug: string;
  lat: number;
  lon: number;
  from: number;
  to: number;
  zoom: number;
  style?: CSSProperties;
}> = ({ slug, lat, lon, from, to, zoom, style }) => {
  const { width, height } = useVideoConfig();
  const level = Math.min(to, Math.max(from, Math.floor(zoom)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0b1220", ...style }}>
      {/* The level below fills gaps while the sharper one loads or lacks a tile. */}
      {level > from && <Level slug={slug} lat={lat} lon={lon} level={level - 1} zoom={zoom} width={width} height={height} />}
      <Level slug={slug} lat={lat} lon={lon} level={level} zoom={zoom} width={width} height={height} />
    </AbsoluteFill>
  );
};
