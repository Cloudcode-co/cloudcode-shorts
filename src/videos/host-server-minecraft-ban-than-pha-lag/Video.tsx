import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  FPS,
  Music,
  Sfx,
  TYPE_DELAY,
  TikTokGuide,
  typingFrames,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import {
  CHAPTERS,
  ChapterCard,
  ChatStage,
  DropSlate,
  MESSAGES,
  REACTIONS,
  SLUG,
  SSH_CMD,
  TYPING_STARTS,
} from "./chat";
import timeline from "./timeline.json";

const TOTAL = Math.round(timeline.total * FPS);
const SSH_AT = MESSAGES.find((m) => m.kind === "ssh")?.at ?? 0;

const GroupChat: React.FC<VideoProps> = ({ guide }) => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <ChatStage g={g} />
      {CHAPTERS.map((chapter) => (
        <ChapterCard key={chapter.from} g={g} chapter={chapter} />
      ))}
      <DropSlate g={g} />

      {/* chapter cards and the drop */}
      <Sfx id="thud" at={0} volume={0.4} />
      <Sfx id="whoosh" at={462} volume={0.26} />
      <Sfx id="thud" at={517} volume={0.55} />
      <Sfx id="pixel" at={517} volume={0.28} />
      <Sfx id="thud" at={732} volume={0.38} />
      <Sfx id="thud" at={840} volume={0.3} />
      <Sfx id="whoosh" at={960} volume={0.26} />

      {/* messages */}
      {MESSAGES.map((m) => (
        <Sfx
          key={m.id}
          id={m.kind === "text" ? (m.from === "me" ? "pop" : "ding") : "pop"}
          at={m.at}
          volume={m.kind === "text" ? 0.17 : 0.3}
        />
      ))}
      {TYPING_STARTS.map((at) => (
        <Sfx key={at} id="typing" at={at} frames={20} volume={0.08} />
      ))}
      <Sfx
        id="typing"
        at={SSH_AT + TYPE_DELAY}
        frames={typingFrames([SSH_CMD])}
        volume={0.12}
      />
      {REACTIONS.map((r) => (
        <Sfx key={r.at} id="pop" at={r.at} volume={0.26} />
      ))}

      <Music slug={SLUG} total={TOTAL} voiceRanges={[]} level={0.55} />
      {guide && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 100 }}>
          <TikTokGuide />
        </div>
      )}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: GroupChat,
  durationInFrames: TOTAL,
};
