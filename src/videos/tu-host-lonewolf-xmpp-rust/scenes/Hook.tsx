import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { BRAND_SPACE, SAFE, Sfx } from "../../../kit";
import { C, F, SL, SW, a, stars } from "../palette";
import { land } from "../plan";

// Cold open: the claim in three tiers, then the project it comes from.
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const p1 = land(f, 5, 14);
  const p2 = land(f, 24, 14);
  const p3 = land(f, 46, 14);
  const p4 = land(f, 120, 16);
  const tease = land(f, 205, 14);
  return (
    <AbsoluteFill>
      <Sfx id="pop" at={26} volume={0.28} />
      <Sfx id="pop" at={48} volume={0.28} />
      <Sfx id="pop" at={205} volume={0.26} />
      <div style={{ position: "absolute", left: SL, top: SAFE.top + BRAND_SPACE + 68, width: SW }}>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 900,
            fontSize: 152,
            lineHeight: 0.86,
            letterSpacing: -5,
            color: C.white,
            opacity: p1,
            transform: `translateY(${(1 - p1) * 34}px)`,
          }}
        >
          SERVER
          <br />
          <span style={{ color: C.red }}>XMPP</span>
        </div>
        <div style={{ transform: `scaleX(${p2})`, transformOrigin: "0 50%", width: 420 }}>
          <div style={{ height: 8, background: C.red, marginTop: 30 }} />
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 60,
            lineHeight: 1.06,
            color: C.white,
            textWrap: "balance",
            opacity: p3,
            transform: `translateY(${(1 - p3) * 26}px)`,
          }}
        >
          KHÔNG CẦN
          <br />
          DATABASE RỜI
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: F.sans,
            fontWeight: 600,
            fontSize: 38,
            color: C.dim,
            opacity: p4,
            transform: `translateY(${(1 - p4) * 20}px)`,
          }}
        >
          Tự host máy chủ chat
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: SL,
          top: 1180,
          width: SW,
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: tease,
          transform: `translateY(${(1 - tease) * 26}px)`,
        }}
      >
        <Img
          src={a("repos/lonewolf-im.png")}
          style={{
            width: 82,
            height: 82,
            borderRadius: 14,
            border: "2px solid rgba(255,255,255,0.55)",
            background: "#EEF3F9",
          }}
        />
        <div>
          <div style={{ fontFamily: F.sans, fontWeight: 900, fontSize: 44, lineHeight: 1, color: C.white }}>
            Lonewolf
          </div>
          <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.dim, marginTop: 8 }}>
            {stars(111)} sao GitHub · Rust
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
