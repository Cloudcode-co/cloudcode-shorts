import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sfx } from "../../../kit";
import { C, F, SL, SW } from "../palette";
import { at, land } from "../plan";
import { LowerThird, ProjectCard } from "../parts";

// Story 1: the two heavyweight servers, one card each, facts in a lower third.
export const StoryOne: React.FC<{ start: number }> = ({ start }) => {
  const f = useCurrentFrame();
  const head = land(f, 2, 12);
  const ejabberd = at(start, 0.85);
  const prosody = at(start, 3.85);
  const factA = at(start, 1.55);
  const factB = at(start, 4.35);
  return (
    <AbsoluteFill>
      <Sfx id="pop" at={ejabberd} volume={0.26} />
      <Sfx id="pop" at={prosody} volume={0.26} />
      <Sfx id="pop" at={factA} volume={0.24} />
      <Sfx id="pop" at={factB} volume={0.24} />
      <div
        style={{
          position: "absolute",
          left: SL,
          top: 372,
          width: SW,
          fontFamily: F.sans,
          fontWeight: 900,
          fontSize: 68,
          lineHeight: 1.02,
          letterSpacing: -1.2,
          color: C.white,
          textWrap: "balance",
          opacity: head,
          transform: `translateY(${(1 - head) * 28}px)`,
        }}
      >
        Sự cồng kềnh truyền thống
      </div>

      <ProjectCard
        logo="repos/mikma.png"
        name="ejabberd"
        meta="Erlang · Libexpat"
        count={4}
        at={ejabberd}
        y={548}
      />
      <ProjectCard
        logo="repos/prosody.png"
        name="Prosody"
        meta="Lua · image Debian 13"
        count={195}
        at={prosody}
        y={764}
      />

      <LowerThird
        at={factA}
        until={factB}
        y={1064}
        label="EJABBERD"
        text="Cần Erlang/OTP và Libexpat để dựng"
      />
      <LowerThird
        at={factB}
        y={1064}
        label="PROSODY"
        text="Chạy trên nền Lua, đóng gói bằng Docker"
      />
    </AbsoluteFill>
  );
};
