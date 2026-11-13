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

export const Scene5: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Turning Point with quick cuts:
  // Beat 0: 0 - 9 (9f): Tension hold before drop at 25.101s
  // Beat 1: 9 - 90 (81f, 1.35s): DROP HIT - Huge "8 GB RAM"
  // Beat 2: 90 - 175 (85f, 1.42s): RAM & Motherboard footage
  // Beat 3: 175 - 260 (85f, 1.42s): Huge "5 GB" Model download
  // Beat 4: 260 - 345 (85f, 1.42s): Hardware specs breakdown
  // Beat 5: 345 - len (90f, 1.5s): 100% Local data confirmation

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black }}>
      {/* Beat 0: 9 frames of tension hold */}
      {frame < 9 && <AbsoluteFill style={{ backgroundColor: "#000000" }} />}

      {/* Beat 1: DROP HIT! Key number slam on black */}
      {frame >= 9 && frame < 90 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="8 GB RAM"
            label="Yêu cầu phần cứng tối thiểu"
            subtitle="Máy cần ít nhất 8 GB RAM để chạy đồng thời whisper và llama"
            accentColor={PALETTE.amber}
            badge="ĐIỀU KIỆN PHẦN CỨNG"
          />
        </AbsoluteFill>
      )}

      {/* Beat 2: Hardware chip footage + local storage proof */}
      {frame >= 90 && frame < 175 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/computer-motherboard-ram-chip-pixabay-333588.mp4"
            len={85}
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
              title="Dữ Liệu Không Rời Máy"
              badge="LOCAL ONLY"
              stamp="13.11.2026 • SYSTEM MEMORY"
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
                Âm thanh, bản bóc băng và tóm tắt được mã hóa lưu trữ trực tiếp trên ổ cứng nội bộ của máy.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.green,
                  marginTop: 6,
                }}
              >
                Zero Cloud Upload • Bảo mật tuyệt đối
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="ĐIỀU KIỆN VẬN HÀNH"
            text="Vì dữ liệu không gửi lên mạng, nên máy cần ít nhất 8 GB RAM..."
            delay={0}
            accentColor={PALETTE.amber}
          />
        </AbsoluteFill>
      )}

      {/* Beat 3: Huge number on black - 5 GB model */}
      {frame >= 175 && frame < 260 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="5 GB"
            label="Dung lượng mô hình ban đầu"
            subtitle="Tải một lần lúc cài đặt, sau đó hoạt động hoàn toàn offline"
            accentColor={PALETTE.cyan}
            badge="TẢI MỘT LẦN"
          />
        </AbsoluteFill>
      )}

      {/* Beat 4: Technical hardware breakdown */}
      {frame >= 260 && frame < 345 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/computer-motherboard-ram-chip-pixabay-333588.mp4"
            len={85}
            startScale={1.1}
            endScale={1.22}
            objectPosition="center 30%"
          />
          <DatePlaceStamp
            date="13.11.2026"
            place="HARDWARE SPECS"
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
                BỘ NHỚ: TỐI THIỂU 8 GB RAM
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
                Hỗ trợ chip Apple Silicon, Intel/AMD x64
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
                MÔ HÌNH: 5 GB ĐẾN 14 GB+
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
                Tải bản khởi đầu 5 GB, máy mạnh có thể tải bản 14 GB
              </div>
            </div>
          </div>
          <LowerThird
            kicker="TẢI MÔ HÌNH BAN ĐẦU"
            text="...để tải mô hình ban đầu khoảng 5 GB về máy chạy nội bộ"
            delay={0}
            accentColor={PALETTE.cyan}
          />
        </AbsoluteFill>
      )}

      {/* Beat 5: Proof card on black */}
      {frame >= 345 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="LOCAL ONLY"
            label="Dữ liệu lưu hoàn toàn trên máy"
            subtitle="Không có bất kỳ bản ghi âm hay ghi chép nào bị đồng bộ lên cloud"
            accentColor={PALETTE.green}
            badge="BẢO ĐẢM QUYỀN RIÊNG TƯ"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
