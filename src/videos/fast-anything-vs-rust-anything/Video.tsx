import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import {
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { Desk } from "./bits";
import { FastIntro, Gate, Speed, Tests } from "./scenes/Fast";
import { Open, Price } from "./scenes/Hook";
import { Board, RustIntro } from "./scenes/Rust";
import { COMMANDS, Flow, Install, Outro } from "./scenes/Wrap";
import type { SceneProps } from "./scenes/types";
import { C, SLUG, grotesk } from "./theme";
import { typingFrames } from "./Terminal";
import {
  IDS,
  LEN,
  START,
  STORY_END,
  STORY_START,
  TOTAL,
  TRANSITION_AFTER,
  VOICE_RANGES,
  storyAt,
  type SceneId,
} from "./timing";
import { pushWipe } from "./wipe";

const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  s1: Open,
  s2: Price,
  s3: FastIntro,
  s4: Speed,
  s5: Tests,
  s6: Gate,
  s7: RustIntro,
  s8: Board,
  s9: Flow,
  s10: Install,
  s11: Outro,
};

const STORY = IDS.map((_, i) => storyAt(START[i]));

const SFX: Partial<Record<SceneId, { id: string; at?: number; volume?: number; frames?: number }[]>> = {
  s1: [
    { id: "thud", volume: 0.4 },
    { id: "pop", at: 54, volume: 0.24 },
  ],
  s2: [
    { id: "thud", volume: 0.22 },
    { id: "pop", at: 58, volume: 0.2 },
    { id: "pop", at: 140, volume: 0.2 },
    { id: "pop", at: 222, volume: 0.2 },
  ],
  s3: [
    { id: "whoosh", volume: 0.28 },
    { id: "ding", at: 34, volume: 0.34 },
    { id: "pop", at: 180, volume: 0.2 },
    { id: "pop", at: 330, volume: 0.2 },
  ],
  s4: [
    { id: "pop", at: 212, volume: 0.22 },
    { id: "thud", at: 330, volume: 0.34 },
  ],
  s5: [
    { id: "pop", at: 140, volume: 0.24 },
    { id: "pop", at: 360, volume: 0.22 },
  ],
  s6: [
    { id: "thud", at: 170, volume: 0.3 },
    { id: "whoosh", at: 300, volume: 0.24 },
  ],
  s7: [
    { id: "whoosh", volume: 0.28 },
    { id: "ding", at: 26, volume: 0.34 },
    { id: "pop", at: 190, volume: 0.2 },
  ],
  s8: [
    { id: "whoosh", volume: 0.26 },
    { id: "pop", at: 255, volume: 0.24 },
    { id: "pop", at: 400, volume: 0.24 },
  ],
  s9: [
    { id: "whoosh", volume: 0.28 },
    { id: "pop", at: 60, volume: 0.2 },
    { id: "pop", at: 180, volume: 0.2 },
    { id: "pop", at: 300, volume: 0.2 },
  ],
  s10: [
    { id: "typing", at: 24, volume: 0.22, frames: typingFrames(COMMANDS) + 12 },
    { id: "pop", at: 132, volume: 0.2 },
  ],
  s11: [
    { id: "pop", at: 180, volume: 0.22 },
    { id: "ding", at: 401, volume: 0.32 },
  ],
};

const nodes: React.ReactNode[] = [];
IDS.forEach((id, i) => {
  const Scene = SCENES[id];
  const t = TRANSITION_AFTER[id] ?? 0;
  const story = STORY[i];
  nodes.push(
    <TransitionSeries.Sequence
      key={id}
      name={id}
      durationInFrames={LEN[i] + t}
    >
      <Scene
        start={START[i]}
        len={LEN[i]}
        storyStart={STORY_START[story]}
        storyEnd={STORY_END[story]}
      />
      <Voice slug={SLUG} id={id} />
      {(SFX[id] ?? []).map((sfx, k) => (
        <Sfx key={k} id={sfx.id} at={sfx.at} volume={sfx.volume} frames={sfx.frames} />
      ))}
    </TransitionSeries.Sequence>,
  );
  if (t > 0) {
    nodes.push(
      <TransitionSeries.Transition
        key={`wipe-${id}`}
        presentation={pushWipe()}
        timing={linearTiming({ durationInFrames: t })}
      />,
    );
  }
});

const FastAnythingVsRustAnything: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ backgroundColor: C.navy, fontFamily: grotesk }}>
    <TransitionSeries>{nodes}</TransitionSeries>
    <Desk />
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide ? <TikTokGuide /> : null}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: FastAnythingVsRustAnything,
  durationInFrames: TOTAL,
};
