import { siOpenscad } from "simple-icons";
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from "remotion";
import { videoAsset } from "../../../kit";
import { onBeat } from "../timing";
import { C, Safe, SLUG, ramp, serif, shadow } from "../theme";

const Document: React.FC<{ p: number }> = ({ p }) => (
  <svg width={250} height={310} viewBox="0 0 250 310">
    <path
      d="M28 6 H172 L222 56 V304 H28 Z"
      fill="none"
      stroke="rgba(236,237,233,0.55)"
      strokeWidth={2}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
    />
    <path
      d="M172 6 V56 H222"
      fill="none"
      stroke="rgba(236,237,233,0.4)"
      strokeWidth={2}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - p}
    />
    {[0, 1, 2, 3, 4].map((i) => (
      <line
        key={i}
        x1={52}
        x2={i === 4 ? 140 : 198}
        y1={104 + i * 34}
        y2={104 + i * 34}
        stroke={i === 2 ? C.blue : "rgba(236,237,233,0.32)"}
        strokeWidth={i === 2 ? 4 : 2}
        opacity={p}
      />
    ))}
  </svg>
);

// s5 — OpenSCAD compiles a script; SolidCraft is an interactive, parametric
// timeline. A split frame keeps the two ways of working side by side.
export const Compare: React.FC = () => {
  const f = useCurrentFrame();
  const left = ramp(f, onBeat("s5", 18), 20);
  const compiler = ramp(f, onBeat("s5", 90), 20);
  const right = ramp(f, onBeat("s5", 248), 20);
  const scrubStart = onBeat("s5", 313);
  const scrub = interpolate(f, [scrubStart, scrubStart + 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rectW = 150 + scrub * 70;
  const rectH = 78 + scrub * 46;
  const head = ramp(f, 8, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill style={{ left: 0, right: 500, backgroundColor: C.slate }} />
      <AbsoluteFill style={{ left: 500, right: 0, backgroundColor: C.navy }} />
      <div style={{ position: "absolute", left: 500, top: 0, bottom: 0, width: 1, backgroundColor: C.line }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(7,10,15,0.88) 0%, rgba(7,10,15,0.3) 16%, rgba(7,10,15,0) 30%, rgba(7,10,15,0.55) 84%, rgba(7,10,15,0.9) 100%)",
        }}
      />

      <Safe>
        <div
          style={{
            position: "absolute",
            top: 84,
            left: 0,
            width: 720,
            fontFamily: serif,
            fontSize: 54,
            fontWeight: 600,
            lineHeight: 1.06,
            letterSpacing: -0.5,
            whiteSpace: "pre-line",
            opacity: head,
            transform: `translateY(${(1 - head) * 18}px)`,
            ...shadow,
          }}
        >
          {"Dựng hình tham số\ntương tác"}
        </div>

        {/* Left: the 3D compiler */}
        <div style={{ position: "absolute", top: 220, left: 0, width: 360 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: left }}>
            <svg width={62} height={62} viewBox="0 0 24 24">
              <path d={siOpenscad.path} fill="#F9D72C" />
            </svg>
            <span style={{ fontFamily: serif, fontSize: 46, fontWeight: 600 }}>OpenSCAD</span>
          </div>
        </div>

        <div style={{ position: "absolute", top: 340, left: 26, opacity: left }}>
          <Document p={left} />
        </div>

        <div
          style={{
            position: "absolute",
            top: 700,
            left: 0,
            width: 360,
            opacity: compiler,
            transform: `translateY(${(1 - compiler) * 18}px)`,
          }}
        >
          <div style={{ fontFamily: serif, fontSize: 48, fontWeight: 600, lineHeight: 1.1 }}>
            Script
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 36,
              color: C.dust,
              marginTop: 8,
              lineHeight: 1.4,
            }}
          >
            đọc mã, biên dịch ra mô hình
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            width: 350,
            opacity: compiler,
          }}
        >
          <div style={{ height: 1, backgroundColor: C.line, marginBottom: 16 }} />
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: 36,
              lineHeight: 1.35,
              color: C.dust,
              whiteSpace: "pre-line",
            }}
          >
            {"không tương tác\ntrực tiếp"}
          </div>
        </div>

        {/* Right: the parametric timeline */}
        <div style={{ position: "absolute", top: 220, left: 430, width: 347 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: right }}>
            <Img
              src={videoAsset(SLUG, "repos/tangency-labs.png")}
              style={{ width: 74, height: 74, borderRadius: 14 }}
            />
            <span style={{ fontFamily: serif, fontSize: 46, fontWeight: 600 }}>SolidCraft</span>
          </div>
        </div>

        <div style={{ position: "absolute", top: 340, left: 440, opacity: right }}>
          <svg width={330} height={310} viewBox="0 0 330 310">
            <rect
              x={58}
              y={210 - rectH}
              width={rectW}
              height={rectH}
              rx={8}
              fill="rgba(61,130,232,0.08)"
              stroke={C.blue}
              strokeWidth={2.5}
            />
            <circle cx={58 + 38} cy={210 - rectH / 2} r={10} fill="none" stroke={C.paper} strokeWidth={2} />
            <circle
              cx={58 + rectW - 38}
              cy={210 - rectH / 2}
              r={10}
              fill="none"
              stroke={C.paper}
              strokeWidth={2}
            />
            <line x1={10} x2={320} y1={228} y2={228} stroke="rgba(236,237,233,0.4)" strokeWidth={2} />
            {Array.from({ length: 7 }, (_, i) => (
              <line
                key={i}
                x1={10 + i * 51}
                x2={10 + i * 51}
                y1={228}
                y2={i % 2 === 0 ? 242 : 236}
                stroke="rgba(236,237,233,0.5)"
                strokeWidth={2}
              />
            ))}
            <path
              d={`M ${10 + scrub * 310} 212 L ${2 + scrub * 310} 228 L ${18 + scrub * 310} 228 Z`}
              fill={C.paper}
            />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            top: 700,
            left: 430,
            width: 340,
            opacity: right,
            transform: `translateY(${(1 - right) * 18}px)`,
          }}
        >
          <div style={{ fontFamily: serif, fontSize: 48, fontWeight: 600, lineHeight: 1.1 }}>
            Timeline tham số
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 36,
              color: C.dust,
              marginTop: 8,
              lineHeight: 1.4,
            }}
          >
            kéo tham số, mô hình dựng lại
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 430,
            width: 340,
            opacity: right,
          }}
        >
          <div style={{ height: 1, backgroundColor: C.line, marginBottom: 16 }} />
          <div
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: 36,
              lineHeight: 1.35,
              color: C.paper,
            }}
          >
            dựng hình trực tiếp
          </div>
        </div>
      </Safe>
    </AbsoluteFill>
  );
};
