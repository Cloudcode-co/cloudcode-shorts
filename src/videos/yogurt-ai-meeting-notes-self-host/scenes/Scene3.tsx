import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  DatePlaceStamp,
  DossierCard,
  FootageShot,
  HugeNumberOnBlack,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, mono, sans } from "../theme";

export const Scene3: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Fast cuts <= 1.5s (80 frames):
  // Beat 1: 0 - 80 (80f, 1.33s)
  // Beat 2: 80 - 160 (80f, 1.33s)
  // Beat 3: 160 - 240 (80f, 1.33s)
  // Beat 4: 240 - 320 (80f, 1.33s)
  // Beat 5: 320 - len (68f, 1.13s)

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black }}>
      {/* Beat 1: Contrast slam on black */}
      {frame < 80 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="NO BOT"
            label="Không cần bot tham gia cuộc gọi"
            subtitle="Otter.ai hay Fireflies buộc phải thả bot lạ vào phòng họp"
            accentColor={PALETTE.red}
            badge="BẢO MẬT PHÒNG HỌP"
          />
        </AbsoluteFill>
      )}

      {/* Beat 2: Real meeting office footage + warning about third-party bots */}
      {frame >= 80 && frame < 160 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/business-people-laptop-office-pixabay-268230.mp4"
            len={80}
            startScale={1.0}
            endScale={1.08}
          />
          <div
            style={{
              position: "absolute",
              top: SAFE.top + 40,
              left: SAFE.left,
              right: SAFE.right,
            }}
          >
            <DossierCard
              title="Vấn Đề Với Meeting Bot"
              badge="NGUY CƠ BẢO MẬT"
              stamp="13.11.2026 • ZOOM · TEAMS · MEET"
              accent={PALETTE.red}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 36,
                  fontWeight: 600,
                  color: PALETTE.textPrimary,
                  lineHeight: 1.35,
                }}
              >
                Các dịch vụ SaaS như Otter hay Fireflies buộc phải mời một tài khoản bot lạ tham gia cuộc gọi để thu âm.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.red,
                  marginTop: 6,
                }}
              >
                ● Rủi ro lộ dữ liệu khi mời bot bên thứ ba
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="ĐỐI CHIẾU OTTER.AI"
            text="Thường thì các công cụ phải thả bot vào phòng gây phiền phức..."
            delay={0}
            accentColor={PALETTE.red}
          />
        </AbsoluteFill>
      )}

      {/* Beat 3: Audio waveform footage + native capture explanation */}
      {frame >= 160 && frame < 240 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/audio-sound-wave-equalizer-pixabay-149469.mp4"
            len={80}
            startScale={1.0}
            endScale={1.1}
          />
          <DatePlaceStamp
            date="13.11.2026"
            place="AUDIO CAPTURE"
            top={SAFE.top}
            right={SAFE.right}
          />
          <div
            style={{
              position: "absolute",
              top: SAFE.top + 76,
              left: SAFE.left,
              right: SAFE.right,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(10, 14, 22, 0.94)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                borderLeft: `6px solid ${PALETTE.green}`,
                padding: "22px 26px",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  fontWeight: 700,
                  color: PALETTE.green,
                }}
              >
                KÊNH 01: MICROPHONE
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 36,
                  fontWeight: 600,
                  color: PALETTE.textPrimary,
                  marginTop: 4,
                }}
              >
                Ghi âm trực tiếp giọng nói từ micro của bạn
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(10, 14, 22, 0.94)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                borderLeft: `6px solid ${PALETTE.cyan}`,
                padding: "22px 26px",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  fontWeight: 700,
                  color: PALETTE.cyan,
                }}
              >
                KÊNH 02: SYSTEM AUDIO (LOA)
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 36,
                  fontWeight: 600,
                  color: PALETTE.textPrimary,
                  marginTop: 4,
                }}
              >
                Bắt luồng âm thanh phát ra từ người khác trong phòng họp
              </div>
            </div>
          </div>
          <LowerThird
            kicker="GHI ÂM TRỰC TIẾP"
            text="Yogurt bắt trực tiếp luồng âm thanh loa và micro ở cấp hệ điều hành"
            delay={0}
            accentColor={PALETTE.green}
          />
        </AbsoluteFill>
      )}

      {/* Beat 4: Side-by-side comparison */}
      {frame >= 240 && frame < 320 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/business-people-laptop-office-pixabay-268230.mp4"
            len={80}
            startScale={1.12}
            endScale={1.22}
            objectPosition="center 70%"
          />
          <div
            style={{
              position: "absolute",
              top: SAFE.top + 40,
              left: SAFE.left,
              right: SAFE.right,
            }}
          >
            <DossierCard
              title="So Sánh Thu Âm Cuộc Họp"
              badge="BẢO MẬT"
              stamp="13.11.2026 • SO SÁNH BẢO MẬT"
              accent={PALETTE.green}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div
                  style={{
                    backgroundColor: "rgba(255, 69, 58, 0.12)",
                    borderRadius: 12,
                    border: `1px solid ${PALETTE.redBg}`,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 34,
                      fontWeight: 700,
                      color: PALETTE.red,
                      border: `1px solid ${PALETTE.red}`,
                      borderRadius: 8,
                      padding: "4px 10px",
                    }}
                  >
                    BOT
                  </div>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 34, fontWeight: 700, color: PALETTE.red }}>
                      Otter / Fireflies
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 36, color: PALETTE.textSecondary }}>
                      Thả bot lạ vào phòng họp
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(48, 209, 88, 0.12)",
                    borderRadius: 12,
                    border: `1px solid ${PALETTE.greenBg}`,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 34,
                      fontWeight: 700,
                      color: PALETTE.green,
                      border: `1px solid ${PALETTE.green}`,
                      borderRadius: 8,
                      padding: "4px 10px",
                    }}
                  >
                    LOCAL
                  </div>
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 34, fontWeight: 700, color: PALETTE.green }}>
                      Yogurt
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 36, fontWeight: 700, color: PALETTE.textPrimary }}>
                      Bắt trực tiếp loa & micro máy tính
                    </div>
                  </div>
                </div>
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="HOÀN TOÀN KÍN ĐÁO"
            text="Không có bất kỳ tài khoản bot lạ nào xuất hiện trong phòng họp"
            delay={0}
            accentColor={PALETTE.cyan}
          />
        </AbsoluteFill>
      )}

      {/* Beat 5: Huge number on black */}
      {frame >= 320 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="0 BOT"
            label="Kín đáo & bảo mật 100%"
            subtitle="Hỗ trợ đầy đủ Zoom, Microsoft Teams và Google Meet"
            accentColor={PALETTE.green}
            badge="BẢO MẬT CUỘC GỌI"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
