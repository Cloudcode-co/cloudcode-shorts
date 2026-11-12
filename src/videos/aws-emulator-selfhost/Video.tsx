import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, useCurrentFrame } from "remotion";
import {
  BRAND_SPACE,
  Brand,
  CONTENT_W,
  FPS,
  Music,
  SAFE,
  Sfx,
  TYPE_DELAY,
  Terminal,
  TikTokGuide,
  Voice,
  beatmap,
  flash,
  hit,
  mono,
  typingFrames,
  videoAsset,
  whip,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import beatJson from "./beatmap.json";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";
import { Btn, C, Check, Col, Confetti, Flash, Logo, Panel, Set, clamp, pop, round, slam } from "./parts";

const SLUG = "aws-emulator-selfhost";
const map = beatmap(beatJson);
const T = 10; // transition frames
const ids = script.scenes.map((s) => s.id);
const START = ids.map((id) => Math.round((timeline.scenes as Record<string, { start: number }>)[id].start * FPS));
const LEN = ids.map((id) => Math.round((timeline.scenes as Record<string, { length: number }>)[id].length * FPS));
const TOTAL = LEN.reduce((a, b) => a + b, 0);

const BaseCtx = createContext(0);

// The set, pumping gently on every beat of the track.
const Stage: React.FC<{ children?: React.ReactNode; tint?: string }> = ({ children, tint }) => {
  const f = useCurrentFrame();
  const base = useContext(BaseCtx);
  return (
    <Set pump={hit(map.beats, f + base, 12)} tint={tint}>
      {children}
    </Set>
  );
};

const Live: React.FC<{ st: (f: number) => React.CSSProperties; children: React.ReactNode }> = ({ st, children }) => {
  const f = useCurrentFrame();
  return <div style={{ display: "flex", justifyContent: "center", ...st(f) }}>{children}</div>;
};

const usePump = () => {
  const f = useCurrentFrame();
  const base = useContext(BaseCtx);
  return hit(map.beats, f + base, 12);
};

// A hard-cut shot inside a scene: its own local frame, a whoosh on entry.
const Cut: React.FC<{ scene: number; from: number; to: number; sfx?: string; children: React.ReactNode }> = ({
  scene,
  from,
  to,
  sfx = "whoosh",
  children,
}) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    <BaseCtx.Provider value={START[scene] + from}>
      <AbsoluteFill>{children}</AbsoluteFill>
      {sfx && from > 0 && <Sfx id={sfx} volume={0.22} />}
    </BaseCtx.Provider>
  </Sequence>
);

const Footage: React.FC<{ file: string; pos?: string; trim?: number; dark?: number }> = ({ file, pos = "50% 50%", trim = 0, dark = 0.58 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={videoAsset(SLUG, `footage/${file}`)}
        muted
        trimBefore={trim}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${1 + f * 0.0006})` }}
      />
      <AbsoluteFill style={{ background: `rgba(24,6,64,${dark})` }} />
    </AbsoluteFill>
  );
};

const FRUSTRATED = "developer-frustrated-computer-screen-pixabay-174086.mp4";
const RACKS = "server-room-datacenter-racks-pixabay-171185.mp4";
const SMILE = "developer-smiling-at-desk-pixabay-232538.mp4";
const AWS = videoAsset(SLUG, "repos/aws.png");
const LS = videoAsset(SLUG, "repos/localstack.png");

const sc = (i: number) => script.scenes[i];

// Compact headline panel kept on every shot of a scene.
const Head: React.FC<{ children: React.ReactNode; h?: number; size?: number }> = ({ children, h = 220, size = 68 }) => {
  const pump = usePump();
  return (
    <Panel h={h} size={size} pump={pump}>
      {children}
    </Panel>
  );
};

// ---------- s1: the question ----------
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const pump = usePump();
  void f;
  return (
    <>
      <Cut scene={0} from={0} to={90} sfx="thud">
        <Footage file={FRUSTRATED} pos="50% 40%" />
        <Col top={SAFE.top + BRAND_SPACE + 60} justify="center">
          <Panel h={620} size={118} pump={pump}>
            <span style={{ color: C.gold }}>LocalStack</span> ngốn quá nhiều <span style={{ color: C.gold }}>RAM</span>?
          </Panel>
        </Col>
      </Cut>
      <Cut scene={0} from={90} to={185}>
        <Stage />
        <Col top={SAFE.top + BRAND_SPACE + 30} gap={40}>
          <Panel h={330} size={72}>
            LocalStack ngốn quá nhiều RAM?
          </Panel>
          <Btn letter="A" text={sc(0).lines[0]} at={4} size={50} h={190} />
          <Btn letter="B" text={sc(0).lines[1]} at={28} size={50} h={190} from={-1} />
          <Live st={(f) => ({ marginTop: 30, opacity: pop(f, 50, 12), transform: `rotate(${Math.sin(f * 0.5) * 3}deg)` })}>
            <Logo src={LS} size={300} />
          </Live>
        </Col>
      </Cut>
      <Cut scene={0} from={185} to={LEN[0] + T}>
        <Stage tint="#3a0a24" />
        <RamMeter />
      </Cut>
    </>
  );
};

const RamMeter: React.FC = () => {
  const f = useCurrentFrame();
  const fill = interpolate(f, [4, 50], [0.08, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const blink = f > 50 ? (Math.floor(f / 5) % 2 ? 1 : 0.5) : 1;
  return (
    <Col justify="center" gap={50}>
      <Logo src={LS} size={380} style={{ transform: `translateX(${f > 50 ? Math.sin(f * 2) * 8 : 0}px)` }} />
      <div style={{ fontFamily: round, fontWeight: 800, fontSize: 150, color: C.white, lineHeight: 1 }}>RAM</div>
      <div style={{ width: CONTENT_W, height: 120, borderRadius: 60, background: C.bg2, border: `8px solid ${C.gold}`, overflow: "hidden" }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", background: C.red, opacity: blink }} />
      </div>
    </Col>
  );
};

// ---------- s2: AWS Emulator arrives ----------
const S2: React.FC = () => {
  const pump = usePump();
  return (
    <>
      <Cut scene={1} from={0} to={110} sfx="">
        <Stage />
        <Col justify="center" gap={50}>
          <Live st={(f) => ({ filter: `grayscale(${interpolate(f, [40, 60], [0, 1], clamp)})` })}>
            <Logo src={LS} size={380} />
          </Live>
          <Btn letter="A" text={sc(1).lines[0]} at={6} state="wrong" stateAt={46} size={52} h={190} />
        </Col>
      </Cut>
      <Cut scene={1} from={110} to={205}>
        <Stage tint="#1a2a8a" />
        <Flash at={0} color={C.gold} />
        <Col justify="center">
          <Panel h={640} size={120} pump={pump}>
            AWS ra mắt <span style={{ color: C.gold }}>AWS Emulator</span>
          </Panel>
        </Col>
      </Cut>
      <Cut scene={1} from={205} to={335}>
        <Stage />
        <Confetti at={26} y={820} />
        <Col top={SAFE.top + 30} gap={44}>
          <Live st={(f) => ({ transform: `scale(${1 + 0.06 * Math.sin(f * 0.2)})` })}>
            <Logo src={AWS} size={430} />
          </Live>
          <Btn letter="B" text={sc(1).lines[1]} at={4} state="right" stateAt={24} size={54} h={200} />
          <div style={{ fontFamily: round, fontWeight: 800, fontSize: 64, color: C.gold }}>
            2.057 sao GitHub
          </div>
        </Col>
      </Cut>
      <Cut scene={1} from={335} to={LEN[1] + T}>
        <Stage tint="#3a1396" />
        <Col justify="center" gap={30}>
          <Live st={(f) => ({ transform: `scale(${0.8 + 0.2 * slam(f, 0, 16)})` })}>
            <div style={{ fontFamily: round, fontWeight: 800, fontSize: 330, lineHeight: 0.9, color: C.gold, textShadow: `0 0 50px ${C.gold}88` }}>Rust</div>
          </Live>
          <Btn letter="C" text={sc(1).lines[2]} at={14} state="right" stateAt={34} size={52} h={190} />
        </Col>
      </Cut>
    </>
  );
};

// ---------- s3: the guess ----------
const S3: React.FC = () => {
  const pump = usePump();
  return (
    <>
      <Cut scene={2} from={0} to={50} sfx="thud">
        <Stage />
        <Col justify="center">
          <Panel h={560} size={112} pump={pump}>
            Chỉ tốn <span style={{ color: C.gold }}>160MB RAM</span>
          </Panel>
        </Col>
      </Cut>
      <Cut scene={2} from={50} to={230}>
        <Footage file={RACKS} pos="50% 50%" dark={0.62} />
        <Col top={SAFE.top + 10} gap={50}>
          <Head>
            Chỉ tốn <span style={{ color: C.gold }}>160MB RAM</span>
          </Head>
          <Live st={(f) => ({ opacity: pop(f, 8, 12) })}>
            <div style={{ fontFamily: round, fontWeight: 800, fontSize: 88, color: C.white, textAlign: "center", lineHeight: 1.1, textWrap: "balance" as never }}>
              Các bộ mock thường ngốn rất nhiều tài nguyên
            </div>
          </Live>
          <Btn letter="A" text={sc(2).lines[0]} at={50} state="right" stateAt={80} size={50} h={190} />
        </Col>
        <Sfx id="pop" at={50} volume={0.2} />
      </Cut>
      <Cut scene={2} from={230} to={380} sfx="ding">
        <Stage tint="#0f5a3a" />
        <Flash at={0} />
        <Confetti at={4} y={760} count={90} />
        <Col top={SAFE.top + 10} gap={40}>
          <Head>
            Chỉ tốn <span style={{ color: C.gold }}>160MB RAM</span>
          </Head>
          <Live st={(f) => ({ transform: `scale(${0.7 + 0.3 * slam(f, 0, 18)})` })}>
            <div style={{ fontFamily: round, fontWeight: 800, fontSize: 250, lineHeight: 0.9, color: C.green, textShadow: `0 0 60px ${C.green}`, fontVariantNumeric: "tabular-nums" }}>160MB</div>
          </Live>
          <Btn letter="A" text={sc(2).lines[0]} at={14} state="right" stateAt={20} size={52} h={190} />
        </Col>
      </Cut>
      <Cut scene={2} from={380} to={510}>
        <Stage />
        <Col top={SAFE.top + 10} gap={40}>
          <Head>
            Chỉ tốn <span style={{ color: C.gold }}>160MB RAM</span>
          </Head>
          <Logo src={AWS} size={300} />
          <Btn letter="B" text={sc(2).lines[1]} at={4} state="right" stateAt={10} size={54} h={200} />
          <div style={{ fontFamily: round, fontWeight: 800, fontSize: 80, color: C.white, textAlign: "center", lineHeight: 1 }}>
            VPS nhỏ cũng chạy ngon
          </div>
        </Col>
      </Cut>
      <Cut scene={2} from={510} to={LEN[2] + T}>
        <Stage tint="#3a1396" />
        <Confetti at={8} y={600} count={50} />
        <Col top={SAFE.top + 10} gap={34}>
          <Head h={200}>
            Chỉ tốn <span style={{ color: C.gold }}>160MB RAM</span>
          </Head>
          {sc(2).lines.map((l, i) => (
            <Btn key={l} letter={"ABC"[i]} text={l} at={i * 8} state="right" stateAt={i * 22 + 10} size={50} h={180} from={i % 2 ? -1 : 1} />
          ))}
          <div style={{ fontFamily: round, fontWeight: 800, fontSize: 150, color: C.green, lineHeight: 1 }}>
            <Check at={60} size={170} />
          </div>
        </Col>
      </Cut>
    </>
  );
};

// ---------- s4: in-memory ----------
const Chip: React.FC<{ size?: number }> = ({ size = 420 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <rect x={40 + i * 24} y={6} width={10} height={34} fill={C.gold} />
          <rect x={40 + i * 24} y={160} width={10} height={34} fill={C.gold} />
          <rect x={6} y={40 + i * 24} width={34} height={10} fill={C.gold} />
          <rect x={160} y={40 + i * 24} width={34} height={10} fill={C.gold} />
        </g>
      ))}
      <rect x={34} y={34} width={132} height={132} rx={16} fill={C.panel} stroke={C.gold} strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={52 + i * 28} y={56} width={20} height={88} fill={C.green} opacity={0.4 + 0.6 * Math.abs(Math.sin(f * 0.12 + i))} />
      ))}
    </svg>
  );
};

const S4: React.FC = () => {
  const f = useCurrentFrame();
  void f;
  return (
    <>
      <Cut scene={3} from={0} to={130} sfx="thud">
        <Stage />
        <Col top={SAFE.top + 20} gap={50}>
          <Panel h={360} size={108}>
            Cơ chế <span style={{ color: C.gold }}>in-memory</span>
          </Panel>
          <Chip size={520} />
        </Col>
      </Cut>
      <Cut scene={3} from={130} to={260}>
        <Stage tint="#1a2a8a" />
        <Col justify="center" gap={40}>
          <Live st={(f) => ({ transform: `scale(${0.8 + 0.2 * slam(f, 0, 16)})` })}>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 150, color: C.gold, lineHeight: 1 }}>:9297</div>
          </Live>
          <Btn letter="A" text={sc(3).lines[0]} at={10} state="right" stateAt={30} size={46} h={200} mono />
        </Col>
      </Cut>
      <Cut scene={3} from={260} to={390}>
        <Stage />
        <Col justify="center" gap={40}>
          <KeyLock />
          <Btn letter="B" text={sc(3).lines[1]} at={8} state="right" stateAt={30} size={52} h={200} from={-1} />
        </Col>
      </Cut>
      <Cut scene={3} from={390} to={LEN[3] + T}>
        <Stage tint="#3a0a50" />
        <Col justify="center" gap={40}>
          <Vanish />
          <Btn letter="C" text={sc(3).lines[2]} at={6} state="right" stateAt={60} size={54} h={200} />
        </Col>
      </Cut>
    </>
  );
};

const KeyLock: React.FC = () => {
  const f = useCurrentFrame();
  const p = slam(f, 0, 18);
  return (
    <svg width={420} height={400} viewBox="0 0 120 115" style={{ transform: `scale(${0.8 + 0.2 * p})` }}>
      <path d="M32 50 V34 a28 28 0 0 1 56 0 V50" fill="none" stroke={C.gold} strokeWidth={9} />
      <rect x={18} y={48} width={84} height={60} rx={12} fill={C.gold} />
      <circle cx={60} cy={72} r={9} fill={C.ink} />
      <rect x={56} y={74} width={8} height={20} rx={3} fill={C.ink} />
    </svg>
  );
};

const Vanish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 150px)", gap: 24 }}>
      {Array.from({ length: 12 }).map((_, i) => {
        const gone = interpolate(f, [20 + i * 3, 36 + i * 3], [1, 0], clamp);
        return <div key={i} style={{ height: 90, borderRadius: 16, background: C.green, opacity: gone, transform: `scale(${0.6 + 0.4 * gone})` }} />;
      })}
    </div>
  );
};

// ---------- terminal scenes ----------
const TERM = { bg: C.bg2, accent: C.gold };

const S5: React.FC = () => {
  const pump = usePump();
  const cmds = sc(4).commands;
  const tf = typingFrames(cmds);
  return (
    <>
      <Cut scene={4} from={0} to={150} sfx="thud">
        <Stage />
        <Col top={SAFE.top + 20} gap={40}>
          <Panel h={330} size={92} pump={pump}>
            Tải gói cài đặt <span style={{ color: C.gold }}>Linux</span>
          </Panel>
          <DebBox />
          <Btn letter="A" text={sc(4).lines[0]} at={14} state="right" stateAt={50} size={46} h={190} />
        </Col>
      </Cut>
      <Cut scene={4} from={150} to={LEN[4] + T}>
        <Stage tint="#1a0f6a" />
        <Confetti at={184} y={1250} count={40} />
        <Col top={SAFE.top + 20} gap={36}>
          <Panel h={220} size={64}>
            Tải gói cài đặt Linux
          </Panel>
          <Terminal cmds={cmds} width={CONTENT_W} fontSize={40} minHeight={430} {...TERM} />
          <Btn letter="B" text={sc(4).lines[1]} at={170} state="right" stateAt={184} size={50} h={170} />
          <Sfx id="ding" at={184} volume={0.2} />
        </Col>
        <Sfx id="typing" at={TYPE_DELAY} frames={tf} volume={0.22} />
      </Cut>
    </>
  );
};

const DebBox: React.FC = () => {
  const f = useCurrentFrame();
  const y = Math.sin(f * 0.12) * 10;
  return (
    <svg width={400} height={330} viewBox="0 0 160 130" style={{ transform: `translateY(${y}px)` }}>
      <path d="M20 40 L80 14 L140 40 V100 L80 124 L20 100 Z" fill={C.gold} />
      <path d="M20 40 L80 66 L140 40" fill="none" stroke={C.goldDeep} strokeWidth={5} />
      <path d="M80 66 V124" stroke={C.goldDeep} strokeWidth={5} />
      <text x={80} y={100} textAnchor="middle" fontFamily={mono} fontWeight={700} fontSize={22} fill={C.ink}>
        .deb
      </text>
    </svg>
  );
};

const S6: React.FC = () => {
  const cmds = sc(5).commands;
  return (
    <>
      <Cut scene={5} from={0} to={190} sfx="thud">
        <Stage tint="#1a0f6a" />
        <Col top={SAFE.top + 20} gap={44}>
          <Panel h={300} size={92}>
            Cài đặt <span style={{ color: C.gold }}>trực tiếp</span>
          </Panel>
          <Terminal cmds={cmds} width={CONTENT_W} fontSize={42} minHeight={260} {...TERM} />
          <Btn letter="A" text={sc(5).lines[0]} at={70} state="right" stateAt={100} size={48} h={180} mono />
        </Col>
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(cmds)} volume={0.22} />
      </Cut>
      <Cut scene={5} from={190} to={LEN[5] + T}>
        <Stage />
        <Confetti at={40} y={1000} count={50} />
        <Col top={SAFE.top + 20} gap={44}>
          <Head h={300} size={92}>
            Cài đặt <span style={{ color: C.gold }}>trực tiếp</span>
          </Head>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 64, color: C.gold, textAlign: "center", overflowWrap: "anywhere" }}>
            /usr/bin/aws-emulator
          </div>
          <Btn letter="B" text={sc(5).lines[1]} at={4} state="right" stateAt={40} size={46} h={180} mono from={-1} />
        </Col>
      </Cut>
    </>
  );
};

const Toggle: React.FC<{ on: boolean; flipAt?: number }> = ({ on, flipAt = 0 }) => {
  const f = useCurrentFrame();
  const p = on ? 1 : interpolate(f - flipAt, [0, 10], [1, 0], { ...clamp, easing: Easing.bezier(0.23, 1, 0.32, 1) });
  const v = on ? 1 : p;
  const color = v > 0.5 ? C.red : C.green;
  return (
    <div style={{ width: 520, height: 260, borderRadius: 130, background: v > 0.5 ? C.red : "#4a3f78", padding: 20, boxSizing: "border-box", border: `8px solid ${C.gold}` }}>
      <div style={{ width: 200, height: 200, borderRadius: 100, background: C.white, transform: `translateX(${v * 260}px)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: round, fontWeight: 800, fontSize: 64, color }}>
        {v > 0.5 ? "ON" : "OFF"}
      </div>
    </div>
  );
};

const S7: React.FC = () => {
  const cmds = sc(6).commands;
  const f = useCurrentFrame();
  void f;
  return (
    <>
      <Cut scene={6} from={0} to={130} sfx="thud">
        <Stage tint="#3a0a24" />
        <Col top={SAFE.top + 10} gap={40}>
          <Panel h={300} size={80}>
            Khởi động và tắt <span style={{ color: C.gold }}>telemetry</span>
          </Panel>
          <Toggle on />
          <Btn letter="A" text={sc(6).lines[0]} at={10} state="wrong" stateAt={60} size={50} h={180} />
        </Col>
      </Cut>
      <Cut scene={6} from={130} to={LEN[6] + T}>
        <Stage />
        <Confetti at={102} y={1100} count={60} />
        <Col top={SAFE.top + 10} gap={36}>
          <Head h={240} size={72}>
            Khởi động và tắt <span style={{ color: C.gold }}>telemetry</span>
          </Head>
          <Terminal cmds={cmds} width={CONTENT_W} fontSize={38} minHeight={200} {...TERM} />
          <Live st={(f) => ({ opacity: pop(f, 60, 10) })}>
            <Toggle on={false} flipAt={70} />
          </Live>
          <Sfx id="pop" at={70} volume={0.25} />
          <Btn letter="B" text={sc(6).lines[1]} at={90} state="right" stateAt={102} size={48} h={190} mono />
          <Sfx id="ding" at={102} volume={0.2} />
        </Col>
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(cmds)} volume={0.22} />
      </Cut>
    </>
  );
};

const Flow: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f % 50, [0, 50], [0, 1]);
  return (
    <div style={{ width: CONTENT_W, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: round, fontWeight: 800 }}>
      <div style={{ width: 230, height: 230, borderRadius: 40, background: C.panel, border: `8px solid ${C.gold}`, color: C.white, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1 }}>
        CLI SDK
      </div>
      <div style={{ position: "relative", flex: 1, height: 12, margin: "0 20px", background: C.gold, borderRadius: 6 }}>
        <div style={{ position: "absolute", left: `${x * 92}%`, top: -22, width: 56, height: 56, borderRadius: 28, background: C.green }} />
      </div>
      <div style={{ width: 230, height: 230, borderRadius: 40, background: C.green, color: C.ink, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: 1.05, fontFamily: mono, overflowWrap: "anywhere" }}>
        127.0.0.1 :9297
      </div>
    </div>
  );
};

const S8: React.FC = () => {
  const cmds = sc(7).commands;
  return (
    <>
      <Cut scene={7} from={0} to={150} sfx="thud">
        <Stage tint="#1a2a8a" />
        <Col top={SAFE.top + 20} gap={60}>
          <Panel h={380} size={90}>
            Trỏ <span style={{ color: C.gold }}>CLI</span> và <span style={{ color: C.gold }}>SDK</span> về emulator
          </Panel>
          <Flow />
        </Col>
      </Cut>
      <Cut scene={7} from={150} to={380}>
        <Stage tint="#1a0f6a" />
        <Col top={SAFE.top + 20} gap={44}>
          <Terminal cmds={cmds} width={CONTENT_W} fontSize={36} minHeight={400} {...TERM} />
          <Btn letter="A" text={sc(7).lines[0]} at={110} state="right" stateAt={130} size={48} h={190} mono />
          <Sfx id="ding" at={130} volume={0.2} />
        </Col>
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(cmds)} volume={0.22} />
      </Cut>
      <Cut scene={7} from={380} to={LEN[7] + T}>
        <Stage tint="#3a0a24" />
        <Col justify="center" gap={50}>
          <Live st={(f) => ({ transform: `rotate(${Math.sin(f * 0.3) * 3}deg)` })}>
            <div style={{ fontFamily: round, fontWeight: 800, fontSize: 300, color: C.gold, lineHeight: 0.9 }}>!</div>
          </Live>
          <Btn letter="B" text={sc(7).lines[1]} at={8} state="right" stateAt={40} size={52} h={200} />
        </Col>
      </Cut>
    </>
  );
};

const S9: React.FC = () => {
  const cmds = sc(8).commands;
  return (
    <>
      <Cut scene={8} from={0} to={120} sfx="thud">
        <Stage tint="#1a0f6a" />
        <Col top={SAFE.top + 20} gap={44}>
          <Panel h={330} size={90}>
            Kiểm tra kết nối <span style={{ color: C.gold }}>mock</span>
          </Panel>
          <Terminal cmds={cmds} width={CONTENT_W} fontSize={44} minHeight={260} {...TERM} />
        </Col>
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(cmds)} volume={0.22} />
      </Cut>
      <Cut scene={8} from={120} to={235}>
        <Stage tint="#0f5a3a" />
        <Flash at={0} />
        <Col top={SAFE.top + 20} gap={50}>
          <Head h={300} size={90}>
            Kiểm tra kết nối <span style={{ color: C.gold }}>mock</span>
          </Head>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.white, textAlign: "center", whiteSpace: "nowrap" }}>aws sts get-caller-identity</div>
          <div style={{ fontFamily: round, fontWeight: 800, fontSize: 56, color: C.white }}>Account ID</div>
          <Live st={(f) => ({ transform: `scale(${0.85 + 0.15 * slam(f, 0, 16)})` })}>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 82, color: C.green, textShadow: `0 0 40px ${C.green}`, fontVariantNumeric: "tabular-nums" }}>000000000000</div>
          </Live>
        </Col>
      </Cut>
      <Cut scene={8} from={235} to={LEN[8] + T}>
        <Stage />
        <Confetti at={10} y={800} count={80} />
        <Col top={SAFE.top + 20} gap={50}>
          <Head h={300} size={90}>
            Kiểm tra kết nối <span style={{ color: C.gold }}>mock</span>
          </Head>
          <Panel h={340} size={42} style={{ fontFamily: mono, fontWeight: 700, color: C.green }}>
            arn:aws:iam::<wbr />000000000000:user/emulator
          </Panel>
          <Check at={14} size={220} />
        </Col>
      </Cut>
    </>
  );
};

const S10: React.FC = () => {
  const pump = usePump();
  return (
    <>
      <Cut scene={9} from={0} to={150} sfx="thud">
        <Footage file={SMILE} pos="50% 35%" dark={0.5} />
        <Col justify="center">
          <Panel h={560} size={112} pump={pump}>
            Lưu lại và <span style={{ color: C.gold }}>trải nghiệm</span>
          </Panel>
        </Col>
      </Cut>
      <Cut scene={9} from={150} to={310}>
        <Stage />
        <Confetti at={22} y={900} count={70} />
        <Col top={SAFE.top + 20} gap={44}>
          <Head h={280} size={84}>
            Lưu lại và <span style={{ color: C.gold }}>trải nghiệm</span>
          </Head>
          <Live st={(f) => ({ transform: `scale(${0.8 + 0.2 * slam(f, 0, 16)})` })}>
            <div style={{ fontFamily: round, fontWeight: 800, fontSize: 230, color: C.gold, lineHeight: 0.95, textShadow: `0 0 40px ${C.gold}` }}>Lưu</div>
          </Live>
          <Btn letter="A" text={sc(9).lines[0]} at={6} state="right" stateAt={20} size={54} h={210} />
        </Col>
      </Cut>
      <Cut scene={9} from={310} to={LEN[9]}>
        <Stage tint="#1a2a8a" />
        <Confetti at={22} y={900} count={90} />
        <Col top={SAFE.top + 20} gap={44}>
          <Head h={280} size={84}>
            Lưu lại và <span style={{ color: C.gold }}>trải nghiệm</span>
          </Head>
          <Live st={(f) => ({ transform: `scale(${0.8 + 0.2 * slam(f, 0, 16)})` })}>
            <div style={{ fontFamily: round, fontWeight: 800, fontSize: 200, color: C.green, lineHeight: 0.95, textShadow: `0 0 40px ${C.green}` }}>Follow</div>
          </Live>
          <Btn letter="B" text={sc(9).lines[1]} at={6} state="right" stateAt={20} size={52} h={230} />
        </Col>
      </Cut>
    </>
  );
};

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
const TRANSITIONS = [zoomPunch(), whip(1), flash(C.gold), whip(-1), zoomPunch(), whip(1), flash("#ffffff"), slide({ direction: "from-bottom" }), zoomPunch()] as const;

const voiceRanges: [number, number][] = ids.map((id, i) => [
  START[i],
  START[i] + Math.round((durations as Record<string, number>)[id] * FPS),
]);

const Quiz: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      {SCENES.flatMap((Scene, i) => {
        const items = [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={LEN[i] + (i < SCENES.length - 1 ? T : 0)}>
            <BaseCtx.Provider value={START[i]}>
              <Scene />
            </BaseCtx.Provider>
            <Voice slug={SLUG} id={ids[i]} />
            {i === 0 && <Brand />}
          </TransitionSeries.Sequence>,
        ];
        if (i < SCENES.length - 1) {
          items.push(
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={TRANSITIONS[i] as never}
              timing={linearTiming({ durationInFrames: T })}
            />,
          );
        }
        return items;
      })}
    </TransitionSeries>
    <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Quiz, durationInFrames: TOTAL };
void fade;
