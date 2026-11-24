import { AbsoluteFill, Series } from "remotion";
import {
  Brand,
  Music,
  Sfx,
  TikTokGuide,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { SCENES, SLUG, TOTAL } from "./data";
import { Scene } from "./scenes/Skit";

// A silent meme skit: one place photo, one or two cats, one caption per line.
// Every scene is exactly its timeline length so the track's drop and quiet
// punchline land where the story turns.
const PiHoleHomelab: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <Series>
      {SCENES.map((spec, i) => (
        <Series.Sequence key={spec.id} name={spec.id} durationInFrames={spec.len}>
          <Scene spec={spec} />
          {i === 0 && <Brand />}
          {i === 0 && <Sfx id="thud" volume={0.35} />}
          {i === 0 && <Sfx id="pop" at={10} volume={0.25} />}
          {i === 1 && <Sfx id="whoosh" volume={0.3} />}
          {i === 1 && <Sfx id="pop" at={6} volume={0.25} />}
          {i === 1 && <Sfx id="ding" at={186} volume={0.3} />}
          {i === 1 && <Sfx id="thud" at={186} volume={0.3} />}
          {i === 2 && <Sfx id="whoosh" volume={0.3} />}
          {i === 2 && <Sfx id="thud" volume={0.35} />}
          {i === 2 && <Sfx id="pop" at={6} volume={0.22} />}
          {i === 2 && <Sfx id="pop" at={14} volume={0.22} />}
          {i === 3 && <Sfx id="whoosh" volume={0.3} />}
          {i === 3 && <Sfx id="pop" at={7} volume={0.25} />}
          {i === 4 && <Sfx id="whoosh" volume={0.3} />}
          {i === 4 && <Sfx id="thud" at={8} volume={0.35} />}
          {i === 4 && <Sfx id="pop" at={8} volume={0.2} />}
          {i === 4 && <Sfx id="thud" at={270} volume={0.28} />}
        </Series.Sequence>
      ))}
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={[]} level={0.55} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: PiHoleHomelab,
  durationInFrames: TOTAL,
};
