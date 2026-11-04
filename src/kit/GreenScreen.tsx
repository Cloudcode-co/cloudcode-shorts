import { useCallback, useRef, type CSSProperties } from "react";
import { OffthreadVideo } from "remotion";

// A green-screen clip (a meme cat, a dancer) with its green keyed out, to
// stand on any background. `width`/`height` set the keyed canvas: the clip's
// aspect ratio (from facts.json) at about 1080 px wide at most, since every
// pixel is keyed every frame. Size and place it on screen with `style`.
// `strength` widens the key for a darker or uneven green.
export const GreenScreen: React.FC<{
  src: string;
  width: number;
  height: number;
  style?: CSSProperties;
  trimBefore?: number;
  trimAfter?: number;
  playbackRate?: number;
  strength?: number;
}> = ({ src, width, height, style, trimBefore, trimAfter, playbackRate, strength = 1 }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      const ctx = canvas.current?.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(frame, 0, 0, width, height);
      const image = ctx.getImageData(0, 0, width, height);
      const d = image.data;
      // How much greener than its other channels a pixel is: clearly green is
      // see-through, a band below fades out, and the green spill on edges goes.
      const full = 70 / strength;
      const edge = 25 / strength;
      for (let i = 0; i < d.length; i += 4) {
        const other = Math.max(d[i], d[i + 2]);
        const excess = d[i + 1] - other;
        if (excess <= edge) continue;
        d[i + 3] = excess >= full ? 0 : Math.round((d[i + 3] * (full - excess)) / (full - edge));
        d[i + 1] = other;
      }
      ctx.putImageData(image, 0, 0);
    },
    [width, height, strength],
  );
  return (
    <div style={{ position: "absolute", aspectRatio: `${width} / ${height}`, ...style }}>
      <OffthreadVideo
        src={src}
        muted
        trimBefore={trimBefore}
        trimAfter={trimAfter}
        playbackRate={playbackRate}
        onVideoFrame={onVideoFrame}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0 }}
      />
      <canvas ref={canvas} width={width} height={height} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
};
