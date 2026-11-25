import { AbsoluteFill, interpolate } from "remotion";
import { Sfx, Terminal, display, mono, sans, typingFrames } from "../../kit";
import {
  DEEP,
  GREEN,
  ICE,
  INK,
  MINT,
  PANEL,
  RED,
  TONE,
  WHITE,
  type Tone,
} from "./palette";
import {
  Dust,
  GlowDot,
  MonoLabel,
  Racks,
  WireFloor,
  WorldBase,
  clamp,
  lerp,
  rand,
} from "./parts";

const A = (tone: Tone) => TONE[tone].accent;

// ---------------------------------------------------------------- desktop

type Win = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  ry: number;
  delay: number;
};

const WINDOWS: Record<number, Win[]> = {
  1: [
    { label: "TERMINAL", x: 110, y: 610, w: 450, h: 300, ry: -9, delay: 0 },
    { label: "FILES", x: 626, y: 764, w: 330, h: 250, ry: 8, delay: 9 },
    { label: "SERVICES", x: 664, y: 512, w: 310, h: 210, ry: 11, delay: 18 },
  ],
  2: [
    { label: "TERMINAL", x: 96, y: 600, w: 460, h: 300, ry: -10, delay: 0 },
    { label: "SERVICES", x: 650, y: 548, w: 330, h: 230, ry: 10, delay: 7 },
    { label: "FILES", x: 590, y: 812, w: 380, h: 244, ry: 7, delay: 14 },
    { label: "PORTS", x: 160, y: 960, w: 300, h: 190, ry: -6, delay: 21 },
  ],
  3: [
    { label: "TERMINAL", x: 90, y: 560, w: 420, h: 280, ry: -10, delay: 0 },
    { label: "SERVICES", x: 560, y: 512, w: 330, h: 220, ry: 9, delay: 4 },
    { label: "FILES", x: 610, y: 780, w: 340, h: 240, ry: 5, delay: 8 },
    { label: "DOCKER", x: 180, y: 900, w: 340, h: 230, ry: -7, delay: 12 },
    { label: "SSH KEYS", x: 420, y: 1010, w: 300, h: 180, ry: 4, delay: 16 },
  ],
  4: [
    { label: "DOCKER", x: 80, y: 590, w: 370, h: 280, ry: -9, delay: 0 },
    { label: "NGINX", x: 560, y: 664, w: 420, h: 292, ry: 6, delay: 5 },
    { label: "CRON", x: 300, y: 960, w: 440, h: 236, ry: -3, delay: 10 },
    { label: "TERMINAL", x: 704, y: 470, w: 280, h: 190, ry: 11, delay: 15 },
    { label: "FILES", x: 100, y: 940, w: 300, h: 200, ry: -8, delay: 20 },
  ],
  5: [
    { label: "TERMINAL", x: 120, y: 620, w: 400, h: 260, ry: -8, delay: 0 },
    { label: "FILES", x: 604, y: 580, w: 340, h: 230, ry: 8, delay: 6 },
    { label: "SERVICES", x: 640, y: 846, w: 320, h: 210, ry: 5, delay: 12 },
    { label: "DOCKER", x: 240, y: 940, w: 340, h: 220, ry: -5, delay: 18 },
  ],
  6: [
    { label: "TERMINAL", x: 76, y: 552, w: 380, h: 246, ry: -10, delay: 0 },
    { label: "FILES", x: 566, y: 512, w: 330, h: 224, ry: 10, delay: 4 },
    { label: "SERVICES", x: 630, y: 762, w: 340, h: 234, ry: 6, delay: 8 },
    { label: "DOCKER", x: 96, y: 852, w: 340, h: 230, ry: -7, delay: 12 },
    { label: "NGINX", x: 470, y: 1010, w: 360, h: 204, ry: 4, delay: 16 },
    { label: "CRON", x: 140, y: 1112, w: 300, h: 160, ry: -4, delay: 20 },
  ],
};

const WindowFrame: React.FC<{ w: Win; t: number; len: number; accent: string }> = ({
  w,
  t,
  len,
  accent,
}) => {
  const p = lerp(t, w.delay, 16);
  const cam = t / Math.max(1, len);
  return (
    <div
      style={{
        position: "absolute",
        left: w.x,
        top: w.y,
        width: w.w,
        height: w.h,
        opacity: p * 0.92,
        transform: `perspective(1400px) rotateY(${w.ry}deg) scale(${0.94 + cam * 0.1}) translateY(${(1 - p) * 26 - cam * 36}px)`,
        transformOrigin: "50% 50%",
        border: `1.5px solid ${accent}66`,
        background: `linear-gradient(155deg, rgba(7,23,36,0.7), rgba(4,10,18,0.28))`,
      }}
    >
      <div
        style={{
          height: 52,
          borderBottom: `1px solid ${accent}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 34,
            letterSpacing: 4,
            color: accent,
            opacity: 0.92,
          }}
        >
          {w.label}
        </span>
        <span style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ width: 7, height: 7, background: accent, opacity: 0.45 }}
            />
          ))}
        </span>
      </div>
      <div style={{ padding: "18px 16px", display: "grid", gap: 11 }}>
        {Array.from({ length: Math.max(3, Math.floor((w.h - 96) / 26)) }, (_, i) => (
          <div
            key={i}
            style={{
              height: 4,
              width: `${22 + rand(w.x + i * 3.7) * 68}%`,
              background: i === 1 ? accent : "#B8D8EA",
              opacity: i === 1 ? 0.5 : 0.18,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const DesktopVoid: React.FC<{
  t: number;
  len: number;
  tone: Tone;
  variant: number;
}> = ({ t, len, tone, variant }) => {
  const accent = A(tone);
  const wins = WINDOWS[variant] ?? WINDOWS[1];
  const drift = Math.sin(t * 0.008) * 14;
  return (
    <WorldBase tone={tone} t={t} racks>
      <AbsoluteFill style={{ transform: `translateX(${drift}px)` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {wins.map((w, i) => (
            <line
              key={i}
              x1={540}
              y1={900}
              x2={w.x + w.w / 2}
              y2={w.y + w.h / 2}
              stroke={accent}
              strokeWidth={1}
              opacity={0.12 + 0.05 * Math.sin(t * 0.03 + i)}
            />
          ))}
        </svg>
        {wins.map((w, i) => (
          <WindowFrame key={w.label} w={w} t={t} len={len} accent={accent} />
        ))}
      </AbsoluteFill>
      <GlowDot x={540} y={880} r={260} color={accent} opacity={0.13} />
    </WorldBase>
  );
};

// ---------------------------------------------------------------- link

const bez = (p0: number[], p1: number[], p2: number[], p3: number[], u: number) => {
  const v = 1 - u;
  return (
    v * v * v * p0[0] +
    3 * v * v * u * p1[0] +
    3 * v * u * u * p2[0] +
    u * u * u * p3[0]
  );
};
const bezY = (p0: number[], p1: number[], p2: number[], p3: number[], u: number) => {
  const v = 1 - u;
  return (
    v * v * v * p0[1] +
    3 * v * v * u * p1[1] +
    3 * v * u * u * p2[1] +
    u * u * u * p3[1]
  );
};

export const SshLink: React.FC<{ t: number; tone: Tone }> = ({ t, tone }) => {
  const accent = A(tone);
  const p0 = [430, 890];
  const p1 = [540, 610];
  const p2 = [640, 1140];
  const p3 = [760, 880];
  const pulses = [0, 1, 2, 3].map((i) => (t * 0.009 + i / 4) % 1);
  return (
    <WorldBase tone={tone} t={t} racks>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* laptop */}
        <g opacity={0.9}>
          <rect x={150} y={720} width={280} height={190} fill="#071722" stroke={accent} strokeWidth={2.5} />
          <rect x={172} y={744} width={236} height={142} fill="none" stroke={accent} strokeWidth={1} opacity={0.4} />
          <line x1={172} y1={790} x2={408} y2={790} stroke={accent} strokeWidth={1} opacity={0.3} />
          <line x1={172} y1={812} x2={360} y2={812} stroke={accent} strokeWidth={1} opacity={0.3} />
          <path d="M118 910 H462 L500 946 H80 Z" fill="#071722" stroke={accent} strokeWidth={2.5} />
          <circle cx={290} cy={930} r={8} fill={accent} opacity={0.6} />
        </g>
        {/* server */}
        <g opacity={0.95}>
          <rect x={760} y={566} width={228} height={614} fill="#071722" stroke={accent} strokeWidth={2.5} />
          <rect x={760} y={566} width={228} height={4} fill={accent} opacity={0.7} />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <rect x={778} y={596 + i * 64} width={192} height={2} fill={accent} opacity={0.18} />
              {[0, 1, 2, 3, 4].map((c) => (
                <rect
                  key={c}
                  x={782 + c * 16}
                  y={608 + i * 64}
                  width={7}
                  height={5}
                  fill={accent}
                  opacity={Math.sin(t * 0.08 + i * 1.4 + c) > 0 ? 0.85 : 0.18}
                />
              ))}
            </g>
          ))}
        </g>
        {/* link */}
        <path
          d={`M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]}, ${p2[0]} ${p2[1]}, ${p3[0]} ${p3[1]}`}
          fill="none"
          stroke={accent}
          strokeWidth={2.5}
          strokeDasharray="10 14"
          strokeDashoffset={-t * 5}
          opacity={0.8}
        />
        {pulses.map((u, i) => {
          const x = bez(p0, p1, p2, p3, u);
          const y = bezY(p0, p1, p2, p3, u);
          return <circle key={i} cx={x} cy={y} r={7 + (i % 2) * 3} fill={accent} opacity={0.9} />;
        })}
        <circle cx={p0[0]} cy={p0[1]} r={18} fill="none" stroke={accent} opacity={0.5} />
        <circle cx={p3[0]} cy={p3[1]} r={22} fill="none" stroke={accent} opacity={0.6} />
      </svg>
      <div style={{ position: "absolute", left: 128, top: 1000, fontFamily: sans, fontSize: 34, letterSpacing: 3, color: "rgba(226,241,255,0.62)" }}>
        MÁY CỦA BẠN
      </div>
      <div style={{ position: "absolute", left: 786, top: 1210, fontFamily: mono, fontSize: 34, letterSpacing: 5, color: "rgba(226,241,255,0.62)" }}>
        VPS
      </div>
      <div style={{ position: "absolute", left: 512, top: 742, fontFamily: mono, fontSize: 40, letterSpacing: 8, color: accent, opacity: 0.8 }}>
        SSH
      </div>
      <div style={{ position: "absolute", left: 504, top: 794, fontFamily: mono, fontSize: 34, letterSpacing: 6, color: accent, opacity: 0.45 }}>
        SFTP
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          background: `radial-gradient(ellipse 55% 40% at 60% 46%, ${accent}18, transparent 70%)`,
        }}
      />
    </WorldBase>
  );
};

// ---------------------------------------------------------------- key

export const KeyArt: React.FC<{ t: number; tone: Tone }> = ({ t, tone }) => {
  const accent = A(tone);
  const rot = -22 + Math.sin(t * 0.01) * 5;
  const scale = 1 + Math.sin(t * 0.006) * 0.02;
  return (
    <WorldBase tone={tone} t={t} racks>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 900) rotate(${rot}) scale(${scale}) translate(-540 -900)`}>
          <g stroke={accent} fill="none" strokeLinecap="round">
            <circle cx={420} cy={880} r={162} strokeWidth={18} opacity={0.12} />
            <circle cx={420} cy={880} r={162} strokeWidth={3.5} opacity={0.95} />
            <circle cx={420} cy={880} r={82} strokeWidth={3} opacity={0.6} />
            <path d="M572 880 H916" strokeWidth={54} opacity={0.95} />
            <path d="M572 880 H916" strokeWidth={2} opacity={0.5} />
            <path d="M790 906 V986 H846 V906" strokeWidth={28} opacity={0.95} />
            <path d="M872 906 V962 H922 V906" strokeWidth={28} opacity={0.95} />
          </g>
          <circle
            cx={420}
            cy={880}
            r={214}
            fill="none"
            stroke={accent}
            strokeWidth={1.5}
            strokeDasharray="4 20"
            opacity={0.5}
            transform={`rotate(${t * 0.5} 420 880)`}
          />
        </g>
      </svg>
      <GlowDot x={420} y={880} r={300} color={accent} opacity={0.14} />
      <MonoLabel size={34} color={`${accent}99`} style={{ position: "absolute", left: 126, top: 1148 }}>
        SSH KEY
      </MonoLabel>
    </WorldBase>
  );
};

// ---------------------------------------------------------------- command gate

export const CommandGate: React.FC<{
  t: number;
  len: number;
  tone: Tone;
  variant: number;
}> = ({ t, len, tone, variant }) => {
  const accent = A(tone);
  const plane = 786;
  const hitAt = Math.round(len * 0.34);
  const goAt = Math.round(len * 0.58);
  let head = interpolate(t, [0, hitAt], [120, plane], {
    extrapolateRight: "clamp",
    easing: (p) => 1 - Math.pow(1 - p, 2),
  });
  if (t > goAt) head = interpolate(t, [goAt, len], [plane, 1090], { extrapolateRight: "clamp" });
  if (variant === 2) head = 940;
  const rings = [0, 1, 2].map((i) => {
    const age = t - hitAt - i * 9;
    return age > 0 ? age / 34 : -1;
  });
  const checked = variant === 2 || t > goAt;
  return (
    <WorldBase tone={tone} t={t} racks>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={plane - 4} y={320} width={8} height={1300} fill={accent} opacity={0.3} />
        {Array.from({ length: 17 }, (_, i) => (
          <line
            key={i}
            x1={0}
            y1={320 + i * 80}
            x2={1080}
            y2={320 + i * 80}
            stroke={accent}
            strokeWidth={1}
            opacity={0.07}
          />
        ))}
        <line x1={0} y1={880} x2={head} y2={880} stroke={accent} strokeWidth={3} opacity={0.9} />
        <circle cx={head} cy={880} r={14} fill={accent} opacity={0.95} />
        <circle cx={head} cy={880} r={30} fill={accent} opacity={0.18} />
        {rings.map((p, i) =>
          p >= 0 ? (
            <circle
              key={i}
              cx={plane}
              cy={880}
              r={26 + p * 210}
              fill="none"
              stroke={accent}
              strokeWidth={2}
              opacity={(1 - p) * 0.55}
            />
          ) : null,
        )}
        {checked && (
          <path
            d="M744 884 L774 914 L846 826"
            fill="none"
            stroke={checked ? GREEN : accent}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={170}
            strokeDashoffset={170 * (1 - clamp((t - goAt) / 16))}
            opacity={0.95}
          />
        )}
      </svg>
      <GlowDot x={plane} y={880} r={180} color={accent} opacity={0.1} />
      <div style={{ position: "absolute", left: 128, top: 936, fontFamily: sans, fontSize: 34, letterSpacing: 3, color: "rgba(226,241,255,0.5)" }}>
        CÂU LỆNH
      </div>
    </WorldBase>
  );
};

// ---------------------------------------------------------------- port

export const PortDoor: React.FC<{ t: number; tone: Tone }> = ({ t, tone }) => {
  const accent = A(tone);
  const open = interpolate(t, [14, 46], [0, 1], {
    extrapolateRight: "clamp",
    easing: (p) => 1 - Math.pow(1 - p, 3),
  });
  const gapH = 26 + open * 226;
  const cy = 880;
  return (
    <WorldBase tone={tone} t={t} racks>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={560 + i * 40}
            y1={300}
            x2={560 + i * 40}
            y2={1620}
            stroke={accent}
            strokeWidth={1}
            opacity={0.1}
          />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={540}
            y1={320 + i * 76}
            x2={1080}
            y2={320 + i * 76}
            stroke={accent}
            strokeWidth={1}
            opacity={0.1}
          />
        ))}
        {/* the one opening */}
        <rect x={718} y={cy - gapH / 2} width={140} height={gapH} fill={`${accent}22`} stroke={accent} strokeWidth={2.5} opacity={0.95} />
        <rect x={718} y={cy - gapH / 2} width={140} height={2} fill={accent} opacity={0.9} />
        <rect x={718} y={cy + gapH / 2 - 2} width={140} height={2} fill={accent} opacity={0.9} />
        <line x1={788} y1={cy - gapH / 2} x2={788} y2={cy + gapH / 2} stroke={accent} strokeWidth={1.5} opacity={0.5} />
        <ellipse cx={788} cy={cy} rx={180 + open * 90} ry={90 + open * 40} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.22 + open * 0.18} />
      </svg>
      <MonoLabel size={34} color={`${accent}AA`} style={{ position: "absolute", left: 704, top: cy + 200 }}>
        PORT WEB
      </MonoLabel>
      <div style={{ position: "absolute", left: 112, top: 700, fontFamily: sans, fontSize: 34, letterSpacing: 3, color: "rgba(226,241,255,0.5)" }}>
        MỞ THÊM CỔNG
      </div>
      <GlowDot x={788} y={cy} r={200} color={accent} opacity={0.12 + open * 0.1} />
    </WorldBase>
  );
};

// ---------------------------------------------------------------- log tape

export const LogTape: React.FC<{
  t: number;
  tone: Tone;
  variant: number;
}> = ({ t, tone, variant }) => {
  const accent = A(tone);
  const scroll = t * 3.2;
  const rows = Array.from({ length: 11 }, (_, i) => i);
  const head = 180 + ((t * 3.4) % 700);
  return (
    <WorldBase tone={tone} t={t} racks>
      <div
        style={{
          position: "absolute",
          left: -40,
          top: 760,
          width: 1160,
          height: 300,
          transform: `rotate(-6deg)`,
          borderTop: `1px solid ${accent}55`,
          borderBottom: `1px solid ${accent}55`,
          background: `linear-gradient(180deg, ${accent}10, rgba(4,10,18,0.5))`,
          overflow: "hidden",
        }}
      >
        {rows.map((r) => {
          const y = 22 + r * 25;
          const speed = 1 + (r % 3) * 0.5;
          return (
            <div key={r} style={{ position: "absolute", top: y, left: 0, right: 0, height: 6, display: "flex", gap: 16 }}>
              {Array.from({ length: 9 }, (_, c) => (
                <div
                  key={c}
                  style={{
                    width: 40 + rand(r * 9 + c) * 90,
                    height: 5,
                    background: r === 5 ? accent : "#BFDCEB",
                    opacity: r === 5 ? 0.6 : 0.14,
                    transform: `translateX(${-(scroll * speed + c * 60) % 180}px)`,
                  }}
                />
              ))}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            top: 148,
            left: 0,
            width: 780,
            height: 8,
            background: `linear-gradient(90deg, ${accent}00, ${accent}, ${accent}00)`,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            left: head,
            width: 2,
            height: 284,
            background: accent,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 138,
            left: head + 12,
            width: 12,
            height: 28,
            background: accent,
            opacity: Math.floor(t / 16) % 2 === 0 ? 0.9 : 0.25,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 1130,
          fontFamily: sans,
          fontSize: 34,
          letterSpacing: 4,
          color: "rgba(226,241,255,0.55)",
        }}
      >
        COMMAND LOG
      </div>
      {variant === 2 && (
        <div
          style={{
            position: "absolute",
            right: 130,
            top: 640,
            width: 220,
            height: 400,
            border: `1px solid ${accent}66`,
            background: `linear-gradient(160deg, ${PANEL}, rgba(4,10,18,0.4))`,
            transform: `rotate(3deg) translateY(${Math.sin(t * 0.02) * 6}px)`,
          }}
        >
          <div style={{ padding: 16, display: "grid", gap: 12 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                style={{
                  height: 4,
                  width: `${30 + rand(i * 5) * 60}%`,
                  background: i === 2 ? accent : "#B8D8EA",
                  opacity: i === 2 ? 0.6 : 0.2,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </WorldBase>
  );
};

// ---------------------------------------------------------------- script

export const ScriptWorld: React.FC<{ t: number; tone: Tone }> = ({ t, tone }) => {
  const accent = A(tone);
  const p = clamp(t / 40);
  return (
    <WorldBase tone={tone} t={t} racks>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path
          d={`M120 900 C360 ${900 - p * 90}, 440 ${900 - p * 90}, 540 720 L540 1160 C440 1160, 360 1000, 120 1000 Z`}
          fill={`${accent}0E`}
          stroke={accent}
          strokeWidth={2}
          opacity={0.55}
        />
        <path
          d="M540 720 H900 V1160 H540"
          fill={`${accent}0A`}
          stroke={accent}
          strokeWidth={2}
          opacity={0.6}
        />
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i}>
            <rect x={560 + (i % 2) * 10} y={758 + i * 30} width={24} height={4} fill={accent} opacity={0.5} />
            <rect x={596} y={758 + i * 30} width={90 + rand(i * 4) * 180} height={4} fill="#C6E8F8" opacity={0.25} />
          </g>
        ))}
        <path d="M540 720 V1160" stroke={accent} strokeWidth={1.5} opacity={0.5} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 552,
          top: 1150,
          width: 12,
          height: 26,
          background: accent,
          opacity: Math.floor(t / 14) % 2 === 0 ? 0.9 : 0.2,
        }}
      />
      <MonoLabel size={34} color={`${accent}99`} style={{ position: "absolute", left: 596, top: 1196 }}>
        SHELL SCRIPT
      </MonoLabel>
    </WorldBase>
  );
};

// ---------------------------------------------------------------- sudo ram

export const SudoRam: React.FC<{ t: number; len: number; tone: Tone; variant: number }> = ({
  t,
  len,
  tone,
  variant,
}) => {
  const accent = variant === 2 ? GREEN : A(tone);
  const p = clamp(t / Math.max(1, len));
  const empty = variant === 2 ? 1 : p;
  const shackleLift = variant === 2 ? 26 : 0;
  const evap = t > len * 0.35;
  return (
    <WorldBase tone={tone} t={t} racks>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 940) rotate(-7) translate(-540 -940)`}>
          <rect x={176} y={820} width={730} height={236} rx={8} fill="#071722" stroke={accent} strokeWidth={2.5} />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <rect x={202 + i * 84} y={848} width={66} height={112} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.55} />
              <rect x={214 + i * 84} y={860} width={42} height={88} fill={accent} opacity={0.08 + (i % 3) * 0.03} />
            </g>
          ))}
          {Array.from({ length: 34 }, (_, i) => (
            <rect key={i} x={196 + i * 20} y={1056} width={8} height={20} fill={accent} opacity={0.55} />
          ))}
          <rect x={176} y={820} width={730} height={3} fill={accent} opacity={0.8} />
        </g>
        {/* padlock */}
        <g transform={`translate(540 640)`}>
          <path
            d={`M-52 ${-6 + shackleLift} v-38 a52 52 0 0 1 104 0 v38`}
            fill="none"
            stroke={accent}
            strokeWidth={12}
            opacity={0.9}
          />
          <rect x={-78} y={-8} width={156} height={124} rx={10} fill="#071722" stroke={accent} strokeWidth={3} />
          <circle cx={0} cy={40} r={14} fill={accent} />
          <rect x={-5} y={44} width={10} height={34} fill={accent} />
        </g>
        {/* drain bar */}
        <rect x={960} y={560} width={12} height={660} fill={`${accent}22`} stroke={accent} strokeWidth={1.5} opacity={0.7} />
        <rect x={960} y={560} width={12} height={660 * (1 - empty)} fill={accent} opacity={0.8} />
      </svg>
      {evap &&
        Array.from({ length: 26 }, (_, i) => {
          const life = ((t * 0.012 + rand(i) * 1.5) % 1);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 300 + rand(i * 3) * 500,
                top: 800 - life * 360,
                width: 4,
                height: 4,
                background: accent,
                opacity: (1 - life) * 0.55,
              }}
            />
          );
        })}
      <MonoLabel size={34} color={`${accent}99`} style={{ position: "absolute", left: 200, top: 1210 }}>
        RAM
      </MonoLabel>
      <GlowDot x={540} y={760} r={320} color={accent} opacity={0.1} />
    </WorldBase>
  );
};

// ---------------------------------------------------------------- two servers

export const TwoServers: React.FC<{ t: number; tone: Tone }> = ({ t, tone }) => {
  const accent = A(tone);
  const hit = t >= 9 ? interpolate(t - 9, [0, 18], [0.62, 0], { extrapolateRight: "clamp" }) : 0;
  const ringP = t >= 9 ? clamp((t - 9) / 42) : 0;
  const slabs = [
    { x: 148, label: "VPS 1" },
    { x: 744, label: "VPS 2" },
  ];
  return (
    <WorldBase tone={tone} t={t} racks>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {slabs.map((s, si) => (
          <g key={s.label} transform={`translate(${s.x} ${548 + si * 40})`}>
            <rect width={188} height={650} fill="#081A26" stroke={accent} strokeWidth={2.5} />
            <rect width={188} height={4} fill={accent} opacity={0.7} />
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i}>
                <rect x={16} y={32 + i * 66} width={156} height={2} fill={accent} opacity={0.16} />
                {[0, 1, 2, 3, 4].map((c) => (
                  <rect
                    key={c}
                    x={20 + c * 20}
                    y={44 + i * 66}
                    width={8}
                    height={5}
                    fill={accent}
                    opacity={Math.sin(t * 0.09 + i + c + si * 3) > 0 ? 0.85 : 0.2}
                  />
                ))}
              </g>
            ))}
          </g>
        ))}
        <path
          d="M336 860 C450 760, 630 760, 744 860"
          fill="none"
          stroke={accent}
          strokeWidth={2.5}
          strokeDasharray="8 12"
          strokeDashoffset={-t * 4}
          opacity={0.8}
        />
        {[0, 1, 2].map((i) => {
          const u = (t * 0.01 + i / 3) % 1;
          const x = 336 + u * 408;
          const y = 860 - Math.sin(u * Math.PI) * 100;
          return <circle key={i} cx={x} cy={y} r={7} fill={accent} opacity={0.9} />;
        })}
        <circle cx={540} cy={810} r={30 + ringP * 300} fill="none" stroke={accent} strokeWidth={2} opacity={(1 - ringP) * 0.6} />
        <circle cx={540} cy={810} r={20 + ringP * 180} fill="none" stroke={WHITE} strokeWidth={1.5} opacity={(1 - ringP) * 0.45} />
      </svg>
      {slabs.map((s, i) => (
        <div
          key={s.label}
          style={{
            position: "absolute",
            left: s.x,
            top: 1210 + i * 40,
            fontFamily: mono,
            fontSize: 34,
            letterSpacing: 5,
            color: "rgba(226,241,255,0.62)",
          }}
        >
          {s.label}
        </div>
      ))}
      <AbsoluteFill style={{ background: "#FFF6E8", opacity: hit, mixBlendMode: "screen" }} />
      <GlowDot x={540} y={860} r={330} color={accent} opacity={0.13} />
    </WorldBase>
  );
};

// ---------------------------------------------------------------- drag file

export const DragFile: React.FC<{ t: number; len: number; tone: Tone }> = ({ t, len, tone }) => {
  const accent = A(tone);
  const u = clamp(t / Math.max(1, len * 0.82), 0, 1);
  const x = 300 + u * 480;
  const y = 880 - Math.sin(u * Math.PI) * 220;
  const trail = [0.05, 0.1, 0.16].map((d) => {
    const uu = clamp(u - d, 0, 1);
    return { x: 300 + uu * 480, y: 880 - Math.sin(uu * Math.PI) * 220 };
  });
  const landed = u >= 1 ? clamp((t - len * 0.82) / 20) : 0;
  return (
    <WorldBase tone={tone} t={t} racks>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={140} y={690} width={180} height={470} fill="#081A26" stroke={accent} strokeWidth={2} opacity={0.9} />
        <rect x={770} y={690} width={180} height={470} fill="#081A26" stroke={accent} strokeWidth={2} opacity={0.9} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={158} y={730 + i * 64} width={144} height={2} fill={accent} opacity={0.2} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={788} y={730 + i * 64} width={144} height={2} fill={accent} opacity={0.2} />
        ))}
        <path
          d="M320 870 C470 560, 620 560, 770 870"
          fill="none"
          stroke={accent}
          strokeWidth={1.5}
          strokeDasharray="5 16"
          opacity={0.45}
        />
        {trail.map((p, i) => (
          <rect
            key={i}
            x={p.x - 26}
            y={p.y - 34}
            width={52}
            height={68}
            fill="none"
            stroke={accent}
            strokeWidth={2}
            opacity={(1 - i * 0.28) * 0.5}
            transform={`rotate(${Math.sin(u * Math.PI) * -12} ${p.x} ${p.y})`}
          />
        ))}
        <g transform={`translate(${x} ${y}) rotate(${Math.sin(u * Math.PI) * -12})`}>
          <path d="M-30 -40 H10 L30 -20 V40 H-30 Z" fill="#0C2434" stroke={accent} strokeWidth={2.5} />
          <path d="M10 -40 V-20 H30" fill="none" stroke={accent} strokeWidth={2} />
          <rect x={-20} y={-2} width={28} height={3} fill={accent} opacity={0.7} />
          <rect x={-20} y={12} width={20} height={3} fill={accent} opacity={0.5} />
        </g>
        <circle cx={770} cy={870} r={18 + landed * 26} fill="none" stroke={accent} strokeWidth={2} opacity={0.4 + landed * 0.4} />
      </svg>
      <div style={{ position: "absolute", left: 174, top: 1190, fontFamily: mono, fontSize: 34, letterSpacing: 5, color: "rgba(226,241,255,0.6)" }}>
        VPS 1
      </div>
      <div style={{ position: "absolute", left: 804, top: 1190, fontFamily: mono, fontSize: 34, letterSpacing: 5, color: "rgba(226,241,255,0.6)" }}>
        VPS 2
      </div>
      <span style={{ display: "none" }}>{len}</span>
    </WorldBase>
  );
};

// ---------------------------------------------------------------- tools

const TOOLS = [
  { name: "Docker", x: 96, y: 690, size: 112, rot: -5, at: 0 },
  { name: "Nginx", x: 380, y: 880, size: 116, rot: 4, at: 22 },
  { name: "Cron", x: 192, y: 1082, size: 120, rot: -2, at: 44 },
];

export const ToolField: React.FC<{ t: number; tone: Tone }> = ({ t, tone }) => {
  const accent = A(tone);
  return (
    <WorldBase tone={tone} t={t} racks>
      <AbsoluteFill>
        {TOOLS.map((tool, i) => {
          const p = lerp(t, tool.at, 18);
          const bright = t >= tool.at ? 1 : 0.2;
          return (
            <div
              key={tool.name}
              style={{
                position: "absolute",
                left: tool.x,
                top: tool.y,
                opacity: p,
                transform: `translateZ(0) rotate(${tool.rot}deg) translateY(${(1 - p) * 34 + Math.sin(t * 0.012 + i) * 8}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: tool.size,
                  lineHeight: 1,
                  letterSpacing: -2,
                  color: i === 1 ? accent : WHITE,
                  opacity: 0.65 + bright * 0.35,
                }}
              >
                {tool.name}
              </div>
              <div
                style={{
                  marginTop: 14,
                  height: 2,
                  width: `${140 + i * 60}px`,
                  background: accent,
                  opacity: 0.35 * bright + 0.15,
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d="M240 640 C360 500, 620 500, 760 620" fill="none" stroke={accent} strokeWidth={1.5} opacity={0.35} strokeDasharray="6 12" />
        <circle cx={250} cy={1480} r={200} fill={accent} opacity={0.07} />
        <circle cx={250} cy={1480} r={110} fill={accent} opacity={0.05} />
      </svg>
    </WorldBase>
  );
};

// ---------------------------------------------------------------- warning

export const WarningField: React.FC<{
  t: number;
  len: number;
  tone: Tone;
  variant: number;
}> = ({ t, tone, variant }) => {
  const accent = RED;
  const glitch = Math.sin(t * 0.9) > 0.86;
  const shift = glitch ? 12 : 0;
  const tri = "M540 620 L810 1090 H270 Z";
  return (
    <WorldBase tone={tone} t={t} racks floor={false}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={tri}
            fill="none"
            stroke={i === 0 ? accent : i === 1 ? "#FFFFFF" : ICE}
            strokeWidth={i === 0 ? 7 : 2}
            opacity={i === 0 ? 0.85 : 0.18}
            transform={`translate(${shift * (i % 2 ? -1 : 1)} 0)`}
          />
        ))}
        <line x1={540} y1={760} x2={540} y2={940} stroke={accent} strokeWidth={12} strokeLinecap="round" />
        <circle cx={540} cy={1000} r={10} fill={accent} />
        <rect x={0} y={596 + ((t * 7) % 520)} width={1080} height={2} fill={accent} opacity={0.5} />
        <rect x={0} y={620 + ((t * 5 + 200) % 460)} width={1080} height={1} fill={accent} opacity={0.3} />
      </svg>
      {variant === 2 && (
        <AbsoluteFill>
          {Array.from({ length: 13 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 520 + i * 58,
                height: 2,
                background: accent,
                opacity: 0.16 + (i % 3) * 0.08,
                transform: `translateY(${Math.sin(t * 0.05 + i) * 6}px)`,
              }}
            />
          ))}
        </AbsoluteFill>
      )}
      <Dust t={t} accent={accent} n={30} />
      <GlowDot x={540} y={860} r={420} color={accent} opacity={0.14} />
    </WorldBase>
  );
};

// ---------------------------------------------------------------- gpu

export const GpuChip: React.FC<{
  t: number;
  tone: Tone;
  variant: number;
}> = ({ t, tone, variant }) => {
  const ok = variant >= 3;
  const accent = ok ? GREEN : variant === 2 ? "#FF8A3C" : RED;
  const spin = t * (ok ? 4.5 : 2.2);
  return (
    <WorldBase tone={tone} t={t} racks floor={false}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 880) rotate(-6)`}>
          <rect x={-232} y={-232} width={464} height={464} rx={18} fill="#0A141C" stroke={accent} strokeWidth={4} />
          {Array.from({ length: 14 }, (_, i) => (
            <g key={i}>
              <rect x={-232 + i * 34} y={-262} width={14} height={30} fill={accent} opacity={0.55} />
              <rect x={-232 + i * 34} y={232} width={14} height={30} fill={accent} opacity={0.55} />
              <rect x={-262} y={-232 + i * 34} width={30} height={14} fill={accent} opacity={0.55} />
              <rect x={232} y={-232 + i * 34} width={30} height={14} fill={accent} opacity={0.55} />
            </g>
          ))}
          <g transform={`rotate(${spin})`}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <path
                key={i}
                d="M0 0 C-26 -44, 26 -44, 0 0 Z"
                fill={accent}
                opacity={0.25}
                transform={`rotate(${i * 45}) translate(0 -92) scale(1.6)`}
              />
            ))}
            <circle r={186} fill="none" stroke={accent} strokeWidth={2} opacity={0.35} />
            <circle r={132} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.5} />
          </g>
          <circle r={58} fill="#071722" stroke={accent} strokeWidth={3} />
          <text
            x={0}
            y={13}
            textAnchor="middle"
            fontFamily={mono}
            fontSize={34}
            letterSpacing={3}
            fill={accent}
          >
            GPU
          </text>
          <circle cx={196} cy={-196} r={12} fill={accent} opacity={0.95} />
        </g>
        {ok && (
          <>
            <circle cx={540} cy={880} r={300 + ((t * 4) % 100)} fill="none" stroke={GREEN} strokeWidth={2} opacity={0.3} />
            <circle cx={540} cy={880} r={340 + ((t * 4 + 50) % 100)} fill="none" stroke={GREEN} strokeWidth={1.5} opacity={0.22} />
          </>
        )}
      </svg>
      {!ok &&
        Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 380 + i * 34,
              top: 400 - Math.sin(t * 0.05 + i) * 40,
              width: 2,
              height: 90 + rand(i) * 70,
              background: accent,
              opacity: 0.18,
              transform: `rotate(${(rand(i) - 0.5) * 24}deg)`,
            }}
          />
        ))}
    </WorldBase>
  );
};

// ---------------------------------------------------------------- rack

export const EmptyRack: React.FC<{ t: number; tone: Tone }> = ({ t, tone }) => {
  const accent = A(tone);
  return (
    <WorldBase tone={tone} t={t} racks>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(348 470)">
          <rect width={384} height={800} fill="#06131E" stroke={accent} strokeWidth={3} />
          <rect width={384} height={4} fill={accent} opacity={0.7} />
          {Array.from({ length: 10 }, (_, i) => (
            <g key={i}>
              <rect x={26} y={40 + i * 74} width={332} height={48} fill="#04101A" stroke={accent} strokeWidth={1} opacity={0.35} />
              <rect x={40} y={58 + i * 74} width={4} height={12} fill={accent} opacity={0.14} />
            </g>
          ))}
          <path d="M384 700 C520 640, 640 560, 740 540" fill="none" stroke={accent} strokeWidth={2} strokeDasharray="7 10" strokeDashoffset={-t * 4} opacity={0.8} />
          <circle cx={384} cy={700} r={9} fill={accent} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 384, top: 1300, fontFamily: sans, fontSize: 34, letterSpacing: 3, color: "rgba(226,241,255,0.55)" }}>
        VPS · KHÔNG TIẾN TRÌNH
      </div>
      <GlowDot x={540} y={860} r={300} color={accent} opacity={0.1} />
    </WorldBase>
  );
};

// ---------------------------------------------------------------- dawn

export const DawnWorld: React.FC<{
  t: number;
  variant: number;
}> = ({ t, variant }) => {
  const accent = MINT;
  const horizon = 1260;
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, #050B14 0%, #0B1B2C 34%, #46301F 62%, #B76A2E 82%, #F3B36A 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 22% at 50% ${(horizon / 1920) * 100}%, #FFD9A8CC, transparent 70%)`,
        }}
      />
      <Racks t={t} accent="#1A2836" opacity={0.9} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={i}
            x1={0}
            y1={horizon + Math.pow(i / 14, 1.7) * 660}
            x2={1080}
            y2={horizon + Math.pow(i / 14, 1.7) * 660}
            stroke="#2B1A10"
            strokeWidth={1}
            opacity={0.35}
          />
        ))}
        <rect x={0} y={horizon - 2} width={1080} height={4} fill="#FFD9A8" opacity={0.55} />
      </svg>
      {variant >= 2 &&
        Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 40 + rand(i * 2.3) * 1000,
              top: 420 + rand(i * 5.1) * 700,
              width: 3,
              height: 3,
              background: "#FFF3D7",
              opacity: 0.3 + 0.4 * Math.abs(Math.sin(t * 0.02 + i)),
            }}
          />
        ))}
      {Array.from({ length: 24 }, (_, i) => {
        const life = (t * 0.006 + rand(i) * 2) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 60 + rand(i * 4) * 960,
              top: 1300 - life * 720,
              width: 3,
              height: 3,
              background: accent,
              opacity: (1 - life) * 0.55,
            }}
          />
        );
      })}
      <Dust t={t} accent={accent} n={24} speed={0.4} />
      <GlowDot x={540} y={horizon} r={420} color="#FFC37E" opacity={0.35} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- terminal

const CMD2 = 'bash -c "$(curl -sSL https://resource.1panel.pro/v2/quick_start.sh)"';
const CMD8 = "DAVISH_WEBVIEW_GPU=always ./Davish";

export const TerminalStage: React.FC<{ t: number; tone: Tone; variant: number }> = ({
  t,
  tone,
  variant,
}) => {
  const warm = variant === 1;
  const cmd = warm ? CMD2 : CMD8;
  const accent = warm ? "#F2A65A" : "#FF7A68";
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 46% at 50% 42%, ${TONE[tone].glow}88, transparent 70%), linear-gradient(180deg, #02060C, ${DEEP})`,
        }}
      />
      <Racks t={t} accent={accent} opacity={0.25} />
      <WireFloor t={t} accent={accent} opacity={0.35} />
      <div
        style={{
          position: "absolute",
          left: 132,
          top: 610,
          right: 132,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MonoLabel
          size={34}
          color={`${accent}BB`}
          style={{ marginBottom: 26, letterSpacing: 8 }}
        >
          {warm ? "TRÊN SERVER" : "BIẾN MÔI TRƯỜNG"}
        </MonoLabel>
        <Terminal
          cmds={[cmd]}
          width={816}
          fontSize={38}
          minHeight={warm ? 286 : 220}
          bg={warm ? "#130D09" : "#140B0B"}
          fg="#FFEDE1"
          accent={accent}
        />
      </div>
      <GlowDot x={540} y={880} r={420} color={accent} opacity={0.12} />
      <Sfx id="typing" at={16} frames={typingFrames([cmd])} volume={0.22} />
    </AbsoluteFill>
  );
};
