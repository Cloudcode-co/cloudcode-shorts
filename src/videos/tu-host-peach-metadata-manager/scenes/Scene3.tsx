import type { FC } from "react";
import { display, mono, sans } from "../../../kit";
import { CutoutCard, HalftoneScreen, PageSlam, SlamItem, SPOT, Stamp, Tape, ZineHeadline } from "../zine";

export const Scene3: FC<{ len: number }> = () => {
  return (
    <PageSlam baseRotate={-1.2}>
      <div>
        <ZineHeadline rotate={1.5} size={76}>
          TỰ ĐỘNG NHẬN DIỆN MÃ
          <br />
          <span style={{ color: SPOT }}>VÀ CÀO DỮ LIỆU</span>
        </ZineHeadline>
      </div>

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Beat 1: Video Code Scanner Ticket */}
        <SlamItem delay={15} rotate={-2}>
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="18px 24px"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: mono, fontSize: 18, color: "#666666", letterSpacing: 2 }}>
                VIDEO CODE RECOGNITION
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  fontWeight: 800,
                  color: "#111111",
                  marginTop: 4,
                }}
              >
                [MKT-088] • [FC2-310]
              </div>
            </div>
            <div
              style={{
                background: "#111111",
                color: "#FFFFFF",
                fontFamily: mono,
                fontSize: 20,
                fontWeight: 700,
                padding: "8px 14px",
              }}
            >
              AUTO
            </div>
          </CutoutCard>
        </SlamItem>

        {/* Beat 2: Torn NFO File Code Snippet */}
        <SlamItem delay={50} rotate={1.8} style={{ position: "relative" }}>
          <Tape rotate={-8} style={{ position: "absolute", top: -14, left: 24, zIndex: 10 }} />
          <CutoutCard
            bg="#111111"
            borderWidth={3}
            shadowDist={8}
            padding="18px 24px"
            style={{ color: "#F0F0F0" }}
          >
            <div style={{ fontFamily: mono, fontSize: 18, color: SPOT, letterSpacing: 1 }}>
              FILE_NFO_PARSER.XML
            </div>
            <pre
              style={{
                fontFamily: mono,
                fontSize: 22,
                lineHeight: 1.4,
                margin: "8px 0 0 0",
                color: "#E0E0E0",
              }}
            >
              {`<movie>\n  <title>Peach Media Scraping</title>\n  <studio>Peach Studio / TMDB</studio>\n  <actor>Full Cast & Metadata</actor>\n</movie>`}
            </pre>
          </CutoutCard>
        </SlamItem>

        {/* Beat 3 & 4: Poster & Scraped Metadata side-by-side */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* Halftone Poster Mockup */}
          <SlamItem delay={90} rotate={-3} style={{ width: 220, position: "relative" }}>
            <Tape rotate={6} color="spot" style={{ position: "absolute", top: -12, right: 10, zIndex: 10 }} />
            <CutoutCard
              bg="#FFFFFF"
              borderWidth={3}
              shadowDist={8}
              padding="16px"
              style={{
                height: 270,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <HalftoneScreen size={10} dotRadius={3} opacity={0.35} />
              <div
                style={{
                  fontFamily: display,
                  fontSize: 50,
                  fontWeight: 800,
                  color: "#111111",
                  textAlign: "center",
                  lineHeight: 0.9,
                  zIndex: 2,
                }}
              >
                COVER
                <br />
                ART
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: mono,
                  fontSize: 18,
                  fontWeight: 700,
                  color: SPOT,
                  zIndex: 2,
                }}
              >
                POSTER_HD
              </div>
            </CutoutCard>
          </SlamItem>

          {/* Details list */}
          <SlamItem delay={125} rotate={1.5} style={{ flex: 1 }}>
            <CutoutCard
              bg="#FFFFFF"
              borderWidth={3}
              shadowDist={8}
              padding="18px 22px"
              style={{ height: 270, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <div>
                <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>EXTRACTED METADATA</div>
                <div style={{ fontFamily: sans, fontSize: 28, fontWeight: 700, color: "#111111", marginTop: 6 }}>
                  ✓ Tiêu đề chuẩn chỉ
                </div>
                <div style={{ fontFamily: sans, fontSize: 28, fontWeight: 700, color: "#111111", marginTop: 6 }}>
                  ✓ Diễn viên & Profile
                </div>
                <div style={{ fontFamily: sans, fontSize: 28, fontWeight: 700, color: "#111111", marginTop: 6 }}>
                  ✓ Studio & Thể loại
                </div>
              </div>
              <div style={{ fontFamily: mono, fontSize: 18, color: SPOT, fontWeight: 700 }}>
                KÉO TỪ ĐA NGUỒN CỰC NHANH
              </div>
            </CutoutCard>
          </SlamItem>
        </div>

        {/* Beat 5: Multi-source rubber stamp */}
        <SlamItem delay={175} rotate={-4} style={{ display: "flex", justifyContent: "center" }}>
          <Stamp
            text="ĐA NGUỒN DỮ LIỆU TỰ ĐỘNG"
            subtext="KEEPING ALL YOUR MANUAL EDITS SAFE"
            size={36}
            color={SPOT}
          />
        </SlamItem>
      </div>
    </PageSlam>
  );
};
