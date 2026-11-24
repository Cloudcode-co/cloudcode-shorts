import { TransitionSeries, linearTiming } from "@remotion/transitions";
import type { FC } from "react";
import { AbsoluteFill } from "remotion";
import {
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { BASE, IDS, SLUG, STARTS, VO } from "./data";
import { Ticker, newsWipe } from "./parts";
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, type SceneProps } from "./scenes";
import { C } from "./theme";

const SCENES: FC<SceneProps>[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

// Wipes are short; the chapter changes get a slightly longer one.
const PADS = BASE.map((_, i) => {
  if (i >= BASE.length - 1) return 0;
  return i === 1 || i === 7 ? 14 : 10;
});
const LENS = BASE.map((n, i) => n + PADS[i]);
const TOTAL = BASE.reduce((a, b) => a + b, 0);

const VOICE: [number, number][] = IDS.map((id, i) => [
  STARTS[i],
  STARTS[i] + Math.round(VO[id] * 60),
]);

const Comp: FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <TransitionSeries>
      {SCENES.flatMap((Scene, i) => {
        const parts = [
          <TransitionSeries.Sequence key={IDS[i]} durationInFrames={LENS[i]} name={IDS[i]}>
            <Scene start={STARTS[i]} len={LENS[i]} />
            <Voice slug={SLUG} id={IDS[i]} />
            <Sfx id="whoosh" at={0} volume={0.2} frames={30} />
          </TransitionSeries.Sequence>,
        ];
        if (i < SCENES.length - 1) {
          parts.push(
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={newsWipe(i % 2 === 0 ? 1 : -1)}
              timing={linearTiming({ durationInFrames: PADS[i] })}
            />,
          );
        }
        return parts;
      })}
    </TransitionSeries>
    <Ticker />
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE} />
    {guide ? <TikTokGuide /> : null}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Comp,
  durationInFrames: TOTAL,
};
