import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, OffthreadVideo } from "remotion";
import { sans, videoAsset } from "../../kit";
import { CLIPS, type Clip, type ClipKey } from "./data";
import { DEEP, INK, MUTED, SLUG, TONE, type Tone } from "./palette";

// Deterministic noise, so a frame is the same however it is rendered.
export const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const lerp = (t: number, at: number, dur: number, ease = true) => {
  if (t <= at) return 0;
  const p = clamp((t - at) / dur);
  return ease ? 1 - Math.pow(1 - p, 3) : p;
};

// Small aerial dust that streams past the camera.
export const Dust: React.FC<{ t: number; accent: string; n?: number; speed?: number }> = ({
  t,
  accent,
  n = 46,
  speed = 1,
}) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    {Array.from({ length: n }, (_, i) => {
      const bx = rand(i * 3.1) * 1080;
      const by = rand(i * 7.7 + 4) * 1920;
      const ph = (t * 0.0022 * (0.35 + rand(i) * 0.9) * speed + rand(i + 20)) % 1;
      const s = 1 + ph * 2.6;
      const x = 540 + (bx - 540) * s;
      const y = 960 + (by - 960) * s;
      const a = Math.sin(ph * Math.PI) * (0.16 + rand(i + 9) * 0.4);
      const d = 2 + rand(i + 3) * 3;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: d,
            height: d,
            borderRadius: d,
            background: i % 5 === 0 ? accent : "#DCEFFF",
            opacity: a,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// A perspective floor of thin lines, scrolling toward the viewer.
export const WireFloor: React.FC<{
  t: number;
  accent: string;
  speed?: number;
  horizon?: number;
  opacity?: number;
}> = ({ t, accent, speed = 0.016, horizon = 1200, opacity = 1 }) => {
  const vx = 540 + Math.sin(t * 0.0018) * 40;
  const phase = (t * speed) % 1;
  const rows: { y: number; a: number }[] = [];
  for (let i = 0; i < 22; i++) {
    const z = ((i + phase) % 22) / 22;
    const y = horizon + Math.pow(z, 2.15) * 780;
    if (y > 1920) continue;
    rows.push({ y, a: ((y - horizon) / 720) * 0.55 });
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity }}>
      <ellipse cx={vx} cy={horizon} rx={520} ry={90} fill={accent} opacity={0.1} />
      <ellipse cx={vx} cy={horizon} rx={300} ry={40} fill={accent} opacity={0.12} />
      {Array.from({ length: 15 }, (_, k) => {
        const xb = vx + (k - 7) * 175;
        return (
          <line
            key={`v${k}`}
            x1={vx}
            y1={horizon}
            x2={xb}
            y2={1940}
            stroke={accent}
            strokeWidth={k === 7 ? 2 : 1.2}
            opacity={0.14 + (k === 7 ? 0.08 : 0)}
          />
        );
      })}
      {rows.map((r, i) => (
        <line
          key={`h${i}`}
          x1={0}
          y1={r.y}
          x2={1080}
          y2={r.y}
          stroke={accent}
          strokeWidth={1.4}
          opacity={r.a}
        />
      ))}
    </svg>
  );
};

// Tall server cabinets at the edges of the world.
export const Racks: React.FC<{
  t: number;
  accent: string;
  opacity?: number;
  flip?: boolean;
  y?: number;
}> = ({ t, accent, opacity = 1, flip = false, y = 1920 }) => {
  const racks = [
    { x: 6, w: 210, h: 1080, seed: 1 },
    { x: 232, w: 150, h: 880, seed: 2 },
    { x: 850, w: 190, h: 980, seed: 3 },
    { x: 1040, w: 130, h: 780, seed: 4 },
  ];
  return (
    <svg
      width={1180}
      height={2000}
      style={{
        position: "absolute",
        left: flip ? -50 : -20,
        top: 0,
        transform: `translateY(${y - 1960}px)`,
        opacity,
      }}
    >
      {[...racks].reverse().map((r) => {
        const drift = Math.sin(t * 0.004 + r.seed) * 8;
        const x = r.x + drift;
        return (
          <g key={r.seed} transform={`translate(${x} ${1990 - r.h})`}>
            <rect
              width={r.w}
              height={r.h}
              fill="#04101A"
              stroke={accent}
              strokeWidth={1.5}
              opacity={0.5}
            />
            <rect width={r.w} height={3} fill={accent} opacity={0.55} />
            {Array.from({ length: Math.floor(r.h / 62) }, (_, row) => (
              <g key={row} transform={`translate(12 ${34 + row * 62})`}>
                <rect width={r.w - 24} height={2} fill={accent} opacity={0.14} />
                {Array.from({ length: Math.max(3, Math.floor(r.w / 34)) }, (_, c) => {
                  const on = Math.sin(t * 0.09 + row * 1.7 + c * 2.3 + r.seed * 9) > 0.15;
                  return (
                    <rect
                      key={c}
                      x={c * 30 + 6}
                      y={12}
                      width={9}
                      height={5}
                      fill={on ? accent : "#123247"}
                      opacity={on ? 0.85 : 0.5}
                    />
                  );
                })}
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 78% 62% at 50% 44%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.36) 72%, rgba(0,0,0,0.8) 100%)",
        opacity: strength,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(2,6,12,0.72) 0%, rgba(2,6,12,0.18) 18%, rgba(2,6,12,0) 42%, rgba(2,6,12,0.16) 68%, rgba(2,6,12,0.86) 100%)",
        opacity: strength,
      }}
    />
  </>
);

// The camera: a slow drift plus a frame-rate shake that grows with drive.
export const cameraStyle = (acc: number, t: number, seed = 0): CSSProperties => {
  const a = 1 + acc * 5.5;
  const x = Math.sin(t * 0.53 + seed) * a + Math.sin(t * 1.31 + seed * 2) * a * 0.45;
  const y = Math.cos(t * 0.47 + seed) * a + Math.sin(t * 1.07 + seed * 3) * a * 0.4;
  const r = Math.sin(t * 0.21 + seed) * 0.09 * a;
  return {
    transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(1.035)`,
  };
};

const GRADE: Record<Tone, string> = {
  cold: "saturate(0.5) contrast(1.16) brightness(0.6)",
  warm: "saturate(0.82) sepia(0.22) contrast(1.06) brightness(0.6)",
  warning: "saturate(0.62) contrast(1.24) brightness(0.5) hue-rotate(-14deg)",
  dawn: "saturate(0.9) sepia(0.16) contrast(1.02) brightness(0.72)",
};

export const FootageShot: React.FC<{
  clip: ClipKey;
  trim: number;
  t: number;
  len: number;
  tone: Tone;
  pos?: string;
  drive?: number;
}> = ({ clip, trim, t, len, tone, pos, drive = 1 }) => {
  const c: Clip = CLIPS[clip];
  const z = 1.04 + drive * 0.09 * (t / Math.max(1, len));
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 46%" }}>
        <OffthreadVideo
          src={videoAsset(SLUG, c.file)}
          muted
          trimBefore={trim}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: pos ?? c.pos,
            filter: GRADE[tone],
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(4,8,15,0.72) 0%, rgba(4,8,15,0.26) 36%, rgba(4,8,15,0.34) 72%, rgba(4,8,15,0.9) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: TONE[tone].haze,
          mixBlendMode: "color",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 52% at 50% 28%, ${TONE[tone].glow}55, transparent 70%)`,
          mixBlendMode: "screen",
          opacity: 0.5,
        }}
      />
      <Credit text={c.credit} />
    </AbsoluteFill>
  );
};

export const Credit: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      right: 200,
      top: 258,
      fontSize: 34,
      letterSpacing: 2,
      color: "rgba(226,241,255,0.5)",
      fontFamily: sans,
      fontWeight: 500,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

export const WorldBase: React.FC<{
  tone: Tone;
  t: number;
  children: ReactNode;
  floor?: boolean;
  dust?: boolean;
  racks?: boolean;
  glowY?: number;
  seed?: number;
}> = ({ tone, t, children, floor = true, dust = true, racks = false, glowY = 42, seed = 0 }) => (
  <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #02060C 0%, ${DEEP} 42%, ${TONE[tone].glow}44 76%, #02060C 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 72% 46% at 50% ${glowY}%, ${TONE[tone].glow}AA, transparent 70%)`,
        opacity: 0.55,
      }}
    />
    {racks && <Racks t={t} accent={TONE[tone].accent} opacity={0.6} />}
    {floor && <WireFloor t={t} accent={TONE[tone].accent} />}
    {dust && <Dust t={t} accent={TONE[tone].accent} />}
    {children}
  </AbsoluteFill>
);

export const GlowDot: React.FC<{
  x: number;
  y: number;
  r: number;
  color: string;
  opacity?: number;
}> = ({ x, y, r, color, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: r,
      background: `radial-gradient(circle, ${color} 0%, ${color}66 38%, transparent 70%)`,
      opacity,
    }}
  />
);

export const MonoLabel: React.FC<{
  children: ReactNode;
  size?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ children, size = 34, color = MUTED, style }) => (
  <div
    style={{
      fontSize: size,
      letterSpacing: size * 0.16,
      color,
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 500,
      ...style,
    }}
  >
    {children}
  </div>
);
