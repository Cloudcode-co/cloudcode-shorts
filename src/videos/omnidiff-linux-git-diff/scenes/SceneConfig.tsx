import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Terminal } from "../../../kit";
import { condensed, mono, sans, SAFE } from "../palette";

// Scene 9: Configure Git difftool
export const SceneConfig: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const contentIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const termW = 1080 - SAFE.left - (SAFE.right + 24);

  return (
    <AbsoluteFill style={{ backgroundColor: "#070E1A", overflow: "hidden" }}>
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
              color: "#38BDF8",
              letterSpacing: 1.5,
              marginBottom: 8,
            }}
          >
            TỰ ĐỘNG THIẾT LẬP
          </div>
          <div
            style={{
              fontFamily: condensed,
              fontSize: 68,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.05,
              textWrap: "balance",
            }}
          >
            CẤU HÌNH GIT DIFFTOOL
          </div>
        </div>

        {/* Terminal typing */}
        <div style={{ opacity: contentIn }}>
          <Terminal
            cmds={["omnidiff git configure"]}
            width={termW}
            fontSize={38}
            minHeight={210}
            bg="#0F172A"
            fg="#F8FAFC"
            accent="#38BDF8"
          />
        </div>

        {/* Two Comparison Cards: difftool vs diff */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            opacity: contentIn,
            transform: `scale(${0.92 + contentIn * 0.08})`,
          }}
        >
          {/* Option 1: git difftool */}
          <div
            style={{
              background: "#1E293B",
              borderRadius: 22,
              border: "2px solid #38BDF8",
              padding: "22px 24px",
              boxShadow: "0 8px 24px rgba(56, 189, 248, 0.2)",
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
              <span style={{ fontFamily: mono, fontSize: 26, fontWeight: 800, color: "#38BDF8" }}>
                $ git difftool
              </span>
              <span
                style={{
                  background: "rgba(56, 189, 248, 0.2)",
                  padding: "4px 12px",
                  borderRadius: 10,
                  fontFamily: mono,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                MỞ TUI
              </span>
            </div>
            <div style={{ fontFamily: sans, fontSize: 26, color: "#E2E8F0", lineHeight: 1.35 }}>
              Mở giao diện TUI toàn màn hình tương tác, phím tắt n/p duyệt từng đoạn hunk.
            </div>
          </div>

          {/* Option 2: git diff */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              borderRadius: 22,
              border: "1px solid #334155",
              padding: "22px 24px",
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
              <span style={{ fontFamily: mono, fontSize: 26, fontWeight: 800, color: "#94A3B8" }}>
                $ git diff
              </span>
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  padding: "4px 12px",
                  borderRadius: 10,
                  fontFamily: mono,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#CBD5E1",
                }}
              >
                VĂN BẢN
              </span>
            </div>
            <div style={{ fontFamily: sans, fontSize: 26, color: "#94A3B8", lineHeight: 1.35 }}>
              In diff dạng text thông thường qua git pager, gọn nhẹ nhanh chóng cho dòng lệnh.
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
