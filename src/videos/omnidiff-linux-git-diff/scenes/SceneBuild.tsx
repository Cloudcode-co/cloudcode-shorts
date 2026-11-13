import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { condensed, mono, sans, SAFE } from "../palette";
import { ChapterTitleCard } from "../components/CountdownComponents";

// Scene 2: Delta & Difftastic limitations
export const SceneBuild: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Shot 1 (Delta) vs Shot 2 (Difftastic) cut at frame 260
  const isDifftastic = frame >= 260;

  // Delta in/out
  const deltaIn = interpolate(frame, [34, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const deltaOut = interpolate(frame, [250, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Difftastic in
  const difftasticIn = interpolate(frame, [260, 274], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#060A12", overflow: "hidden" }}>
      {/* Chapter 2 Title Card for section pacing */}
      <ChapterTitleCard
        chapterNum="CHƯƠNG 02"
        title="SO KÈ ĐỐI THỦ"
        subtitle="Hạn chế của Delta và Difftastic"
        color="#F87171"
        duration={34}
      />

      {/* Developer typing stock clip as full background */}
      <AbsoluteFill style={{ opacity: 0.28 }}>
        <OffthreadVideo
          src={staticFile(
            "videos/omnidiff-linux-git-diff/footage/developer-working-on-computer-monitor-pixabay-3145.mp4",
          )}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          muted
        />
      </AbsoluteFill>

      {/* Dark gradient overlay */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(6,10,18,0.85) 0%, rgba(6,10,18,0.95) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          boxSizing: "border-box",
          width: 1080,
          height: 1920,
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom + 20,
          paddingLeft: SAFE.left,
          paddingRight: SAFE.right + 24,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top Header */}
        <div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 26,
              fontWeight: 700,
              color: "#F87171",
              letterSpacing: 1.5,
              marginBottom: 10,
            }}
          >
            PHÂN TÍCH ĐỐI THỦ
          </div>
          <div
            style={{
              fontFamily: condensed,
              fontSize: 66,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.05,
              textWrap: "balance",
            }}
          >
            HẠN CHẾ CỦA DELTA &amp; DIFFTASTIC
          </div>
        </div>

        {/* Shot 1: Delta Card */}
        {!isDifftastic && (
          <div
            style={{
              background: "#0F172A",
              borderRadius: 30,
              border: "2px solid #334155",
              padding: "36px 30px",
              opacity: deltaIn * (1 - deltaOut),
              transform: `translateY(${(1 - deltaIn) * 30 + deltaOut * -20}px)`,
              boxShadow: "0 20px 48px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Img
                  src={staticFile(
                    "videos/omnidiff-linux-git-diff/repos/dandavison.png",
                  )}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 20,
                    border: "2px solid #38BDF8",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: condensed,
                      fontSize: 46,
                      fontWeight: 900,
                      color: "#FFFFFF",
                    }}
                  >
                    Delta
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 22,
                      color: "#94A3B8",
                    }}
                  >
                    dandavison/delta
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "8px 16px",
                  borderRadius: 14,
                  border: "1px solid #38BDF8",
                  fontFamily: mono,
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                ★ 32,738
              </div>
            </div>

            <div
              style={{
                fontFamily: condensed,
                fontSize: 40,
                fontWeight: 800,
                color: "#38BDF8",
                marginBottom: 12,
              }}
            >
              Thuật toán Levenshtein
            </div>

            <div
              style={{
                fontFamily: sans,
                fontSize: 30,
                fontWeight: 500,
                color: "#CBD5E1",
                lineHeight: 1.4,
              }}
            >
              Chỉ so sánh từ từng dòng bằng Levenshtein, không phân tích cấu trúc cú pháp AST sâu.
            </div>
          </div>
        )}

        {/* Shot 2: Difftastic Card */}
        {isDifftastic && (
          <div
            style={{
              background: "#1E1214",
              borderRadius: 30,
              border: "2px solid #7F1D1D",
              padding: "36px 30px",
              opacity: difftasticIn,
              transform: `translateY(${(1 - difftasticIn) * 30}px)`,
              boxShadow: "0 20px 48px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Img
                  src={staticFile(
                    "videos/omnidiff-linux-git-diff/repos/Wilfred.png",
                  )}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 20,
                    border: "2px solid #F87171",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: condensed,
                      fontSize: 46,
                      fontWeight: 900,
                      color: "#FFFFFF",
                    }}
                  >
                    Difftastic
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 22,
                      color: "#FECACA",
                    }}
                  >
                    Wilfred/difftastic
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "8px 16px",
                  borderRadius: 14,
                  border: "1px solid #F87171",
                  fontFamily: mono,
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                ★ 26,198
              </div>
            </div>

            <div
              style={{
                fontFamily: condensed,
                fontSize: 40,
                fontWeight: 800,
                color: "#F87171",
                marginBottom: 12,
              }}
            >
              Đồ thị Dijkstra ngốn RAM
            </div>

            <div
              style={{
                fontFamily: sans,
                fontSize: 30,
                fontWeight: 500,
                color: "#FECDD3",
                lineHeight: 1.4,
              }}
            >
              Giải bài toán diff dưới dạng đồ thị tìm đường; file thay đổi lớn rất dễ ngốn cạn bộ nhớ RAM.
            </div>
          </div>
        )}

        {/* Bottom Insight */}
        <div
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            borderRadius: 20,
            border: "1px solid #334155",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: 26,
              fontWeight: 700,
              color: "#FACC15",
            }}
          >
            ⚡ Cần giải pháp: Cú pháp sâu nhưng tốc độ &lt; 100ms
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
