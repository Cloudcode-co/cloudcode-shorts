import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { CONTENT_W, display, easeOut, mono, SAFE, sans } from "../../kit";
import { siWireshark } from "simple-icons";
import {
  Backdrop,
  Chrome,
  FactStack,
  inAt,
  LowerThird,
  rise,
} from "./chrome";
import { a, C, FRAME } from "./theme";
import { A2, SHOTS } from "./timing";
import facts from "./facts.json";

const repo = facts.repos[0];
const TICKER =
  "PCAPANALYZER 208 SAO TRÊN GITHUB   /   27 BỘ PHÁT HIỆN   /   HỖ TRỢ .PCAP .PCAPNG GZIP   /   APACHE 2.0   /   PYTHON   /   ";

const Glyph: React.FC<{ path: string; size: number; color?: string }> = ({ path, size, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
    <path d={path} fill={color} />
  </svg>
);

const Headline: React.FC<{ f: number; children: ReactNode; delay?: number; size?: number }> = ({
  f,
  children,
  delay = 0,
  size = 56,
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

// ---------- s1: the question ----------

const Hook: React.FC<{ f: number }> = ({ f }) => {
  const p1 = inAt(f, 10, 18);
  const p2 = inAt(f, 24, 18);
  const line = inAt(f, 40, 40);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: FRAME.contentTop,
          width: CONTENT_W,
        }}
      >
        <div
          style={{
            ...rise(p1, 34),
            fontFamily: display,
            fontWeight: 800,
            fontSize: 92,
            lineHeight: 0.99,
            letterSpacing: -2.5,
            color: C.white,
            textWrap: "balance",
          }}
        >
          Soi gói tin
          <br />
          thủ công
          <br />
          <span style={{ color: C.red }}>mất bao lâu?</span>
        </div>
        <div
          style={{
            ...rise(p2, 24),
            marginTop: 34,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 40,
            lineHeight: 1.25,
            color: C.muted,
          }}
        >
          <div>Phân tích lưu lượng mạng</div>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 46 }}>
            Hàng nghìn dòng packet rối mắt
          </div>
        </div>
        <div
          style={{
            marginTop: 34,
            width: line * 170,
            height: 8,
            background: C.red,
          }}
        />
      </div>
      <LowerThird
        f={f}
        kicker="SỰ CỐ MẠNG"
        text="Soi từng gói Wireshark khi server lỗi."
        delay={120}
        size={42}
      />
    </>
  );
};

// ---------- s2: manual vs PcapAnalyzer, the project card ----------

const Compare: React.FC<{ f: number }> = ({ f }) => {
  const manual = inAt(f, 8, 16);
  const card = inAt(f, 196, 20);
  const cardScale = interpolate(f, [196, 226], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const stars = Math.round(
    interpolate(f, [222, 274], [0, repo.stars], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    }),
  );
  return (
    <>
      <div style={{ position: "absolute", left: SAFE.left, top: FRAME.contentTop, width: CONTENT_W }}>
        <Headline f={f} size={54} delay={0}>
          Wireshark thủ công
          <br />
          <span style={{ color: C.muted }}>vs</span> PcapAnalyzer
        </Headline>

        <div
          style={{
            ...rise(manual, 26),
            marginTop: 26,
            height: 112,
            boxSizing: "border-box",
            background: "rgba(4,11,24,0.92)",
            border: `2px solid ${C.rule}`,
            padding: "0 22px",
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          <Glyph path={siWireshark.path} size={54} color={C.muted} />
          <div>
            <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.muted }}>Wireshark</div>
            <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: C.white, marginTop: 2 }}>
              Tự viết bộ lọc, lội từng gói tin
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            opacity: card,
            transform: `translateY(${(1 - card) * 38}px) scale(${cardScale})`,
            transformOrigin: "50% 100%",
            background: C.paper,
            borderTop: `8px solid ${C.red}`,
            boxSizing: "border-box",
            padding: "20px 26px 18px",
            color: C.ink,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Img
              src={a(repo.avatar)}
              style={{ width: 92, height: 92, borderRadius: 46, objectFit: "cover", flex: "none" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: 50,
                  lineHeight: 1,
                  letterSpacing: -1,
                }}
              >
                {repo.name}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 8,
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: 44,
                  fontVariantNumeric: "tabular-nums",
                  color: C.ink,
                }}
              >
                <svg width={38} height={38} viewBox="0 0 24 24">
                  <path
                    d="M12 1.8l3 6.6 7.2.8-5.4 4.8 1.5 7.1L12 17.4l-6.3 3.7 1.5-7.1L1.8 9.2 9 8.4z"
                    fill={C.red}
                  />
                </svg>
                {stars}
                <span style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, color: "#42536d" }}>sao</span>
              </div>
              <div
                style={{
                  marginTop: 2,
                  fontFamily: sans,
                  fontWeight: 500,
                  fontSize: 34,
                  color: "#42536d",
                }}
              >
                {repo.license} · {repo.language}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: "2px solid rgba(8,20,38,0.16)",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span
                style={{
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: 48,
                  lineHeight: 1,
                  letterSpacing: -1,
                  color: C.ink,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                27
              </span>
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: C.ink }}>
                bộ phát hiện
              </span>
            </div>
            <span style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, color: "#42536d" }}>
              quét tự động
            </span>
          </div>
        </div>
      </div>

      <LowerThird
        f={f}
        kicker="UPLOAD MỘT FILE CAPTURE"
        text=".pcap   .pcapng   .gzip"
        delay={250}
        size={44}
      />
    </>
  );
};

// ---------- s3: a SYN that meets a firewall ----------

const Diagram: React.FC<{ f: number }> = ({ f }) => {
  const box = (delay: number) => inAt(f, delay, 14);
  const syn = inAt(f, 76, 26);
  const stop = inAt(f, 108, 12);
  const rst = inAt(f, 124, 26);
  const caption = inAt(f, 160, 16);
  const columns = [
    { name: "CLIENT", sub: "nguồn gửi", x: SAFE.left, w: 214, delay: 10 },
    { name: "FIREWALL", sub: "chặn gói", x: 392, w: 214, delay: 20, alert: true },
    { name: "SERVER", sub: "đích", x: 666, w: 214, delay: 30 },
  ];
  const centers = columns.map((c) => c.x + c.w / 2);
  const synLen = centers[1] - centers[0];
  const rstLen = centers[1] - centers[0];
  return (
    <div style={{ position: "absolute", left: 0, top: 690, width: 1080, height: 420 }}>
      {/* lifelines */}
      {centers.map((cx, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: cx - 1,
            top: 70,
            width: 2,
            height: 330 * inAt(f, 40 + i * 6, 20),
            background: i === 1 ? "rgba(226,35,43,0.5)" : "rgba(243,247,252,0.24)",
          }}
        />
      ))}
      {columns.map((c) => {
        const p = box(c.delay);
        return (
          <div
            key={c.name}
            style={{
              position: "absolute",
              left: c.x,
              top: 0,
              width: c.w,
              height: 64,
              boxSizing: "border-box",
              opacity: p,
              transform: `translateY(${(1 - p) * 16}px)`,
              background: "rgba(4,11,24,0.94)",
              border: `2px solid ${c.alert ? C.red : C.rule}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: mono,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 34, color: c.alert ? C.red : C.white, letterSpacing: 1 }}>
              {c.name}
            </div>
            <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, color: C.muted }}>{c.sub}</div>
          </div>
        );
      })}

      {/* SYN */}
      <div
        style={{
          position: "absolute",
          left: centers[0],
          top: 150,
          width: synLen * syn,
          height: 4,
          background: C.white,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: centers[0] + synLen * syn - 2,
          top: 140,
          width: 0,
          height: 0,
          borderTop: "12px solid transparent",
          borderBottom: "12px solid transparent",
          borderLeft: `18px solid ${C.white}`,
          opacity: syn > 0.95 ? 1 : 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: centers[0] + 26,
          top: 112,
          ...({
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 34,
            color: C.white,
          } as CSSProperties),
          opacity: syn,
        }}
      >
        SYN
      </div>

      {/* the block */}
      <div
        style={{
          position: "absolute",
          left: centers[1] - 22,
          top: 128,
          width: 44,
          height: 44,
          opacity: stop,
          transform: `scale(${0.8 + stop * 0.2})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 19,
            top: 0,
            width: 6,
            height: 44,
            background: C.red,
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 19,
            top: 0,
            width: 6,
            height: 44,
            background: C.red,
            transform: "rotate(-45deg)",
          }}
        />
      </div>

      {/* RST */}
      <div
        style={{
          position: "absolute",
          left: centers[1] - rstLen * rst,
          top: 246,
          width: rstLen * rst,
          height: 4,
          background: C.red,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: centers[1] - rstLen * rst - 16,
          top: 236,
          width: 0,
          height: 0,
          borderTop: "12px solid transparent",
          borderBottom: "12px solid transparent",
          borderRight: `18px solid ${C.red}`,
          opacity: rst > 0.95 ? 1 : 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: centers[1] - 86,
          top: 208,
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 34,
          color: C.red,
          opacity: rst,
        }}
      >
        RST
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 314,
          width: "fit-content",
          background: "rgba(4,11,24,0.94)",
          padding: "10px 18px",
          boxSizing: "border-box",
          opacity: caption,
          transform: `translateY(${(1 - caption) * 12}px)`,
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 38,
          color: C.red,
        }}
      >
        Firewall chặn SYN, handshake hỏng.
      </div>
    </div>
  );
};

const TcpShot: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ position: "absolute", left: SAFE.left, top: FRAME.contentTop, width: CONTENT_W }}>
      <Headline f={f} size={56}>
        Bắt lỗi TCP
        <br />
        và đường truyền
      </Headline>
    </div>
    <Diagram f={f} />
    <FactStack
      f={f}
      kicker="BỘ PHÁT HIỆN TCP & ĐƯỜNG TRUYỀN"
      delay={190}
      items={[
        { at: 200, text: "Retransmission, duplicate ACK" },
        { at: 330, text: "Bắt tay chậm, zero window" },
        { at: 460, text: "PMTUD black holes, MSS thấp" },
      ]}
    />
  </>
);

export const Story1: React.FC = () => {
  const f = useCurrentFrame();
  const inA = f < SHOTS.a.len;
  const af = f;
  return (
    <AbsoluteFill>
      <Backdrop
        src="images/programmer-laptop-code-dark-pixabay-1568556.jpg"
        len={SHOTS.a.len + SHOTS.b.len}
        globalStart={0}
        position="50% 42%"
        darkness={0.7}
        topScrim
      />
      <Chrome story={1} label="Sự cố" ticker={TICKER} f={f} />
      {inA ? af < A2 ? <Hook f={af} /> : <Compare f={af - A2} /> : <TcpShot f={f - SHOTS.b.start} />}
    </AbsoluteFill>
  );
};
