import type { ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CONTENT_W, display, easeOut, hit, mono, SAFE, sans } from "../../kit";
import { siAnthropic } from "simple-icons";
import beatsJson from "./beatmap.json";
import { beatmap } from "../../kit";
import {
  Backdrop,
  Chrome,
  FactStack,
  Flash,
  inAt,
  LowerThird,
  rise,
} from "./chrome";
import { C, FRAME } from "./theme";
import { D7, D8, SHOTS, STORIES } from "./timing";

const MAP = beatmap(beatsJson);
const STORY_START = STORIES[1].start;
const TICKER =
  "DNS SERVFAIL   /   BÃO ARP   /   QUÉT CỔNG   /   CLEARTEXT LOGIN   /   AI TRÍCH DẪN SỐ PACKET   /   XÓA SAU 60 PHÚT   /   ";

const Headline: React.FC<{ f: number; children: ReactNode; size?: number; delay?: number }> = ({
  f,
  children,
  size = 56,
  delay = 0,
}) => {
  const p = inAt(f, delay, 16);
  return (
    <div
      style={{
        ...rise(p, 30),
        width: CONTENT_W,
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: -1.5,
        color: C.white,
        textWrap: "balance",
      }}
    >
      {children}
    </div>
  );
};

// ---------- s4: the detector feed ----------

const DetectorPanel: React.FC<{ f: number; globalFrame: number }> = ({ f, globalFrame }) => {
  const pulse = 0.45 + 0.55 * hit(MAP.beats, globalFrame, 12);
  const rows = [
    { at: 6, text: "DNS SERVFAIL", alert: true },
    { at: 88, text: "Bão ARP, IP trùng", alert: false },
    { at: 170, text: "Quét cổng & sweep", alert: true },
    { at: 252, text: "Cleartext login: FTP, HTTP Basic", alert: true },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 700,
        width: CONTENT_W,
        background: "rgba(4,11,24,0.94)",
        borderTop: `6px solid ${C.red}`,
        padding: "16px 24px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span style={{ width: 14, height: 14, background: C.red, opacity: pulse }} />
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.muted }}>BỘ PHÁT HIỆN</div>
      </div>
      {rows.map((row, i) => {
        const p = inAt(f, row.at, 14);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              height: 66,
              borderTop: `1px solid ${C.rule}`,
              opacity: p,
              transform: `translateX(${(1 - p) * 26}px)`,
            }}
          >
            <span
              style={{
                width: 6,
                height: 38,
                background: row.alert ? C.red : "rgba(243,247,252,0.35)",
                flex: "none",
              }}
            />
            <span
              style={{
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 38,
                color: C.white,
                lineHeight: 1.15,
              }}
            >
              {row.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ---------- s5: the capture itself lies ----------

const QualityPanel: React.FC<{ f: number }> = ({ f }) => {
  const rows = [
    { at: 18, text: "Trùng khung do mirror port" },
    { at: 92, text: "Chỉ thấy traffic một chiều" },
    { at: 166, text: "Gói tin bị truncated" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 700,
        width: CONTENT_W,
        background: "rgba(4,11,24,0.94)",
        borderTop: `6px solid ${C.red}`,
        padding: "16px 24px 18px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.muted, marginBottom: 4 }}>
        CHẤT LƯỢNG FILE CAPTURE
      </div>
      {rows.map((row, i) => {
        const p = inAt(f, row.at, 14);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              height: 74,
              borderTop: `1px solid ${C.rule}`,
              opacity: p,
              transform: `translateY(${(1 - p) * 14}px)`,
            }}
          >
            <svg width={34} height={34} viewBox="0 0 24 24" style={{ flex: "none" }}>
              <path d="M12 2.6L23 21.4H1z" fill="none" stroke={C.red} strokeWidth="1.8" />
              <rect x="11.1" y="9" width="1.8" height="6.2" fill={C.red} />
              <rect x="11.1" y="16.6" width="1.8" height="1.8" fill={C.red} />
            </svg>
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: C.white }}>{row.text}</span>
          </div>
        );
      })}
    </div>
  );
};

const ShotC: React.FC<{ f: number; globalFrame: number }> = ({ f, globalFrame }) => {
  const s5At = 537;
  const fade = 1 - inAt(f, 894, 26);
  return (
    <>
      <div style={{ position: "absolute", left: SAFE.left, top: FRAME.contentTop, width: CONTENT_W }}>
        <Headline f={f} size={56} delay={f < s5At ? 0 : s5At} key={f < s5At ? "s4" : "s5"}>
          {f < s5At ? (
            <>
              Quét dịch vụ mạng
              <br />
              và bảo mật
            </>
          ) : (
            <>
              Cảnh báo chất lượng
              <br />
              bắt gói
            </>
          )}
        </Headline>
      </div>
      <div style={{ opacity: fade }}>
        {f < s5At ? (
          <DetectorPanel f={f} globalFrame={globalFrame} />
        ) : (
          <QualityPanel f={f - s5At} />
        )}
        {f < s5At ? (
          <FactStack
            f={f}
            kicker="LỖI MẠNG & BẢO MẬT"
            delay={4}
            items={[
              { at: 8, text: "DNS SERVFAIL, bão ARP" },
              { at: 220, text: "Port scan, cleartext login" },
            ]}
          />
        ) : (
          <LowerThird
            f={f - s5At}
            kicker="CAPTURE QUALITY"
            text="File capture tự giới hạn kết quả."
            delay={50}
            size={42}
          />
        )}
      </div>
    </>
  );
};

// ---------- shot D: AI investigation ----------

const Board: React.FC<{ children: ReactNode; f: number }> = ({ children, f }) => {
  const p = inAt(f, 0, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 700,
        width: CONTENT_W,
        minHeight: 340,
        boxSizing: "border-box",
        background: "rgba(4,11,24,0.95)",
        borderTop: `6px solid ${C.red}`,
        padding: "18px 24px 20px",
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
      }}
    >
      {children}
    </div>
  );
};

const ThinkingDots: React.FC<{ f: number }> = ({ f }) => {
  const phase = Math.floor(f / 12) % 3;
  return (
    <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: i === phase ? C.red : "rgba(243,247,252,0.28)",
          }}
        />
      ))}
    </span>
  );
};

const AiPanel: React.FC<{ f: number }> = ({ f }) => {
  const items = [
    { at: 54, text: "API key cá nhân" },
    { at: 124, text: "Trích dẫn số thứ tự packet" },
    { at: 196, text: "Hỏi đáp theo ngữ cảnh" },
  ];
  return (
    <Board f={f}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, minHeight: 46 }}>
        <svg width={40} height={40} viewBox="0 0 24 24" style={{ flex: "none" }}>
          <path d={siAnthropic.path} fill={C.white} />
        </svg>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: C.white }}>Anthropic API</div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <ThinkingDots f={f} />
          <span style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, color: C.muted }}>điều tra</span>
        </div>
      </div>
      {items.map((item, i) => {
        const p = inAt(f, item.at, 14);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              height: 68,
              borderTop: `1px solid ${C.rule}`,
              opacity: p,
              transform: `translateX(${(1 - p) * 26}px)`,
            }}
          >
            <span style={{ width: 10, height: 10, background: C.red, flex: "none" }} />
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: C.white }}>{item.text}</span>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 10,
          opacity: inAt(f, 262, 16),
          fontFamily: mono,
          fontWeight: 500,
          fontSize: 34,
          color: C.muted,
          lineHeight: 1.3,
        }}
      >
        metadata + thống kê gói tin
      </div>
    </Board>
  );
};

const PrivacyPanel: React.FC<{ f: number }> = ({ f }) => {
  const p = inAt(f, 0, 14);
  const drain = interpolate(f, [10, 80], [1, 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <Board f={f}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, lineHeight: 0.9 }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 170,
            letterSpacing: -6,
            color: C.white,
            fontVariantNumeric: "tabular-nums",
            opacity: p,
          }}
        >
          60
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 52, color: C.muted }}>phút</div>
        <div style={{ marginLeft: "auto", textAlign: "right", paddingBottom: 18 }}>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: C.white }}>không hoạt động</div>
          <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, color: C.muted }}>tự xóa capture</div>
        </div>
      </div>
      <div style={{ width: "100%", height: 8, background: "rgba(243,247,252,0.16)", marginTop: 6 }}>
        <div style={{ width: `${drain * 100}%`, height: "100%", background: C.red }} />
      </div>
      <div style={{ marginTop: 22 }}>
        {[
          { at: 24, text: "AI chỉ nhận packet metadata" },
          { at: 92, text: "Không gửi toàn bộ file pcap" },
        ].map((row, i) => {
          const q = inAt(f, row.at, 14);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                height: 60,
                opacity: q,
                transform: `translateY(${(1 - q) * 10}px)`,
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 36,
                color: C.white,
                borderTop: i === 0 ? `1px solid ${C.rule}` : undefined,
              }}
            >
              <span style={{ width: 10, height: 10, background: C.red, flex: "none" }} />
              {row.text}
            </div>
          );
        })}
      </div>
    </Board>
  );
};

const DemoPanel: React.FC<{ f: number }> = ({ f }) => {
  const p = inAt(f, 0, 16);
  return (
    <Board f={f}>
      <div
        style={{
          marginTop: 4,
          fontFamily: display,
          fontWeight: 800,
          fontSize: 104,
          lineHeight: 1.1,
          letterSpacing: -3,
          color: C.white,
          opacity: p,
          transform: `translateY(${(1 - p) * 18}px)`,
        }}
      >
        MIỄN PHÍ
      </div>
      <div style={{ width: 170, height: 8, background: C.red, marginTop: 8, opacity: p }} />
      <div style={{ marginTop: 18 }}>
        {[
          { at: 30, text: "Không cần API key" },
          { at: 96, text: "Mô phỏng đầy đủ luồng phân tích" },
          { at: 162, text: "Xem kết quả mẫu trực quan" },
        ].map((row, i) => {
          const q = inAt(f, row.at, 14);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                height: 58,
                opacity: q,
                transform: `translateX(${(1 - q) * 20}px)`,
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 36,
                color: C.white,
              }}
            >
              <span style={{ width: 10, height: 10, background: C.red, flex: "none" }} />
              {row.text}
            </div>
          );
        })}
      </div>
    </Board>
  );
};

const ShotD: React.FC<{ f: number }> = ({ f }) => {
  const impact = 1.045 - 0.045 * inAt(f, 0, 12);
  const phase = f < D7 ? 0 : f < D8 ? 1 : 2;
  const headline =
    phase === 0 ? (
      <>
        Điều tra gói tin
        <br />
        bằng <span style={{ color: C.red }}>AI</span>
      </>
    ) : phase === 1 ? (
      <>
        Bảo mật dữ liệu
        <br />
        khi phân tích
      </>
    ) : (
      <>
        Chế độ demo
        <br />
        hoàn toàn miễn phí
      </>
    );
  const lower =
    phase === 0
      ? { delay: 60, kicker: "ĐIỀU TRA BẰNG AI", text: "Trích dẫn số gói tin làm bằng chứng." }
      : phase === 1
        ? { delay: D7 + 10, kicker: "DỮ LIỆU CAPTURE", text: "Mã hóa, tự xóa sau 60 phút." }
        : { delay: D8 + 10, kicker: "CHẾ ĐỘ DEMO", text: "Toàn bộ quy trình, không tốn phí." };
  return (
    <AbsoluteFill style={{ transform: `scale(${impact})`, transformOrigin: "50% 35%" }}>
      <div style={{ position: "absolute", left: SAFE.left, top: FRAME.contentTop, width: CONTENT_W }}>
        <Headline f={f} size={58} delay={phase === 0 ? 0 : phase === 1 ? D7 : D8} key={phase}>
          {headline}
        </Headline>
      </div>
      {phase === 0 && <AiPanel f={f} />}
      {phase === 1 && <PrivacyPanel f={f - D7} />}
      {phase === 2 && <DemoPanel f={f - D8} />}
      <LowerThird
        f={f}
        kicker={lower.kicker}
        text={lower.text}
        delay={lower.delay}
        size={42}
        key={`lt-${phase}`}
      />
    </AbsoluteFill>
  );
};

export const Story2: React.FC = () => {
  const f = useCurrentFrame();
  const inC = f < 922;
  return (
    <AbsoluteFill>
      <Backdrop
        src="footage/ai-network-cybersecurity-pixabay-299373.mp4"
        kind="video"
        len={SHOTS.c.len + SHOTS.d.len}
        globalStart={STORY_START}
        position="50% 45%"
        darkness={0.7}
        saturate={0.35}
        playbackRate={0.4}
      />
      <Chrome story={2} label="Chẩn đoán" ticker={TICKER} f={f} intro={false} />
      {inC ? (
        <ShotC f={f} globalFrame={STORY_START + f} />
      ) : (
        <>
          <ShotD f={f - 922} />
          <Flash at={922} />
        </>
      )}
    </AbsoluteFill>
  );
};
