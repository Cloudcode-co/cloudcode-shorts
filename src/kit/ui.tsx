import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SAFE, SIDE_CROP, sans } from "./theme";

// One flat shot whose content sits inside TikTok's safe area. No push-in:
// scaling would drift card edges under TikTok's right-hand buttons.
export const Shot: React.FC<{
  bg: string;
  len: number;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ bg, children, style }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          fontFamily: sans,
          padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
          ...style,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const zone: CSSProperties = {
  position: "absolute",
  background: "rgba(255, 0, 90, 0.28)",
  border: "3px dashed rgba(255, 0, 90, 0.9)",
  color: "white",
  fontFamily: sans,
  fontWeight: 700,
};

// What a tall phone crops off each side: anything here is never seen.
const crop: CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  width: SIDE_CROP,
  background: "rgba(0, 0, 0, 0.85)",
  borderRight: "3px dashed rgba(255, 0, 90, 0.9)",
};

// Preview-only mock of TikTok's overlay, toggled with the `guide` prop:
// the tabs or search bar on top, the buttons on the right, the caption at the
// bottom, and the strips a tall phone crops off the sides.
export const TikTokGuide: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ ...crop, left: 0 }} />
    <div style={{ ...crop, right: 0, borderRight: "none", borderLeft: crop.borderRight }} />
    <div
      style={{
        ...zone,
        top: 0,
        left: 0,
        right: 0,
        height: 230,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingBottom: 40,
        gap: 50,
        fontSize: 40,
      }}
    >
      <span>Following</span>
      <span>For You</span>
    </div>
    <div
      style={{
        ...zone,
        top: 820,
        right: 0,
        width: SAFE.right,
        bottom: SAFE.bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      {["follow", "like", "comment", "save", "share"].map((k) => (
        <div
          key={k}
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            background: "rgba(255,255,255,0.6)",
          }}
        />
      ))}
    </div>
    <div
      style={{
        ...zone,
        bottom: 0,
        left: 0,
        right: 0,
        height: SAFE.bottom,
        padding: `40px ${SAFE.left}px`,
        fontSize: 38,
        lineHeight: 1.5,
      }}
    >
      @cloudcode
      <br />
      caption, hashtags…
      <br />♫ original sound
    </div>
  </AbsoluteFill>
);

export type BrandIcon = { title: string; hex: string; path: string };

// Row of brand logos (simple-icons) on white chips, popping in one after another.
export const BrandIcons: React.FC<{ icons: BrandIcon[]; delay: number; size?: number }> = ({
  icons,
  delay,
  size = 84,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
      {icons.map((icon, i) => {
        const p = interpolate(frame, [delay + i * 5, delay + i * 5 + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.23, 1, 0.32, 1),
        });
        return (
          <div
            key={icon.title}
            title={icon.title}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: p,
              transform: `scale(${0.85 + p * 0.15})`,
            }}
          >
            <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56}>
              <path d={icon.path} fill={`#${icon.hex}`} />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
