import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
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
  beatmap,
  flash,
  hit,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import beatsJson from "./beatmap.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

// A Vietnamese TikTok meme skit: one photo of the room held for the whole
// video, a huge yellow caption at the top and one cat sticker acting the line
// out in the lower half. Every cut is a flash or a zoom punch on the beat.

const SLUG = script.slug;
const MAP = beatmap(beatsJson);
const T = 12; // frames each cut overlaps

// The room: a dark gaming desk at night, with the monitor and the PC lights
// showing where the server really lives. One place for the whole story.
const BG =
  facts.images.find((i) => i.query === "gaming setup night")?.file ??
  "images/gaming-setup-night-pixabay-289470.jpg";

// The sticker per line: a clean cut-out of the reaction the caption needs.
const MEME_FILE: Record<string, string> = {
  s1: "memes/cat-typing-laptop-giphy-hiJ9ypGI5tIKdwKoK2.gif",
  s2: "memes/shocked-cat-giphy-xUA7b7SQ5ZhNrIJAMo.gif",
  s3: "memes/cat-panic-giphy-eAot8Ldr85y3peseC3.gif",
  s4: "memes/cat-screaming-giphy-cODsKQjgESv852mIPd.gif",
  s5: "memes/cat-crying-giphy-Xr9TlAqw3S7VPOrftK.gif",
};

const memeFor = (scene: string) => {
  const m = facts.memes.find((x) => x.file === MEME_FILE[scene]);
  if (!m) throw new Error(`no meme for ${scene}`);
  return m;
};

// Timeline length in frames, straight from timeline.json (60fps).
const lens = Object.fromEntries(
  Object.entries(timeline.scenes).map(([id, s]) => [id, Math.round(s.length * FPS)]),
) as Record<string, number>;
const starts = Object.fromEntries(
  Object.entries(timeline.scenes).map(([id, s]) => [id, Math.round(s.start * FPS)]),
) as Record<string, number>;

type Skit = {
  id: string;
  start: number;
  len: number;
  caption: string;
  // where the cat sits
  left: number;
  top: number;
  width: number;
  origin: string;
  tilt: number;
  // how the photo is framed for this line
  bgPos: string;
  zoom: [number, number];
  bright: number;
  sat: number;
  delay: number;
};

// Captions break on meaning, never one word alone on a line.
const SHOTS: Skit[] = [
  {
    id: "s1",
    start: starts.s1,
    len: lens.s1,
    caption: "Hí hửng dựng server Palworld\ntrên con VPS 4GB RAM vừa săn sale\ncho 5 anh em cày đêm",
    left: 181,
    top: 958,
    width: 725,
    origin: "50% 50%",
    tilt: -2,
    bgPos: "50% 56%",
    zoom: [1.03, 1.1],
    bright: 0.92,
    sat: 1,
    delay: 9,
  },
  {
    id: "s2",
    start: starts.s2,
    len: lens.s2,
    caption: "Anh em vừa lụm xong\n3 con Pal đầu tiên thì thanh RAM\nvọt thẳng lên 99%",
    left: 178,
    top: 768,
    width: 724,
    origin: "50% 50%",
    tilt: 0,
    bgPos: "56% 46%",
    zoom: [1.08, 1.15],
    bright: 0.82,
    sat: 0.95,
    delay: 6,
  },
  {
    id: "s3",
    start: starts.s3,
    len: lens.s3,
    caption: "Cả team bắt đầu trôi xuyên tường\nrơi xuống biển, cửa sổ SSH\nđơ không nhận lệnh",
    left: 24,
    top: 518,
    width: 942,
    origin: "55% 70%",
    tilt: -4,
    bgPos: "42% 58%",
    zoom: [1.04, 1.12],
    bright: 0.75,
    sat: 0.9,
    delay: 4,
  },
  {
    id: "s4",
    start: starts.s4,
    len: lens.s4,
    caption: "Check console thấy OOM Killer\nthẳng tay trảm server game,\nswapfile 16GB cháy đỏ rực",
    left: 155,
    top: 775,
    width: 760,
    origin: "51% 43%",
    tilt: 0,
    bgPos: "78% 52%",
    zoom: [1.12, 1.19],
    bright: 0.66,
    sat: 0.88,
    delay: 2,
  },
  {
    id: "s5",
    start: starts.s5,
    len: lens.s5,
    caption: "Discord anh em réo đòi\nđền save game, còn mình ngồi khóc\nngắm bảng giá VPS 32GB",
    left: 95,
    top: 796,
    width: 776,
    origin: "55% 57%",
    tilt: -3,
    bgPos: "50% 52%",
    zoom: [1.12, 1.04],
    bright: 0.64,
    sat: 0.7,
    delay: 8,
  },
];

const TOTAL = Math.round(timeline.total * FPS);
const CAP_TOP = SAFE.top + BRAND_SPACE + 2;
const CAP_SIZE = 58;

// The photo, held still and pushed slowly in for the length of the line.
const Backdrop: React.FC<{ shot: Skit; local: number; global: number }> = ({ shot, local, global }) => {
  const p = interpolate(local, [0, shot.len], [0, 1], { extrapolateRight: "clamp" });
  const impact = shot.id === "s4" ? 0.14 * Math.exp(-local / 8) : 0;
  const pulse = 0.012 * hit(MAP.beats, global, 8);
  const scale = shot.zoom[0] + (shot.zoom[1] - shot.zoom[0]) * p + impact + pulse;
  const flare = shot.id === "s4" ? 0.42 * Math.exp(-local / 6) : 0;
  const cool = shot.id === "s5" ? interpolate(local, [0, shot.len], [0.7, 0.32], { extrapolateRight: "clamp" }) : shot.sat;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070b", overflow: "hidden" }}>
      <Img
        src={staticFile(`videos/${SLUG}/${BG}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: shot.bgPos,
          scale,
          filter: `brightness(${(shot.bright + flare).toFixed(3)}) saturate(${cool.toFixed(3)})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 62% at 50% 48%, rgba(0,0,0,0) 32%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// The caption slams in once per line and replaces the last one.
const Caption: React.FC<{ text: string; local: number }> = ({ text, local }) => {
  const { fps } = useVideoConfig();
  const pop = spring({ frame: local + 1, fps, config: { damping: 13, stiffness: 240, mass: 0.6 } });
  return (
    <MemeCaption
      text={text}
      size={CAP_SIZE}
      style={{
        top: CAP_TOP,
        left: 66,
        right: 66,
        whiteSpace: "pre-line",
        opacity: interpolate(local, [0, 2], [0, 1], { extrapolateRight: "clamp" }),
        scale: 1 + 0.16 * (1 - pop),
        transformOrigin: "50% 30%",
      }}
    />
  );
};

// One cat, big, acting the line out. It pops in, then keeps breathing with
// the track and drifts as the shot builds.
const Cat: React.FC<{ shot: Skit; local: number; global: number }> = ({ shot, local, global }) => {
  const { fps } = useVideoConfig();
  const m = memeFor(shot.id);
  const p = interpolate(local, [0, shot.len], [0, 1], { extrapolateRight: "clamp" });
  const pop = spring({
    frame: local - shot.delay,
    fps,
    config: { damping: 12, stiffness: shot.id === "s4" ? 300 : 190, mass: 0.7 },
  });
  const beat = hit(MAP.beats, global, 9);
  const bob = Math.sin(global / 26 + SHOTS.indexOf(shot)) * 4;
  const enter = 0.76 + 0.24 * pop;
  const settle = 1 + 0.04 * beat;
  let x = 0;
  let y = bob - 6 * beat;
  let rot = shot.tilt + Math.sin(global / 70) * 1.1;
  let sc = enter * settle;

  if (shot.id === "s3") {
    // floating through the wall and out to sea
    x = 14 * p;
    y = bob - 46 * p;
    rot = shot.tilt + 10 * p;
  }
  if (shot.id === "s5") {
    // slumped, sinking a little
    y = 10 * p + bob * 0.4;
    sc = enter * (1 - 0.04 * p);
  }
  if (shot.id === "s2") {
    sc = enter * (1 + 0.05 * p);
  }

  return (
    <Meme
      slug={SLUG}
      file={m.file}
      width={m.width}
      height={m.height}
      style={{
        left: shot.left,
        top: shot.top,
        width: shot.width,
        opacity: interpolate(local - shot.delay, [0, 3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        scale: sc,
        translate: `${x.toFixed(1)}px ${y.toFixed(1)}px`,
        rotate: `${rot.toFixed(2)}deg`,
        transformOrigin: shot.origin,
      }}
    />
  );
};

const SkitShot: React.FC<{ shot: Skit }> = ({ shot }) => {
  const local = useCurrentFrame();
  const global = shot.start + local;
  // The OOM kill shakes the room for a beat.
  const decay = shot.id === "s4" ? Math.exp(-local / 9) : 0;
  const shake = local < 36 ? decay : 0;
  const sx = Math.sin(local * 2.4) * 17 * shake;
  const sy = Math.cos(local * 3.1) * 11 * shake;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${sx.toFixed(1)}px ${sy.toFixed(1)}px` }}>
        <Backdrop shot={shot} local={local} global={global} />
        <Cat shot={shot} local={local} global={global} />
      </AbsoluteFill>
      <Caption text={shot.caption} local={local} />
      {shot.id === "s1" && <Brand />}
    </AbsoluteFill>
  );
};

const timing = linearTiming({ durationInFrames: T });

const Skit: React.FC<VideoProps> = ({ guide }) => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {SHOTS.flatMap((shot, i) => {
          const seq = (
            <TransitionSeries.Sequence
              key={shot.id}
              name={shot.id}
              durationInFrames={i === SHOTS.length - 1 ? shot.len : shot.len + T}
            >
              <SkitShot shot={shot} />
              {i === 0 && <Sfx id="thud" volume={0.5} />}
              {i === 1 && <Sfx id="whoosh" volume={0.3} />}
              {i === 2 && <Sfx id="whoosh" volume={0.28} />}
              {i === 3 && <Sfx id="thud" volume={0.55} />}
              {i === 4 && <Sfx id="whoosh" volume={0.24} />}
              <Sfx id="pop" at={shot.delay} volume={0.28} />
              {i === 0 && <Sfx id="typing" at={40} frames={90} volume={0.16} />}
              {i === 3 && <Sfx id="pixel" at={6} volume={0.22} />}
            </TransitionSeries.Sequence>
          );
          const trans =
            i === 0 || i === 2 ? (
              <TransitionSeries.Transition
                key={`t-${shot.id}`}
                presentation={flash("#ffffff")}
                timing={timing}
              />
            ) : i < SHOTS.length - 1 ? (
              <TransitionSeries.Transition
                key={`t-${shot.id}`}
                presentation={zoomPunch()}
                timing={timing}
              />
            ) : null;
          return [seq, trans];
        })}
      </TransitionSeries>
      <Music slug={SLUG} total={TOTAL} voiceRanges={[]} level={0.55} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Skit,
  durationInFrames: TOTAL,
};
