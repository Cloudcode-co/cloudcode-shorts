import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  ChapterCard,
  FootageShot,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, easeOut, mono, sans, serifDisplay } from "../theme";

const TITLE_LEN = 45;
const SHOT1_END = 290;

export const Scene7: React.FC<{ len: number }> = ({ len }) => {
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
          chapter="CHƯƠNG 07"
          title="BÀI HỌC KẾT LUẬN"
          subtitle="Giải pháp dịch ngược JavaScript an toàn"
          tag="KẾT LUẬN"
        />
      )}

      {/* SHOT 1: Babel AST Solution Architecture */}
      {isShot1 && (
        <AbsoluteFill
          style={{
            backgroundColor: PALETTE.bgDark,
            padding: `${SAFE.top + 10}px ${SAFE.right}px ${SAFE.bottom + 10}px ${SAFE.left}px`,
          }}
        >
          <div
            style={{
              opacity: shot1In,
              transform: `translateY(${(1 - shot1In) * 16}px)`,
              display: "flex",
              flexDirection: "column",
              borderRadius: 16,
              overflow: "hidden",
              border: `2px solid ${PALETTE.green}`,
              backgroundColor: "rgba(10, 18, 14, 0.95)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 24px",
                backgroundColor: "rgba(16, 32, 22, 0.9)",
                borderBottom: `1px solid ${PALETTE.green}`,
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
                  color: PALETTE.green,
                }}
              >
                BABEL AST TRAVERSAL
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.green,
                }}
              >
                GIẢI PHÁP AN TOÀN
              </div>
            </div>

            {/* Content */}
            <div
              style={{
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                fontFamily: sans,
                fontSize: 34,
                lineHeight: 1.45,
              }}
            >
              <div style={{ color: PALETTE.red }}>
                ⛔ Không phụ thuộc mù quáng vào AI vì dễ dính bẫy an toàn hoặc prompt injection.
              </div>

              <div style={{ color: PALETTE.green, fontWeight: 600 }}>
                ✅ Dùng Babel phân tích Abstract Syntax Tree (AST):
              </div>

              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  border: `1px solid ${PALETTE.cardBorder}`,
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.amber,
                }}
              >
                traverse(ast, &#123; CallExpression(path) &#123;...&#125; &#125;)
              </div>

              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: 8,
                  backgroundColor: "rgba(48, 209, 88, 0.12)",
                  border: `1px solid ${PALETTE.green}`,
                  color: PALETTE.textPrimary,
                  fontSize: 34,
                }}
              >
                Tự động thay thế hàm giải mã chuỗi về dạng rõ ràng một cách độc lập và tin cậy!
              </div>
            </div>
          </div>

          <LowerThird
            delay={TITLE_LEN + 4}
            kicker="LỜI KHUYÊN"
            text="Muốn dịch ngược JavaScript an toàn, hãy dùng Babel xử lý AST"
          />
        </AbsoluteFill>
      )}

      {/* SHOT 2: Outro footage and Follow card */}
      {isShot2 && (
        <>
          <FootageShot
            file="footage/smiling-programmer-at-laptop-pixabay-117.mp4"
            len={len - SHOT1_END}
            objectPosition="50% 30%"
          />

          <div
            style={{
              position: "absolute",
              top: SAFE.top + 60,
              left: SAFE.left,
              right: SAFE.right,
              padding: "32px 30px",
              borderRadius: 16,
              backgroundColor: "rgba(10, 13, 18, 0.95)",
              border: `1.5px solid ${PALETTE.amberBorder}`,
              opacity: shot2In,
              transform: `translateY(${(1 - shot2In) * 16}px)`,
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
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
              TỔNG KẾT BẢO MẬT
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
              Hiểu sâu mã nguồn, làm chủ công nghệ
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
                gap: 12,
                fontFamily: sans,
                fontSize: 34,
                color: PALETTE.textMuted,
                lineHeight: 1.45,
              }}
            >
              <div>• Không phó mặc phân tích mã độc cho AI</div>
              <div>• Kết hợp phân tích AST và dịch ngược động</div>
              <div>• Cảnh giác trước các bẫy ẩn giấu tinh vi</div>
            </div>

            <div
              style={{
                marginTop: 8,
                padding: "16px 20px",
                borderRadius: 10,
                backgroundColor: "rgba(229, 169, 60, 0.16)",
                border: `1px solid ${PALETTE.amber}`,
                fontFamily: mono,
                fontSize: 34,
                color: PALETTE.amber,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Follow @cloudcode để đón xem video tiếp theo!
            </div>
          </div>

          <LowerThird
            delay={SHOT1_END + 4}
            kicker="KẾT NỐI"
            text="Follow để nghe những câu chuyện công nghệ tiếp theo nhé!"
          />
        </>
      )}
    </AbsoluteFill>
  );
};
