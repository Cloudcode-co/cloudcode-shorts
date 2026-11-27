import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { FPS, SAFE, sans, videoAsset } from "../../kit";

export const SLUG = "solidcraft-rust-cad-mcp";

// Documentary serif: Source Serif 4, loaded with the Vietnamese subset so the
// lower thirds and the big numerals keep their diacritics.
export const serif = loadSerif("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;
export const serifItalic = loadSerif("italic", {
  weights: ["400"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

// Palette taken from the SolidCraft mark: a bright working blue against the
// deep navy of the isometric block, plus a cool paper white and storm grey.
export const C = {
  ink: "#070A0F",
  ink2: "#0B1119",
  navy: "#0A1626",
  slate: "#101720",
  paper: "#ECEDE9",
  dust: "#AAB1BA",
  steel: "#6F7B88",
  blue: "#3D82E8",
  blueDeep: "#123C86",
  line: "rgba(236,237,233,0.20)",
  lineSoft: "rgba(236,237,233,0.10)",
};

export const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// 0 → 1 over `dur` frames from `start`, strong ease-out.
export const ramp = (f: number, start: number, dur = 16) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

export const rise = (p: number, dy = 22): CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dy}px)`,
});

export const shadow: CSSProperties = {
  textShadow: "0 2px 28px rgba(0,0,0,0.72), 0 1px 3px rgba(0,0,0,0.9)",
};

// Text container inside TikTok's safe area. Coordinates inside are relative
// to the safe box (777 × 1190).
export const Safe: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      right: SAFE.right,
      top: SAFE.top,
      bottom: SAFE.bottom,
      fontFamily: sans,
      color: C.paper,
      ...style,
    }}
  >
    {children}
  </div>
);

// A full-frame stock clip, graded down and pushed in slowly. Children sit on
// top of the grade.
export const Footage: React.FC<{
  file: string;
  len: number;
  from?: number;
  seconds?: number;
  rate?: number;
  position?: string;
  push?: [number, number];
  brightness?: number;
  saturation?: number;
  children?: ReactNode;
}> = ({
  file,
  len,
  from = 0,
  seconds = 10,
  rate = 1,
  position = "center",
  push = [1.03, 1.1],
  brightness = 0.78,
  saturation = 0.62,
  children,
}) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, Math.max(1, len)], push, {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.ink }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo
          src={videoAsset(SLUG, file)}
          muted
          playbackRate={rate}
          trimBefore={Math.round(from * FPS)}
          durationInFrames={Math.round(seconds * FPS)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: position,
            filter: `saturate(${saturation}) contrast(1.1) brightness(${brightness})`,
          }}
        />
      </AbsoluteFill>
      {children}
    </AbsoluteFill>
  );
};

// Photographic grade: soft vignette and a dark top and foot so the serif
// captions and the lockup stay readable.
export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 76% 60% at 50% 40%, rgba(4,7,11,0) 42%, rgba(4,7,11,${
          0.42 * strength
        }) 78%, rgba(4,7,11,${0.82 * strength}) 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(4,7,11,${0.68 * strength}) 0%, rgba(4,7,11,${
          0.1 * strength
        }) 26%, rgba(4,7,11,0) 48%, rgba(4,7,11,${0.5 * strength}) 78%, rgba(4,7,11,${
          0.9 * strength
        }) 100%)`,
      }}
    />
  </AbsoluteFill>
);

// Small date / place stamp above a lower third, set in the sans face.
export const Stamp: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      fontFamily: sans,
      fontWeight: 700,
      fontSize: 34,
      letterSpacing: 2.4,
      color: C.dust,
      ...style,
    }}
  >
    <span
      style={{ width: 30, height: 2, backgroundColor: C.blue, display: "inline-block" }}
    />
    {children}
  </div>
);

export const Hairline: React.FC<{ style?: CSSProperties; color?: string }> = ({
  style,
  color = C.line,
}) => <div style={{ height: 1, backgroundColor: color, ...style }} />;

// The documentary lower third, in serif, above TikTok's caption.
export const LowerThird: React.FC<{
  headline: string;
  lines?: string[];
  at?: number;
  style?: CSSProperties;
}> = ({ headline, lines = [], at = 0, style }) => {
  const f = useCurrentFrame();
  const p = ramp(f, at, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 12,
        ...rise(p, 24),
        ...style,
      }}
    >
      <div
        style={{
          width: 66,
          height: 3,
          backgroundColor: C.blue,
          marginBottom: 18,
          opacity: ramp(f, at + 4, 14),
        }}
      />
      <div
        style={{
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 54,
          lineHeight: 1.06,
          letterSpacing: -0.4,
          color: C.paper,
          maxWidth: 720,
          textWrap: "balance",
          ...shadow,
        }}
      >
        {headline}
      </div>
      {lines.map((line, i) => (
        <div
          key={line}
          style={{
            fontFamily: serif,
            fontSize: 36,
            lineHeight: 1.38,
            color: C.dust,
            marginTop: 10 + i * 2,
            maxWidth: 700,
            opacity: ramp(f, at + 12 + i * 10, 16),
            ...shadow,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
