import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { videoAsset } from "../../../kit";
import { C, Hairline, Safe, SLUG, Stamp, ramp, rise, serif, shadow } from "../theme";

// s3 — the product itself: SolidCraft v0.50.0, pure Rust, Apache-2.0,
// browser and desktop. Set as a documentary title card on black.
export const Product: React.FC = () => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 527], [0, -26], { extrapolateRight: "clamp" });
  const mark = ramp(f, 16, 22);
  // The version card fills in together with the version number: no still of
  // this scene should show v0.50.0 above a card of empty dividers.
  const version = ramp(f, 18, 20);
  const rust = ramp(f, 26, 18);
  const web = ramp(f, 40, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 76% 34%, rgba(61,130,232,0.12), rgba(7,10,15,0) 70%)",
        }}
      />
      <Img
        src={videoAsset(SLUG, "repos/tangency-labs.png")}
        style={{
          position: "absolute",
          right: -210,
          top: 250 + drift,
          width: 640,
          height: 640,
          opacity: 0.075,
          filter: "grayscale(1)",
        }}
      />

      <Safe>
        <Stamp style={{ position: "absolute", top: 84, opacity: ramp(f, 30, 20) }}>
          26 · 11 · 2026 — GITHUB
        </Stamp>

        <div
          style={{
            position: "absolute",
            top: 146,
            left: 0,
            display: "flex",
            alignItems: "center",
            gap: 26,
            ...rise(mark, 18),
          }}
        >
          <Img
            src={videoAsset(SLUG, "repos/tangency-labs.png")}
            style={{ width: 132, height: 132, borderRadius: 24 }}
          />
          <span
            style={{ fontFamily: serif, fontSize: 94, fontWeight: 600, letterSpacing: -2 }}
          >
            SolidCraft
          </span>
        </div>

        <div style={{ position: "absolute", top: 316, left: 0, ...rise(version, 20) }}>
          <div style={{ width: 210, height: 3, backgroundColor: C.blue, marginBottom: 14 }} />
          <span
            style={{
              fontFamily: serif,
              fontSize: 190,
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: -7,
              fontVariantNumeric: "tabular-nums",
              ...shadow,
            }}
          >
            v0.50.0
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 570,
            left: 0,
            right: 0,
            bottom: 0,
            display: "grid",
            gridTemplateRows: "1fr 1fr",
          }}
        >
          <div style={{ position: "relative" }}>
            <Hairline />
            <div
              style={{
                paddingTop: 42,
                opacity: rust,
                transform: `translateY(${(1 - rust) * 20}px)`,
              }}
            >
              <div style={{ fontFamily: serif, fontSize: 34, color: C.dust }}>
                Ngôn ngữ &amp; giấy phép
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 44,
                  fontWeight: 600,
                  lineHeight: 1.28,
                  marginTop: 12,
                  textWrap: "balance",
                  ...shadow,
                }}
              >
                Thuần Rust, giấy phép Apache-2.0
              </div>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <Hairline />
            <div
              style={{
                paddingTop: 42,
                opacity: web,
                transform: `translateY(${(1 - web) * 20}px)`,
              }}
            >
              <div style={{ fontFamily: serif, fontSize: 34, color: C.dust }}>
                Nền tảng
              </div>
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 44,
                  fontWeight: 600,
                  lineHeight: 1.28,
                  marginTop: 12,
                  textWrap: "balance",
                  ...shadow,
                }}
              >
                Chạy trên trình duyệt và desktop
              </div>
            </div>
          </div>
        </div>
      </Safe>
    </AbsoluteFill>
  );
};
