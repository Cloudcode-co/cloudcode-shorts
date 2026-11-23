import { useCurrentFrame } from "remotion";
import { mono, sans } from "../../../kit";
import { C } from "../palette";
import { Headline, Label, Lamp, Meter, Panel, Scene, Status, appear, rise } from "../ui";

const TASKS = [
  { name: "apk search", value: "0.8 s" },
  { name: "apk add python3", value: "3.4 s" },
];

const TaskRow: React.FC<{ name: string; value: string; p: number }> = ({ name, value, p }) => (
  <div style={{ ...rise(p, 12), display: "flex", flexDirection: "column", gap: 8, height: 96 }}>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
      <span style={{ fontFamily: mono, fontSize: 38, color: C.text }}>{name}</span>
      <span style={{ fontFamily: mono, fontSize: 38, color: C.amber, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
    </div>
    <Meter p={p * (parseFloat(value) / 3.5)} color={C.amber} height={16} />
  </div>
);

export const Caveats: React.FC<{ len: number }> = () => {
  const f = useCurrentFrame();
  const head = appear(f, 2, 16);
  const cpu = appear(f, 8, 18);
  const r1 = appear(f, 42, 14);
  const r2 = appear(f, 96, 14);
  const jspi = appear(f, 190, 18);
  const browsers = appear(f, 226, 16);
  const gate = appear(f, 272, 16);

  return (
    <Scene style={{ gap: 20 }}>
      <Headline size={82} style={rise(head, 28)}>
        Lưu ý về hiệu năng
      </Headline>

      <Panel
        tone="amber"
        style={{ ...rise(cpu, 30), flex: 1, display: "flex", flexDirection: "column" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}
        title={<span style={{ fontFamily: sans, fontWeight: 700, fontSize: 40 }}>tác vụ nặng CPU</span>}
        right={<Status color={C.amber}>chậm hơn native</Status>}
      >
        <Label color={C.faint}>thời gian chạy trong guest</Label>
        <TaskRow name={TASKS[0].name} value={TASKS[0].value} p={r1} />
        <TaskRow name={TASKS[1].name} value={TASKS[1].value} p={r2} />
        <span
          style={{
            ...rise(r2, 10),
            marginTop: "auto",
            fontFamily: sans,
            fontSize: 34,
            color: C.dim,
            lineHeight: 1.2,
          }}
        >
          tính toán nặng vẫn chậm hơn chạy native
        </span>
      </Panel>

      <Panel
        tone="red"
        style={{ ...rise(jspi, 30), flex: 1, display: "flex", flexDirection: "column" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}
        title={<span style={{ fontFamily: sans, fontWeight: 700, fontSize: 40 }}>trình duyệt</span>}
        right={<Status color={C.red}>cần JSPI</Status>}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 96,
              lineHeight: 0.9,
              color: C.red,
              letterSpacing: "-0.04em",
            }}
          >
            JSPI
          </span>
          <span style={{ fontFamily: sans, fontSize: 34, color: C.dim, lineHeight: 1.16 }}>
            JavaScript Promise Integration
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {["Chrome", "Edge", "Firefox", "Safari"].map((b) => (
            <div
              key={b}
              style={{
                ...rise(browsers, 10),
                display: "flex",
                alignItems: "center",
                gap: 12,
                border: `1px solid ${C.line}`,
                background: C.raised,
                borderRadius: 4,
                padding: "10px 14px",
                fontFamily: mono,
                fontSize: 36,
                color: C.text,
              }}
            >
              <Lamp color={C.mint} size={11} />
              {b}
            </div>
          ))}
        </div>

        <div
          style={{
            ...rise(gate, 12),
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderTop: `1px solid ${C.line}`,
            paddingTop: 12,
          }}
        >
          <Lamp color={C.red} size={11} />
          <span style={{ fontFamily: sans, fontSize: 34, color: C.red, lineHeight: 1.16 }}>
            trình duyệt cũ: không chạy
          </span>
        </div>
      </Panel>
    </Scene>
  );
};
