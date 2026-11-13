import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  DatePlaceStamp,
  DossierCard,
  FootageShot,
  HugeNumberOnBlack,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, mono, sans, serifDisplay } from "../theme";

export const Scene4: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Fast cuts <= 1.5s (85 frames):
  // Beat 1: 0 - 80 (80f, 1.33s)
  // Beat 2: 80 - 160 (80f, 1.33s)
  // Beat 3: 160 - 245 (85f, 1.42s)
  // Beat 4: 245 - 330 (85f, 1.42s)
  // Beat 5: 330 - 415 (85f, 1.42s)
  // Beat 6: 415 - len (78f, 1.30s) - Pre-drop tension build

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black }}>
      {/* Beat 1: Architecture slam on black */}
      {frame < 80 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="WHISPER + LLAMA"
            label="Kiến trúc 2 tầng On-Device"
            subtitle="Toàn bộ quy trình bóc băng và tóm tắt thực hiện cục bộ"
            accentColor={PALETTE.purple}
            badge="KIẾN TRÚC AI NỘI BỘ"
          />
        </AbsoluteFill>
      )}

      {/* Beat 2: Audio waveform + whisper.cpp Speech-to-Text */}
      {frame >= 80 && frame < 160 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/audio-sound-wave-equalizer-pixabay-149469.mp4"
            len={80}
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
              title="whisper.cpp Bóc Băng"
              badge="SPEECH-TO-TEXT"
              stamp="13.11.2026 • WHISPER.CPP"
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
                Mô hình Whisper large-v3-turbo bóc băng giọng nói thành văn bản trực tiếp theo thời gian thực.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.cyan,
                  marginTop: 6,
                }}
              >
                Tích hợp Apple SpeechAnalyzer trên macOS
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="BƯỚC 1: BÓC BĂNG"
            text="whisper.cpp bóc băng âm thanh cuộc gọi ngay tại chỗ trên máy"
            delay={0}
            accentColor={PALETTE.cyan}
          />
        </AbsoluteFill>
      )}

      {/* Beat 3: Code screen + llama.cpp local LLM */}
      {frame >= 160 && frame < 245 && (
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
              title="llama.cpp Tóm Tắt"
              badge="LOCAL INFERENCE"
              stamp="13.11.2026 • LLAMA.CPP"
              accent={PALETTE.purple}
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
                llama.cpp tải mô hình ngôn ngữ lớn để tổng hợp nội dung, trích xuất ý chính và trả lời câu hỏi.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.purple,
                  marginTop: 6,
                }}
              >
                Không gửi bất kỳ dữ liệu nào ra máy chủ bên ngoài
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="BƯỚC 2: TỔNG HỢP NỘI DUNG"
            text="Sau đó llama.cpp chạy mô hình LLM tại chỗ để tóm tắt cuộc họp"
            delay={0}
            accentColor={PALETTE.purple}
          />
        </AbsoluteFill>
      )}

      {/* Beat 4: Model showcase (Gemma 4 & Qwen3) */}
      {frame >= 245 && frame < 330 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/programming-code-screen-pixabay-348042.mp4"
            len={85}
            startScale={1.1}
            endScale={1.2}
            objectPosition="center 70%"
          />
          <DatePlaceStamp
            date="13.11.2026"
            place="OPEN-WEIGHT MODELS"
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
                MÔ HÌNH 01: GEMMA 4
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
                Dòng mô hình mã nguồn mở thế hệ mới hiệu quả cao
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
                MÔ HÌNH 02: QWEN3
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
                Khả năng suy luận đa ngôn ngữ xuất sắc
              </div>
            </div>
          </div>
          <LowerThird
            kicker="MÔ HÌNH MÃ NGUỒN MỞ"
            text="Hỗ trợ dòng Gemma 4 và Qwen3, tự động chọn theo cấu hình máy"
            delay={0}
            accentColor={PALETTE.amber}
          />
        </AbsoluteFill>
      )}

      {/* Beat 5: Pipeline diagram */}
      {frame >= 330 && frame < 415 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/audio-sound-wave-equalizer-pixabay-149469.mp4"
            len={85}
            startScale={1.15}
            endScale={1.25}
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
              title="Chu Trình Xử Lý Khép Kín"
              badge="100% PRIVATE"
              stamp="13.11.2026 • LOCAL PIPELINE"
              accent={PALETTE.green}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontSize: 38,
                  fontWeight: 700,
                  color: PALETTE.textPrimary,
                  lineHeight: 1.4,
                }}
              >
                Loa & Micro ➔ whisper.cpp ➔ llama.cpp ➔ Bản ghi & Tóm tắt
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.green,
                  marginTop: 6,
                }}
              >
                Dữ liệu không bao giờ rời khỏi thiết bị cá nhân
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="QUY TRÌNH NỘI BỘ"
            text="Dữ liệu âm thanh và văn bản không bao giờ bị tải lên cloud"
            delay={0}
            accentColor={PALETTE.green}
          />
        </AbsoluteFill>
      )}

      {/* Beat 6: Pre-drop tension riser */}
      {frame >= 415 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/computer-motherboard-ram-chip-pixabay-333588.mp4"
            len={len - 415}
            startScale={1.0}
            endScale={1.22}
            filter="saturate(0.9) contrast(1.3) brightness(0.9)"
          />
          <div
            style={{
              position: "absolute",
              top: SAFE.top + 60,
              left: SAFE.left,
              right: SAFE.right,
              backgroundColor: "rgba(0, 0, 0, 0.92)",
              borderRadius: 18,
              border: `2px solid ${PALETTE.red}`,
              padding: "30px 32px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontSize: 34,
                color: PALETTE.amber,
                marginBottom: 10,
              }}
            >
              ● 13.11.2026 • HARDWARE LIMIT
            </div>
            <div
              style={{
                fontFamily: serifDisplay,
                fontSize: 48,
                fontWeight: 800,
                color: PALETTE.red,
                lineHeight: 1.25,
              }}
            >
              YÊU CẦU PHẦN CỨNG MÁY TÍNH?
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 36,
                color: PALETTE.textSecondary,
                marginTop: 10,
              }}
            >
              Liệu laptop văn phòng bình thường có gánh nổi?
            </div>
          </div>
          <LowerThird
            kicker="ĐIỀU KIỆN TIÊN QUYẾT"
            text="Để chạy mượt các mô hình AI này, máy tính cần phần cứng gì?"
            delay={0}
            accentColor={PALETTE.red}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
