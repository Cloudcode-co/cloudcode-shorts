import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  condensed,
  sans,
  mono,
  SAFE,
  RANK_THEMES,
  type RankNumber,
} from "../palette";

const easeOutExpo = Easing.bezier(0.16, 1, 0.3, 1);

// Giant rank number slamming in and settling into the background as a watermark numeral
export const GiantRankNumeral: React.FC<{
  rank: RankNumber;
  delay?: number;
}> = ({ rank, delay = 0 }) => {
  const frame = useCurrentFrame();
  const theme = RANK_THEMES[rank];
  const local = Math.max(0, frame - delay);

  // Slam in animation: 0 -> 14 frames
  const slamProgress = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  // Scale: 3.2 -> 1.0 during slam
  const slamScale = interpolate(slamProgress, [0, 1], [3.2, 1.0]);
  const slamOpacity = interpolate(slamProgress, [0, 0.4, 1], [0, 0.9, 1]);

  // Transition from foreground slam to background watermark: frames 16 -> 32
  const settleProgress = interpolate(local, [16, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.23, 1, 0.32, 1),
  });

  // Settled watermark position and scale
  const watermarkOpacity = interpolate(
    settleProgress,
    [0, 1],
    [1, theme.gold ? 0.28 : 0.16],
  );
  const watermarkScale = interpolate(settleProgress, [0, 1], [1, 1.35]);
  const watermarkY = interpolate(settleProgress, [0, 1], [0, -180]);

  // Shockwave ring on impact (frames 13 -> 26)
  const ringProgress = interpolate(local, [13, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const ringScale = interpolate(ringProgress, [0, 1], [0.6, 2.4]);
  const ringOpacity = interpolate(ringProgress, [0, 0.3, 1], [0, 0.8, 0]);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: settleProgress > 0.8 ? 0 : 25,
      }}
    >
      {/* Shockwave ring on slam impact */}
      {local >= 13 && local <= 26 && (
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: `6px solid ${theme.accent}`,
            transform: `scale(${ringScale})`,
            opacity: ringOpacity,
          }}
        />
      )}

      {/* The Giant Rank Numeral */}
      <div
        style={{
          fontFamily: condensed,
          fontWeight: 900,
          fontSize: 520,
          lineHeight: 0.8,
          color: theme.accent,
          transform: `translateY(${watermarkY}px) scale(${slamScale * watermarkScale})`,
          opacity: slamOpacity * watermarkOpacity,
          textShadow: theme.gold
            ? `0 0 60px ${theme.accentGlow}, 0 0 120px rgba(250, 204, 21, 0.4)`
            : `0 0 40px ${theme.accentGlow}`,
          userSelect: "none",
        }}
      >
        #{theme.num}
      </div>
    </AbsoluteFill>
  );
};

// Progress rail of 5 dots on the side
export const ProgressRail: React.FC<{
  currentRank: RankNumber;
}> = ({ currentRank }) => {
  const frame = useCurrentFrame();
  // Rank order in countdown: #5 is index 0, #4 is index 1, #3 is index 2, #2 is index 3, #1 is index 4
  const rankIndex = 5 - currentRank;
  const theme = RANK_THEMES[currentRank];

  return (
    <div
      style={{
        position: "absolute",
        left: 64, // Safely past SIDE_CROP (53px) and before SAFE.left (103px)
        top: SAFE.top + 240,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        padding: "14px 6px",
        background: "rgba(11, 17, 30, 0.75)",
        borderRadius: 20,
        border: `1px solid ${theme.border}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          fontFamily: condensed,
          fontSize: 18,
          fontWeight: 800,
          color: theme.accent,
          letterSpacing: 1,
        }}
      >
        TOP 5
      </div>

      {[0, 1, 2, 3, 4].map((idx) => {
        const itemRank = (5 - idx) as RankNumber;
        const isCurrent = idx === rankIndex;
        const isCompleted = idx <= rankIndex;
        const itemTheme = RANK_THEMES[itemRank];

        // Subtle breath / pulse for current dot
        const pulse = isCurrent ? Math.sin(frame * 0.12) * 2 : 0;

        return (
          <div
            key={idx}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isCurrent && (
              <div
                style={{
                  position: "absolute",
                  width: 26 + pulse,
                  height: 26 + pulse,
                  borderRadius: "50%",
                  border: `2px solid ${itemTheme.accent}`,
                  opacity: 0.8,
                }}
              />
            )}
            <div
              style={{
                width: isCurrent ? 16 : isCompleted ? 14 : 10,
                height: isCurrent ? 16 : isCompleted ? 14 : 10,
                borderRadius: "50%",
                background: isCompleted
                  ? itemTheme.accent
                  : "rgba(255, 255, 255, 0.2)",
                boxShadow: isCompleted
                  ? `0 0 12px ${itemTheme.accent}`
                  : "none",
                transition: "all 0.2s ease",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// Entry's logo card with name, real stars (1,350) and Rust badge
export const EntryLogoCard: React.FC<{
  rank: RankNumber;
  delay?: number;
}> = ({ rank, delay = 8 }) => {
  const frame = useCurrentFrame();
  const theme = RANK_THEMES[rank];
  const local = Math.max(0, frame - delay);

  const p = interpolate(local, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 24px",
        background: theme.bgCard,
        borderRadius: 24,
        border: theme.gold
          ? "3px solid #FACC15"
          : `2px solid ${theme.border}`,
        boxShadow: theme.gold
          ? "0 8px 32px rgba(250, 204, 21, 0.35)"
          : `0 8px 24px rgba(0, 0, 0, 0.4)`,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Img
          src={staticFile("videos/omnidiff-linux-git-diff/repos/ivankovic.png")}
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            border: `2px solid ${theme.accent}`,
          }}
        />
        <div>
          <div
            style={{
              fontFamily: condensed,
              fontSize: 44,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: 0.5,
            }}
          >
            OmniDiff
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 22,
              color: theme.subtext,
              marginTop: 2,
            }}
          >
            ivankovic/omnidiff
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        {/* Real stars from facts.json */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: theme.gold ? "rgba(250, 204, 21, 0.2)" : "rgba(255, 255, 255, 0.08)",
            padding: "6px 14px",
            borderRadius: 14,
            border: `1px solid ${theme.accent}`,
          }}
        >
          <span style={{ fontSize: 24, color: "#FACC15" }}>★</span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 28,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            1,350
          </span>
        </div>

        <div
          style={{
            fontFamily: mono,
            fontSize: 20,
            fontWeight: 700,
            color: theme.accent,
          }}
        >
          Rust • 100% Cú pháp
        </div>
      </div>
    </div>
  );
};

// Chapter title card before each section (Pacing: Chapters: a title card before each section)
export const ChapterTitleCard: React.FC<{
  chapterNum: string;
  title: string;
  subtitle: string;
  color?: string;
  duration?: number;
}> = ({
  chapterNum,
  title,
  subtitle,
  color = "#60A5FA",
  duration = 34,
}) => {
  const frame = useCurrentFrame();

  // Entrance 0 -> 12
  const inProgress = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutExpo,
  });

  // Exit 24 -> duration
  const outProgress = interpolate(frame, [duration - 10, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.77, 0, 0.175, 1),
  });

  if (frame >= duration) return null;

  return (
    <AbsoluteFill
      style={{
        zIndex: 40,
        backgroundColor: "rgba(6, 10, 18, 0.95)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        opacity: (1 - outProgress) * inProgress,
        transform: `scale(${0.92 + inProgress * 0.08 - outProgress * 0.1})`,
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 34,
          fontWeight: 700,
          color,
          letterSpacing: 3,
          marginBottom: 16,
        }}
      >
        {chapterNum}
      </div>

      <div
        style={{
          fontFamily: condensed,
          fontSize: 76,
          fontWeight: 900,
          color: "#FFFFFF",
          textAlign: "center",
          lineHeight: 1.1,
          letterSpacing: 0.5,
          marginBottom: 20,
          textWrap: "balance",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontFamily: sans,
          fontSize: 36,
          fontWeight: 500,
          color: "#94A3B8",
          textAlign: "center",
        }}
      >
        {subtitle}
      </div>

      <div
        style={{
          marginTop: 36,
          width: 140,
          height: 6,
          borderRadius: 3,
          background: color,
        }}
      />
    </AbsoluteFill>
  );
};
