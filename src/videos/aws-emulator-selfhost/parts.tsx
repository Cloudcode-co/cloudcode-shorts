import { loadFont } from "@remotion/google-fonts/Baloo2";
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, useCurrentFrame } from "remotion";
import { CONTENT_W, SAFE, easeOut, mono } from "../../kit";

export const round = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const C = {
  bg: "#240a5c",
  bg2: "#1a0644",
  panel: "#3a1396",
  gold: "#FFC933",
  goldDeep: "#D9930B",
  green: "#2FDB72",
  greenDeep: "#12803F",
  red: "#FF4D6A",
  white: "#FFFFFF",
  ink: "#1b0a45",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0→1 from frame `at`, ease-out.
export const pop = (f: number, at: number, dur = 14) =>
  interpolate(f - at, [0, dur], [0, 1], { ...clamp, easing: easeOut });

// A springy overshoot 0→1 (ease-out-back) for slams.
export const slam = (f: number, at: number, dur = 16) =>
  interpolate(f - at, [0, dur], [0, 1], { ...clamp, easing: Easing.bezier(0.34, 1.4, 0.64, 1) });

// The set: deep purple stage with fixed light beams and a gold floor line.
export const Set: React.FC<{ pump?: number; children?: ReactNode; tint?: string }> = ({
  pump = 0,
  children,
  tint = C.bg,
}) => (
  <AbsoluteFill style={{ background: tint, overflow: "hidden" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <polygon
          key={i}
          points={`${100 + i * 220},0 ${180 + i * 220},0 ${i * 270 - 200},1920 ${i * 270 - 420},1920`}
          fill={i % 2 ? "#5a2bd0" : "#7a43ff"}
          opacity={0.1 + pump * 0.06}
        />
      ))}
      <rect x={0} y={1500} width={1080} height={420} fill={C.bg2} />
      <rect x={0} y={1500} width={1080} height={8} fill={C.gold} opacity={0.8} />
    </svg>
    {children}
  </AbsoluteFill>
);

// Marquee bulbs around a rounded rect, chasing with the frame.
const Bulbs: React.FC<{ w: number; h: number; f: number; color?: string }> = ({
  w,
  h,
  f,
  color = C.gold,
}) => {
  const n = Math.round((w + h) / 38);
  const per = 2 * (w + h);
  return (
    <svg width={w + 40} height={h + 40} style={{ position: "absolute", left: -20, top: -20, overflow: "visible" }}>
      {Array.from({ length: n * 2 }).map((_, i) => {
        const d = (i / (n * 2)) * per;
        let x = 0;
        let y = 0;
        if (d < w) {
          x = d;
          y = 0;
        } else if (d < w + h) {
          x = w;
          y = d - w;
        } else if (d < 2 * w + h) {
          x = w - (d - w - h);
          y = h;
        } else {
          x = 0;
          y = h - (d - 2 * w - h);
        }
        const on = (Math.floor(f / 6) + i) % 2 === 0;
        return <circle key={i} cx={x + 20} cy={y + 20} r={7} fill={on ? color : "#8a5a00"} />;
      })}
    </svg>
  );
};

// The big glowing question panel.
export const Panel: React.FC<{
  children: ReactNode;
  h?: number;
  w?: number;
  size?: number;
  at?: number;
  style?: CSSProperties;
  pump?: number;
}> = ({ children, h = 360, w = CONTENT_W, size = 84, at = 0, style, pump = 0 }) => {
  const f = useCurrentFrame();
  const p = slam(f, at, 18);
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        opacity: Math.min(1, p * 3),
        transform: `scale(${0.88 + 0.12 * p + pump * 0.015})`,
        borderRadius: 48,
        background: C.panel,
        border: `8px solid ${C.gold}`,
        boxShadow: `0 0 ${50 + pump * 30}px ${C.gold}88, inset 0 0 60px #7a43ff88`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 44px",
        boxSizing: "border-box",
        textAlign: "center",
        fontFamily: round,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        color: C.white,
        textWrap: "balance",
        ...style,
      }}
    >
      <Bulbs w={w - 16} h={h - 16} f={f} />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};

export type BtnState = "idle" | "right" | "wrong";

// A chunky answer button. `at` is when it enters; `rightAt`/`wrongAt` flip its state.
export const Btn: React.FC<{
  letter: string;
  text: ReactNode;
  at: number;
  state?: BtnState;
  stateAt?: number;
  size?: number;
  from?: 1 | -1;
  h?: number;
  w?: number;
  mono?: boolean;
}> = ({ letter, text, at, state = "idle", stateAt = 0, size = 48, from = 1, h = 150, w = CONTENT_W, mono: isMono }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 16);
  const s = f >= stateAt ? state : "idle";
  const t = f - stateAt;
  const lit = s === "right" ? pop(f, stateAt, 8) : 0;
  const dim = s === "wrong" ? pop(f, stateAt, 10) : 0;
  const shake = s === "wrong" && t >= 0 && t < 26 ? Math.sin(t * 1.7) * 16 * (1 - t / 26) : 0;
  const bounce = s === "right" && t >= 0 ? 1 + 0.06 * Math.max(0, Math.sin(Math.min(t, 18) * 0.35)) : 1;
  const base = C.gold;
  const bg = lit ? C.green : base;
  return (
    <div
      style={{
        width: w,
        minHeight: h,
        opacity: p * (1 - dim * 0.55),
        transform: `translateX(${(1 - p) * 140 * from + shake}px) scale(${bounce})`,
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "16px 30px 16px 22px",
        boxSizing: "border-box",
        borderRadius: 80,
        background: dim ? "#5b4a8a" : bg,
        borderBottom: `12px solid ${dim ? "#3a2c63" : lit ? C.greenDeep : C.goldDeep}`,
        boxShadow: lit ? `0 0 ${40 * lit}px ${C.green}` : "none",
        fontFamily: isMono ? mono : round,
        fontWeight: isMono ? 700 : 800,
        fontSize: size,
        lineHeight: 1.05,
        color: dim ? "#cbbfe8" : C.ink,
      }}
    >
      <div
        style={{
          flex: "none",
          width: 96,
          height: 96,
          borderRadius: 48,
          background: dim ? "#3a2c63" : C.ink,
          color: lit ? C.green : dim ? "#9a8cc0" : C.gold,
          fontFamily: round,
          fontSize: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {letter}
      </div>
      <div style={{ flex: 1, textWrap: "balance", textDecoration: dim ? "line-through" : "none" }}>{text}</div>
    </div>
  );
};

// Ticking countdown ring with a huge digit; `n` seconds starting at `from`.
export const Countdown: React.FC<{ from: number; n?: number; size?: number }> = ({ from, n = 3, size = 560 }) => {
  const f = useCurrentFrame();
  const t = f - from;
  if (t < 0 || t >= n * 60) return null;
  const sec = Math.floor(t / 60);
  const digit = n - sec;
  const within = (t % 60) / 60;
  const r = size / 2 - 30;
  const circ = 2 * Math.PI * r;
  const scale = 1 + 0.35 * Math.pow(1 - Math.min(1, within * 4), 2);
  const urgency = digit === 1 ? C.red : digit === 2 ? "#FF9A3C" : C.gold;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill={C.bg2} stroke="#4a2aa0" strokeWidth={30} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={urgency}
          strokeWidth={30}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * within}
        />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={size / 2 + Math.cos(a) * (r - 34)}
              y1={size / 2 + Math.sin(a) * (r - 34)}
              x2={size / 2 + Math.cos(a) * (r - 52)}
              y2={size / 2 + Math.sin(a) * (r - 52)}
              stroke="#6b45d6"
              strokeWidth={6}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: round,
          fontWeight: 800,
          fontSize: size * 0.62,
          color: urgency,
          transform: `scale(${scale})`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {digit}
      </div>
    </div>
  );
};

// A confetti burst from a point, starting at frame `at`.
export const Confetti: React.FC<{ at: number; x?: number; y?: number; count?: number }> = ({
  at,
  x = 540,
  y = 900,
  count = 70,
}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > 110) return null;
  const colors = [C.gold, C.green, "#FF5FA2", "#4FC3FF", "#FFFFFF", "#B48CFF"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 0 }}>
      {Array.from({ length: count }).map((_, i) => {
        const a = random(`a${i}`) * Math.PI * 2;
        const v = 14 + random(`v${i}`) * 26;
        const px = x + Math.cos(a) * v * t * 0.62 * (1 - Math.min(0.5, t / 220));
        const py = y + Math.sin(a) * v * t * 0.62 * (1 - Math.min(0.5, t / 220)) + 0.5 * 0.55 * t * t * 0.5;
        const w = 16 + random(`w${i}`) * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: w * 0.55,
              background: colors[i % colors.length],
              opacity: interpolate(t, [70, 110], [1, 0], clamp),
              transform: `rotate(${random(`r${i}`) * 360 + t * (6 + random(`s${i}`) * 14)}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Full-screen colour flash that starts at `at` (0 before).
export const Flash: React.FC<{ at: number; color?: string; peak?: number }> = ({ at, color = "#fff", peak = 0.6 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return <AbsoluteFill style={{ background: color, opacity: interpolate(f - at, [0, 12], [peak, 0], clamp), zIndex: 15 }} />;
};

// Padded column inside the safe area.
export const Col: React.FC<{ children: ReactNode; top?: number; gap?: number; justify?: CSSProperties["justifyContent"] }> = ({
  children,
  top = SAFE.top,
  gap = 36,
  justify = "center",
}) => (
  <AbsoluteFill
    style={{
      zIndex: 5,
      padding: `${top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
      display: "flex",
      flexDirection: "column",
      gap,
      justifyContent: justify,
      alignItems: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Logo: React.FC<{ src: string; size?: number; style?: CSSProperties }> = ({ src, size = 200, style }) => (
  <Img src={src} style={{ width: size, height: size, borderRadius: size * 0.22, background: "#fff", ...style }} />
);

// Drawn check mark.
export const Check: React.FC<{ size?: number; at: number; color?: string }> = ({ size = 120, at, color = C.green }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 14);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={44} fill={color} />
      <path d="M28 52 L44 68 L74 34" fill="none" stroke={C.ink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - p)} />
    </svg>
  );
};
