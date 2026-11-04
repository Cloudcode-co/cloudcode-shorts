import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CONTENT_W, SAFE, display, easeOut, mono, sans } from "../../kit";

export const C = {
  bg: "#070b0a",
  panel: "#0e1513",
  line: "#25352f",
  text: "#dcf3e8",
  dim: "#86a195",
  green: "#39f08f",
  amber: "#ffb224",
  red: "#ff5a4f",
  cyan: "#56d8ff",
};

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ramp = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { ...clampOpts, easing: easeOut });
export const dots = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const rise = (p: number, dy = 22): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dy}px)`,
});

export const Stage: React.FC<{ top?: number; outside?: React.ReactNode; children: React.ReactNode }> = ({
  top = SAFE.top,
  outside,
  children,
}) => (
  <AbsoluteFill
    style={{
      background: C.bg,
      fontFamily: sans,
      color: C.text,
      backgroundImage:
        "linear-gradient(rgba(57,240,143,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(57,240,143,0.045) 2px, transparent 2px)",
      backgroundSize: "60px 60px",
    }}
  >
    {outside}
    <div style={{ position: "absolute", left: SAFE.left, top, width: CONTENT_W, height: 1440 - top }}>
      {children}
    </div>
  </AbsoluteFill>
);

export const Light: React.FC<{ color: string; on?: boolean; size?: number }> = ({
  color,
  on = true,
  size = 22,
}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size,
        flex: "none",
        background: on ? color : "#33423c",
        opacity: on ? 0.78 + 0.22 * Math.sin(f / 9) : 1,
        boxShadow: on ? `0 0 10px ${color}` : "none",
      }}
    />
  );
};

export const Panel: React.FC<{
  title: string;
  right?: string;
  rightColor?: string;
  light?: string;
  on?: boolean;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ title, right, rightColor = C.green, light = C.green, on = true, style, bodyStyle, children }) => (
  <div
    style={{
      background: C.panel,
      border: `2px solid ${on ? C.line : "#1a2420"}`,
      borderRadius: 12,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      ...style,
    }}
  >
    <div
      style={{
        height: 56,
        flex: "none",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 20px",
        borderBottom: `2px solid ${on ? C.line : "#1a2420"}`,
        fontFamily: mono,
        fontSize: 34,
        color: on ? C.text : C.dim,
      }}
    >
      <Light color={light} on={on} />
      <span>{title}</span>
      <span style={{ marginLeft: "auto", color: rightColor, fontWeight: 700 }}>{right}</span>
    </div>
    <div style={{ flex: 1, position: "relative", minHeight: 0, padding: "16px 20px", ...bodyStyle }}>
      {children}
    </div>
  </div>
);

const LOG = [
  "mic: listening",
  "model: scan window",
  "match: species found",
  "frame: artwork queued",
  "mqtt: publish ok",
];

// A log that keeps appending a line every `every` frames, scrolling up.
export const LogFeed: React.FC<{
  from: number;
  every: number;
  rows: number;
  lines?: string[];
}> = ({ from, every, rows, lines = LOG }) => {
  const f = useCurrentFrame();
  const LH = 42;
  if (f < from) return <div style={{ height: rows * LH }} />;
  const k = Math.floor((f - from) / every);
  const p = ramp((f - from) % every, 0, 10);
  const first = Math.max(0, k - rows);
  const idx: number[] = [];
  for (let i = first; i <= k; i++) idx.push(i);
  return (
    <div style={{ height: rows * LH, position: "relative", overflow: "hidden", fontFamily: mono, fontSize: 34 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, transform: `translateY(${(1 - p) * LH}px)` }}>
        {idx.map((i) => (
          <div
            key={i}
            style={{
              height: LH,
              lineHeight: `${LH}px`,
              whiteSpace: "nowrap",
              color: i === k ? C.green : C.dim,
              opacity: i === first && k >= rows ? 1 - p : 1,
            }}
          >
            <span style={{ color: C.dim }}>{String(i + 1).padStart(3, "0")} </span>
            {lines[i % lines.length]}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Row: React.FC<{
  color: string;
  p: number;
  children: React.ReactNode;
  status?: string;
  size?: number;
  height?: number;
  font?: string;
}> = ({ color, p, children, status, size = 40, height = 60, font = sans }) => (
  <div
    style={{
      height,
      display: "flex",
      alignItems: "center",
      gap: 16,
      fontFamily: font,
      fontSize: size,
      fontWeight: 700,
      ...rise(p, 14),
    }}
  >
    <Light color={color} />
    <span style={{ whiteSpace: "nowrap" }}>{children}</span>
    {status && (
      <span style={{ marginLeft: "auto", color, fontFamily: sans, fontWeight: 700, fontSize: Math.min(size, 38), whiteSpace: "nowrap" }}>
        {status}
      </span>
    )}
  </div>
);

export const Headline: React.FC<{ size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  size = 88,
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: display,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.02,
      textWrap: "balance",
      color: C.text,
      ...style,
    }}
  >
    {children}
  </div>
);
