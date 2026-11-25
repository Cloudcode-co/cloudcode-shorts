import { AbsoluteFill, Img, Sequence } from "remotion";
import { C, a } from "../palette";
import {
  Body,
  CutFlash,
  Count,
  Head,
  LiveBars,
  Mono,
  Panel,
  Rule,
  Stage,
  Status,
  rise,
  useRise,
} from "../parts";

const A_LEN = 106;
const B_LEN = 162;

const ShotA = () => {
  const head = useRise(4, 18);
  const card = useRise(24, 18);
  return (
    <Stage padTop={250 + 10}>
      <Rule index="01" color={C.unsloth} />
      <Head size={84} style={{ marginTop: 26, ...rise(head, 28) }}>
        Cách huấn luyện truyền thống
      </Head>
      <Panel
        title="UNSLOTH / TRAINER"
        right={<Status label="BATCH" color={C.unsloth} />}
        tone={C.unsloth}
        style={{ ...rise(card, 14), flex: 1, minHeight: 0, marginTop: 30 }}
        bodyStyle={{ gap: 20, justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Img src={a("repos/unslothai.png")} style={{ width: 104, height: 104, borderRadius: 10 }} />
          <div>
            <Body size={56} weight={800} style={{ lineHeight: 1 }}>
              Unsloth
            </Body>
            <Mono size={34} color={C.dim} style={{ marginTop: 8 }}>
              fine-tune / Apache-2.0
            </Mono>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
          <Mono size={34} color={C.dim}>TRAIN / BATCH</Mono>
          <LiveBars color={C.unsloth} n={30} height={150} seed={2} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: `1.5px solid ${C.line}`,
            paddingTop: 16,
          }}
        >
          <div>
            <Mono size={34} color={C.dim}>GITHUB STARS</Mono>
            <Count to={80191} delay={40} size={72} color={C.text} />
          </div>
          <Mono size={34} color={C.dim}>Python</Mono>
        </div>
      </Panel>
    </Stage>
  );
};

const Step: React.FC<{ n: string; label: string; right: string; color: string; delay: number }> = ({
  n,
  label,
  right,
  color,
  delay,
}) => {
  const p = useRise(delay, 14);
  return (
    <div
      style={{
        ...rise(p, 18),
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "20px 0",
        flex: 1,
        borderBottom: `1.5px solid ${C.line}`,
      }}
    >
      <Mono size={38} color={C.faint} weight={700}>{n}</Mono>
      <Body size={42} weight={600} style={{ flex: 1, lineHeight: 1.12 }}>
        {label}
      </Body>
      <Mono size={34} color={color}>{right}</Mono>
    </div>
  );
};

const ShotB = () => {
  const head = useRise(2, 16);
  const run = useRise(52, 60);
  return (
    <Stage padTop={250 + 10}>
      <Rule index="01" color={C.unsloth} />
      <Head size={80} style={{ marginTop: 24, ...rise(head, 24) }}>
        Gom dataset thủ công
      </Head>
      <Body size={40} color={C.dim} style={{ marginTop: 18, ...rise(head, 20) }}>
        Làm sẵn dữ liệu trước, rồi mới huấn luyện.
      </Body>

      <Panel
        title="RUN / MANUAL DATASET"
        right={<Status label="QUEUED" color={C.warn} steady={false} />}
        tone={C.warn}
        style={{ flex: 1, minHeight: 0, marginTop: 28 }}
        bodyStyle={{ gap: 0, paddingTop: 6, paddingBottom: 20 }}
      >
        <Step n="01" label="Gom dataset thủ công" right="MANUAL" color={C.warn} delay={18} />
        <Step n="02" label="Huấn luyện theo mẻ" right="BATCH" color={C.unsloth} delay={36} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
          <Mono size={34} color={C.dim}>TRAIN / QUEUE</Mono>
          <LiveBars color={C.unsloth} n={26} height={120} seed={5} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Mono size={34} color={C.dim}>BATCH / RUN</Mono>
            <div
              style={{
                height: 16,
                marginTop: 12,
                background: C.line,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.round(run * 100)}%`,
                  height: "100%",
                  background: C.unsloth,
                }}
              />
            </div>
          </div>
          <Mono size={38} color={C.unsloth}>RUNNING</Mono>
        </div>
      </Panel>
    </Stage>
  );
};

const ShotC = () => {
  const big = useRise(4, 16);
  const panel = useRise(26, 18);
  return (
    <Stage padTop={250 + 10}>
      <Rule index="01" color={C.unsloth} />
      <Head size={80} style={{ marginTop: 24, ...rise(big, 24) }}>
        Yêu cầu tối thiểu
      </Head>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginTop: 26 }}>
        <Mono
          size={176}
          weight={700}
          color={C.unsloth}
          style={{ letterSpacing: "-0.07em", lineHeight: 0.86, ...rise(big, 20) }}
        >
          3 GB
        </Mono>
        <Body size={42} color={C.dim} style={{ paddingBottom: 20 }}>
          VRAM
        </Body>
      </div>

      <Panel
        title="GPU / MEMORY"
        right={<Status label="MIN" color={C.unsloth} />}
        tone={C.unsloth}
        style={{
          translate: `0px ${(1 - panel) * 14}px`,
          flex: 1,
          minHeight: 0,
          marginTop: 26,
        }}
        bodyStyle={{ gap: 18, justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Img src={a("repos/unslothai.png")} style={{ width: 64, height: 64, borderRadius: 8 }} />
          <Body size={38} color={C.dim} style={{ flex: 1 }}>
            Unsloth chạy được từ mức này trở lên.
          </Body>
        </div>
        <div style={{ display: "flex", gap: 4, flex: 1, alignItems: "center" }}>
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "72%",
                maxHeight: 340,
                background: i < 9 ? C.unsloth : C.line,
                opacity: i < 9 ? 0.45 + i * 0.06 : 0.7,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Mono size={34} color={C.faint}>0</Mono>
          <Mono size={34} color={C.unsloth}>3 GB</Mono>
          <Mono size={34} color={C.faint}>VRAM</Mono>
        </div>
      </Panel>
    </Stage>
  );
};

export const S2Unsloth: React.FC<{ len: number }> = ({ len }) => (
  <AbsoluteFill>
    <Sequence name="unsloth: service" durationInFrames={A_LEN}>
      <ShotA />
    </Sequence>
    <Sequence name="unsloth: dataset" from={A_LEN} durationInFrames={B_LEN}>
      <ShotB />
    </Sequence>
    <Sequence name="unsloth: vram" from={A_LEN + B_LEN} durationInFrames={len - A_LEN - B_LEN}>
      <ShotC />
    </Sequence>
        <CutFlash at={106} color={C.unsloth} frames={6} />
      <CutFlash at={268} color={C.unsloth} frames={6} />
  </AbsoluteFill>
);
