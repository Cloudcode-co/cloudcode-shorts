import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Terminal, Meme } from "../../../kit";
import { condensed, mono, sans, SAFE } from "../palette";

// Scene 8: Install OmniDiff via Homebrew
export const SceneInstall: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const contentIn = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const termW = 1080 - SAFE.left - (SAFE.right + 24);

  return (
    <AbsoluteFill style={{ backgroundColor: "#080E18", overflow: "hidden" }}>
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
              color: "#F59E0B",
              letterSpacing: 1.5,
              marginBottom: 8,
            }}
          >
            HƯỚNG DẪN CÀI ĐẶT
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
            CÀI ĐẶT QUA HOMEBREW
          </div>
        </div>

        {/* Terminal typing command */}
        <div style={{ opacity: contentIn, display: "flex", flexDirection: "column", gap: 14 }}>
          <Terminal
            cmds={["brew install ivankovic/omnidiff/omnidiff"]}
            width={termW}
            fontSize={27}
            minHeight={250}
            bg="#0F172A"
            fg="#F1F5F9"
            accent="#F59E0B"
          />

          <div
            style={{
              fontFamily: sans,
              fontSize: 26,
              fontWeight: 500,
              color: "#94A3B8",
              textAlign: "center",
            }}
          >
            Hỗ trợ Linux, macOS (Intel &amp; Apple Silicon) và Windows
          </div>
        </div>

        {/* Alternative install options from facts.json */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            borderRadius: 20,
            border: "1px solid #1E293B",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            opacity: contentIn,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: "#F59E0B" }}>
            LỰA CHỌN KHÁC:
          </div>
          <div style={{ fontFamily: mono, fontSize: 20, color: "#CBD5E1" }}>
            • cargo install --locked omnidiff
          </div>
          <div style={{ fontFamily: mono, fontSize: 20, color: "#CBD5E1" }}>
            • .deb cho Debian/Ubuntu • nix run
          </div>
        </div>

        {/* Cat typing meme and Homebrew badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(15, 23, 42, 0.7)",
            borderRadius: 24,
            padding: "16px 20px",
            border: "1px solid #1E293B",
            opacity: contentIn,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 36 }}>🍺</span>
            <div>
              <div style={{ fontFamily: condensed, fontSize: 32, fontWeight: 800, color: "#FFFFFF" }}>
                Homebrew Tap chính thức
              </div>
              <div style={{ fontFamily: mono, fontSize: 20, color: "#94A3B8" }}>
                ivankovic/omnidiff
              </div>
            </div>
          </div>

          <div style={{ position: "relative", width: 110, height: 75 }}>
            <Meme
              slug="omnidiff-linux-git-diff"
              file="memes/cat-typing-giphy-WUlplcMpOCEmTGBtBW.gif"
              width={110}
              height={75}
              style={{ position: "relative", width: 110, height: 75, borderRadius: 12 }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
