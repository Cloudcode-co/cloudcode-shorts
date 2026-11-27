import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Brand } from "../../../kit";
import { C, Footage, LowerThird, Safe, Stamp, Vignette, ramp, serif, shadow } from "../theme";

// s1 — the claim: 75 of 76 reference parts match FreeCAD. The lockup and the
// claim are both up on frame one, with the printer macro pushing in behind it.
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const foot = interpolate(f, [0, 48], [0.52, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The claim is on screen from the first frame: the opening still has to
  // carry the headline and both supporting lines, not fade up into black.
  const num = ramp(f, 0, 24);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill style={{ opacity: foot }}>
        <Footage
          file="footage/3d-printer-pixabay-164479.mp4"
          len={353}
          from={0.4}
          seconds={9}
          position="52% 50%"
          push={[1.04, 1.12]}
          brightness={0.86}
          saturation={0.5}
        />
        <Vignette />
      </AbsoluteFill>

      <Brand />

      <Safe style={{ paddingTop: 84 }}>
        <Stamp style={{ opacity: ramp(f, -20, 20) }}>26 · 11 · 2026 — GITHUB</Stamp>

        <div
          style={{
            position: "absolute",
            top: 196,
            left: 0,
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            transform: `translateY(${(1 - num) * 14}px)`,
          }}
        >
          <span
            style={{
              fontFamily: serif,
              fontSize: 340,
              lineHeight: 0.82,
              fontWeight: 600,
              letterSpacing: -12,
              color: C.paper,
              fontVariantNumeric: "tabular-nums",
              ...shadow,
            }}
          >
            75
          </span>
          <span
            style={{
              fontFamily: serif,
              fontSize: 112,
              fontWeight: 400,
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
            top: 512,
            left: 4,
            width: 640,
          }}
        >
          <div style={{ height: 1, width: 240, backgroundColor: C.line, marginBottom: 18 }} />
          <div
            style={{
              fontFamily: serif,
              fontSize: 40,
              lineHeight: 1.25,
              color: C.paper,
              ...shadow,
            }}
          >
            chi tiết khớp chuẩn FreeCAD
          </div>
        </div>

        <LowerThird at={-40} headline="CAD 3D thuần Rust" lines={["Mã nguồn mở viết bằng Rust"]} />
      </Safe>
    </AbsoluteFill>
  );
};
