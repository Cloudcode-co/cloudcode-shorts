import { Img, interpolate, useCurrentFrame, Easing } from "remotion";
import { BRAND_SPACE, SAFE, mono, sans } from "../../../kit";
import { C, a } from "../palette";
import { Headline, Lamp, Panel, Scene, appear, rise } from "../ui";

// 0.070 s to /init and 0.300 s to the Alpine prompt are the project's measured
// boot numbers.
const BOOT_MS = 300;
const INIT_MS = 70;

const Ruler: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ position: "relative", height: 92, marginTop: 4 }}>
    <div
      style={{ position: "absolute", left: 0, right: 0, top: 30, height: 2, background: C.line }}
    />
    {Array.from({ length: 21 }, (_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${i * 5}%`,
          top: i % 5 === 0 ? 22 : 26,
          width: 2,
          height: i % 5 === 0 ? 20 : 12,
          background: i % 5 === 0 ? C.lineLit : C.line,
          transform: "translateX(-1px)",
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        left: `${Math.min(1, p) * 100}%`,
        top: 8,
        width: 3,
        height: 48,
        background: C.mint,
        boxShadow: `0 0 16px ${C.mint}aa`,
        transform: "translateX(-50%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 62,
        fontFamily: mono,
        fontSize: 34,
        color: C.faint,
      }}
    >
      0
    </div>
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 62,
        fontFamily: mono,
        fontSize: 34,
        color: C.dim,
      }}
    >
      1.000 s
    </div>
  </div>
);

const TraceLine: React.FC<{ t: string; text: string; on: boolean; color: string }> = ({
  t,
  text,
  on,
  color,
}) => (
  <div
    style={{
      display: "flex",
      gap: 22,
      alignItems: "baseline",
      fontFamily: mono,
      fontSize: 36,
      opacity: on ? 1 : 0.16,
    }}
  >
    <span style={{ color: C.faint, fontVariantNumeric: "tabular-nums" }}>{t}</span>
    <span style={{ color: on ? color : C.dim }}>{text}</span>
  </div>
);

export const Hook: React.FC<{ len: number }> = () => {
  const f = useCurrentFrame();
  const head = appear(f, 4, 18);
  const body = appear(f, 12, 20);
  const rows = appear(f, 64, 16);

  const countP = interpolate(f, [22, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ms = BOOT_MS * countP;
  const ready = ms >= BOOT_MS - 0.5;
  const pastInit = ms >= INIT_MS;
  const blink = Math.floor(f / 18) % 2 === 0;

  return (
    <Scene padTop={SAFE.top + BRAND_SPACE} style={{ gap: 26 }}>
      <Headline size={90} style={rise(head, 30)}>
        Linux trên web dưới 1 giây
      </Headline>

      <Panel
        tone={ready ? "mint" : "amber"}
        style={{ ...rise(body, 34), flex: 1, display: "flex", flexDirection: "column" }}
        bodyStyle={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 12,
        }}
        title={
          <>
            <Img
              src={a("repos/pithings.png")}
              style={{ width: 46, height: 46, borderRadius: 23, background: "#fff" }}
            />
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 38 }}>unkernel</span>
            <span
              style={{
                fontFamily: mono,
                fontSize: 34,
                color: ready ? C.mint : C.amber,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                whiteSpace: "nowrap",
              }}
            >
              <Lamp color={ready ? C.mint : C.amber} size={13} />
              {ready ? "shell ready" : "booting"}
            </span>
          </>
        }
        right={
          <span style={{ fontFamily: mono, fontSize: 34, color: C.dim }}>boot</span>
        }
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
          <span
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 164,
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              color: C.text,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {(ms / 1000).toFixed(3)}
          </span>
          <span style={{ fontFamily: mono, fontSize: 58, color: C.mint, paddingBottom: 12 }}>s</span>
        </div>

        <Ruler p={ms / 1000} />

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <TraceLine t="0.000" text="nạp module wasm" on color={C.text} />
          <TraceLine t="0.070" text="kernel chạm /init" on={pastInit} color={C.text} />
          <TraceLine
            t="0.300"
            text="Alpine shell"
            on={ready}
            color={ready ? C.mint : C.text}
          />
          <div
            style={{
              width: 20,
              height: 28,
              marginLeft: 118,
              marginTop: 2,
              background: ready && blink ? C.mint : C.line,
            }}
          />
        </div>
      </Panel>

      <div style={{ ...rise(rows, 22), display: "flex", flexDirection: "column" }}>
        {["Khởi động shell tức thì", "Không cần server backend"].map((line) => (
          <div
            key={line}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderTop: `1px solid ${C.line}`,
              padding: "12px 0",
              fontFamily: sans,
              fontWeight: 700,
              fontSize: 36,
              lineHeight: 1.16,
              color: C.text,
            }}
          >
            <Lamp color={C.mint} size={12} />
            {line}
          </div>
        ))}
      </div>
    </Scene>
  );
};
