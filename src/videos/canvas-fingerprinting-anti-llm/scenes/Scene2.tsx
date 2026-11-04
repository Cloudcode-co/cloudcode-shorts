import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  ChapterCard,
  FootageShot,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, easeOut, mono, sans, serifDisplay } from "../theme";

const TITLE_LEN = 45;
const SHOT1_END = 370;

export const Scene2: React.FC<{ len: number }> = ({ len }) => {
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
          chapter="CHƯƠNG 02"
          title="CUỘC ĐIỀU TRA DIỆN RỘNG"
          subtitle="Quét 10.000 website với Playwright"
          tag="THU THẬP DỮ LIỆU"
        />
      )}

      {/* SHOT 1: Full-height Crawler Monitor Console */}
      {isShot1 && (
        <>
          <FootageShot
            file="footage/server-room-data-center-pixabay-171185.mp4"
            len={SHOT1_END - TITLE_LEN}
            objectPosition="center center"
          />

          <div
            style={{
              position: "absolute",
              top: SAFE.top + 16,
              left: SAFE.left,
              right: SAFE.right,
              padding: "26px 28px",
              borderRadius: 16,
              backgroundColor: PALETTE.cardBg,
              border: `1px solid ${PALETTE.cardBorder}`,
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
                  color: PALETTE.amber,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                PLAYWRIGHT CRAWLER
              </div>
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: 6,
                  backgroundColor: "rgba(48, 209, 88, 0.2)",
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.green,
                  fontWeight: 700,
                }}
              >
                10.000 WEBSITES
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
              Quét diện rộng danh sách Tranco Top Sites
            </div>

            <div
              style={{
                width: 100,
                height: 3,
                backgroundColor: PALETTE.amber,
                borderRadius: 2,
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontFamily: sans,
                fontSize: 34,
                color: PALETTE.textMuted,
                lineHeight: 1.4,
              }}
            >
              <div>
                • Mục tiêu:{" "}
                <span style={{ color: PALETTE.textPrimary, fontWeight: 600 }}>
                  10.000 tên miền phổ biến nhất
                </span>
              </div>
              <div>
                • Phương pháp:{" "}
                <span style={{ color: PALETTE.amber }}>
                  Playwright tự động hóa trình duyệt
                </span>
              </div>
            </div>

            {/* Live Crawler Console Log filling vertical space */}
            <div
              style={{
                marginTop: 4,
                padding: "16px 20px",
                borderRadius: 10,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: `1px solid ${PALETTE.cardBorder}`,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontFamily: mono,
                fontSize: 34,
                color: PALETTE.textMuted,
                lineHeight: 1.35,
              }}
            >
              <div style={{ color: PALETTE.green, fontWeight: 700 }}>
                ● CRAWLER: ĐANG CHẠY (10.000 / 10.000)
              </div>
              <div>[HOOK] navigator.webdriver =&gt; undefined</div>
              <div>[HOOK] canvas.toDataURL() =&gt; intercepted</div>
              <div style={{ color: PALETTE.amber }}>
                [RESULT] Thu được 1.033 mẫu canvas độc lập
              </div>
            </div>
          </div>

          <LowerThird
            delay={TITLE_LEN + 4}
            kicker="TIẾP CẬN DIỆN RỘNG"
            text="Một kỹ sư dùng Playwright quét 10.000 website từ danh sách Tranco"
          />
        </>
      )}

      {/* SHOT 2: Full-height Code Inspection Terminal Window */}
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
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${PALETTE.cardBorder}`,
              backgroundColor: "rgba(10, 13, 18, 0.95)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* Terminal Window Header */}
            <div
              style={{
                padding: "16px 24px",
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
                }}
              >
                hooks/fingerprint.js
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.green,
                }}
              >
                PLAYWRIGHT HOOK
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
                lineHeight: 1.5,
              }}
            >
              <div>
                <span style={{ color: "#7EE787" }}>// 1. Hook hàm toDataURL</span>
                <br />
                <span style={{ color: PALETTE.amber }}>HTMLCanvasElement</span>
                .prototype.
                <span style={{ color: "#79C0FF", fontWeight: 700 }}>toDataURL</span> =
                hookFn;
              </div>

              <div>
                <span style={{ color: "#7EE787" }}>// 2. Ẩn dấu vết Playwright bot</span>
                <br />
                <span style={{ color: "#FF7B72" }}>delete</span> window.navigator.
                <span style={{ color: "#79C0FF", fontWeight: 700 }}>webdriver</span>;
              </div>

              <div>
                <span style={{ color: "#7EE787" }}>// 3. Lọc bỏ canvas đồ họa thông thường</span>
                <br />
                filterBenignCanvases(pixelData);
              </div>
            </div>

            {/* Status Footer */}
            <div
              style={{
                padding: "18px 24px",
                backgroundColor: "rgba(229, 169, 60, 0.1)",
                borderTop: `1px solid ${PALETTE.amberBorder}`,
                fontFamily: sans,
                fontSize: 34,
                color: PALETTE.textPrimary,
                lineHeight: 1.4,
              }}
            >
              Chỉ lưu giữ lại các mẫu script trích xuất dữ liệu phần cứng.
            </div>
          </div>

          <LowerThird
            delay={SHOT1_END + 4}
            kicker="KỸ THUẬT HOOK"
            text="Hook toDataURL, xóa cờ webdriver và lọc ảnh đồ họa thông thường"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
