import type { FC } from "react";
import { mono, sans } from "../../../kit";
import { CutoutCard, PageSlam, SlamItem, SPOT, Stamp, Tape, ZineHeadline } from "../zine";

export const Scene5: FC<{ len: number }> = () => {
  return (
    <PageSlam baseRotate={-0.8}>
      <div>
        <ZineHeadline rotate={1.8} size={78}>
          GOM Ổ CỨNG, SMB
          <br />
          <span style={{ color: SPOT }}>VÀ ĐÁM MÂY</span>
        </ZineHeadline>
      </div>

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Source 1: Local Hard Drives */}
        <SlamItem delay={15} rotate={-1.5}>
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="16px 22px"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <div>
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>SOURCE 01</div>
              <div style={{ fontFamily: sans, fontSize: 30, fontWeight: 700, color: "#111111" }}>
                Ổ cứng nội bộ (HDD / SSD)
              </div>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 18,
                fontWeight: 700,
                background: "#111111",
                color: "#FFFFFF",
                padding: "6px 12px",
              }}
            >
              /mnt/media
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Source 2: SMB / NAS */}
        <SlamItem delay={45} rotate={2} style={{ position: "relative" }}>
          <Tape rotate={-6} style={{ position: "absolute", top: -12, right: 20, zIndex: 10 }} />
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="16px 22px"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <div>
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>SOURCE 02</div>
              <div style={{ fontFamily: sans, fontSize: 30, fontWeight: 700, color: "#111111" }}>
                Ổ mạng SMB / NAS gia đình
              </div>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 18,
                fontWeight: 700,
                background: "#111111",
                color: "#FFFFFF",
                padding: "6px 12px",
              }}
            >
              smb://nas
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Source 3: Cloud Storage Mount */}
        <SlamItem delay={75} rotate={-2}>
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="16px 22px"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <div>
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>SOURCE 03</div>
              <div style={{ fontFamily: sans, fontSize: 30, fontWeight: 700, color: "#111111" }}>
                Đám mây gắn kèm (Rclone / WebDAV)
              </div>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 18,
                fontWeight: 700,
                background: "#111111",
                color: "#FFFFFF",
                padding: "6px 12px",
              }}
            >
              MOUNTED
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Source 4: PikPak Account */}
        <SlamItem delay={105} rotate={1.5}>
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={4}
            shadowDist={8}
            padding="16px 22px"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderLeft: `10px solid ${SPOT}`,
            }}
          >
            <div>
              <div style={{ fontFamily: mono, fontSize: 16, color: SPOT, fontWeight: 700 }}>
                SOURCE 04 // DIRECT CLOUD
              </div>
              <div style={{ fontFamily: sans, fontSize: 30, fontWeight: 800, color: "#111111" }}>
                Tài khoản đám mây PikPak
              </div>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 18,
                fontWeight: 800,
                color: SPOT,
                border: `2px solid ${SPOT}`,
                padding: "6px 12px",
              }}
            >
              PIKPAK API
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 5: Unified Browse Stamp */}
        <SlamItem delay={150} rotate={-4} style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <Stamp
            text="DUYỆT CHUNG TẠI MỘT NƠI"
            subtext="SEAMLESS LIBRARY INTEGRATION"
            size={36}
            color={SPOT}
          />
        </SlamItem>
      </div>
    </PageSlam>
  );
};
