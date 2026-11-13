import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  DossierCard,
  FootageShot,
  HugeNumberOnBlack,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, mono, sans } from "../theme";

export const Scene6: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Fast cuts <= 1.5s (85 frames):
  // Beat 1: 0 - 80 (80f, 1.33s)
  // Beat 2: 80 - 165 (85f, 1.42s)
  // Beat 3: 165 - 250 (85f, 1.42s)
  // Beat 4: 250 - 335 (85f, 1.42s)
  // Beat 5: 335 - len (81f, 1.35s)

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black }}>
      {/* Beat 1: Key number slam on black */}
      {frame < 80 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="99"
            label="Bật chế độ đa ngôn ngữ"
            subtitle="Mặc định nhận tiếng Anh, cần bật Multi-language để nhận 99 ngôn ngữ"
            accentColor={PALETTE.cyan}
            badge="CÀI ĐẶT NGÔN NGỮ"
          />
        </AbsoluteFill>
      )}

      {/* Beat 2: Warning about default English only */}
      {frame >= 80 && frame < 165 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/programming-code-screen-pixabay-348042.mp4"
            len={85}
            startScale={1.02}
            endScale={1.12}
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
              title="Lưu Ý Mặc Định"
              badge="CẢNH BÁO CÀI ĐẶT"
              stamp="13.11.2026 • DEFAULT: ENGLISH ONLY"
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
                Mặc định khi mới cài Yogurt chỉ nhận diện tiếng Anh. Nếu họp bằng tiếng Việt, bạn bắt buộc phải đổi thiết lập.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.red,
                  marginTop: 6,
                }}
              >
                Cần bật chế độ Multi-language trước khi họp
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="LƯU Ý QUAN TRỌNG"
            text="Mặc định ứng dụng chỉ nhận tiếng Anh, cần bật Multi-language"
            delay={0}
            accentColor={PALETTE.red}
          />
        </AbsoluteFill>
      )}

      {/* Beat 3: Settings navigation card */}
      {frame >= 165 && frame < 250 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/programming-code-screen-pixabay-348042.mp4"
            len={85}
            startScale={1.12}
            endScale={1.22}
            objectPosition="center 20%"
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
              title="Thao Tác Cài Đặt Nhanh"
              badge="3 BƯỚC ĐƠN GIẢN"
              stamp="13.11.2026 • SETTINGS NAVIGATION"
              accent={PALETTE.green}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 34,
                    color: PALETTE.amber,
                    backgroundColor: "rgba(255,255,255,0.06)",
                    padding: "10px 16px",
                    borderRadius: 8,
                  }}
                >
                  Settings / Language / Spoken language
                </div>
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 36,
                    fontWeight: 700,
                    color: PALETTE.green,
                  }}
                >
                  ● Chọn: Multi-language
                </div>
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: 34,
                    color: PALETTE.textSecondary,
                  }}
                >
                  Hệ thống tự động nhận diện tiếng Việt và chuyển đổi tức thì
                </div>
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="HƯỚNG DẪN CÀI ĐẶT"
            text="Vào Settings / Language / Spoken language và chọn Multi-language"
            delay={0}
            accentColor={PALETTE.green}
          />
        </AbsoluteFill>
      )}

      {/* Beat 4: Audio waveform multi-language recognition */}
      {frame >= 250 && frame < 335 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/audio-sound-wave-equalizer-pixabay-149469.mp4"
            len={85}
            startScale={1.0}
            endScale={1.12}
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
              title="Nhận Diện Đa Ngôn Ngữ"
              badge="99 NGÔN NGỮ"
              stamp="13.11.2026 • WHISPER MULTI-LANG"
              accent={PALETTE.cyan}
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
                Bản tóm tắt theo ngôn ngữ chính của cuộc họp; câu trả lời theo ngôn ngữ của câu hỏi.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.cyan,
                  marginTop: 6,
                }}
              >
                Hỗ trợ 32 ngôn ngữ giao diện ứng dụng
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="TỰ ĐỘNG CHUYỂN ĐỔI"
            text="Hệ thống hỗ trợ 99 ngôn ngữ, thoải mái họp tiếng Việt"
            delay={0}
            accentColor={PALETTE.cyan}
          />
        </AbsoluteFill>
      )}

      {/* Beat 5: Huge number on black */}
      {frame >= 335 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="TIẾNG VIỆT"
            label="Họp tiếng Việt trơn tru"
            subtitle="Bóc băng chính xác 99 ngôn ngữ qua whisper.cpp"
            accentColor={PALETTE.green}
            badge="ĐA NGÔN NGỮ"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
