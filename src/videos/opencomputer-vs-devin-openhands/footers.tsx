import type { ReactNode } from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { sans } from "../../kit";
import { C, rise, round } from "./theme";
import { Avatar } from "./set";
import { Terminal } from "./Terminal";

// Everything in the lower console, one build per scene.

const Card: React.FC<{ children: ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      background: "rgba(255,244,216,0.055)",
      border: "2px solid rgba(255,201,74,0.22)",
      borderRadius: 24,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

const Wire: React.FC<{ p: number; width?: number }> = ({ p, width = 34 }) => (
  <svg width={width} height={30} viewBox="0 0 34 30" style={{ flex: "none", opacity: p }}>
    <path
      d="M2 15h24"
      stroke={C.gold}
      strokeWidth={3}
      strokeLinecap="round"
      strokeDasharray={26}
      strokeDashoffset={26 * (1 - p)}
    />
    <path
      d="M22 9l7 6-7 6"
      fill="none"
      stroke={C.gold}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={p}
    />
  </svg>
);

// Two timed bars: the fastest run vs the slow one. Proportions are real.
export const RaceBars: React.FC<{
  aLabel: string;
  aValue: string;
  aFrac: number;
  bLabel: string;
  bValue: string;
  bFrac: number;
  at: number;
  revealAt?: number;
  statValue: string;
  statLabel: string;
  statAt: number;
}> = ({ aLabel, aValue, aFrac, bLabel, bValue, bFrac, at, revealAt = 9999, statValue, statLabel, statAt }) => {
  const f = useCurrentFrame();
  const gA = rise(f, at, 20);
  const gB = rise(f, at + 25, 20);
  const won = f >= revealAt;
  const stat = rise(f, statAt, 12);
  const row = (
    label: string,
    value: string,
    frac: number,
    grow: number,
    hot: boolean,
    dim: boolean
  ) => (
    <div style={{ opacity: dim ? 0.45 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span
          style={{
            fontFamily: round,
            fontWeight: 700,
            fontSize: 37,
            color: hot ? C.greenBright : C.cream,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: round,
            fontWeight: 800,
            fontSize: 42,
            color: hot ? C.greenBright : C.cream,
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          height: 22,
          marginTop: 8,
          borderRadius: 11,
          background: "rgba(255,244,216,0.09)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${frac * 100 * grow}%`,
            borderRadius: 11,
            background: hot ? C.green : C.violet,
          }}
        />
      </div>
    </div>
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 8,
        height: "100%",
      }}
    >
      {row(aLabel, aValue, aFrac, gA, won, false)}
      {row(bLabel, bValue, bFrac, gB, false, won)}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          opacity: stat,
          translate: `0px ${(1 - stat) * 10}px`,
          marginTop: 2,
        }}
      >
        <span style={{ fontFamily: round, fontWeight: 800, fontSize: 62, color: C.gold, lineHeight: 1 }}>
          {statValue}
        </span>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.cream }}>
          {statLabel}
        </span>
      </div>
    </div>
  );
};

export const RepoCard: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = rise(f, at, 14);
  // The words arrive with the avatar: the card flips in on the cut, so a late
  // text delay would leave the console showing only the logo.
  const q = rise(f, at + 6, 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        height: "100%",
      }}
    >
      <div style={{ opacity: p, scale: String(0.92 + 0.08 * p), flex: "none" }}>
        <Avatar file="repos/diggerhq.png" size={180} />
      </div>
      <div style={{ opacity: q, translate: `0px ${(1 - q) * 16}px` }}>
        <div style={{ fontFamily: round, fontWeight: 800, fontSize: 52, color: C.cream, lineHeight: 1.05 }}>
          OpenComputer
        </div>
        <div style={{ fontFamily: round, fontWeight: 800, fontSize: 46, color: C.gold, lineHeight: 1.18 }}>
          Apache-2.0
        </div>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 34,
            color: "rgba(255,244,216,0.82)",
            lineHeight: 1.3,
          }}
        >
          1.189 sao trên GitHub
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4 }}>
          <span style={{ fontFamily: round, fontWeight: 800, fontSize: 36, color: C.greenBright }}>56s</span>
          <span style={{ fontFamily: round, fontWeight: 700, fontSize: 34, color: C.cream }}>vs 185s</span>
          <span style={{ fontFamily: round, fontWeight: 800, fontSize: 34, color: C.gold }}>· 3,3 lần</span>
        </div>
      </div>
    </div>
  );
};

export const SlackFlow: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p1 = rise(f, at, 12);
  const p2 = rise(f, at + 60, 12);
  const w = rise(f, at + 40, 10);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, height: "100%" }}>
      <Card style={{ width: 318, height: 246, padding: 22, opacity: p1, translate: `0px ${(1 - p1) * 16}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              background: "rgba(255,201,74,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: round,
              fontWeight: 800,
              fontSize: 36,
              color: C.gold,
            }}
          >
            @
          </div>
          <div style={{ fontFamily: round, fontWeight: 800, fontSize: 44, color: C.cream }}>@Computer</div>
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: "rgba(255,244,216,0.85)", marginTop: 14, lineHeight: 1.25 }}>
          tag trong Slack
        </div>
      </Card>
      <Wire p={w} width={42} />
      <Card style={{ flex: 1, height: 246, padding: 22, opacity: p2, translate: `0px ${(1 - p2) * 16}px` }}>
        <div style={{ fontFamily: round, fontWeight: 800, fontSize: 44, color: C.greenBright, lineHeight: 1.1 }}>
          Pull Request
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <svg width={40} height={40} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" fill={C.green} />
            <path d="M6.5 12.4l3.6 3.6 7.4-8" fill="none" stroke="#03301F" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 35, color: C.cream }}>CI xanh</span>
        </div>
      </Card>
    </div>
  );
};

export const VMCard: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = rise(f, at, 14);
  const q = rise(f, at + 80, 12);
  return (
    <div style={{ display: "flex", gap: 22, height: "100%", alignItems: "stretch" }}>
      <Card style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", opacity: p, translate: `0px ${(1 - p) * 16}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: round, fontWeight: 800, fontSize: 150, color: C.gold, lineHeight: 0.86 }}>1</div>
          <div style={{ fontFamily: round, fontWeight: 800, fontSize: 52, color: C.cream, lineHeight: 1.05 }}>VM Linux</div>
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: "rgba(255,244,216,0.8)", lineHeight: 1.25, marginTop: 4 }}>
          toàn bộ kiến trúc
        </div>
      </Card>
      <Card
        style={{
          width: 292,
          padding: "22px 18px",
          opacity: q,
          translate: `0px ${(1 - q) * 16}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <svg width={64} height={64} viewBox="0 0 24 24">
          <path d="M12 2l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5z" fill="rgba(255,201,74,0.16)" stroke={C.gold} strokeWidth={1.7} />
          <rect x="8.2" y="10.5" width="7.6" height="6" rx="1.4" fill="none" stroke={C.gold} strokeWidth={1.8} />
          <path d="M9.6 10.5V9a2.4 2.4 0 014.8 0v1.5" fill="none" stroke={C.gold} strokeWidth={1.8} />
        </svg>
        <div style={{ fontFamily: round, fontWeight: 800, fontSize: 34, color: C.goldHot, marginTop: 6 }}>
          outbound-only
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: "rgba(255,244,216,0.82)", marginTop: 2 }}>
          chỉ ra ngoài
        </div>
      </Card>
    </div>
  );
};

// A bell that brightens a node as the voice reaches it. The whole flow is on
// screen from the cut (so the console is never half-empty); the pulses carry
// the timing.
const pulse = (f: number, at: number, dur = 52) => {
  const d = f - at;
  if (d < 0 || d > dur) return 0;
  return Math.sin((d / dur) * Math.PI);
};

const Node: React.FC<{ label: string; sub: string; at: number; f: number; hot?: number }> = ({
  label,
  sub,
  at,
  f,
  hot = 0,
}) => {
  const p = rise(f, at, 12);
  return (
    <div
      style={{
        width: 220,
        height: 136,
        borderRadius: 22,
        background: hot > 0 ? `rgba(255,201,74,${0.06 + 0.16 * hot})` : "rgba(255,244,216,0.06)",
        border: `2px solid rgba(255,201,74,${0.25 + 0.6 * hot})`,
        boxShadow: hot > 0 ? `0 0 ${30 * hot}px rgba(255,201,74,${0.38 * hot})` : undefined,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: p,
        scale: String((0.94 + 0.06 * p) * (1 + 0.03 * hot)),
      }}
    >
      <div style={{ fontFamily: round, fontWeight: 800, fontSize: 36, color: C.cream, lineHeight: 1.05 }}>{label}</div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.gold, lineHeight: 1.2 }}>{sub}</div>
    </div>
  );
};

export const GatewayFlow: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const pod = rise(f, at, 14);
  const hotSlack = pulse(f, 130);
  const hotCalvin = pulse(f, 30);
  const hotClaude = pulse(f, 220);
  const hotPod = pulse(f, 330);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Node label="Slack" sub="sự kiện" at={at} f={f} hot={hotSlack} />
        <Wire p={1} width={30} />
        <Node label="Calvin" sub="gateway" at={at} f={f} hot={hotCalvin} />
        <Wire p={1} width={30} />
        <Node label="Claude Code" sub="hoặc Codex" at={at} f={f} hot={hotClaude} />
      </div>
      <div
        style={{
          height: 108,
          borderRadius: 24,
          background: `rgba(255,201,74,${0.1 + 0.12 * hotPod})`,
          border: `2px solid rgba(255,201,74,${0.55 + 0.4 * hotPod})`,
          boxShadow: hotPod > 0 ? `0 0 ${34 * hotPod}px rgba(255,201,74,${0.42 * hotPod})` : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          opacity: pod,
          translate: `0px ${(1 - pod) * 14}px`,
        }}
      >
        <svg width={48} height={48} viewBox="0 0 24 24">
          <rect x="4.5" y="10" width="15" height="10" rx="2.5" fill="none" stroke={C.gold} strokeWidth={2.2} />
          <path d="M8 10V7.5a4 4 0 018 0V10" fill="none" stroke={C.gold} strokeWidth={2.2} />
        </svg>
        <span style={{ fontFamily: round, fontWeight: 800, fontSize: 44, color: C.goldHot }}>rootless Podman</span>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.cream }}>mỗi session</span>
      </div>
    </div>
  );
};

export const GitCards: React.FC<{ at: number; dropAt: number }> = ({ at, dropAt }) => {
  const f = useCurrentFrame();
  const p = rise(f, at, 12);
  const q = rise(f, at, 14);
  const dropP = f >= dropAt ? Math.max(0, 1 - (f - dropAt) / 16) : 0;
  const hot = f >= dropAt;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%", justifyContent: "center" }}>
      <Card style={{ height: 132, padding: "0 22px", display: "flex", alignItems: "center", gap: 14, opacity: p }}>
        <span style={{ fontFamily: round, fontWeight: 800, fontSize: 40, color: C.cream }}>Đĩa VM</span>
        <Wire p={rise(f, at + 30, 12)} width={70} />
        <span style={{ fontFamily: round, fontWeight: 800, fontSize: 40, color: C.gold }}>Git</span>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: "rgba(255,244,216,0.78)", marginLeft: 6 }}>
          lưu trạng thái
        </span>
      </Card>
      <Card
        style={{
          position: "relative",
          height: 178,
          padding: "0 22px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: q,
          translate: `0px ${(1 - q) * 14}px`,
          scale: String(1 + dropP * 0.04),
          borderColor: hot ? C.gold : "rgba(255,201,74,0.22)",
          background: hot ? "rgba(255,201,74,0.14)" : "rgba(255,244,216,0.055)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -18,
            borderRadius: 38,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,201,74,0.5), rgba(255,201,74,0) 70%)",
            opacity: dropP,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            width: 74,
            height: 74,
            borderRadius: 18,
            background: C.gold,
            color: "#241050",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: round,
            fontWeight: 800,
            fontSize: 40,
            flex: "none",
          }}
        >
          BYO
        </div>
        <div>
          <div style={{ fontFamily: round, fontWeight: 800, fontSize: 44, color: C.goldHot, lineHeight: 1.05 }}>
            ChatGPT / Codex
          </div>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.cream, lineHeight: 1.25 }}>
            subscription cá nhân
          </div>
        </div>
      </Card>
    </div>
  );
};

export const LicenseMeter: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const start = rise(f, at, 12);
  const lit = Math.max(0, Math.min(30, Math.floor((f - at - 40) / 5)));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28, height: "100%", opacity: start }}>
      <div style={{ flex: "none" }}>
        <div style={{ fontFamily: round, fontWeight: 800, fontSize: 170, color: C.red, lineHeight: 0.85 }}>30</div>
        <div style={{ fontFamily: round, fontWeight: 700, fontSize: 38, color: C.cream }}>ngày/năm</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 4, height: 62, alignItems: "flex-end" }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: i < lit ? 62 : 18,
                borderRadius: 3,
                background: i < lit ? C.red : "rgba(255,244,216,0.16)",
              }}
            />
          ))}
        </div>
        <div style={{ fontFamily: round, fontWeight: 800, fontSize: 40, color: C.red, marginTop: 10 }}>
          Polyform Free Trial
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: "rgba(255,244,216,0.82)" }}>
          giới hạn 30 ngày thử nghiệm
        </div>
      </div>
    </div>
  );
};

export const PermissionMeter: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = rise(f, at, 14);
  const fill = rise(f, at + 90, 26);
  const flash = f >= at + 116 ? 0.5 + 0.5 * Math.cos((f - at - 116) / 5) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: p }}>
        <svg width={62} height={62} viewBox="0 0 24 24">
          <path d="M12 3l10 18H2z" fill="rgba(255,78,100,0.18)" stroke={C.red} strokeWidth={1.8} strokeLinejoin="round" />
          <path d="M12 9v5" stroke={C.red} strokeWidth={2.4} strokeLinecap="round" />
          <circle cx="12" cy="17.5" r="1.4" fill={C.red} />
        </svg>
        <span style={{ fontFamily: round, fontWeight: 800, fontSize: 48, color: C.cream }}>Filesystem máy chủ</span>
      </div>
      <div
        style={{
          height: 44,
          borderRadius: 22,
          background: "rgba(255,244,216,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${fill * 100}%`,
            borderRadius: 22,
            background: C.red,
            opacity: 0.82 + flash * 0.18,
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: p }}>
        <span style={{ fontFamily: round, fontWeight: 800, fontSize: 42, color: C.red }}>
          toàn quyền truy cập
        </span>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: "rgba(255,244,216,0.8)" }}>
          không sandbox
        </span>
      </div>
    </div>
  );
};

const CMDS = ["npm install -g @openhands/agent-canvas", "OH_CONVERSATION_RUNTIME=docker agent-canvas"];

export const TerminalBox: React.FC = () => {
  const f = useCurrentFrame();
  const p = rise(f, -16, 12);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%", opacity: p }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <svg width={42} height={42} viewBox="0 0 24 24">
          <rect x="4" y="10" width="4" height="4" fill="none" stroke={C.gold} strokeWidth={1.8} />
          <rect x="9" y="10" width="4" height="4" fill="none" stroke={C.gold} strokeWidth={1.8} />
          <rect x="14" y="10" width="4" height="4" fill="none" stroke={C.gold} strokeWidth={1.8} />
          <rect x="9" y="5" width="4" height="4" fill="none" stroke={C.gold} strokeWidth={1.8} />
          <path d="M3 16c4 3 12 3 16-1" fill="none" stroke={C.gold} strokeWidth={1.8} strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.gold }}>Docker sandbox</span>
      </div>
      <Sequence from={0} layout="none">
        <Terminal
          cmds={CMDS}
          width={729}
          fontSize={34}
          minHeight={300}
          bg="#120933"
          fg={C.cream}
          accent={C.gold}
        />
      </Sequence>
    </div>
  );
};

export const Challenge: React.FC<{ at: number; slamAt: number }> = ({ at, slamAt }) => {
  const f = useCurrentFrame();
  const p = rise(f, at, 14);
  const s = rise(f, slamAt, 10);
  const bump = f >= slamAt ? 1 + 0.06 * Math.max(0, 1 - (f - slamAt) / 14) : 1;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, height: "100%", opacity: p }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, scale: String(bump) }}>
        <span style={{ fontFamily: round, fontWeight: 800, fontSize: 168, color: C.gold, lineHeight: 0.9 }}>
          56s
        </span>
        <span
          style={{
            fontFamily: round,
            fontWeight: 800,
            fontSize: 150,
            color: C.goldHot,
            lineHeight: 0.9,
            opacity: s,
            translate: `0px ${(1 - s) * 18}px`,
          }}
        >
          ?
        </span>
      </div>
      <div>
        <div style={{ fontFamily: round, fontWeight: 800, fontSize: 46, color: C.cream, lineHeight: 1.1 }}>
          bot của anh em?
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: "rgba(255,244,216,0.82)", lineHeight: 1.3 }}>
          mở PR nhanh hơn được không
        </div>
      </div>
    </div>
  );
};
