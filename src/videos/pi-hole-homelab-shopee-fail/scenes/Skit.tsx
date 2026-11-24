import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CONTENT_W,
  Meme,
  MemeCaption,
  SAFE,
  beatmap,
  hit,
  sectionAt,
} from "../../../kit";
import beatJson from "../beatmap.json";
import { PLACES, SLUG, type CatSpec, type SceneSpec } from "../data";

const MAP = beatmap(beatJson);
const CAPTION_TOP = SAFE.top + 84;
const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// The photo that sets the place, graded dark so the caption and the animals
// own the frame. It hardly moves: only a light pump on the music.
const Background: React.FC<{ place: SceneSpec["place"]; g: number }> = ({ place, g }) => {
  const cfg = PLACES[place];
  const energy = sectionAt(MAP, g).energy;
  const pump =
    energy > 0.6 ? 0.012 * hit(MAP.beats, g, 8) + 0.014 * hit(MAP.downbeats, g, 12) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c", transform: `scale(${1 + pump})` }}>
      <Img
        src={staticFile(`videos/${SLUG}/${cfg.file}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: cfg.position,
          filter: cfg.filter,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: cfg.tint }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// One line of the caption, popping in on its own beat so the sentence reads
// line by line. The kit's outline is untouched.
const CaptionLine: React.FC<{ text: string; size: number; f: number; at: number }> = ({
  text,
  size,
  f,
  at,
}) => {
  const p = interpolate(f, [at, at + 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <MemeCaption
      text={text}
      size={size}
      style={{
        position: "relative",
        width: "100%",
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px) scale(${1.05 - p * 0.05})`,
        transformOrigin: "center top",
      }}
    />
  );
};

const Caption: React.FC<{ spec: SceneSpec; f: number }> = ({ spec, f }) => (
  <div
    style={{
      position: "absolute",
      top: CAPTION_TOP,
      left: SAFE.left,
      width: CONTENT_W,
      zIndex: 6,
    }}
  >
    {spec.lines.map((line, i) => (
      <CaptionLine key={line} text={line} size={spec.size} f={f} at={i * 4} />
    ))}
  </div>
);

// An animated sticker acting the line out. It lands with a spring, floats a
// little, and gets a kick from the music in the loud section.
const Cat: React.FC<{
  cat: CatSpec;
  g: number;
  f: number;
  index: number;
  slumpAt?: number;
  hop?: number;
}> = ({ cat, g, f, index, slumpAt, hop = 0 }) => {
  const { fps } = useVideoConfig();
  const appear = spring({
    frame: Math.max(0, f - cat.delay),
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.7 },
    durationInFrames: 22,
  });
  const visible = interpolate(f, [cat.delay, cat.delay + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (f < cat.delay) return null;

  const energy = sectionAt(MAP, g).energy;
  const beatKick =
    energy > 0.6
      ? 0.035 * hit(MAP.beats, g, 9) + 0.03 * hit(MAP.downbeats, g, 12)
      : 0;
  const phase = g / 26 + index * 1.7;
  const bob = Math.sin(phase) * cat.bob;
  const drift = Math.sin(phase * 0.63 + 1.1) * 1.4;
  const tremor = cat.shake ? Math.sin((f - cat.delay) * 1.9) * cat.shake : 0;

  // The punchline sinks: deflating synth, deflating cat.
  const sink =
    slumpAt === undefined
      ? 0
      : interpolate(f, [slumpAt, slumpAt + 70], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        });

  const scale =
    (0.86 + 0.14 * appear) * (1 + beatKick + hop * 0.1) * (1 - 0.035 * sink);
  const style: CSSProperties = {
    left: cat.left,
    bottom: cat.bottom,
    width: cat.renderedWidth,
    opacity: visible,
    filter: "drop-shadow(0 16px 22px rgba(0,0,0,0.45))",
    transformOrigin: "50% 100%",
    transform: `${cat.mirror ? "scaleX(-1) " : ""}translateX(${tremor}px) translateY(${
      (1 - appear) * 34 + bob + sink * 12 - hop * 30
    }px) rotate(${cat.tilt + drift * (1 - sink) + sink * 2}deg) scale(${scale})`,
  };

  return (
    <Meme
      slug={SLUG}
      file={cat.file}
      width={cat.width}
      height={cat.height}
      style={style}
    />
  );
};

const Flash: React.FC<{ f: number; kind: SceneSpec["enter"] }> = ({ f, kind }) => {
  if (kind !== "flash" || f > 7) return null;
  return (
    <AbsoluteFill
      style={{ backgroundColor: "#FFF3D6", opacity: 0.92 * (1 - f / 8), zIndex: 8 }}
    />
  );
};

// The music drop inside s2: a warm flash and a hop from the vibing cat.
const DropFlash: React.FC<{ f: number }> = ({ f }) => {
  if (f < 186 || f > 191) return null;
  return (
    <AbsoluteFill
      style={{ backgroundColor: "#FFFFFF", opacity: 0.38 * (1 - (f - 186) / 6), zIndex: 7 }}
    />
  );
};

export const Scene: React.FC<{ spec: SceneSpec }> = ({ spec }) => {
  const f = useCurrentFrame();
  const g = spec.start + f;

  const enter = interpolate(f, [0, spec.enter === "flash" ? 7 : 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const scale = spec.enter === "flash" ? 1.06 - 0.06 * enter : 1.14 - 0.14 * enter;

  const drop =
    spec.dropAt !== undefined && f >= spec.dropAt
      ? Math.pow(Math.max(0, 1 - (f - spec.dropAt) / 26), 2)
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#04060c", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Background place={spec.place} g={g} />
        {spec.cats.map((cat, i) => (
          <Cat
            key={cat.file}
            cat={cat}
            g={g}
            f={f}
            index={i}
            slumpAt={spec.slumpAt}
            hop={drop}
          />
        ))}
      </AbsoluteFill>
      <Caption spec={spec} f={f} />
      <DropFlash f={f} />
      <Flash f={f} kind={spec.enter} />
    </AbsoluteFill>
  );
};
