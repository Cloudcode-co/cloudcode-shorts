import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { FPS, Music, TikTokGuide, flash, whip, type VideoDef, type VideoProps } from "../../kit";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";
import { ShotA, ShotB, ShotC, ShotD, ShotE } from "./shots";

const SLUG = script.slug;
const T = 10; // transition frames
type Id = keyof typeof timeline.scenes;
const at = (id: Id) => Math.round(timeline.scenes[id].start * FPS);
const TOTAL = Math.round(timeline.total * FPS);

// Five long shots, each starting on its first scene's timeline frame.
const STARTS = [at("s1"), at("s3"), at("s6"), at("s8"), at("s10")];
const LENS = STARTS.map((s, i) => (i < 4 ? STARTS[i + 1] : TOTAL) - s);
const rel = (id: Id, shot: number) => at(id) - STARTS[shot];

const VOICE_RANGES: [number, number][] = (Object.keys(durations) as Id[]).map((id) => [
  at(id),
  at(id) + Math.round(durations[id] * FPS),
]);

const Birds: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={LENS[0] + T}>
        <ShotA s2={rel("s2", 0)} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip(1)} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={LENS[1] + T}>
        <ShotB s4={rel("s4", 1)} s5={rel("s5", 1)} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={flash()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={LENS[2] + T}>
        <ShotC s7={rel("s7", 2)} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip(-1)} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={LENS[3] + T}>
        <ShotD s9={rel("s9", 3)} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={LENS[4]}>
        <ShotE />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Birds,
  durationInFrames: TOTAL,
};
