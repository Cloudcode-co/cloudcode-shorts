import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GatewayFlow, GitCards, SlackFlow, VMCard } from "./footers";
import { Content, Layer, Quiz, Stage } from "./set";

// The music drops at 44.861 s, inside the subscription scene: the BYO pass
// slams with a gold flash, then the licence round begins.
const DropFlash: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = Math.max(0, 1 - (f - at) / 22);
  return (
    <AbsoluteFill
      style={{
        zIndex: 12,
        pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 62%, rgba(255,224,138,${0.82 * p}), rgba(255,201,74,${0.22 * p}) 46%, rgba(255,201,74,0) 70%)`,
      }}
    />
  );
};

export const Build: React.FC = () => (
  <AbsoluteFill>
    <Stage />
    <Content>
      <Layer start={0} end={465}>
        <Quiz
          heading="Lập trình qua Slack"
          options={[
            { letter: "A", text: "Tag @Computer vào task", at: -20, icon: "chat" },
            { letter: "B", text: "Tự code và đẩy Pull Request", at: -20, icon: "git" },
          ]}
          video="footage/programmer-typing-in-chat-app-pixabay-117.mp4"
        >
          <SlackFlow at={-12} />
        </Quiz>
      </Layer>

      <Layer start={465} end={930}>
        <Quiz
          heading="Chạy trên 1 VM duy nhất"
          options={[
            { letter: "A", text: "Một máy ảo Linux đơn lẻ", at: -20, icon: "computer" },
            { letter: "B", text: "Khóa mạng outbound-only", at: -20, icon: "lock" },
          ]}
        >
          <VMCard at={-12} />
        </Quiz>
      </Layer>

      <Layer start={930} end={1423}>
        <Quiz
          heading="Calvin Gateway và Podman"
          options={[
            { letter: "A", text: "Gateway Calvin bắt sự kiện Slack", at: -20, icon: "bolt" },
            { letter: "B", text: "Mỗi session cô lập bằng rootless Podman", at: -20, icon: "docker" },
          ]}
        >
          <GatewayFlow at={-12} />
        </Quiz>
      </Layer>

      <Layer start={1423} end={1895}>
        <Quiz
          heading="Dùng subscription cá nhân"
          options={[
            { letter: "A", text: "Lưu trạng thái vào Git", at: -20, icon: "git" },
            { letter: "B", text: "Tự mang gói ChatGPT / Codex", at: -20, icon: "computer" },
          ]}
        >
          <GitCards at={-12} dropAt={407} />
        </Quiz>
      </Layer>

      <DropFlash at={407} />
    </Content>
  </AbsoluteFill>
);
