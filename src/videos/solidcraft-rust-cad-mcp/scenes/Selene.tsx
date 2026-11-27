import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { mono } from "../../../kit";
import { onBeat } from "../timing";
import {
  C,
  Footage,
  Hairline,
  Safe,
  Vignette,
  ramp,
  serif,
  serifItalic,
  shadow,
} from "../theme";

const WHEELS = [222, 300, 378, 468, 546, 624];

const Rover: React.FC<{ p: number }> = ({ p }) => {
  const draw = (local: number) => ({
    pathLength: 1,
    strokeDasharray: "1 1",
    strokeDashoffset: 1 - Math.min(1, Math.max(0, local)),
  });
  return (
    <svg width={720} height={430} viewBox="0 0 720 430">
      {/* ground and centre line */}
      <line x1={20} x2={700} y1={366} y2={366} stroke="rgba(236,237,233,0.35)" strokeWidth={1.5} {...draw(p)} />
      <line
        x1={20}
        x2={700}
        y1={196}
        y2={196}
        stroke="rgba(61,130,232,0.35)"
        strokeWidth={1}
        strokeDasharray="6 10"
        opacity={p}
      />

      {/* body and cabin */}
      <g fill="none" stroke="rgba(236,237,233,0.9)" strokeWidth={2.2} strokeLinejoin="round">
        <rect x={196} y={210} width={330} height={96} rx={6} {...draw(p * 1.1)} />
        <path d="M 352 210 L 382 152 L 470 152 L 496 210" {...draw(p * 1.1)} />
        <path d="M 258 210 L 258 176 L 330 176 L 330 210" {...draw(p * 1.1)} />
        <line x1={258} x2={258} y1={176} y2={210} {...draw(p * 1.1)} />
        <line x1={330} x2={330} y1={176} y2={210} {...draw(p * 1.1)} />
        <line x1={212} x2={212} y1={210} y2={196} {...draw(p)} />
        <line x1={212} x2={344} y1={196} y2={196} {...draw(p)} />
        <line x1={344} x2={344} y1={196} y2={210} {...draw(p)} />
        {[236, 272, 308].map((x) => (
          <line key={x} x1={x} x2={x} y1={198} y2={208} {...draw(p)} />
        ))}
        {/* mast and camera */}
        <line x1={478} x2={478} y1={152} y2={92} {...draw(p)} />
        <rect x={452} y={66} width={52} height={28} rx={3} {...draw(p)} />
        <circle cx={478} cy={80} r={7} {...draw(p)} />
        <line x1={478} x2={478} y1={94} y2={152} {...draw(p)} />
      </g>

      {/* rocker arms and wheels */}
      <g fill="none" stroke="rgba(236,237,233,0.8)" strokeWidth={2}>
        <path d="M 250 306 L 300 306 L 330 340" {...draw(p)} />
        <path d="M 580 306 L 546 306 L 510 340" {...draw(p)} />
        <line x1={300} x2={300} y1={306} y2={328} {...draw(p)} />
        <line x1={546} x2={546} y1={306} y2={328} {...draw(p)} />
      </g>
      {WHEELS.map((x, i) => {
        const q = Math.min(1, Math.max(0, (p - 0.15 - i * 0.05) / 0.8));
        return (
          <g key={x} fill="none" stroke="rgba(236,237,233,0.9)" strokeWidth={2.2}>
            <circle cx={x} cy={330} r={34} {...draw(q)} />
            <circle cx={x} cy={330} r={12} {...draw(q)} />
            <line x1={x - 30} x2={x + 30} y1={330} y2={330} {...draw(q)} />
            <line x1={x} x2={x} y1={300} y2={360} {...draw(q)} />
          </g>
        );
      })}

      {/* survey mark */}
      <g stroke="rgba(61,130,232,0.8)" strokeWidth={1.4}>
        <line x1={30} x2={30} y1={376} y2={400} {...draw(p)} />
        <line x1={14} x2={46} y1={400} y2={400} {...draw(p)} />
      </g>
    </svg>
  );
};

// s7 — SELENE, a scientific rover modelled entirely through SolidCraft's
// MCP server. The rover is drawn as a technical elevation over dim footage.
export const Selene: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const author = ramp(f, onBeat("s7", 71), 18);
  const via = ramp(f, onBeat("s7", 202), 18);
  const mcp = ramp(f, onBeat("s7", 333), 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Footage
        file="footage/rover-space-exploration-pixabay-378416.mp4"
        len={488}
        from={0.4}
        seconds={8}
        position="50% 56%"
        push={[1.04, 1.13]}
        rate={0.9}
        brightness={0.34}
        saturation={0.4}
      />
      <Vignette strength={1.1} />

      <Safe>
        <div
          style={{
            position: "absolute",
            top: 84,
            left: 0,
            fontFamily: serif,
            fontSize: 54,
            fontWeight: 600,
            lineHeight: 1.06,
            letterSpacing: -0.4,
            ...shadow,
          }}
        >
          Dự án xe tự hành SELENE
        </div>
        <div
          style={{
            position: "absolute",
            top: 160,
            left: 0,
            fontFamily: serifItalic,
            fontSize: 36,
            color: C.dust,
            opacity: ramp(f, 12, 18),
            ...shadow,
          }}
        >
          một ví dụ thực tế từ cộng đồng
        </div>

        <div style={{ position: "absolute", top: 250, left: 20, width: 720 }}>
          <Rover p={p} />
        </div>

        <div
          style={{
            position: "absolute",
            top: 700,
            left: 0,
            display: "flex",
            alignItems: "baseline",
            gap: 22,
            opacity: author,
            transform: `translateY(${(1 - author) * 16}px)`,
          }}
        >
          <span style={{ fontFamily: mono, fontSize: 38, color: C.paper }}>0xlillith</span>
          <span style={{ fontFamily: serif, fontSize: 34, color: C.dust }}>
            người dựng mô hình
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 760,
            left: 0,
            width: 700,
            opacity: via,
            transform: `translateY(${(1 - via) * 16}px)`,
          }}
        >
          <div style={{ fontFamily: serif, fontSize: 38, color: C.paper, ...shadow }}>
            mô hình dựng hoàn toàn qua
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 64,
              fontWeight: 600,
              color: C.blue,
              lineHeight: 1.2,
              ...shadow,
            }}
          >
            MCP server
          </div>
        </div>

        <Hairline style={{ position: "absolute", bottom: 180, left: 0, right: 0 }} />

        <div
          style={{
            position: "absolute",
            bottom: 52,
            left: 0,
            width: 720,
            fontFamily: serif,
            fontSize: 40,
            lineHeight: 1.4,
            color: C.paper,
            textWrap: "balance",
            opacity: mcp,
            transform: `translateY(${(1 - mcp) * 16}px)`,
            ...shadow,
          }}
        >
          SolidCraft dựng nên một chiếc rover chỉ bằng các lệnh MCP.
        </div>
      </Safe>
    </AbsoluteFill>
  );
};
