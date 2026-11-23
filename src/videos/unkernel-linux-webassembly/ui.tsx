import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { SAFE, display, mono, sans } from "../../kit";
import { C } from "./palette";

export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// 0 at `at`, 1 after `at + dur`, eased out; never overshoots before `at`.
export const appear = (frame: number, at: number, dur = 14) =>
  interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

export const rise = (p: number, dy = 26): CSSProperties => ({
  opacity: p,
  translate: `0 ${(1 - p) * dy}px`,
});

// The faint instrument grid every shot sits on.
export const Grid: React.FC<{ opacity?: number }> = ({ opacity = 0.2 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
      backgroundSize: "72px 72px",
      opacity,
    }}
  />
);

// Full-frame console shot: grid, optional footage/art layer, then content
// padded into TikTok's safe area.
export const Scene: React.FC<{
  children: ReactNode;
  bgLayer?: ReactNode;
  padTop?: number;
  style?: CSSProperties;
  bg?: string;
}> = ({ children, bgLayer, padTop = SAFE.top, style, bg = C.bg }) => (
  <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
    <Grid />
    {bgLayer}
    <AbsoluteFill
      style={{
        padding: `${padTop}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
        display: "flex",
        flexDirection: "column",
        fontFamily: sans,
        color: C.text,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

export const Lamp: React.FC<{ color: string; size?: number; on?: boolean }> = ({
  color,
  size = 18,
  on = true,
}) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: on ? color : C.line,
      boxShadow: on ? `0 0 ${size}px ${color}99` : undefined,
      flex: "none",
    }}
  />
);

const tones = { mint: C.mint, amber: C.amber, red: C.red, dim: C.line };

// A console panel: hairline border, square-ish corners, a status rail on top.
export const Panel: React.FC<{
  title?: ReactNode;
  right?: ReactNode;
  tone?: keyof typeof tones;
  children: ReactNode;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}> = ({ title, right, tone = "dim", children, style, bodyStyle }) => (
  <div
    style={{
      position: "relative",
      background: C.panel,
      border: `1px solid ${C.line}`,
      borderTop: `3px solid ${tones[tone]}`,
      borderRadius: 8,
      overflow: "hidden",
      ...style,
    }}
  >
    {(title || right) && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "18px 24px 14px",
          borderBottom: `1px solid ${C.line}`,
          minHeight: 64,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>{right}</div>
      </div>
    )}
    <div style={{ padding: 24, ...bodyStyle }}>{children}</div>
  </div>
);

// Mono label at the 34px floor.
export const Label: React.FC<{ children: ReactNode; color?: string; style?: CSSProperties }> = ({
  children,
  color = C.dim,
  style,
}) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 34,
      lineHeight: 1.18,
      color,
      letterSpacing: "0.01em",
      ...style,
    }}
  >
    {children}
  </span>
);

export const Status: React.FC<{ color: string; children: ReactNode }> = ({ color, children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontFamily: mono,
      fontSize: 34,
      color,
      lineHeight: 1.1,
    }}
  >
    <Lamp color={color} size={14} />
    {children}
  </span>
);

// A horizontal meter that fills from left to `p`.
export const Meter: React.FC<{
  p: number;
  color?: string;
  height?: number;
  track?: string;
  style?: CSSProperties;
}> = ({ p, color = C.mint, height = 18, track = C.raised, style }) => (
  <div
    style={{
      height,
      background: track,
      borderRadius: 3,
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        width: `${Math.max(0, Math.min(1, p)) * 100}%`,
        height: "100%",
        background: color,
      }}
    />
  </div>
);

// Headline type: wide grotesk, tight, balanced.
export const Headline: React.FC<{ children: ReactNode; size?: number; style?: CSSProperties }> = ({
  children,
  size = 88,
  style,
}) => (
  <div
    style={{
      fontFamily: display,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: "-0.035em",
      color: C.text,
      textWrap: "balance",
      ...style,
    }}
  >
    {children}
  </div>
);
