import { Img, Sequence, useCurrentFrame } from "remotion";
import { siTelegram } from "simple-icons";
import {
  BrandIcon,
  BrandIcons,
  CONTENT_W,
  SAFE,
  Sfx,
  Shot,
  Terminal,
  TYPE_DELAY,
  Voice,
  display,
  enter,
  mono,
  typingFrames,
  useIn,
} from "../../../kit";
import { C, SLUG, a } from "../palette";

type Step = { title: string; cmds: string[]; note: string; icons?: BrandIcon[] };

// Commands from the official README / docs at hermes-agent.nousresearch.com.
const STEPS: Step[] = [
  {
    title: "Cài 1 lệnh",
    cmds: ["curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash"],
    note: "Script tự cài uv, Python 3.11 và tải Hermes về máy.",
  },
  {
    title: "Chọn model",
    cmds: ["source ~/.bashrc", "hermes model"],
    note: "OpenRouter, Nous Portal, OpenAI, hoặc API của riêng bạn.",
  },
  {
    title: "Chat thử",
    cmds: ["hermes"],
    note: "Nói chuyện với Hermes ngay trong terminal.",
  },
  {
    title: "Nối Telegram",
    cmds: ["hermes gateway setup", "hermes gateway start"],
    icons: [siTelegram],
    note: "Xong. Nhắn tin cho bot là Hermes bắt đầu làm việc.",
  },
];

export const INSTALL_INTRO = 10;
export const STEP_COUNT = 4;

const StepView: React.FC<{ step: Step; index: number; len: number }> = ({
  step,
  index,
  len,
}) => {
  const head = useIn(0, 12);
  const note = useIn(Math.round(len * 0.5));
  return (
    <Shot bg="transparent" len={len} style={{ gap: 34, paddingTop: SAFE.top + 150 }}>
      <div style={{ ...enter(head), display: "flex", alignItems: "baseline", gap: 26 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 72, color: C.gold }}>
          {index + 1}/{STEPS.length}
        </div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 88, color: C.white }}>
          {step.title}
        </div>
      </div>
      <Terminal cmds={step.cmds} accent={C.gold} />
      <div style={{ ...enter(note), fontSize: 46, fontWeight: 700, color: C.white, lineHeight: 1.3 }}>
        {step.note}
        {step.icons && <BrandIcons icons={step.icons} delay={Math.round(len * 0.5) + 8} />}
      </div>
    </Shot>
  );
};

// `steps` holds each step's length in frames, sized to its voiceover clip.
export const Install: React.FC<{ len: number; steps: number[] }> = ({ len, steps }) => {
  const frame = useCurrentFrame();
  const starts = steps.map((_, i) =>
    steps.slice(0, i).reduce((sum, n) => sum + n, INSTALL_INTRO),
  );
  return (
    <Shot bg={C.hermesInk} len={len}>
      <Img src={a("agents/hermes-banner.png")} style={{ width: 560 }} />
      {STEPS.map((s, i) => (
        <Sequence
          key={s.title}
          name={`Bước ${i + 1}`}
          from={starts[i]}
          durationInFrames={steps[i]}
        >
          <StepView step={s} index={i} len={steps[i]} />
          <Voice slug={SLUG} id={`step-${i + 1}`} />
          <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(s.cmds)} volume={0.25} />
        </Sequence>
      ))}
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: CONTENT_W,
          bottom: SAFE.bottom + 40,
          fontSize: 34,
          color: C.mist,
          lineHeight: 1.4,
        }}
      >
        Dùng Windows thì cài WSL2 trước. Gặp lỗi thì chạy{" "}
        <span style={{ fontFamily: mono, color: C.white, whiteSpace: "nowrap" }}>
          hermes doctor
        </span>
        .
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          bottom: SAFE.bottom,
          height: 8,
          borderRadius: 4,
          width: Math.min(1, frame / len) * CONTENT_W,
          background: C.gold,
        }}
      />
    </Shot>
  );
};
