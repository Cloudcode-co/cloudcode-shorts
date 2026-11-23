import { Easing, interpolate, useCurrentFrame } from "remotion";
import { mono, sans } from "../../../kit";
import { C } from "../palette";
import { Headline, Lamp, Label, Panel, Scene, appear, rise } from "../ui";

const NUM = {
  fontFamily: mono,
  fontWeight: 700,
  fontSize: 96,
  lineHeight: 0.9,
  letterSpacing: "-0.05em",
  fontVariantNumeric: "tabular-nums",
  color: C.text,
} as const;

const DownloadBar: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ display: "flex", gap: 7 }}>
    {Array.from({ length: 10 }, (_, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: 30,
          borderRadius: 2,
          background: i < Math.round(p * 10) ? C.mint : C.raised,
        }}
      />
    ))}
  </div>
);

const MemoryGrid: React.FC<{ lit: number }> = ({ lit }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(8, 1fr)",
      gap: 8,
      width: 660,
      margin: "0 auto",
    }}
  >
    {Array.from({ length: 48 }, (_, i) => (
      <div
        key={i}
        style={{
          height: 34,
          borderRadius: 2,
          background: i < lit ? C.mint : C.raised,
          border: `1px solid ${i < lit ? C.mint : C.line}`,
          opacity: i < lit ? 1 : 0.7,
        }}
      />
    ))}
  </div>
);

const BootRuler: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ position: "relative", height: 66 }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 20, height: 2, background: C.line }} />
    {Array.from({ length: 21 }, (_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${i * 5}%`,
          top: i % 5 === 0 ? 13 : 17,
          width: 2,
          height: i % 5 === 0 ? 18 : 10,
          background: i % 5 === 0 ? C.lineLit : C.line,
        }}
      />
    ))}
    {[70, 300].map((ms, i) => (
      <div
        key={ms}
        style={{
          position: "absolute",
          left: `${(ms / 1000) * 100}%`,
          top: i === 0 ? 0 : 6,
          width: 3,
          height: i === 0 ? 44 : 38,
          background: i === 0 ? C.amber : C.mint,
          opacity: p,
          transform: "translateX(-50%)",
          boxShadow: `0 0 12px ${i === 0 ? C.amber : C.mint}88`,
        }}
      />
    ))}
    <span
      style={{
        position: "absolute",
        left: 0,
        top: 34,
        fontFamily: mono,
        fontSize: 34,
        color: C.faint,
      }}
    >
      0
    </span>
    <span
      style={{
        position: "absolute",
        right: 0,
        top: 34,
        fontFamily: mono,
        fontSize: 34,
        color: C.dim,
      }}
    >
      1.000 s
    </span>
  </div>
);

export const Budget: React.FC<{ len: number }> = () => {
  const f = useCurrentFrame();
  const head = appear(f, 2, 16);
  const dl = appear(f, 10, 18);
  const mem = appear(f, 190, 18);
  const boot = appear(f, 200, 18);

  const dlP = interpolate(f, [58, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const memP = interpolate(f, [222, 322], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const memCount = Math.round(48 * memP);
  const bootP = appear(f, 320, 16);

  return (
    <Scene style={{ gap: 20 }}>
      <Headline size={78} style={rise(head, 28)}>
        Tải 10 MB,
        <br />
        tốn 48 MB RAM
      </Headline>

      <Panel
        tone="mint"
        style={rise(dl, 30)}
        bodyStyle={{ display: "flex", flexDirection: "column", gap: 12 }}
        title={<span style={{ fontFamily: sans, fontWeight: 700, fontSize: 40 }}>dữ liệu tải về</span>}
        right={<Label color={C.dim}>trang unkernel</Label>}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={NUM}>10</span>
          <span style={{ fontFamily: mono, fontSize: 46, color: C.mint }}>MB</span>
          <span style={{ marginLeft: "auto", fontFamily: sans, fontSize: 34, color: C.dim }}>
            mỗi ô 1 MB
          </span>
        </div>
        <DownloadBar p={dlP} />
      </Panel>

      <Panel
        tone="mint"
        style={rise(mem, 30)}
        bodyStyle={{ display: "flex", flexDirection: "column", gap: 18 }}
        title={<span style={{ fontFamily: sans, fontWeight: 700, fontSize: 40 }}>bộ nhớ guest</span>}
        right={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <Lamp color={C.mint} size={12} />
            <Label color={C.mint}>Alpine</Label>
          </span>
        }
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ ...NUM, fontVariantNumeric: "tabular-nums" }}>{memCount}</span>
          <span style={{ fontFamily: mono, fontSize: 46, color: C.mint }}>MiB</span>
          <span style={{ marginLeft: "auto", fontFamily: sans, fontSize: 34, color: C.dim }}>
            mỗi ô 1 MiB
          </span>
        </div>
        <MemoryGrid lit={memCount} />
      </Panel>

      <Panel
        tone="dim"
        style={rise(boot, 28)}
        bodyStyle={{ paddingTop: 12, paddingBottom: 8 }}
        title={<span style={{ fontFamily: sans, fontWeight: 700, fontSize: 40 }}>boot</span>}
        right={<Label color={C.dim}>kernel tới Alpine</Label>}
      >
        <BootRuler p={bootP} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Lamp color={C.amber} size={10} />
            <span style={{ fontFamily: mono, fontSize: 34, color: C.text }}>kernel chạm /init</span>
            <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 34, color: C.amber }}>
              70 ms
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Lamp color={C.mint} size={10} />
            <span style={{ fontFamily: mono, fontSize: 34, color: C.text }}>Alpine sẵn sàng</span>
            <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 34, color: C.mint }}>
              0.300 s
            </span>
          </div>
        </div>
      </Panel>
    </Scene>
  );
};
