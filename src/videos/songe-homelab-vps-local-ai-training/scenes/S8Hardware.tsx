import { AbsoluteFill, Sequence } from "remotion";
import { siApple, siNvidia } from "simple-icons";
import type { BrandIcon } from "../../../kit";
import { C } from "../palette";
import {
  Body,
  CutFlash,
  Head,
  LED,
  LiveBars,
  Mono,
  Panel,
  Rule,
  Stage,
  Status,
  rise,
  useRise,
} from "../parts";

const A_LEN = 193;
const B_LEN = 227;

const BrandChip: React.FC<{ icon: BrandIcon; size?: number }> = ({ icon, size = 74 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 8,
      background: C.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
    }}
  >
    <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6}>
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  </div>
);

const ShotA = () => {
  const head = useRise(4, 18);
  const warn = useRise(34, 18);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="03" color={C.alarm} />
      <Head size={88} style={{ marginTop: 26, ...rise(head, 28) }}>
        VPS không có GPU rời
      </Head>
      <Body size={42} color={C.dim} style={{ marginTop: 20, maxWidth: 620, ...rise(head, 20) }}>
        Vẫn chạy được model, nhưng chỉ ghi nhận được dữ liệu.
      </Body>

      <Panel
        title="TRAINING / COMPUTE"
        right={<Status label="BLOCKED" color={C.alarm} steady={false} />}
        tone={C.alarm}
        style={{ ...rise(warn, 14), flex: 1, minHeight: 0, marginTop: 24 }}
        bodyStyle={{ gap: 18, justifyContent: "space-between" }}
      >
        <Mono size={78} weight={700} color={C.alarm} style={{ letterSpacing: "-0.05em" }}>
          NO DEEP DREAM
        </Mono>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LED color={C.alarm} steady={false} size={18} />
          <Body size={42} weight={600} style={{ flex: 1 }}>
            Chỉ serve và ghi log
          </Body>
        </div>
        <div
          style={{
            display: "flex",
            gap: 4,
            borderTop: `1.5px solid ${C.line}`,
            paddingTop: 16,
          }}
        >
          {Array.from({ length: 28 }, (_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 38,
                background: i === 13 ? C.alarm : C.line,
                opacity: i === 13 ? 1 : 0.7,
              }}
            />
          ))}
        </div>
        <Body size={36} color={C.faint}>
          Không huấn luyện adapter trên CPU-only.
        </Body>
      </Panel>
    </Stage>
  );
};

const HwRow: React.FC<{
  icons: BrandIcon[];
  label: string;
  backend: string;
  state: string;
  color: string;
  delay: number;
}> = ({ icons, label, backend, state, color, delay }) => {
  const p = useRise(delay, 16);
  return (
    <div
      style={{
        ...rise(p, 22),
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: C.panel,
        border: `1.5px solid ${C.line}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 7,
        padding: "18px 20px",
        marginBottom: 18,
        flex: 1,
        minHeight: 0,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        {icons.map((ic) => (
          <BrandChip key={ic.title} icon={ic} size={62} />
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Body size={42} weight={700} style={{ lineHeight: 1.06 }}>
          {label}
        </Body>
        <Mono size={34} color={C.dim} style={{ marginTop: 4 }}>{backend}</Mono>
      </div>
      <div style={{ textAlign: "right" }}>
        <Mono size={34} color={color}>{state}</Mono>
        <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
          <LED color={color} />
        </div>
      </div>
    </div>
  );
};

const ShotB = () => {
  const head = useRise(2, 16);
  const foot = useRise(80, 16);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="03" color={C.unsloth} />
      <Head size={74} style={{ marginTop: 22, ...rise(head, 24) }}>
        Có GPU thì Deep Dream chạy
      </Head>
      <Panel
        title="GPU / BACKEND"
        right={<Status label="READY" color={C.unsloth} />}
        tone={C.unsloth}
        style={{ flex: 1, minHeight: 0, marginTop: 24 }}
        bodyStyle={{ padding: "20px 20px 4px", justifyContent: "space-between" }}
      >
        <HwRow
          icons={[siNvidia]}
          label="NVIDIA và AMD"
          backend="PyTorch"
          state="DREAM"
          color={C.unsloth}
          delay={14}
        />
        <HwRow
          icons={[siApple]}
          label="Apple Silicon"
          backend="MLX"
          state="DREAM"
          color={C.unsloth}
          delay={42}
        />
      </Panel>
      <div style={{ height: 16 }} />
      <div
        style={{
          ...rise(foot, 18),
          borderTop: `1.5px solid ${C.line}`,
          paddingTop: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Body size={36} color={C.dim} style={{ flex: 1, lineHeight: 1.14 }}>
          Trainer theo từng nền tảng.
        </Body>
        <div style={{ width: 190, flex: "none" }}>
          <LiveBars color={C.unsloth} n={14} height={38} seed={4} />
        </div>
      </div>
    </Stage>
  );
};

const MatrixRow: React.FC<{
  label: string;
  backend: string;
  dream: string;
  color: string;
  delay: number;
  last?: boolean;
}> = ({ label, backend, dream, color, delay, last = false }) => {
  const p = useRise(delay, 14);
  return (
    <div
      style={{
        translate: `0px ${(1 - p) * 14}px`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "18px 0",
        flex: 1,
        minHeight: 0,
        borderBottom: last ? "none" : `1.5px solid ${C.line}`,
      }}
    >
      <LED color={color} />
      <Body size={40} weight={700} style={{ flex: 1.5, lineHeight: 1.1, whiteSpace: "nowrap" }}>
        {label}
      </Body>
      <Mono size={36} color={C.dim} style={{ flex: 1 }}>
        {backend}
      </Mono>
      <Mono size={36} color={color} style={{ flex: 1, textAlign: "right" }}>
        {dream}
      </Mono>
    </div>
  );
};

const MatrixShot = () => {
  const head = useRise(2, 16);
  const foot = useRise(76, 16);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="03" color={C.warn} />
      <Head size={72} style={{ marginTop: 22, ...rise(head, 24) }}>
        Bảng phần cứng
      </Head>
      <div style={{ height: 24 }} />
      <Panel
        title="HARDWARE / SUMMARY"
        right={<Status label="MATRIX" color={C.warn} />}
        tone={C.warn}
        style={{ flex: 1, minHeight: 0 }}
        bodyStyle={{ paddingTop: 4, paddingBottom: 4 }}
      >
        <div style={{ display: "flex", gap: 14, paddingBottom: 14, borderBottom: `1.5px solid ${C.lineHi}` }}>
          <Mono size={34} color={C.faint} style={{ flex: 1.5 }}>HARDWARE</Mono>
          <Mono size={34} color={C.faint} style={{ flex: 1 }}>BACKEND</Mono>
          <Mono size={34} color={C.faint} style={{ flex: 1, textAlign: "right" }}>DREAM</Mono>
        </div>
        <MatrixRow label="NVIDIA / AMD" backend="PyTorch" dream="CÓ" color={C.unsloth} delay={12} />
        <MatrixRow label="Apple Silicon" backend="MLX" dream="CÓ" color={C.unsloth} delay={30} />
        <MatrixRow label="CPU only" backend="serve, log" dream="KHÔNG" color={C.alarm} delay={52} last />
      </Panel>
      <div style={{ height: 18 }} />
      <div
        style={{
          ...rise(foot, 18),
          display: "flex",
          alignItems: "center",
          gap: 16,
          borderTop: `1.5px solid ${C.line}`,
          paddingTop: 20,
        }}
      >
        <Mono size={34} color={C.alarm}>CPU-ONLY</Mono>
        <Body size={36} color={C.dim} style={{ flex: 1, lineHeight: 1.16 }}>
          Ghi nhận dữ liệu, không huấn luyện.
        </Body>
      </div>
    </Stage>
  );
};

export const S8Hardware: React.FC<{ len: number }> = ({ len }) => (
  <AbsoluteFill>
    <Sequence name="hardware: cpu only" durationInFrames={A_LEN}>
      <ShotA />
    </Sequence>
    <Sequence name="hardware: gpu" from={A_LEN} durationInFrames={B_LEN}>
      <ShotB />
    </Sequence>
    <Sequence name="hardware: matrix" from={A_LEN + B_LEN} durationInFrames={len - A_LEN - B_LEN}>
      <MatrixShot />
    </Sequence>
        <CutFlash at={193} color={C.unsloth} frames={6} />
      <CutFlash at={420} color={C.warn} frames={6} />
  </AbsoluteFill>
);
