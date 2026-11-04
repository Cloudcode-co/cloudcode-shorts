import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  ChapterCard,
  LowerThird,
  Vignette,
} from "../components/Documentary";
import { PALETTE, SAFE, easeOut, mono, sans, serifDisplay } from "../theme";

const TITLE_LEN = 45;
const SHOT1_END = 390;

export const Scene3: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const isTitle = frame < TITLE_LEN;
  const isShot1 = frame >= TITLE_LEN && frame < SHOT1_END;
  const isShot2 = frame >= SHOT1_END;

  // Slow push-ins for proof images
  const scale1 = interpolate(frame, [TITLE_LEN, SHOT1_END], [1.02, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tighter zoom to focus exclusively on the golden wave
  const scale2 = interpolate(frame, [SHOT1_END, len], [1.42, 1.52], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shot1In = interpolate(frame, [TITLE_LEN, TITLE_LEN + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const shot2In = interpolate(frame, [SHOT1_END, SHOT1_END + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDark }}>
      {isTitle && (
        <ChapterCard
          chapter="CHƯƠNG 03"
          title="KHU VƯỜN CANVAS"
          subtitle="Triển lãm 1.033 mẫu tại fingerprint.garden"
          tag="PHÁT HIỆN"
        />
      )}

      {/* SHOT 1: Collage of 1,033 canvases */}
      {isShot1 && (
        <AbsoluteFill style={{ backgroundColor: PALETTE.bgDark }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              transform: `scale(${scale1})`,
              transformOrigin: "center center",
            }}
          >
            <Img
              src={staticFile("videos/canvas-fingerprinting-anti-llm/pages/p1-2.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 64%",
                filter: "saturate(0.7) contrast(1.15) brightness(0.65)",
              }}
            />
          </div>
          <Vignette />

          {/* Gallery Header Card */}
          <div
            style={{
              position: "absolute",
              top: SAFE.top + 20,
              left: SAFE.left,
              right: SAFE.right,
              padding: "26px 28px",
              borderRadius: 16,
              backgroundColor: PALETTE.cardBg,
              border: `1px solid ${PALETTE.cardBorder}`,
              opacity: shot1In,
              transform: `translateY(${(1 - shot1In) * 16}px)`,
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
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
                FINGERPRINT.GARDEN
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.green,
                  fontWeight: 700,
                }}
              >
                1.033 MẪU CANVAS
              </div>
            </div>

            <div
              style={{
                fontFamily: serifDisplay,
                fontSize: 48,
                fontWeight: 700,
                color: PALETTE.textPrimary,
                lineHeight: 1.25,
                textWrap: "balance",
              }}
            >
              Triển lãm trực tuyến 1.033 dấu vân tay
            </div>

            <div
              style={{
                fontFamily: sans,
                fontSize: 34,
                color: PALETTE.textMuted,
                lineHeight: 1.45,
              }}
            >
              Tập hợp các hình vẽ canvas từ FingerprintJS, Castle và các anti-bot lớn
            </div>
          </div>

          <LowerThird
            delay={TITLE_LEN + 4}
            kicker="BỘ SƯU TẬP"
            text="Gom được 1.033 canvas trên trang fingerprint.garden"
          />
        </AbsoluteFill>
      )}

      {/* SHOT 2: Zoomed exclusively into the golden wave artwork */}
      {isShot2 && (
        <AbsoluteFill style={{ backgroundColor: "#000000" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              transform: `scale(${scale2})`,
              transformOrigin: "center 12%",
            }}
          >
            <Img
              src={staticFile("videos/canvas-fingerprinting-anti-llm/pages/p1-3.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 12%",
                filter: "saturate(0.95) contrast(1.2) brightness(0.85)",
              }}
            />
          </div>

          {/* Bottom mask to ensure no blog text is visible */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 700,
              background: "linear-gradient(to top, #000000 65%, transparent)",
            }}
          />

          <Vignette intensity={0.85} />

          {/* Exhibition Identification Badge */}
          <div
            style={{
              position: "absolute",
              top: SAFE.top + 20,
              left: SAFE.left,
              right: SAFE.right,
              padding: "26px 28px",
              borderRadius: 16,
              backgroundColor: "rgba(10, 13, 18, 0.92)",
              border: `2px solid ${PALETTE.amber}`,
              opacity: shot2In,
              transform: `translateY(${(1 - shot2In) * 16}px)`,
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
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
                }}
              >
                NGUỒN GỐC SCRIPT
              </div>
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  backgroundColor: "rgba(229, 169, 60, 0.2)",
                  fontFamily: mono,
                  fontSize: 34,
                  fontWeight: 700,
                  color: PALETTE.amber,
                }}
              >
                TAME IMPALA WAVE
              </div>
            </div>

            <div
              style={{
                fontFamily: serifDisplay,
                fontSize: 48,
                fontWeight: 700,
                color: PALETTE.textPrimary,
                lineHeight: 1.25,
                textWrap: "balance",
              }}
            >
              Canvas sóng dẫn tới servicepipe.tech
            </div>

            <div
              style={{
                fontFamily: mono,
                fontSize: 34,
                color: PALETTE.amber,
                wordBreak: "break-all",
              }}
            >
              servicepipe.tech/static/checkjs/06b667...
            </div>
          </div>

          <LowerThird
            delay={SHOT1_END + 4}
            kicker="MANH MỐI QUAN TRỌNG"
            text="Một canvas vẽ sóng cực đẹp dẫn thẳng tới script của servicepipe.tech"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
