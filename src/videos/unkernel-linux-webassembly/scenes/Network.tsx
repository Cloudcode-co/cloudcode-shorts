import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HfClip, SAFE, mono } from "../../../kit";
import { C, SLUG } from "../palette";
import { Headline, Status, appear, rise } from "../ui";

// The HyperFrames clip carries the whole diagram; Remotion keeps the headline
// and the one-line summary on top so the type matches every other shot.
export const Network: React.FC<{ len: number }> = () => {
  const f = useCurrentFrame();
  const head = appear(f, 4, 18);
  const foot = appear(f, 248, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <HfClip slug={SLUG} name="wisp" />
      <AbsoluteFill
        style={{
          padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Headline size={82} style={rise(head, 28)}>
          Proxy mạng
          <br />
          qua Wisp
        </Headline>

        <div
          style={{
            ...rise(foot, 18),
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            borderTop: `1px solid ${C.line}`,
            paddingTop: 16,
          }}
        >
          <span style={{ fontFamily: mono, fontSize: 34, color: C.text }}>
            nhiều socket, một WebSocket
          </span>
          <Status color={C.mint}>wisp</Status>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
