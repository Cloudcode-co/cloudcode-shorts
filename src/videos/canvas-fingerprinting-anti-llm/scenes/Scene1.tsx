import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Brand, BRAND_SPACE } from "../../../kit";
import {
  ChapterCard,
  FootageShot,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, easeOut, mono, sans, serifDisplay } from "../theme";

const TITLE_LEN = 42;

export const Scene1: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const showTitle = frame < TITLE_LEN;

  const contentIn = interpolate(frame, [TITLE_LEN, TITLE_LEN + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDark }}>
      {showTitle ? (
        <ChapterCard
          chapter="CHƯƠNG 01"
          title="MẬT MÃ DỌA AI"
          subtitle="Hiện tượng kỳ lạ trong mã nguồn JavaScript"
          tag="KHỞI ĐẦU"
        />
      ) : (
        <>
          <FootageShot
            file="footage/developer-at-desk-night-pixabay-232538.mp4"
            len={len - TITLE_LEN}
            objectPosition="50% 40%"
          />

          {/* Kit Brand lockup on dark background at SAFE.top */}
          <Brand />

          {/* Dossier Card filling the frame between Brand and LowerThird */}
          <div
            style={{
              position: "absolute",
              top: SAFE.top + BRAND_SPACE + 20,
              left: SAFE.left,
              right: SAFE.right,
              padding: "28px 30px",
              borderRadius: 16,
              backgroundColor: PALETTE.cardBg,
              border: `1px solid ${PALETTE.cardBorder}`,
              opacity: contentIn,
              transform: `translateY(${(1 - contentIn) * 16}px)`,
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  fontWeight: 700,
                  color: PALETTE.amber,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                HỒ SƠ BẢO MẬT
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.amber,
                  fontWeight: 600,
                }}
              >
                28.10.2026 • nullpt.rs
              </div>
            </div>

            <div
              style={{
                fontFamily: serifDisplay,
                fontSize: 50,
                fontWeight: 700,
                color: PALETTE.textPrimary,
                lineHeight: 1.25,
                textWrap: "balance",
              }}
            >
              Script Anti-Bot dọa AI từ chối đọc mã
            </div>

            <div
              style={{
                width: 100,
                height: 3,
                backgroundColor: PALETTE.amber,
                borderRadius: 2,
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                fontFamily: sans,
                fontSize: 34,
                color: PALETTE.textMuted,
                lineHeight: 1.45,
              }}
            >
              <div>
                • Khảo sát:{" "}
                <span style={{ color: PALETTE.textPrimary, fontWeight: 600 }}>
                  Canvas Fingerprinting & Playwright
                </span>
              </div>
              <div>
                • Hiện tượng: Mô hình AI từ chối dịch ngược do rào cản sinh học giả
              </div>
            </div>

            <div
              style={{
                marginTop: 6,
                padding: "12px 16px",
                borderRadius: 8,
                backgroundColor: "rgba(229, 169, 60, 0.12)",
                border: `1px solid ${PALETTE.amberBorder}`,
                fontFamily: mono,
                fontSize: 34,
                color: PALETTE.amber,
              }}
            >
              TRỌNG TÂM: Anti-LLM Obfuscation Trick
            </div>
          </div>

          <LowerThird
            delay={TITLE_LEN + 6}
            kicker="GHI CHÚ ĐIỀU TRA"
            text="Script JavaScript dọa AI từ chối đọc mã, anh em tin được không?"
          />
        </>
      )}
    </AbsoluteFill>
  );
};
