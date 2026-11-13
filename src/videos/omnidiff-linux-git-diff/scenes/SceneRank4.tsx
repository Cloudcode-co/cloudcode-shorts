import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { condensed, mono, sans, SAFE, RANK_THEMES } from "../palette";
import {
  GiantRankNumeral,
  ProgressRail,
  EntryLogoCard,
} from "../components/CountdownComponents";

// Scene 4: Rank #4 - Nhận diện di chuyển code
export const SceneRank4: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const theme = RANK_THEMES[4];

  // Content entrance
  const contentIn = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      {/* Giant rank #4 slams in */}
      <GiantRankNumeral rank={4} />

      {/* Progress rail: 2 dots active */}
      <ProgressRail currentRank={4} />

      <AbsoluteFill
        style={{
          boxSizing: "border-box",
          width: 1080,
          height: 1920,
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom + 20,
          paddingLeft: SAFE.left + 24,
          paddingRight: SAFE.right + 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        {/* Top: Rank Title & Headline */}
        <div style={{ opacity: contentIn, transform: `translateY(${(1 - contentIn) * 20}px)` }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 26,
              fontWeight: 700,
              color: theme.accent,
              letterSpacing: 1.5,
              marginBottom: 8,
            }}
          >
            TOP 5 TÍNH NĂNG ĐỈNH CAO // #4
          </div>
          <div
            style={{
              fontFamily: condensed,
              fontSize: 66,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.05,
              textWrap: "balance",
            }}
          >
            NHẬN DIỆN DI CHUYỂN CODE
          </div>
        </div>

        {/* Entry Logo Card */}
        <EntryLogoCard rank={4} delay={8} />

        {/* Comparison: Unix diff vs OmniDiff */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            opacity: contentIn,
            transform: `scale(${0.92 + contentIn * 0.08})`,
          }}
        >
          {/* Unix diff problem */}
          <div
            style={{
              background: "#181414",
              borderRadius: 20,
              border: "1px solid #7F1D1D",
              padding: "18px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 24, fontWeight: 700, color: "#F87171" }}>
                Unix diff thường
              </span>
              <span style={{ fontFamily: mono, fontSize: 22, color: "#FCA5A5" }}>
                Báo lệch 23 dòng
              </span>
            </div>
            <div style={{ fontFamily: sans, fontSize: 26, color: "#CBD5E1" }}>
              Cắt đứt code thành hàng loạt dòng xóa và thêm mới, khó review.
            </div>
          </div>

          {/* OmniDiff solution */}
          <div
            style={{
              background: theme.bgCard,
              borderRadius: 24,
              border: `2px solid ${theme.accent}`,
              padding: "24px",
              boxShadow: `0 8px 30px ${theme.accentGlow}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 28, fontWeight: 800, color: theme.accent }}>
                OmniDiff thông minh
              </span>
              <span
                style={{
                  background: "rgba(45, 212, 191, 0.2)",
                  padding: "4px 12px",
                  borderRadius: 10,
                  fontFamily: mono,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                2 code moves
              </span>
            </div>

            <div style={{ fontFamily: sans, fontSize: 30, color: "#FFFFFF", lineHeight: 1.35, marginBottom: 12 }}>
              Nhận diện chính xác 2 khối hàm được di chuyển, 8 dòng thêm và 5 dòng xóa!
            </div>

            <div
              style={{
                fontFamily: mono,
                fontSize: 22,
                color: theme.subtext,
                background: "rgba(0,0,0,0.3)",
                padding: "8px 14px",
                borderRadius: 10,
              }}
            >
              Case: python-refactoring (calculate_stats)
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
