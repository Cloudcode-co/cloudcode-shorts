import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { condensed, mono, sans, SAFE, RANK_THEMES } from "../palette";
import {
  GiantRankNumeral,
  ProgressRail,
  EntryLogoCard,
  ChapterTitleCard,
} from "../components/CountdownComponents";

// Scene 6: Rank #2 - Diff ảnh, font chữ và file nén (Section "Reveal" start on the DROP!)
export const SceneRank2: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const theme = RANK_THEMES[2];

  // Content entrance after Chapter card and rank slam (frame 44 onwards)
  const contentIn = interpolate(frame, [44, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      {/* Chapter 3 Title Card on the music drop! */}
      <ChapterTitleCard
        chapterNum="CHƯƠNG 03"
        title="ĐỘT PHÁ TÍNH NĂNG"
        subtitle="Diff đa định dạng: Ảnh, Font và File nén"
        color="#FB7185"
        duration={32}
      />

      {/* Giant rank #2 slams in around frame 30 */}
      <GiantRankNumeral rank={2} delay={28} />

      {/* Progress rail: 4 dots active */}
      <ProgressRail currentRank={2} />

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
            TOP 5 TÍNH NĂNG ĐỈNH CAO // #2
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
            DIFF ẢNH, FONT CHỮ VÀ FILE NÉN
          </div>
        </div>

        {/* Entry Logo Card */}
        <EntryLogoCard rank={2} delay={34} />

        {/* 3 Multiformat Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            opacity: contentIn,
            transform: `scale(${0.92 + contentIn * 0.08})`,
          }}
        >
          {/* Feature 1: Image diff */}
          <div
            style={{
              background: theme.bgCard,
              borderRadius: 20,
              border: `1px solid ${theme.border}`,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 40 }}>🖼️</div>
            <div>
              <div style={{ fontFamily: condensed, fontSize: 34, fontWeight: 800, color: theme.accent }}>
                So sánh ảnh pixel theo pixel
              </div>
              <div style={{ fontFamily: sans, fontSize: 24, color: "#CBD5E1" }}>
                PNG, JPEG, WebP, GIF hoạt họa theo từng frame.
              </div>
            </div>
          </div>

          {/* Feature 2: Archives */}
          <div
            style={{
              background: theme.bgCard,
              borderRadius: 20,
              border: `1px solid ${theme.border}`,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 40 }}>📦</div>
            <div>
              <div style={{ fontFamily: condensed, fontSize: 34, fontWeight: 800, color: theme.accent }}>
                Mở file zip, tar soi cấu trúc bên trong
              </div>
              <div style={{ fontFamily: sans, fontSize: 24, color: "#CBD5E1" }}>
                Archives bên trong archives, file class Java chi tiết.
              </div>
            </div>
          </div>

          {/* Feature 3: Fonts */}
          <div
            style={{
              background: theme.bgCard,
              borderRadius: 20,
              border: `1px solid ${theme.border}`,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 40 }}>🔤</div>
            <div>
              <div style={{ fontFamily: condensed, fontSize: 34, fontWeight: 800, color: theme.accent }}>
                Vẽ và so sánh từng glyph font chữ
              </div>
              <div style={{ fontFamily: sans, fontSize: 24, color: "#CBD5E1" }}>
                TrueType, WOFF2... soi rõ từng điểm vector thay đổi.
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
