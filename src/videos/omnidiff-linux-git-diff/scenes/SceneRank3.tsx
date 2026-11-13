import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { condensed, mono, sans, SAFE, RANK_THEMES } from "../palette";
import {
  GiantRankNumeral,
  ProgressRail,
  EntryLogoCard,
} from "../components/CountdownComponents";

// Scene 5: Rank #3 - Tự động ghim ngữ cảnh
export const SceneRank3: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const theme = RANK_THEMES[3];

  // Content entrance
  const contentIn = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      {/* Giant rank #3 slams in */}
      <GiantRankNumeral rank={3} />

      {/* Progress rail: 3 dots active */}
      <ProgressRail currentRank={3} />

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
            TOP 5 TÍNH NĂNG ĐỈNH CAO // #3
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
            TỰ ĐỘNG GHIM NGỮ CẢNH
          </div>
        </div>

        {/* Entry Logo Card */}
        <EntryLogoCard rank={3} delay={8} />

        {/* Sticky Context Code Mockup */}
        <div
          style={{
            background: theme.bgCard,
            borderRadius: 26,
            border: `2px solid ${theme.border}`,
            padding: "24px",
            boxShadow: `0 12px 36px rgba(0,0,0,0.5)`,
            opacity: contentIn,
            transform: `scale(${0.92 + contentIn * 0.08})`,
          }}
        >
          {/* Pinned Sticky Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(167, 139, 250, 0.25)",
              border: `2px solid ${theme.accent}`,
              borderRadius: 16,
              padding: "12px 18px",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 24 }}>📌</span>
            <span
              style={{
                fontFamily: mono,
                fontSize: 26,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              def calculate_stats(numbers):
            </span>
          </div>

          {/* Context lines inside function */}
          <div
            style={{
              fontFamily: mono,
              fontSize: 24,
              lineHeight: 1.6,
              color: "#E2E8F0",
              background: "rgba(0,0,0,0.3)",
              padding: "16px 20px",
              borderRadius: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ color: "#94A3B8" }}>7   count = len(numbers)</div>
            <div style={{ color: "#4ADE80" }}>8 + total = sum(numbers)</div>
            <div style={{ color: "#94A3B8" }}>9   average = total / count</div>
          </div>

          <div
            style={{
              fontFamily: sans,
              fontSize: 28,
              fontWeight: 600,
              color: theme.subtext,
              lineHeight: 1.35,
            }}
          >
            Mỗi đoạn thay đổi tự động gắn tên hàm, struct hoặc class bao quanh — không bao giờ lạc trong file dài hàng ngàn dòng!
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
