import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, Sequence } from "remotion";
import {
  FPS,
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  flash,
  typingFrames,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";
import { Build } from "./Build";
import { Drop } from "./Drop";
import { Hook } from "./Hook";
import { Outro } from "./Outro";
import { SLUG } from "./theme";

type Timeline = {
  scenes: Record<string, { start: number; length: number }>;
};
const TL = timeline as Timeline;
const D = durations as Record<string, number>;

const IDS = script.scenes.map((s) => s.id);
// Every scene keeps exactly its timeline length, in order.
const LENS = IDS.map((id) => Math.round(TL.scenes[id].length * FPS));
const STARTS = LENS.reduce<number[]>((acc, len, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + LENS[i - 1]);
  return acc;
}, []);
const TOTAL = LENS.reduce((sum, len) => sum + len, 0);

const at = (id: string) => STARTS[IDS.indexOf(id)];
const HOOK = at("s3");
const BUILD = at("s7") - at("s3");
const DROP = at("s10") - at("s7");
const OUTRO = TOTAL - at("s10");

// The transition overlaps the two shots, so the previous shot is lengthened
// by it and every scene still starts where timeline.json says.
const T = 12;

const VOICE: [number, number][] = IDS.map((id, i) => [
  STARTS[i],
  STARTS[i] + Math.round(D[id] * FPS),
]);

const CMDS = [
  "npm install -g @openhands/agent-canvas",
  "OH_CONVERSATION_RUNTIME=docker agent-canvas",
];
const TYPE_START = at("s9") + 16;

const SFX: { id: string; at: number; volume?: number; frames?: number }[] = [
  { id: "thud", at: 0, volume: 0.4 },
  { id: "pop", at: 25, volume: 0.16 },
  { id: "pop", at: 100, volume: 0.16 },
  { id: "pixel", at: 265, volume: 0.18 },
  { id: "pixel", at: 297, volume: 0.18 },
  { id: "pixel", at: 329, volume: 0.18 },
  { id: "ding", at: 361, volume: 0.26 },
  { id: "whoosh", at: HOOK, volume: 0.22 },
  { id: "pop", at: at("s4"), volume: 0.14 },
  { id: "pop", at: at("s5"), volume: 0.14 },
  { id: "pop", at: at("s6"), volume: 0.14 },
  { id: "thud", at: 2692, volume: 0.34 },
  { id: "ding", at: 2692, volume: 0.2 },
  { id: "whoosh", at: at("s7"), volume: 0.25 },
  { id: "ding", at: at("s7") + 110, volume: 0.22 },
  { id: "thud", at: at("s7") + 190, volume: 0.2 },
  { id: "thud", at: at("s8") + 260, volume: 0.2 },
  { id: "typing", at: TYPE_START, frames: typingFrames(CMDS), volume: 0.16 },
  { id: "whoosh", at: at("s10"), volume: 0.24 },
  { id: "ding", at: at("s10") + 320, volume: 0.26 },
  { id: "ding", at: at("s11") + 320, volume: 0.2 },
];

const OpenComputerVsDevin: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={HOOK + T}>
        <Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={flash("#FFC94A")}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence durationInFrames={BUILD + T}>
        <Build />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={flash("#FFC94A")}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence durationInFrames={DROP + T}>
        <Drop />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={flash("#FFC94A")}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence durationInFrames={OUTRO}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    {IDS.map((id, i) => (
      <Sequence
        key={id}
        from={STARTS[i]}
        durationInFrames={Math.round(D[id] * FPS) + 4}
        layout="none"
        name={`voice ${id}`}
      >
        <Voice slug={SLUG} id={id} />
      </Sequence>
    ))}

    {SFX.map((s, i) => (
      <Sfx key={i} id={s.id} at={s.at} volume={s.volume} frames={s.frames} />
    ))}

    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: OpenComputerVsDevin,
  durationInFrames: TOTAL,
};
