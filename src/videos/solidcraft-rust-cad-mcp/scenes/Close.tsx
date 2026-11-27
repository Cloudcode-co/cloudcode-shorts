import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { mono, videoAsset } from "../../../kit";
import { onBeat } from "../timing";
import { C, Footage, Hairline, Safe, SLUG, Vignette, ramp, serif, serifItalic, shadow } from "../theme";

// s11 — end card: keep the video, follow the channel, and the number that
// started it all, once more.
export const Close: React.FC = () => {
  const f = useCurrentFrame();
  const brand = ramp(f, 34, 20);
  const cta = ramp(f, 54, 20);
  const number = ramp(f, onBeat("s11", 240), 20);
  const scale = interpolate(number, [0, 1], [1.06, 1]);
  const question = ramp(f, onBeat("s11", 321), 18);
  const repo = ramp(f, 90, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Footage
        file="footage/3d-printer-pixabay-164479.mp4"
        len={555}
        from={2.2}
        seconds={9}
        rate={0.92}
        position="34% 58%"
        push={[1.04, 1.12]}
        brightness={0.45}
        saturation={0.4}
      />
      <Vignette strength={1.15} />
      <Safe>
        <div
          style={{
            position: "absolute",
            top: 54,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            opacity: brand,
            transform: `translateY(${(1 - brand) * 16}px)`,
          }}
        >
          <Img
            src={videoAsset(SLUG, "repos/tangency-labs.png")}
            style={{ width: 108, height: 108, borderRadius: 20 }}
          />
          <span style={{ fontFamily: serif, fontSize: 66, fontWeight: 600, letterSpacing: -1.2 }}>
            SolidCraft
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 186,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: serif,
            fontSize: 36,
            color: C.dust,
            opacity: brand,
          }}
        >
          v0.50.0 · Apache-2.0 · 26.11.2026
        </div>

        <div
          style={{
            position: "absolute",
            top: 268,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: serif,
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: -0.4,
            opacity: cta,
            transform: `translateY(${(1 - cta) * 18}px)`,
            ...shadow,
          }}
        >
          Lưu video · Theo dõi kênh
        </div>

        <div
          style={{
            position: "absolute",
            top: 348,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: serifItalic,
            fontSize: 38,
            color: C.dust,
            opacity: question,
          }}
        >
          Anh em thử chưa?
        </div>

        <Hairline style={{ position: "absolute", top: 460, left: 268, right: 268 }} />

        <div
          style={{
            position: "absolute",
            top: 510,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 14,
            opacity: number,
            scale: String(scale),
          }}
        >
          <span
            style={{
              fontFamily: serif,
              fontSize: 220,
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: -8,
              fontVariantNumeric: "tabular-nums",
              ...shadow,
            }}
          >
            75
          </span>
          <span
            style={{
              fontFamily: serif,
              fontSize: 86,
              lineHeight: 1,
              color: C.blue,
              ...shadow,
            }}
          >
            /76
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 760,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: serif,
            fontSize: 38,
            color: C.dust,
            opacity: number,
          }}
        >
          chi tiết mẫu khớp chuẩn FreeCAD
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: mono,
            fontSize: 34,
            color: C.dust,
            opacity: repo,
          }}
        >
          tangency-labs/solidcraft
        </div>
      </Safe>
    </AbsoluteFill>
  );
};
