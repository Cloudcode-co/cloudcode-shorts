// Notebook toolkit: squared paper, pen strokes that draw on, highlighter swipes,
// sticky notes and taped-in logos. Everything is driven by the frame number.
import { loadFont } from "@remotion/google-fonts/PatrickHand";
import { createContext, useContext, type ReactNode } from "react";
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { CONTENT_W, SAFE, easeOut } from "../../kit";

export const hand = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export type Theme = {
  paper: string;
  grid: string;
  ink: string;
  hl: string;
  red: string;
  blue: string;
  margin: string;
  dark: boolean;
};

export const LIGHT: Theme = {
  paper: "#EDF3F6",
  grid: "#C3D8E8",
  ink: "#1D2B45",
  hl: "#FFE14D",
  red: "#D8453B",
  blue: "#2C6FD6",
  margin: "#F0A3A0",
  dark: false,
};

export const DARK: Theme = {
  paper: "#13213B",
  grid: "#22395F",
  ink: "#F1F5F7",
  hl: "#FFE14D",
  red: "#FF7A6B",
  blue: "#7FB2FF",
  margin: "#5A3A55",
  dark: true,
};

const ThemeCtx = createContext<Theme>(LIGHT);
export const useTheme = () => useContext(ThemeCtx);

export const STICKY = { yellow: "#FFD84A", pink: "#FF9DB5", green: "#9FE3A8" };

const penEase = Easing.bezier(0.4, 0, 0.2, 1);

// 0 → 1 between start and start+dur (frames of the current sequence).
export const useP = (start: number, dur = 14, easing: (n: number) => number = easeOut) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
};

export const PAGE_H = 1920 - SAFE.top - SAFE.bottom;

export const Notebook: React.FC<{ theme: Theme; children: ReactNode }> = ({ theme, children }) => (
  <ThemeCtx.Provider value={theme}>
    <AbsoluteFill
      style={{
        background: theme.paper,
        backgroundImage: `linear-gradient(${theme.grid} 2px, transparent 2px), linear-gradient(90deg, ${theme.grid} 2px, transparent 2px)`,
        backgroundSize: "54px 54px",
        backgroundPosition: "-1px -1px",
        fontFamily: hand,
        color: theme.ink,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 78,
          top: 0,
          bottom: 0,
          width: 4,
          background: theme.margin,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: SAFE.top,
          width: CONTENT_W,
          height: PAGE_H,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  </ThemeCtx.Provider>
);

// ---- hand-drawn geometry -------------------------------------------------

const rng = (seed: number) => {
  let s = (seed * 2654435761) % 4294967296 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

export const rectD = (w: number, h: number, seed = 1) => {
  const r = rng(seed);
  const j = (n: number) => (r() - 0.5) * 2 * n;
  const P: [number, number][] = [
    [j(3), j(3)],
    [w + j(3), j(3)],
    [w + j(3), h + j(3)],
    [j(3), h + j(3)],
  ];
  let d = `M ${P[0][0] - 5} ${P[0][1] + 4}`;
  for (let i = 0; i < 4; i++) {
    const a = P[i];
    const b = P[(i + 1) % 4];
    d += ` Q ${(a[0] + b[0]) / 2 + j(4)} ${(a[1] + b[1]) / 2 + j(4)} ${b[0]} ${b[1]}`;
  }
  return `${d} L ${P[0][0] + 10} ${P[0][1] + 2}`;
};

export const starD = (R: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? R : R * 0.45;
    pts.push(`${(Math.cos(a) * rad).toFixed(1)} ${(Math.sin(a) * rad).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
};

export const CLOUD_D =
  "M 22 78 C 0 78 -4 46 24 44 C 24 12 72 4 84 30 C 108 20 130 40 120 62 C 140 66 136 82 114 82 Z";

// ---- drawing -------------------------------------------------------------

// A pen stroke that draws itself on. Coordinates are relative to (x, y).
export const Pen: React.FC<{
  d: string;
  x?: number;
  y?: number;
  start: number;
  dur?: number;
  color?: string;
  w?: number;
  fill?: string;
}> = ({ d, x = 0, y = 0, start, dur = 20, color, w = 5, fill }) => {
  const t = useTheme();
  const p = useP(start, dur, penEase);
  const fillP = interpolate(p, [0.6, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <path
        d={d}
        pathLength={1}
        fill={fill ?? "none"}
        fillOpacity={fill ? fillP : 1}
        stroke={color ?? t.ink}
        strokeWidth={w}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        opacity={p > 0 ? 1 : 0}
      />
    </svg>
  );
};

export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  start: number;
  dur?: number;
  color?: string;
  w?: number;
  bend?: number;
}> = ({ x1, y1, x2, y2, start, dur = 18, color, w = 5, bend = 14 }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (x1 + x2) / 2 - (dy / len) * bend;
  const cy = (y1 + y2) / 2 + (dx / len) * bend;
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const arm = (da: number) =>
    `${(x2 - 24 * Math.cos(ang + da)).toFixed(1)} ${(y2 - 24 * Math.sin(ang + da)).toFixed(1)}`;
  return (
    <>
      <Pen d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} start={start} dur={dur} color={color} w={w} />
      <Pen
        d={`M ${arm(0.5)} L ${x2} ${y2} L ${arm(-0.5)}`}
        start={start + dur - 2}
        dur={8}
        color={color}
        w={w}
      />
    </>
  );
};

// Handwriting that is written on from left to right.
export const Write: React.FC<{
  x: number;
  y: number;
  start: number;
  dur?: number;
  size: number;
  w?: number;
  color?: string;
  rot?: number;
  children: ReactNode;
}> = ({ x, y, start, dur = 20, size, w, color, rot = 0, children }) => {
  const t = useTheme();
  const p = useP(start, dur, penEase);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        fontFamily: hand,
        fontSize: size,
        lineHeight: 1.1,
        whiteSpace: "nowrap",
        color: color ?? t.ink,
        clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`,
        opacity: p > 0 ? 1 : 0,
        rotate: `${rot}deg`,
      }}
    >
      {children}
    </div>
  );
};

// Highlighter swipe behind a word.
export const Mark: React.FC<{
  start: number;
  dur?: number;
  color?: string;
  children: ReactNode;
}> = ({ start, dur = 14, color, children }) => {
  const t = useTheme();
  const p = useP(start, dur, penEase);
  const clip = `inset(0 ${(1 - p) * 100}% 0 0)`;
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: -8,
          right: -8,
          top: "38%",
          bottom: "0%",
          background: color ?? t.hl,
          clipPath: clip,
          rotate: "-1deg",
          borderRadius: 6,
        }}
      />
      <span style={{ position: "relative" }}>{children}</span>
      {t.dark && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            color: "#13213B",
            clipPath: clip,
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </span>
      )}
    </span>
  );
};

// ---- paper things --------------------------------------------------------

const TapeStrip: React.FC<{ left?: string | number; rot?: number; top?: number }> = ({
  left = "50%",
  rot = -4,
  top = -17,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      marginLeft: -52,
      width: 104,
      height: 34,
      background: "rgba(255, 238, 170, 0.8)",
      border: "1px solid rgba(120, 100, 20, 0.18)",
      rotate: `${rot}deg`,
    }}
  />
);

export const Tape: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = -6 }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <TapeStrip left={0} top={0} rot={rot} />
  </div>
);

export const Reveal: React.FC<{
  x: number;
  y: number;
  w?: number;
  start: number;
  dy?: number;
  rot?: number;
  children: ReactNode;
}> = ({ x, y, w, start, dy = 24, rot = 0, children }) => {
  const p = useP(start, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity: p,
        translate: `0px ${(1 - p) * dy}px`,
        rotate: `${rot}deg`,
      }}
    >
      {children}
    </div>
  );
};

export const Sticky: React.FC<{
  x: number;
  y: number;
  w: number;
  start: number;
  rot?: number;
  color: string;
  size?: number;
  children: ReactNode;
}> = ({ x, y, w, start, rot = -2, color, size = 42, children }) => {
  const p = useP(start, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        boxSizing: "border-box",
        padding: "20px 22px 26px",
        background: color,
        color: "#25252B",
        fontFamily: hand,
        fontSize: size,
        lineHeight: 1.15,
        opacity: p,
        translate: `0px ${(1 - p) * -24}px`,
        scale: 1 + (1 - p) * 0.08,
        rotate: `${rot}deg`,
        boxShadow: "5px 7px 0 rgba(20, 30, 50, 0.18)",
      }}
    >
      {children}
    </div>
  );
};

export type Glyph = { path: string };

// Paper square with a logo taped on.
export const IconTile: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  start: number;
  rot?: number;
  glyph: Glyph;
  fillColor?: string;
  label?: string;
}> = ({ x, y, w, h, start, rot = 0, glyph, fillColor, label }) => {
  const p = useP(start, 14);
  const icon = label ? 84 : w * 0.6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        background: "#FBFDFE",
        boxShadow: "4px 6px 0 rgba(20, 30, 50, 0.16)",
        opacity: p,
        translate: `0px ${(1 - p) * -20}px`,
        rotate: `${rot}deg`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: label ? "flex-start" : "center",
        paddingTop: label ? 26 : 0,
        gap: 12,
      }}
    >
      <TapeStrip />
      <svg viewBox="0 0 24 24" width={icon} height={icon}>
        <path d={glyph.path} fill={fillColor ?? "#1D2B45"} />
      </svg>
      {label && (
        <div style={{ fontFamily: hand, fontSize: 38, color: "#1D2B45", lineHeight: 1 }}>{label}</div>
      )}
    </div>
  );
};

export const Polaroid: React.FC<{
  x: number;
  y: number;
  w: number;
  rot?: number;
  start: number;
  src: string;
  caption?: string;
}> = ({ x, y, w, rot = -4, start, src, caption }) => {
  const p = useP(start, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        boxSizing: "border-box",
        padding: caption ? "14px 14px 0" : 14,
        background: "#FBFDFE",
        boxShadow: "5px 7px 0 rgba(20, 30, 50, 0.2)",
        opacity: p,
        translate: `0px ${(1 - p) * -30}px`,
        rotate: `${rot + (1 - p) * 5}deg`,
      }}
    >
      <TapeStrip />
      <Img src={src} style={{ width: "100%", display: "block", aspectRatio: "1 / 1" }} />
      {caption && (
        <div
          style={{
            height: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: hand,
            fontSize: 34,
            color: "#1D2B45",
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};
