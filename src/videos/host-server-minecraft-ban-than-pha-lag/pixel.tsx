import type { CSSProperties } from "react";
import { AbsoluteFill } from "remotion";
import { display } from "../../kit";

// Pixel faces for the group chat: blocky, Minecraft-adjacent, and drawn here so
// they never carry a real person's or a brand's face.
export type AvatarKind = "admin" | "orange" | "blue" | "purple" | "pink";

const CAT_ROWS = [
  "..o....o..",
  ".ooo..ooo.",
  ".oooooooo.",
  ".owwoowwo.",
  ".owkoowko.",
  ".oooppoo..",
  ".oowwwwwo.",
  "..oooooo..",
  "..........",
  "..........",
];

const ADMIN_ROWS = [
  "bbbbbbbbbb",
  "bggggggggb",
  "bggwggwggb",
  "bggkggkggb",
  "bggggggggb",
  "bggggggggb",
  "bgggkkgggb",
  "bggggggggb",
  "bggggggggb",
  "bbbbbbbbbb",
];

type Face = { rows: string[]; colors: Record<string, string>; bg: string };

const CATS: Record<Exclude<AvatarKind, "admin">, Face> = {
  orange: {
    rows: CAT_ROWS,
    colors: { o: "#E89A4A", w: "#FFF6E8", k: "#2A1608", p: "#E5607A" },
    bg: "#2A1B12",
  },
  blue: {
    rows: CAT_ROWS,
    colors: { o: "#6BB6F2", w: "#F2FAFF", k: "#0B1D33", p: "#FF9FB8" },
    bg: "#12202B",
  },
  purple: {
    rows: CAT_ROWS,
    colors: { o: "#A88BE8", w: "#FAF5FF", k: "#241338", p: "#FF9FB8" },
    bg: "#1D1530",
  },
  pink: {
    rows: CAT_ROWS,
    colors: { o: "#F08BB0", w: "#FFF5F8", k: "#3A1020", p: "#FFF0F5" },
    bg: "#2B141C",
  },
};

const FACE_OF = (kind: AvatarKind): Face =>
  kind === "admin"
    ? {
        rows: ADMIN_ROWS,
        colors: { b: "#3F8F2F", g: "#7ED957", w: "#FFFFFF", k: "#153A12" },
        bg: "#10240D",
      }
    : CATS[kind];

export const PixelFace: React.FC<{ kind: AvatarKind; size: number; style?: CSSProperties }> = ({
  kind,
  size,
  style,
}) => {
  const face = FACE_OF(kind);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.24),
        background: face.bg,
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      <svg viewBox="0 0 10 10" width="100%" height="100%" shapeRendering="crispEdges">
        {face.rows.map((row, y) =>
          [...row].map((ch, x) =>
            ch === "." ? null : (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={1.02}
                height={1.02}
                fill={face.colors[ch] ?? "#000000"}
              />
            ),
          ),
        )}
      </svg>
    </div>
  );
};

// Four little faces in a 2x2 mosaic: how group chats show a room.
export const GroupAvatar: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.24),
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      flexShrink: 0,
    }}
  >
    {(["orange", "blue", "purple", "admin"] as AvatarKind[]).map((k) => (
      <PixelFace key={k} kind={k} size={size / 2} style={{ borderRadius: 0 }} />
    ))}
  </div>
);

export const Chevron: React.FC<{ size?: number; color?: string }> = ({ size = 38, color = "#F5EDE3" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 4 L7 12 L15 20" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SendArrow: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = "#0C1607" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 20V4M5 11l7-7 7 7" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// A block of TNT, drawn flat: the thing the friend duplicated on the server.
export const TntBlock: React.FC<{ size: number; style?: CSSProperties }> = ({ size, style }) => (
  <div style={{ width: size, height: size, position: "relative", ...style }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      <path
        d="M52 8 C 58 -2, 70 -6, 78 4"
        stroke="#C9B79A"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
    <div
      style={{
        position: "absolute",
        left: size * 0.72,
        top: -size * 0.055,
        width: size * 0.11,
        height: size * 0.11,
        backgroundColor: "#F3B33D",
        transform: "rotate(45deg)",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        marginTop: size * 0.04,
        background: "#C63A2F",
        borderRadius: size * 0.05,
        border: `${Math.max(3, size * 0.025)}px solid #7E241C`,
        boxShadow: `inset ${size * 0.05}px ${size * 0.05}px 0 rgba(255,255,255,0.16), inset -${size * 0.06}px -${size * 0.06}px 0 rgba(0,0,0,0.26)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "37%",
          height: "26%",
          background: "#EFE6D2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#7E241C",
          fontFamily: display,
          fontWeight: 800,
          fontSize: size * 0.2,
          letterSpacing: "0.01em",
          lineHeight: 1,
        }}
      >
        TNT
      </div>
    </div>
  </div>
);

// TNT confetti for the drop: deterministic blocks that burst once and fall.
const BURST = Array.from({ length: 34 }, (_, i) => {
  const a = (i / 34) * Math.PI * 2 + (i % 3) * 0.21;
  return {
    a,
    v: 5 + (i % 6) * 2.6,
    size: 10 + (i % 4) * 7,
    color: ["#E5484D", "#F3B33D", "#FF7A3D", "#F5EDE3"][i % 4],
  };
});

export const PixelBurst: React.FC<{ g: number; from: number; x?: number; y?: number }> = ({
  g,
  from,
  x = 700,
  y = 700,
}) => {
  if (g < from || g > from + 62) return null;
  const t = Math.min(1, (g - from) / 52);
  const e = 1 - Math.pow(1 - t, 2.2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {BURST.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x + Math.cos(p.a) * p.v * e * 13,
            top: y + Math.sin(p.a) * p.v * e * 13 + 320 * t * t,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: Math.max(0, 1 - t * 1.15),
            transform: `rotate(${(p.a * 180 * t) / Math.PI}deg)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
