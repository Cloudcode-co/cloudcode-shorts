import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { mono, sans, serifItalic, SAFE, BRAND_SPACE } from "./theme";

export interface LiveCounterProps {
  label: string;
  value1: string | number;
  unit1?: string;
  value2?: string | number;
  unit2?: string;
  color?: string;
  isOpening?: boolean;
}

export const LiveCounter: React.FC<LiveCounterProps> = ({
  label,
  value1,
  unit1,
  value2,
  unit2,
  color = "#67E8F9",
  isOpening = false,
}) => {
  const frame = useCurrentFrame();
  const top = isOpening ? SAFE.top + BRAND_SPACE + 20 : SAFE.top + 20;

  // Subtle digital pulse on the separator
  const pulse = 0.7 + 0.3 * Math.sin(frame * 0.3);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: SAFE.left,
        right: SAFE.right,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {/* Small spaced label */}
      <div
        style={{
          fontFamily: sans,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "rgba(225, 235, 250, 0.85)",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.9)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      {/* Big tabular numerals with small unit beside it */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          flexWrap: "nowrap",
          gap: 12,
        }}
      >
        {/* Metric 1 */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexShrink: 0 }}>
          <span
            style={{
              fontFamily: mono,
              fontVariantNumeric: "tabular-nums",
              fontSize: 60,
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: -1,
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.9)",
              lineHeight: 1,
            }}
          >
            {value1}
          </span>
          {unit1 && (
            <span
              style={{
                fontFamily: sans,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 2,
                color,
                textTransform: "uppercase",
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.9)",
              }}
            >
              {unit1}
            </span>
          )}
        </div>

        {/* Separator · */}
        {value2 !== undefined && (
          <span
            style={{
              fontFamily: sans,
              fontSize: 44,
              fontWeight: 800,
              color: `rgba(255, 255, 255, ${pulse})`,
              margin: "0 2px",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ·
          </span>
        )}

        {/* Metric 2 */}
        {value2 !== undefined && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexShrink: 0 }}>
            <span
              style={{
                fontFamily: mono,
                fontVariantNumeric: "tabular-nums",
                fontSize: 60,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: -1,
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.9)",
                lineHeight: 1,
              }}
            >
              {value2}
            </span>
            {unit2 && (
              <span
                style={{
                  fontFamily: sans,
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color,
                  textTransform: "uppercase",
                  textShadow: "0 2px 12px rgba(0, 0, 0, 0.9)",
                }}
              >
                {unit2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const SerifSubtitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const enterProgress = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.23, 1, 0.32, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: SAFE.bottom + 25,
        left: SAFE.left,
        right: SAFE.right,
        textAlign: "center",
        zIndex: 60,
        pointerEvents: "none",
        opacity: enterProgress,
        transform: `translateY(${(1 - enterProgress) * 10}px)`,
      }}
    >
      <span
        style={{
          fontFamily: serifItalic,
          fontStyle: "italic",
          fontSize: 48,
          fontWeight: 600,
          lineHeight: 1.35,
          color: "#FFFFFF",
          textShadow:
            "0 3px 20px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.8)",
          textWrap: "balance",
          display: "inline-block",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.85 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(2, 4, 10, ${intensity}) 100%)`,
      pointerEvents: "none",
      zIndex: 40,
    }}
  />
);

export const ColorGrade: React.FC<{
  mode: "cold-blue" | "red" | "warm" | "neutral";
  intensity?: number;
  alertPulse?: boolean;
}> = ({ mode, intensity = 0.35, alertPulse = false }) => {
  const frame = useCurrentFrame();
  const pulse = alertPulse ? 0.12 * Math.sin(frame * 0.25) : 0;
  const alpha = Math.min(0.65, intensity + pulse);

  const gradient = {
    red: `radial-gradient(circle at center, rgba(239, 68, 68, ${alpha * 0.25}) 0%, rgba(185, 28, 28, ${alpha * 0.85}) 100%)`,
    "cold-blue": `radial-gradient(circle at center, rgba(56, 189, 248, ${alpha * 0.2}) 0%, rgba(14, 116, 144, ${alpha * 0.75}) 100%)`,
    warm: `radial-gradient(circle at center, rgba(251, 191, 36, ${alpha * 0.25}) 0%, rgba(180, 83, 9, ${alpha * 0.65}) 100%)`,
    neutral: `radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, ${alpha * 0.5}) 100%)`,
  }[mode];

  return (
    <AbsoluteFill
      style={{
        background: gradient,
        mixBlendMode: mode === "neutral" ? "normal" : "color-dodge",
        pointerEvents: "none",
        zIndex: 42,
      }}
    />
  );
};

export const CornerCredit: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      bottom: 24,
      left: SAFE.left,
      zIndex: 45,
      fontFamily: sans,
      fontSize: 22,
      fontWeight: 500,
      color: "rgba(255, 255, 255, 0.45)",
      letterSpacing: 1,
      pointerEvents: "none",
    }}
  >
    {text}
  </div>
);
