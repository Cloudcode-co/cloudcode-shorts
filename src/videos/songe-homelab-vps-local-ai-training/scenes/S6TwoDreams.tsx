import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../palette";
import {
  Body,
  CutFlash,
  Head,
  LiveBars,
  Mono,
  Panel,
  Rule,
  Spark,
  Stage,
  Status,
  rise,
  useRise,
} from "../parts";

const COMPARE_LEN = 210;

const DreamPanel: React.FC<{
  title: string;
  value: string;
  valueSize: number;
  color: string;
  lines: string[];
  state: string;
  delay: number;
  seed: number;
}> = ({ title, value, valueSize, color, lines, state, delay, seed }) => {
  // Slide only: the panel is on screen from the cut, so a still taken as the
  // scene starts already shows the comparison rather than an empty frame.
  const p = useRise(delay, 18);
  return (
    <Panel
      title={title}
      right={<Status label={state} color={color} />}
      tone={color}
      style={{ flex: 1, translate: `0px ${(1 - p) * 30}px` }}
      bodyStyle={{ padding: "18px 20px", gap: 12 }}
    >
      <div
        style={{
          fontFamily: "inherit",
          fontSize: valueSize,
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
          color,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {lines.map((l) => (
          <Body key={l} size={38} color={C.dim} style={{ lineHeight: 1.15 }}>
            {l}
          </Body>
        ))}
      </div>
      <Spark color={color} seed={seed} amp={22} height={92} />
    </Panel>
  );
};

const CompareShot = () => {
  return (
    <Stage padTop={250 + 6}>
      <Rule index="03" color={C.warn} />
      <Head size={62} style={{ marginTop: 18 }}>
        Quick Dream và Deep Dream
      </Head>
      <Body size={38} color={C.dim} style={{ marginTop: 14 }}>
        Quick sửa chỉ dẫn, Deep huấn luyện adapter.
      </Body>
      <div style={{ height: 18 }} />
      <div style={{ display: "flex", gap: 16, height: 620, flex: "none" }}>
        <DreamPanel
          title="QUICK"
          value="vài phút"
          valueSize={54}
          color={C.songe}
          lines={["cập nhật prompt", "sửa chỉ dẫn"]}
          state="MIN"
          delay={0}
          seed={1}
        />
        <DreamPanel
          title="DEEP"
          value="1 giờ+"
          valueSize={62}
          color={C.warn}
          lines={["kịch bản thực hành", "adapter riêng"]}
          state="LONG"
          delay={20}
          seed={5}
        />
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: `1.5px solid ${C.line}`,
          paddingTop: 18,
        }}
      >
        <Mono size={34} color={C.songe}>quick: instructions</Mono>
        <Mono size={34} color={C.warn}>deep: the model</Mono>
      </div>
    </Stage>
  );
};

const StageRow: React.FC<{
  n: string;
  title: string;
  line: string;
  color: string;
  delay: number;
  last?: boolean;
}> = ({ n, title, line, color, delay, last = false }) => {
  const p = useRise(delay, 16);
  return (
    <div style={{ display: "flex", gap: 18, flex: 1, minHeight: 0 }}>
      <div style={{ width: 46, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Mono size={34} color={color} weight={700}>{n}</Mono>
        {!last && <div style={{ width: 2, flex: 1, background: `${color}44`, marginTop: 8 }} />}
      </div>
      <div
        style={{
          ...rise(p, 18),
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: C.panel,
          border: `1.5px solid ${C.line}`,
          borderLeft: `4px solid ${color}`,
          borderRadius: 6,
          padding: "18px 22px",
        }}
      >
        <Body size={42} weight={700} style={{ lineHeight: 1.1 }}>
          {title}
        </Body>
        <Body size={36} color={C.dim} style={{ marginTop: 6, lineHeight: 1.18 }}>
          {line}
        </Body>
      </div>
    </div>
  );
};

const PipelineShot = () => {
  const foot = useRise(60, 16);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="03" color={C.warn} />
      <Head size={70} style={{ marginTop: 20 }}>
        Deep Dream làm gì?
      </Head>
      <div style={{ height: 22 }} />
      <StageRow
        n="01"
        title="Sinh kịch bản thực hành"
        line="Từ lỗi, chỉ dẫn và câu trả lời bạn sửa."
        color={C.songe}
        delay={10}
      />
      <StageRow
        n="02"
        title="Huấn luyện adapter"
        line="Model gốc làm thầy, adapter làm trò."
        color={C.warn}
        delay={34}
      />
      <StageRow
        n="03"
        title="Chưng cất on-policy"
        line="Kỹ năng cũ vẫn được ôn lại."
        color={C.unsloth}
        delay={58}
        last
      />
      <div style={{ height: 18 }} />
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
        <Body size={36} color={C.dim} style={{ flex: 1, lineHeight: 1.16 }}>
          Không train trên hội thoại thật của bạn.
        </Body>
        <div style={{ width: 190, flex: "none" }}>
          <LiveBars color={C.warn} n={12} height={40} seed={7} />
        </div>
      </div>
    </Stage>
  );
};

export const S6TwoDreams: React.FC<{ len: number }> = ({ len }) => (
  <AbsoluteFill>
    <Sequence name="dreams: compare" durationInFrames={COMPARE_LEN}>
      <CompareShot />
    </Sequence>
    <Sequence name="dreams: pipeline" from={COMPARE_LEN} durationInFrames={len - COMPARE_LEN}>
      <PipelineShot />
    </Sequence>
        <CutFlash at={0} color={C.warn} frames={8} />
      <CutFlash at={COMPARE_LEN} color={C.warn} frames={6} />
  </AbsoluteFill>
);
