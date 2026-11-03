import type { FC } from "react";
import { Img } from "remotion";
import { display, mono, sans, videoAsset } from "../../../kit";
import { CutoutCard, PageSlam, SlamItem, SPOT, Stamp, Tape, ZineHeadline } from "../zine";

export const Scene9: FC<{ slug: string; len: number }> = ({ slug }) => {
  const avatarUrl = videoAsset(slug, "repos/peach-mitao.png");

  return (
    <PageSlam dark baseRotate={-0.6}>
      <div>
        <ZineHeadline rotate={1.8} size={82} dark>
          LƯU LẠI & THEO DÕI
          <br />
          <span style={{ color: SPOT }}>KHÁM PHÁ TOOL HAY</span>
        </ZineHeadline>
      </div>

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Beat 1: Save video bookmark card */}
        <SlamItem delay={15} rotate={-1.8}>
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="18px 24px"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <div>
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>ACTION 01</div>
              <div style={{ fontFamily: sans, fontSize: 32, fontWeight: 800, color: "#111111" }}>
                Lưu video để tự host ở nhà
              </div>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 22,
                fontWeight: 800,
                background: SPOT,
                color: "#FFFFFF",
                padding: "8px 16px",
              }}
            >
              SAVE 🔖
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 2: Peach Cutout Logo with Stars */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SlamItem delay={55} rotate={2} style={{ position: "relative" }}>
            <Tape rotate={-10} style={{ position: "absolute", top: -14, left: 14, zIndex: 10 }} />
            <CutoutCard
              bg="#FFFFFF"
              borderWidth={4}
              shadowDist={10}
              padding="18px 28px"
              style={{ display: "flex", alignItems: "center", gap: 22 }}
            >
              <Img src={avatarUrl} style={{ width: 120, height: 120, objectFit: "contain" }} />
              <div>
                <div style={{ fontFamily: display, fontSize: 44, fontWeight: 800, color: "#111111", lineHeight: 1 }}>
                  PEACH
                </div>
                <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 800, color: SPOT, marginTop: 4 }}>
                  14,224 ★ GITHUB
                </div>
                <div style={{ fontFamily: mono, fontSize: 18, color: "#555555" }}>
                  peach-mitao/peach
                </div>
              </div>
            </CutoutCard>
          </SlamItem>
        </div>

        {/* Beat 3: Follow @cloudcode card */}
        <SlamItem delay={105} rotate={-2} style={{ position: "relative" }}>
          <Tape rotate={8} color="spot" style={{ position: "absolute", top: -12, right: 18, zIndex: 10 }} />
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={4}
            shadowDist={10}
            padding="22px 26px"
            style={{
              borderLeft: `12px solid ${SPOT}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontFamily: mono, fontSize: 16, color: SPOT, fontWeight: 700 }}>
                ACTION 02 // STAY UPDATED
              </div>
              <div style={{ fontFamily: sans, fontSize: 34, fontWeight: 800, color: "#111111", marginTop: 4 }}>
                Bấm Follow kênh ngay!
              </div>
              <div style={{ fontFamily: sans, fontSize: 22, color: "#555555", marginTop: 2 }}>
                Khám phá thêm nhiều công cụ mã nguồn mở
              </div>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 22,
                fontWeight: 800,
                background: "#111111",
                color: "#FFFFFF",
                padding: "10px 18px",
              }}
            >
              FOLLOW +
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 4 & 5: Big closing stamp */}
        <SlamItem delay={160} rotate={-5} style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <Stamp
            text="TỰ HOST PEACH NGAY HÔM NAY"
            subtext="THE LOCAL-FIRST METADATA MANAGER"
            size={36}
            color={SPOT}
          />
        </SlamItem>
      </div>
    </PageSlam>
  );
};
