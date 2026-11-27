import { AbsoluteFill, Loop, OffthreadVideo, Sequence, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import {
  Brand,
  FPS,
  Music,
  Sfx,
  TYPE_DELAY,
  TikTokGuide,
  Voice,
  flash,
  typingFrames,
  whip,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";
import { Card, Headline, Line, MAP, Panel, Stage, Steps, Term, prog } from "./parts";
import { CW, RANKS, SLUG, X, asset, cond, type RankTheme } from "./palette";

// ---- timing ----------------------------------------------------------------

const TL = timeline.scenes as Record<string, { start: number; length: number }>;
const DUR = durations as Record<string, number>;
const START = (id: string) => Math.round(TL[id].start * FPS);
const LEN = (id: string) => Math.round(TL[id].length * FPS);

const S = Object.fromEntries(script.scenes.map((s) => [s.id, s])) as Record<
  string,
  { headline: string; lines: string[]; commands: string[] }
>;

const A0 = 0;
const A1 = START("s3"); // 727: title card ends, #5 holds until here
const B0 = A1;
const B1 = START("s4"); // 1201
const C0 = B1;
const C1 = START("s5"); // 1680
const D0 = C1;
const D1 = MAP.drops[0]; // the drop lands during s7: #1 takes over
const E0 = D1;
const E1 = START("s11") + LEN("s11");
const TOTAL = E1;

const T = 12;
const T_GOLD = 14;

const CUT_S8 = START("s8") - E0; // 52 frames of #1 before the install voice
const CUT_S9 = START("s9") - E0;
const CUT_S10 = START("s10") - E0;
const CUT_S11 = START("s11") - E0;

const VOICE_RANGES: [number, number][] = script.scenes.map((s) => [
  START(s.id),
  START(s.id) + Math.round(DUR[s.id] * FPS),
]);

// ---- shared bits -----------------------------------------------------------

// Break a script headline before `token`, so a compound word or a number is
// never split and no short word is left alone on its own line.
const before = (text: string, token: string) => text.replace(token, `\n${token}`);

type BarRowProps = {
  y: number;
  label: string;
  value: string;
  ratio: number;
  at: number;
  c: RankTheme;
  hot?: boolean;
};

const BarRow: React.FC<BarRowProps> = ({ y, label, value, ratio, at, c, hot }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 18);
  const col = hot ? c.accent : c.ink;
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: CW, opacity: p }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: cond, fontWeight: 900, fontSize: 46, color: col }}>{label}</span>
        <span
          style={{
            fontFamily: cond,
            fontWeight: 900,
            fontSize: 54,
            color: col,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
      </div>
      <div style={{ position: "relative", height: 16, marginTop: 8, background: c.line }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hot ? c.accent : c.dim,
            transform: `scaleX(${ratio * p})`,
            transformOrigin: "left center",
          }}
        />
      </div>
    </div>
  );
};

// ---- shot 1: title, then #5 -------------------------------------------------

const ShotOne: React.FC = () => {
  const f = useCurrentFrame();
  const c = RANKS[5];
  const hookOut = 1 - prog(f, 322, 8);
  const p36 = prog(f, 54, 9);
  return (
    <Stage rank={5} slamAt={330} start={A0} railAt={330}>
      <div style={{ position: "absolute", inset: 0, opacity: hookOut }}>
        <Brand />
        <div
          style={{
            position: "absolute",
            left: X,
            top: 344,
            fontFamily: cond,
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 1,
            color: c.accent,
            opacity: prog(f, 4, 10),
            transform: `translateY(${(1 - prog(f, 4, 10)) * 26}px)`,
          }}
        >
          TOP 5
        </div>
        <Headline text={S.s1.headline} at={16} y={480} size={96} c={c} />
        <div
          style={{
            position: "absolute",
            left: X,
            top: 690,
            fontFamily: cond,
            fontWeight: 600,
            fontSize: 42,
            color: c.dim,
            opacity: prog(f, 44, 12),
          }}
        >
          nhanh hơn llama.cpp tới
        </div>
        <div
          style={{
            position: "absolute",
            left: X,
            top: 735,
            fontFamily: cond,
            fontWeight: 900,
            fontSize: 270,
            lineHeight: 0.85,
            letterSpacing: -4,
            color: c.accent,
            fontVariantNumeric: "tabular-nums",
            opacity: p36,
            transform: `scale(${1.32 - 0.32 * p36})`,
            transformOrigin: "left bottom",
          }}
        >
          +36%
        </div>
        <Card repo="alesha-pro/llm.asm" at={34} avatar={110} c={c} style={{ top: 1010 }} />
        <Line
          text={S.s1.lines[0]}
          at={22}
          y={1210}
          size={40}
          c={c}
          style={{ color: c.dim }}
        />
      </div>
      {f >= 330 && (
        <>
          <Headline text={S.s2.headline} at={334} y={344} size={96} c={c} />
          <Line
            text={S.s2.lines[0]}
            at={356}
            y={600}
            size={54}
            c={c}
            tokens={["llama.cpp"]}
          />
          <Line text={S.s2.lines[1]} at={382} y={690} size={54} c={c} />
          <Card repo="ggml-org/llama.cpp" at={346} avatar={200} c={c} style={{ top: 880 }} />
        </>
      )}
    </Stage>
  );
};

// ---- shot 2: #4, the 14.7 KB binary ----------------------------------------

const ShotTwo: React.FC = () => {
  const f = useCurrentFrame();
  const c = RANKS[4];
  const stat = prog(f, 84, 12);
  return (
    <Stage rank={4} slamAt={0} start={B0}>
      <Headline text={before(S.s3.headline, "100%")} at={8} y={290} size={102} c={c} />
      <Card repo="alesha-pro/llm.asm" at={30} avatar={170} c={c} style={{ top: 520 }} />
      <Line text={S.s3.lines[0]} at={50} y={790} size={76} weight={900} c={c} />
      <Line
        text="File thực thi tĩnh"
        at={66}
        y={895}
        size={40}
        c={c}
        style={{ color: c.dim }}
      />
      <div
        style={{
          position: "absolute",
          left: X,
          top: 935,
          fontFamily: cond,
          fontWeight: 900,
          fontSize: 206,
          lineHeight: 0.86,
          color: c.ink,
          fontVariantNumeric: "tabular-nums",
          opacity: stat,
          transform: `translateY(${(1 - stat) * 30}px)`,
        }}
      >
        14.7 <span style={{ fontSize: 116, color: c.accent }}>KB</span>
      </div>
    </Stage>
  );
};

// ---- shot 3: #3, syscalls and SIMD ------------------------------------------

const ShotThree: React.FC = () => {
  const f = useCurrentFrame();
  const c = RANKS[3];
  const zoom = 1.02 + (f / (C1 - C0)) * 0.08;
  const bg = (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo
          src={asset("footage/developer-typing-terminal-code-pixabay-1625.mp4")}
          muted
          trimBefore={60}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "68% 45%" }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: c.bg, opacity: 0.76 }} />
      <AbsoluteFill style={{ background: "#000000", opacity: 0.2 }} />
    </AbsoluteFill>
  );
  return (
    <Stage rank={3} slamAt={0} start={C0} bg={bg}>
      <Headline text={before(S.s4.headline, "tối đa")} at={8} y={290} size={96} c={c} />
      <Card repo="alesha-pro/llm.asm" at={100} avatar={96} c={c} style={{ top: 520 }} />
      <Line text={S.s4.lines[0]} at={150} y={750} size={58} c={c} tokens={["Syscall"]} />
      <Line
        text={S.s4.lines[1]}
        at={280}
        y={880}
        size={64}
        c={c}
        tokens={["AVX2 + FMA + F16C"]}
        monoTokens
      />
    </Stage>
  );
};

// ---- shot 4: #2, the decode benchmark and its fine print -------------------

const ShotFour: React.FC = () => {
  const f = useCurrentFrame();
  const c = RANKS[2];
  const zoom = 1.03 + (f / (D1 - D0)) * 0.06;
  const hero = prog(f, 120, 10);
  const heroOut = 1 - prog(f, 590, 12);
  const bg = (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Loop durationInFrames={1260}>
          <OffthreadVideo
            src={asset("footage/server-room-cpu-cooling-pixabay-171185.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%" }}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: c.bg, opacity: 0.64 }} />
      <AbsoluteFill style={{ background: "#000000", opacity: 0.16 }} />
    </AbsoluteFill>
  );
  const S6 = START("s6") - D0;
  const S7 = START("s7") - D0;
  return (
    <Stage rank={2} slamAt={0} start={D0} bg={bg}>
      {/* s5 benchmark */}
      {f < S6 && (
        <>
          <Headline text={before(S.s5.headline, "tốc độ")} at={8} y={290} size={92} c={c} />
          <Card
            repo="alesha-pro/llm.asm"
            at={16}
            avatar={92}
            meta={false}
            c={c}
            style={{ top: 480 }}
          />
          <div style={{ position: "absolute", left: X, top: 630, width: CW }}>
            <BarRow
              y={0}
              label="llm.asm"
              value="69.2 tok/s"
              ratio={1}
              at={12}
              c={c}
              hot
            />
            <BarRow
              y={112}
              label="llama.cpp"
              value="51.0 tok/s"
              ratio={51 / 69.2}
              at={30}
              c={c}
            />
            <div
              style={{
                position: "absolute",
                top: 218,
                fontFamily: cond,
                fontWeight: 600,
                fontSize: 34,
                color: c.dim,
                opacity: prog(f, 46, 12),
              }}
            >
              EPYC 7642 · 4 threads
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: X,
              top: 900,
              opacity: hero * heroOut,
              transform: `scale(${1.2 - 0.2 * hero})`,
              transformOrigin: "left top",
            }}
          >
            <div
              style={{
                fontFamily: cond,
                fontWeight: 900,
                fontSize: 230,
                lineHeight: 0.85,
                color: c.accent,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              +36%
            </div>
            <div style={{ fontFamily: cond, fontWeight: 600, fontSize: 46, color: c.ink }}>
              nhanh hơn llama.cpp
            </div>
          </div>
        </>
      )}

      {/* s6 prefill caveat */}
      {f >= S6 && f < S7 && (
        <>
          <Headline text={S.s6.headline} at={S6 + 8} y={290} size={92} c={c} />
          <Card
            repo="alesha-pro/llm.asm"
            at={S6 + 24}
            avatar={84}
            meta={false}
            c={c}
            style={{ top: 470 }}
          />
          <Panel
            at={S6 + 40}
            c={c}
            size={50}
            style={{ top: 760 }}
            rows={[
              { text: S.s6.lines[0], tokens: ["GEMV"] },
              { text: S.s6.lines[1], tokens: ["GEMM"] },
            ]}
          />
        </>
      )}

      {/* s7 hardware requirements */}
      {f >= S7 && (
        <>
          <Headline text={S.s7.headline} at={S7 + 8} y={290} size={92} c={c} />
          <Line
            text={S.s7.lines[0]}
            at={S7 + 26}
            y={640}
            size={54}
            c={c}
            tokens={["AVX2 + FMA + F16C"]}
            monoTokens
          />
          <Line
            text={S.s7.lines[1]}
            at={S7 + 56}
            y={820}
            size={54}
            c={c}
            tokens={[".asmbin"]}
            monoTokens
          />
        </>
      )}
    </Stage>
  );
};

// ---- shot 5: #1, run it -----------------------------------------------------

const ShotFive: React.FC = () => {
  const f = useCurrentFrame();
  const c = RANKS[1];
  const term8 = CUT_S8;
  const term9 = CUT_S9;
  const term10 = CUT_S10;
  const stat16 = prog(f, CUT_S10 + 80, 10);
  return (
    <Stage rank={1} slamAt={14} start={E0}>
      {/* install */}
      {f >= CUT_S8 && f < CUT_S9 && (
        <>
          <Headline text={S.s8.headline} at={CUT_S8} y={290} size={100} c={c} />
          <Card
            repo="alesha-pro/llm.asm"
            at={CUT_S8}
            avatar={84}
            meta={false}
            c={c}
            style={{ top: 420 }}
          />
          <Steps active={0} at={CUT_S8 + 4} c={c} style={{ top: 560 }} />
          <div style={{ position: "absolute", left: X, top: 620, width: CW }}>
            <Sequence from={term8} layout="none">
              <Term cmds={S.s8.commands} c={c} minHeight={260} />
            </Sequence>
          </div>
          <Line text={S.s8.lines[0]} at={CUT_S8 + 12} y={960} size={44} c={c} />
          <Line text={S.s8.lines[1]} at={CUT_S8 + 20} y={1020} size={44} c={c} />
        </>
      )}

      {/* weights + build */}
      {f >= CUT_S9 && f < CUT_S10 && (
        <>
          <Headline text={before(S.s9.headline, "và build")} at={CUT_S9} y={290} size={96} c={c} />
          <Steps active={1} at={CUT_S9 + 4} c={c} style={{ top: 480 }} />
          <div style={{ position: "absolute", left: X, top: 540, width: CW }}>
            <Sequence from={term9} layout="none">
              <Term cmds={S.s9.commands} c={c} minHeight={300} />
            </Sequence>
          </div>
          <Line text={S.s9.lines[0]} at={CUT_S9 + 24} y={930} size={44} c={c} />
          <Line text={S.s9.lines[1]} at={CUT_S9 + 40} y={990} size={44} c={c} />
        </>
      )}

      {/* chat */}
      {f >= CUT_S10 && f < CUT_S11 && (
        <>
          <Headline text={S.s10.headline} at={CUT_S10} y={290} size={100} c={c} />
          <Steps active={2} at={CUT_S10 + 4} c={c} style={{ top: 420 }} />
          <div style={{ position: "absolute", left: X, top: 480, width: CW }}>
            <Sequence from={term10} layout="none">
              <Term cmds={S.s10.commands} c={c} minHeight={160} />
            </Sequence>
          </div>
          <Line text={S.s10.lines[0]} at={CUT_S10 + 18} y={730} size={44} c={c} />
          <Line text={S.s10.lines[1]} at={CUT_S10 + 32} y={790} size={44} c={c} />
          <div
            style={{
              position: "absolute",
              left: X,
              top: 890,
              display: "flex",
              alignItems: "baseline",
              gap: 20,
              opacity: stat16,
              transform: `translateY(${(1 - stat16) * 26}px)`,
            }}
          >
            <span
              style={{
                fontFamily: cond,
                fontWeight: 900,
                fontSize: 190,
                lineHeight: 0.9,
                color: c.accent,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              16
            </span>
            <span style={{ fontFamily: cond, fontWeight: 600, fontSize: 52, color: c.ink }}>
              luồng CPU
            </span>
          </div>
        </>
      )}

      {/* sign-off */}
      {f >= CUT_S11 && (
        <>
          <Headline text={S.s11.headline} at={CUT_S11} y={290} size={96} c={c} />
          <Card
            repo="alesha-pro/llm.asm"
            at={CUT_S11 + 10}
            avatar={190}
            c={c}
            style={{ top: 520 }}
          />
          <Line text={S.s11.lines[0]} at={CUT_S11 + 24} y={840} size={56} c={c} />
          <Line text={S.s11.lines[1]} at={CUT_S11 + 42} y={930} size={44} c={c} />
        </>
      )}

      <Sfx id="whoosh" at={0} volume={0.4} />
      <Sfx id="thud" at={14} volume={0.6} />
      <Sfx id="ding" at={16} volume={0.4} />
      <Sfx id="pop" at={CUT_S8 + 8} volume={0.3} />
      <Sfx id="typing" at={term8 + TYPE_DELAY} frames={typingFrames(S.s8.commands)} volume={0.22} />
      <Sfx id="typing" at={term9 + TYPE_DELAY} frames={typingFrames(S.s9.commands)} volume={0.22} />
      <Sfx id="typing" at={term10 + TYPE_DELAY} frames={typingFrames(S.s10.commands)} volume={0.22} />
      <Sfx id="pop" at={CUT_S9 + 8} volume={0.25} />
      <Sfx id="pop" at={CUT_S10 + 8} volume={0.25} />
      <Sfx id="pop" at={CUT_S11 + 16} volume={0.25} />
    </Stage>
  );
};

// ---- video -----------------------------------------------------------------

const Main: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: "#000000" }}>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {script.scenes.map((s) => (
      <Sequence key={s.id} from={START(s.id)} layout="none">
        <Voice slug={SLUG} id={s.id} />
      </Sequence>
    ))}
    <TransitionSeries>
      <TransitionSeries.Sequence name="Title + #5" durationInFrames={A1 - A0 + T}>
        <ShotOne />
        <Sfx id="thud" at={4} volume={0.45} />
        <Sfx id="pop" at={54} volume={0.28} />
        <Sfx id="thud" at={212} volume={0.5} />
        <Sfx id="whoosh" at={320} volume={0.32} />
        <Sfx id="thud" at={330} volume={0.55} />
        <Sfx id="pop" at={346} volume={0.3} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={zoomPunch() as never}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence name="#4" durationInFrames={B1 - B0 + T}>
        <ShotTwo />
        <Sfx id="whoosh" at={0} volume={0.3} />
        <Sfx id="thud" at={0} volume={0.5} />
        <Sfx id="pop" at={100} volume={0.3} />
        <Sfx id="pop" at={270} volume={0.28} />
        <Sfx id="ding" at={300} volume={0.25} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={whip(1) as never}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence name="#3" durationInFrames={C1 - C0 + T}>
        <ShotThree />
        <Sfx id="whoosh" at={0} volume={0.3} />
        <Sfx id="thud" at={0} volume={0.5} />
        <Sfx id="pop" at={100} volume={0.28} />
        <Sfx id="pop" at={150} volume={0.25} />
        <Sfx id="pop" at={280} volume={0.3} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={zoomPunch() as never}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence name="#2" durationInFrames={D1 - D0 + T_GOLD}>
        <ShotFour />
        <Sfx id="whoosh" at={0} volume={0.3} />
        <Sfx id="thud" at={0} volume={0.5} />
        <Sfx id="pop" at={50} volume={0.28} />
        <Sfx id="pop" at={100} volume={0.25} />
        <Sfx id="pop" at={160} volume={0.25} />
        <Sfx id="thud" at={380} volume={0.42} />
        <Sfx id="thud" at={START("s6") - D0 + 8} volume={0.32} />
        <Sfx id="pop" at={START("s6") - D0 + 36} volume={0.25} />
        <Sfx id="thud" at={START("s7") - D0 + 8} volume={0.32} />
        <Sfx id="pop" at={START("s7") - D0 + 30} volume={0.25} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={flash("#FFD77A") as never}
        timing={linearTiming({ durationInFrames: T_GOLD })}
      />
      <TransitionSeries.Sequence name="#1" durationInFrames={E1 - E0}>
        <ShotFive />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Main, durationInFrames: TOTAL };
