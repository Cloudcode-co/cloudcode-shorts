import { AbsoluteFill, Img, Sequence, useCurrentFrame } from "remotion";
import { C, a } from "../palette";
import {
  Body,
  ChapterCard,
  CutFlash,
  Head,
  LiveBars,
  Mono,
  Panel,
  Rule,
  Stage,
  Status,
  packet,
  rise,
  useRise,
} from "../parts";

const CARD = 68;
const PORT = 228;

const PortShot = () => {
  const f = useRise(2, 14);
  const panel = useRise(30, 18);
  return (
    <Stage padTop={250 + 6}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Rule index="02" color={C.songe} />
        <Status label="LISTEN" color={C.songe} steady={false} />
      </div>
      <div style={{ flex: 1 }} />
      <Body size={38} color={C.dim} style={rise(f, 14)}>
        Proxy trung gian, cổng
      </Body>
      <Mono
        size={118}
        weight={700}
        color={C.white}
        style={{ marginTop: 12, letterSpacing: "-0.05em", lineHeight: 0.94, ...rise(f, 22) }}
      >
        127.0.0.1
      </Mono>
      <Mono
        size={118}
        weight={700}
        color={C.songe}
        style={{ letterSpacing: "-0.05em", lineHeight: 0.94, ...rise(f, 22) }}
      >
        :7613
      </Mono>
      <Body size={40} color={C.dim} style={{ marginTop: 26, maxWidth: 660, ...rise(f, 20) }}>
        Songe đứng giữa agent và model server, nghe mọi request đi qua.
      </Body>
      <div style={{ flex: 1 }} />
      <Panel
        title="SONGE / PROXY"
        right={<Status label="REC" color={C.alarm} steady={false} />}
        tone={C.songe}
        style={rise(panel, 26)}
        bodyStyle={{ gap: 16 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Img src={a("repos/sous-labs.png")} style={{ width: 84, height: 84, borderRadius: 10 }} />
          <Body size={44} weight={800} style={{ flex: 1 }}>
            Songe
          </Body>
          <div style={{ width: 230 }}>
            <LiveBars color={C.songe} n={18} height={38} seed={6} />
          </div>
        </div>
        <Mono size={34} color={C.dim}>records what happened</Mono>
      </Panel>
    </Stage>
  );
};

const Link: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const f = useCurrentFrame();
  const p = useRise(delay, 14);
  return (
    <div style={{ height: 62, display: "flex", justifyContent: "center", opacity: p }}>
      <div style={{ width: 2, height: "100%", background: `${color}55`, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: -4,
            top: 0,
            width: 10,
            height: 10,
            background: color,
            translate: `0px ${packet(f, 42, delay) * 52}px`,
          }}
        />
      </div>
    </div>
  );
};

const Node: React.FC<{
  label: string;
  value: string;
  detail?: string;
  color: string;
  delay: number;
  accent?: boolean;
}> = ({ label, value, detail, color, delay, accent = false }) => {
  const p = useRise(delay, 16);
  return (
    <div
      style={{
        ...rise(p, 20),
        border: `1.5px solid ${accent ? color : C.line}`,
        background: accent ? "rgba(79,192,230,0.07)" : C.panel,
        borderRadius: 7,
        padding: "18px 22px",
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div style={{ width: 8, height: 72, background: color, flex: "none" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Mono size={34} color={C.dim}>{label}</Mono>
        <Mono
          size={36}
          weight={700}
          color={accent ? color : C.text}
          style={{ marginTop: 6, whiteSpace: "normal", lineHeight: 1.14 }}
        >
          {value}
        </Mono>
        {detail && (
          <Mono size={34} color={C.faint} style={{ marginTop: 4, whiteSpace: "normal" }}>
            {detail}
          </Mono>
        )}
      </div>
      <Status label={accent ? "ON" : "LINK"} color={color} size={32} />
    </div>
  );
};

const TopologyShot = () => {
  const head = useRise(2, 16);
  const foot = useRise(66, 16);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="02" color={C.songe} />
      <Head size={72} style={{ marginTop: 22, ...rise(head, 24) }}>
        Đi qua proxy
      </Head>
      <div style={{ flex: 1 }} />
      <Node label="AGENT" value="opencode, pi" color={C.dim} delay={14} />
      <Link delay={26} color={C.songe} />
      <Node
        label="SONGE"
        value="127.0.0.1:7613"
        detail="records what happened"
        color={C.songe}
        delay={32}
        accent
      />
      <Link delay={44} color={C.unsloth} />
      <Node label="MODEL SERVER" value="LM Studio, vLLM, Ollama" color={C.unsloth} delay={50} />
      <div style={{ flex: 1 }} />
      <Panel
        title="REC / EVENTS"
        right={<Status label="CAPTURE" color={C.songe} steady={false} />}
        tone={C.songe}
        style={rise(foot, 18)}
        bodyStyle={{ gap: 10, padding: "16px 22px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <Mono size={34} color={C.unsloth}>tool result</Mono>
          <Mono size={34} color={C.alarm}>error</Mono>
          <Mono size={34} color={C.songe}>correction</Mono>
        </div>
        <Body size={36} color={C.dim} style={{ lineHeight: 1.15 }}>
          Ghi nhận luồng làm việc thực tế.
        </Body>
      </Panel>
    </Stage>
  );
};

export const S3Proxy: React.FC<{ len: number }> = ({ len }) => (
  <AbsoluteFill>
    <Sequence name="proxy: chapter" durationInFrames={CARD}>
      <ChapterCard
        index="02"
        kicker="SONGE"
        title="Một proxy ở giữa"
        accent={C.songe}
        note="Agent và model server không còn nói chuyện trực tiếp."
      />
    </Sequence>
    <Sequence name="proxy: port" from={CARD} durationInFrames={PORT}>
      <PortShot />
    </Sequence>
    <Sequence name="proxy: topology" from={CARD + PORT} durationInFrames={len - CARD - PORT}>
      <TopologyShot />
    </Sequence>
        <CutFlash at={0} color={C.songe} frames={8} />
      <CutFlash at={68} color={C.songe} frames={6} />
      <CutFlash at={296} color={C.songe} frames={6} />
  </AbsoluteFill>
);
