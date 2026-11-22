import { AbsoluteFill } from "remotion";
import { LicenseMeter, PermissionMeter, TerminalBox } from "./footers";
import { Content, Layer, Quiz, Stage } from "./set";

// The licence/security round: the room turns red, the restricted licence is
// marked wrong, the unsandboxed run is flagged, then the Docker fix types out.
export const Drop: React.FC = () => (
  <AbsoluteFill>
    <Stage alert={0.5} />
    <Content>
      <Layer start={0} end={488}>
        <Quiz
          heading={"Rào cản\nbản quyền OpenHands"}
          options={[
            {
              letter: "A",
              text: "OpenHands core: MIT License",
              at: -20,
              icon: "computer",
              states: [{ at: 110, state: "correct" }],
            },
            {
              letter: "B",
              text: "OpenHands-Cloud: Polyform 30 ngày/năm",
              at: -20,
              icon: "lock",
              states: [{ at: 190, state: "wrong" }],
              shakeAt: 190,
            },
          ]}
          video="footage/frustrated-developer-at-desk-pixabay-232538.mp4"
        >
          <LicenseMeter at={-12} />
        </Quiz>
      </Layer>

      <Layer start={488} end={939}>
        <Quiz
          heading="Cảnh báo bảo mật Agent Canvas"
          options={[
            {
              letter: "A",
              text: "Chạy thẳng không sandbox",
              at: -20,
              icon: "bolt",
              states: [{ at: 200, state: "wrong" }],
              shakeAt: 200,
            },
            {
              letter: "B",
              text: "AI có full quyền trên filesystem",
              at: -20,
              icon: "computer",
              states: [{ at: 200, state: "wrong" }],
              shakeAt: 205,
            },
          ]}
        >
          <PermissionMeter at={-12} />
        </Quiz>
      </Layer>

      <Layer start={939} end={1348}>
        <Quiz
          heading="Chạy OpenHands qua Docker"
          options={[
            {
              letter: "A",
              text: "Cô lập runtime trong Docker",
              at: -20,
              icon: "docker",
              states: [{ at: 100, state: "correct" }],
            },
            {
              letter: "B",
              text: "Tránh xung đột quyền host",
              at: -20,
              icon: "lock",
              states: [{ at: 100, state: "correct" }],
            },
          ]}
        >
          <TerminalBox />
        </Quiz>
      </Layer>
    </Content>
  </AbsoluteFill>
);
