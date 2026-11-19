// Reference parts for the creator-layouts skill. Copy what you need into
// src/videos/<slug>/ and adapt it; the import paths assume that folder.
// Everything is driven by the frame: no CSS transitions, keyframes or timers.
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { display, easeOut, enter, useIn } from "../../kit";

const serif = loadSerif("italic", { weights: ["600"], subsets: ["latin", "vietnamese"] }).fontFamily;

export const C = {
  paper: "#F2EEE7",
  ink: "#16130F",
  coral: "#C8584A",
  green: "#3DDC84",
  blue: "#1D9BF0",
  yellow: "#FFD43B",
};

const land = (frame: number, start: number, fps: number) =>
  spring({ frame: frame - start, fps, config: { damping: 14, stiffness: 170, mass: 0.9 } });

// Paper ground with the dot grid that the style requires.
export const Paper: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill
    style={{
      backgroundColor: C.paper,
      backgroundImage: "radial-gradient(rgba(0,0,0,0.07) 1.5px, transparent 1.6px)",
      backgroundSize: "36px 36px",
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

// "Chép cái đã <i>chạy</i>": heavy sans with one serif italic word.
export const AccentTitle: React.FC<{
  before: string;
  accent: string;
  after?: string;
  size: number;
  color?: string;
  accentColor?: string;
}> = ({ before, accent, after = "", size, color = C.ink, accentColor = C.coral }) => (
  <div style={{ fontFamily: display, fontWeight: 800, fontSize: size, color, lineHeight: 1.05, textAlign: "center" }}>
    {before}{" "}
    <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 600, color: accentColor }}>{accent}</span>
    {after ? ` ${after}` : ""}
  </div>
);

// One phrase at a time over footage. `phrases` come from the voice line;
// start frames are paced by character count across the clip.
export const LiveCaption: React.FC<{
  phrases: { text: string; accent?: string }[];
  totalFrames: number;
  y?: number;
}> = ({ phrases, totalFrames, y = 1180 }) => {
  const frame = useCurrentFrame();
  const total = phrases.reduce((n, p) => n + p.text.length, 0);
  let start = 0;
  const starts = phrases.map((p) => {
    const s = start;
    start += Math.round((p.text.length / total) * totalFrames);
    return s;
  });
  let i = starts.findIndex((s, k) => frame >= s && (k === starts.length - 1 || frame < starts[k + 1]));
  if (i < 0) i = 0;
  const p = interpolate(frame - starts[i], [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const { text, accent } = phrases[i];
  const parts = accent ? text.split(accent) : [text];
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: display,
        fontWeight: 800,
        fontSize: 68,
        color: "#fff",
        textShadow: "0 4px 18px rgba(0,0,0,0.55)",
        opacity: p,
        transform: `translateY(-50%) scale(${0.92 + 0.08 * p})`,
      }}
    >
      {parts[0]}
      {accent ? <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 600 }}>{accent}</span> : null}
      {parts[1] ?? ""}
    </div>
  );
};

// A person clip in a rounded card. Pick objectPosition so the face sits in the top third.
export const FootageCard: React.FC<{
  file: string;
  x: number;
  y: number;
  w: number;
  h: number;
  objectPosition?: string;
  trimBefore?: number;
}> = ({ file, x, y, w, h, objectPosition = "50% 30%", trimBefore = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 54,
      overflow: "hidden",
      boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
    }}
  >
    <OffthreadVideo
      src={staticFile(file)}
      muted
      trimBefore={trimBefore}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition }}
    />
  </div>
);

// Layout 1: split-screen. Paper panel on top, footage below, label box on the seam.
export const SplitScreen: React.FC<{
  step: string;
  title: { before: string; accent: string; after?: string };
  label: string;
  footage: string;
  children: React.ReactNode; // the screenshot or card for y 470–900
}> = ({ step, title, label, footage, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pIn = useIn(0, 14);
  const pop = land(frame, 22, fps);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div style={{ position: "absolute", top: 960, left: 0, width: 1080, height: 960 }}>
        <OffthreadVideo src={staticFile(footage)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%" }} />
      </div>
      <Paper style={{ height: 960 }}>
        <div style={{ position: "absolute", top: 300, width: "100%", display: "flex", justifyContent: "center", ...enter(pIn) }}>
          <div style={{ background: C.coral, color: "#fff", fontFamily: display, fontWeight: 600, fontSize: 38, padding: "6px 22px", borderRadius: 12 }}>
            ✱ {step}
          </div>
        </div>
        <div style={{ position: "absolute", top: 360, width: "100%", ...enter(useIn(4, 14)) }}>
          <AccentTitle {...title} size={84} />
        </div>
        <div style={{ position: "absolute", top: 470, left: 120, right: 200, height: 430, ...enter(useIn(10, 14)) }}>{children}</div>
      </Paper>
      <div style={{ position: "absolute", top: 960, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `translateY(-50%) scale(${0.8 + 0.2 * pop})`,
            opacity: Math.min(1, pop * 2),
            background: C.ink,
            color: "#fff",
            fontFamily: display,
            fontWeight: 800,
            fontSize: 62,
            textTransform: "uppercase",
            padding: "0.18em 0.4em",
            borderRadius: 14,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Layout 2 helper: a coral arc that draws from (x1,y1) to (x2,y2) starting at `start`.
export const DrawnArrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; start: number }> = ({ x1, y1, x2, y2, start }) => {
  const frame = useCurrentFrame();
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.25;
  const p = interpolate(frame, [start, start + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - 70;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path
        d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
        fill="none"
        stroke={C.coral}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
    </svg>
  );
};

// Layout 3 parts: a counter that ticks to a real number and the profile card under it.
export const Counter: React.FC<{ value: number; start: number; y?: number }> = ({ value, start, y = 1050 }) => {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [start, start + 40], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        width: "100%",
        textAlign: "center",
        fontFamily: display,
        fontWeight: 800,
        fontSize: 130,
        color: "#fff",
        fontVariantNumeric: "tabular-nums",
        textShadow: "0 6px 24px rgba(0,0,0,0.5)",
      }}
    >
      {Math.round(n).toLocaleString("en-US")}
    </div>
  );
};

export const ProfileCard: React.FC<{ avatar: string; name: string; gain: number; start: number; y?: number }> = ({
  avatar,
  name,
  gain,
  start,
  y = 1230,
}) => {
  const frame = useCurrentFrame();
  const p = useIn(start, 14);
  const followed = frame >= start + 40;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 160,
        width: 660,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "22px 28px",
        borderRadius: 28,
        background: "#15151A",
        ...enter(p),
      }}
    >
      <Img src={staticFile(avatar)} style={{ width: 96, height: 96, borderRadius: 48 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: "#fff" }}>{name}</div>
        <div style={{ fontFamily: display, fontWeight: 600, fontSize: 32, color: "rgba(255,255,255,0.7)" }}>
          <span style={{ color: C.green }}>+{gain.toLocaleString("en-US")}</span> sao
        </div>
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 34,
          color: "#fff",
          padding: "10px 24px",
          borderRadius: 999,
          background: followed ? "#2A2A31" : C.blue,
        }}
      >
        {followed ? "Đang theo dõi" : "Theo dõi"}
      </div>
    </div>
  );
};

// Layout 5: the tier board. `items` say which tier each item lands in and when.
const TIERS = [
  ["S", "#FF5C6C"],
  ["A", "#FF9F43"],
  ["B", "#FFD43B"],
  ["C", "#A3E635"],
  ["D", "#38BDF8"],
  ["E", "#818CF8"],
  ["F", "#E879F9"],
] as const;

export const TierBoard: React.FC<{
  items: { tier: (typeof TIERS)[number][0]; name: string; image?: string; start: number }[];
  y?: number;
}> = ({ items, y = 1000 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ROW = 70;
  return (
    <div style={{ position: "absolute", top: y, left: 100, width: 880 }}>
      {TIERS.map(([t, col]) => {
        const inRow = items.filter((it) => it.tier === t);
        return (
          <div key={t} style={{ display: "flex", height: ROW, background: "rgba(17,17,20,0.85)", borderBottom: "2px solid #000" }}>
            <div
              style={{
                width: 70,
                background: col,
                color: "#111",
                fontFamily: display,
                fontWeight: 800,
                fontSize: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t}
            </div>
            <div style={{ display: "flex", gap: 10, padding: "6px 10px" }}>
              {inRow.map((it) => {
                const s = land(frame, it.start, fps);
                return (
                  <div
                    key={it.name}
                    style={{
                      height: ROW - 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "0 14px",
                      background: "#0F1C3F",
                      border: "3px solid #fff",
                      borderRadius: 10,
                      opacity: frame < it.start ? 0 : 1,
                      transform: `translateY(${(1 - s) * -200}px)`,
                    }}
                  >
                    {it.image ? <Img src={staticFile(it.image)} style={{ height: ROW - 26, borderRadius: 6 }} /> : null}
                    <span style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: C.yellow, textTransform: "uppercase" }}>
                      {it.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Layout 5 title: skewed caps with an orange gradient fill.
export const RankTitle: React.FC<{ text: string; y?: number }> = ({ text, y = 300 }) => {
  const p = useIn(0, 14);
  return (
    <div style={{ position: "absolute", top: y, width: "100%", textAlign: "center", ...enter(p) }}>
      <span
        style={{
          display: "inline-block",
          transform: "skewX(-8deg)",
          fontFamily: display,
          fontWeight: 800,
          fontSize: 104,
          lineHeight: 1,
          textTransform: "uppercase",
          backgroundImage: "linear-gradient(180deg, #FF8A1F, #FFB547)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextStroke: "6px rgba(0,0,0,0.35)",
          paintOrder: "stroke fill",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Layout 4 part: an SVG ring stat inside a white card.
export const RingStat: React.FC<{ value: string; label: string; fill: number; start: number }> = ({ value, label, fill, start }) => {
  const frame = useCurrentFrame();
  const R = 100;
  const L = 2 * Math.PI * R;
  const p = interpolate(frame, [start, start + 30], [0, fill], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <div style={{ width: 300, height: 300, borderRadius: 24, background: "#fff", position: "relative" }}>
      <svg width={300} height={300} style={{ position: "absolute", inset: 0 }}>
        <circle cx={150} cy={160} r={R} fill="none" stroke="#EEE" strokeWidth={14} />
        <circle
          cx={150}
          cy={160}
          r={R}
          fill="none"
          stroke={C.coral}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - p)}
          transform="rotate(-90 150 160)"
        />
      </svg>
      <div style={{ position: "absolute", top: 18, width: "100%", textAlign: "center", fontFamily: display, fontWeight: 600, fontSize: 34, color: "#888" }}>
        {label}
      </div>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: display, fontWeight: 800, fontSize: 72, color: C.ink }}>
        {value}
      </div>
    </div>
  );
};

// Layout 4 part: title lines, each in its own whole-line box.
export const BoxedLines: React.FC<{ lines: string[]; sub?: string; y: number; start: number }> = ({ lines, sub, y, start }) => {
  const frame = useCurrentFrame();
  const at = (d: number) => interpolate(frame, [d, d + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
  <div style={{ position: "absolute", top: y, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    {lines.map((l, i) => (
      <div
        key={l}
        style={{
          ...enter(at(start + i * 8)),
          background: C.ink,
          color: "#fff",
          fontFamily: display,
          fontWeight: 800,
          fontSize: 72,
          padding: "0.18em 0.4em",
          borderRadius: 14,
        }}
      >
        {l}
      </div>
    ))}
    {sub ? (
      <div
        style={{
          ...enter(at(start + lines.length * 8)),
          background: "#fff",
          color: C.ink,
          fontFamily: display,
          fontWeight: 600,
          fontSize: 44,
          padding: "0.18em 0.4em",
          borderRadius: 14,
        }}
      >
        {sub}
      </div>
    ) : null}
  </div>
);
};
