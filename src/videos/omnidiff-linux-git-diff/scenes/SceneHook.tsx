import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Brand, BRAND_SPACE } from "../../../kit/Brand";
import { condensed, mono, sans, SAFE } from "../palette";

// Scene 1: Hook - 98% lượt git diff trên OmniDiff xử lý dưới 100ms
export const SceneHook: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Subtle punch on metric box when voiceover hits "98%" / thud SFX around frame 35
  const punch =
    frame >= 35 && frame < 50
      ? interpolate(frame, [35, 42, 50], [1, 1.05, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // Glow pulse for the 98% number
  const glow = 30 + Math.sin(frame * 0.08) * 10;

  return (
    <AbsoluteFill style={{ backgroundColor: "#070B14", overflow: "hidden" }}>
      {/* Background code texture from facts.json for authentic developer tool aesthetic */}
      <AbsoluteFill style={{ opacity: 0.1, mixBlendMode: "luminosity" }}>
        <Img
          src={staticFile(
            "videos/omnidiff-linux-git-diff/images/git-diff-code-syntax-pixabay-1568556.jpg",
          )}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Radial glow centered behind main card */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.22) 0%, rgba(7, 11, 20, 0.95) 75%)",
        }}
      />

      {/* Cloudcode Brand lockup at top of opening shot */}
      <Brand />

      <AbsoluteFill
        style={{
          boxSizing: "border-box",
          width: 1080,
          height: 1920,
          paddingTop: SAFE.top + BRAND_SPACE + 14,
          paddingBottom: SAFE.bottom + 16,
          paddingLeft: SAFE.left,
          paddingRight: SAFE.right + 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top: Repo Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#0F172A",
            borderRadius: 22,
            border: "2px solid #1E293B",
            padding: "16px 22px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Img
              src={staticFile("videos/omnidiff-linux-git-diff/repos/ivankovic.png")}
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                border: "2px solid #60A5FA",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: condensed,
                  fontSize: 42,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1.1,
                }}
              >
                OmniDiff
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: "#94A3B8",
                  marginTop: 2,
                }}
              >
                ivankovic/omnidiff
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(250, 204, 21, 0.15)",
              border: "1px solid #FACC15",
              padding: "8px 16px",
              borderRadius: 14,
            }}
          >
            <span style={{ fontSize: 32, color: "#FACC15" }}>★</span>
            <span
              style={{
                fontFamily: mono,
                fontSize: 34,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              1,350
            </span>
          </div>
        </div>

        {/* Main Headline from script */}
        <div>
          <div
            style={{
              fontFamily: condensed,
              fontSize: 78,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.05,
              textWrap: "balance",
              letterSpacing: 0.5,
            }}
          >
            Git diff dưới 100ms
          </div>
        </div>

        {/* Center Giant Hero Metric Box */}
        <div
          style={{
            background: "#0B132B",
            borderRadius: 32,
            border: "2px solid #2563EB",
            padding: "36px 30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `scale(${punch})`,
            boxShadow: `0 16px 48px rgba(37, 99, 235, 0.35)`,
          }}
        >
          {/* Dial / Metric */}
          <div
            style={{
              fontFamily: condensed,
              fontSize: 168,
              fontWeight: 900,
              color: "#60A5FA",
              lineHeight: 0.88,
              letterSpacing: -2,
              textShadow: `0 0 ${glow}px rgba(96, 165, 250, 0.6)`,
            }}
          >
            98%
          </div>

          <div
            style={{
              fontFamily: condensed,
              fontSize: 46,
              fontWeight: 900,
              color: "#FFFFFF",
              marginTop: 18,
              textAlign: "center",
              letterSpacing: 0.5,
            }}
          >
            LƯỢT DIFF &lt; 100 MILI-GIÂY
          </div>

          <div
            style={{
              fontFamily: sans,
              fontSize: 34,
              fontWeight: 500,
              color: "#93C5FD",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Nhận diện cú pháp siêu tốc
          </div>
        </div>

        {/* Bullet Points described in script */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Bullet 1: 98% lượt diff < 100ms */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: "rgba(96, 165, 250, 0.12)",
              border: "2px solid #3B82F6",
              borderRadius: 20,
              padding: "18px 24px",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#3B82F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              style={{
                fontFamily: condensed,
                fontSize: 40,
                fontWeight: 800,
                color: "#FFFFFF",
              }}
            >
              98% lượt diff &lt; 100ms
            </div>
          </div>

          {/* Bullet 2: Viết hoàn toàn bằng Rust */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: "rgba(234, 88, 12, 0.14)",
              border: "2px solid #EA580C",
              borderRadius: 20,
              padding: "18px 24px",
            }}
          >
            <Img
              src={staticFile(
                "videos/omnidiff-linux-git-diff/images/rust-crab-programming-pixabay-42880.png",
              )}
              style={{
                width: 44,
                height: 44,
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontFamily: condensed,
                fontSize: 40,
                fontWeight: 800,
                color: "#FB923C",
              }}
            >
              Viết hoàn toàn bằng Rust
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
