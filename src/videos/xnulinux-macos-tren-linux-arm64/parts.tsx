import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { BRAND_SPACE, Brand } from "../../kit";
import { beatmap, hit } from "../../kit/beat";
import beats from "./beatmap.json";
import { C, SAFE, bloom, blink, easeOut, mono, sans, STARTS } from "./theme";

const MAP = beatmap(beats);

// A kick that keeps a held diagram alive on the music's beats.
export const useBeatPulse = (start: number) => {
  const f = useCurrentFrame();
  return hit(MAP.beats, start + f, 10);
};

export const Cursor: React.FC<{ f: number; w?: number; h?: number; color?: string }> = ({
  f,
  w = 14,
  h = 26,
  color = C.accent,
}) => (
  <span
    style={{
      display: "inline-block",
      width: w,
      height: h,
      marginLeft: 6,
      verticalAlign: "-0.12em",
      background: blink(f) ? color : "transparent",
    }}
  />
);

export const CheckIcon: React.FC<{ p: number; size?: number; color?: string }> = ({
  p,
  size = 36,
  color = C.green,
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0, display: "block" }}>
    <rect
      x="1.5"
      y="1.5"
      width="29"
      height="29"
      rx="8"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      opacity={0.4}
    />
    <path
      d="M9 16.4l4.9 4.9L23.2 11"
      fill="none"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="23"
      strokeDashoffset={23 * (1 - p)}
    />
  </svg>
);

// A terminal-output style line that settles in from below.
export const Line: React.FC<{
  f: number;
  at: number;
  children: ReactNode;
  style?: CSSProperties;
  dur?: number;
}> = ({ f, at, children, style, dur = 12 }) => {
  const p = interpolate(f, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        opacity: p,
        translate: `0 ${(1 - p) * 10}px`,
        fontFamily: mono,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// A thin readout header inside a TUI panel.
export const ShellHead: React.FC<{ label: string; right?: string }> = ({ label, right }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 16,
      paddingBottom: 14,
      borderBottom: `1px solid ${C.line}`,
      fontFamily: mono,
      fontSize: 34,
      color: C.dim,
    }}
  >
    <span style={{ color: C.muted }}>{label}</span>
    {right ? <span>{right}</span> : null}
  </div>
);

const StepRow: React.FC<{ step: number; f: number; start: number }> = ({ step, f, start }) => {
  const pulse = hit(MAP.beats, start + f, 9);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 18,
        height: 44,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.muted }}>
          Bước
        </span>
        <span
          style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 46,
            lineHeight: 1,
            color: C.accent,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {step}
        </span>
        <span style={{ fontFamily: mono, fontSize: 36, color: C.dim }}>/9</span>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 14 }}>
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 22,
              height: i === step - 1 ? 8 : 5,
              borderRadius: 2,
              background: i < step ? C.accent : "#2C3A35",
              opacity: i < step ? (i === step - 1 ? 1 : 0.55) : 1,
              scale: i === step - 1 ? 1 + pulse * 0.12 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// One terminal window, sharing the frame's single dark glass language.
export const TermWindow: React.FC<{
  children: ReactNode;
  pad?: number;
  title?: string;
  style?: CSSProperties;
}> = ({ children, pad = 26, title = "arm64@linux:~", style }) => (
  <div
    style={{
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      background: C.panel,
      border: `1.5px solid ${C.line}`,
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: "0 22px 54px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    <div
      style={{
        height: 60,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 26px",
        background: C.bar,
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: 3, background: C.accent }} />
      <span style={{ fontFamily: mono, fontSize: 34, color: C.muted }}>{title}</span>
    </div>
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        padding: pad,
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {children}
    </div>
  </div>
);

// Headline + step counter above the terminal, as the direction asks.
export const SceneFrame: React.FC<{
  step: number;
  headline: string[];
  start: number;
  brand?: boolean;
  children: ReactNode;
  flashAt?: number;
  flashColor?: string;
}> = ({ step, headline, start, brand = false, children, flashAt, flashColor = C.accent }) => {
  const f = useCurrentFrame();
  // The voice starts on the cut, so the headline and window are already
  // readable on frame 0; only a short rise gives the entrance its motion.
  const headP = interpolate(f, [0, 8], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const winP = interpolate(f, [0, 8], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const flash = flashAt === undefined ? 0 : bloom(f, flashAt);
  const maxLen = Math.max(...headline.map((l) => l.length));
  const size = Math.min(62, Math.floor(762 / (maxLen * 0.6)));

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.lineSoft} 1px, transparent 1px), linear-gradient(90deg, ${C.lineSoft} 1px, transparent 1px)`,
          backgroundSize: "54px 54px",
          opacity: 0.42,
        }}
      />
      <AbsoluteFill
        style={{
          padding: `${SAFE.top + (brand ? BRAND_SPACE : 0)}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            translate: `0 ${headP}px`,
            fontFamily: sans,
            fontWeight: 700,
            fontSize: size,
            lineHeight: 1.04,
            letterSpacing: -1,
            color: C.white,
            textWrap: "balance",
          }}
        >
          {headline.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
        <StepRow step={step} f={f} start={start} />
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            marginTop: 16,
            translate: `0 ${winP}px`,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
      {flash > 0 && <AbsoluteFill style={{ backgroundColor: flashColor, opacity: flash }} />}
      {brand && <Brand />}
    </AbsoluteFill>
  );
};

export const startsFor = (i: number) => STARTS[i];
