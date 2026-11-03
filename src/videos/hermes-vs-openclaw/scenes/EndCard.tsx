import { Img } from "remotion";
import { CONTENT_W, Shot, display, enter, useIn } from "../../../kit";
import { C, a } from "../palette";

// Sign-off: the two projects' own artwork and a save reminder, no branding pitch.
export const EndCard: React.FC<{ len: number }> = ({ len }) => {
  const lobster = useIn(0, 18);
  const banner = useIn(14, 18);
  const done = useIn(28);
  const save = useIn(44);
  return (
    <Shot bg={C.hermesInk} len={len} style={{ justifyContent: "center", gap: 30 }}>
      <Img
        src={a("agents/avatar-openclaw.png")}
        style={{
          ...enter(lobster, 40),
          width: CONTENT_W,
          height: 460,
          objectFit: "cover",
          objectPosition: "60% 45%",
          borderRadius: 40,
        }}
      />
      <Img
        src={a("agents/hermes-banner.png")}
        style={{ ...enter(banner, 30), width: CONTENT_W }}
      />
      <div
        style={{
          ...enter(done),
          marginTop: 30,
          fontFamily: display,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1,
          color: C.white,
        }}
      >
        Vậy là xong!
      </div>
      <div style={{ ...enter(save), fontSize: 48, fontWeight: 700, color: C.white, lineHeight: 1.3 }}>
        Lưu video lại để cài sau, follow để xem thêm nhé.
      </div>
    </Shot>
  );
};
