import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { videoAsset } from "../../../kit";
import { onBeat } from "../timing";
import { C, Safe, SLUG, Vignette, serif, shadow } from "../theme";

const METRICS = ["Thể tích", "Diện tích", "Trọng tâm"];

const Check: React.FC<{ p: number }> = ({ p }) => (
  <svg width={30} height={30} viewBox="0 0 30 30" style={{ display: "block" }}>
    <path
      d="M5 16.5 L12 23 L25 7"
      fill="none"
      stroke={C.blue}
      strokeWidth={3}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
    />
  </svg>
);

// s4 — the kernel: SolidCore, ported to Rust from NVIDIA's C++ SMLib, and
// the precision checks underneath it.
export const Kernel: React.FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, 523], [1.04, 1.13], { extrapolateRight: "clamp" });
  const core = Math.min(1, Math.max(0, (f - onBeat("s4", 50)) / 20));
  const rustTag = Math.min(1, Math.max(0, (f - onBeat("s4", 170)) / 16));
  const smlib = Math.min(1, Math.max(0, (f - onBeat("s4", 260)) / 18));
  const port = Math.min(1, Math.max(0, (f - onBeat("s4", 262)) / 48));
  const checks = Math.min(1, Math.max(0, (f - onBeat("s4", 386)) / 18));
  const precision = Math.min(1, Math.max(0, (f - onBeat("s4", 392)) / 20));

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={videoAsset(SLUG, "images/metal-gears-macro-pixabay-4651185.jpg")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${push})`,
            filter: "saturate(0.3) brightness(0.4) contrast(1.16)",
          }}
        />
      </AbsoluteFill>
      <Vignette strength={0.95} />

      <Safe>
        <div
          style={{
            position: "absolute",
            top: 84,
            left: 0,
            fontFamily: serif,
            fontSize: 62,
            fontWeight: 600,
            letterSpacing: -1,
            ...shadow,
          }}
        >
          Kernel SolidCore
        </div>
        <div
          style={{
            position: "absolute",
            top: 158,
            left: 0,
            fontFamily: serif,
            fontSize: 36,
            color: C.dust,
            ...shadow,
          }}
        >
          port từ SMLib của NVIDIA
        </div>

        {/* Port bundle from the C++ library into the Rust kernel. */}
        <svg
          width={777}
          height={700}
          viewBox="0 0 777 700"
          style={{ position: "absolute", top: 0, left: 0, overflow: "visible" }}
        >
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M 380 ${530 + i * 9} C 470 ${500 + i * 9}, 380 ${400 + i * 5}, ${
                248 - i * 8
              } ${408 + i * 2}`}
              fill="none"
              stroke={i === 0 ? C.blue : "rgba(61,130,232,0.5)"}
              strokeWidth={i === 0 ? 2.5 : 1.5}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - Math.min(1, Math.max(0, (port - i * 0.12) / 0.64))}
            />
          ))}
        </svg>

        <div
          style={{
            position: "absolute",
            top: 252,
            left: 210,
            width: 560,
            height: 176,
            border: `1px solid ${C.line}`,
            backgroundColor: "rgba(7,10,15,0.62)",
            boxSizing: "border-box",
            padding: "22px 28px",
            opacity: core,
            transform: `translateY(${(1 - core) * 24}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontFamily: serif, fontSize: 66, fontWeight: 600 }}>SolidCore</span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 34,
                color: C.blue,
                opacity: rustTag,
              }}
            >
              Rust
            </span>
          </div>
          <div style={{ fontFamily: serif, fontSize: 34, color: C.dust, marginTop: 2 }}>
            nhân hình học của SolidCraft
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 476,
            left: 0,
            width: 380,
            height: 132,
            border: `1px solid ${C.line}`,
            backgroundColor: "rgba(7,10,15,0.7)",
            boxSizing: "border-box",
            padding: "20px 26px",
            opacity: smlib,
            transform: `translateX(${(1 - smlib) * -28}px)`,
          }}
        >
          <div style={{ fontFamily: serif, fontSize: 56, fontWeight: 600 }}>SMLib</div>
          <div style={{ fontFamily: "monospace", fontSize: 34, color: C.dust, marginTop: 2 }}>
            NVIDIA · C++
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 636,
            left: 0,
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 36,
            color: C.dust,
            opacity: port,
            ...shadow,
          }}
        >
          chuyển mã sang Rust
        </div>

        <div
          style={{
            position: "absolute",
            top: 740,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: C.line,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 786,
            left: 0,
            right: 0,
            display: "flex",
            gap: 26,
            opacity: checks,
            transform: `translateY(${(1 - checks) * 18}px)`,
          }}
        >
          {METRICS.map((m, i) => (
            <div key={m} style={{ flex: 1 }}>
              <Check p={Math.min(1, Math.max(0, (checks - i * 0.15) / 0.55))} />
              <div
                style={{
                  fontFamily: serif,
                  fontSize: 38,
                  marginTop: 12,
                  color: C.paper,
                  ...shadow,
                }}
              >
                {m}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            top: 940,
            left: 0,
            width: 700,
            fontFamily: serif,
            fontSize: 36,
            lineHeight: 1.4,
            color: C.dust,
            opacity: checks,
            ...shadow,
          }}
        >
          đối chiếu với kết quả tính từ FreeCAD
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 0,
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 46,
            lineHeight: 1.2,
            color: C.paper,
            opacity: precision,
            transform: `translateY(${(1 - precision) * 18}px)`,
            ...shadow,
          }}
        >
          Độ chính xác rất cao.
        </div>
      </Safe>
    </AbsoluteFill>
  );
};
