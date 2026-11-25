import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  useCurrentFrame,
} from "remotion";
import { SAFE, easeOut, mono } from "../../kit";
import { C, a, grotesk } from "./palette";

export const T = (seconds: number) => Math.round(seconds * 60);

export const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// 0→1 with the strong ease-out the rest of the edit uses.
export const useRise = (delay = 0, dur = 16) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
};

export const rise = (p: number, dy = 26): CSSProperties => ({
  opacity: p,
  translate: `0px ${(1 - p) * dy}px`,
});

export const useTicker = (to: number, delay = 0, dur = 34) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + dur], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
};

const gridStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: `linear-gradient(${C.line}30 1px, transparent 1px), linear-gradient(90deg, ${C.line}30 1px, transparent 1px)`,
  backgroundSize: "96px 96px",
  opacity: 0.5,
};

// A full-bleed console frame. `bleed` sits behind the safe-area content
// (footage, big numerals); everything readable stays in `children`.
export const Stage: React.FC<{
  children: ReactNode;
  bleed?: ReactNode;
  bg?: string;
  style?: CSSProperties;
  padTop?: number;
  grid?: boolean;
}> = ({ children, bleed, bg = C.bg, style, padTop = SAFE.top, grid = true }) => (
  <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
    {bleed}
    {grid && <div style={gridStyle} />}
    <AbsoluteFill
      style={{
        fontFamily: grotesk,
        padding: `${padTop}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

export const BgVideo: React.FC<{
  file: string;
  dark?: number;
  position?: string;
  trimBefore?: number;
  rate?: number;
}> = ({ file, dark = 0.62, position = "center", trimBefore = 0, rate = 1 }) => (
  <>
    <AbsoluteFill>
      <OffthreadVideo
        src={a(file)}
        muted
        trimBefore={trimBefore}
        playbackRate={rate}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
        }}
      />
    </AbsoluteFill>
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(7,10,13,${Math.min(
          0.94,
          dark + 0.18,
        )}) 0%, rgba(7,10,13,${dark}) 34%, rgba(7,10,13,${Math.min(
          0.96,
          dark + 0.28,
        )}) 100%)`,
      }}
    />
  </>
);

export const Head: React.FC<{
  children: ReactNode;
  size?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ children, size = 90, color = C.text, style }) => (
  <div
    style={{
      fontFamily: grotesk,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 0.99,
      letterSpacing: "-0.035em",
      color,
      textWrap: "balance" as never,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Body: React.FC<{
  children: ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: CSSProperties;
}> = ({ children, size = 40, color = C.text, weight = 500, style }) => (
  <div
    style={{
      fontFamily: grotesk,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.22,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Mono: React.FC<{
  children: ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: CSSProperties;
}> = ({ children, size = 40, color = C.text, weight = 500, style }) => (
  <div
    style={{
      fontFamily: mono,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.1,
      color,
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "pre",
      ...style,
    }}
  >
    {children}
  </div>
);

// Thin accent rule with a chapter index cut into it.
export const Rule: React.FC<{ index?: string; color?: string; width?: number }> = ({
  index,
  color = C.songe,
  width = 72,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width, height: 3, background: color }} />
    {index && <Mono size={34} color={color} weight={700}>{index}</Mono>}
  </div>
);

export const LED: React.FC<{ color: string; size?: number; steady?: boolean }> = ({
  color,
  size = 14,
  steady = true,
}) => {
  const f = useCurrentFrame();
  const on = steady || Math.floor(f / 26) % 2 === 0;
  return (
    <div
      style={{
        width: size,
        height: size,
        flex: "none",
        background: on ? color : C.line,
        outline: `2px solid ${on ? `${color}55` : "transparent"}`,
        outlineOffset: 2,
      }}
    />
  );
};

export const Status: React.FC<{
  label: string;
  color: string;
  steady?: boolean;
  size?: number;
}> = ({ label, color, steady = true, size = 34 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <LED color={color} steady={steady} />
    <Mono size={size} color={color}>{label}</Mono>
  </div>
);

export const Panel: React.FC<{
  title: string;
  right?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  tone?: string;
  pad?: number;
}> = ({ title, right, children, style, bodyStyle, tone = C.line, pad = 22 }) => (
  <div
    style={{
      background: C.panel,
      border: `1.5px solid ${C.line}`,
      borderTop: `3px solid ${tone}`,
      borderRadius: 7,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "14px 22px",
        borderBottom: `1.5px solid ${C.line}`,
        background: C.well,
      }}
    >
      <Mono size={34} color={C.dim} weight={500} style={{ overflow: "hidden" }}>
        {title}
      </Mono>
      {right}
    </div>
    <div
      style={{
        padding: `${pad}px 22px`,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        ...bodyStyle,
      }}
    >
      {children}
    </div>
  </div>
);

// Live-looking level meter: no invented figure, just the instrument.
export const LiveBars: React.FC<{
  f?: number;
  color?: string;
  n?: number;
  height?: number;
  seed?: number;
}> = ({ f: at, color = C.songe, n = 40, height = 56, seed = 0 }) => {
  const local = useCurrentFrame();
  const f = at ?? local;
  const gap = 3;
  const w = 300;
  const bw = (w - gap * (n - 1)) / n;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      {Array.from({ length: n }, (_, i) => {
        const wob =
          Math.abs(Math.sin(f * 0.055 + i * 0.63 + seed)) * 0.62 +
          Math.abs(Math.sin(f * 0.021 + i * 1.31 + seed * 2)) * 0.38;
        const h = Math.max(3, wob * height);
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={height - h}
            width={bw}
            height={h}
            fill={color}
            opacity={0.28 + wob * 0.72}
          />
        );
      })}
    </svg>
  );
};

export const Spark: React.FC<{
  f?: number;
  color?: string;
  seed?: number;
  width?: number;
  height?: number;
  amp?: number;
}> = ({ f: at, color = C.songe, seed = 0, width = 320, height = 88, amp = 26 }) => {
  const local = useCurrentFrame();
  const f = at ?? local;
  const n = 36;
  const pts = Array.from({ length: n }, (_, i) => {
    const x = (i / (n - 1)) * width;
    const drift = i * 0.42 + seed;
    const y =
      height / 2 +
      Math.sin(drift + f * 0.09) * amp * 0.55 +
      Math.sin(drift * 2.3 + f * 0.035) * amp * 0.3 +
      Math.sin(drift * 0.7 - f * 0.05) * amp * 0.15;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill={color} opacity={0.09} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.9}
      />
    </svg>
  );
};

// A big readout that counts up once when its shot starts.
export const Count: React.FC<{
  to: number;
  delay?: number;
  dur?: number;
  size?: number;
  color?: string;
  suffix?: string;
  style?: CSSProperties;
}> = ({ to, delay = 0, dur = 34, size = 72, color = C.text, suffix, style }) => {
  const v = useTicker(to, delay, dur);
  return (
    <div
      style={{
        fontFamily: mono,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.03em",
        ...style,
      }}
    >
      {fmt(v)}
      {suffix && <span style={{ fontSize: size * 0.5, color: C.dim, marginLeft: 10 }}>{suffix}</span>}
    </div>
  );
};

// Deterministic packet along a straight run, looping.
export const packet = (f: number, period = 54, offset = 0) => {
  const p = (((f + offset) % period) + period) % period;
  return p / period;
};

export const CutFlash: React.FC<{ at: number; color?: string; frames?: number }> = ({
  at,
  color = C.songe,
  frames = 8,
}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + frames) return null;
  const a = interpolate(f - at, [0, 2, frames], [0, 0.22, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: color, opacity: a, pointerEvents: "none" }} />
  );
};

// Header used by the three chapter cards, varied by the caller's colour and
// numeral so each chapter reads as its own card.
export const ChapterCard: React.FC<{
  index: string;
  kicker: string;
  title: string;
  accent: string;
  note?: string;
}> = ({ index, kicker, title, accent, note }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.23, 1, 0.32, 1),
  });
  return (
    <Stage padTop={SAFE.top + 40}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, ...rise(p, 18) }}>
        <div style={{ width: 64, height: 4, background: accent }} />
        <Mono size={36} color={accent} weight={700}>{kicker}</Mono>
      </div>
      <Head size={110} style={{ marginTop: 34, ...rise(p, 34) }}>
        {title}
      </Head>
      {note && (
        <Body size={40} color={C.dim} style={{ marginTop: 30, maxWidth: 640, ...rise(p, 26) }}>
          {note}
        </Body>
      )}
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderTop: `1.5px solid ${C.line}`,
          paddingTop: 22,
        }}
      >
        <Mono size={100} color={accent} weight={700}>{index}</Mono>
        <Mono size={34} color={C.faint}>{"/04"}</Mono>
      </div>
    </Stage>
  );
};
