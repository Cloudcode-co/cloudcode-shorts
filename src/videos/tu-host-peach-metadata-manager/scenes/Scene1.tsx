import type { FC } from "react";
import { siJellyfin, siPlex } from "simple-icons";
import { BRAND_SPACE, Brand, mono, sans } from "../../../kit";
import { CutoutCard, PageSlam, SlamItem, SPOT, Stamp, Tape, ZineHeadline } from "../zine";

export const Scene1: FC<{ len: number }> = () => {
  return (
    <PageSlam dark baseRotate={-0.5}>
      <Brand color="#FFFFFF" />

      <div style={{ marginTop: BRAND_SPACE + 24 }}>
        <ZineHeadline rotate={-1.8} size={82} dark>
          TÌM TOOL CÀO
          <br />
          <span style={{ color: SPOT }}>METADATA</span> PHIM?
        </ZineHeadline>
      </div>

      <div
        style={{
          marginTop: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* Beat 1: Jellyfin Cutout */}
        <SlamItem delay={8} rotate={-3} style={{ flex: 1 }}>
          <CutoutCard
            bg="#FFFFFF"
            shadowDist={10}
            padding="28px 20px"
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Tape rotate={-12} style={{ position: "absolute", top: -14, left: 16 }} />
            <svg viewBox="0 0 24 24" width={80} height={80}>
              <path d={siJellyfin.path} fill="#000B25" />
            </svg>
            <div
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 32,
                color: "#000000",
                marginTop: 14,
                letterSpacing: "-0.02em",
              }}
            >
              JELLYFIN
            </div>
          </CutoutCard>
        </SlamItem>

        <div style={{ fontFamily: mono, fontSize: 38, fontWeight: 800, color: SPOT }}>VS</div>

        {/* Beat 2: Plex Cutout */}
        <SlamItem delay={20} rotate={4} style={{ flex: 1 }}>
          <CutoutCard
            bg="#FFFFFF"
            shadowDist={10}
            padding="28px 20px"
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <Tape rotate={8} style={{ position: "absolute", top: -14, right: 16 }} />
            <svg viewBox="0 0 24 24" width={80} height={80}>
              <path d={siPlex.path} fill="#E5A00D" />
            </svg>
            <div
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 32,
                color: "#000000",
                marginTop: 14,
                letterSpacing: "-0.02em",
              }}
            >
              PLEX
            </div>
          </CutoutCard>
        </SlamItem>
      </div>

      {/* Beat 3: Media Server Scraper Ticket */}
      <SlamItem delay={35} rotate={-1} style={{ marginTop: 44 }}>
        <CutoutCard
          bg="#FFFFFF"
          borderWidth={3}
          shadowDist={8}
          padding="20px 24px"
          style={{ borderStyle: "dashed" }}
        >
          <div
            style={{
              fontFamily: mono,
              fontSize: 20,
              color: "#555555",
              letterSpacing: 2,
              marginBottom: 6,
            }}
          >
            TASK // MEDIA_SERVER_SCRAPER
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: 34,
              fontWeight: 700,
              color: "#000000",
              lineHeight: 1.3,
            }}
          >
            Quản lý thư viện phim & cào metadata tự động
          </div>
        </CutoutCard>
      </SlamItem>

      {/* Beat 4: Big Rubber Stamp */}
      <SlamItem delay={65} rotate={-6} style={{ marginTop: 44, alignSelf: "center", display: "flex", justifyContent: "center" }}>
        <Stamp
          text="THỰC SỰ ƯNG Ý CHƯA?"
          subtext="FINDING THE ULTIMATE SCRAPER TOOL"
          size={40}
          color={SPOT}
        />
      </SlamItem>
    </PageSlam>
  );
};
