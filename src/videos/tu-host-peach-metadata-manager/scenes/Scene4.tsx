import type { FC } from "react";
import { mono, sans } from "../../../kit";
import { CutoutCard, PageSlam, SlamItem, SPOT, Stamp, Tape, ZineHeadline } from "../zine";

export const Scene4: FC<{ len: number }> = () => {
  return (
    <PageSlam baseRotate={0.6}>
      <div>
        <ZineHeadline rotate={-1.8} size={78}>
          GIỮ TRỌN CHỈNH SỬA
          <br />
          <span style={{ color: SPOT }}>LƯU TRỮ NỘI BỘ</span>
        </ZineHeadline>
      </div>

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Beat 1: Non-overwriting guarantee card */}
        <SlamItem delay={15} rotate={-2} style={{ position: "relative" }}>
          <Tape rotate={-10} style={{ position: "absolute", top: -14, left: 24, zIndex: 10 }} />
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={4}
            shadowDist={10}
            padding="20px 26px"
            style={{ borderLeft: `10px solid ${SPOT}` }}
          >
            <div style={{ fontFamily: mono, fontSize: 18, color: "#666666", letterSpacing: 2 }}>
              POLICY // SAFEGUARD
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 36,
                fontWeight: 800,
                color: "#111111",
                marginTop: 6,
                lineHeight: 1.25,
              }}
            >
              Không ghi đè dữ liệu sửa tay!
            </div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 24,
                color: "#444444",
                marginTop: 6,
              }}
            >
              Mọi chỉnh sửa tên, ảnh bìa, tag đều được bảo tồn tuyệt đối.
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 2: Local Database Vault */}
        <SlamItem delay={45} rotate={2}>
          <CutoutCard
            bg="#111111"
            borderWidth={3}
            shadowDist={8}
            padding="20px 26px"
            style={{ color: "#FFFFFF" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: mono, fontSize: 16, color: SPOT }}>STORAGE ARCHITECTURE</div>
                <div style={{ fontFamily: sans, fontSize: 32, fontWeight: 700, marginTop: 4 }}>
                  SQLite & Local Files
                </div>
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 20,
                  fontWeight: 800,
                  border: `2px solid ${SPOT}`,
                  padding: "6px 14px",
                  color: SPOT,
                }}
              >
                100% OFFLINE
              </div>
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 3: Watch History local card */}
        <SlamItem delay={80} rotate={-1.5}>
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="18px 24px"
          >
            <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>WATCH HISTORY & LOGS</div>
            <div
              style={{
                fontFamily: sans,
                fontSize: 30,
                fontWeight: 700,
                color: "#111111",
                marginTop: 4,
              }}
            >
              Lịch sử xem lưu tại máy của bạn
            </div>
            <div style={{ fontFamily: mono, fontSize: 20, color: "#555555", marginTop: 4 }}>
              Không đồng bộ dữ liệu ra máy chủ bên ngoài
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 4: Privacy Rubber Stamp */}
        <SlamItem delay={125} rotate={-5} style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <Stamp
            text="BẢO MẬT DỮ LIỆU CÁ NHÂN"
            subtext="ZERO TELEMETRY • NO TRACKING"
            size={36}
            color={SPOT}
          />
        </SlamItem>
      </div>
    </PageSlam>
  );
};
