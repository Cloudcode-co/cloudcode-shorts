import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill } from "remotion";
import {
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { typingFrames } from "./Terminal";
import durations from "./durations.json";
import { CARGO, CARGO_START, CLAUDE, CLAUDE_START, ClaudeScene, CargoScene } from "./scenes/Commands";
import { Close } from "./scenes/Close";
import { Compare } from "./scenes/Compare";
import { Established } from "./scenes/Established";
import { Hook } from "./scenes/Hook";
import { Kernel } from "./scenes/Kernel";
import { Limits } from "./scenes/Limits";
import { Mcp } from "./scenes/Mcp";
import { Product } from "./scenes/Product";
import { Selene } from "./scenes/Selene";
import { LEN, START, TOTAL, type SceneId } from "./timing";
import { SLUG } from "./theme";

const VO = durations as Record<SceneId, number>;

// Duck the music under every voice clip.
const VOICE_RANGES: [number, number][] = (Object.keys(LEN) as SceneId[]).map((id) => [
  START[id],
  START[id] + Math.round(VO[id] * 60),
]);

// The first pass of the edit is calm dissolves; the drop at s6 cuts hard and
// the montage around it moves on a whip. Nothing before the drop is rushed.
const FADE_1 = 12;
const FADE_2 = 14;
const FADE_3 = 10;
const FADE_4 = 10;
const FADE_OUT = 14;
const FADE_END = 16;

const SolidCraftVideo: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ backgroundColor: "#070A0F" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="Hook" durationInFrames={LEN.s1 + FADE_1}>
        <Hook />
        <Voice slug={SLUG} id="s1" />
        <Sfx id="thud" at={36} volume={0.45} />
        <Sfx id="whoosh" at={66} volume={0.2} />
        <Sfx id="pop" at={166} volume={0.22} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_1 })}
      />

      <TransitionSeries.Sequence name="Established" durationInFrames={LEN.s2 + FADE_2}>
        <Established />
        <Voice slug={SLUG} id="s2" />
        <Sfx id="whoosh" volume={0.22} />
        <Sfx id="thud" at={232} volume={0.3} />
        <Sfx id="thud" at={264} volume={0.28} />
        <Sfx id="thud" at={297} volume={0.26} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_2 })}
      />

      <TransitionSeries.Sequence name="Product" durationInFrames={LEN.s3 + FADE_3}>
        <Product />
        <Voice slug={SLUG} id="s3" />
        <Sfx id="whoosh" volume={0.24} />
        <Sfx id="pop" at={54} volume={0.24} />
        <Sfx id="ding" at={283} volume={0.24} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_3 })}
      />

      <TransitionSeries.Sequence name="Kernel" durationInFrames={LEN.s4 + FADE_4}>
        <Kernel />
        <Voice slug={SLUG} id="s4" />
        <Sfx id="whoosh" volume={0.24} />
        <Sfx id="pop" at={50} volume={0.24} />
        <Sfx id="thud" at={260} volume={0.3} />
        <Sfx id="ding" at={386} volume={0.28} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_4 })}
      />

      <TransitionSeries.Sequence name="Compare" durationInFrames={LEN.s5}>
        <Compare />
        <Voice slug={SLUG} id="s5" />
        <Sfx id="whoosh" volume={0.24} />
        <Sfx id="pop" at={18} volume={0.22} />
        <Sfx id="ding" at={248} volume={0.26} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence name="MCP drop" durationInFrames={LEN.s6}>
        <Mcp />
        <Voice slug={SLUG} id="s6" />
        <Sfx id="thud" volume={0.55} />
        <Sfx id="whoosh" at={0} volume={0.3} />
        <Sfx id="pop" at={133} volume={0.32} />
        <Sfx id="pop" at={264} volume={0.26} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence name="SELENE" durationInFrames={LEN.s7}>
        <Selene />
        <Voice slug={SLUG} id="s7" />
        <Sfx id="whoosh" volume={0.28} />
        <Sfx id="pop" at={202} volume={0.22} />
        <Sfx id="ding" at={333} volume={0.26} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence name="Run sample" durationInFrames={LEN.s8}>
        <CargoScene />
        <Voice slug={SLUG} id="s8" />
        <Sfx id="whoosh" volume={0.26} />
        <Sfx
          id="typing"
          at={CARGO_START}
          frames={typingFrames(CARGO) + 12}
          volume={0.24}
        />
        <Sfx id="ding" at={CARGO_START + typingFrames(CARGO) + 6} volume={0.22} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence name="Connect Claude" durationInFrames={LEN.s9}>
        <ClaudeScene />
        <Voice slug={SLUG} id="s9" />
        <Sfx id="whoosh" volume={0.24} />
        <Sfx
          id="typing"
          at={CLAUDE_START}
          frames={typingFrames(CLAUDE) + 14}
          volume={0.24}
        />
        <Sfx id="ding" at={CLAUDE_START + 58} volume={0.22} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence name="Limits" durationInFrames={LEN.s10 + FADE_OUT}>
        <Limits />
        <Voice slug={SLUG} id="s10" />
        <Sfx id="whoosh" volume={0.22} />
        <Sfx id="thud" at={12} volume={0.38} />
        <Sfx id="pop" at={430} volume={0.24} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_OUT })}
      />

      <TransitionSeries.Sequence name="Close" durationInFrames={LEN.s11 + FADE_END}>
        <Close />
        <Voice slug={SLUG} id="s11" />
        <Sfx id="whoosh" volume={0.22} />
        <Sfx id="ding" at={240} volume={0.26} />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: "solidcraft-rust-cad-mcp",
  component: SolidCraftVideo,
  durationInFrames: TOTAL,
};
