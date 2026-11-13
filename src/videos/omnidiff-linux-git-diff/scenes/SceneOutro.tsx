import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { condensed, mono, sans, SAFE } from "../palette";
import { ChapterTitleCard } from "../components/CountdownComponents";

// Scene 11: Outro / CTA
export const SceneOutro: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const contentIn = interpolate(frame, [30, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#060A14", overflow: "hidden" }}>
      {/* Chapter 4 Title Card for pacing */}
      <ChapterTitleCard
        chapterNum="CHƯƠNG 04"
        title="LƯU VIDEO &amp; FOLLOW"
        subtitle="Nâng cấp trải nghiệm Git diff trên Linux"
        color="#FACC15"
        duration={30}
      />

      {/* Programmer smiling stock footage */}
      <AbsoluteFill style={{ opacity: 0.28 }}>
        <OffthreadVideo
          src={staticFile(
            "videos/omnidiff-linux-git-diff/footage/young-programmer-smiling-at-desk-pixabay-3160.mp4",
          )}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          muted
        />
      </AbsoluteFill>

      {/* Gradient overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,10,20,0.85) 0%, rgba(6,10,20,0.95) 100%)",
        }}
      />

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
              color: "#FACC15",
              letterSpacing: 1.5,
              marginBottom: 8,
            }}
          >
            TỔNG KẾT
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
            NÂNG CẤP GIT DIFF NGAY HÔM NAY
          </div>
        </div>

        {/* Product summary chip */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            borderRadius: 22,
            border: "1px solid #1E293B",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: contentIn,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Img
              src={staticFile("videos/omnidiff-linux-git-diff/repos/ivankovic.png")}
              style={{ width: 56, height: 56, borderRadius: 14, border: "2px solid #FACC15" }}
            />
            <div>
              <div style={{ fontFamily: condensed, fontSize: 32, fontWeight: 800, color: "#FFFFFF" }}>
                OmniDiff v0.4.0
              </div>
              <div style={{ fontFamily: mono, fontSize: 20, color: "#94A3B8" }}>
                ivankovic/omnidiff
              </div>
            </div>
          </div>

          <div
            style={{
              fontFamily: mono,
              fontSize: 22,
              fontWeight: 700,
              color: "#FACC15",
            }}
          >
            ★ 1,350 • Rust
          </div>
        </div>

        {/* CTA Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            opacity: contentIn,
            transform: `scale(${0.92 + contentIn * 0.08})`,
          }}
        >
          {/* Action 1: Save video */}
          <div
            style={{
              background: "#0F172A",
              borderRadius: 24,
              border: "2px solid #38BDF8",
              padding: "22px 24px",
              display: "flex",
              alignItems: "center",
              gap: 18,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: 44 }}>🔖</div>
            <div>
              <div style={{ fontFamily: condensed, fontSize: 38, fontWeight: 900, color: "#FFFFFF" }}>
                LƯU VIDEO LẠI
              </div>
              <div style={{ fontFamily: sans, fontSize: 26, color: "#94A3B8" }}>
                Để cài đặt và cấu hình Git diff dưới 100ms trên VPS Linux.
              </div>
            </div>
          </div>

          {/* Action 2: Follow channel */}
          <div
            style={{
              background: "rgba(234, 88, 12, 0.15)",
              borderRadius: 24,
              border: "2px solid #EA580C",
              padding: "22px 24px",
              display: "flex",
              alignItems: "center",
              gap: 18,
              boxShadow: "0 10px 30px rgba(234, 88, 12, 0.2)",
            }}
          >
            <div style={{ fontSize: 44 }}>✨</div>
            <div>
              <div style={{ fontFamily: condensed, fontSize: 38, fontWeight: 900, color: "#FB923C" }}>
                BẤM FOLLOW KÊNH
              </div>
              <div style={{ fontFamily: sans, fontSize: 26, color: "#FED7AA" }}>
                Đón xem các công cụ mã nguồn mở và mẹo lập trình Linux mới nhất!
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: 18,
            border: "1px solid #334155",
            padding: "16px 20px",
            textAlign: "center",
            opacity: contentIn,
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: 24,
              fontWeight: 700,
              color: "#38BDF8",
            }}
          >
            #omnidiff #gitdiff #treesitter #linux #rust
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
