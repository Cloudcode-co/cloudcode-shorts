import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import {
  DossierCard,
  FootageShot,
  HugeNumberOnBlack,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, mono, sans, serifDisplay } from "../theme";

export const Scene9: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Fast cuts <= 1.5s (85-90 frames):
  // Beat 1: 0 - 80 (80f, 1.33s) - Huge 0₫ VPS
  // Beat 2: 80 - 165 (85f, 1.42s) - Datacenter footage & zero leak
  // Beat 3: 165 - 255 (90f, 1.5s) - 3-step action checklist
  // Beat 4: 255 - 345 (90f, 1.5s) - Call to action card
  // Beat 5: 345 - len (127f, 2.1s) - Final documentary closing showcase

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black }}>
      {/* Beat 1: Key number slam on black - 0₫ VPS */}
      {frame < 80 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="0₫ VPS"
            label="Tiết kiệm 100% chi phí"
            subtitle="Tận dụng máy tính cá nhân thay vì tốn tiền thuê VPS hàng tháng"
            accentColor={PALETTE.green}
            badge="TỔNG KẾT"
          />
        </AbsoluteFill>
      )}

      {/* Beat 2: Datacenter footage + zero cloud bill proof */}
      {frame >= 80 && frame < 165 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/server-datacenter-pixabay-171185.mp4"
            len={85}
            startScale={1.05}
            endScale={1.15}
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
              title="Bảo Mật & Miễn Phí"
              badge="KHÔNG TỐN PHÍ"
              stamp="13.11.2026 • ZERO CLOUD BILL"
              accent={PALETTE.green}
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
                Không tốn tiền thuê VPS, không phí API và không bao giờ lo lộ thông tin cuộc họp nhạy cảm.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.green,
                  marginTop: 6,
                }}
              >
                100% Local Processing • Quyền riêng tư tuyệt đối
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="LỜI KHUYÊN CUỐI"
            text="Nhớ lưu video để cài thử lúc rảnh, theo dõi kênh mình nhé!"
            delay={0}
            accentColor={PALETTE.green}
          />
        </AbsoluteFill>
      )}

      {/* Beat 3: 3-step action checklist */}
      {frame >= 165 && frame < 255 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/developer-working-on-macbook-pixabay-3145.mp4"
            len={90}
            startScale={1.0}
            endScale={1.1}
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
              title="Các Bước Triển Khai"
              badge="3 BƯỚC ĐƠN GIẢN"
              stamp="13.11.2026 • HÀNH ĐỘNG NGAY"
              accent={PALETTE.amber}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: mono, fontSize: 34, color: PALETTE.green, fontWeight: 700 }}>
                    01.
                  </span>
                  <span style={{ fontFamily: sans, fontSize: 36, fontWeight: 600, color: PALETTE.textPrimary }}>
                    Tải Yogurt hoặc build Meetily
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: mono, fontSize: 34, color: PALETTE.cyan, fontWeight: 700 }}>
                    02.
                  </span>
                  <span style={{ fontFamily: sans, fontSize: 36, fontWeight: 600, color: PALETTE.textPrimary }}>
                    Bật Spoken language: Multi-language
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: mono, fontSize: 34, color: PALETTE.amber, fontWeight: 700 }}>
                    03.
                  </span>
                  <span style={{ fontFamily: sans, fontSize: 36, fontWeight: 600, color: PALETTE.textPrimary }}>
                    Ghi âm và tóm tắt họp 100% offline
                  </span>
                </div>
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="TRIỂN KHAI NHANH"
            text="...và đừng tốn tiền thuê VPS ghi âm họp nữa nhé!"
            delay={0}
            accentColor={PALETTE.green}
          />
        </AbsoluteFill>
      )}

      {/* Beat 4: Big CTA slam on black */}
      {frame >= 255 && frame < 345 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="LƯU VIDEO"
            label="Theo dõi kênh để xem thêm"
            subtitle="Tự cài đặt AI họp trên máy tính, khỏi tốn tiền thuê VPS"
            accentColor={PALETTE.amber}
            badge="HÀNH ĐỘNG NGAY"
          />
        </AbsoluteFill>
      )}

      {/* Beat 5: Final documentary closing card */}
      {frame >= 345 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#000000",
            padding: `${SAFE.top + 30}px ${SAFE.right}px ${SAFE.bottom + 30}px ${SAFE.left}px`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: 34,
              fontWeight: 700,
              color: PALETTE.green,
              borderBottom: "1px solid rgba(255, 255, 255, 0.16)",
              paddingBottom: 14,
              width: "100%",
            }}
          >
            ● OPEN SOURCE AI MEETING NOTES
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              margin: "auto 0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 48,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Img
                  src={staticFile("videos/yogurt-ai-meeting-notes-self-host/repos/FrigadeHQ.png")}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 24,
                    border: `2px solid ${PALETTE.cardBorder}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 34,
                    fontWeight: 600,
                    color: PALETTE.textPrimary,
                  }}
                >
                  Yogurt
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Img
                  src={staticFile("videos/yogurt-ai-meeting-notes-self-host/repos/Zackriya-Solutions.png")}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 24,
                    border: `2px solid ${PALETTE.cardBorder}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 34,
                    fontWeight: 600,
                    color: PALETTE.textPrimary,
                  }}
                >
                  Meetily
                </span>
              </div>
            </div>

            <div
              style={{
                fontFamily: serifDisplay,
                fontSize: 50,
                fontWeight: 800,
                color: PALETTE.textPrimary,
                lineHeight: 1.25,
                maxWidth: 700,
                textWrap: "balance",
              }}
            >
              Ghi Âm & Tóm Tắt Cục Bộ
            </div>

            <div
              style={{
                fontFamily: sans,
                fontSize: 36,
                fontWeight: 500,
                color: PALETTE.textMuted,
                maxWidth: 680,
                textWrap: "balance",
              }}
            >
              Bảo mật 100% • Miễn phí • Không cần VPS
            </div>
          </div>

          <div
            style={{
              fontFamily: mono,
              fontSize: 34,
              color: PALETTE.textMuted,
              borderTop: "1px solid rgba(255, 255, 255, 0.16)",
              paddingTop: 14,
              width: "100%",
            }}
          >
            YOGURT & MEETILY • MIT LICENSE
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
