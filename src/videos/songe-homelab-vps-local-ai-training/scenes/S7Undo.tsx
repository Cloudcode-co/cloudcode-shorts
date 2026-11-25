import { AbsoluteFill, Sequence } from "remotion";
import { Terminal } from "../../../kit";
import { C } from "../palette";
import {
  Body,
  CutFlash,
  Head,
  LED,
  Mono,
  Panel,
  Rule,
  Stage,
  Status,
  rise,
  useRise,
} from "../parts";

const A_LEN = 155;
const CMD = ["songe undo"];

const CHECK = [
  { label: "Rõ ràng tốt hơn", color: C.unsloth },
  { label: "Không phá cái đã chạy", color: C.songe },
  { label: "Câu trả lời vẫn khoẻ", color: C.warn },
];

const CheckRow: React.FC<{ label: string; color: string; delay: number; last?: boolean }> = ({
  label,
  color,
  delay,
  last = false,
}) => {
  // Slide only, so the quality checks are on screen when the scene cuts in.
  const p = useRise(delay, 14);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "20px 0",
        borderBottom: last ? "none" : `1.5px solid ${C.line}`,
        translate: `0px ${(1 - p) * 14}px`,
      }}
    >
      <LED color={color} />
      <Body size={42} weight={600} style={{ flex: 1, lineHeight: 1.12 }}>
        {label}
      </Body>
      <Mono size={34} color={color}>PASS</Mono>
    </div>
  );
};

const GateShot = () => {
  const foot = useRise(72, 16);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="03" color={C.unsloth} />
      <Head size={76} style={{ marginTop: 24, maxWidth: 660 }}>
        An toàn và dễ đảo ngược
      </Head>
      <Body size={38} color={C.dim} style={{ marginTop: 18 }}>
        Bản mới phải vượt qua bài kiểm tra chất lượng.
      </Body>
      <div style={{ flex: 1 }} />
      <Panel
        title="CHECK / NEW VERSION"
        right={<Status label="GATE" color={C.unsloth} />}
        tone={C.unsloth}
        bodyStyle={{ paddingTop: 2, paddingBottom: 2 }}
      >
        <CheckRow label={CHECK[0].label} color={CHECK[0].color} delay={12} />
        <CheckRow label={CHECK[1].label} color={CHECK[1].color} delay={32} />
        <CheckRow label={CHECK[2].label} color={CHECK[2].color} delay={52} last />
      </Panel>
      <div style={{ flex: 1 }} />
      <div
        style={{
          translate: `0px ${(1 - foot) * 18}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1.5px solid ${C.line}`,
          paddingTop: 20,
        }}
      >
        <Body size={38}>Không đạt thì giữ nguyên bản cũ.</Body>
        <Mono size={34} color={C.faint}>ROLLBACK</Mono>
      </div>
    </Stage>
  );
};

const UndoShot = () => {
  const term = useRise(10, 14);
  const panel = useRise(30, 18);
  const rail = useRise(72, 18);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="03" color={C.unsloth} />
      <Head size={72} style={{ marginTop: 22 }}>
        Quay lại bản cũ
      </Head>
      <Body size={38} color={C.dim} style={{ marginTop: 14 }}>
        Không ưng ý? Một lệnh là xong.
      </Body>
      <div style={{ height: 28 }} />
      <div style={rise(term, 18)}>
        <Terminal
          cmds={CMD}
          fontSize={56}
          minHeight={230}
          bg={C.panel}
          fg={C.text}
          accent={C.songe}
        />
      </div>
      <div style={{ height: 22 }} />
      <Panel
        title="VERSION / HISTORY"
        right={<Status label="UNDO" color={C.warn} />}
        tone={C.warn}
        style={rise(panel, 22)}
        bodyStyle={{ gap: 0, paddingTop: 2, paddingBottom: 2 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 0",
            borderBottom: `1.5px solid ${C.line}`,
          }}
        >
          <LED color={C.unsloth} />
          <Body size={40} weight={600} style={{ flex: 1 }}>Bản đang dùng</Body>
          <Mono size={34} color={C.unsloth}>NOW</Mono>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 0" }}>
          <LED color={C.warn} steady={false} />
          <Body size={40} weight={600} style={{ flex: 1 }}>Bản trước đó</Body>
          <Mono size={34} color={C.warn}>RESTORE</Mono>
        </div>
      </Panel>
      <div style={{ ...rise(rail, 14), marginTop: 30 }}>
        <Mono size={34} color={C.dim}>Mốc phiên bản</Mono>
        <div style={{ position: "relative", marginTop: 16, height: 70 }}>
          <div
            style={{
              position: "absolute",
              left: 8,
              right: 8,
              top: 8,
              height: 2,
              background: C.line,
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  background: i === 6 ? C.songe : i === 5 ? C.warn : C.lineHi,
                  outline: i === 6 ? `2px solid ${C.songe}44` : "none",
                  outlineOffset: 3,
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 34,
              display: "flex",
              justifyContent: "flex-end",
              gap: 30,
            }}
          >
            <Mono size={34} color={C.warn}>bản trước</Mono>
            <Mono size={34} color={C.songe}>đang dùng</Mono>
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          borderTop: `1.5px solid ${C.line}`,
          paddingTop: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Body size={44} weight={700} style={{ flex: 1, lineHeight: 1.12 }}>
          Hoàn tác bất kỳ lúc nào.
        </Body>
        <Status label="UNDO" color={C.unsloth} />
      </div>
    </Stage>
  );
};

export const S7Undo: React.FC<{ len: number }> = ({ len }) => (
  <AbsoluteFill>
    <Sequence name="undo: gate" durationInFrames={A_LEN}>
      <GateShot />
    </Sequence>
    <Sequence name="undo: terminal" from={A_LEN} durationInFrames={len - A_LEN}>
      <UndoShot />
    </Sequence>
        <CutFlash at={155} color={C.unsloth} frames={6} />
  </AbsoluteFill>
);
