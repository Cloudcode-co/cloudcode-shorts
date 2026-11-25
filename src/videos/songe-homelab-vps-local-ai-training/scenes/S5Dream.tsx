import { AbsoluteFill, Sequence } from "remotion";
import { C, grotesk } from "../palette";
import {
  BgVideo,
  Body,
  CutFlash,
  Head,
  LED,
  LiveBars,
  Mono,
  Panel,
  Rule,
  Spark,
  Stage,
  Status,
  rise,
  useRise,
} from "../parts";

const A_LEN = 252;

const GATE = [
  { label: "Agent im lặng", color: C.songe },
  { label: "Bộ nhớ trống", color: C.unsloth },
  { label: "Pin ổn định", color: C.warn },
];

const ShotA = () => {
  const head = useRise(6, 20);
  const gate = useRise(44, 18);
  const dream = useRise(120, 16);
  return (
    <Stage
      padTop={250 + 6}
      bleed={
        <BgVideo
          file="footage/man-sleeping-bed-bedroom-pixabay-132941.mp4"
          dark={0.66}
          position="50% 40%"
          trimBefore={30}
          rate={0.85}
        />
      }
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Rule index="02" color={C.songe} />
        <Status label="NIGHT" color={C.dim} />
      </div>
      <Head size={84} style={{ marginTop: 26, ...rise(head, 30) }}>
        Cơ chế Dream khi máy nhàn rỗi
      </Head>
      <Body size={40} color={C.dim} style={{ marginTop: 22, maxWidth: 600, ...rise(head, 20) }}>
        Bạn đi ngủ. Máy tính rảnh, bộ nhớ trống.
      </Body>

      <div style={{ flex: 1 }} />

      <Panel
        title="IDLE / GATE"
        right={<Status label="3/3" color={C.unsloth} />}
        tone={C.unsloth}
        style={{ ...rise(gate, 24) }}
        bodyStyle={{ gap: 0, paddingTop: 2, paddingBottom: 2 }}
      >
        {GATE.map((g, i) => (
          <div
            key={g.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "13px 0",
              borderBottom: i < GATE.length - 1 ? `1.5px solid ${C.line}` : "none",
            }}
          >
            <LED color={g.color} />
            <Body size={38} weight={500} style={{ flex: 1 }}>
              {g.label}
            </Body>
            <Mono size={34} color={C.unsloth}>PASS</Mono>
          </div>
        ))}
      </Panel>

      <div
        style={{
          ...rise(dream, 26),
          marginTop: 20,
          background: "rgba(8,12,17,0.9)",
          border: `1.5px solid ${C.songe}`,
          borderRadius: 7,
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Mono size={54} weight={700} color={C.songe}>DREAM</Mono>
        <Status label="RUNNING" color={C.songe} steady={false} />
        <div style={{ flex: 1 }} />
        <LiveBars color={C.songe} n={14} height={34} seed={9} />
      </div>
    </Stage>
  );
};

const Tick: React.FC<{ i: number; n: number }> = ({ i, n }) => {
  const a = Math.PI - (i / (n - 1)) * Math.PI;
  const r1 = 196;
  const r2 = i % 4 === 0 ? 178 : 186;
  const cx = 260;
  const cy = 240;
  return (
    <line
      x1={cx + Math.cos(a) * r1}
      y1={cy - Math.sin(a) * r1}
      x2={cx + Math.cos(a) * r2}
      y2={cy - Math.sin(a) * r2}
      stroke={C.lineHi}
      strokeWidth={2.5}
    />
  );
};

const GaugeShot = () => {
  const head = useRise(2, 16);
  const sweep = useRise(8, 70);
  const rows = useRise(18, 18);
  const stop = useRise(70, 16);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="02" color={C.songe} />
      <Head size={76} style={{ marginTop: 22, ...rise(head, 24) }}>
        Dream tự khởi động
      </Head>
      <Body size={38} color={C.dim} style={{ marginTop: 14, ...rise(head, 16) }}>
        Khi ba điều kiện cùng đúng, Dream bắt đầu.
      </Body>

      <svg
        width="100%"
        height={420}
        viewBox="0 0 520 300"
        style={{ display: "block", margin: "0 auto", maxWidth: 760 }}
      >
        {Array.from({ length: 25 }, (_, i) => (
          <Tick key={i} i={i} n={25} />
        ))}
        <path
          d="M 64 240 A 196 196 0 0 1 456 240"
          fill="none"
          stroke={C.line}
          strokeWidth={20}
          pathLength={100}
          strokeLinecap="butt"
        />
        <path
          d="M 64 240 A 196 196 0 0 1 456 240"
          fill="none"
          stroke={C.songe}
          strokeWidth={20}
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={100 - sweep * 82}
          strokeLinecap="butt"
        />
        <text
          x={260}
          y={196}
          textAnchor="middle"
          fill={C.text}
          fontFamily={grotesk}
          fontSize={64}
          fontWeight={800}
          letterSpacing={-2}
        >
          Dream
        </text>
        <text
          x={260}
          y={240}
          textAnchor="middle"
          fill={C.dim}
          fontFamily="monospace"
          fontSize={26}
        >
          idle compute
        </text>
      </svg>

      <Panel
        title="LEARN / WHILE AWAY"
        right={<Status label="AUTO" color={C.songe} />}
        tone={C.songe}
        style={{ ...rise(rows, 14), flex: 1, minHeight: 0, marginTop: 16 }}
        bodyStyle={{ gap: 0, paddingTop: 2, paddingBottom: 2, justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderBottom: `1.5px solid ${C.line}` }}>
          <LED color={C.songe} />
          <Body size={38} style={{ flex: 1 }}>Chỉ chạy khi agent nghỉ</Body>
          <Mono size={34} color={C.songe}>IDLE</Mono>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0", borderBottom: `1.5px solid ${C.line}` }}>
          <LED color={C.unsloth} />
          <Body size={38} style={{ flex: 1 }}>Chờ bộ nhớ trống</Body>
          <Mono size={34} color={C.unsloth}>FREE</Mono>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 0" }}>
          <LED color={C.alarm} steady={false} />
          <Body size={38} style={{ flex: 1 }}>Dừng ngay khi bạn quay lại</Body>
          <Mono size={34} color={C.alarm}>STOP</Mono>
        </div>
      </Panel>
      <div style={{ ...rise(stop, 16), marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Mono size={34} color={C.faint}>idle compute</Mono>
        <div style={{ width: 200 }}>
          <Spark color={C.songe} seed={2} amp={10} height={34} />
        </div>
      </div>
    </Stage>
  );
};

export const S5Dream: React.FC<{ len: number }> = ({ len }) => (
  <AbsoluteFill>
    <Sequence name="dream: night gate" durationInFrames={A_LEN}>
      <ShotA />
    </Sequence>
    <Sequence name="dream: gauge" from={A_LEN} durationInFrames={len - A_LEN}>
      <GaugeShot />
    </Sequence>
        <CutFlash at={252} color={C.songe} frames={6} />
  </AbsoluteFill>
);
