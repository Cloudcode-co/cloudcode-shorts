import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C } from "../palette";
import {
  BgVideo,
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

const A_LEN = 174;
const B_LEN = 156;

const ShotA = () => {
  const head = useRise(4, 18);
  const panel = useRise(30, 18);
  return (
    <Stage
      padTop={250 + 6}
      bleed={
        <BgVideo
          file="footage/developer-working-desk-at-night-pixabay-42305.mp4"
          dark={0.64}
          position="60% center"
          trimBefore={120}
        />
      }
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Rule index="02" color={C.songe} />
        <Status label="SESSION" color={C.songe} steady={false} />
      </div>
      <Head size={92} style={{ marginTop: 28, ...rise(head, 30) }}>
        Tự học từ thói quen
      </Head>
      <Body size={42} color={C.dim} style={{ marginTop: 22, maxWidth: 620, ...rise(head, 22) }}>
        Bạn gõ lệnh bằng opencode hay pi như mọi ngày.
      </Body>
      <div style={{ flex: 1 }} />
      <div
        style={{
          ...rise(panel, 26),
          background: "rgba(8,12,17,0.9)",
          border: `1.5px solid ${C.line}`,
          borderLeft: `4px solid ${C.songe}`,
          borderRadius: 6,
          padding: "20px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Mono size={34} color={C.dim}>WORK / STREAM</Mono>
          <Status label="REC" color={C.alarm} steady={false} />
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <Mono size={52} weight={700} color={C.white}>opencode, pi</Mono>
          <div style={{ width: 280 }}>
            <LiveBars color={C.songe} n={20} height={36} seed={3} />
          </div>
        </div>
      </div>
    </Stage>
  );
};

const LOG_LINES = [
  { tag: "tool result", state: "ok", color: C.unsloth },
  { tag: "error", state: "captured", color: C.alarm },
  { tag: "retry", state: "seen", color: C.warn },
  { tag: "correction", state: "noted", color: C.songe },
  { tag: "next message", state: "linked", color: C.songe },
  { tag: "stated preference", state: "saved", color: C.unsloth },
];

const LogShot = () => {
  const f = useCurrentFrame();
  const head = useRise(2, 14);
  const shift = (f * 1.35) % 58;
  return (
    <Stage padTop={250 + 6}>
      <Rule index="02" color={C.songe} />
      <Head size={72} style={{ marginTop: 22, ...rise(head, 22) }}>
        Ghi nhận lỗi công cụ
      </Head>
      <Body size={38} color={C.dim} style={{ marginTop: 14, ...rise(head, 18) }}>
        Songe đọc những gì xảy ra sau mỗi hành động của model.
      </Body>
      <div style={{ height: 26 }} />
      <Panel
        title="STREAM / EVENTS"
        right={<Status label="CAPTURE" color={C.songe} steady={false} />}
        tone={C.songe}
        style={{ flex: 1, minHeight: 0 }}
        bodyStyle={{
          padding: 0,
          overflow: "hidden",
          maskImage:
            "linear-gradient(180deg, transparent 0px, #000 34px, #000 calc(100% - 34px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0px, #000 34px, #000 calc(100% - 34px), transparent 100%)",
        }}
      >
        <div style={{ translate: `0px ${-shift}px`, padding: "8px 0" }}>
          {Array.from({ length: 16 }, (_, i) => {
            const line = LOG_LINES[i % LOG_LINES.length];
            const appear = i * 6;
            const p = Math.min(1, Math.max(0, (f - appear) / 10));
            return (
              <div
                key={i}
                style={{
                  height: 58,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "0 22px",
                  opacity: p,
                  borderBottom: `1px solid ${C.line}66`,
                }}
              >
                <LED color={line.color} size={10} steady={i % 5 !== 0} />
                <Mono size={34} color={C.text} style={{ flex: 1, whiteSpace: "normal" }}>
                  {line.tag}
                </Mono>
                <Mono size={34} color={line.color}>{line.state}</Mono>
              </div>
            );
          })}
        </div>
      </Panel>
      <div style={{ height: 14 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Mono size={34} color={C.faint}>local only</Mono>
        <Mono size={34} color={C.faint}>no cloud</Mono>
      </div>
    </Stage>
  );
};

const Lesson: React.FC<{ label: string; color: string; delay: number }> = ({ label, color, delay }) => {
  const p = useRise(delay, 14);
  return (
    <div
      style={{
        ...rise(p, 16),
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "22px 0",
        flex: 1,
        minHeight: 0,
        borderBottom: `1.5px solid ${C.line}`,
      }}
    >
      <LED color={color} />
      <Body size={44} weight={600} style={{ flex: 1 }}>
        {label}
      </Body>
      <Mono size={34} color={color}>LESSON</Mono>
    </div>
  );
};

const LessonsShot = () => {
  const head = useRise(2, 14);
  const foot = useRise(78, 16);
  return (
    <Stage padTop={250 + 6}>
      <Rule index="02" color={C.songe} />
      <Head size={78} style={{ marginTop: 24, ...rise(head, 24) }}>
        Sửa câu trả lời, thành bài học
      </Head>
      <Panel
        title="LESSONS / EXTRACT"
        right={<Status label="CAPTURE" color={C.songe} />}
        tone={C.songe}
        style={{ flex: 1, minHeight: 0, marginTop: 28 }}
        bodyStyle={{ paddingTop: 4, paddingBottom: 4 }}
      >
        <Lesson label="Lỗi công cụ" color={C.alarm} delay={18} />
        <Lesson label="Câu trả lời bạn sửa" color={C.songe} delay={38} />
        <Lesson label="Chỉ dẫn bạn nêu" color={C.unsloth} delay={58} />
      </Panel>
      <div
        style={{
          ...rise(foot, 20),
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1.5px solid ${C.line}`,
          paddingTop: 22,
        }}
      >
        <Body size={40} color={C.dim}>Không gửi dữ liệu ra ngoài.</Body>
        <Status label="LOCAL" color={C.unsloth} />
      </div>
    </Stage>
  );
};

export const S4Habits: React.FC<{ len: number }> = ({ len }) => (
  <AbsoluteFill>
    <Sequence name="habits: desk" durationInFrames={A_LEN}>
      <ShotA />
    </Sequence>
    <Sequence name="habits: stream" from={A_LEN} durationInFrames={B_LEN}>
      <LogShot />
    </Sequence>
    <Sequence name="habits: lessons" from={A_LEN + B_LEN} durationInFrames={len - A_LEN - B_LEN}>
      <LessonsShot />
    </Sequence>
        <CutFlash at={174} color={C.songe} frames={6} />
      <CutFlash at={330} color={C.songe} frames={6} />
  </AbsoluteFill>
);
