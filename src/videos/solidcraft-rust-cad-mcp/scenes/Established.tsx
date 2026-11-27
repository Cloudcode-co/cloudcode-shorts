import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { videoAsset } from "../../../kit";
import { onBeat } from "../timing";
import {
  C,
  Footage,
  LowerThird,
  Safe,
  SLUG,
  Stamp,
  Vignette,
  ramp,
  serif,
  shadow,
} from "../theme";

const BANDS = [
  { label: "C++", note: "ngôn ngữ", width: 777, at: 232 },
  { label: "Python", note: "script", width: 660, at: 264 },
  { label: "Qt", note: "giao diện", width: 566, at: 297 },
];

// s2 — the established way: FreeCAD on C++, Python and Qt. Three heavy bands
// settle into the frame one after another as the voice lists them.
export const Established: React.FC = () => {
  const f = useCurrentFrame();
  const head = ramp(f, 3, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Footage
        file="footage/computer-aided-design-engineer-screen-pixabay-1058.mp4"
        len={407}
        from={0.8}
        seconds={9}
        position="72% 44%"
        push={[1.05, 1.13]}
        brightness={0.72}
        saturation={0.3}
      />
      <Vignette />

      <Safe>
        <Stamp style={{ position: "absolute", top: 84, opacity: ramp(f, 40, 20) }}>
          28 · 09 · 2026 — GITHUB
        </Stamp>

        <div
          style={{
            position: "absolute",
            top: 158,
            left: 0,
            display: "flex",
            alignItems: "center",
            gap: 26,
            opacity: head,
            transform: `translateY(${(1 - head) * 18}px)`,
          }}
        >
          <Img
            src={videoAsset(SLUG, "repos/FreeCAD.png")}
            style={{ width: 126, height: 126, borderRadius: 22 }}
          />
          <div>
            <div style={{ fontFamily: serif, fontSize: 78, fontWeight: 600, lineHeight: 1 }}>
              FreeCAD
            </div>
            <div
              style={{
                fontFamily: serif,
                fontSize: 36,
                color: C.dust,
                marginTop: 10,
                ...shadow,
              }}
            >
              v1.1.4 · LGPL-2.1
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", top: 402, left: 0, right: 0 }}>
          {BANDS.map((band) => {
            const at = onBeat("s2", band.at);
            const p = ramp(f, at, 16);
            return (
              <div
                key={band.label}
                style={{
                  width: band.width,
                  height: 104,
                  marginBottom: 14,
                  backgroundColor: "rgba(5,8,12,0.88)",
                  border: `1px solid rgba(236,237,233,0.16)`,
                  borderLeft: `4px solid ${C.blue}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: 28,
                  paddingRight: 26,
                  boxSizing: "border-box",
                  opacity: p,
                  transform: `translateX(${(1 - p) * -34}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: serif,
                    fontSize: 58,
                    fontWeight: 600,
                    letterSpacing: -0.5,
                    color: C.paper,
                  }}
                >
                  {band.label}
                </span>
                <span
                  style={{
                    fontFamily: serif,
                    fontSize: 34,
                    color: C.dust,
                  }}
                >
                  {band.note}
                </span>
              </div>
            );
          })}
        </div>

        <LowerThird
          at={34}
          headline="Kiến trúc CAD truyền thống"
          lines={["FreeCAD v1.1.4 (C++, LGPL-2.1)", "Dựa trên Python và giao diện Qt"]}
        />
      </Safe>
    </AbsoluteFill>
  );
};
