import { interpolate, useCurrentFrame } from "remotion";
import { mono, sans } from "../../../kit";
import { C } from "../palette";
import { Headline, Label, Meter, Panel, Scene, Status, appear, rise } from "../ui";

const Row: React.FC<{
  name: string;
  value: string;
  p: number;
  color: string;
  dim?: boolean;
}> = ({ name, value, p, color, dim }) => (
  <div
    style={{
      ...rise(p, 12),
      display: "flex",
      alignItems: "center",
      gap: 18,
      height: 72,
      opacity: (dim ? 0.75 : 1) * p,
    }}
  >
    <span style={{ fontFamily: sans, fontSize: 40, fontWeight: 700, color: C.text, width: 220 }}>
      {name}
    </span>
    <Meter p={p * (Number(value.replace(/[^\d.]/g, "")) / 80)} color={color} height={22} style={{ flex: 1 }} />
    <span
      style={{
        fontFamily: mono,
        fontSize: 38,
        color,
        width: 126,
        textAlign: "right",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </span>
  </div>
);

export const Fork: React.FC<{ len: number }> = () => {
  const f = useCurrentFrame();
  const head = appear(f, 2, 16);
  const hero = appear(f, 10, 22);
  const hit = f < 68 ? 0 : interpolate(f - 68, [0, 9], [0, 1], { extrapolateRight: "clamp" });
  const slam = f < 68 ? 0 : interpolate(f - 68, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });
  const shake = f >= 68 && f < 82 ? Math.sin((f - 68) * 2.6) * 4 * (1 - (f - 68) / 14) : 0;
  const scale = f < 68 ? 0.92 : 0.92 + slam * 0.08;
  const rowsA = appear(f, 56, 18);
  const rowNative = appear(f, 72, 16);
  const qemu = appear(f, 120, 20);

  return (
    <Scene style={{ gap: 20 }}>
      <div style={{ translate: `${shake}px 0`, display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
        <Headline size={78} style={rise(head, 28)}>
          Fork 60 µs
          <br />
          nhanh hơn native
        </Headline>

        <div
          style={{
            ...rise(hero, 30),
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            opacity: hero,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 300,
                lineHeight: 0.82,
                letterSpacing: "-0.06em",
                color: hit > 0 ? C.mint : C.text,
                fontVariantNumeric: "tabular-nums",
                scale,
                transformOrigin: "left bottom",
              }}
            >
              60
            </span>
            <span
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 104,
                lineHeight: 1,
                color: C.mint,
                letterSpacing: "-0.02em",
              }}
            >
              µs
            </span>
          </div>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14 }}>
            <Label color={C.dim}>fork + exit + wait</Label>
            <span
              style={{
                width: 10,
                height: 10,
                background: C.mint,
                opacity: hit > 0 ? 1 : 0.2,
              }}
            />
            <span style={{ fontFamily: mono, fontSize: 34, color: C.mint }}>đo trên máy thật</span>
          </div>
        </div>

        <Panel
          tone="mint"
          style={rise(rowsA, 24)}
          bodyStyle={{ display: "flex", flexDirection: "column" }}
          title={
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 40 }}>
              cùng thang đo
            </span>
          }
          right={<Label color={C.dim}>0 - 80 µs</Label>}
        >
          <Row name="unkernel" value="60 µs" p={rowsA} color={C.mint} />
          <Row name="native" value="70 µs" p={rowNative} color={C.text} />
        </Panel>

        <div
          style={{
            ...rise(qemu, 26),
            border: `1px solid ${C.line}`,
            borderTop: `3px solid ${C.red}`,
            borderRadius: 8,
            background: C.panel,
            padding: "18px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <Status color={C.red}>qemu-system</Status>
            <span style={{ fontFamily: mono, fontSize: 34, color: C.dim }}>whole-machine</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 8 }}>
            <span
              style={{
                fontFamily: mono,
                fontSize: 64,
                fontWeight: 700,
                color: C.red,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              1.2 ms
            </span>
            <span style={{ fontFamily: sans, fontSize: 34, color: C.dim }}>chậm hơn 20 lần</span>
          </div>
          <Meter p={qemu} color={C.red} height={14} style={{ marginTop: 12 }} />
        </div>
      </div>
    </Scene>
  );
};
