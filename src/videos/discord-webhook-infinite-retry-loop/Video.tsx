// Meme skit format: silent video with captioned scenes
import { Composition, useCurrentFrame, interpolate, Easing, AbsoluteFill } from "remotion";
import { Img, staticFile } from "remotion";
import { Brand } from "../../kit/Brand";
import { Meme } from "../../kit/Meme";
import { MemeCaption } from "../../kit/MemeCaption";
import script from "./script.json";
import type { VideoDef } from "../../kit";
import { SAFE } from "../../kit";

// Scene durations from durations.json (in seconds)
const DURATIONS: Record<string, number> = {
  s1: 4.2,
  s2: 3.8,
  s3: 4,
  s4: 4.2,
  s5: 6,
};

// Get meme data from facts.json
const MEMES: Record<string, { file: string; width: number; height: number }> = {
  s1: {
    file: "memes/cat-typing-laptop-giphy-hiJ9ypGI5tIKdwKoK2.gif",
    width: 480,
    height: 296,
  },
  s2: {
    file: "memes/cat-vibing-giphy-TXAA5G0GaioBMOjeR9.gif",
    width: 480,
    height: 480,
  },
  s3: {
    file: "memes/shocked-cat-giphy-crPtfTE2O00qrDgmm7.gif",
    width: 480,
    height: 302,
  },
  s4: {
    file: "memes/cat-panic-giphy-eAot8Ldr85y3peseC3.gif",
    width: 480,
    height: 468,
  },
  s5: {
    file: "memes/cat-crying-giphy-Xr9TlAqw3S7VPOrftK.gif",
    width: 480,
    height: 398,
  },
};

// Background image
const BACKGROUND_IMAGE = "images/bedroom-at-night-computer-pixabay-5884606.jpg";

// Captions for each scene
const CAPTIONS: Record<string, string[]> = {
  s1: ["Dev gắn webhook Discord", "vào VPS để hửng có bug là ping về máy"],
  s2: ["Tiện tay code thêm hàm", "tự động retry nếu bắt được exception"],
  s3: ["Hai giờ sáng database rớt kết nối", "đúng nửa giây kích hoạt hàm retry"],
  s4: ["Vòng lặp lỗi spam", "3000 tin nhắn mỗi giây làm điện thoại rung muốn nổ"],
  s5: ["Sáng dậy thấy Discord ban acc", "vĩnh viễn còn VPS cháy sạch băng thông"],
};

// Flash transition wrapper (flash effect at the end)
function TailFlash({
  delay = 0,
  color = "#ffffff",
}: {
  delay?: number;
  color?: string;
}) {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return <AbsoluteFill style={{ backgroundColor: color, opacity: t }} />;
}

// Zoom punch entrance wrapper (scene zooms in)
function ZoomPunchEnter({
  delay = 0,
}: {
  delay?: number;
}) {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.23, 1, 0.32, 1),
  });

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${0.8 + t * 0.3})`,
        opacity: t,
      }}
    />
  );
}

// Single scene component
function Scene({
  id,
  from = 0,
  onEnter = false,
}: {
  id: string;
  from?: number;
  onEnter?: boolean;
}) {
  const frame = useCurrentFrame();
  const startFrame = (from as number) * 60; // Convert seconds to frames at 60fps
  const meme = MEMES[id];

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Zoom punch entrance */}
      {onEnter && <ZoomPunchEnter delay={startFrame} />}

      {/* Background with overlays */}
      <AbsoluteFill style={{ background: "#000000" }}>
        {/* Background image with dimmer */}
        <Img
          src={staticFile(`videos/discord-webhook-infinite-retry-loop/${BACKGROUND_IMAGE}`)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Dim overlay to make meme and text readable */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
          }}
        />
      </AbsoluteFill>

      {/* Caption at top */}
      {CAPTIONS[id].map((line: string, index: number) => (
        <MemeCaption
          key={index}
          text={line}
          size={42}
          style={{
            position: "absolute",
            top: `${SAFE.top + 80 + index * 50}px`,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
          }}
        />
      ))}

      {/* Meme placement - lower half */}
      <div
        style={{
          position: "absolute",
          bottom: `${SAFE.bottom + 100}px`,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
        }}
      >
        <Meme
          slug="discord-webhook-infinite-retry-loop"
          file={meme.file}
          width={meme.width}
          height={meme.height}
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>

      {/* Brand lockup only on first frame of first scene */}
      {id === "s1" && Math.floor(frame) === Math.floor(startFrame) && (
        <div style={{
          position: "absolute",
          left: SAFE.left,
          top: SAFE.top,
          zIndex: 10,
        }}>
          <Brand />
        </div>
      )}
    </AbsoluteFill>
  );
}

// Main composition content
export const Content: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      {/* Scene 1 */}
      <Scene id="s1" from={0} />

      {/* Scene 2 with zoom punch */}
      <Scene
        id="s2"
        from={DURATIONS.s1}
        onEnter={true}
      />

      {/* Scene 3 with zoom punch - align with beat at 8.0s */}
      <Scene
        id="s3"
        from={DURATIONS.s1 + DURATIONS.s2}
        onEnter={true}
      />

      {/* Scene 4 - build into punchline */}
      <Scene
        id="s4"
        from={DURATIONS.s1 + DURATIONS.s2 + DURATIONS.s3}
        onEnter={true}
      />

      {/* Scene 5 */}
      <Scene
        id="s5"
        from={DURATIONS.s1 + DURATIONS.s2 + DURATIONS.s3 + DURATIONS.s4}
        onEnter={true}
      />

      {/* Flash transition after last scene */}
      <TailFlash delay={(DURATIONS.s1 + DURATIONS.s2 + DURATIONS.s3 + DURATIONS.s4 + DURATIONS.s5) * 60} color="#ffffff" />
    </AbsoluteFill>
  );
};

// Wrapper component that exports the Composition
export const Video = () => (
  <Composition
    id="discord-webhook-infinite-retry-loop"
    component={Content}
    fps={60}
    width={1080}
    height={1920}
    durationInFrames={(22.2 + 0.5) * 60}
    defaultProps={{ slug: "discord-webhook-infinite-retry-loop" }}
  />
);

export const video: VideoDef = {
  id: script.slug,
  component: Video,
  durationInFrames: (22.2 + 0.5) * 60,
};