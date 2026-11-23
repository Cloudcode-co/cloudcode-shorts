import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SAFE } from "../../../kit";
import {
  Area,
  Avatar,
  Backdrop,
  LowerThird,
  StarNumber,
  rise,
  slide,
  useAt,
} from "../bits";
import { C, a } from "../theme";
import type { SceneProps } from "./types";

const SERVER = a("footage/data-center-server-racks-pixabay-242599.mp4");

// The 5s clip is slowed to 0.6x and looped over a 500-frame pass.
const LOOP = { clipFrames: 300, loopFrames: 500, rate: 0.6 };

// ---------------------------------------------------------------------------
// s7 — story 2: rust-anything, introduced on its card at the drop.
// ---------------------------------------------------------------------------

const RustCard: React.FC = () => {
  const slab = useAt(0, 12);
  const num = useAt(3, 12);
  const name = useAt(7, 12);
  const sub = useAt(13, 12);
  const panel = useAt(26, 14);
  return (
    <>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 520,
          background: C.navyMid,
          borderLeft: "6px solid rgba(255,255,255,0.8)",
          transform: `translateX(${(1 - slab) * 100}%)`,
        }}
      />
      <div
        style={{
          ...rise(num, 20),
          position: "absolute",
          left: 620,
          top: 498,
          fontSize: 230,
          fontWeight: 900,
          lineHeight: 0.82,
          color: C.red,
          letterSpacing: -6,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        02
      </div>
      <div
        style={{
          ...rise(name, 24),
          position: "absolute",
          left: SAFE.left,
          top: 690,
          width: 557,
          fontSize: 68,
          fontWeight: 900,
          color: C.white,
          letterSpacing: -1,
          lineHeight: 1.05,
          whiteSpace: "nowrap",
        }}
      >
        rust-anything
      </div>
      <div
        style={{
          ...rise(sub, 20),
          position: "absolute",
          left: SAFE.left,
          top: 782,
          width: 500,
          fontSize: 40,
          fontWeight: 600,
          color: C.steel,
        }}
      >
        Rewrite từng bước
      </div>

      <div
        style={{
          ...rise(panel, 58),
          position: "absolute",
          left: SAFE.left,
          top: 862,
          width: 557,
          height: 306,
          background: "rgba(4, 18, 40, 0.96)",
          border: "2px solid rgba(255,255,255,0.75)",
          borderTop: `10px solid ${C.red}`,
          padding: "20px 22px 22px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar
            src={a("repos/erkamyaman.png")}
            size={96}
            style={{ border: `4px solid ${C.white}` }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: C.white, lineHeight: 1.1 }}>
              rust-anything
            </div>
            <div style={{ fontSize: 34, fontWeight: 600, color: C.steel, marginTop: 4 }}>
              Rust · MIT
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 44, color: C.red, lineHeight: 1 }}>★</span>
          <StarNumber to={8033} at={26} style={{ fontSize: 84, fontWeight: 900, color: C.white, lineHeight: 0.9 }} />
          <span style={{ fontSize: 34, fontWeight: 600, color: C.steel }}>sao</span>
        </div>
      </div>
    </>
  );
};

const STEPS = [
  { n: "01", text: "Chuyển đổi từng phần ứng dụng" },
  { n: "02", text: "Kiểm thử hành vi byte-for-byte" },
  { n: "03", text: "Tiến tới pure Rust bằng app lift" },
];

const StepRow: React.FC<{ step: { n: string; text: string }; i: number }> = ({ step, i }) => {
  const p = useAt(190 + i * 58, 13);
  return (
    <div
      style={{
        ...slide(p, -52),
        position: "absolute",
        left: i * 66,
        top: 120 + i * 178,
        width: 660,
        height: 156,
        background: "rgba(4, 18, 40, 0.92)",
        borderLeft: `8px solid ${C.red}`,
        padding: "22px 24px",
        boxSizing: "border-box",
        display: "flex",
        gap: 18,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          color: C.red,
          lineHeight: 1.2,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {step.n}
      </div>
      <div style={{ fontSize: 46, fontWeight: 700, color: C.white, lineHeight: 1.2 }}>
        {step.text}
      </div>
    </div>
  );
};

const RustSteps: React.FC = () => {
  const head = useAt(182, 12);
  return (
    <Area top={520}>
      <div style={{ ...rise(head, 24), fontSize: 58, fontWeight: 900, color: C.white }}>
        Chuyển từng phần
      </div>
      {STEPS.map((step, i) => (
        <StepRow key={step.n} step={step} i={i} />
      ))}
    </Area>
  );
};

export const RustIntro: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop
        src={SERVER}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        pos="50% 52%"
        dim={0.4}
        {...LOOP}
      />
      {f < 180 ? <RustCard /> : <RustSteps />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// s8 — json-server: 79-85ms to 8-10ms, 74MB to 3.5MB.
// ---------------------------------------------------------------------------

const FrtShot: React.FC = () => {
  const head = useAt(4, 12);
  const sub = useAt(18, 12);
  const beforeP = useAt(10, 12);
  const afterP = useAt(255, 14);
  return (
    <Area top={520}>
      <div
        style={{
          ...rise(head, 24),
          fontSize: 58,
          fontWeight: 900,
          color: C.white,
          lineHeight: 1.05,
        }}
      >
        <div>Khởi động và</div>
        <div>phản hồi tức thì</div>
      </div>
      <div
        style={{
          ...slide(sub, -30),
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 38,
          fontWeight: 700,
          color: C.steel,
        }}
      >
        <div style={{ width: 14, height: 14, background: C.red }} />
        json-server chuyển hẳn sang Rust
      </div>

      <div style={{ ...rise(beforeP, 24), marginTop: 30 }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: C.steel }}>
          THỜI GIAN PHẢN HỒI ĐẦU TIÊN · TRƯỚC
        </div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            color: "rgba(244,248,254,0.72)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          79–85 ms
        </div>
        <div style={{ marginTop: 10, height: 36, width: 640, background: C.red, opacity: 0.9 }} />
      </div>

      <div style={{ ...rise(afterP, 30), marginTop: 58 }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: C.red }}>SAU</div>
        <div
          style={{
            fontSize: 140,
            fontWeight: 900,
            color: C.white,
            lineHeight: 0.98,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          8–10 ms
        </div>
        <div
          style={{
            marginTop: 10,
            height: 36,
            width: Math.max(10, 640 * (10 / 85)) * afterP,
            background: C.white,
          }}
        />
      </div>
    </Area>
  );
};

const RamShot: React.FC = () => {
  const beforeP = useAt(336, 12);
  const afterP = useAt(400, 14);
  return (
    <Area top={520}>
      <div style={{ fontSize: 34, fontWeight: 700, color: C.steel }}>RAM KHI IDLE</div>
      <div style={{ ...rise(beforeP, 24), marginTop: 18 }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: C.steel }}>TRƯỚC</div>
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            color: "rgba(244,248,254,0.72)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          74 MB
        </div>
        <div style={{ marginTop: 12, height: 40, width: 640, background: C.red, opacity: 0.9 }} />
      </div>
      <div style={{ ...rise(afterP, 30), marginTop: 48 }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: C.red }}>SAU</div>
        <div
          style={{
            fontSize: 164,
            fontWeight: 900,
            color: C.white,
            lineHeight: 0.98,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          3,5 MB
        </div>
        <div
          style={{
            marginTop: 12,
            height: 40,
            width: Math.max(10, 640 * (3.5 / 74)) * afterP,
            background: C.white,
          }}
        />
      </div>
      <LowerThird at={470} kicker="BINARY THUẦN" text="Chạy không cần runtime" />
    </Area>
  );
};

export const Board: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop
        src={SERVER}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        pos="50% 48%"
        dim={0.44}
        {...LOOP}
      />
      {f < 330 ? <FrtShot /> : <RamShot />}
    </AbsoluteFill>
  );
};
