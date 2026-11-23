import type { ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { CONTENT_W, display, easeOut, mono, SAFE, sans, Terminal } from "../../kit";
import { siDocker, siGithub } from "simple-icons";
import { Backdrop, Chrome, FactStack, inAt, LowerThird, rise } from "./chrome";
import { a, C, FRAME } from "./theme";
import { E2, E3, SHOTS } from "./timing";
import facts from "./facts.json";

const repo = facts.repos[0];
export const INSTALL_CMDS = [
  "git clone https://github.com/sebaandrada-cell/PcapAnalyzer.git",
  "cd PcapAnalyzer",
  "./start.sh",
];
const TICKER =
  "TỰ HOST TRÊN VPS   /   DOCKER COMPOSE   /   BIND 127.0.0.1   /   REVERSE PROXY CÓ XÁC THỰC   /   APACHE 2.0   /   ";

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

const IconLine: React.FC<{
  f: number;
  icon: { path: string; hex: string };
  label: string;
  x: number;
  tint?: string;
}> = ({ f, icon, label, x, tint }) => {
  const p = inAt(f, 8, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left + x,
        top: 690,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: p,
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 36,
        color: C.white,
      }}
    >
      <svg width={46} height={46} viewBox="0 0 24 24">
        <path d={icon.path} fill={tint ?? `#${icon.hex}`} />
      </svg>
      {label}
    </div>
  );
};

const InstallShot: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ position: "absolute", left: SAFE.left, top: FRAME.contentTop, width: CONTENT_W }}>
      <Headline f={f} size={58}>
        Cài đặt
        <br />
        PcapAnalyzer
      </Headline>
    </div>
    <IconLine f={f} icon={siDocker} label="Docker" x={0} />
    <IconLine f={f} icon={siGithub} label="GitHub" x={210} tint={C.white} />
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 760,
        width: CONTENT_W,
        opacity: inAt(f, 4, 14),
        transform: `translateY(${(1 - inAt(f, 4, 14)) * 24}px)`,
      }}
    >
      <div style={{ width: CONTENT_W, height: 6, background: C.red }} />
      <Terminal
        cmds={INSTALL_CMDS}
        width={CONTENT_W}
        fontSize={36}
        minHeight={300}
        bg="#0A1B31"
        fg={C.white}
        accent={C.red}
      />
    </div>
    <LowerThird
      f={f}
      kicker="CÀI ĐẶT"
      text="Ba lệnh, dựng bằng Docker Compose."
      delay={36}
      size={42}
    />
  </>
);

type Node = { label: string; sub: string; at: number; red?: boolean; monoSub?: boolean };

const DeployDiagram: React.FC<{ f: number }> = ({ f }) => {
  const nodes: Node[] = [
    { label: "Internet", sub: "người dùng", at: 18 },
    { label: "Reverse proxy", sub: "xác thực", at: 150, red: true },
    { label: "PcapAnalyzer", sub: "127.0.0.1", at: 80, monoSub: true },
  ];
  const ys = [700, 848, 996];
  const seg = (from: number, to: number, at: number) => {
    const p = inAt(f, at, 18);
    return { p, y: from, h: (to - from) * p };
  };
  const s1 = seg(780, 848, 200);
  const s2 = seg(928, 996, 268);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      {nodes.map((n, i) => {
        const p = inAt(f, n.at, 16);
        return (
          <div
            key={n.label}
            style={{
              position: "absolute",
              left: 211,
              top: ys[i],
              width: 560,
              height: 80,
              boxSizing: "border-box",
              opacity: p,
              transform: `translateY(${(1 - p) * 18}px)`,
              background: "rgba(4,11,24,0.95)",
              border: `2px solid ${n.red ? C.red : C.rule}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                fontFamily: n.monoSub ? display : sans,
                fontWeight: 700,
                fontSize: 36,
                lineHeight: 1.1,
                color: n.red ? C.red : C.white,
              }}
            >
              {n.label}
            </div>
            <div
              style={{
                fontFamily: n.monoSub ? mono : sans,
                fontWeight: 500,
                fontSize: 34,
                lineHeight: 1.1,
                color: n.monoSub ? C.red : C.muted,
              }}
            >
              {n.sub}
            </div>
          </div>
        );
      })}

      {[
        { s: s1, label: "HTTPS", color: C.white, at: 210 },
        { s: s2, label: "sau xác thực", color: C.red, at: 278 },
      ].map((a1, i) => (
        <div key={i}>
          <div
            style={{
              position: "absolute",
              left: 489,
              top: a1.s.y,
              width: 4,
              height: a1.s.h,
              background: a1.color,
              opacity: a1.s.p,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 480,
              top: a1.s.y + a1.s.h - 2,
              width: 0,
              height: 0,
              borderLeft: "11px solid transparent",
              borderRight: "11px solid transparent",
              borderTop: `18px solid ${a1.color}`,
              opacity: a1.s.p > 0.95 ? 1 : 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 518,
              top: a1.s.y + 4,
              opacity: inAt(f, a1.at, 14),
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 34,
              color: a1.color,
            }}
          >
            {a1.label}
          </div>
        </div>
      ))}

    </div>
  );
};

const DeployShot: React.FC<{ f: number }> = ({ f }) => (
  <>
    <div style={{ position: "absolute", left: SAFE.left, top: FRAME.contentTop, width: CONTENT_W }}>
      <Headline f={f} size={56}>
        Lưu ý cấu hình
        <br />
        truy cập
      </Headline>
    </div>
    <DeployDiagram f={f} />
    <FactStack
      f={f}
      kicker="TRƯỚC KHI MỞ RA NGOÀI"
      delay={40}
      items={[
        { at: 50, text: "Bind mặc định: 127.0.0.1" },
        { at: 170, text: "Token ngẫu nhiên trong .env" },
        { at: 290, text: "Cần reverse proxy có xác thực" },
      ]}
    />
  </>
);

const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const p1 = inAt(f, 8, 20);
  const p2 = inAt(f, 24, 20);
  const p3 = inAt(f, 60, 18);
  const p4 = inAt(f, 104, 18);
  const underline = interpolate(f, [30, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <>
      <div style={{ position: "absolute", left: SAFE.left, top: 566, width: CONTENT_W }}>
        <div
          style={{
            ...rise(p1, 34),
            fontFamily: display,
            fontWeight: 800,
            fontSize: 112,
            lineHeight: 1,
            letterSpacing: -3,
            color: C.white,
          }}
        >
          Lưu video.
        </div>
        <div
          style={{
            ...rise(p2, 34),
            marginTop: 6,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 112,
            lineHeight: 1,
            letterSpacing: -3,
            color: C.white,
            width: "fit-content",
          }}
        >
          Theo dõi kênh.
          <div style={{ marginTop: 14, height: 10, width: `${underline * 100}%`, background: C.red }} />
        </div>

        <div
          style={{
            ...rise(p3, 24),
            marginTop: 62,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 44,
            lineHeight: 1.3,
            color: C.muted,
          }}
        >
          Anh em mất bao nhiêu tiếng
          <br />
          soi Wireshark?
        </div>

        <div
          style={{
            marginTop: 44,
            opacity: p4,
            transform: `translateY(${(1 - p4) * 20}px)`,
            borderTop: `2px solid ${C.rule}`,
            paddingTop: 22,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Img
            src={a(repo.avatar)}
            style={{ width: 76, height: 76, borderRadius: 38, objectFit: "cover", flex: "none" }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 48, color: C.white, lineHeight: 1 }}>
              {repo.name}
            </div>
            <div
              style={{
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 34,
                color: C.muted,
                marginTop: 4,
              }}
            >
              {repo.license} · {repo.language}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: display,
              fontWeight: 800,
              fontSize: 44,
              color: C.white,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <svg width={36} height={36} viewBox="0 0 24 24">
              <path
                d="M12 1.8l3 6.6 7.2.8-5.4 4.8 1.5 7.1L12 17.4l-6.3 3.7 1.5-7.1L1.8 9.2 9 8.4z"
                fill={C.red}
              />
            </svg>
            {repo.stars}
          </div>
        </div>
      </div>
    </>
  );
};

export const Story3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop
        src="images/network-cables-server-rack-pixabay-197303.jpg"
        len={SHOTS.e.len}
        globalStart={SHOTS.e.start}
        position="50% 50%"
        darkness={0.64}
        saturate={0.72}
      />
      <Chrome story={3} label="Triển khai" ticker={TICKER} f={f} intro={false} />
      {f < E2 ? (
        <InstallShot f={f} />
      ) : f < E3 ? (
        <DeployShot f={f - E2} />
      ) : (
        <EndCard f={f - E3} />
      )}
    </AbsoluteFill>
  );
};
