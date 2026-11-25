import { AbsoluteFill, Sequence } from "remotion";
import { BRAND_SPACE, Brand, SAFE } from "../../../kit";
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
  Spark,
  Stage,
  Status,
  rise,
  useRise,
} from "../parts";

const A_LEN = 102;

const ShotA = () => {
  const panel = useRise(34, 18);
  return (
    <Stage
      padTop={SAFE.top + BRAND_SPACE + 24}
      bleed={<BgVideo file="footage/server-room-data-center-racks-pixabay-14900.mp4" dark={0.6} trimBefore={180} />}
    >
      <Rule index="01" color={C.songe} />
      <Head size={92} style={{ marginTop: 30 }}>
        Tài nguyên nhàn rỗi đang bị lãng phí?
      </Head>
      <div style={{ flex: 1 }} />
      <div
        style={{
          ...rise(panel, 30),
          border: `1.5px solid ${C.line}`,
          background: "rgba(8,12,17,0.86)",
          borderRadius: 7,
          padding: "22px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Mono size={34} color={C.dim}>SERVER / UPTIME</Mono>
          <Status label="LIVE" color={C.songe} steady={false} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 10 }}>
          <Mono size={118} weight={700} color={C.white} style={{ letterSpacing: "-0.05em" }}>
            24/7
          </Mono>
          <div style={{ width: 300, paddingBottom: 10 }}>
            <LiveBars f={0} color={C.songe} n={26} height={34} />
          </div>
        </div>
        <Body size={38} color={C.dim} style={{ marginTop: 8 }}>
          Máy chủ chạy cả ngày, model chỉ ngồi chờ.
        </Body>
      </div>
    </Stage>
  );
};

const ShotB = () => {
  const panel = useRise(4, 14);
  return (
    <Stage
      padTop={SAFE.top + BRAND_SPACE + 24}
      bleed={<BgVideo file="footage/server-room-data-center-racks-pixabay-14900.mp4" dark={0.7} trimBefore={600} rate={1.08} />}
    >
      <Rule index="01" color={C.songe} />
      <Head size={82} style={{ marginTop: 28 }}>
        Tài nguyên nhàn rỗi đang bị lãng phí?
      </Head>

      <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <LED color={C.songe} size={18} />
          <Body size={46} weight={700} color={C.white}>
            Máy chủ chạy 24/7
          </Body>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <LED color={C.warn} size={18} steady={false} />
          <Body size={46} weight={700} color={C.warn}>
            AI chỉ trả lời thụ động
          </Body>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <Panel
        title="AGENT / REQUESTS"
        right={<Status label="IDLE" color={C.warn} steady={false} />}
        tone={C.warn}
        style={{ ...rise(panel, 16), flex: 1, minHeight: 0, marginTop: 26 }}
        bodyStyle={{ gap: 14, justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Body size={38} color={C.dim}>Lưu lượng</Body>
          <Mono size={36} color={C.warn}>phẳng</Mono>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flex: 1 }}>
          <div style={{ flex: 1 }}>
            <Spark color={C.warn} seed={4} amp={7} height={140} />
          </div>
          <LED color={C.warn} steady={false} size={18} />
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
          <Body size={38}>Model không tự cập nhật.</Body>
          <Mono size={34} color={C.faint}>LEARN OFF</Mono>
        </div>
      </Panel>
    </Stage>
  );
};

export const S1Hook: React.FC<{ len: number }> = ({ len }) => (
  <AbsoluteFill>
    <Sequence name="hook: wasted rack" durationInFrames={A_LEN}>
      <ShotA />
    </Sequence>
    <Sequence name="hook: idle agent" from={A_LEN} durationInFrames={len - A_LEN}>
      <ShotB />
    </Sequence>
    <Brand />
        <CutFlash at={102} color={C.songe} frames={6} />
  </AbsoluteFill>
);
