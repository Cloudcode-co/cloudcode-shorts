import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  Brand,
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  flash,
  type VideoDef,
  type VideoProps,
  whip,
  zoomPunch,
} from "../../kit";
import durations from "./durations.json";
import {
  ChapterCard,
  Credits,
  EndFade,
  GlobalAtmosphere,
  Hud,
  SimRain,
  Subtitles,
  Waveform,
} from "./components";
import {
  Scene1,
  Scene10,
  Scene2,
  Scene3,
  Scene4,
  Scene5,
  Scene6,
  Scene7,
  Scene8,
  Scene9,
} from "./scenes";
import { COLD, GREEN, VIOLET } from "./theme";
import { TYPE_DELAY, typingFrames } from "./Terminal";

const SLUG = "rvoip-rust-voip-ai-stack";
const FPS = 60;

const COMMANDS = [
  "git clone https://github.com/eisenzopf/rvoip.git && cd rvoip",
  "cargo run -p rvoip-sip --example endpoint_local_call",
];
const TYPE_FRAMES = typingFrames(COMMANDS);

// Exact timeline lengths, in frames.
const LENS = [316, 527, 369, 507, 469, 532, 527, 523, 486, 464];
const STARTS = LENS.reduce<number[]>((acc, len, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + LENS[i - 1]);
  return acc;
}, []);
const TOTAL = LENS.reduce((a, b) => a + b, 0);

// Transition before each scene (none after the last).
const TR = [10, 12, 10, 10, 8, 12, 10, 12, 14, 0];

const VOICE_RANGES: [number, number][] = LENS.map((_, i) => [
  STARTS[i],
  STARTS[i] + Math.round((durations as Record<string, number>)[`s${i + 1}`] * FPS),
]);

const BrandLayer: React.FC = () => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 148, 194], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      <Brand />
    </AbsoluteFill>
  );
};

const RvoipSimulation: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ backgroundColor: "#02050A" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="s1 hook" durationInFrames={LENS[0] + TR[0]}>
        <Scene1 />
        <Voice slug={SLUG} id="s1" />
        <Sfx id="thud" volume={0.44} />
        <Sfx id="whoosh" at={231} volume={0.24} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip(1)} timing={linearTiming({ durationInFrames: TR[0] })} />

      <TransitionSeries.Sequence name="s2 asterisk" durationInFrames={LENS[1] + TR[1]}>
        <Scene2 />
        <Voice slug={SLUG} id="s2" />
        <Sfx id="whoosh" at={308} volume={0.24} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TR[1] })} />

      <TransitionSeries.Sequence name="s3 library" durationInFrames={LENS[2] + TR[2]}>
        <Scene3 />
        <Voice slug={SLUG} id="s3" />
        <Sfx id="thud" volume={0.34} />
        <Sfx id="whoosh" at={166} volume={0.22} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomPunch()} timing={linearTiming({ durationInFrames: TR[2] })} />

      <TransitionSeries.Sequence name="s4 benchmark" durationInFrames={LENS[3] + TR[3]}>
        <Scene4 />
        <Voice slug={SLUG} id="s4" />
        <Sfx id="whoosh" volume={0.24} />
        <Sfx id="thud" at={190} volume={0.5} />
        <Sfx id="pixel" at={194} volume={0.3} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip(-1)} timing={linearTiming({ durationInFrames: TR[3] })} />

      <TransitionSeries.Sequence name="s5 media" durationInFrames={LENS[4] + TR[4]}>
        <Scene5 />
        <Voice slug={SLUG} id="s5" />
        <Sfx id="whoosh" volume={0.24} />
        <Sfx id="pop" at={206} volume={0.28} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TR[4] })} />

      <TransitionSeries.Sequence name="s6 overload" durationInFrames={LENS[5] + TR[5]}>
        <Scene6 />
        <Voice slug={SLUG} id="s6" />
        <Sfx id="whoosh" volume={0.22} />
        <Sfx id="thud" at={130} volume={0.52} />
        <Sfx id="pixel" at={261} volume={0.34} />
        <Sfx id="ding" at={392} volume={0.24} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={flash("#CBEFFF")} timing={linearTiming({ durationInFrames: TR[5] })} />

      <TransitionSeries.Sequence name="s7 one model" durationInFrames={LENS[6] + TR[6]}>
        <Scene7 />
        <Voice slug={SLUG} id="s7" />
        <Sfx id="thud" volume={0.54} />
        <Sfx id="whoosh" at={133} volume={0.28} />
        <Sfx id="pop" at={264} volume={0.24} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip(1)} timing={linearTiming({ durationInFrames: TR[6] })} />

      <TransitionSeries.Sequence name="s8 sdk" durationInFrames={LENS[7] + TR[7]}>
        <Scene8 />
        <Voice slug={SLUG} id="s8" />
        <Sfx id="whoosh" volume={0.22} />
        <Sfx id="whoosh" at={261} volume={0.2} />
        <Sfx id="whoosh" at={392} volume={0.2} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TR[7] })} />

      <TransitionSeries.Sequence name="s9 local call" durationInFrames={LENS[8] + TR[8]}>
        <Scene9 />
        <Voice slug={SLUG} id="s9" />
        <Sfx id="thud" volume={0.36} />
        <Sfx id="typing" at={80 + TYPE_DELAY} frames={TYPE_FRAMES} volume={0.24} />
        <Sfx id="ding" at={80 + TYPE_DELAY + TYPE_FRAMES} volume={0.26} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TR[8] })} />

      <TransitionSeries.Sequence name="s10 outro" durationInFrames={LENS[9]}>
        <Scene10 />
        <Voice slug={SLUG} id="s10" />
        <Sfx id="whoosh" volume={0.2} />
        <Sfx id="ding" at={144} volume={0.28} />
        <Sfx id="whoosh" at={172} volume={0.18} />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <GlobalAtmosphere />
    <SimRain />
    <Waveform />
    <Credits />
    <Hud />
    <Subtitles />

    <ChapterCard start={0} numeral="I" title="GIẢ THUYẾT" accent={COLD} />
    <ChapterCard start={843} numeral="II" title="PHÉP THỬ" accent={GREEN} />
    <ChapterCard start={2720} numeral="III" title="HỢP NHẤT" accent={VIOLET} drop />
    <ChapterCard start={3770} numeral="IV" title="CHẠY THỬ" accent={GREEN} />

    <Sequence from={0} durationInFrames={200}>
      <BrandLayer />
    </Sequence>

    <EndFade />

    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: RvoipSimulation,
  durationInFrames: TOTAL,
};
