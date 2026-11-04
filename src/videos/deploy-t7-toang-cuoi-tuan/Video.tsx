// Meme skit: one coffee-shop photo behind everything, a cat acting out each
// line in the lower half, the line itself as an outlined caption on top.
import { AbsoluteFill, Easing, Img, interpolate, Series, staticFile, useCurrentFrame } from "remotion";
import {
  BRAND_SPACE,
  Brand,
  FPS,
  Meme,
  MemeCaption,
  Music,
  SAFE,
  Sfx,
  TikTokGuide,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";

const SLUG = script.slug;
const BG = facts.images[0].file;

// Each caption is cut into two shots, word for word as in script.json.
const SPLITS: Record<string, [string, string]> = {
  s1: ["Sáng thứ 7 dev tiện tay bấm deploy", "bản hotfix nhẹ tênh rồi tính ngồi chill"],
  s2: ["Vừa nhấp ngụm cafe thì điện thoại nổ 99+", "thông báo lỗi đỏ lòm từ Telegram"],
  s3: ["Toang luôn cả cụm database, server ăn 502,", "sếp bắt đầu tag tên réo gọi"],
  s4: ["Cuống cuồng tìm bản backup để rollback", "thì nhận ra lần backup cuối là tháng trước"],
  s5: ["Thế là một kỳ nghỉ cuối tuần ấm cúng", "bên anh em trên Discord lại bắt đầu"],
};

const lens = script.scenes.map((s, i) => {
  const base = Math.round((durations as Record<string, number>)[s.id] * FPS);
  return i === script.scenes.length - 1 ? base + 90 : base;
});
const total = lens.reduce((a, b) => a + b, 0);

const Half: React.FC<{ text: string; file: string; w: number; h: number; mirror: boolean; first: boolean }> = ({
  text,
  file,
  w,
  h,
  mirror,
  first,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 9], [0.93, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.23, 1, 0.32, 1),
  });
  const width = 780;
  return (
    <AbsoluteFill>
      <MemeCaption
        text={text}
        style={{
          left: SAFE.left,
          width: 1080 - SAFE.left - SAFE.right,
          top: SAFE.top + (first ? BRAND_SPACE : 0),
        }}
      />
      <Meme
        slug={SLUG}
        file={file}
        width={w}
        height={h}
        style={{
          left: SAFE.left - 2,
          width,
          bottom: SAFE.bottom,
          transformOrigin: "50% 100%",
          transform: `scale(${p}) scaleX(${mirror ? -1 : 1})`,
        }}
      />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ i: number }> = ({ i }) => {
  const s = script.scenes[i];
  const m = facts.memes.find((x) => x.scene === s.id)!;
  const [a, b] = SPLITS[s.id];
  const cut = Math.round(lens[i] * 0.5);
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={cut}>
          <Half text={a} file={m.file} w={m.width} h={m.height} mirror={false} first={i === 0} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={lens[i] - cut}>
          <Half text={b} file={m.file} w={m.width} h={m.height} mirror={s.id !== "s4"} first={i === 0} />
        </Series.Sequence>
      </Series>
      <Sfx id={i === 0 ? "thud" : "whoosh"} volume={0.3} />
      <Sfx id="pop" at={cut} volume={0.25} />
    </AbsoluteFill>
  );
};

const Skit: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* the one place: a coffee shop, dimmed so the caption pops */}
    <Img
      src={staticFile(`videos/${SLUG}/${BG}`)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
    />
    <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.38)" }} />
    <Series>
      {script.scenes.map((s, i) => (
        <Series.Sequence key={s.id} name={s.id} durationInFrames={lens[i]}>
          <Scene i={i} />
          {i === 0 && <Brand />}
        </Series.Sequence>
      ))}
    </Series>
    <Music slug={SLUG} total={total} voiceRanges={[]} level={0.55} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Skit, durationInFrames: total };
