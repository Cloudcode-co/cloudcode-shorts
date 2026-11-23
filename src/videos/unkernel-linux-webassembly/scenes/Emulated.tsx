import { useCurrentFrame } from "remotion";
import { mono, sans } from "../../../kit";
import { C } from "../palette";
import { Headline, Lamp, Panel, Scene, Status, appear, rise } from "../ui";

const LAYERS = ["CPU x86", "Thiết bị", "Nhân Linux", "Ứng dụng"];

const LayerRow: React.FC<{ name: string; p: number }> = ({ name, p }) => (
  <div
    style={{
      ...rise(p, 16),
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flex: 1,
      minHeight: 70,
      borderBottom: `1px solid ${C.line}`,
      fontFamily: sans,
      fontSize: 42,
      fontWeight: 700,
      color: C.text,
      position: "relative",
      zIndex: 2,
    }}
  >
    <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <span
        style={{
          width: 14,
          height: 14,
          background: C.amber,
          opacity: 0.9,
          display: "inline-block",
        }}
      />
      {name}
    </span>
    <span style={{ fontFamily: mono, fontSize: 34, color: C.amber }}>emulated</span>
  </div>
);

export const Emulated: React.FC<{ len: number }> = () => {
  const f = useCurrentFrame();
  const head = appear(f, 2, 16);
  const panel = appear(f, 10, 18);
  const foot = appear(f, 90, 16);
  const strip = appear(f, 120, 18);

  return (
    <Scene style={{ gap: 24 }}>
      <Headline size={82} style={rise(head, 28)}>
        v86 giả lập toàn bộ phần cứng
      </Headline>

      <Panel
        tone="amber"
        style={{ ...rise(panel, 34), flex: 1, display: "flex", flexDirection: "column" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}
        title={
          <>
            <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 54, color: C.amber }}>
              v86
            </span>
            <span style={{ fontFamily: mono, fontSize: 34, color: C.dim }}>whole-machine</span>
          </>
        }
        right={<Status color={C.amber}>emulated</Status>}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: mono, fontSize: 34, color: C.faint }}>luồng lệnh</span>
          <span style={{ fontFamily: mono, fontSize: 34, color: C.amber }}>qua từng tầng</span>
        </div>

        <div
          style={{
            position: "relative",
            borderTop: `1px solid ${C.line}`,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {LAYERS.map((name, i) => (
            <LayerRow key={name} name={name} p={appear(f, 34 + i * 14, 14)} />
          ))}
        </div>

        <div
          style={{
            ...rise(foot, 18),
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: "auto",
            paddingTop: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, color: C.text }}>
            <Lamp color={C.amber} size={12} />
            Giả lập CPU x86 và thiết bị
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, color: C.text }}>
            <Lamp color={C.amber} size={12} />
            Tốn tài nguyên phần cứng
          </div>
        </div>
      </Panel>

      <div
        style={{
          ...rise(strip, 24),
          display: "flex",
          border: `1px solid ${C.line}`,
          borderRadius: 8,
          background: C.panel,
        }}
      >
        <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          <Status color={C.amber}>v86</Status>
          <span style={{ fontFamily: sans, fontSize: 34, color: C.dim }}>giả lập phần cứng</span>
        </div>
        <div style={{ width: 1, background: C.line }} />
        <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          <Status color={C.mint}>unkernel</Status>
          <span style={{ fontFamily: sans, fontSize: 34, color: C.dim }}>nhân biên dịch</span>
        </div>
      </div>
    </Scene>
  );
};
