import { AbsoluteFill, Series } from "remotion";
import {
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  typingFrames,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import timeline from "./timeline.json";
import { SLUG } from "./palette";
import { S1Hook } from "./scenes/S1Hook";
import { S10Close } from "./scenes/S10Close";
import { S2Unsloth } from "./scenes/S2Unsloth";
import { S3Proxy } from "./scenes/S3Proxy";
import { S4Habits } from "./scenes/S4Habits";
import { S5Dream } from "./scenes/S5Dream";
import { S6TwoDreams } from "./scenes/S6TwoDreams";
import { S7Undo } from "./scenes/S7Undo";
import { S8Hardware } from "./scenes/S8Hardware";
import { S9Install } from "./scenes/S9Install";

// Scenes are hard-cut; the motion inside each one carries the beat.
//
// The length of a scene is the gap between the timeline's own start times once
// they are rounded to whole frames, not round(length * 60) per scene. Rounding
// each length independently let the cumulative cut drift a frame or two past
// its documented start, so a still taken at a scene's timeline start showed the
// tail of the scene before it. Deriving the lengths from `start` keeps every
// cut exactly on its frame (and the whole video exactly timeline.total).
const ORDER = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"] as const;

const START = (id: keyof typeof timeline.scenes) => Math.round(timeline.scenes[id].start * 60);
const TOTAL = Math.round(timeline.total * 60);

const LEN = Object.fromEntries(
  ORDER.map((id, i) => {
    const end = i === ORDER.length - 1 ? TOTAL : START(ORDER[i + 1]);
    return [id, end - START(id)];
  }),
) as Record<(typeof ORDER)[number], number>;

// Where each voice clip plays, in whole-video frames: the music ducks there.
const VOICE_RANGES: [number, number][] = (() => {
  const out: [number, number][] = [];
  let at = 0;
  for (const id of ORDER) {
    const voiced = Math.min(LEN[id], Math.round(durations[id] * 60));
    out.push([at, at + voiced]);
    at += LEN[id];
  }
  return out;
})();

const CMD_UNDO = ["songe undo"];

const Video: React.FC<VideoProps> = ({ guide }) => {
  return (
    <AbsoluteFill>
      <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
      <Series>
        <Series.Sequence name="01 hook" durationInFrames={LEN.s1}>
          <S1Hook len={LEN.s1} />
          <Voice slug={SLUG} id="s1" />
          <Sfx id="thud" volume={0.4} />
          <Sfx id="pixel" at={30} volume={0.22} />
          <Sfx id="whoosh" at={102} volume={0.3} />
        </Series.Sequence>

        <Series.Sequence name="02 unsloth" durationInFrames={LEN.s2}>
          <S2Unsloth len={LEN.s2} />
          <Voice slug={SLUG} id="s2" />
          <Sfx id="whoosh" volume={0.28} />
          <Sfx id="pop" at={40} volume={0.25} />
          <Sfx id="whoosh" at={106} volume={0.25} />
          <Sfx id="whoosh" at={268} volume={0.25} />
          <Sfx id="ding" at={292} volume={0.22} />
        </Series.Sequence>

        <Series.Sequence name="03 proxy" durationInFrames={LEN.s3}>
          <S3Proxy len={LEN.s3} />
          <Voice slug={SLUG} id="s3" />
          <Sfx id="thud" volume={0.42} />
          <Sfx id="whoosh" at={68} volume={0.3} />
          <Sfx id="pop" at={86} volume={0.24} />
          <Sfx id="whoosh" at={296} volume={0.26} />
        </Series.Sequence>

        <Series.Sequence name="04 habits" durationInFrames={LEN.s4}>
          <S4Habits len={LEN.s4} />
          <Voice slug={SLUG} id="s4" />
          <Sfx id="whoosh" volume={0.28} />
          <Sfx id="pop" at={34} volume={0.22} />
          <Sfx id="whoosh" at={174} volume={0.24} />
          <Sfx id="whoosh" at={330} volume={0.24} />
          <Sfx id="ding" at={352} volume={0.2} />
        </Series.Sequence>

        <Series.Sequence name="05 dream" durationInFrames={LEN.s5}>
          <S5Dream len={LEN.s5} />
          <Voice slug={SLUG} id="s5" />
          <Sfx id="whoosh" volume={0.28} />
          <Sfx id="pop" at={60} volume={0.22} />
          <Sfx id="whoosh" at={252} volume={0.26} />
          <Sfx id="ding" at={300} volume={0.22} />
        </Series.Sequence>

        <Series.Sequence name="06 two dreams (drop)" durationInFrames={LEN.s6}>
          <S6TwoDreams len={LEN.s6} />
          <Voice slug={SLUG} id="s6" />
          <Sfx id="thud" at={0} volume={0.55} />
          <Sfx id="pop" at={10} volume={0.24} />
          <Sfx id="pop" at={118} volume={0.24} />
          <Sfx id="whoosh" at={210} volume={0.3} />
          <Sfx id="ding" at={286} volume={0.2} />
        </Series.Sequence>

        <Series.Sequence name="07 undo" durationInFrames={LEN.s7}>
          <S7Undo len={LEN.s7} />
          <Voice slug={SLUG} id="s7" />
          <Sfx id="whoosh" volume={0.28} />
          <Sfx id="ding" at={44} volume={0.2} />
          <Sfx id="whoosh" at={155} volume={0.26} />
          <Sfx id="typing" at={155 + 16} volume={0.3} frames={typingFrames(CMD_UNDO) + 12} />
          <Sfx id="pop" at={196} volume={0.24} />
        </Series.Sequence>

        <Series.Sequence name="08 hardware" durationInFrames={LEN.s8}>
          <S8Hardware len={LEN.s8} />
          <Voice slug={SLUG} id="s8" />
          <Sfx id="whoosh" volume={0.28} />
          <Sfx id="pop" at={60} volume={0.22} />
          <Sfx id="whoosh" at={193} volume={0.26} />
          <Sfx id="ding" at={214} volume={0.2} />
          <Sfx id="whoosh" at={420} volume={0.26} />
        </Series.Sequence>

        <Series.Sequence name="09 install (chapter 04)" durationInFrames={LEN.s9}>
          <S9Install len={LEN.s9} />
          <Voice slug={SLUG} id="s9" />
          <Sfx id="thud" volume={0.4} />
          <Sfx id="ding" at={10} volume={0.22} />
        </Series.Sequence>

        <Series.Sequence name="10 close" durationInFrames={LEN.s10}>
          <S10Close len={LEN.s10} />
          <Voice slug={SLUG} id="s10" />
          <Sfx id="whoosh" volume={0.28} />
          <Sfx id="pop" at={26} volume={0.24} />
          <Sfx id="whoosh" at={177} volume={0.26} />
          <Sfx id="whoosh" at={438} volume={0.28} />
          <Sfx id="ding" at={452} volume={0.24} />
        </Series.Sequence>
      </Series>
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Video,
  durationInFrames: TOTAL,
};
