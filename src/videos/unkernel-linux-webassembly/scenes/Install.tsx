import { useCurrentFrame } from "remotion";
import { TYPE_DELAY, Terminal, mono, sans, typingFrames } from "../../../kit";
import { C } from "../palette";
import { Headline, Lamp, Label, Meter, Panel, Scene, Status, appear, rise } from "../ui";

export const CMDS = ["npx unkernel"];
// The command is already in the prompt when the whip lands, so the panel is
// never an empty card; the kit Terminal starts typing TYPE_DELAY frames in.
export const TERM_AT = 0;
const TYPED_AT = TERM_AT + TYPE_DELAY + typingFrames(CMDS);
const BOOT_AT = TYPED_AT + 10;
export const READY_AT = 150;
const ROW1_AT = TYPED_AT + 30;
const ROW2_AT = TYPED_AT + 76;

// One line of the console: lamp, mono service name, the result in sans. It sits
// dim until the boot reaches it, so the panel is never a half-empty card.
const Readout: React.FC<{
  f: number;
  at: number;
  name: string;
  value: string;
  last?: boolean;
}> = ({ f, at, name, value, last }) => {
  const p = appear(f, at, 16);
  const on = p > 0.55;
  return (
    <div
      style={{
        opacity: 0.6 + 0.4 * p,
        translate: `0 ${(1 - p) * 12}px`,
        flex: 1,
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        gap: 18,
        borderTop: `1px solid ${C.line}`,
        borderBottom: last ? `1px solid ${C.line}` : undefined,
      }}
    >
      <Lamp color={on ? C.mint : C.faint} size={16} on={on} />
      <span
        style={{
          fontFamily: mono,
          fontSize: 38,
          color: on ? C.mint : C.dim,
          minWidth: 150,
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: sans,
          fontSize: 48,
          color: on ? C.text : C.dim,
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>
    </div>
  );
};

export const Install: React.FC<{ len: number }> = () => {
  const f = useCurrentFrame();
  const head = appear(f, 2, 16);
  const term = appear(f, 8, 16);
  const boot = appear(f, BOOT_AT, READY_AT - BOOT_AT);
  const ready = f >= READY_AT;

  const phase =
    f < TERM_AT + TYPE_DELAY ? "prompt" : f < TYPED_AT ? "typing" : ready ? "ready" : "booting";
  const phaseColor =
    phase === "ready" ? C.mint : phase === "prompt" ? C.dim : C.amber;

  return (
    <Scene style={{ gap: 20 }}>
      <Headline size={84} style={rise(head, 28)}>
        Chạy ngay với NPX
      </Headline>

      <Panel
        tone="mint"
        style={{
          ...rise(term, 22),
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
        bodyStyle={{ padding: 0, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
        title={<span style={{ fontFamily: mono, fontSize: 38 }}>terminal</span>}
        right={<Status color={phaseColor}>{phase}</Status>}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            background: C.black,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Terminal
            cmds={CMDS}
            width={775}
            fontSize={80}
            minHeight={214}
            bg="transparent"
            fg={C.text}
            accent={C.mint}
          />

          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: 22,
              padding: "0 32px 30px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Label color={C.dim}>thực thi</Label>
                <Status color={phaseColor}>{ready ? "alpine ready" : "khởi động alpine"}</Status>
              </div>
              <Meter p={boot} color={ready ? C.mint : C.amber} height={16} />
            </div>

            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
              <Readout f={f} at={ROW1_AT} name="alpine" value="khởi động tức thì" />
              <Readout f={f} at={ROW2_AT} name="mạng" value="chạy qua host socket" last />
            </div>
          </div>
        </div>
      </Panel>
    </Scene>
  );
};
