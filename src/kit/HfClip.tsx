import type { CSSProperties } from "react";
import { OffthreadVideo, staticFile } from "remotion";

// A clip rendered by HyperFrames from src/videos/<slug>/hf/<name>/index.html
// (`node scripts/hyperframes.mjs <slug> <name>` writes
// public/videos/<slug>/hf/<name>.mp4). It plays from the start of the Sequence
// it sits in, muted: the voice, music, captions and <Brand /> stay in Remotion,
// on top of it.
export const HfClip: React.FC<{
  slug: string;
  name: string;
  style?: CSSProperties;
  playbackRate?: number;
}> = ({ slug, name, style, playbackRate }) => (
  <OffthreadVideo
    muted
    src={staticFile(`videos/${slug}/hf/${name}.mp4`)}
    playbackRate={playbackRate}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }}
  />
);
