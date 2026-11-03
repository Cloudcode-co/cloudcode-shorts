import type { FC } from "react";
import { siApple, siDocker } from "simple-icons";
import { mono, sans } from "../../../kit";
import { CutoutCard, PageSlam, SlamItem, SPOT, Stamp, Tape, ZineHeadline } from "../zine";

export const Scene8: FC<{ len: number }> = () => {
  return (
    <PageSlam baseRotate={0.8}>
      <div>
        <ZineHeadline rotate={-1.8} size={76}>
          CÀI ĐẶT TRÊN MỌI THIẾT BỊ
          <br />
          <span style={{ color: SPOT }}>WINDOWS, MAC & DOCKER</span>
        </ZineHeadline>
      </div>

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Beat 1: Windows & macOS Installer Row */}
        <div style={{ display: "flex", gap: 18 }}>
          <SlamItem delay={3} rotate={-2} style={{ flex: 1 }}>
            <CutoutCard
              bg="#FFFFFF"
              borderWidth={3}
              shadowDist={8}
              padding="18px 20px"
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <svg viewBox="0 0 24 24" width={42} height={42} fill="#111111">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
              </svg>
              <div>
                <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>INSTALLER</div>
                <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 800, color: "#111111" }}>
                  WINDOWS x64
                </div>
              </div>
            </CutoutCard>
          </SlamItem>

          <SlamItem delay={7} rotate={2} style={{ flex: 1 }}>
            <CutoutCard
              bg="#FFFFFF"
              borderWidth={3}
              shadowDist={8}
              padding="18px 20px"
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <svg viewBox="0 0 24 24" width={42} height={42}>
                <path d={siApple.path} fill="#111111" />
              </svg>
              <div>
                <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>ARM / INTEL</div>
                <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 800, color: "#111111" }}>
                  macOS DMG
                </div>
              </div>
            </CutoutCard>
          </SlamItem>
        </div>

        {/* Beat 2: Docker / NAS Deployment */}
        <SlamItem delay={20} rotate={-1.5} style={{ position: "relative" }}>
          <Tape rotate={-6} style={{ position: "absolute", top: -14, left: 24, zIndex: 10 }} />
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="20px 24px"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <svg viewBox="0 0 24 24" width={52} height={52}>
                <path d={siDocker.path} fill="#111111" />
              </svg>
              <div>
                <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>HOMESERVER & NAS</div>
                <div style={{ fontFamily: sans, fontSize: 32, fontWeight: 800, color: "#111111" }}>
                  Hỗ trợ Docker & Compose
                </div>
                <div style={{ fontFamily: mono, fontSize: 18, color: "#555555" }}>
                  Synology • QNAP • Unraid • TrueNAS
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 18,
                fontWeight: 700,
                background: "#111111",
                color: "#FFFFFF",
                padding: "8px 14px",
              }}
            >
              READY
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 3: Live Web Demo Ticket */}
        <SlamItem delay={48} rotate={1.5}>
          <CutoutCard
            bg="#111111"
            borderWidth={4}
            shadowDist={10}
            padding="22px 26px"
            style={{ borderLeft: `10px solid ${SPOT}`, color: "#FFFFFF" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: mono, fontSize: 18, color: SPOT, fontWeight: 700 }}>
                ONLINE TEST DRIVE
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#111111",
                  background: SPOT,
                  padding: "4px 12px",
                }}
              >
                LIVE WEB
              </div>
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 44,
                fontWeight: 800,
                color: "#FFFFFF",
                marginTop: 6,
                letterSpacing: "-0.02em",
              }}
            >
              demo.peach.video
            </div>
            <div style={{ fontFamily: sans, fontSize: 24, color: "#CCCCCC", marginTop: 4 }}>
              Trải nghiệm toàn bộ tính năng trực tiếp trên web
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 4 & 5: Rubber stamp */}
        <SlamItem delay={85} rotate={-4} style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <Stamp
            text="THỬ NGAY KHÔNG CẦN CÀI"
            subtext="TEST DRIVE IN YOUR BROWSER"
            size={38}
            color={SPOT}
          />
        </SlamItem>
      </div>
    </PageSlam>
  );
};
