import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Brand,
  BRAND_SPACE,
  FPS,
  Meme,
  MemeCaption,
  Music,
  SAFE,
  Sfx,
  TikTokGuide,
  flash,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const BG = "images/programmer-laptop-dark-room-pixabay-1568556.jpg";
const TR = 10;
const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// Each caption is shown in two parts; the picture changes every `k` shots per part.
const PARTS: Record<string, [string, string]> = {
  s1: ["Dev 3 giờ sáng dọn Docker,", "thấy volume cũ nằm chình ình"],
  s2: ["Nghĩ bụng: xóa cache thôi,", "mai hệ thống chạy mượt hơn"],
  s3: ["Gõ nhầm docker volume rm production_db,", "terminal vẫn hỏi xác nhận"],
  s4: ["Dev bấm yes vì tưởng", "yes là viết tắt của yên tâm"],
  s5: ["Mười giây sau: backup cũng", "nằm chung volume vừa bị xóa"],
};

// [x offset, size, rotation] of the cat for each shot of a scene.
const POSES = [
  { x: -120, w: 760, r: -4 },
  { x: 90, w: 880, r: 3 },
  { x: -60, w: 960, r: -2 },
  { x: 120, w: 820, r: 5 },
  { x: -100, w: 900, r: -3 },
  { x: 40, w: 1000, r: 2 },
];

const Scene: React.FC<{ id: string; len: number; first?: boolean }> = ({ id, len, first }) => {
  const f = useCurrentFrame();
  const sceneIdx = timeline.scenes[id as "s1"] ? Number(id.slice(1)) - 1 : 0;
  const parts = PARTS[id];
  const k = Math.ceil(len / FPS / 1.45);
  const n = k;
  const seg = len / n;
  const i = Math.min(n - 1, Math.floor(f / seg));
  const part = 0;
  const local = f - i * seg;
  const pop = interpolate(local, [0, 10], [1, 0], { extrapolateRight: "clamp", easing: easeOut });
  const meme =
    id === "s4"
      ? facts.memes.find((m) => m.file.includes("E4RPAfBUJFofU5CoEP"))!
      : facts.memes.find((m) => m.scene === id)!;
  const pose = POSES[i % POSES.length];
  const mirror = i % 2 === 1;
  const capIn = interpolate(local, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: easeOut,
  });
  const capScale = 1.18 - 0.18 * capIn;
  const drift = interpolate(f, [0, len], [1.04, 1.12]);
  const bgShift = (i % 2 ? 1 : -1) * 30 * (1 - pop * 0.5);
  const maxH = 640;
  const memeW = Math.min(Math.round(pose.w * 0.7), Math.round((maxH * meme.width) / meme.height));
  const memeH = (memeW * meme.height) / meme.width;
  const bottom = 1920 - SAFE.bottom - 30;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070d", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${drift + pop * 0.1}) translateX(${bgShift}px)` }}>
        <Img
          src={staticFile(`videos/${SLUG}/${BG}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55) saturate(1.1)" }}
        />
      </AbsoluteFill>
      <Meme
        slug={SLUG}
        file={meme.file}
        width={meme.width}
        height={meme.height}
        style={{
          left: (1080 - memeW) / 2 + pose.x,
          top: bottom - memeH,
          width: memeW,
          transform: `scaleX(${mirror ? -1 : 1}) rotate(${pose.r * (mirror ? -1 : 1)}deg) scale(${1 + pop * 0.12})`,
          transformOrigin: "50% 100%",
        }}
      />
      <MemeCaption
        key={part}
        text={parts.join(" ")}
        size={72}
        style={{
          left: SAFE.left,
          width: 1080 - SAFE.left - SAFE.right,
          top: SAFE.top + BRAND_SPACE + 30,
          height: 320,
          transform: `scale(${capScale})`,
        }}
      />
      {first && <Brand />}
      {Array.from({ length: n }, (_, j) => (
        <Sfx key={j} id="pop" at={Math.round(j * seg)} volume={0.22} />
      ))}
      <Sfx id={sceneIdx % 2 ? "whoosh" : "thud"} volume={0.35} />
    </AbsoluteFill>
  );
};

const ids = ["s1", "s2", "s3", "s4", "s5"] as const;
const LENS = ids.map((id) => Math.round(timeline.scenes[id].length * FPS));
const TOTAL = LENS.reduce((a, b) => a + b, 0);

const XoaNham: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <TransitionSeries>
      {ids.flatMap((id, i) => {
        const items = [
          <TransitionSeries.Sequence
            key={id}
            name={id}
            durationInFrames={LENS[i] + (i < ids.length - 1 ? TR : 0)}
          >
            <Scene id={id} len={LENS[i] + (i < ids.length - 1 ? TR : 0)} first={i === 0} />
          </TransitionSeries.Sequence>,
        ];
        if (i < ids.length - 1) {
          const timing = linearTiming({ durationInFrames: TR });
          items.push(
            i % 2 === 0 ? (
              <TransitionSeries.Transition key={`t${i}`} presentation={zoomPunch()} timing={timing} />
            ) : (
              <TransitionSeries.Transition key={`t${i}`} presentation={flash()} timing={timing} />
            ),
          );
        }
        return items;
      })}
    </TransitionSeries>
    <Music slug={SLUG} total={TOTAL} voiceRanges={[]} level={0.55} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: XoaNham,
  durationInFrames: TOTAL,
};
