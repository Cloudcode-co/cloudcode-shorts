import { AbsoluteFill, Series } from "remotion";
import { Music, Shot, Sfx, TikTokGuide, Voice, fit, FPS, type VideoDef, type VideoProps } from "../../kit";
import VO from "./durations.json";
import { C, SLUG } from "./chat";
import { SCENES } from "./scenes";

const IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"] as const;
const LENS = IDS.map((id) => fit(VO[id], 300));
const TOTAL = LENS.reduce((a, b) => a + b, 0);

const RANGES: [number, number][] = (() => {
  let at = 0;
  return IDS.map((id, i) => {
    const r: [number, number] = [at, at + Math.round(VO[id] * FPS)];
    at += LENS[i];
    return r;
  });
})();

const Handy: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <Series>
      {IDS.map((id, i) => {
        const Scene = SCENES[i];
        return (
          <Series.Sequence key={id} name={id} durationInFrames={LENS[i]}>
            <Shot bg={C.bg} len={LENS[i]} style={{ padding: 0 }}>
              <Scene />
            </Shot>
            <Voice slug={SLUG} id={id} />
            <Sfx id="whoosh" volume={0.25} />
          </Series.Sequence>
        );
      })}
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Handy, durationInFrames: TOTAL };
