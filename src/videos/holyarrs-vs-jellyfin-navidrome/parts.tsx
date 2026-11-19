import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";
import { display, easeOut, enter, useIn, videoAsset } from "../../kit";
import { C, SL, SLUG, SW, clamp, land, serif } from "./palette";

// ---------------------------------------------------------------- ground ---

export const PaperGround: React.FC<{
  children?: ReactNode;
  style?: CSSProperties;
  dark?: boolean;
  fade?: number;
}> = ({ children, style, dark = false, fade = 1 }) => (
  <AbsoluteFill
    style={{
      backgroundColor: dark ? C.ink : C.paper,
      backgroundImage: dark
        ? "radial-gradient(rgba(255,255,255,0.11) 1.5px, transparent 1.6px)"
        : "radial-gradient(rgba(0,0,0,0.075) 1.5px, transparent 1.6px)",
      backgroundSize: "36px 36px",
      opacity: fade,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

// A scene layer that dissolves in over its shot's base colour, so a change of
// layout inside one long shot reads as a reframe rather than a cut.
export const SceneLayer: React.FC<{ children: ReactNode; style?: CSSProperties; dur?: number }> = ({
  children,
  style,
  dur = 7,
}) => {
  const p = useIn(0, dur);
  return <AbsoluteFill style={{ opacity: p, ...style }}>{children}</AbsoluteFill>;
};

export const CutFlash: React.FC<{ at?: number; color?: string; strength?: number; dur?: number }> = ({
  at = 0,
  color = "#FFFFFF",
  strength = 0.82,
  dur = 9,
}) => {
  const frame = useCurrentFrame();
  const p = frame < at ? 0 : interpolate(frame, [at, at + dur], [strength, 0], { ...clamp, easing: easeOut });
  return <AbsoluteFill style={{ backgroundColor: color, opacity: p, pointerEvents: "none" }} />;
};

// ------------------------------------------------------------------ type ---

export const AccentTitle: React.FC<{
  before: string;
  accent: string;
  after?: string;
  size: number;
  color?: string;
  accentColor?: string;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}> = ({ before, accent, after = "", size, color = C.ink, accentColor = C.coral, align = "center", style }) => (
  <div
    style={{
      fontFamily: display,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.02,
      color,
      textAlign: align,
      textWrap: "balance",
      ...style,
    }}
  >
    {before}{" "}
    <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 600, color: accentColor }}>{accent}</span>
    {after ? ` ${after}` : ""}
  </div>
);

export const PlainTitle: React.FC<{
  children: ReactNode;
  size: number;
  color?: string;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}> = ({ children, size, color = C.ink, align = "center", style }) => (
  <div
    style={{
      fontFamily: display,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.04,
      color,
      textAlign: align,
      textWrap: "balance",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ label: string; bg?: string; color?: string }> = ({
  label,
  bg = C.coral,
  color = C.white,
}) => (
  <div
    style={{
      display: "inline-block",
      background: bg,
      color,
      fontFamily: display,
      fontWeight: 700,
      fontSize: 38,
      padding: "7px 24px",
      borderRadius: 12,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </div>
);

export const LabelBox: React.FC<{ text: string; top: number; scale?: number; opacity?: number }> = ({
  text,
  top,
  scale = 1,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: SL,
      width: SW,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 12,
    }}
  >
    <div
      style={{
        transform: `translateY(-50%) scale(${scale})`,
        opacity,
        background: C.ink,
        color: C.white,
        fontFamily: display,
        fontWeight: 800,
        fontSize: 58,
        lineHeight: 1,
        padding: "0.2em 0.38em",
        borderRadius: 14,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  </div>
);

// -------------------------------------------------------------- captions ---

export type Phrase = { t: string; a?: string };

// One phrase at a time over the footage, paced by character count across the
// spoken line. It changes on the phrase boundary with a hard swap; each phrase
// enters over six frames.
export const LiveCaption: React.FC<{
  phrases: Phrase[];
  totalFrames: number;
  y?: number;
  size?: number;
}> = ({ phrases, totalFrames, y = 1180, size = 68 }) => {
  const frame = useCurrentFrame();
  const total = phrases.reduce((n, p) => n + p.t.length, 0);
  let at = 0;
  const starts = phrases.map((p) => {
    const s = at;
    at += Math.round((p.t.length / total) * totalFrames);
    return s;
  });
  let i = starts.length - 1;
  for (let k = 0; k < starts.length; k += 1) {
    if (frame >= starts[k]) i = k;
  }
  const p = interpolate(frame - starts[i], [0, 6], [0, 1], { ...clamp, easing: easeOut });
  const { t, a } = phrases[i];
  const parts = a ? t.split(a) : [t];
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: SL,
        width: SW,
        textAlign: "center",
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        color: C.white,
        textShadow: "0 4px 18px rgba(0,0,0,0.6)",
        opacity: p,
        transform: `translateY(-50%) scale(${0.92 + 0.08 * p})`,
        textWrap: "balance",
      }}
    >
      {parts[0]}
      {a ? <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 600 }}>{a}</span> : null}
      {parts[1] ?? ""}
    </div>
  );
};

// --------------------------------------------------------------- footage ---

export const FootageCard: React.FC<{
  file: string;
  x: number;
  y: number;
  w: number;
  h: number;
  objectPosition?: string;
  trimBefore?: number;
  rate?: number;
  radius?: number;
  dim?: number;
  scrim?: boolean;
  children?: ReactNode;
}> = ({
  file,
  x,
  y,
  w,
  h,
  objectPosition = "50% 30%",
  trimBefore = 0,
  rate = 1,
  radius = 54,
  dim = 0,
  scrim = false,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: radius,
      overflow: "hidden",
      boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
      background: C.ink2,
    }}
  >
    <OffthreadVideo
      src={videoAsset(SLUG, file)}
      muted
      trimBefore={trimBefore}
      playbackRate={rate}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition }}
    />
    {dim > 0 && <AbsoluteFill style={{ background: `rgba(8,6,5,${dim})` }} />}
    {scrim && (
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(8,6,5,0) 42%, rgba(8,6,5,0.58) 78%, rgba(8,6,5,0.7) 100%)",
        }}
      />
    )}
    {children}
  </div>
);

export const FullFootage: React.FC<{
  file: string;
  objectPosition?: string;
  dim?: number;
  rate?: number;
  trimBefore?: number;
  drift?: number;
  children?: ReactNode;
}> = ({ file, objectPosition = "50% 40%", dim = 0.35, rate = 1, trimBefore = 0, drift = 0.05, children }) => {
  const frame = useCurrentFrame();
  const scale = 1.02 + (frame / 1200) * drift;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ink }}>
      <OffthreadVideo
        src={videoAsset(SLUG, file)}
        muted
        trimBefore={trimBefore}
        playbackRate={rate}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill style={{ background: `rgba(8,6,5,${dim})` }} />
      {children}
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------- parts ---

export const RingStat: React.FC<{
  value: string;
  label: string;
  fill: number;
  start: number;
  size?: number;
  sub?: string;
}> = ({ value, label, fill, start, size = 300, sub }) => {
  const frame = useCurrentFrame();
  const R = size * 0.31;
  const L = 2 * Math.PI * R;
  const p = interpolate(frame, [start, start + 30], [0, fill], { ...clamp, easing: easeOut });
  return (
    <div style={{ width: size, height: size, borderRadius: 22, background: C.white, position: "relative" }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0 }}>
        <circle cx={size / 2} cy={size * 0.57} r={R} fill="none" stroke="#E6E0D6" strokeWidth={12} />
        <circle
          cx={size / 2}
          cy={size * 0.57}
          r={R}
          fill="none"
          stroke={C.coral}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - p)}
          transform={`rotate(-90 ${size / 2} ${size * 0.57})`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: size * 0.05,
          width: "100%",
          textAlign: "center",
          fontFamily: display,
          fontWeight: 600,
          fontSize: 34,
          lineHeight: 1.05,
          color: C.grey,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          top: size * 0.35,
          width: "100%",
          textAlign: "center",
          fontFamily: display,
          fontWeight: 800,
          fontSize: size * 0.28,
          color: C.ink,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      {sub ? (
        <div
          style={{
            position: "absolute",
            top: size * 0.74,
            width: "100%",
            textAlign: "center",
            fontFamily: display,
            fontWeight: 600,
            fontSize: 34,
            color: C.grey,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

export const BoxedLine: React.FC<{
  text: string;
  start: number;
  size?: number;
  bg?: string;
  color?: string;
  index?: number;
}> = ({ text, start, size = 68, bg = C.ink, color = C.white, index = 0 }) => {
  const p = useIn(start + index * 8, 14);
  return (
    <div
      style={{
        ...enter(p, 24),
        background: bg,
        color,
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.16,
        padding: "0.18em 0.4em",
        borderRadius: 14,
        textWrap: "balance",
        textAlign: "center",
        alignSelf: "center",
      }}
    >
      {text}
    </div>
  );
};

export const Avatar: React.FC<{ file: string; size: number; radius?: number; bg?: string }> = ({
  file,
  size,
  radius,
  bg = C.white,
}) => (
  <Img
    src={videoAsset(SLUG, file)}
    style={{
      width: size,
      height: size,
      borderRadius: radius ?? Math.round(size * 0.24),
      background: bg,
      objectFit: "contain",
      flexShrink: 0,
    }}
  />
);

export type SiIcon = { title: string; hex: string; path: string };

export const SiTile: React.FC<{ icon: SiIcon; size: number; bg?: string }> = ({ icon, size, bg = C.white }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.22),
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62}>
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  </div>
);

export const ArrowArc: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  start: number;
  dur?: number;
  color?: string;
  width?: number;
}> = ({ x1, y1, x2, y2, start, dur = 18, color = C.coral, width = 8 }) => {
  const frame = useCurrentFrame();
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.35;
  const p = interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: easeOut });
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - 82;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      <path
        d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
        opacity={p > 0 ? 1 : 0}
      />
      <path
        d={`M ${x2 - 19} ${y2 - 17} L ${x2} ${y2} L ${x2 - 23} ${y2 + 9}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={p > 0.93 ? Math.min(1, (p - 0.93) * 14) : 0}
      />
    </svg>
  );
};

export const Counter: React.FC<{
  value: number;
  start: number;
  y: number;
  size?: number;
  color?: string;
  decimals?: number;
  label?: string;
  unit?: string;
  group?: boolean;
}> = ({ value, start, y, size = 130, color = C.white, decimals = 0, label, unit, group = true }) => {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [start, start + 40], [0, value], { ...clamp, easing: easeOut });
  const text =
    decimals > 0
      ? n.toFixed(decimals)
      : group
        ? Math.round(n).toLocaleString("en-US")
        : `${Math.round(n)}`;
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: SL,
        width: SW,
        textAlign: "center",
        opacity: frame < start ? 0 : 1,
      }}
    >
      {label ? (
        <div
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.02em",
            color: C.warmGrey,
            marginBottom: 2,
          }}
        >
          {label}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1,
          color,
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 6px 24px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
        }}
      >
        {text}
        {unit ? (
          <span style={{ fontSize: size * 0.42, fontWeight: 700, marginLeft: 10, color: C.warmGrey }}>{unit}</span>
        ) : null}
      </div>
    </div>
  );
};

export const ProfileCard: React.FC<{
  avatar: string;
  name: string;
  sub: string;
  subColor?: string;
  pill: string;
  pillBg?: string;
  start: number;
  y: number;
  width?: number;
  x?: number;
}> = ({ avatar, name, sub, subColor = C.greenBright, pill, pillBg = C.blue, start, y, width = 660, x = 140 }) => {
  const p = useIn(start, 14);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        width,
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "22px 26px",
        borderRadius: 28,
        background: "#15151A",
        border: "2px solid rgba(255,255,255,0.12)",
        boxSizing: "border-box",
        ...enter(p, 26),
      }}
    >
      <Avatar file={avatar} size={92} radius={46} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: C.white, lineHeight: 1.1 }}>
          {name}
        </div>
        <div style={{ fontFamily: display, fontWeight: 600, fontSize: 34, color: subColor, marginTop: 3 }}>
          {sub}
        </div>
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 34,
          color: C.white,
          padding: "10px 22px",
          borderRadius: 999,
          background: pillBg,
          whiteSpace: "nowrap",
        }}
      >
        {pill}
      </div>
    </div>
  );
};

// -------------------------------------------------------------- tier list ---

export type TierItem = {
  tier: string;
  name: string;
  avatar?: string;
  icon?: SiIcon;
  start: number;
  wide?: boolean;
};

const TIERS: { tier: string; color: string }[] = [
  { tier: "S", color: "#FF5C6C" },
  { tier: "A", color: "#FF9F43" },
  { tier: "B", color: "#FFD43B" },
  { tier: "C", color: "#A3E635" },
  { tier: "D", color: "#38BDF8" },
  { tier: "E", color: "#818CF8" },
  { tier: "F", color: "#E879F9" },
];

export const TierBoard: React.FC<{ items: TierItem[]; y: number }> = ({ items, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ROW = 68;
  return (
    <div style={{ position: "absolute", top: y, left: SL, width: SW }}>
      {TIERS.map(({ tier, color }) => {
        const inRow = items.filter((it) => it.tier === tier);
        return (
          <div
            key={tier}
            style={{
              display: "flex",
              boxSizing: "border-box",
              height: ROW,
              background: "rgba(17,17,20,0.9)",
              borderBottom: "2px solid rgba(0,0,0,0.75)",
            }}
          >
            <div
              style={{
                width: ROW,
                background: color,
                color: "#111114",
                fontFamily: display,
                fontWeight: 800,
                fontSize: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {tier}
            </div>
            <div style={{ display: "flex", gap: 9, padding: "5px 9px", alignItems: "center", overflow: "hidden" }}>
              {inRow.map((it) => {
                const s = land(frame, it.start, fps);
                return (
                  <div
                    key={it.name}
                    style={{
                      height: ROW - 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "0 13px",
                      background: "#0F1C3F",
                      border: "3px solid #FFFFFF",
                      borderRadius: 10,
                      opacity: frame < it.start ? 0 : Math.min(1, s * 1.6),
                      transform: `translateY(${(1 - s) * -210}px)`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {it.avatar ? (
                      <Avatar file={it.avatar} size={38} radius={8} />
                    ) : it.icon ? (
                      <SiTile icon={it.icon} size={38} bg="#FFFFFF" />
                    ) : null}
                    <span
                      style={{
                        fontFamily: display,
                        fontWeight: 800,
                        fontSize: 34,
                        letterSpacing: "-0.01em",
                        color: C.yellow,
                      }}
                    >
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
