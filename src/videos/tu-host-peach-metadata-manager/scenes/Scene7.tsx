import type { FC } from "react";
import { display, mono, sans } from "../../../kit";
import { CutoutCard, HalftoneScreen, PageSlam, SlamItem, SPOT, Stamp, Tape, ZineHeadline } from "../zine";

export const Scene7: FC<{ len: number }> = () => {
  return (
    <PageSlam baseRotate={-1.0}>
      <div>
        <ZineHeadline rotate={1.8} size={76}>
          TẢI MAGNET & THEO DÕI
          <br />
          <span style={{ color: SPOT }}>DIỄN VIÊN YÊU THÍCH</span>
        </ZineHeadline>
      </div>

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Beat 1: Magnet link download receipt ticket */}
        <SlamItem delay={8} rotate={-1.5} style={{ position: "relative" }}>
          <Tape rotate={-8} color="black" style={{ position: "absolute", top: -14, left: 20, zIndex: 10 }} />
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="18px 24px"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>DOWNLOAD MODULE</div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 16,
                  fontWeight: 700,
                  background: SPOT,
                  color: "#FFFFFF",
                  padding: "4px 10px",
                }}
              >
                MAGNET
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
              Tìm theo mã hoặc nạp link Magnet
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 18,
                color: "#555555",
                marginTop: 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              magnet:?xt=urn:btih:peach_media_download_task...
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 2 & 3: Performer Profile Card with Halftone Photo */}
        <div style={{ display: "flex", gap: 18 }}>
          <SlamItem delay={20} rotate={3} style={{ width: 220, position: "relative" }}>
            <Tape rotate={8} style={{ position: "absolute", top: -12, right: 12, zIndex: 10 }} />
            <CutoutCard
              bg="#FFFFFF"
              borderWidth={3}
              shadowDist={8}
              padding="14px"
              style={{
                height: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <HalftoneScreen size={8} dotRadius={2.8} opacity={0.3} />
              <div
                style={{
                  fontFamily: display,
                  fontSize: 48,
                  fontWeight: 800,
                  color: "#111111",
                  textAlign: "center",
                  lineHeight: 0.9,
                  zIndex: 2,
                }}
              >
                ACTOR
                <br />
                PROFILE
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: mono,
                  fontSize: 16,
                  fontWeight: 800,
                  background: SPOT,
                  color: "#FFFFFF",
                  padding: "4px 12px",
                  zIndex: 2,
                }}
              >
                ★ FOLLOWED
              </div>
            </CutoutCard>
          </SlamItem>

          <SlamItem delay={28} rotate={-1.5} style={{ flex: 1 }}>
            <CutoutCard
              bg="#FFFFFF"
              borderWidth={3}
              shadowDist={8}
              padding="18px 22px"
              style={{ height: 260, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <div>
                <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>CREATOR UPDATES</div>
                <div style={{ fontFamily: sans, fontSize: 28, fontWeight: 700, color: "#111111", marginTop: 4 }}>
                  Cập nhật phim mới từ diễn viên bạn theo dõi
                </div>
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 18,
                  color: SPOT,
                  fontWeight: 700,
                  borderTop: "2px dashed #DDDDDD",
                  paddingTop: 10,
                }}
              >
                FEED TỰ ĐỘNG THÔNG BÁO
              </div>
            </CutoutCard>
          </SlamItem>
        </div>

        {/* Beat 4: Want List checklist */}
        <SlamItem delay={60} rotate={1}>
          <CutoutCard
            bg="#111111"
            borderWidth={3}
            shadowDist={8}
            padding="16px 22px"
            style={{ color: "#FFFFFF" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: mono, fontSize: 16, color: SPOT }}>WANT LIST MANAGER</div>
              <div style={{ fontFamily: mono, fontSize: 15, color: "#AAAAAA" }}>ORGANIZE</div>
            </div>
            <div style={{ fontFamily: sans, fontSize: 28, fontWeight: 700, marginTop: 4 }}>
              Quản lý danh sách muốn xem & kho phim
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 5: Rubber stamp */}
        <SlamItem delay={95} rotate={-4} style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <Stamp
            text="TỰ ĐỘNG TỔ CHỨC VÀO THƯ VIỆN"
            subtext="FROM MAGNET TO ORGANIZED MEDIA"
            size={36}
            color={SPOT}
          />
        </SlamItem>
      </div>
    </PageSlam>
  );
};
