import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SAFE } from "../../../kit";
import { Terminal } from "../Terminal";
import {
  Area,
  Avatar,
  Backdrop,
  LowerThird,
  RedSquare,
  StarNumber,
  rise,
  slide,
  useAt,
} from "../bits";
import { C, a } from "../theme";
import type { SceneProps } from "./types";

const DEV = a("footage/coding-laptop-night-pixabay-348042.mp4");

// ---------------------------------------------------------------------------
// s9 — story 3: the tool does not translate, it measures and verifies.
// ---------------------------------------------------------------------------

const FlowCard: React.FC = () => {
  const band = useAt(0, 12);
  const num = useAt(3, 12);
  const title = useAt(7, 12);
  const sub = useAt(15, 12);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 700,
          height: 200,
          background: C.red,
          clipPath: `inset(0 ${(1 - band) * 100}% 0 0)`,
        }}
      />
      <div
        style={{
          ...rise(num, 18),
          position: "absolute",
          left: SAFE.left,
          top: 722,
          fontSize: 180,
          fontWeight: 900,
          lineHeight: 0.9,
          color: C.white,
          letterSpacing: -4,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        03
      </div>
      <div
        style={{
          ...rise(title, 20),
          position: "absolute",
          left: 400,
          top: 748,
          fontSize: 88,
          fontWeight: 900,
          lineHeight: 1,
          color: C.white,
          letterSpacing: -1,
        }}
      >
        QUY TRÌNH
      </div>
      <div
        style={{
          ...rise(sub, 20),
          position: "absolute",
          left: SAFE.left,
          top: 960,
          width: 700,
          fontSize: 48,
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.2,
        }}
      >
        AI viết, công cụ kiểm chứng
      </div>
    </>
  );
};

const NODES = [
  {
    kicker: "BƯỚC 1",
    main: "Coding agent viết Rust",
    sub: "Claude Code · Codex · Cursor",
  },
  {
    kicker: "BƯỚC 2",
    main: "Công cụ verify & gate",
    sub: "Đo lường và xác minh",
  },
  {
    kicker: "BƯỚC 3",
    main: "Bật Rust khi mọi ca khớp",
    sub: "Không khớp thì từ chối",
  },
];

const Node: React.FC<{ node: (typeof NODES)[number]; i: number }> = ({ node, i }) => {
  const p = useAt(58 + i * 80, 13);
  return (
    <div
      style={{
        ...slide(p, -44),
        position: "absolute",
        left: 0,
        top: 90 + i * 180,
        width: 720,
        height: 150,
        background: "rgba(3, 15, 32, 0.94)",
        borderLeft: `9px solid ${C.red}`,
        borderTop: "2px solid rgba(255,255,255,0.14)",
        padding: "12px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 800, color: C.red, lineHeight: 1.1 }}>
        {node.kicker}
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, color: C.white, lineHeight: 1.12 }}>
        {node.main}
      </div>
      <div style={{ fontSize: 34, fontWeight: 600, color: C.steel, lineHeight: 1.15 }}>
        {node.sub}
      </div>
    </div>
  );
};

const Connector: React.FC<{ at: number; top: number }> = ({ at, top }) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, (f - at) / 9));
  return (
    <div style={{ position: "absolute", left: 360, top, width: 4, height: 30 }}>
      <div
        style={{
          width: 4,
          height: 30,
          background: C.white,
          transform: `scaleY(${p})`,
          transformOrigin: "50% 0%",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -7,
          top: 28,
          width: 0,
          height: 0,
          borderLeft: "9px solid transparent",
          borderRight: "9px solid transparent",
          borderTop: `12px solid ${C.red}`,
          opacity: p,
        }}
      />
    </div>
  );
};

const FlowShot: React.FC = () => {
  const head = useAt(58, 12);
  return (
    <Area top={520}>
      <div style={{ ...rise(head, 22), fontSize: 48, fontWeight: 900, color: C.white }}>
        AI viết, công cụ kiểm chứng
      </div>
      {NODES.map((node, i) => (
        <Node key={node.kicker} node={node} i={i} />
      ))}
      <Connector at={100} top={240} />
      <Connector at={180} top={420} />
      <LowerThird at={232} kicker="TRƯỚC KHI CHẠY" text="Chạy trên staging để tránh side-effect" />
    </Area>
  );
};

export const Flow: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop
        src={DEV}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        dim={0.38}
      />
      {f < 55 ? <FlowCard /> : <FlowShot />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// s10 — install, typed for real.
// ---------------------------------------------------------------------------

export const COMMANDS = [
  "npm i -g @el4cteo/fast-anything",
  "fast-anything go --agent claude -- python app.py",
];

export const Install: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const head = useAt(6, 12);
  const logo = useAt(16, 12);
  const term = useAt(26, 14);
  const r1 = useAt(106, 12);
  const r2 = useAt(128, 12);
  return (
    <AbsoluteFill>
      <Backdrop
        src={DEV}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        trimBefore={30}
        dim={0.5}
      />
      <Area top={520}>
        <div style={{ ...rise(head, 24), fontSize: 62, fontWeight: 900, color: C.white }}>
          Cài đặt và sử dụng
        </div>
        <div
          style={{
            ...rise(logo, 20),
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 16,
          }}
        >
          <Avatar src={a("repos/EL4CTEO.png")} size={84} style={{ border: `3px solid ${C.white}` }} />
          <div style={{ fontSize: 42, fontWeight: 800, color: C.white }}>fast-anything</div>
        </div>
        <div style={{ ...rise(term, 26), marginTop: 24 }}>
          <Terminal
            cmds={COMMANDS}
            width={777}
            fontSize={34}
            minHeight={300}
            bg="#030F1F"
            fg={C.white}
            accent={C.red}
          />
        </div>
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ ...slide(r1, -26), display: "flex", alignItems: "center", gap: 14 }}>
            <RedSquare size={14} />
            <span style={{ fontSize: 40, fontWeight: 700, color: C.white }}>
              Cài đặt một lệnh duy nhất
            </span>
          </div>
          <div style={{ ...slide(r2, -26), display: "flex", alignItems: "center", gap: 14 }}>
            <RedSquare size={14} />
            <span style={{ fontSize: 40, fontWeight: 700, color: C.white }}>
              Yêu cầu sẵn Rust toolchain
            </span>
          </div>
        </div>
      </Area>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// s11 — outro: recap, then the question the whole bulletin asked.
// ---------------------------------------------------------------------------

const RecapRow: React.FC<{
  src: string;
  name: string;
  stars: number;
  top: number;
  at: number;
}> = ({ src, name, stars, top, at }) => {
  const p = useAt(at, 13);
  return (
    <div
      style={{
        ...rise(p, 30),
        position: "absolute",
        left: 0,
        top,
        width: 777,
        height: 140,
        background: "rgba(3, 15, 32, 0.92)",
        borderLeft: `9px solid ${C.red}`,
        borderTop: "2px solid rgba(255,255,255,0.14)",
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 22px",
        boxSizing: "border-box",
      }}
    >
      <Avatar src={src} size={92} style={{ border: `3px solid ${C.white}` }} />
      <div style={{ flex: 1, minWidth: 0, fontSize: 44, fontWeight: 800, color: C.white }}>
        {name}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 40, color: C.red }}>★</span>
        <StarNumber
          to={stars}
          at={at}
          dur={20}
          style={{ fontSize: 56, fontWeight: 900, color: C.white }}
        />
      </div>
    </div>
  );
};

const OutroRecap: React.FC = () => {
  const head = useAt(4, 12);
  const sub = useAt(16, 12);
  const cta = useAt(96, 12);
  const cta2 = useAt(118, 12);
  return (
    <Area top={520}>
      <div style={{ ...rise(head, 24), fontSize: 64, fontWeight: 900, color: C.white }}>
        Tối ưu ngay trên VPS
      </div>
      <div style={{ ...rise(sub, 20), marginTop: 6, fontSize: 36, fontWeight: 600, color: C.steel }}>
        Hai công cụ, hai cách tối ưu
      </div>
      <RecapRow src={a("repos/EL4CTEO.png")} name="fast-anything" stars={1971} top={128} at={40} />
      <RecapRow
        src={a("repos/erkamyaman.png")}
        name="rust-anything"
        stars={8033}
        top={286}
        at={52}
      />
      <div
        style={{
          ...rise(cta, 20),
          position: "absolute",
          left: 0,
          top: 470,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <RedSquare size={14} />
        <span style={{ fontSize: 44, fontWeight: 700, color: C.white }}>
          Lưu video để áp dụng sau
        </span>
      </div>
      <div
        style={{
          ...rise(cta2, 20),
          position: "absolute",
          left: 0,
          top: 546,
          fontSize: 36,
          fontWeight: 600,
          color: C.steel,
        }}
      >
        Follow để đón xem mẹo backend tiếp theo!
      </div>
    </Area>
  );
};

const OutroQuestion: React.FC = () => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, (f - 182) / 14));
  const cta = useAt(250, 12);
  return (
    <Area top={520}>
      <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
        <div style={{ fontSize: 86, fontWeight: 900, color: C.white, lineHeight: 1.02 }}>
          Viết lại toàn bộ
        </div>
        <div
          style={{
            fontSize: 104,
            fontWeight: 900,
            color: C.white,
            lineHeight: 1.02,
            letterSpacing: -2,
          }}
        >
          hay chỉ <span style={{ color: C.red }}>5%</span>?
        </div>
      </div>
      <div style={{ marginTop: 36, height: 18, width: "100%", background: "#0D2A4E", display: "flex" }}>
        <div style={{ width: "5%", background: C.red, height: "100%" }} />
        <div style={{ width: "95%", background: C.white, opacity: 0.82, height: "100%" }} />
      </div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: C.red }}>5% VIẾT LẠI</span>
        <span style={{ fontSize: 36, fontWeight: 800, color: C.white }}>95% GIỮ NGUYÊN</span>
      </div>

      <div
        style={{
          ...rise(cta, 34),
          position: "absolute",
          left: 0,
          right: 0,
          top: 420,
          background: C.red,
          padding: "30px 26px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 900, color: C.white, lineHeight: 1.1 }}>
          LƯU VIDEO
        </div>
        <div style={{ fontSize: 46, fontWeight: 900, color: C.white, lineHeight: 1.1 }}>
          THEO DÕI KÊNH
        </div>
      </div>
    </Area>
  );
};

export const Outro: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop
        src={DEV}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        trimBefore={60}
        dim={0.44}
      />
      {f < 180 ? <OutroRecap /> : <OutroQuestion />}
    </AbsoluteFill>
  );
};
