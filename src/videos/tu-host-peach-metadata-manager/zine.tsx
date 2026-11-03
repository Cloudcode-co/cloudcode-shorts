import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SAFE, display, mono, sans } from "../../kit";

// ---------------------------------------------------------------------------
// Design Tokens: Photocopied Zine
// ---------------------------------------------------------------------------
export const SPOT = "#FF4A4A"; // Vibrant Peach coral/red from avatar
export const SPOT_LIGHT = "#FFEBEB";
export const INK_BLACK = "#101010"; // Dense xerox toner black
export const INK_MUTED = "#555555"; // Halftone midtone toner
export const PAPER_WHITE = "#F5F4F0"; // Xerox paper stock
export const PAPER_CARD = "#FFFFFF"; // Fresh paper cut-out clipping
export const DARK_COVER = "#131313"; // Heavy toner dark page

export const EASE_SLAM = Easing.bezier(0.12, 0.9, 0.2, 1);
export const EASE_SNAP = Easing.bezier(0.23, 1, 0.32, 1);

// Helper for slam animation: 0 -> 1 over `dur` frames
export const useSlam = (delay = 0, dur = 8) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SLAM,
  });
};

// ---------------------------------------------------------------------------
// Halftone Dot Pattern Component
// ---------------------------------------------------------------------------
export const HalftoneScreen: React.FC<{
  color?: string;
  size?: number;
  dotRadius?: number;
  opacity?: number;
  style?: CSSProperties;
}> = ({ color = INK_BLACK, size = 16, dotRadius = 2.4, opacity = 0.12, style }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `radial-gradient(circle, ${color} ${dotRadius}px, transparent ${dotRadius}px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
      pointerEvents: "none",
      ...style,
    }}
  />
);

// ---------------------------------------------------------------------------
// Xerox Texture & Print Registration Marks
// ---------------------------------------------------------------------------
export const XeroxOverlay: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {/* Vertical toner streak lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: dark
            ? "repeating-linear-gradient(90deg, transparent, transparent 180px, rgba(255,255,255,0.02) 180px, rgba(255,255,255,0.02) 182px)"
            : "repeating-linear-gradient(90deg, transparent, transparent 180px, rgba(0,0,0,0.02) 180px, rgba(0,0,0,0.02) 182px)",
          opacity: 0.8,
        }}
      />
      {/* Fine xerox dither texture */}
      <HalftoneScreen
        color={dark ? "#FFFFFF" : "#000000"}
        size={14}
        dotRadius={1.2}
        opacity={dark ? 0.08 : 0.06}
      />
      {/* Top and bottom edge photocopy burn */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 12,
          background: dark
            ? "linear-gradient(180deg, rgba(255,255,255,0.08), transparent)"
            : "linear-gradient(180deg, rgba(0,0,0,0.08), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 14,
          background: dark
            ? "linear-gradient(0deg, rgba(255,255,255,0.1), transparent)"
            : "linear-gradient(0deg, rgba(0,0,0,0.1), transparent)",
        }}
      />

      {/* Registration Marks / Crosshairs at page corners */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 36,
          fontFamily: mono,
          fontSize: 18,
          color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
          fontWeight: 700,
        }}
      >
        + 1080x1920 [ZINE_PRINT]
      </div>
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 36,
          fontFamily: mono,
          fontSize: 16,
          color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
          letterSpacing: 2,
        }}
      >
        REG: 60FPS // VOL.01
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          fontFamily: mono,
          fontSize: 15,
          color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
        }}
      >
        ┌─ PEACH.METADATA.MANAGER ─┐
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Physical Staples at Top Left
// ---------------------------------------------------------------------------
export const Staples: React.FC = () => (
  <div style={{ position: "absolute", top: 40, left: 24, zIndex: 10, pointerEvents: "none" }}>
    <div
      style={{
        width: 14,
        height: 64,
        background: "#222222",
        border: "2px solid #555555",
        boxShadow: "2px 3px 0px rgba(0,0,0,0.4)",
        transform: "rotate(-25deg)",
        marginBottom: 20,
      }}
    />
    <div
      style={{
        width: 14,
        height: 64,
        background: "#222222",
        border: "2px solid #555555",
        boxShadow: "2px 3px 0px rgba(0,0,0,0.4)",
        transform: "rotate(-25deg)",
      }}
    />
  </div>
);

// ---------------------------------------------------------------------------
// Tape Strip
// ---------------------------------------------------------------------------
export const Tape: React.FC<{
  width?: number;
  height?: number;
  rotate?: number;
  style?: CSSProperties;
  color?: "cream" | "black" | "spot";
}> = ({ width = 110, height = 34, rotate = -8, style, color = "cream" }) => {
  const bg =
    color === "black"
      ? "rgba(20,20,20,0.88)"
      : color === "spot"
        ? "rgba(255,74,74,0.85)"
        : "rgba(235, 230, 215, 0.75)";
  const border =
    color === "black"
      ? "1px dashed rgba(255,255,255,0.3)"
      : "1px dashed rgba(0,0,0,0.2)";

  return (
    <div
      style={{
        width,
        height,
        background: bg,
        border,
        boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
        transform: `rotate(${rotate}deg)`,
        zIndex: 5,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Rubber Stamp Component (Torn / Gritty Border)
// ---------------------------------------------------------------------------
export const Stamp: React.FC<{
  text: string;
  rotate?: number;
  color?: string;
  size?: number;
  subtext?: string;
  style?: CSSProperties;
}> = ({ text, rotate = -6, color = SPOT, size = 32, subtext, style }) => (
  <div
    style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: `4px dashed ${color}`,
      padding: "8px 24px",
      transform: `rotate(${rotate}deg)`,
      color,
      fontFamily: mono,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      boxShadow: `0 0 0 3px ${color} inset`,
      ...style,
    }}
  >
    <div style={{ fontSize: size, lineHeight: 1.1 }}>{text}</div>
    {subtext && (
      <div style={{ fontSize: Math.round(size * 0.5), letterSpacing: "0.14em", marginTop: 4 }}>
        {subtext}
      </div>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Cutout Paper Card (Collage Scrap with Rough Paper Border and Hard Drop Shadow)
// ---------------------------------------------------------------------------
export const CutoutCard: React.FC<{
  children: ReactNode;
  bg?: string;
  rotate?: number;
  borderWidth?: number;
  shadowDist?: number;
  padding?: string | number;
  style?: CSSProperties;
}> = ({
  children,
  bg = PAPER_CARD,
  rotate = 0,
  borderWidth = 4,
  shadowDist = 8,
  padding = "24px 28px",
  style,
}) => (
  <div
    style={{
      background: bg,
      border: `${borderWidth}px solid ${INK_BLACK}`,
      boxShadow: `${shadowDist}px ${shadowDist}px 0px ${INK_BLACK}`,
      transform: `rotate(${rotate}deg)`,
      padding,
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Huge Tight Headline Component (Zine Typography)
// ---------------------------------------------------------------------------
export const ZineHeadline: React.FC<{
  children: ReactNode;
  rotate?: number;
  color?: string;
  size?: number;
  dark?: boolean;
  style?: CSSProperties;
}> = ({
  children,
  rotate = -2,
  color,
  size = 78,
  dark = false,
  style,
}) => {
  const textColor = color ?? (dark ? "#FFFFFF" : INK_BLACK);
  return (
    <h1
      style={{
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.95,
        letterSpacing: "-0.04em",
        color: textColor,
        textTransform: "uppercase",
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "left center",
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {children}
    </h1>
  );
};

// ---------------------------------------------------------------------------
// Page Slam Wrapper (Slams in like a page slapped onto a desk)
// ---------------------------------------------------------------------------
export const PageSlam: React.FC<{
  children: ReactNode;
  dark?: boolean;
  baseRotate?: number;
  delay?: number;
}> = ({ children, dark = false, baseRotate = 0, delay = 0 }) => {
  const frame = useCurrentFrame();
  const slam = interpolate(frame, [delay, delay + 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SLAM,
  });

  const scale = interpolate(slam, [0, 1], [1.08, 1.0]);
  const translateY = interpolate(slam, [0, 1], [-30, 0]);
  const rotate = interpolate(slam, [0, 1], [baseRotate - 2.5, baseRotate]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark ? DARK_COVER : PAPER_WHITE,
        overflow: "hidden",
        transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
        transformOrigin: "center center",
      }}
    >
      <XeroxOverlay dark={dark} />
      {!dark && <Staples />}
      <AbsoluteFill
        style={{
          fontFamily: sans,
          paddingTop: SAFE.top + 20,
          paddingBottom: SAFE.bottom,
          paddingLeft: SAFE.left,
          paddingRight: SAFE.right,
          color: dark ? "#FFFFFF" : INK_BLACK,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Slapped Element (Individual paper clipping slamming down on the page)
// ---------------------------------------------------------------------------
export const SlamItem: React.FC<{
  children: ReactNode;
  delay: number;
  rotate?: number;
  dur?: number;
  style?: CSSProperties;
}> = ({ children, delay, rotate = 0, dur = 7, style }) => {
  const frame = useCurrentFrame();

  if (frame < delay) {
    return (
      <div
        style={{
          visibility: "hidden",
          opacity: 0,
          pointerEvents: "none",
          ...style,
        }}
      >
        {children}
      </div>
    );
  }

  const p = interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_SLAM,
  });

  const scale = interpolate(p, [0, 1], [1.2, 1.0]);
  const currentRotate = interpolate(p, [0, 1], [rotate + 4, rotate]);
  const opacity = interpolate(p, [0, 0.4, 1], [0, 0.95, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) rotate(${currentRotate}deg)`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
