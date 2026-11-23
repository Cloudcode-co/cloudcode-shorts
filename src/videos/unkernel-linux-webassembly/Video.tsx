import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  Brand,
  FPS,
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  flash,
  typingFrames,
  whip,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { C, SLUG } from "./palette";
import durations from "./durations.json";
import timeline from "./timeline.json";
import { Hook } from "./scenes/Hook";
import { Emulated } from "./scenes/Emulated";
import { Compile } from "./scenes/Compile";
import { KernelSpeed } from "./scenes/KernelSpeed";
import { Fork } from "./scenes/Fork";
import { Budget } from "./scenes/Budget";
import { Network } from "./scenes/Network";
import { CMDS, Install, READY_AT, TERM_AT } from "./scenes/Install";
import { Caveats } from "./scenes/Caveats";
import { Outro } from "./scenes/Outro";

// Scene lengths are fixed by timeline.json so every line keeps its slot in the
// track. A transition overlaps the two shots it joins, so its frames are added
// to the sequence on the left; every next scene still starts on its timeline
// start and the music changes on the cut.
const L = {
  s1: Math.round(timeline.scenes.s1.length * FPS),
  s2: Math.round(timeline.scenes.s2.length * FPS),
  s3: Math.round(timeline.scenes.s3.length * FPS),
  s4: Math.round(timeline.scenes.s4.length * FPS),
  s5: Math.round(timeline.scenes.s5.length * FPS),
  s6: Math.round(timeline.scenes.s6.length * FPS),
  s7: Math.round(timeline.scenes.s7.length * FPS),
  s8: Math.round(timeline.scenes.s8.length * FPS),
  s9: Math.round(timeline.scenes.s9.length * FPS),
  s10: Math.round(timeline.scenes.s10.length * FPS),
};

const T23 = 12; // zoom into the compile shot
const T45 = 12; // flash on the drop
const T78 = 10; // whip into the terminal
const T910 = 12; // fade into the end card

const TOTAL =
  L.s1 + L.s2 + L.s3 + L.s4 + L.s5 + L.s6 + L.s7 + L.s8 + L.s9 + L.s10;

const IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"] as const;
const LENS = [L.s1, L.s2, L.s3, L.s4, L.s5, L.s6, L.s7, L.s8, L.s9, L.s10];
const STARTS = LENS.map((_, i) => LENS.slice(0, i).reduce((a, b) => a + b, 0));
const VOICE_RANGES: [number, number][] = IDS.map((id, i) => [
  STARTS[i],
  STARTS[i] + Math.round(durations[id] * FPS),
]);

const Unkernel: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence name="s1 boot" durationInFrames={L.s1}>
        <Hook len={L.s1} />
        <Voice slug={SLUG} id="s1" />
        <Sfx id="thud" volume={0.4} />
        <Sfx id="pixel" at={18} volume={0.2} />
        <Sfx id="ding" at={126} volume={0.28} />
        <Brand />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence name="s2 v86" durationInFrames={L.s2 + T23}>
        <Emulated len={L.s2 + T23} />
        <Voice slug={SLUG} id="s2" />
        <Sfx id="whoosh" volume={0.3} />
        <Sfx id="pop" at={34} volume={0.2} />
        <Sfx id="pop" at={70} volume={0.2} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={zoomPunch()}
        timing={linearTiming({ durationInFrames: T23 })}
      />

      <TransitionSeries.Sequence name="s3 compile" durationInFrames={L.s3}>
        <Compile len={L.s3} />
        <Voice slug={SLUG} id="s3" />
        <Sfx id="pop" at={195} volume={0.24} />
        <Sfx id="ding" at={303} volume={0.24} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence name="s4 kernel" durationInFrames={L.s4 + T45}>
        <KernelSpeed len={L.s4 + T45} />
        <Voice slug={SLUG} id="s4" />
        <Sfx id="whoosh" volume={0.28} />
        <Sfx id="pop" at={44} volume={0.2} />
        <Sfx id="pop" at={120} volume={0.2} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={flash(C.mint)}
        timing={linearTiming({ durationInFrames: T45 })}
      />

      <TransitionSeries.Sequence name="s5 fork" durationInFrames={L.s5}>
        <Fork len={L.s5} />
        <Voice slug={SLUG} id="s5" />
        <Sfx id="thud" volume={0.5} />
        <Sfx id="pop" at={56} volume={0.22} />
        <Sfx id="pop" at={68} volume={0.32} />
        <Sfx id="thud" at={120} volume={0.28} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence name="s6 budget" durationInFrames={L.s6}>
        <Budget len={L.s6} />
        <Voice slug={SLUG} id="s6" />
        <Sfx id="whoosh" volume={0.28} />
        <Sfx id="pop" at={168} volume={0.22} />
        <Sfx id="ding" at={322} volume={0.26} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence name="s7 wisp" durationInFrames={L.s7 + T78}>
        <Network len={L.s7 + T78} />
        <Voice slug={SLUG} id="s7" />
        <Sfx id="whoosh" volume={0.28} />
        <Sfx id="pop" at={138} volume={0.22} />
        <Sfx id="ding" at={240} volume={0.22} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={whip(1)}
        timing={linearTiming({ durationInFrames: T78 })}
      />

      <TransitionSeries.Sequence name="s8 install" durationInFrames={L.s8}>
        <Install len={L.s8} />
        <Voice slug={SLUG} id="s8" />
        <Sfx id="typing" at={TERM_AT + 16} frames={typingFrames(CMDS) + 12} volume={0.3} />
        <Sfx id="ding" at={READY_AT} volume={0.26} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence name="s9 caveats" durationInFrames={L.s9 + T910}>
        <Caveats len={L.s9 + T910} />
        <Voice slug={SLUG} id="s9" />
        <Sfx id="thud" volume={0.32} />
        <Sfx id="pop" at={190} volume={0.24} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T910 })}
      />

      <TransitionSeries.Sequence name="s10 outro" durationInFrames={L.s10}>
        <Outro len={L.s10} />
        <Voice slug={SLUG} id="s10" />
        <Sfx id="whoosh" volume={0.26} />
        <Sfx id="ding" at={148} volume={0.28} />
        <Sfx id="pop" at={180} volume={0.22} />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Unkernel,
  durationInFrames: TOTAL,
};
