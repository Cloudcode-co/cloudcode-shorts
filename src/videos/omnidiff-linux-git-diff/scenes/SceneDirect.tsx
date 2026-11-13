import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Terminal } from "../../../kit";
import { condensed, mono, sans, SAFE } from "../palette";

// Scene 10: Run directly via GIT_EXTERNAL_DIFF
export const SceneDirect: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const contentIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const termW = 1080 - SAFE.left - (SAFE.right + 24);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B132B", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          boxSizing: "border-box",
          width: 1080,
          height: 1920,
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom + 20,
          paddingLeft: SAFE.left,
          paddingRight: SAFE.right + 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        {/* Top Header */}
        <div style={{ opacity: contentIn, transform: `translateY(${(1 - contentIn) * 20}px)` }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 26,
              fontWeight: 700,
              color: "#34D399",
              letterSpacing: 1.5,
              marginBottom: 8,
            }}
          >
            MẸO CHẠY TỨC THÌ
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
            DÙNG NGAY QUA BIẾN MÔI TRƯỜNG
          </div>
        </div>

        {/* Terminal typing */}
        <div style={{ opacity: contentIn }}>
          <Terminal
            cmds={["GIT_EXTERNAL_DIFF=omnidiff git diff"]}
            width={termW}
            fontSize={31}
            minHeight={200}
            bg="#1E293B"
            fg="#F8FAFC"
            accent="#34D399"
          />
        </div>

        {/* Diff preview box simulating instant syntax diff */}
        <div
          style={{
            background: "#080F1E",
            borderRadius: 20,
            border: "1px solid #1E293B",
            padding: "18px 22px",
            fontFamily: mono,
            fontSize: 22,
            lineHeight: 1.6,
            opacity: contentIn,
          }}
        >
          <div style={{ color: "#34D399", fontWeight: 700, marginBottom: 4 }}>
            [OmniDiff v0.4.0 • Syntax Diff Output]
          </div>
          <div style={{ color: "#94A3B8" }}>diff --git a/src/main.rs b/src/main.rs</div>
          <div style={{ color: "#4ADE80" }}>+ fn calculate_stats()</div>
          <div style={{ color: "#F87171" }}>- fn old_calculation()</div>
        </div>

        {/* Info Card */}
        <div
          style={{
            background: "#132144",
            borderRadius: 24,
            border: "2px solid #10B981",
            padding: "24px 28px",
            boxShadow: "0 12px 36px rgba(16, 185, 129, 0.2)",
            opacity: contentIn,
            transform: `scale(${0.92 + contentIn * 0.08})`,
          }}
        >
          <div
            style={{
              fontFamily: condensed,
              fontSize: 36,
              fontWeight: 800,
              color: "#34D399",
              marginBottom: 8,
            }}
          >
            ⚡ Không cần chạm vào file .gitconfig!
          </div>

          <div
            style={{
              fontFamily: sans,
              fontSize: 27,
              color: "#E2E8F0",
              lineHeight: 1.35,
            }}
          >
            Chạy diff tức thì trên bất kỳ máy server hay VPS nào có OmniDiff, tiện lợi cho CI/CD và script tự động.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
