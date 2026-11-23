import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { mono, sans } from "../../../kit";
import { C } from "../palette";
import { Headline, Lamp, Label, Panel, Scene, Status, appear, rise } from "../ui";

const ROWS = [
  { name: "syscall", value: "getppid 170 ns" },
  { name: "scheduler", value: "trong wasm" },
  { name: "memory", value: "MMU Sv39" },
  { name: "ext4", value: "trong wasm" },
  { name: "TCP/IP", value: "trong wasm" },
];

const KRow: React.FC<{ name: string; value: string; p: number }> = ({ name, value, p }) => (
  <div
    style={{
      ...rise(p, 14),
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flex: 1,
      minHeight: 76,
      borderBottom: `1px solid ${C.line}`,
    }}
  >
    <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Lamp color={C.mint} size={10} />
      <span style={{ fontFamily: sans, fontSize: 40, fontWeight: 700, color: C.text }}>{name}</span>
    </span>
    <span style={{ fontFamily: mono, fontSize: 36, color: C.mint, fontVariantNumeric: "tabular-nums" }}>
      {value}
    </span>
  </div>
);

export const KernelSpeed: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const head = appear(f, 2, 16);
  const panel = appear(f, 8, 18);
  const user = appear(f, 120, 20);
  const metric = appear(f, 170, 18);
  // Take the light away for the last frames before the drop.
  const dip = interpolate(f, [len - 12, len - 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // A fast sweep: the syscall path never waits.
  const phase = ((f - 20) % 42) / 42;

  return (
    <>
      <Scene style={{ gap: 22 }}>
      <Headline size={82} style={rise(head, 28)}>
        Kernel chạy
        <br />
        tốc độ WASM
      </Headline>

      <Panel
        tone="mint"
        style={{ ...rise(panel, 34), flex: 1, display: "flex", flexDirection: "column" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
        title={
          <>
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 40 }}>kernel</span>
            <span style={{ fontFamily: mono, fontSize: 34, color: C.dim }}>mã biên dịch</span>
          </>
        }
        right={<Status color={C.mint}>compiled</Status>}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, height: 52 }}>
          <Label color={C.faint}>luồng syscall</Label>
          <div style={{ position: "relative", flex: 1, height: 2, background: C.line }}>
            <div
              style={{
                position: "absolute",
                left: `${phase * 100}%`,
                top: -4,
                width: 3,
                height: 10,
                background: C.mint,
                boxShadow: `0 0 12px ${C.mint}`,
                opacity: f > 20 ? 1 : 0,
              }}
            />
          </div>
          <span style={{ fontFamily: mono, fontSize: 34, color: C.mint }}>wasm</span>
        </div>

        <div
          style={{
            borderTop: `1px solid ${C.line}`,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {ROWS.map((r, i) => (
            <KRow key={r.name} name={r.name} value={r.value} p={appear(f, 44 + i * 22, 14)} />
          ))}
        </div>
      </Panel>

      <Panel
        tone="amber"
        style={rise(user, 28)}
        bodyStyle={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}
        title={
          <>
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 40 }}>user space</span>
            <span style={{ fontFamily: mono, fontSize: 34, color: C.amber }}>emulated</span>
          </>
        }
        right={<Lamp color={C.amber} size={14} />}
      >
        <span
          style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 64,
            lineHeight: 1,
            color: C.text,
          }}
        >
          aarch64
        </span>
        <span
          style={{
            fontFamily: sans,
            fontSize: 34,
            color: C.amber,
            maxWidth: 430,
            lineHeight: 1.18,
            textAlign: "right",
          }}
        >
          chỉ phần này cần giả lập
        </span>
      </Panel>

      <div
        style={{
          ...rise(metric, 22),
          borderTop: `1px solid ${C.line}`,
          paddingTop: 10,
        }}
      >
        <div style={{ fontFamily: mono, fontSize: 34, color: C.faint, marginBottom: 8 }}>
          getppid
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { name: "unkernel", value: "170 ns", color: C.mint },
            { name: "native", value: "110 ns", color: C.text },
            { name: "qemu-system", value: "1.7 µs", color: C.red },
          ].map((cell) => (
            <div
              key={cell.name}
              style={{
                flex: 1,
                border: `1px solid ${C.line}`,
                background: C.panel,
                borderRadius: 4,
                padding: "10px 12px",
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 34, color: C.dim }}>{cell.name}</div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 40,
                  color: cell.color,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {cell.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      </Scene>
      <AbsoluteFill
        style={{
          background: C.bg,
          opacity: dip,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />
    </>
  );
};
