// Every video is 1080×1920 at 60fps.
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Seconds of air after a voice line before the shot cuts.
export const BREATH = 0.9;

// Frames a shot needs: its voice line plus a breath, but never less than
// `min`, the frames its own animation takes.
export const fit = (seconds: number, min: number) =>
  Math.max(min, Math.ceil((seconds + BREATH) * FPS));

export type VideoProps = { guide: boolean };

// What a video folder exports from Video.tsx as `video`; Root registers it.
export type VideoDef = {
  id: string;
  component: React.FC<VideoProps>;
  durationInFrames: number;
};
