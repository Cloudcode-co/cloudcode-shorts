// Test build of breakcore-swiss, footage-first, on the free-fall video's first
// three scenes: a 150 BPM grid (24 frames a beat), a shot change every one or
// two beats, white Swiss posters cut against regraded footage.
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import type { CSSProperties } from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import {
  Brand,
  FPS,
  Music,
  SAFE,
  TikTokGuide,
  Voice,
  mono,
  sans,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = "roi-tu-do-breakcore-test";
const wide = loadUnbounded("normal", { weights: ["900"], subsets: ["latin", "vietnamese"] }).fontFamily;

const BEAT = 24;
const beat = (n: number) => n * BEAT;
const INK = "#0B0B0C";
const PAPER = "#FFFFFF";
const CYAN = "#19C6E6";
const RED = "#FF2E4D";
const BLUE = "#2340FF";
const VIOLET = "#8A6CFF";

type Id = "s1" | "s2" | "s3";
const IDS: Id[] = ["s1", "s2", "s3"];
const START = (id: Id) => Math.round(timeline.scenes[id].start * FPS);
const LEN = (id: Id) => Math.round(timeline.scenes[id].length * FPS);
const TOTAL = START("s3") + LEN("s3");
const scene = (id: Id) => script.scenes.find((s) => s.id === id)!;
const CLIPS: Record<Id, string[]> = {
  s1: ["footage/space-jumper-stratosphere-edge-pixabay-126663.mp4", "footage/astronaut-helmet-visor-pixabay-132347.mp4"],
  s2: ["footage/space-jumper-stratosphere-edge-pixabay-126663.mp4", "footage/astronaut-helmet-visor-pixabay-132347.mp4"],
  s3: ["footage/astronaut-centrifuge-spin-training-pixabay-143016.mp4", "footage/astronaut-helmet-visor-pixabay-132347.mp4"],
};

// Seeded randomness, so every render of a frame is the same.
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// --- Inserts: whole-frame, 2 frames on the snare, every 2 beats.
const INSERTS = Array.from({ length: Math.floor(TOTAL / beat(2)) }, (_, k) => ({ at: beat(2 * k + 1) + 12, k }));
const insertStyle = (f: number): CSSProperties => {
  const hit = INSERTS.find((i) => f >= i.at && f < i.at + 2 && i.at > beat(2));
  if (!hit) return {};
  return [
    { filter: "invert(1)" },
    { filter: `drop-shadow(16px 0 0 ${RED}) drop-shadow(-16px 0 0 ${CYAN})` },
    { transform: "scaleX(-1)" },
    { transform: "scaleX(2.2) skewX(-16deg)" },
  ][hit.k % 4];
};
// Per-beat regrade: natural, acid, pink-violet, sepia. Acid and pink are
// duotones (greyscale multiplied by a fixed gradient), so every clip lands on
// the same colours whatever its own palette.
const MONO = "grayscale(1) contrast(1.35) brightness(1.15)";
const GRADES: { filter: string; tint?: string }[] = [
  { filter: "none" },
  { filter: MONO, tint: "linear-gradient(180deg, #19E6D2, #C6FF1A)" },
  { filter: MONO, tint: "linear-gradient(180deg, #FF7AD9, #8B5CF6)" },
  { filter: "sepia(0.9) saturate(1.4)" },
];
const Graded: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => {
  const g = GRADES[n % 4];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: g.filter }}>{children}</AbsoluteFill>
      {g.tint && <AbsoluteFill style={{ background: g.tint, mixBlendMode: "multiply" }} />}
    </AbsoluteFill>
  );
};

// --- The shot list: each scene cut into shots of one or two beats.
type Kind = "word" | "poster" | "footage" | "portal" | "scatter" | "bars";
type Shot = { from: number; len: number; kind: Kind; seed: number; clip: string };
const PATTERN: Kind[] = ["poster", "footage", "scatter", "footage", "portal", "poster", "bars", "footage"];
const SHOTS: Record<Id, Shot[]> = Object.fromEntries(
  IDS.map((id, si) => {
    const total = LEN(id) / BEAT;
    const shots: Shot[] = [];
    let b = 0;
    let n = 0;
    while (b < total) {
      const len = Math.min(total - b, n === 0 ? 2 : rand(si * 50 + n) < 0.55 ? 1 : 2);
      const kind = n === 0 ? "word" : PATTERN[(n + si * 3) % PATTERN.length];
      shots.push({ from: beat(b), len: beat(len), kind, seed: si * 100 + n, clip: CLIPS[id][n % 2] });
      b += len;
      n++;
    }
    return [id, shots];
  }),
) as Record<Id, Shot[]>;
const shotAt = (id: Id, f: number) => SHOTS[id].find((s) => f >= s.from && f < s.from + s.len)!;
const isDark = (k: Kind) => k === "footage" || k === "bars";

// --- Poster vocabulary.
const lerp = (f: number, at: number, dur: number) =>
  f < at ? 0 : interpolate(f - at, [0, dur], [0, 1], { extrapolateRight: "clamp" });

const Disc: React.FC<{ x: number; y: number; d: number }> = ({ x, y, d }) => (
  <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: `radial-gradient(circle, ${INK} 0%, #555 22%, #DDD 52%, transparent 70%)` }} />
);
const Ring: React.FC<{ x: number; y: number; w: number; h: number; spin: number; dashed?: boolean }> = ({ x, y, w, h, spin, dashed }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: "50%", border: `3px ${dashed ? "dashed" : "solid"} ${INK}`, transform: `rotate(${spin}deg)` }} />
);
const Cone: React.FC<{ x: number; y: number; angle: number; color: string; size?: number }> = ({ x, y, angle, color, size = 900 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y - size / 2,
      width: size,
      height: size,
      background: `linear-gradient(90deg, transparent, ${color})`,
      clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
      transform: `rotate(${angle}deg)`,
      transformOrigin: "0 50%",
      opacity: 0.8,
    }}
  />
);
const Slab: React.FC<{ x: number; y: number; w: number; h: number; angle: number }> = ({ x, y, w, h, angle }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, background: INK, transform: `rotate(${angle}deg)` }} />
);
const Dots: React.FC<{ x: number; y: number; n: number }> = ({ x, y, n }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 9 }}>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ width: 9, height: 9, borderRadius: 5, background: INK }} />
    ))}
  </div>
);
const Pills: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: x + i * 14, top: y + i * 40, width: 64, height: 16, borderRadius: 8, background: CYAN, transform: "rotate(-24deg)" }} />
    ))}
  </>
);
const Squiggle: React.FC<{ y: number; p: number }> = ({ y, p }) => (
  <svg width={1080} height={200} style={{ position: "absolute", left: 0, top: y }}>
    <path
      d={Array.from({ length: 14 }, (_, i) => `${i === 0 ? "M" : "Q"}${60 + i * 70} ${i % 2 ? 40 : 160} ${100 + i * 70} 100`).join(" ")}
      stroke={BLUE}
      strokeWidth={6}
      fill="none"
      strokeDasharray={1200}
      strokeDashoffset={1200 * (1 - p)}
    />
  </svg>
);
const Vertical: React.FC<{ x: number; y: number; text: string; color?: string }> = ({ x, y, text, color = INK }) => (
  <div style={{ position: "absolute", left: x, top: y, writingMode: "vertical-rl", fontFamily: wide, fontSize: 34, color }}>{text}</div>
);

// --- Shots.
const Poster: React.FC<{ s: Shot; f: number; id: Id }> = ({ s, f, id }) => {
  const r = (k: number) => rand(s.seed * 7 + k);
  const t = f - s.from;
  const flip = r(1) < 0.5;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Cone x={flip ? 620 : 40} y={560 + r(2) * 400} angle={(flip ? 180 : 0) + (r(3) - 0.5) * 30 + t * 0.6} color={r(4) < 0.5 ? VIOLET : "#FF3EA5"} size={760} />
      <Ring x={420 + r(5) * 240} y={760} w={640} h={560} spin={t * 0.8} />
      <Ring x={500} y={760} w={260} h={260} spin={-t * 2} dashed />
      <Disc x={flip ? 300 : 760} y={620 + r(6) * 300} d={360} />
      <div style={{ position: "absolute", left: 300 + r(7) * 300, top: 950, width: 200, height: 100, borderRadius: "200px 200px 0 0", background: INK, transform: "rotate(180deg)" }} />
      <Slab x={200 + r(8) * 600} y={440 + r(9) * 300} w={420} h={30} angle={-30 + t * 2.5} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={0} y1={980} x2={1080 * lerp(t, 0, 10)} y2={980 - 200 * r(10)} stroke={INK} strokeWidth={3} />
      </svg>
      <Dots x={SAFE.left + r(11) * 300} y={330} n={10} />
      <Pills x={760} y={420 + r(12) * 200} />
      {r(13) < 0.6 && <Squiggle y={1020} p={lerp(t, 0, 14)} />}
      <Vertical x={850} y={520} text={scene(id).headline.split(" ")[0]} />
    </AbsoluteFill>
  );
};

const Ribbon: React.FC<{ points: [number, number, number][]; color: string; t: number }> = ({ points, color, t }) => {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    const n = 40;
    const part = new THREE.CatmullRomCurve3(Array.from({ length: n + 1 }, (_, i) => curve.getPoint((i / n) * Math.max(0.02, t))));
    return new THREE.TubeGeometry(part, 80, 0.12, 10, false);
  }, [points, t]);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} />
    </mesh>
  );
};
const RIBBONS: { points: [number, number, number][]; color: string }[] = [
  { points: [[-4, -1, 0], [-1, 1.4, 1], [1, 0.2, 0.5], [4, 2.6, -1]], color: "#FFE44D" },
  { points: [[4, -0.6, -1], [1, 0.6, 1], [-1, 2, 0], [-4, 3, 1]], color: "#FF3EA5" },
  { points: [[-4, 2.2, -1], [-1, 0, 0.5], [2, 1.8, 1], [4, -0.4, 0]], color: BLUE },
];
const Footage: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  const ribbons = rand(s.seed) < 0.6;
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Graded n={Math.floor(f / BEAT)}>
        <Sequence from={s.from} layout="none">
          <OffthreadVideo src={videoAsset(SLUG, s.clip)} muted trimBefore={Math.round(rand(s.seed + 3) * 300)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
      </Graded>
      {ribbons && (
        <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0, 9], fov: 40 }} style={{ position: "absolute", inset: 0 }}>
          {RIBBONS.map((r, i) => (
            <Ribbon key={i} {...r} t={interpolate(t - i * 4, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          ))}
        </ThreeCanvas>
      )}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={0} y1={1080} x2={1080} y2={1080} stroke="#FFFFFF" strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => (
          <text key={i} x={120 + rand(s.seed + i) * 700} y={400 + rand(s.seed + i + 9) * 500} fill="#FFFFFF" fontSize={40} fontFamily={mono}>
            +
          </text>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// Colour-bar cards fanning through 3D over the footage.
const Bars: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  return (
    <AbsoluteFill>
      <Footage s={s} f={f} />
      <AbsoluteFill style={{ perspective: 900 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 260 + i * 70 - t * 3,
              top: 560 + i * 18,
              width: 300,
              height: 190,
              display: "flex",
              transform: `rotateY(${-55 + i * 8 + t * 1.2}deg) rotateZ(${-8 + i * 3}deg)`,
              boxShadow: "0 0 0 4px #FFFFFF",
            }}
          >
            {["#C0C0C0", "#C0C000", "#00C0C0", "#00C000", "#C000C0", "#C00000", "#0000C0"].map((c) => (
              <div key={c} style={{ flex: 1, background: c }} />
            ))}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Footage in a ring portal, zoomed through on the shot's last half-beat.
const Portal: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  const z = t < s.len - 12 ? 1 : interpolate(t, [s.len - 12, s.len], [1, 7]);
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "540px 760px" }}>
        {[1.2, 1.4, 1.65].map((k, i) => (
          <Ring key={i} x={540} y={760} w={520 * k} h={520 * k} spin={t * (i + 1) * (i % 2 ? -1.4 : 1)} dashed={i === 1} />
        ))}
        <div style={{ position: "absolute", left: 280, top: 500, width: 520, height: 520, borderRadius: "50%", overflow: "hidden" }}>
          <Graded n={Math.floor(f / BEAT) + 1}>
            <Sequence from={s.from} layout="none">
              <OffthreadVideo src={videoAsset(SLUG, s.clip)} muted trimBefore={Math.round(rand(s.seed + 5) * 300)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Sequence>
          </Graded>
        </div>
      </AbsoluteFill>
      <Dots x={SAFE.left} y={330} n={8} />
    </AbsoluteFill>
  );
};

// A still broken into cyan pixels that gather, then scatter.
const COLS = 18;
const ROWS = 14;
const Scatter: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = (f - s.from) / s.len;
  const cell = 1080 / COLS;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 0, top: 520, width: 1080, height: ROWS * cell, filter: "grayscale(1) sepia(1) hue-rotate(150deg) saturate(5) brightness(1.1)" }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const x = i % COLS;
          const y = Math.floor(i / COLS);
          if (rand(i + s.seed) < 0.35) return null;
          const spread = Math.abs(t - 0.45) * 2.2;
          const dx = (rand(i * 3) - 0.5) * 600 * spread;
          const dy = (rand(i * 5) - 0.5) * 300 * spread;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x * cell + dx,
                top: y * cell + dy,
                width: cell * (rand(i * 7) < 0.3 ? 0.5 : 1),
                height: cell,
                backgroundImage: `url(${videoAsset(SLUG, "scatter.jpg")})`,
                backgroundSize: `1080px ${ROWS * cell}px`,
                backgroundPosition: `${-x * cell}px ${-y * cell}px`,
                opacity: 1 - spread * 0.6,
              }}
            />
          );
        })}
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={SAFE.left} y1={1300} x2={880} y2={1300} stroke={INK} strokeWidth={3} />
      </svg>
    </AbsoluteFill>
  );
};

// The key word slammed in, cropped off the frame, over a cone.
const Word: React.FC<{ s: Shot; f: number; id: Id }> = ({ s, f, id }) => {
  const t = f - s.from;
  const word = scene(id).headline.split(" ")[0];
  const slam = t < 2 ? 1.3 : t < 4 ? 1.06 : 1;
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      <Cone x={460} y={760} angle={-10 + t * 0.8} color={VIOLET} size={900} />
      <Disc x={760} y={640} d={300} />
      <div style={{ position: "absolute", left: -30, top: 520, fontFamily: wide, fontSize: 300, lineHeight: 1, color: INK, letterSpacing: -12, transform: `scale(${slam})`, transformOrigin: "left center", whiteSpace: "nowrap" }}>
        {word}
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={0} y1={500} x2={1080 * lerp(t, 0, 8)} y2={500} stroke={INK} strokeWidth={3} />
      </svg>
    </AbsoluteFill>
  );
};

// The scene's fact stays put while the shots cut underneath it.
const FactLayer: React.FC<{ id: Id; dark: boolean; f: number }> = ({ id, dark, f }) => {
  const sc = scene(id);
  const long = sc.headline.length > 8;
  if (f < beat(1)) return null;
  return (
    <>
      <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: 1130, fontFamily: wide, fontSize: long ? 76 : 120, lineHeight: 1, color: dark ? "#FFFFFF" : INK, letterSpacing: -2, textShadow: dark ? `5px 5px 0 ${INK}` : undefined }}>
        {sc.headline}
      </div>
      <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: long ? 1240 : 1275, fontFamily: sans, fontWeight: 700, fontSize: 40, color: dark ? "#FFFFFF" : INK, textShadow: dark ? `3px 3px 0 ${INK}` : undefined }}>
        {sc.lines[0]}
      </div>
    </>
  );
};

const Scene: React.FC<{ id: Id }> = ({ id }) => {
  const f = useCurrentFrame();
  const s = shotAt(id, f);
  const body =
    s.kind === "word" ? <Word s={s} f={f} id={id} /> :
    s.kind === "poster" ? <Poster s={s} f={f} id={id} /> :
    s.kind === "portal" ? <Portal s={s} f={f} /> :
    s.kind === "scatter" ? <Scatter s={s} f={f} /> :
    s.kind === "bars" ? <Bars s={s} f={f} /> :
    <Footage s={s} f={f} />;
  return (
    <AbsoluteFill>
      {body}
      <FactLayer id={id} dark={isDark(s.kind)} f={f} />
      {id === "s1" && f < beat(4) && (
        <>
          <div style={{ position: "absolute", left: 0, top: 226, width: 560, height: 96, background: INK }} />
          <Brand />
        </>
      )}
      <Voice slug={SLUG} id={id} />
    </AbsoluteFill>
  );
};

const Main: React.FC<VideoProps> = ({ guide }) => {
  const f = useCurrentFrame();
  const ranges: [number, number][] = IDS.map((id) => [START(id), START(id) + Math.round(durations[id] * FPS)]);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <AbsoluteFill style={insertStyle(f)}>
        {IDS.map((id) => (
          <Sequence key={id} from={START(id)} durationInFrames={LEN(id)} name={id}>
            <Scene id={id} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <Music slug={SLUG} total={TOTAL} voiceRanges={ranges} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = { id: SLUG, component: Main, durationInFrames: TOTAL };
