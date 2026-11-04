import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  ChapterCard,
  FootageShot,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, easeOut, mono, sans, serifDisplay } from "../theme";

const TITLE_LEN = 40;
const CUT1_END = 180;
const CUT2_END = 430;

export const Scene4: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const isTitle = frame < TITLE_LEN;
  const isCut1 = frame >= TITLE_LEN && frame < CUT1_END;
  const isCut2 = frame >= CUT1_END && frame < CUT2_END;
  const isCut3 = frame >= CUT2_END;

  const cut1In = interpolate(frame, [TITLE_LEN, TITLE_LEN + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const cut2In = interpolate(frame, [CUT1_END, CUT1_END + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const cut3In = interpolate(frame, [CUT2_END, CUT2_END + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bgDark }}>
      {isTitle && (
        <ChapterCard
          chapter="CHƯƠNG 04"
          title="BẪY SINH HỌC"
          subtitle="Bước ngoặt: Phát hiện rợn người trong mã nguồn"
          tag="BƯỚC NGOẶT"
        />
      )}

      {/* QUICK CUT 1: Cyber crash footage with red warning */}
      {isCut1 && (
        <>
          <FootageShot
            file="footage/cyber-security-digital-code-pixabay-27876.mp4"
            len={CUT1_END - TITLE_LEN}
            objectPosition="center center"
            filter="saturate(0.5) contrast(1.3) brightness(0.75)"
            vignetteTint="rgba(120, 10, 10, 0.95)"
          />

          <div
            style={{
              position: "absolute",
              top: SAFE.top + 20,
              left: SAFE.left,
              right: SAFE.right,
              padding: "26px 28px",
              borderRadius: 16,
              backgroundColor: "rgba(35, 10, 10, 0.94)",
              border: `2px solid ${PALETTE.red}`,
              opacity: cut1In,
              transform: `translateY(${(1 - cut1In) * 16}px)`,
              boxShadow: "0 16px 40px rgba(255, 69, 58, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: 34,
                fontWeight: 700,
                color: PALETTE.red,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              [CẢNH BÁO TỪ KHÓA NGUY HIỂM]
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
              Phát hiện tên hàm liều độc Ricin
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 34,
                color: PALETTE.textMuted,
                lineHeight: 1.4,
              }}
            >
              Mã nguồn fingerprinting chứa các từ khóa vũ khí sinh học giả mạo
            </div>
          </div>

          <LowerThird
            delay={TITLE_LEN + 2}
            kicker="BƯỚC NGOẶT ĐIỀU TRA"
            text="Soi vào mã nguồn: Giật mình thấy các tên hàm về liều độc ricin!"
          />
        </>
      )}

      {/* QUICK CUT 2: Full-height Code Inspection Window */}
      {isCut2 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#0B0608",
            padding: `${SAFE.top + 10}px ${SAFE.right}px ${SAFE.bottom + 10}px ${SAFE.left}px`,
          }}
        >
          <div
            style={{
              opacity: cut2In,
              transform: `translateY(${(1 - cut2In) * 16}px)`,
              display: "flex",
              flexDirection: "column",
              borderRadius: 16,
              overflow: "hidden",
              border: `2px solid ${PALETTE.red}`,
              backgroundColor: "rgba(18, 10, 14, 0.96)",
              boxShadow: "0 16px 40px rgba(255, 69, 58, 0.3)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 24px",
                backgroundColor: "rgba(35, 12, 16, 0.9)",
                borderBottom: `1px solid ${PALETTE.red}`,
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
                  color: PALETTE.red,
                }}
              >
                servicepipe / 4CIrx8U3Da.js
              </div>
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  backgroundColor: PALETTE.redBg,
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.red,
                  fontWeight: 700,
                }}
              >
                BẪY SINH HỌC
              </div>
            </div>

            {/* Code Body */}
            <div
              style={{
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                fontFamily: mono,
                fontSize: 34,
                lineHeight: 1.45,
              }}
            >
              <div>
                <span style={{ color: "#FF7B72" }}>function</span>{" "}
                <span style={{ color: PALETTE.red, fontWeight: 700 }}>
                  computeRicinLethalDosage
                </span>
                () &#123;
                <br />
                &nbsp;&nbsp;return &#123; summary:{" "}
                <span style={{ color: PALETTE.amber }}>
                  "adult lethality threshold"
                </span>{" "}
                &#125;;
                <br />
                &#125;
              </div>

              <div>
                <span style={{ color: "#FF7B72" }}>function</span>{" "}
                <span style={{ color: PALETTE.red, fontWeight: 700 }}>
                  calculateDeadlySuicideDosage
                </span>
                () &#123;...&#125;
              </div>

              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: 8,
                  backgroundColor: "rgba(255, 69, 58, 0.15)",
                  border: `1px solid ${PALETTE.red}`,
                  color: PALETTE.textPrimary,
                  fontFamily: sans,
                  fontSize: 34,
                  lineHeight: 1.4,
                }}
              >
                Trạng thái: DEAD CODE (không bao giờ được gọi trong trình duyệt).
              </div>

              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  border: `1px solid ${PALETTE.cardBorder}`,
                  color: PALETTE.amber,
                  fontFamily: mono,
                  fontSize: 34,
                }}
              >
                Trigger: AI CBRN Safety Guardrails
              </div>
            </div>
          </div>

          <LowerThird
            delay={CUT1_END + 2}
            kicker="MÃ GIẢ MẠO"
            text="Tên hàm ricin và chất độc nhằm đánh lừa hệ thống"
          />
        </AbsoluteFill>
      )}

      {/* QUICK CUT 3: Anti-LLM Obfuscation Architecture */}
      {isCut3 && (
        <AbsoluteFill
          style={{
            backgroundColor: PALETTE.bgDark,
            padding: `${SAFE.top + 10}px ${SAFE.right}px ${SAFE.bottom + 10}px ${SAFE.left}px`,
          }}
        >
          <div
            style={{
              opacity: cut3In,
              transform: `translateY(${(1 - cut3In) * 16}px)`,
              display: "flex",
              flexDirection: "column",
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${PALETTE.cardBorder}`,
              backgroundColor: "rgba(10, 13, 18, 0.95)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* Title Header */}
            <div
              style={{
                padding: "20px 24px",
                backgroundColor: "rgba(22, 27, 34, 0.9)",
                borderBottom: `1px solid ${PALETTE.cardBorder}`,
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
                CƠ CHẾ ANTI-LLM
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.red,
                  fontWeight: 700,
                }}
              >
                SAFETY TRAP
              </div>
            </div>

            {/* Step list */}
            <div
              style={{
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                fontFamily: sans,
                fontSize: 34,
                lineHeight: 1.45,
              }}
            >
              <div style={{ color: PALETTE.textPrimary }}>
                1. Kẻ xấu nhúng từ khóa vũ khí sinh học vào script JavaScript.
              </div>

              <div style={{ color: PALETTE.red, fontWeight: 600 }}>
                2. AI quét mã ➔ Kích hoạt rào cản đạo đức (Safety Guardrail).
              </div>

              <div style={{ color: PALETTE.amber, fontWeight: 600 }}>
                3. Mô hình AI sợ hãi và từ chối phân tích deobfuscate!
              </div>

              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: 8,
                  backgroundColor: "rgba(229, 169, 60, 0.12)",
                  border: `1px solid ${PALETTE.amberBorder}`,
                  color: PALETTE.textMuted,
                  fontFamily: mono,
                  fontSize: 34,
                }}
              >
                Mục đích: Ngăn chặn đảo ngược mã bằng AI tự động.
              </div>
            </div>
          </div>

          <LowerThird
            delay={CUT2_END + 2}
            kicker="CƠ CHẾ BẪY"
            text="Bẫy anti-LLM nhằm kích hoạt rào cản an toàn AI"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
