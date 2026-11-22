import { AbsoluteFill } from "remotion";
import { Challenge, RaceBars } from "./footers";
import { Confetti, Content, Layer, Quiz, Stage } from "./set";

// The final answer: first push in 24s, then the challenge back to the viewer.
export const Outro: React.FC = () => (
  <AbsoluteFill>
    <Stage glow={0.6} />
    <Content>
      <Layer start={0} end={502}>
        <Quiz
          heading="First Push chỉ 24 giây"
          options={[
            {
              letter: "A",
              text: "OpenComputer: 24 giây",
              at: -20,
              icon: "bolt",
              states: [{ at: 320, state: "correct" }],
            },
            {
              letter: "B",
              text: "Trung bình 4 cloud agent: 62 giây",
              at: -20,
              icon: "clock",
              states: [{ at: 320, state: "dim" }],
              shakeAt: 320,
            },
          ]}
        >
          <RaceBars
            aLabel="OpenComputer"
            aValue="24 giây"
            aFrac={24 / 62}
            bLabel="4 cloud agent"
            bValue="62 giây"
            bFrac={1}
            at={-12}
            revealAt={320}
            statValue="2,6 lần"
            statLabel="nhanh hơn trung bình"
            statAt={240}
          />
        </Quiz>
      </Layer>

      <Layer start={502} end={1047}>
        <Quiz
          heading="Lưu video và thử ngay"
          options={[
            { letter: "A", text: "Tự host coding agent", at: -20, icon: "computer" },
            { letter: "B", text: "Follow kênh để cập nhật", at: -20, icon: "chat" },
          ]}
        >
          <Challenge at={-12} slamAt={320} />
        </Quiz>
      </Layer>

      <Confetti at={320} />
    </Content>
  </AbsoluteFill>
);
