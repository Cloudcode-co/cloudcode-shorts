import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Brand, BRAND_SPACE } from "../../../kit/Brand";
import {
  DossierCard,
  FootageShot,
  HugeNumberOnBlack,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, mono, sans } from "../theme";

export const Scene1: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Fast cuts <= 1.5s (90 frames):
  // Beat 1: 0 - 75 (75f, 1.25s)
  // Beat 2: 75 - 165 (90f, 1.5s)
  // Beat 3: 165 - len (93f, 1.55s)

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black }}>
      {/* Beat 1: Datacenter stock footage with Brand and Center Investigation Card */}
      {frame < 75 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/server-datacenter-pixabay-171185.mp4"
            len={75}
            startScale={1.0}
            endScale={1.08}
          />
          <Brand />
          <div
            style={{
              position: "absolute",
              top: SAFE.top + BRAND_SPACE + 20,
              left: SAFE.left,
              right: SAFE.right,
            }}
          >
            <DossierCard
              title="Hồ Sơ: AI Ghi Âm Cuộc Họp"
              badge="KHẢO SÁT"
              stamp="13.11.2026 • CLOUD VPS"
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
                Nhiều lập trình viên nghĩ phải thuê VPS đắt đỏ hàng tháng để tự host mô hình AI họp.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.amber,
                  marginTop: 4,
                }}
              >
                Chi phí VPS GPU: $30 - $60+ / tháng
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="HIỂU LẦM PHỔ BIẾN"
            text="Anh em tính thuê VPS để tự host AI ghi âm cuộc họp ư?"
            delay={10}
            accentColor={PALETTE.red}
          />
        </AbsoluteFill>
      )}

      {/* Beat 2: Huge key question on black */}
      {frame >= 75 && frame < 165 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="THUÊ VPS?"
            label="Chi phí không cần thiết"
            subtitle="Nhiều anh em tưởng nhầm phải tốn tiền thuê máy chủ đám mây"
            accentColor={PALETTE.red}
            badge="CHI PHÍ CLOUD HỌP"
          />
        </AbsoluteFill>
      )}

      {/* Beat 3: Documentary turning shot */}
      {frame >= 165 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/server-datacenter-pixabay-171185.mp4"
            len={len - 165}
            startScale={1.12}
            endScale={1.22}
            objectPosition="center 40%"
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
              title="Sự Thật Hoàn Toàn Khác"
              badge="0₫ TIỀN VPS"
              stamp="13.11.2026 • SỰ THẬT TỰ HOST"
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
                Không cần thuê bất kỳ máy chủ nào. Giải pháp AI mới chạy thẳng 100% trên chip máy tính cá nhân.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.green,
                  marginTop: 6,
                }}
              >
                ● Tiết kiệm 100% chi phí hạ tầng
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="SỰ THẬT HOÀN TOÀN KHÁC"
            text="Không cần thuê VPS: Ứng dụng chạy trực tiếp trên máy tính"
            delay={0}
            accentColor={PALETTE.green}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
