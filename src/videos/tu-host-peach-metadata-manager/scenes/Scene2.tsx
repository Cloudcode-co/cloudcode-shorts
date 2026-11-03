import type { FC } from "react";
import { Img } from "remotion";
import { siPython } from "simple-icons";
import { mono, sans, videoAsset } from "../../../kit";
import { CutoutCard, PageSlam, SlamItem, SPOT, Stamp, Tape, ZineHeadline } from "../zine";

export const Scene2: FC<{ slug: string; len: number }> = ({ slug }) => {
  const avatarUrl = videoAsset(slug, "repos/peach-mitao.png");

  return (
    <PageSlam baseRotate={0.8}>
      <div>
        <ZineHeadline rotate={-1.5} size={78}>
          GIỚI THIỆU <span style={{ color: SPOT }}>PEACH</span>
          <br />
          LOCAL-FIRST MANAGER
        </ZineHeadline>
      </div>

      {/* Beat 1: Giant Peach Cutout Logo */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
        <SlamItem delay={12} rotate={2} style={{ position: "relative" }}>
          <Tape rotate={-14} style={{ position: "absolute", top: -14, left: 10, zIndex: 10 }} />
          <Tape rotate={10} color="spot" style={{ position: "absolute", bottom: -12, right: 10, zIndex: 10 }} />
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={5}
            shadowDist={12}
            padding="16px 26px"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Img
              src={avatarUrl}
              style={{
                width: 175,
                height: 175,
                objectFit: "contain",
              }}
            />
            <div
              style={{
                fontFamily: mono,
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: 1,
                marginTop: 6,
                color: "#111111",
              }}
            >
              PEACH-MITAO/PEACH
            </div>
          </CutoutCard>
        </SlamItem>
      </div>

      {/* Beat 2: Big Local-First Rubber Stamp */}
      <SlamItem
        delay={40}
        rotate={-4}
        style={{
          marginTop: -12,
          zIndex: 8,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stamp
          text="TRIẾT LÝ LOCAL-FIRST"
          subtext="100% PRIVATE • ZERO CLOUD LOCK-IN"
          size={36}
          color={SPOT}
          style={{ background: "#FFFFFF" }}
        />
      </SlamItem>

      {/* Row of Badges: Python, Stars, AGPL-3.0 */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Beat 3: Python Cutout */}
        <SlamItem delay={70} rotate={-1}>
          <CutoutCard
            bg="#FFFFFF"
            borderWidth={3}
            shadowDist={8}
            padding="14px 22px"
            style={{ display: "flex", alignItems: "center", gap: 18 }}
          >
            <svg viewBox="0 0 24 24" width={44} height={44}>
              <path d={siPython.path} fill="#111111" />
            </svg>
            <div>
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>LANGUAGE</div>
              <div style={{ fontFamily: sans, fontSize: 28, fontWeight: 700, color: "#111111" }}>
                Mã nguồn mở viết bằng Python
              </div>
            </div>
          </CutoutCard>
        </SlamItem>

        <div style={{ display: "flex", gap: 16 }}>
          {/* Beat 4: 14,224 Stars Badge */}
          <SlamItem delay={105} rotate={2} style={{ flex: 1.2 }}>
            <CutoutCard
              bg="#FFFFFF"
              borderWidth={3}
              shadowDist={8}
              padding="14px 18px"
              style={{
                display: "flex",
                flexDirection: "column",
                borderLeft: `8px solid ${SPOT}`,
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>COMMUNITY</div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 34,
                  fontWeight: 800,
                  color: SPOT,
                  letterSpacing: "-0.02em",
                }}
              >
                14,224 ★
              </div>
              <div style={{ fontFamily: sans, fontSize: 18, fontWeight: 600, color: "#333333" }}>
                GitHub Stars
              </div>
            </CutoutCard>
          </SlamItem>

          {/* Beat 5: AGPL-3.0 License Stamp */}
          <SlamItem delay={140} rotate={-3} style={{ flex: 1 }}>
            <CutoutCard
              bg="#FFFFFF"
              borderWidth={3}
              shadowDist={8}
              padding="14px 18px"
              style={{
                display: "flex",
                flexDirection: "column",
                borderLeft: "8px solid #111111",
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 16, color: "#666666" }}>LICENSE</div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#111111",
                }}
              >
                AGPL-3.0
              </div>
              <div style={{ fontFamily: sans, fontSize: 18, fontWeight: 600, color: "#333333" }}>
                Free Software
              </div>
            </CutoutCard>
          </SlamItem>
        </div>
      </div>
    </PageSlam>
  );
};
