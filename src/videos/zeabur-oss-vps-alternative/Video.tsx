import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, Sequence } from "remotion";
import {
  Brand,
  FPS,
  Music,
  Sfx,
  TikTokGuide,
  TYPE_DELAY,
  typingFrames,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import { BuildShot, DropShot, HookShot, LEN, OutroShot, ShotVoice } from "./Shots";
import { C } from "./Stage";

const SLUG = "zeabur-oss-vps-alternative";
const ids = Object.keys(durations) as (keyof typeof durations)[];
const frames = Object.fromEntries(ids.map((id) => [id, Math.round(durations[id] * FPS) + 54]));
const TOTAL = ids.reduce((sum, id) => sum + frames[id], 0);
const VOICE_RANGES: [number, number][] = [];
let at = 0;
for (const id of ids) {
  VOICE_RANGES.push([at, at + Math.round(durations[id] * FPS)]);
  at += frames[id];
}

const Typing: React.FC<{ id: keyof typeof typingSource; at: number }> = ({ id, at }) => (
  <Sfx id="typing" at={at + TYPE_DELAY} frames={typingFrames([...typingSource[id]])} volume={0.13} />
);
const typingSource = {
  s5: ["curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash"],
  s7: ["sudo zeatend apply"],
  s8: ["zeaburctl ui"],
  s9: ["zeaburctl up ./site --project shop --service site"],
};

const ZeaburVideo: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="Stateless or database" durationInFrames={LEN.hook}>
        <HookShot />
        <ShotVoice ids={["s1", "s2", "s3"]} />
        <Sequence from={0} durationInFrames={frames.s1}>
          <Brand />
        </Sequence>        <Sfx id="pop" at={20} volume={0.22} />
        <Sfx id="whoosh" at={frames.s1} volume={0.16} />
        <Sfx id="ding" at={frames.s1 + frames.s2 + 30} volume={0.24} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomPunch()} timing={linearTiming({ durationInFrames: 10 })} />
      <TransitionSeries.Sequence name="Native objects and prerequisites" durationInFrames={LEN.build + 10}>
        <BuildShot />
        <ShotVoice ids={["s4", "s5", "s6"]} />
        <Sfx id="whoosh" at={8} volume={0.2} />
        <Sfx id="pop" at={92} volume={0.25} />
        <Sequence from={frames.s4} durationInFrames={frames.s5} layout="none">
          <Typing id="s5" at={22} />
        </Sequence>
        <Sfx id="whoosh" at={frames.s4} volume={0.16} />
        <Sfx id="whoosh" at={frames.s4 + frames.s5} volume={0.16} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomPunch()} timing={linearTiming({ durationInFrames: 12 })} />
      <TransitionSeries.Sequence name="Provision, open and deploy" durationInFrames={LEN.drop + 12}>
        <DropShot />
        <ShotVoice ids={["s7", "s8", "s9"]} />
        <Sfx id="thud" at={0} volume={0.32} />
        <Sfx id="ding" at={24} volume={0.25} />
        <Sequence from={0} durationInFrames={frames.s7} layout="none">
          <Typing id="s7" at={72} />
        </Sequence>
        <Sfx id="whoosh" at={frames.s7} volume={0.18} />
        <Sequence from={frames.s7} durationInFrames={frames.s8} layout="none">
          <Typing id="s8" at={40} />
        </Sequence>
        <Sfx id="whoosh" at={frames.s7 + frames.s8} volume={0.18} />
        <Sequence from={frames.s7 + frames.s8} durationInFrames={frames.s9} layout="none">
          <Typing id="s9" at={45} />
        </Sequence>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomPunch()} timing={linearTiming({ durationInFrames: 10 })} />
      <TransitionSeries.Sequence name="Try Zeabur" durationInFrames={LEN.outro + 10}>
        <OutroShot />
        <ShotVoice ids={["s10"]} />
        <Sfx id="ding" at={32} volume={0.24} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: ZeaburVideo,
  durationInFrames: TOTAL,
};
