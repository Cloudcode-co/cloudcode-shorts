import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { display, easeOut, enter, useIn } from "../../../kit";
import { AccentTitle, BoxedLine, PaperGround, SceneLayer } from "../parts";
import { C, SL, SW, clamp } from "../palette";

const APPS = ["Sonarr", "Radarr", "Lidarr", "Bazarr", "Prowlarr", "Seerr"];

// s13 — land the two footprints, name what still waits, ask to save it.
export const SaveIt: React.FC<{ len: number }> = () => {
  const frame = useCurrentFrame();
  const big = useIn(44, 16);
  const slash = interpolate(frame, [50, 68], [0, 1], { ...clamp, easing: easeOut });
  const names = useIn(92, 14);
  return (
    <AbsoluteFill>
      <SceneLayer>
        <PaperGround />
      </SceneLayer>

      <div style={{ position: "absolute", top: 266, left: SL, width: SW, textAlign: "center" }}>
        <div style={{ ...enter(useIn(2, 12), 20) }}>
          <AccentTitle before="Lưu lại," accent="thử" after="sau" size={82} />
        </div>
      </div>

      <div style={{ ...enter(big, 26), position: "absolute", top: 440, left: 103, width: SW }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ width: 330, textAlign: "center" }}>
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 190,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                color: C.ink,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              685
            </div>
            <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 38, color: C.grey }}>MB / 6 app</div>
          </div>
          <div style={{ width: 300, textAlign: "center" }}>
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 190,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                color: C.coral,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              16
            </div>
            <div style={{ marginTop: 8, fontFamily: display, fontWeight: 700, fontSize: 38, color: C.ink }}>MB / HolyArrs</div>
          </div>
        </div>
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line
          x1={498}
          y1={498}
          x2={562}
          y2={742}
          stroke={C.coral}
          strokeWidth={10}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - slash}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          top: 842,
          left: SL,
          width: SW,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <BoxedLine text="Nhạc: chưa gộp được" start={58} size={50} />
        <BoxedLine text="Theo dõi để xem bản sau" start={72} size={42} bg={C.white} color={C.ink} />
      </div>

      <div
        style={{
          ...enter(names, 16),
          position: "absolute",
          top: 1200,
          left: SL,
          width: SW,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          rowGap: 12,
          columnGap: 0,
          textAlign: "center",
        }}
      >
        {APPS.map((name) => (
          <div
            key={name}
            style={{
              fontFamily: display,
              fontWeight: 700,
              fontSize: 34,
              color: C.grey,
              textDecoration: "line-through",
              textDecorationColor: C.coral,
              textDecorationThickness: 3,
            }}
          >
            {name}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
