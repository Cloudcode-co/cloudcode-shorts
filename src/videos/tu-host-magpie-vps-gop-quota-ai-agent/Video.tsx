import { AbsoluteFill, Series, interpolate, useCurrentFrame } from "remotion";
import {
  BRAND_SPACE,
  Brand,
  FPS,
  Music,
  SAFE,
  Sfx,
  TikTokGuide,
  Voice,
  sans,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { DUR, IDS, LENS, SLUG, STARTS, STORY_OF, TOTAL, storyAt } from "./data";
import { Backdrop, DeskHead, GraphicSweep, StoryWipe, TickerBar } from "./parts";
import { SceneBody } from "./scenes";

const HEADER = 160;
const BAR_H = 84;
const BOTTOM = SAFE.bottom + BAR_H + 18;

const SceneShot: React.FC<{ i: number }> = ({ i }) => {
  const storyStart = i === 0 || STORY_OF[i] !== STORY_OF[i - 1];
  const top = i === 9 ? SAFE.top : SAFE.top + (i === 0 ? BRAND_SPACE : 0) + HEADER;
  return (
    <AbsoluteFill
      style={{
        padding: `${top}px ${SAFE.right}px ${BOTTOM}px ${SAFE.left}px`,
        display: "flex",
        flexDirection: "column",
        fontFamily: sans,
      }}
    >
      <SceneBody i={i} />
      <Voice slug={SLUG} id={IDS[i]} />
      {!storyStart && <GraphicSweep />}
      {!storyStart && <Sfx id="whoosh" volume={0.2} />}
    </AbsoluteFill>
  );
};

const voiceRanges: [number, number][] = IDS.map((id, i) => [
  STARTS[i],
  STARTS[i] + Math.round(DUR[id] * FPS),
]);

const MagpieVideo: React.FC<VideoProps> = ({ guide }) => {
  const g = useCurrentFrame();
  const story = storyAt(g);
  const brandP = interpolate(g, [246, 268], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#050E1E" }}>
      <Backdrop story={story} g={g} />
      <Series>
        {IDS.map((id, i) => (
          <Series.Sequence key={id} name={id} durationInFrames={LENS[i]}>
            <SceneShot i={i} />
          </Series.Sequence>
        ))}
      </Series>
      <DeskHead g={g} />
      <TickerBar g={g} />
      <StoryWipe g={g} />
      {g < 272 && (
        <div style={{ opacity: brandP }}>
          <Brand />
        </div>
      )}
      <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
      <Sfx id="whoosh" at={STARTS[3] - 8} volume={0.32} />
      <Sfx id="whoosh" at={STARTS[6] - 8} volume={0.34} />
      <Sfx id="whoosh" at={STARTS[9] - 8} volume={0.3} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: MagpieVideo,
  durationInFrames: TOTAL,
};
