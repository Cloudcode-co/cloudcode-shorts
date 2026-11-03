import type { FC } from "react";
import { mono, sans } from "../../../kit";
import { CutoutCard, PageSlam, SlamItem, SPOT, Stamp, Tape, ZineHeadline } from "../zine";

export const Scene6: FC<{ len: number }> = () => {
  return (
    <PageSlam baseRotate={1.1}>
      <div>
        <ZineHeadline rotate={-1.5} size={76}>
          TRÌNH PHÁT LINH HOẠT
          <br />
          <span style={{ color: SPOT }}>KÈM TASK CENTER</span>
        </ZineHeadline>
      </div>

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Beat 1: Player Timeline Preview Card */}
        <SlamItem delay={12} rotate={-1.5} style={{ position: "relative" }}>
          <Tape rotate={-8} style={{ position: "absolute", top: -14, left: 16, zIndex: 10 }} />
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="18px 24px"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>BUILT-IN WEB PLAYER</div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 16,
                  fontWeight: 700,
                  background: "#111111",
                  color: "#FFFFFF",
                  padding: "4px 10px",
                }}
              >
                PREVIEW
              </div>
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 32,
                fontWeight: 800,
                color: "#111111",
                marginTop: 4,
              }}
            >
              Xem trước timeline khi tua video
            </div>

            {/* Timeline scrubber bar mockup */}
            <div
              style={{
                marginTop: 12,
                height: 12,
                background: "#E5E5E5",
                border: "2px solid #111111",
                position: "relative",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "48%",
                  background: SPOT,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "48%",
                  top: -6,
                  width: 12,
                  height: 24,
                  background: "#111111",
                }}
              />
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 2: Rotation & Speed tags */}
        <div style={{ display: "flex", gap: 16 }}>
          <SlamItem delay={45} rotate={2} style={{ flex: 1 }}>
            <CutoutCard bg="#FFFFFF" borderWidth={3} shadowDist={6} padding="14px 18px">
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>CONTROL</div>
              <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 800, color: "#111111", marginTop: 2 }}>
                XOAY 90°/180°
              </div>
              <div style={{ fontFamily: sans, fontSize: 18, color: "#555555" }}>Khớp mọi tỉ lệ</div>
            </CutoutCard>
          </SlamItem>

          <SlamItem delay={55} rotate={-2.5} style={{ flex: 1 }}>
            <CutoutCard bg="#FFFFFF" borderWidth={3} shadowDist={6} padding="14px 18px">
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>PLAYBACK SPEED</div>
              <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 800, color: SPOT, marginTop: 2 }}>
                0.5x → 2.0x
              </div>
              <div style={{ fontFamily: sans, fontSize: 18, color: "#555555" }}>Đổi tốc độ mượt mà</div>
            </CutoutCard>
          </SlamItem>
        </div>

        {/* Beat 3: Task Center & Resource Monitor */}
        <SlamItem delay={85} rotate={1}>
          <CutoutCard
            bg="#111111"
            borderWidth={3}
            shadowDist={8}
            padding="18px 24px"
            style={{ color: "#FFFFFF" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: mono, fontSize: 16, color: SPOT, fontWeight: 700 }}>
                TASK CENTER // MONITOR
              </div>
              <div style={{ fontFamily: mono, fontSize: 15, color: "#AAAAAA" }}>BACKGROUND TASKS</div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 16 }}>
                  <span>CPU LOAD</span>
                  <span style={{ color: SPOT, fontWeight: 700 }}>18%</span>
                </div>
                <div style={{ height: 8, background: "#333333", marginTop: 4, border: "1px solid #555555" }}>
                  <div style={{ width: "18%", height: "100%", background: "#FFFFFF" }} />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 16 }}>
                  <span>GPU ENCODE</span>
                  <span style={{ color: SPOT, fontWeight: 700 }}>24%</span>
                </div>
                <div style={{ height: 8, background: "#333333", marginTop: 4, border: "1px solid #555555" }}>
                  <div style={{ width: "24%", height: "100%", background: SPOT }} />
                </div>
              </div>
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 4: External Player Support Stamp */}
        <SlamItem delay={120} rotate={-2}>
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="16px 22px"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>EXTERNAL PLAYERS</div>
              <div style={{ fontFamily: sans, fontSize: 26, fontWeight: 700, color: "#111111" }}>
                Hỗ trợ PotPlayer, VLC, IINA, MPV
              </div>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 18,
                fontWeight: 700,
                border: "2px solid #111111",
                padding: "6px 12px",
              }}
            >
              1-CLICK
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 5: Rubber stamp */}
        <SlamItem delay={170} rotate={-4} style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <Stamp
            text="KIỂM SOÁT TOÀN DIỆN"
            subtext="MONITOR CPU, GPU & DOWNLOADS"
            size={36}
            color={SPOT}
          />
        </SlamItem>
      </div>
    </PageSlam>
  );
};
