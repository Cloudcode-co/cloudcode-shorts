import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { onBeat } from "../timing";
import { C, Footage, Hairline, Safe, Vignette, ramp, serif, serifItalic, shadow } from "../theme";

// s6 — the drop: SolidCraft ships its own MCP server, so an AI agent can
// call the modelling commands itself. The biggest moment of the edit.
export const Mcp: React.FC = () => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [0, 11], [0.62, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const big = ramp(f, onBeat("s6", 133), 20);
  const scale = interpolate(big, [0, 1], [1.16, 1]);
  const protocol = ramp(f, onBeat("s6", 140), 18);
  const lineP = ramp(f, onBeat("s6", 142), 24);
  const agents = ramp(f, onBeat("s6", 210), 16);
  const model = ramp(f, onBeat("s6", 330), 16);
  const direct = ramp(f, onBeat("s6", 300), 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Footage
        file="footage/robot-arm-industry-pixabay-159021.mp4"
        len={455}
        from={0.6}
        seconds={9}
        position="48% 46%"
        push={[1.03, 1.11]}
        brightness={0.6}
        saturation={0.42}
      />
      <Vignette strength={1.1} />
      <AbsoluteFill style={{ backgroundColor: "#BFD4FF", opacity: flash }} />

      <Safe>
        <div
          style={{
            position: "absolute",
            top: 84,
            left: 0,
            fontFamily: serif,
            fontSize: 46,
            fontWeight: 600,
            letterSpacing: -0.2,
            opacity: ramp(f, 10, 18),
            ...shadow,
          }}
        >
          Tích hợp sẵn MCP Server
        </div>

        <div
          style={{
            position: "absolute",
            top: 190,
            left: -6,
            fontFamily: serif,
            fontSize: 300,
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: 4,
            opacity: big,
            scale: String(scale),
            transformOrigin: "left center",
            ...shadow,
          }}
        >
          MCP
        </div>

        <div
          style={{
            position: "absolute",
            top: 500,
            left: 2,
            fontFamily: serifItalic,
            fontSize: 38,
            color: C.dust,
            opacity: protocol,
            ...shadow,
          }}
        >
          Model Context Protocol
        </div>

        <Hairline style={{ position: "absolute", top: 580, left: 0, right: 0, opacity: protocol }} />

        <svg
          width={777}
          height={260}
          viewBox="0 0 777 260"
          style={{ position: "absolute", top: 650, left: 0 }}
        >
          <line
            x1={90}
            x2={630}
            y1={46}
            y2={46}
            stroke={C.blue}
            strokeWidth={2}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - lineP}
          />
          {[
            { x: 90, p: agents },
            { x: 360, p: protocol },
            { x: 630, p: model },
          ].map((n, i) => (
            <g key={i} opacity={n.p}>
              <circle cx={n.x} cy={46} r={32} fill="rgba(7,10,15,0.72)" />
              <circle cx={n.x} cy={46} r={26} fill="none" stroke="rgba(236,237,233,0.35)" strokeWidth={1.5} />
              <circle cx={n.x} cy={46} r={13} fill={i === 1 ? C.blue : C.paper} />
            </g>
          ))}
        </svg>

        <div style={{ position: "absolute", top: 742, left: 0, right: 0 }}>
          {[
            { label: "AI agent", x: 90, at: 210 },
            { label: "MCP server", x: 360, at: 152 },
            { label: "Mô hình 3D", x: 630, at: 260 },
          ].map((n, i) => (
            <div
              key={n.label}
              style={{
                position: "absolute",
                top: 0,
                left: n.x - 115,
                width: 230,
                textAlign: "center",
                fontFamily: serif,
                fontSize: 38,
                lineHeight: 1.2,
                color: i === 1 ? C.blue : C.paper,
                opacity: ramp(f, onBeat("s6", n.at), 16),
                ...shadow,
              }}
            >
              {n.label}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            top: 840,
            left: 0,
            width: 700,
            fontFamily: serif,
            fontSize: 38,
            lineHeight: 1.4,
            color: C.paper,
            opacity: direct,
            transform: `translateY(${(1 - direct) * 18}px)`,
            ...shadow,
          }}
        >
          AI agent tự gọi lệnh để vẽ 3D trực tiếp
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 0,
            fontFamily: serifItalic,
            fontSize: 36,
            color: C.dust,
            opacity: ramp(f, onBeat("s6", 360), 18),
            ...shadow,
          }}
        >
          một server nằm ngay trong SolidCraft
        </div>
      </Safe>
    </AbsoluteFill>
  );
};
