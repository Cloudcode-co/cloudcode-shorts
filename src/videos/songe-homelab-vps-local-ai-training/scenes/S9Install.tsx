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
  useRise,
} from "../parts";

const CMD = ["uv tool install songe", "songe init"];

const DetectRow: React.FC<{ label: string; value: string; color: string; delay: number }> = ({
  label,
  value,
  color,
  delay,
}) => {
  const p = useRise(delay, 14);
  return (
    <div
      style={{
        translate: `0px ${(1 - p) * 14}px`,
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        padding: "14px 0",
        borderBottom: `1.5px solid ${C.line}`,
      }}
    >
      <LED color={color} />
      <Mono size={34} color={C.dim} style={{ width: 160, flex: "none", paddingTop: 6 }}>
        {label}
      </Mono>
      <Body size={36} weight={500} style={{ flex: 1, lineHeight: 1.2 }}>
        {value}
      </Body>
    </div>
  );
};

const InstallShot: React.FC<{ len: number }> = ({ len }) => {
  const panel = useRise(26, 16);
  return (
    <Stage padTop={250 + 6}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Rule index="04" color={C.unsloth} />
        <Status label="UV TOOL" color={C.unsloth} />
      </div>
      <Head size={70} style={{ marginTop: 22 }}>
        Cài đặt Songe
      </Head>
      <Body size={38} color={C.dim} style={{ marginTop: 10 }}>
        Hai lệnh qua uv tool là xong.
      </Body>
      <div style={{ height: 24 }} />
      <div
        style={{
          border: `1.5px solid ${C.line}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* Start the terminal clock partway through typing, so the scene opens
            with both uv commands already on screen. The kit Terminal still
            renders every character. */}
        <Sequence from={-46} durationInFrames={len + 46} layout="none">
          <Terminal
            cmds={CMD}
            fontSize={46}
            minHeight={320}
            bg={C.panel}
            fg={C.text}
            accent={C.unsloth}
          />
        </Sequence>
      </div>
      <Panel
        title="AUTO / DETECT"
        right={<Status label="READY" color={C.unsloth} />}
        tone={C.unsloth}
        style={{
          translate: `0px ${(1 - panel) * 14}px`,
          flex: 1,
          minHeight: 0,
          marginTop: 24,
        }}
        bodyStyle={{ paddingTop: 2, paddingBottom: 0, justifyContent: "space-between" }}
      >
        <DetectRow
          label="SERVERS"
          value="LM Studio, vLLM, Ollama, llama.cpp, mlx-lm"
          color={C.unsloth}
          delay={40}
        />
        <DetectRow label="AGENTS" value="opencode, pi" color={C.songe} delay={62} />
        <div style={{ height: 16 }} />
        <Body size={36} color={C.faint} style={{ paddingBottom: 18, lineHeight: 1.2 }}>
          songe init tìm server và agent, rồi hỏi trước khi thay đổi.
        </Body>
      </Panel>
    </Stage>
  );
};

export const S9Install: React.FC<{ len: number }> = ({ len }) => (
  <AbsoluteFill>
    <Sequence name="install: terminal" durationInFrames={len}>
      <InstallShot len={len} />
    </Sequence>
    <CutFlash at={0} color={C.unsloth} frames={8} />
  </AbsoluteFill>
);
