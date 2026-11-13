import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { condensed, mono, sans, SAFE, RANK_THEMES } from "../palette";
import {
  GiantRankNumeral,
  ProgressRail,
  EntryLogoCard,
} from "../components/CountdownComponents";

// Scene 7: Rank #1 - Giao diện TUI 24-bit Truecolor (Gold treatment + short flash!)
export const SceneRank1: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const theme = RANK_THEMES[1];

  // Short flash at the start (frames 0 -> 14)
  const flashOpacity = interpolate(frame, [0, 4, 14], [0, 0.95, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Content entrance
  const contentIn = interpolate(frame, [16, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, overflow: "hidden" }}>
      {/* Background Datacenter Server footage for SSH / remote server context */}
      <AbsoluteFill style={{ opacity: 0.24 }}>
        <OffthreadVideo
          src={staticFile(
            "videos/omnidiff-linux-git-diff/footage/datacenter-server-racks-flashing-lights-pixabay-171185.mp4",
          )}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          muted
        />
      </AbsoluteFill>

      {/* Gold vignette background overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(250, 204, 21, 0.15) 0%, rgba(15, 12, 2, 0.92) 80%)",
        }}
      />

      {/* Giant rank #1 slams in with gold treatment */}
      <GiantRankNumeral rank={1} />

      {/* Progress rail: all 5 dots gold active */}
      <ProgressRail currentRank={1} />

      {/* Main Content */}
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
              fontSize: 28,
              fontWeight: 800,
              color: "#FACC15",
              letterSpacing: 2,
              marginBottom: 8,
              textShadow: "0 0 20px rgba(250, 204, 21, 0.6)",
            }}
          >
            🏆 QUÁN QUÂN TOP 1 // HẠNG 1
          </div>
          <div
            style={{
              fontFamily: condensed,
              fontSize: 64,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.05,
              textWrap: "balance",
            }}
          >
            GIAO DIỆN TUI<br />24-BIT TRUECOLOR
          </div>
        </div>

        {/* Entry Logo Card with Gold Treatment */}
        <EntryLogoCard rank={1} delay={8} />

        {/* Feature Highlights */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            opacity: contentIn,
            transform: `scale(${0.92 + contentIn * 0.08})`,
          }}
        >
          {/* 24-bit Truecolor */}
          <div
            style={{
              background: theme.bgCard,
              borderRadius: 24,
              border: `2px solid #FACC15`,
              padding: "22px 24px",
              boxShadow: "0 10px 32px rgba(250, 204, 21, 0.25)",
            }}
          >
            <div
              style={{
                fontFamily: condensed,
                fontSize: 38,
                fontWeight: 900,
                color: "#FACC15",
                marginBottom: 8,
              }}
            >
              Hỗ trợ 24-bit Truecolor
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 28,
                color: "#FEF08A",
                lineHeight: 1.35,
              }}
            >
              TUI tương tác mượt mà, phân loại màu sắc cú pháp trực quan, duyệt diff bằng phím tắt như Vim.
            </div>
          </div>

          {/* SSH fallback */}
          <div
            style={{
              background: "rgba(30, 24, 5, 0.8)",
              borderRadius: 20,
              border: "1px solid #85650D",
              padding: "20px 24px",
            }}
          >
            <div
              style={{
                fontFamily: condensed,
                fontSize: 34,
                fontWeight: 800,
                color: "#FFFFFF",
                marginBottom: 6,
              }}
            >
              Tự động lùi về 256 màu qua SSH
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 26,
                color: "#E2E8F0",
                lineHeight: 1.35,
              }}
            >
              Làm việc trên VPS từ xa không lo vỡ giao diện; tự động nhận diện COLORTERM mượt mà!
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Gold Short Flash on Entrance */}
      {frame <= 14 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFBEB",
            opacity: flashOpacity,
            pointerEvents: "none",
            zIndex: 50,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
