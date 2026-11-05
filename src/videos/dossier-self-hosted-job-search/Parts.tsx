import { loadFont } from "@remotion/google-fonts/Baloo2";
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { OffthreadVideo } from "remotion";
import { SAFE, easeOut } from "../../kit";

export const round = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const C = {
  bg: "#1a0a4a",
  bgDeep: "#10052e",
  panel: "#2f1a86",
  gold: "#ffc933",
  goldDeep: "#c98f00",
  green: "#22d36b",
  greenDeep: "#0f8f45",
  red: "#ff4d6d",
  white: "#ffffff",
  btn: "#4a2fc0",
};

export const SLUG = "dossier-self-hosted-job-search";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0 → 1 from frame `at` for `dur` frames; 0 before.
export const pop = (f: number, at: number, dur = 16) =>
  f < at ? 0 : interpolate(f - at, [0, dur], [0, 1], { ...clamp, easing: easeOut });

// Studio set: flat deep purple with a gold marquee frame at the panel edge.
export const SetBg: React.FC<{ footage?: string; footageAt?: number; footageTrim?: number }> = ({
  footage,
  footageAt = 0,
  footageTrim = 0,
}) => {
  const f = useCurrentFrame();
  const p = footage ? pop(f, footageAt, 20) : 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {footage && (
        <AbsoluteFill style={{ opacity: p }}>
          <OffthreadVideo
            src={staticFile(`videos/${SLUG}/footage/${footage}`)}
            muted
            trimBefore={footageTrim}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <AbsoluteFill style={{ background: "rgba(16,5,46,0.72)" }} />
        </AbsoluteFill>
      )}
      {/* stage floor lights */}
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i ? undefined : 0,
            right: i ? 0 : undefined,
            top: 0,
            bottom: 0,
            width: 14,
            background: C.gold,
            opacity: 0.8,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// The big glowing question / headline panel with marquee bulbs.
export const Panel: React.FC<{
  top: number;
  height: number;
  children: ReactNode;
  at?: number;
}> = ({ top, height, children, at = 0 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 18);
  const w = 1080 - SAFE.left - SAFE.right;
  const bulbs = 16;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: w,
        height,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
        background: C.panel,
        border: `8px solid ${C.gold}`,
        borderRadius: 44,
        boxShadow: `0 0 36px ${C.gold}88`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 36px",
        fontFamily: round,
      }}
    >
      {[0, 1].map((row) =>
        Array.from({ length: bulbs }, (_, i) => (
          <div
            key={`${row}-${i}`}
            style={{
              position: "absolute",
              left: 34 + (i * (w - 68 - 16)) / (bulbs - 1) - 8,
              top: row ? undefined : -15,
              bottom: row ? -15 : undefined,
              width: 18,
              height: 18,
              borderRadius: 9,
              background: Math.floor(f / 10 + i) % 2 === 0 ? "#fff6c9" : C.goldDeep,
            }}
          />
        )),
      )}
      {children}
    </div>
  );
};

export const PanelText: React.FC<{ text: string; size?: number; color?: string }> = ({
  text,
  size = 76,
  color = C.white,
}) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 800,
      lineHeight: 1.05,
      color,
      textAlign: "center",
      textWrap: "balance",
    }}
  >
    {text}
  </div>
);

export type BtnState = "idle" | "right" | "wrong";

// A chunky answer button. `shakeAt` makes a wrong one shake and dim.
export const Btn: React.FC<{
  letter?: string;
  text: string;
  top: number;
  height: number;
  at: number;
  state?: BtnState;
  stateAt?: number;
  size?: number;
  mark?: boolean;
}> = ({ letter, text, top, height, at, state = "idle", stateAt = 0, size = 48, mark }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 16);
  const s = state === "idle" || f < stateAt ? "idle" : state;
  const since = f - stateAt;
  const shake = s === "wrong" && since < 24 ? Math.sin(since * 1.6) * 16 * (1 - since / 24) : 0;
  const bump = s === "right" ? 1 + 0.05 * Math.max(0, 1 - since / 14) * Math.sin(since * 0.5) : 1;
  const bg = s === "right" ? C.green : s === "wrong" ? "#2a1a63" : C.btn;
  const edge = s === "right" ? C.greenDeep : s === "wrong" ? "#1d1048" : "#2d1a8a";
  const w = 1080 - SAFE.left - SAFE.right;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: w,
        height,
        opacity: p * (s === "wrong" ? 0.55 : 1),
        transform: `translate(${shake}px, ${(1 - p) * 36}px) scale(${bump})`,
        background: bg,
        borderRadius: height / 2.4,
        boxShadow: `0 8px 0 ${edge}${s === "right" ? `, 0 0 40px ${C.green}99` : ""}`,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 28px",
        boxSizing: "border-box",
        fontFamily: round,
        color: s === "right" ? "#06361a" : C.white,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.05,
      }}
    >
      {letter && (
        <div
          style={{
            flex: "none",
            width: height * 0.64,
            height: height * 0.64,
            borderRadius: "50%",
            background: s === "right" ? "#06361a" : C.gold,
            color: s === "right" ? C.green : "#3a2300",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.95,
          }}
        >
          {letter}
        </div>
      )}
      <div style={{ flex: 1, textWrap: "balance" }}>{text}</div>
      {mark && s === "right" && (
        <svg width={height * 0.5} height={height * 0.5} viewBox="0 0 24 24">
          <path
            d="M4 12.5l5 5L20 6.5"
            fill="none"
            stroke="#06361a"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={30}
            strokeDashoffset={30 * (1 - Math.min(1, since / 10))}
          />
        </svg>
      )}
    </div>
  );
};

// Countdown ring: a big number inside a ring that drains over each second.
export const Countdown: React.FC<{ start: number; secondFrames?: number; top: number; size?: number }> = ({
  start,
  secondFrames = 60,
  top,
  size = 330,
}) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t >= secondFrames * 3) return null;
  const n = 3 - Math.floor(t / secondFrames);
  const local = t % secondFrames;
  const punch = interpolate(local, [0, 10], [1.35, 1], { ...clamp, easing: easeOut });
  const r = size / 2 - 18;
  const circ = 2 * Math.PI * r;
  const ticks = 24;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - size / 2,
        top,
        width: size,
        height: size,
        fontFamily: round,
      }}
    >
      <svg width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill={C.bgDeep} stroke="#3b2799" strokeWidth={22} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={n === 1 ? C.red : C.gold}
          strokeWidth={22}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (local / secondFrames)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {Array.from({ length: ticks }, (_, i) => {
          const a = (i / ticks) * Math.PI * 2;
          const lit = i / ticks >= local / secondFrames;
          return (
            <line
              key={i}
              x1={size / 2 + Math.cos(a) * (r - 28)}
              y1={size / 2 + Math.sin(a) * (r - 28)}
              x2={size / 2 + Math.cos(a) * (r - 44)}
              y2={size / 2 + Math.sin(a) * (r - 44)}
              stroke={lit ? C.gold : "#4a35aa"}
              strokeWidth={5}
              strokeLinecap="round"
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
          fontSize: size * 0.62,
          fontWeight: 800,
          color: n === 1 ? C.red : C.white,
          transform: `scale(${punch})`,
          paddingTop: size * 0.04,
        }}
      >
        {n}
      </div>
    </div>
  );
};

const COLORS = [C.gold, C.green, "#ff5fa2", "#5cc8ff", C.white];

// Confetti burst from a point, deterministic by index.
export const Confetti: React.FC<{ at: number; x?: number; y?: number; count?: number }> = ({
  at,
  x = 540,
  y = 700,
  count = 70,
}) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 110) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 20 }}>
      {Array.from({ length: count }, (_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const sp = 14 + random(`s${i}`) * 26;
        const t = f / 1.4;
        const px = x + Math.cos(ang) * sp * t * 0.9;
        const py = y + Math.sin(ang) * sp * t * 0.9 - 6 * t + 0.5 * 0.9 * t * t;
        const w = 14 + random(`w${i}`) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: w * 0.55,
              background: COLORS[i % COLORS.length],
              transform: `rotate(${f * (6 + random(`r${i}`) * 14)}deg)`,
              opacity: interpolate(f, [70, 110], [1, 0], clamp),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Avatar: React.FC<{ size: number; style?: CSSProperties }> = ({ size, style }) => (
  <Img
    src={staticFile(`videos/${SLUG}/repos/AienTech.png`)}
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: `10px solid ${C.gold}`,
      boxShadow: `0 0 40px ${C.gold}99`,
      boxSizing: "border-box",
      ...style,
    }}
  />
);

export const ease = Easing.bezier(0.23, 1, 0.32, 1);
