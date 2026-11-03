import { Shot, display, enter, useIn } from "../../../kit";
import { C } from "../palette";
import { Side } from "./Compare";

const q = { fontSize: 44, fontWeight: 700, lineHeight: 1.25 };
const a = { fontFamily: display, fontWeight: 800, fontSize: 92, lineHeight: 1 };

// Share of the shot at which the voice reaches each line.
export const VERDICT_HERMES = 0.4;
const VERDICT_NEXT = 0.82;

export const Verdict: React.FC<{ len: number }> = ({ len }) => {
  const next = useIn(Math.round(len * VERDICT_NEXT));
  return (
    <Shot bg={C.hermesInk} len={len} style={{ gap: 30, justifyContent: "center" }}>
      <Side who="claw" delay={0}>
        <div style={q}>Cần bot trên Zalo, WhatsApp, đủ mọi kênh</div>
        <div style={{ ...a, marginTop: 10 }}>chọn OpenClaw</div>
      </Side>
      <Side who="hermes" delay={Math.round(len * VERDICT_HERMES)}>
        <div style={q}>Muốn agent càng dùng càng khôn</div>
        <div style={{ ...a, marginTop: 10 }}>chọn Hermes</div>
      </Side>
      <div
        style={{
          ...enter(next),
          marginTop: 20,
          fontFamily: display,
          fontWeight: 800,
          fontSize: 64,
          color: C.white,
        }}
      >
        Giờ cài Hermes, 4 bước.
      </div>
    </Shot>
  );
};
