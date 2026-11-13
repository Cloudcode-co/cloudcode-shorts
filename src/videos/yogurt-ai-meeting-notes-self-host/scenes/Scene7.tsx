import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  DossierCard,
  FootageShot,
  HugeNumberOnBlack,
  LowerThird,
} from "../components/Documentary";
import { PALETTE, SAFE, mono, sans } from "../theme";

export const Scene7: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Fast cuts <= 1.5s (80 frames):
  // Beat 1: 0 - 80 (80f, 1.33s)
  // Beat 2: 80 - 160 (80f, 1.33s)
  // Beat 3: 160 - 240 (80f, 1.33s)
  // Beat 4: 240 - 320 (80f, 1.33s)
  // Beat 5: 320 - len (68f, 1.13s)

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.black }}>
      {/* Beat 1: Key limitation slam on black */}
      {frame < 80 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="macOS ONLY"
            label="Nhận diện tên người phát biểu"
            subtitle="Tính năng đọc tên người nói trên Zoom và Meet hiện chỉ có trên Mac"
            accentColor={PALETTE.amber}
            badge="ĐIỂM GIỚI HẠN"
          />
        </AbsoluteFill>
      )}

      {/* Beat 2: Developer working on macbook footage */}
      {frame >= 80 && frame < 160 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/developer-working-on-macbook-pixabay-3145.mp4"
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
              title="Nhận Diện Tên Người Nói"
              badge="macOS ĐỘC QUYỀN"
              stamp="13.11.2026 • macOS 14.4+"
              accent={PALETTE.amber}
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
                Nhờ quyền Accessibility, Yogurt nhận diện ai đang phát biểu trực tiếp trên giao diện Zoom, Teams và Meet.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.amber,
                  marginTop: 6,
                }}
              >
                Tích hợp đọc lịch họp macOS Calendar
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="ĐIỂM GIỚI HẠN"
            text="Nhận diện tên người nói trên Zoom hay Meet hiện chỉ có trên macOS"
            delay={0}
            accentColor={PALETTE.amber}
          />
        </AbsoluteFill>
      )}

      {/* Beat 3: OS Compatibility comparison table */}
      {frame >= 160 && frame < 240 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/developer-working-on-macbook-pixabay-3145.mp4"
            len={80}
            startScale={1.08}
            endScale={1.16}
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
              title="Tính Năng Theo Hệ Điều Hành"
              badge="SO SÁNH OS"
              stamp="13.11.2026 • HỖ TRỢ NỀN TẢNG"
              accent={PALETTE.cyan}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                  style={{
                    backgroundColor: "rgba(48, 209, 88, 0.12)",
                    borderRadius: 12,
                    border: `1px solid ${PALETTE.greenBg}`,
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 34, fontWeight: 700, color: PALETTE.green }}>
                      macOS (Apple Silicon)
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 36, color: PALETTE.textPrimary }}>
                      Đọc tên người nói + Đồng bộ lịch họp
                    </div>
                  </div>
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
                    FULL
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 12,
                    border: `1px solid ${PALETTE.cardBorder}`,
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: mono, fontSize: 34, fontWeight: 700, color: PALETTE.textMuted }}>
                      Windows 10+ / Linux x64
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 36, color: PALETTE.textSecondary }}>
                      Ghi âm tốt, chưa hỗ trợ đọc tên
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 34,
                      fontWeight: 700,
                      color: PALETTE.amber,
                      border: `1px solid ${PALETTE.amber}`,
                      borderRadius: 8,
                      padding: "4px 10px",
                    }}
                  >
                    BETA
                  </div>
                </div>
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="SO SÁNH HỆ ĐIỀU HÀNH"
            text="Người dùng Windows và Linux ghi âm tốt nhưng chưa đọc được tên"
            delay={0}
            accentColor={PALETTE.cyan}
          />
        </AbsoluteFill>
      )}

      {/* Beat 4: Local MCP server integration */}
      {frame >= 240 && frame < 320 && (
        <AbsoluteFill>
          <FootageShot
            file="footage/developer-working-on-macbook-pixabay-3145.mp4"
            len={80}
            startScale={1.16}
            endScale={1.24}
            objectPosition="center 30%"
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
              title="Tích Hợp MCP Cục Bộ"
              badge="READ-ONLY SOCKET"
              stamp="13.11.2026 • MCP SERVER"
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
                Model Context Protocol (MCP) cấp quyền chỉ đọc cho trợ lý AI khác kết nối truy vấn nội dung cuộc họp an toàn.
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  color: PALETTE.purple,
                  marginTop: 6,
                }}
              >
                Hỗ trợ Claude Desktop, Cursor và AI Agents
              </div>
            </DossierCard>
          </div>
          <LowerThird
            kicker="KẾT NỐI AI ASSISTANT"
            text="Đi kèm máy chủ MCP cục bộ chế độ read-only tiện lợi"
            delay={0}
            accentColor={PALETTE.purple}
          />
        </AbsoluteFill>
      )}

      {/* Beat 5: Huge number on black */}
      {frame >= 320 && (
        <AbsoluteFill>
          <HugeNumberOnBlack
            number="MCP"
            label="Model Context Protocol"
            subtitle="Kết nối an toàn với Claude Desktop, Cursor và các trợ lý AI"
            accentColor={PALETTE.purple}
            badge="KẾT NỐI MỞ RỘNG"
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
