import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Terminal } from "../../../kit/Terminal";
import {
  DatePlaceStamp,
  DossierCard,
  FootageShot,
  HugeNumberOnBlack,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, mono, sans } from "../theme";

export const Scene8: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Fast cuts <= 1.5s (85 frames):
  // Beat 1: 0 - 80 (80f, 1.33s) - Huge 32,671 ★
  // Beat 2: 80 - 165 (85f, 1.42s) - Meetily Repo Dossier
  // Beat 3A: 165 - 250 (85f, 1.42s) - Terminal clone & cd
  // Beat 3B: 250 - 335 (85f, 1.42s) - Terminal install & build-gpu
  // Beat 4: 335 - 420 (85f, 1.42s) - Rust + Tauri Architecture
  // Beat 5: 420 - len (84f, 1.40s) - Key badge on black

  const cmdsPart1 = [
    "git clone https://github.com/Zackriya-Solutions/meetily",
    "cd meetily/frontend",
  ];

  const cmdsPart2 = [
    "pnpm install --frozen-lockfile",
    "./build-gpu.sh",
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black }}>
      {/* Beat 1: Key number slam on black - 32,671 ★ */}
      {frame < 80 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="32,671 ★"
            label="Meetily: Giải pháp AI họp bằng Rust"
            subtitle="Dự án mã nguồn mở cực kỳ nổi tiếng trên GitHub"
            accentColor={PALETTE.amber}
            badge="LỰA CHỌN THAY THẾ"
          />
        </AbsoluteFill>
      )}

      {/* Beat 2: Meetily repo dossier card */}
      {frame >= 80 && frame < 165 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/programming-code-screen-pixabay-348042.mp4"
            len={85}
            startScale={1.0}
            endScale={1.09}
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
              title="Zackriya-Solutions / meetily"
              badge="RUST + TAURI"
              stamp="13.11.2026 • ZACKRIYA/MEETILY"
              accent={PALETTE.amber}
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
                  src={staticFile("videos/yogurt-ai-meeting-notes-self-host/repos/Zackriya-Solutions.png")}
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
                    Privacy-First AI Meeting Notes
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 34,
                      color: PALETTE.amber,
                    }}
                  >
                    32,671 ★ • Whisper + Parakeet • MIT
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
                Giải pháp thay thế Granola và Otter.ai viết bằng Rust, tối ưu cho anh em thích tự build trên Linux.
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="LỰA CHỌN THAY THẾ"
            text="Nếu anh em muốn tự biên dịch trên Linux bằng Rust và Tauri..."
            delay={0}
            accentColor={PALETTE.amber}
          />
        </AbsoluteFill>
      )}

      {/* Beat 3A: Terminal clone command */}
      {frame >= 165 && frame < 250 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/programming-code-screen-pixabay-348042.mp4"
            len={85}
            startScale={1.08}
            endScale={1.16}
            objectPosition="center 20%"
          />
          <div
            style={{
              position: "absolute",
              top: SAFE.top + 40,
              left: SAFE.left,
              right: SAFE.right,
              backgroundColor: "rgba(10, 14, 22, 0.94)",
              borderRadius: 18,
              border: `1px solid ${PALETTE.cardBorder}`,
              borderLeft: `6px solid ${PALETTE.amber}`,
              padding: "20px 24px",
              boxShadow: "0 24px 54px rgba(0, 0, 0, 0.75)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: 10,
                marginBottom: 12,
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 34, color: PALETTE.amber, fontWeight: 700 }}>
                ● BƯỚC 1: CLONE MÃ NGUỒN
              </span>
              <span style={{ fontFamily: mono, fontSize: 34, color: PALETTE.textMuted }}>
                LINUX BASH
              </span>
            </div>
            <Terminal
              cmds={cmdsPart1}
              fontSize={36}
              minHeight={200}
              bg="transparent"
              accent={PALETTE.amber}
            />
          </div>
          <LowerThird
            kicker="BIÊN DỊCH TRÊN LINUX"
            text="...thì Meetily cho phép tải repo và biên dịch trực tiếp"
            delay={0}
            accentColor={PALETTE.amber}
          />
        </AbsoluteFill>
      )}

      {/* Beat 3B: Terminal install and GPU build script */}
      {frame >= 250 && frame < 335 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/programming-code-screen-pixabay-348042.mp4"
            len={85}
            startScale={1.16}
            endScale={1.24}
            objectPosition="center 40%"
          />
          <div
            style={{
              position: "absolute",
              top: SAFE.top + 40,
              left: SAFE.left,
              right: SAFE.right,
              backgroundColor: "rgba(10, 14, 22, 0.94)",
              borderRadius: 18,
              border: `1px solid ${PALETTE.cardBorder}`,
              borderLeft: `6px solid ${PALETTE.green}`,
              padding: "20px 24px",
              boxShadow: "0 24px 54px rgba(0, 0, 0, 0.75)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: 10,
                marginBottom: 12,
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 34, color: PALETTE.green, fontWeight: 700 }}>
                ● BƯỚC 2: BUILD TĂNG TỐC GPU
              </span>
              <span style={{ fontFamily: mono, fontSize: 34, color: PALETTE.textMuted }}>
                BUILD SCRIPT
              </span>
            </div>
            <Terminal
              cmds={cmdsPart2}
              fontSize={36}
              minHeight={200}
              bg="transparent"
              accent={PALETTE.green}
            />
          </div>
          <LowerThird
            kicker="TỐI ƯU CARD ĐỒ HỌA"
            text="Cài đặt dependencies và chạy script ./build-gpu.sh để tăng tốc"
            delay={0}
            accentColor={PALETTE.green}
          />
        </AbsoluteFill>
      )}

      {/* Beat 4: Model & Tech Stack Card */}
      {frame >= 335 && frame < 420 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/developer-working-on-macbook-pixabay-3145.mp4"
            len={85}
            startScale={1.0}
            endScale={1.1}
          />
          <DatePlaceStamp
            date="13.11.2026"
            place="MEETILY STACK"
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
                borderLeft: `6px solid ${PALETTE.amber}`,
                padding: "22px 26px",
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
                CORE: RUST + TAURI
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
                Siêu nhẹ, tiêu tốn ít RAM và bảo mật tuyệt đối
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
                MODELS: WHISPER & PARAKEET
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
                Hỗ trợ cả mô hình Parakeet của NVIDIA cực nhanh
              </div>
            </div>
          </div>
          <LowerThird
            kicker="TÙY CHỌN MÃ NGUỒN MỞ"
            text="Hỗ trợ đầy đủ Whisper và Parakeet, tối ưu trên cả Linux"
            delay={0}
            accentColor={PALETTE.cyan}
          />
        </AbsoluteFill>
      )}

      {/* Beat 5: Huge number on black */}
      {frame >= 420 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="RUST + TAURI"
            label="Hiệu năng cao & On-Device"
            subtitle="Một lựa chọn thay thế mã nguồn mở tuyệt vời cho anh em Linux"
            accentColor={PALETTE.amber}
            badge="MÃ NGUỒN MỞ LINUX"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
