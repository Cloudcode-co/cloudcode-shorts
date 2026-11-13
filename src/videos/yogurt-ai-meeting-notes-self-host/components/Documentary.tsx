import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  PALETTE,
  SAFE,
  easeOut,
  mono,
  serifCaption,
  serifDisplay,
  sans,
} from "../theme";

// Soft dark documentary vignette
export const Vignette: React.FC<{
  tint?: string;
  intensity?: number;
}> = ({ tint = "rgba(0, 0, 0, 0.95)", intensity = 1 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 25%, rgba(0,0,0,${0.55 * intensity}) 65%, ${tint} 100%)`,
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
  endScale = 1.12,
  filter = "saturate(0.68) contrast(1.15) brightness(0.82)",
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
          src={staticFile(`videos/yogurt-ai-meeting-notes-self-host/${file}`)}
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
  date = "13.11.2026",
  place = "FRIGADEHQ/YOGURT",
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
      gap: 12,
      padding: "8px 16px",
      borderRadius: 8,
      backgroundColor: "rgba(8, 9, 12, 0.94)",
      border: `1px solid ${PALETTE.amberBorder}`,
      fontFamily: mono,
      fontSize: 34,
      fontWeight: 600,
      color: PALETTE.amber,
      letterSpacing: 0.5,
      whiteSpace: "nowrap",
      zIndex: 20,
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
  accentColor?: string;
}> = ({ text, kicker, delay = 0, accentColor = PALETTE.amber }) => {
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
        bottom: SAFE.bottom + 12,
        padding: "22px 28px",
        borderRadius: 14,
        backgroundColor: "rgba(8, 10, 14, 0.95)",
        borderLeft: `6px solid ${accentColor}`,
        borderTop: "1px solid rgba(255, 255, 255, 0.14)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 48px rgba(0, 0, 0, 0.8)",
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
        zIndex: 25,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontFamily: mono,
            fontSize: 34,
            fontWeight: 700,
            color: accentColor,
            marginBottom: 8,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: serifCaption,
          fontSize: 38,
          fontWeight: 600,
          lineHeight: 1.38,
          color: PALETTE.textPrimary,
          textWrap: "balance",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Key numbers set huge on black between scenes
export const HugeNumberOnBlack: React.FC<{
  number: string;
  label: string;
  subtitle?: string;
  accentColor?: string;
  badge?: string;
  sourceCitation?: string;
}> = ({
  number,
  label,
  subtitle,
  accentColor = PALETTE.amber,
  badge = "HỒ SƠ BẢO MẬT",
  sourceCitation = "TỰ HOST • MÃ NGUỒN MỞ MIT",
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const scale = interpolate(frame, [0, 60], [0.96, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 15,
      }}
    >
      {/* Top archival banner */}
      <div
        style={{
          opacity: p,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.16)",
          paddingBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 34,
            fontWeight: 700,
            color: accentColor,
            letterSpacing: 1,
          }}
        >
          ● {badge}
        </span>
        <span
          style={{
            fontFamily: mono,
            fontSize: 34,
            color: PALETTE.textMuted,
          }}
        >
          13.11.2026
        </span>
      </div>

      {/* Center huge number block */}
      <div
        style={{
          opacity: p,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 16,
          margin: "auto 0",
        }}
      >
        <div
          style={{
            fontFamily: serifDisplay,
            fontSize: 140,
            fontWeight: 800,
            lineHeight: 1.05,
            color: PALETTE.textPrimary,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -1,
            textShadow: `0 0 50px ${accentColor}55`,
          }}
        >
          {number}
        </div>

        <div
          style={{
            fontFamily: serifCaption,
            fontSize: 44,
            fontWeight: 700,
            color: accentColor,
            maxWidth: 720,
            textWrap: "balance",
          }}
        >
          {label}
        </div>

        {subtitle ? (
          <div
            style={{
              fontFamily: sans,
              fontSize: 36,
              fontWeight: 500,
              color: PALETTE.textSecondary,
              maxWidth: 700,
              textWrap: "balance",
              marginTop: 6,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      {/* Bottom citation */}
      <div
        style={{
          opacity: p,
          width: "100%",
          borderTop: "1px solid rgba(255, 255, 255, 0.16)",
          paddingTop: 14,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 34,
            color: PALETTE.textMuted,
            letterSpacing: 1,
          }}
        >
          {sourceCitation}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Technical documentary card with optional integrated stamp header
export const DossierCard: React.FC<{
  title: string;
  badge?: string;
  stamp?: string;
  accent?: string;
  children: React.ReactNode;
}> = ({ title, badge, stamp, accent = PALETTE.amber, children }) => (
  <div
    style={{
      backgroundColor: "rgba(10, 14, 20, 0.94)",
      borderRadius: 18,
      border: "1px solid rgba(255, 255, 255, 0.14)",
      borderLeft: `6px solid ${accent}`,
      padding: "26px 30px",
      boxShadow: "0 24px 54px rgba(0, 0, 0, 0.75)",
      display: "flex",
      flexDirection: "column",
      gap: 16,
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    {stamp && (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 34,
            fontWeight: 600,
            color: PALETTE.amber,
            letterSpacing: 0.5,
          }}
        >
          ● {stamp}
        </span>
        <span
          style={{
            fontFamily: mono,
            fontSize: 34,
            color: PALETTE.textMuted,
          }}
        >
          LOCAL ARCHIVE
        </span>
      </div>
    )}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: 12,
      }}
    >
      <div
        style={{
          fontFamily: serifDisplay,
          fontSize: 40,
          fontWeight: 700,
          color: PALETTE.textPrimary,
          lineHeight: 1.25,
          textWrap: "balance",
        }}
      >
        {title}
      </div>
      {badge ? (
        <span
          style={{
            fontFamily: mono,
            fontSize: 34,
            fontWeight: 700,
            color: accent,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            padding: "4px 14px",
            borderRadius: 6,
            border: `1px solid ${accent}88`,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      ) : null}
    </div>
    {children}
  </div>
);
