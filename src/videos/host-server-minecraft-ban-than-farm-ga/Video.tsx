import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { BRAND_SPACE, Brand, Meme, MemeCaption, Music, Sfx, FPS, SAFE, type VideoDef } from "../../kit";
import facts from "./facts.json";
import timeline from "./timeline.json";

const SLUG = "host-server-minecraft-ban-than-farm-ga";
const BG = "images/laptop-desk-bedroom-pixabay-6012873.jpg";
const out = Easing.bezier(0.23, 1, 0.32, 1);

type MemeFact = (typeof facts.memes)[number];
const memeOf = (scene: string) => facts.memes.find((m) => m.scene === scene) as MemeFact;

// Background crops (scale, focus point in %) cycled per beat: the place stays,
// the camera keeps jumping.
const CROPS = [
  { s: 1.5, x: 50, y: 62 },
  { s: 2.1, x: 45, y: 52 },
  { s: 1.6, x: 72, y: 45 },
  { s: 2.4, x: 50, y: 56 },
  { s: 1.8, x: 28, y: 60 },
];

type SceneDef = { id: string; partner: string; beats: string[]; sfx?: string };
const SCENES: SceneDef[] = [
  { id: "s1", partner: "s2", beats: ["Sinh viên IT mở server Minecraft", "trên laptop cũ", "rủ đám bạn vào", "chơi chill chill"] },
  { id: "s2", partner: "s1", beats: ["Cả team hứa danh dự", "chỉ xây nhà gỗ, trồng lúa", "sinh tồn lành mạnh cuối tuần"] },
  { id: "s3", partner: "s2", beats: ["Nửa tiếng sau", "thấy một thằng cặm cụi", "dựng quả farm năm ngàn con gà", "bằng redstone"], sfx: "thud" },
  { id: "s4", partner: "s3", beats: ["TPS server tụt về 0.1", "quạt laptop bắt đầu hú", "như động cơ phản lực cất cánh"], sfx: "thud" },
  { id: "s5", partner: "s4", beats: ["Màn hình đứng im", "kèm dòng log huyền thoại", "Java heap space", "văng cả lũ ra ngoài"], sfx: "ding" },
];

const frames = (s: number) => Math.round(s * FPS);
const TOTAL = frames(timeline.total);

const Beat: React.FC<{
  scene: SceneDef;
  index: number;
  count: number;
  length: number;
  global: number;
  tilt: number;
}> = ({ scene, index, count, length, global, tilt }) => {
  const f = useCurrentFrame();
  const crop = CROPS[global % CROPS.length];
  const kick = interpolate(f, [0, 10], [0.14, 0], { extrapolateRight: "clamp", easing: out });
  const drift = (f / length) * 0.08;
  const bgScale = crop.s * (1 + kick + drift);
  const pop = spring({ frame: f, fps: FPS, config: { damping: 11, stiffness: 190 }, durationInFrames: 22 });
  const capIn = interpolate(f, [0, 8], [1.18, 1], { extrapolateRight: "clamp", easing: out });
  const main = memeOf(scene.id);
  const partner = memeOf(scene.partner);
  const flip = index % 2 === 1;
  const duo = index > 0 && !(scene.id === "s5" && index === count - 1);
  const last = scene.id === "s5" && index === count - 1;

  const catScale = 0.82 + 0.18 * pop;
  const mainW = duo ? 520 : last ? 760 : 700;
  const mainH = (mainW * main.height) / main.width;
  const partnerW = 480;
  const partnerH = (partnerW * partner.height) / partner.width;
  const mainLeft = duo ? (flip ? 530 : 30) : (1080 - mainW) / 2 - 40;
  const partnerLeft = flip ? 30 : 560;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#111" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale}) rotate(${tilt}deg)`,
          transformOrigin: `${crop.x}% ${crop.y}%`,
        }}
      >
        <Img src={staticFile(`videos/${SLUG}/${BG}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.28)" }} />

      <Meme
        slug={SLUG}
        file={main.file}
        width={main.width}
        height={main.height}
        style={{
          left: mainLeft,
          top: 1440 - mainH + 40,
          width: mainW,
          transform: `scale(${catScale}) scaleX(${duo && !flip ? 1 : duo ? -1 : 1})`,
          transformOrigin: "50% 100%",
        }}
      />
      {duo && (
        <Meme
          slug={SLUG}
          file={partner.file}
          width={partner.width}
          height={partner.height}
          style={{
            left: partnerLeft,
            top: 1440 - partnerH + 20,
            width: partnerW,
            transform: `scale(${catScale}) scaleX(${flip ? 1 : -1})`,
            transformOrigin: "50% 100%",
          }}
        />
      )}

      <MemeCaption
        text={scene.beats[index]}
        size={86}
        style={{
          left: SAFE.left - 20,
          width: 1080 - SAFE.left - SAFE.right + 40,
          top: SAFE.top + (global === 0 ? BRAND_SPACE : 0),
          transform: `scale(${capIn})`,
          transformOrigin: "50% 0%",
        }}
      />
      <Sfx id="pop" volume={0.25} />
      {index === 0 && scene.sfx && <Sfx id={scene.sfx} volume={0.4} />}
      {index === 0 && !scene.sfx && <Sfx id="whoosh" volume={0.3} />}
      {global === 0 && <Brand />}
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 2, 9], [0, 0.95, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: o }} />;
};

const Main: React.FC = () => {
  const tree: React.ReactNode[] = [];
  let g = 0;
  SCENES.forEach((scene, si) => {
    const start = frames(timeline.scenes[scene.id as "s1"].start);
    const len = frames(timeline.scenes[scene.id as "s1"].length);
    const n = scene.beats.length;
    const base = Math.floor(len / n);
    scene.beats.forEach((_, bi) => {
      const from = start + bi * base;
      const length = bi === n - 1 ? len - bi * base : base;
      tree.push(
        <Sequence key={`${scene.id}-${bi}`} from={from} durationInFrames={length} name={`${scene.id} beat ${bi + 1}`}>
          <Beat scene={scene} index={bi} count={n} length={length} global={g} tilt={g % 2 ? -1.2 : 1.2} />
        </Sequence>,
      );
      // a quick flash on each new place in the story (scene change)
      if (bi === 0 && si > 0) {
        tree.push(
          <Sequence key={`fl-${scene.id}`} from={from} durationInFrames={10} name="flash">
            <Flash />
          </Sequence>,
        );
      }
      g++;
    });
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {tree}
      <Music slug={SLUG} total={TOTAL} voiceRanges={[]} level={0.55} />
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Main,
  durationInFrames: TOTAL,
};
