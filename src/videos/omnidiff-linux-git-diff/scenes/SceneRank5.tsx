import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { condensed, mono, sans, SAFE, RANK_THEMES } from "../palette";
import {
  GiantRankNumeral,
  ProgressRail,
  EntryLogoCard,
} from "../components/CountdownComponents";

// Scene 3: Rank #5 - Tree-sitter cho 26 ngôn ngữ
export const SceneRank5: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const theme = RANK_THEMES[5];

  // Content entrance after rank slam (around frame 18)
  const contentIn = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      {/* Giant rank number slams in and stays as watermark behind */}
      <GiantRankNumeral rank={5} />

      {/* Progress rail of 5 dots on the side */}
      <ProgressRail currentRank={5} />

      {/* Main Content inside safe area */}
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
            TOP 5 TÍNH NĂNG ĐỈNH CAO // #5
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
            TREE-SITTER CHO 26 NGÔN NGỮ
          </div>
        </div>

        {/* Entry's logo card with name and real stars */}
        <EntryLogoCard rank={5} delay={8} />

        {/* Visual AST Syntax Card */}
        <div
          style={{
            background: theme.bgCard,
            borderRadius: 28,
            border: `2px solid ${theme.border}`,
            padding: "28px 24px",
            boxShadow: `0 12px 36px rgba(0,0,0,0.5)`,
            opacity: contentIn,
            transform: `scale(${0.92 + contentIn * 0.08})`,
          }}
        >
          {/* Tree-sitter AST nodes diagram */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                background: "rgba(96, 165, 250, 0.18)",
                border: "1px solid #60A5FA",
                padding: "8px 16px",
                borderRadius: 12,
                fontFamily: mono,
                fontSize: 22,
                color: "#93C5FD",
              }}
            >
              FunctionDef
            </div>
            <span style={{ color: "#60A5FA", fontSize: 24 }}>──</span>
            <div
              style={{
                background: "rgba(96, 165, 250, 0.18)",
                border: "1px solid #60A5FA",
                padding: "8px 16px",
                borderRadius: 12,
                fontFamily: mono,
                fontSize: 22,
                color: "#93C5FD",
              }}
            >
              Parameters
            </div>
            <span style={{ color: "#60A5FA", fontSize: 24 }}>──</span>
            <div
              style={{
                background: "rgba(96, 165, 250, 0.18)",
                border: "1px solid #60A5FA",
                padding: "8px 16px",
                borderRadius: 12,
                fontFamily: mono,
                fontSize: 22,
                color: "#93C5FD",
              }}
            >
              BlockAST
            </div>
          </div>

          <div
            style={{
              fontFamily: sans,
              fontSize: 30,
              fontWeight: 500,
              color: "#E2E8F0",
              lineHeight: 1.4,
              marginBottom: 16,
            }}
          >
            Phân tích cấu trúc cây AST chuẩn xác cho 26 ngôn ngữ: Rust, Python, Go, TS, C++, Java...
          </div>

          {/* Key Stat pill */}
          <div
            style={{
              display: "flex",
              gap: 16,
            }}
          >
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "12px 16px",
                textAlign: "center",
                border: "1px solid #1E2F4F",
              }}
            >
              <div style={{ fontFamily: condensed, fontSize: 38, fontWeight: 900, color: theme.accent }}>
                99.95%
              </div>
              <div style={{ fontFamily: mono, fontSize: 20, color: theme.subtext }}>
                Độ bền thay đổi code
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 16,
                padding: "12px 16px",
                textAlign: "center",
                border: "1px solid #1E2F4F",
              }}
            >
              <div style={{ fontFamily: condensed, fontSize: 38, fontWeight: 900, color: theme.accent }}>
                98.8%
              </div>
              <div style={{ fontFamily: mono, fontSize: 20, color: theme.subtext }}>
                Content-aware
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
