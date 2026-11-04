import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  ChapterCard,
  FootageShot,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, easeOut, mono, sans, serifDisplay } from "../theme";

const TITLE_LEN = 45;
const SHOT1_END = 350;

export const Scene5: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const isTitle = frame < TITLE_LEN;
  const isShot1 = frame >= TITLE_LEN && frame < SHOT1_END;
  const isShot2 = frame >= SHOT1_END;

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
          chapter="CHƯƠNG 05"
          title="HAI PHẢN ỨNG"
          subtitle="Thử nghiệm phân tích trên các mô hình AI"
          tag="THỰC NGHIỆM"
        />
      )}

      {isShot1 && (
        <>
          <FootageShot
            file="footage/artificial-intelligence-neural-network-pixabay-330028.mp4"
            len={SHOT1_END - TITLE_LEN}
            objectPosition="center center"
          />

          <div
            style={{
              position: "absolute",
              top: SAFE.top + 20,
              left: SAFE.left,
              right: SAFE.right,
              padding: "26px 28px",
              borderRadius: 16,
              backgroundColor: "rgba(25, 10, 14, 0.94)",
              border: `2px solid ${PALETTE.red}`,
              opacity: shot1In,
              transform: `translateY(${(1 - shot1In) * 16}px)`,
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.7)",
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
                  color: PALETTE.red,
                  letterSpacing: 1.2,
                }}
              >
                ASTRA & DAYBREAK BLUE
              </div>
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  backgroundColor: PALETTE.redBg,
                  fontFamily: mono,
                  fontSize: 34,
                  fontWeight: 700,
                  color: PALETTE.red,
                }}
              >
                ⛔ TỪ CHỐI
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
              Kích hoạt rủi ro an toàn sinh học
            </div>

            <div
              style={{
                width: 100,
                height: 3,
                backgroundColor: PALETTE.red,
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
                • Lý do:{" "}
                <span style={{ color: PALETTE.red, fontWeight: 600 }}>
                  Safety risks around biological research
                </span>
              </div>
              <div>
                • Dù kỹ sư đã giải thích đây là mã mồi nhử anti-bot, AI vẫn từ chối.
              </div>
            </div>
          </div>

          <LowerThird
            delay={TITLE_LEN + 4}
            kicker="RÀO CẢN AN TOÀN"
            text="Astra và Daybreak Blue lập tức từ chối vì rủi ro sinh học"
          />
        </>
      )}

      {/* SHOT 2: Comparison Dashboard fully filling the vertical frame */}
      {isShot2 && (
        <AbsoluteFill
          style={{
            backgroundColor: PALETTE.bgDark,
            padding: `${SAFE.top + 10}px ${SAFE.right}px ${SAFE.bottom + 10}px ${SAFE.left}px`,
          }}
        >
          <div
            style={{
              opacity: shot2In,
              transform: `translateY(${(1 - shot2In) * 16}px)`,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Model 1: Astra Refused */}
            <div
              style={{
                padding: "24px 28px",
                borderRadius: 14,
                backgroundColor: "rgba(35, 12, 16, 0.94)",
                border: `2px solid ${PALETTE.red}`,
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
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 34,
                    fontWeight: 700,
                    color: PALETTE.red,
                  }}
                >
                  Astra / Daybreak Blue
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    backgroundColor: PALETTE.redBg,
                    fontFamily: mono,
                    fontSize: 34,
                    fontWeight: 700,
                    color: PALETTE.red,
                  }}
                >
                  ⛔ BỊ CHẶN
                </span>
              </div>

              <div
                style={{
                  fontFamily: serifDisplay,
                  fontSize: 44,
                  fontWeight: 700,
                  color: PALETTE.textPrimary,
                  lineHeight: 1.2,
                }}
              >
                Rào cản an toàn bị kích hoạt
              </div>

              <div
                style={{
                  fontFamily: sans,
                  fontSize: 34,
                  color: PALETTE.textMuted,
                  lineHeight: 1.4,
                }}
              >
                • Bị kích hoạt bởi từ khóa "ricin lethal dosage".
                <br />
                • Từ chối hỗ trợ dịch ngược do vi phạm quy tắc an toàn sinh học.
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 6,
                  backgroundColor: "rgba(255, 69, 58, 0.15)",
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.red,
                }}
              >
                Trạng thái: Sập bẫy anti-bot mồi nhử
              </div>
            </div>

            {/* Model 2: GLM-5.3 Succeeded */}
            <div
              style={{
                padding: "24px 28px",
                borderRadius: 14,
                backgroundColor: "rgba(14, 35, 20, 0.94)",
                border: `2px solid ${PALETTE.green}`,
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
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 34,
                    fontWeight: 700,
                    color: PALETTE.green,
                  }}
                >
                  Mô hình GLM-5.3
                </span>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    backgroundColor: PALETTE.greenBg,
                    fontFamily: mono,
                    fontSize: 34,
                    fontWeight: 700,
                    color: PALETTE.green,
                  }}
                >
                  ✅ THÀNH CÔNG
                </span>
              </div>

              <div
                style={{
                  fontFamily: serifDisplay,
                  fontSize: 44,
                  fontWeight: 700,
                  color: PALETTE.textPrimary,
                  lineHeight: 1.2,
                }}
              >
                Vượt qua bẫy & Xử lý mã nguồn
              </div>

              <div
                style={{
                  fontFamily: sans,
                  fontSize: 34,
                  color: PALETTE.textMuted,
                  lineHeight: 1.4,
                }}
              >
                • Phát hiện hàm mồi nhử không thực thi.
                <br />
                • Deobfuscate chính xác thuật toán canvas fingerprinting!
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 6,
                  backgroundColor: "rgba(48, 209, 88, 0.15)",
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.green,
                }}
              >
                Trạng thái: Giải mã thành công toàn bộ logic
              </div>
            </div>
          </div>

          <LowerThird
            delay={SHOT1_END + 4}
            kicker="KẾT QUẢ BẤT NGỜ"
            text="Nhưng sang GLM-5.3 thì AI này lại phân tích bình thường!"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
