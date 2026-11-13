import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import {
  DatePlaceStamp,
  DossierCard,
  FootageShot,
  HugeNumberOnBlack,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, mono, sans } from "../theme";

export const Scene2: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Fast cuts <= 1.5s (90 frames):
  // Beat 1: 0 - 80 (80f, 1.33s)
  // Beat 2: 80 - 170 (90f, 1.5s)
  // Beat 3: 170 - 260 (90f, 1.5s)
  // Beat 4: 260 - len (98f, 1.63s)

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black }}>
      {/* Beat 1: Key number slam on black */}
      {frame < 80 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="0₫"
            label="Chi phí máy chủ VPS"
            subtitle="Yogurt không cần VPS: Chạy offline 100% trên máy tính"
            accentColor={PALETTE.green}
            badge="BẢN QUYỀN MIỄN PHÍ MIT"
          />
        </AbsoluteFill>
      )}

      {/* Beat 2: Stock footage + FrigadeHQ/yogurt repo dossier card */}
      {frame >= 80 && frame < 170 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/programming-code-screen-pixabay-348042.mp4"
            len={90}
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
              title="FrigadeHQ / yogurt"
              badge="1,097 ★"
              stamp="13.11.2026 • FRIGADEHQ/YOGURT"
              accent={PALETTE.cyan}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginTop: 6,
                }}
              >
                <Img
                  src={staticFile("videos/yogurt-ai-meeting-notes-self-host/repos/FrigadeHQ.png")}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 16,
                    border: `1px solid ${PALETTE.cardBorder}`,
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div
                    style={{
                      fontFamily: sans,
                      fontSize: 36,
                      fontWeight: 700,
                      color: PALETTE.textPrimary,
                    }}
                  >
                    Private AI Meeting Notes
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 34,
                      color: PALETTE.amber,
                    }}
                  >
                    TypeScript • MIT License • v0.3.11
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 36,
                  color: PALETTE.textSecondary,
                  lineHeight: 1.35,
                  marginTop: 8,
                }}
              >
                Ứng dụng desktop đóng gói bằng Electron, chạy offline hoàn toàn trên máy tính cá nhân.
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="ỨNG DỤNG CỤC BỘ"
            text="Thực ra Yogurt không cần VPS: Đây là app Electron chạy trên máy"
            delay={0}
            accentColor={PALETTE.cyan}
          />
        </AbsoluteFill>
      )}

      {/* Beat 3: Technical 3-point architecture card */}
      {frame >= 170 && frame < 260 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/programming-code-screen-pixabay-348042.mp4"
            len={90}
            startScale={1.08}
            endScale={1.16}
            objectPosition="center 30%"
          />
          <DatePlaceStamp
            date="13.11.2026"
            place="ELECTRON ARCHITECTURE"
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
                padding: "20px 24px",
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
                01. ELECTRON DESKTOP APP
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
                Cài đặt trực tiếp trên macOS, Windows và Linux
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(10, 14, 22, 0.94)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                borderLeft: `6px solid ${PALETTE.amber}`,
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  fontWeight: 700,
                  color: PALETTE.amber,
                }}
              >
                02. MÃ NGUỒN MỞ MIT
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
                Hoàn toàn miễn phí, không tốn tiền API hay thuê cloud
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(10, 14, 22, 0.94)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.12)",
                borderLeft: `6px solid ${PALETTE.cyan}`,
                padding: "20px 24px",
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
                03. ZERO ACCOUNT
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
                Không cần tạo tài khoản hay đăng nhập hệ thống
              </div>
            </div>
          </div>
          <LowerThird
            kicker="ĐẶC ĐIỂM KIẾN TRÚC"
            text="Ứng dụng Electron cục bộ, giấy phép MIT và không cần tài khoản"
            delay={0}
            accentColor={PALETTE.green}
          />
        </AbsoluteFill>
      )}

      {/* Beat 4: Huge number on black */}
      {frame >= 260 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="100%"
            label="Offline trên máy cá nhân"
            subtitle="Không gửi dữ liệu lên server ngoài, không cần tài khoản"
            accentColor={PALETTE.cyan}
            badge="BẢO MẬT DỮ LIỆU"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
