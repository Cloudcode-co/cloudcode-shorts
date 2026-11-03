import { Img } from "remotion";
import { BRAND_SPACE, CONTENT_W, SAFE, Shot, display, enter, useIn } from "../../../kit";
import { C, a } from "../palette";

// The one orchestrated moment: lobster lands, pixel banner types itself in.
export const Hook: React.FC<{ len: number }> = ({ len }) => {
  const lobster = useIn(0, 18);
  const banner = useIn(18, 24);
  const q = useIn(46, 14);
  const pixelStep = Math.floor(banner * 14) / 14;

  return (
    <Shot bg={C.hermesInk} len={len} style={{ gap: 28, paddingTop: SAFE.top + BRAND_SPACE }}>
      <div
        style={{
          ...enter(lobster, 60),
          position: "relative",
          height: 520,
          borderRadius: 40,
          overflow: "hidden",
        }}
      >
        <Img
          src={a("agents/avatar-openclaw.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "60% 45%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 36,
            bottom: 24,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 128,
            color: C.white,
            textShadow: "0 6px 0 rgba(0,0,0,0.35)",
          }}
        >
          OpenClaw
        </div>
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 600,
          fontSize: 60,
          color: C.mist,
          opacity: banner > 0 ? 1 : 0,
        }}
      >
        hay là
      </div>
      <Img
        src={a("agents/hermes-banner.png")}
        style={{
          width: CONTENT_W,
          clipPath: `inset(0 ${(1 - pixelStep) * 100}% 0 0)`,
        }}
      />
      <div
        style={{
          ...enter(q),
          marginTop: 24,
          fontFamily: display,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1.02,
          color: C.white,
        }}
      >
        Cài con nào lên server?
      </div>
    </Shot>
  );
};
