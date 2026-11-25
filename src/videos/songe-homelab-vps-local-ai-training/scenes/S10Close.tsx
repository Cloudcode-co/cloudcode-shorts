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

const A_LEN = 177;
const B_LEN = 261;

const SaveShot = () => {
  const panel = useRise(4, 14);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="04" color={C.songe} />
      <Head size={90} style={{ marginTop: 26 }}>
        Lưu lại và
      </Head>
      <Head size={90} color={C.songe}>
        trải nghiệm
      </Head>
      <Body size={42} color={C.dim} style={{ marginTop: 22, maxWidth: 620 }}>
        Để tối ưu chiếc VPS đang chạy cả ngày.
      </Body>
      <Panel
        title="SAVED / QUEUE"
        right={<Status label="SAVED" color={C.songe} />}
        tone={C.songe}
        style={{
          translate: `0px ${(1 - panel) * 12}px`,
          flex: 1,
          minHeight: 0,
          marginTop: 30,
        }}
        bodyStyle={{ gap: 18, justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Body size={78} weight={800} color={C.white}>Đã lưu</Body>
          <div style={{ width: 260 }}>
            <LiveBars color={C.songe} n={18} height={64} seed={11} />
          </div>
        </div>
        <div style={{ width: "100%" }}>
          <LiveBars color={C.songe} n={34} height={220} seed={12} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1.5px solid ${C.line}`,
            paddingTop: 16,
          }}
        >
          <Body size={36} color={C.dim} style={{ flex: 1, lineHeight: 1.14 }}>
            Follow để đón tip công nghệ mới
          </Body>
          <Status label="FOLLOW" color={C.unsloth} steady={false} />
        </div>
      </Panel>
    </Stage>
  );
};

const ServiceRow: React.FC<{
  avatar: string;
  name: string;
  line: string;
  metric: number;
  metricLabel: string;
  status: string;
  color: string;
  delay: number;
}> = ({ avatar, name, line, metric, metricLabel, status, color, delay }) => {
  const p = useRise(delay, 18);
  return (
    <div
      style={{
        ...rise(p, 24),
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: C.panel,
        border: `1.5px solid ${C.line}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 7,
        padding: "18px 20px",
      }}
    >
      <Img src={a(avatar)} style={{ width: 78, height: 78, borderRadius: 9, flex: "none" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Body size={42} weight={800} style={{ lineHeight: 1 }}>
          {name}
        </Body>
        <Body size={36} color={C.dim} style={{ marginTop: 6, lineHeight: 1.12 }}>
          {line}
        </Body>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
          <Count to={metric} delay={delay + 12} size={38} color={color} />
          <Mono size={32} color={C.faint}>{metricLabel}</Mono>
        </div>
      </div>
      <Status label={status} color={color} />
    </div>
  );
};

const CompareShot = () => {
  const head = useRise(2, 16);
  const q = useRise(60, 20);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="04" color={C.warn} />
      <Head size={74} style={{ marginTop: 22, ...rise(head, 24) }}>
        Hai cách dùng máy
      </Head>
      <div style={{ flex: 1 }} />
      <ServiceRow
        avatar="repos/unslothai.png"
        name="Unsloth"
        line="Dataset lớn, train theo mẻ."
        metric={80191}
        metricLabel="stars"
        status="BATCH"
        color={C.unsloth}
        delay={10}
      />
      <div style={{ height: 18 }} />
      <ServiceRow
        avatar="repos/sous-labs.png"
        name="Songe"
        line="Tự học mỗi đêm."
        metric={684}
        metricLabel="stars"
        status="DREAM"
        color={C.songe}
        delay={40}
      />
      <div style={{ flex: 1 }} />
      <div style={{ ...rise(q, 26), borderTop: `1.5px solid ${C.line}`, paddingTop: 24 }}>
        <Head size={62} color={C.text} style={{ lineHeight: 1.04 }}>
          Vẫn cắm máy cả ngày chỉ để chạy model AI thôi?
        </Head>
      </div>
    </Stage>
  );
};

const EndShot = () => {
  const head = useRise(2, 16);
  const panel = useRise(26, 18);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="04" color={C.songe} />
      <Head size={90} style={{ marginTop: 28, ...rise(head, 26) }}>
        Songe cho tự học mỗi đêm
      </Head>
      <Panel
        title="SONGE / DREAM"
        right={<Status label="READY" color={C.songe} steady={false} />}
        tone={C.songe}
        style={{ ...rise(panel, 12), flex: 1, minHeight: 0, marginTop: 30 }}
        bodyStyle={{ gap: 18, justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Img src={a("repos/sous-labs.png")} style={{ width: 92, height: 92, borderRadius: 10 }} />
          <div style={{ flex: 1 }}>
            <Body size={44} weight={800}>Songe</Body>
            <Mono size={34} color={C.dim} style={{ marginTop: 6 }}>idle compute, local only</Mono>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: `1.5px solid ${C.line}`, paddingTop: 16 }}>
          <div>
            <Count to={684} delay={40} size={54} color={C.songe} />
            <Mono size={34} color={C.faint} style={{ marginTop: 4 }}>stars</Mono>
          </div>
          <Mono size={34} color={C.faint}>Python</Mono>
        </div>
        <LiveBars color={C.songe} n={30} height={170} seed={8} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Mono size={34} color={C.faint}>Apache-2.0</Mono>
          <Mono size={34} color={C.faint}>local only</Mono>
        </div>
      </Panel>
      <div style={{ height: 18 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1.5px solid ${C.line}`,
          paddingTop: 22,
        }}
      >
        <Body size={38} weight={700} style={{ maxWidth: 520, lineHeight: 1.1 }}>
          Follow để đón tip công nghệ mới
        </Body>
        <Status label="FOLLOW" color={C.unsloth} steady={false} />
      </div>
    </Stage>
  );
};

export const S10Close: React.FC<{ len: number }> = ({ len }) => (
  <AbsoluteFill>
    <Sequence name="close: save" durationInFrames={A_LEN}>
      <SaveShot />
    </Sequence>
    <Sequence name="close: compare" from={A_LEN} durationInFrames={B_LEN}>
      <CompareShot />
    </Sequence>
    <Sequence name="close: end" from={A_LEN + B_LEN} durationInFrames={len - A_LEN - B_LEN}>
      <EndShot />
    </Sequence>
        <CutFlash at={177} color={C.warn} frames={6} />
      <CutFlash at={438} color={C.songe} frames={8} />
  </AbsoluteFill>
);
