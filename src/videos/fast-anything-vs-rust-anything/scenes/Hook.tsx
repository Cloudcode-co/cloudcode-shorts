import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Brand } from "../../../kit";
import { Area, Backdrop, RedSquare, rise, slide, useAt } from "../bits";
import { C, a } from "../theme";
import type { SceneProps } from "./types";

const KEYBOARD = a("footage/developer-at-desk-night-pixabay-232538.mp4");
const EYES = a("footage/programming-code-screen-close-up-pixabay-303927.mp4");

const OpenTitle: React.FC = () => {
  const a1 = useAt(2, 10);
  const a2 = useAt(6, 11);
  const rule = useAt(10, 10);
  const date = useAt(12, 10);
  const sub = useAt(16, 10);
  const topic = useAt(20, 10);
  return (
    <Area
      top={334}
      style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
    >
      <div
        style={{
          ...rise(a1, 20),
          fontSize: 62,
          fontWeight: 700,
          color: C.steel,
          lineHeight: 1,
        }}
      >
        BẢN TIN
      </div>
      <div
        style={{
          ...rise(a2, 30),
          fontSize: 108,
          fontWeight: 900,
          color: C.white,
          lineHeight: 1.02,
          letterSpacing: -2,
          marginTop: 2,
          whiteSpace: "nowrap",
        }}
      >
        CÔNG NGHỆ
      </div>
      <div
        style={{
          height: 10,
          width: 260,
          background: C.red,
          marginTop: 26,
          transform: `scaleX(${rule})`,
          transformOrigin: "0% 50%",
        }}
      />
      <div
        style={{
          ...rise(date, 16),
          marginTop: 22,
          fontSize: 50,
          fontWeight: 800,
          color: C.red,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        23.11
      </div>
      <div
        style={{
          ...rise(sub, 16),
          marginTop: 12,
          fontSize: 36,
          fontWeight: 600,
          color: C.steel,
          lineHeight: 1.3,
        }}
      >
        TỐI ƯU BACKEND TRÊN VPS
      </div>
      <div
        style={{
          ...rise(topic, 16),
          marginTop: 22,
          fontSize: 34,
          fontWeight: 600,
          color: C.steelDim,
          lineHeight: 1.3,
        }}
      >
        FAST-ANYTHING VS RUST-ANYTHING
      </div>
    </Area>
  );
};

const HookShot: React.FC = () => {
  const head = useAt(0, 12);
  const head2 = useAt(6, 12);
  const numL = useAt(40, 11);
  const numR = useAt(46, 11);
  const bar = useAt(56, 12);
  const l1 = useAt(70, 12);
  const l2 = useAt(86, 12);

  return (
    <Area top={334}>
      <div
        style={{
          fontSize: 112,
          fontWeight: 900,
          color: C.white,
          lineHeight: 1.02,
          letterSpacing: -2,
        }}
      >
        <div style={rise(head, 26)}>Viết lại 5%</div>
        <div style={rise(head2, 26)}>hay toàn bộ?</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 72,
        }}
      >
        <div style={rise(numL, 22)}>
          <div
            style={{
              fontSize: 150,
              fontWeight: 900,
              color: C.red,
              lineHeight: 0.9,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            5%
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.steel, marginTop: 10 }}>
            CODE GÂY NGHẼN
          </div>
        </div>
        <div style={{ textAlign: "right", ...rise(numR, 22) }}>
          <div
            style={{
              fontSize: 150,
              fontWeight: 900,
              color: C.white,
              lineHeight: 0.9,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            95%
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.steel, marginTop: 10 }}>
            GIỮ NGUYÊN
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 34,
          height: 16,
          width: "100%",
          background: "#0D2A4E",
          transform: `scaleX(${bar})`,
          transformOrigin: "0% 50%",
          display: "flex",
        }}
      >
        <div style={{ width: "5%", background: C.red, height: "100%" }} />
        <div style={{ width: "95%", background: C.white, opacity: 0.82, height: "100%" }} />
      </div>

      <div style={{ marginTop: 54, display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            ...rise(l1, 20),
            fontSize: 48,
            fontWeight: 700,
            color: C.white,
            lineHeight: 1.2,
          }}
        >
          Chỉ 5% code thực sự gây nghẽn
        </div>
        <div
          style={{
            ...rise(l2, 20),
            fontSize: 38,
            fontWeight: 600,
            color: C.steel,
            lineHeight: 1.3,
          }}
        >
          Có nên rewrite cả backend sang Rust?
        </div>
      </div>
    </Area>
  );
};

export const Open: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop
        src={KEYBOARD}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        pos="50% 58%"
        dim={0.46}
      />
      {f < 54 ? <OpenTitle /> : <HookShot />}
      {f < 54 ? <Brand /> : null}
    </AbsoluteFill>
  );
};

const COSTS = [
  { n: "01", text: "Mất hàng tháng chuyển đổi" },
  { n: "02", text: "Biên dịch lâu, tốn dung lượng" },
  { n: "03", text: "Dễ phát sinh lỗi logic ngầm" },
];

export const Price: React.FC<SceneProps> = ({ start, storyStart, storyEnd }) => {
  const head = useAt(8, 13);
  const sub = useAt(22, 12);
  return (
    <AbsoluteFill>
      <Backdrop
        src={EYES}
        globalStart={start}
        storyStart={storyStart}
        storyEnd={storyEnd}
        trimBefore={30}
        pos="50% 44%"
        dim={0.32}
      />
      <Area top={334}>
        <div
          style={{
            ...rise(head, 26),
            fontSize: 86,
            fontWeight: 900,
            color: C.white,
            lineHeight: 1.04,
            letterSpacing: -1,
          }}
        >
          <div>Cái giá của</div>
          <div>rewrite toàn bộ</div>
        </div>
        <div
          style={{
            ...slide(sub, -26),
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <RedSquare size={14} />
          <div style={{ fontSize: 38, fontWeight: 700, color: C.steel }}>
            Ba khoản chi phí, một lần rewrite
          </div>
        </div>

        <div style={{ marginTop: 42, display: "flex", flexDirection: "column" }}>
          {COSTS.map((row, i) => (
            <CostRow key={row.n} row={row} at={58 + i * 82} />
          ))}
        </div>
      </Area>
    </AbsoluteFill>
  );
};

const CostRow: React.FC<{ row: { n: string; text: string }; at: number }> = ({ row, at }) => {
  const p = useAt(at, 13);
  return (
    <div
      style={{
        ...slide(p, -44),
        display: "flex",
        alignItems: "center",
        gap: 24,
        borderTop: "2px solid rgba(255,255,255,0.16)",
        padding: "34px 0 34px",
        minHeight: 190,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: C.red,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          fontWeight: 800,
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {row.n}
      </div>
      <div style={{ fontSize: 48, fontWeight: 700, color: C.white, lineHeight: 1.2 }}>
        {row.text}
      </div>
    </div>
  );
};
