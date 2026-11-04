import { Gif } from "@remotion/gif";
import type { CSSProperties } from "react";
import { staticFile } from "remotion";

// An animated meme sticker (a GIF with a transparent background, from
// facts.json `memes`), looping in time with the video. `file` is its path under
// public/videos/<slug>/; size and place it with `style`.
export const Meme: React.FC<{
  slug: string;
  file: string;
  width: number;
  height: number;
  style?: CSSProperties;
  playbackRate?: number;
}> = ({ slug, file, width, height, style, playbackRate }) => (
  <div style={{ position: "absolute", aspectRatio: `${width} / ${height}`, ...style }}>
    <Gif
      src={staticFile(`videos/${slug}/${file}`)}
      fit="contain"
      loopBehavior="loop"
      playbackRate={playbackRate}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  </div>
);
