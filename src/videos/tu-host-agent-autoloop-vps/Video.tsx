import { AbsoluteFill, Series } from "remotion";
import {
  FPS,
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  typingFrames,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { S1, S2, S3, S4, S5, S6, S7, S8, S9 } from "./scenes";
import durations from "./durations.json";
import timeline from "./timeline.json";
import { SLUG } from "./palette";

const ORDER = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"] as const;

// Every scene is exactly its timeline length, in order, so the music's
// sections land on the story's turns.
const LENS = ORDER.map((id) => Math.round(timeline.scenes[id].length * FPS));
const STARTS = LENS.reduce<number[]>((acc, len, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + LENS[i - 1]);
  return acc;
}, []);
const TOTAL = LENS.reduce((sum, n) => sum + n, 0);

const VOICE_RANGES = ORDER.map((id, i): [number, number] => [
  STARTS[i],
  STARTS[i] + Math.round(durations[id] * FPS),
]);

const CURL =
  "curl -fsSL https://raw.githubusercontent.com/KKKKhazix/agent-autoloop/main/install.sh | sh";
const TRY_CMDS = ["agent-autoloop try", "agent-autoloop answer 1 2", "agent-autoloop status"];

const Doc: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ backgroundColor: "#08090A" }}>
    <Series>
      <Series.Sequence name="s1 · terminal" durationInFrames={LENS[0]}>
        <S1 />
        <Voice slug={SLUG} id="s1" />
        <Sfx id="thud" volume={0.4} />
        <Sfx id="whoosh" at={68} volume={0.22} />
      </Series.Sequence>
      <Series.Sequence name="s2 · worker" durationInFrames={LENS[1]}>
        <S2 />
        <Voice slug={SLUG} id="s2" />
        <Sfx id="thud" volume={0.42} />
        <Sfx id="whoosh" at={90} volume={0.2} />
      </Series.Sequence>
      <Series.Sequence name="s3 · zero dependency" durationInFrames={LENS[2]}>
        <S3 />
        <Voice slug={SLUG} id="s3" />
        <Sfx id="thud" volume={0.4} />
        <Sfx id="whoosh" at={90} volume={0.2} />
      </Series.Sequence>
      <Series.Sequence name="s4 · zero CPU" durationInFrames={LENS[3]}>
        <S4 />
        <Voice slug={SLUG} id="s4" />
        <Sfx id="whoosh" volume={0.2} />
        <Sfx id="thud" at={397} volume={0.55} />
      </Series.Sequence>
      <Series.Sequence name="s5 · human in the loop" durationInFrames={LENS[4]}>
        <S5 start={STARTS[4]} />
        <Voice slug={SLUG} id="s5" />
        <Sfx id="whoosh" volume={0.24} />
        <Sfx id="ding" at={198} volume={0.22} />
      </Series.Sequence>
      <Series.Sequence name="s6 · retry" durationInFrames={LENS[5]}>
        <S6 />
        <Voice slug={SLUG} id="s6" />
        <Sfx id="whoosh" volume={0.2} />
        <Sfx id="thud" at={360} volume={0.45} />
      </Series.Sequence>
      <Series.Sequence name="s7 · install" durationInFrames={LENS[6]}>
        <S7 />
        <Voice slug={SLUG} id="s7" />
        <Sfx id="thud" volume={0.4} />
        <Sfx id="whoosh" at={80} volume={0.2} />
        <Sfx id="typing" at={186} frames={typingFrames([CURL])} volume={0.22} />
      </Series.Sequence>
      <Series.Sequence name="s8 · try" durationInFrames={LENS[7]}>
        <S8 />
        <Voice slug={SLUG} id="s8" />
        <Sfx id="whoosh" volume={0.2} />
        <Sfx id="typing" at={106} frames={typingFrames(TRY_CMDS)} volume={0.2} />
      </Series.Sequence>
      <Series.Sequence name="s9 · end" durationInFrames={LENS[8]}>
        <S9 />
        <Voice slug={SLUG} id="s9" />
        <Sfx id="whoosh" volume={0.2} />
        <Sfx id="pop" at={180} volume={0.24} />
        <Sfx id="ding" at={360} volume={0.22} />
      </Series.Sequence>
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Doc,
  durationInFrames: TOTAL,
};
