import { AbsoluteFill, Sequence } from "remotion";
import { Brand } from "../../kit";
import { RaceBars, RepoCard } from "./footers";
import { Confetti, Content, Countdown, Layer, Quiz, Stage } from "./set";

// One long opening round: the question lands, the two runs are raced, then a
// 3-2-1 countdown and the right button lights. The reveal is still on screen
// while the voice confirms it, before the board flips to the licence.
export const Hook: React.FC = () => (
  <AbsoluteFill>
    <Stage />
    <Sequence from={0} durationInFrames={383} layout="absolute-fill">
      <Brand />
    </Sequence>
    <Content>
      <Layer start={0} end={533}>
        <Quiz
          heading="56 giây mở 4 PR"
          options={[
            {
              letter: "A",
              text: "OpenComputer: 56s (CI xanh)",
              at: 20,
              icon: "computer",
              states: [{ at: 361, state: "correct" }],
            },
            {
              letter: "B",
              text: "Devin: 185s",
              at: 45,
              icon: "clock",
              states: [{ at: 361, state: "dim" }],
              shakeAt: 361,
            },
          ]}
          video="footage/developer-looking-at-monitor-clock-pixabay-7549.mp4"
        >
          <RaceBars
            aLabel="OpenComputer"
            aValue="56s"
            aFrac={56 / 185}
            bLabel="Devin"
            bValue="185s"
            bFrac={1}
            at={20}
            revealAt={361}
            statValue="3,3 lần"
            statLabel="nhanh hơn Devin"
            statAt={188}
          />
        </Quiz>
      </Layer>

      <Layer start={533} end={874}>
        <Quiz
          heading="Mã nguồn mở Apache-2.0"
          options={[
            { letter: "A", text: "OpenComputer tự host", at: -20, icon: "computer" },
            { letter: "B", text: "Thay thế Devin độc quyền", at: -20, icon: "lock" },
          ]}
        >
          <RepoCard at={-12} />
        </Quiz>
      </Layer>

      <Countdown start={265} tick={32} />
      <Confetti at={361} />
    </Content>
  </AbsoluteFill>
);
