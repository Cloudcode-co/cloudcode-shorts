import React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { OffthreadVideo } from "remotion";
import {
  PALETTE,
  SAFE,
  easeOut,
  mono,
  sans,
  serifCaption,
  serifDisplay,
} from "../theme";

// Soft dark documentary vignette
export const Vignette: React.FC<{
  tint?: string;
  intensity?: number;
}> = ({ tint = "rgba(0, 0, 0, 0.95)", intensity = 1 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 25%, rgba(0,0,0,${0.5 * intensity}) 65%, ${tint} 100%)`,
    }}
  />
);

// Stock footage full frame with slow push-in, desaturated grading, and soft vignette
export const FootageShot: React.FC<{
  file: string;
  len: number;
  objectPosition?: string;
  startScale?: number;
  endScale?: number;
  filter?: string;
  vignetteTint?: string;
}> = ({
  file,
  len,
  objectPosition = "center",
  startScale = 1.02,
  endScale = 1.1,
  filter = "saturate(0.65) contrast(1.15) brightness(0.82)",
  vignetteTint,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, len], [startScale, endScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000000" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo
          src={staticFile(`videos/canvas-fingerprinting-anti-llm/${file}`)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            filter,
          }}
        />
      </div>
      <Vignette tint={vignetteTint} />
    </AbsoluteFill>
  );
};

// Date and Place Stamp (small documentary stamp when story gives one)
export const DatePlaceStamp: React.FC<{
  date?: string;
  place?: string;
  top?: number;
  right?: number;
}> = ({
  date = "28.10.2026",
  place = "nullpt.rs",
  top = SAFE.top,
  right = SAFE.right,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      right,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 16px",
      borderRadius: 8,
      backgroundColor: "rgba(8, 9, 12, 0.85)",
      border: `1px solid ${PALETTE.amberBorder}`,
      fontFamily: mono,
      fontSize: 34,
      fontWeight: 600,
      color: PALETTE.amber,
      letterSpacing: 0.5,
    }}
  >
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: PALETTE.amber,
      }}
    />
    <span>
      {date} • {place}
    </span>
  </div>
);

// Lower-Third Caption in a Serif
export const LowerThird: React.FC<{
  text: string;
  kicker?: string;
  delay?: number;
}> = ({ text, kicker, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: SAFE.right,
        bottom: SAFE.bottom + 8,
        padding: "20px 24px",
        borderRadius: 14,
        backgroundColor: "rgba(10, 13, 18, 0.92)",
        borderLeft: `5px solid ${PALETTE.amber}`,
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 16px 36px rgba(0, 0, 0, 0.6)",
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontFamily: mono,
            fontSize: 34,
            fontWeight: 700,
            color: PALETTE.amber,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: serifCaption,
          fontSize: 40,
          fontWeight: 600,
          lineHeight: 1.35,
          color: PALETTE.textPrimary,
          textWrap: "balance",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Chapter Title Card before each section
export const ChapterCard: React.FC<{
  chapter: string;
  title: string;
  subtitle?: string;
  tag?: string;
}> = ({ chapter, title, subtitle, tag = "HỒ SƠ BẢO MẬT" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.bgDark,
        padding: `${SAFE.top + 20}px ${SAFE.right}px ${SAFE.bottom + 20}px ${SAFE.left}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          opacity: p,
          transform: `translateY(${(1 - p) * 16}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Chapter Header Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            fontFamily: mono,
            fontSize: 34,
            fontWeight: 700,
            color: PALETTE.amber,
            letterSpacing: 2,
            marginBottom: 28,
            padding: "8px 20px",
            borderRadius: 8,
            backgroundColor: "rgba(229, 169, 60, 0.12)",
            border: `1px solid ${PALETTE.amberBorder}`,
          }}
        >
          <span>{tag}</span>
          <span>•</span>
          <span>{chapter}</span>
        </div>

        {/* Big Chapter Title */}
        <div
          style={{
            fontFamily: serifDisplay,
            fontSize: 66,
            fontWeight: 700,
            color: PALETTE.textPrimary,
            lineHeight: 1.25,
            textWrap: "balance",
            marginBottom: 24,
            maxWidth: 720,
          }}
        >
          {title}
        </div>

        <div
          style={{
            width: 140,
            height: 4,
            backgroundColor: PALETTE.amber,
            marginBottom: 28,
            borderRadius: 2,
          }}
        />

        {subtitle ? (
          <div
            style={{
              fontFamily: sans,
              fontSize: 38,
              fontWeight: 500,
              color: PALETTE.textMuted,
              lineHeight: 1.45,
              textWrap: "balance",
              maxWidth: 680,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Key Numbers set huge on black between scenes
export const KeyNumberCard: React.FC<{
  number: string;
  label: string;
  context?: string;
  len?: number;
}> = ({ number, label, context, len = 75 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const scale = interpolate(frame, [0, len], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.black,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        padding: `${SAFE.top + 40}px ${SAFE.right}px ${SAFE.bottom + 40}px ${SAFE.left}px`,
        overflow: "hidden",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          opacity: p,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: mono,
          fontSize: 34,
          fontWeight: 700,
          color: PALETTE.amber,
          letterSpacing: 2,
          textTransform: "uppercase",
          padding: "6px 18px",
          borderRadius: 6,
          backgroundColor: "rgba(229, 169, 60, 0.12)",
          border: `1px solid ${PALETTE.amberBorder}`,
        }}
      >
        <span>THỐNG KÊ TRỌNG TÂM</span>
      </div>

      {/* Center Huge Number */}
      <div
        style={{
          opacity: p,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: serifDisplay,
            fontSize: 160,
            fontWeight: 800,
            color: PALETTE.textPrimary,
            lineHeight: 1,
            letterSpacing: -2,
            marginBottom: 24,
          }}
        >
          {number}
        </div>

        <div
          style={{
            width: 100,
            height: 4,
            backgroundColor: PALETTE.amber,
            borderRadius: 2,
            marginBottom: 28,
          }}
        />

        <div
          style={{
            fontFamily: serifCaption,
            fontSize: 44,
            fontWeight: 600,
            color: PALETTE.textPrimary,
            maxWidth: 720,
            lineHeight: 1.35,
            textWrap: "balance",
          }}
        >
          {label}
        </div>
      </div>

      {/* Bottom Context */}
      <div
        style={{
          opacity: p,
          fontFamily: mono,
          fontSize: 34,
          color: PALETTE.textMuted,
          padding: "10px 20px",
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          border: `1px solid ${PALETTE.cardBorder}`,
        }}
      >
        {context ?? "Dữ liệu nghiên cứu thực tế"}
      </div>
    </AbsoluteFill>
  );
};
