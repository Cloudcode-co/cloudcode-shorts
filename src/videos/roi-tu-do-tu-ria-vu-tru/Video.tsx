// Breakcore Swiss, footage-first: a free fall from 39 km cut on a 150 BPM grid
// (24 frames a beat). Every scene is cut into 1–2 beat shots — regraded
// footage with ribbons, the satellite view down, white Swiss posters, pixel
// scatters, a ring portal and colour-bar cards — under one still fact.
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import type { CSSProperties } from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import {
  Brand,
  FPS,
  Music,
  SAFE,
  SatelliteZoom,
  Sfx,
  TikTokGuide,
  Voice,
  altitudeZoom,
  easeOut,
  mono,
  sans,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const SAT = facts.satellite;
const wide = loadUnbounded("normal", { weights: ["900"], subsets: ["latin", "vietnamese"] }).fontFamily;

const BEAT = 24;
const beat = (n: number) => n * BEAT;
const INK = "#0B0B0C";
const PAPER = "#FFFFFF";
const CYAN = "#19C6E6";
const RED = "#FF2E4D";
const BLUE = "#2340FF";
const VIOLET = "#8A6CFF";
const PINK = "#FF3EA5";

type Id = "s1" | "s2" | "s3" | "s4" | "s5" | "s6";
const IDS: Id[] = ["s1", "s2", "s3", "s4", "s5", "s6"];
const START = (id: Id) => Math.round(timeline.scenes[id].start * FPS);
const LEN = (id: Id) => Math.round(timeline.scenes[id].length * FPS);
const TOTAL = START("s6") + LEN("s6");
const scene = (id: Id) => script.scenes.find((s) => s.id === id)!;

// --- Footage per scene (file, seconds, crop).
type Clip = { file: string; dur: number; pos?: string };
const C = {
  jumper: { file: "footage/space-jumper-stratosphere-edge-pixabay-126663.mp4", dur: 14, pos: "35% 50%" },
  earth: { file: "footage/earth-from-stratosphere-balloon-pixabay-135988.mp4", dur: 12, pos: "50% 50%" },
  visor: { file: "footage/astronaut-helmet-visor-pixabay-132347.mp4", dur: 55, pos: "50% 50%" },
  jet: { file: "footage/fighter-jet-supersonic-pixabay-381550.mp4", dur: 7 },
  spin: { file: "footage/astronaut-centrifuge-spin-training-pixabay-143016.mp4", dur: 16, pos: "30% 50%" },
  globe: { file: "footage/spinning-camera-sky-rotation-pixabay-1393.mp4", dur: 60, pos: "50% 50%" },
  steam: { file: "footage/boiling-water-bubbles-pixabay-370405.mp4", dur: 31 },
  clock: { file: "footage/clock-ticking-seconds-pixabay-15615.mp4", dur: 22, pos: "40% 50%" },
  para: { file: "footage/parachute-opening-sky-pixabay-81945.mp4", dur: 11, pos: "25% 50%" },
  glide: { file: "footage/skydiving-freefall-pixabay-369959.mp4", dur: 8 },
  desert: { file: "footage/skydiver-landing-in-desert-pixabay-284568.mp4", dur: 17 },
} satisfies Record<string, Clip>;
const CLIPS: Record<Id, Clip[]> = {
  s1: [C.jumper, C.earth, C.visor],
  s2: [C.jet, C.jumper, C.earth],
  s3: [C.spin, C.globe, C.spin],
  s4: [C.steam, C.earth, C.visor],
  s5: [C.visor, C.clock, C.visor],
  s6: [C.para, C.glide, C.desert],
};

// Per scene: the key word for its opening slam, the fact counter, its line.
type Fact = { word: string; from: number; to: number; dec: number; unit: string; line: string; alt?: [number, number] };
const FACTS: Record<Id, Fact> = {
  s1: { word: "RƠI", from: 39, to: 39, dec: 0, unit: "km", line: scene("s1").lines[0], alt: [39000, 37000] },
  s2: { word: "MACH", from: 0, to: 1357.64, dec: 2, unit: "km/h", line: scene("s2").lines[2] },
  s3: { word: "XOAY", from: 0, to: 120, dec: 0, unit: "vòng/phút", line: scene("s3").lines[0] },
  s4: { word: "SÔI", from: 39000, to: 19000, dec: 0, unit: "m", line: "Giới hạn Armstrong", alt: [19000, 15000] },
  s5: { word: "THỞ", from: 15, to: 15, dec: 0, unit: "giây", line: scene("s5").lines[0] },
  s6: { word: "DÙ", from: 19000, to: 2500, dec: 0, unit: "m", line: scene("s6").lines[1], alt: [2500, 1800] },
};
// Vietnamese number format: 1.357,64
const fmt = (v: number, dec: number) => {
  const [i, d] = v.toFixed(dec).split(".");
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return d ? `${int},${d}` : int;
};

// Seeded randomness, so every render of a frame is the same.
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// --- Inserts: whole-frame, 2 frames on the snare, every 2 beats.
const INSERTS = Array.from({ length: Math.floor(TOTAL / beat(2)) }, (_, k) => ({ at: beat(2 * k + 1) + 12, k }));
const insertStyle = (f: number): CSSProperties => {
  const hit = INSERTS.find((i) => f >= i.at && f < i.at + 2 && i.at > beat(4));
  if (!hit) return {};
  return [
    { filter: "invert(1)" },
    { filter: `drop-shadow(16px 0 0 ${RED}) drop-shadow(-16px 0 0 ${CYAN})` },
    { transform: "scaleX(-1)" },
    { transform: "scaleX(2.2) skewX(-16deg)" },
  ][hit.k % 4];
};

// Per-beat regrade: natural, acid, pink-violet, sepia.
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

// --- The shot list.
type Kind = "word" | "poster" | "footage" | "sat" | "portal" | "scatter" | "bars";
type Shot = { from: number; len: number; kind: Kind; seed: number; clip: Clip };
const PATTERNS: Record<Id, Kind[]> = {
  s1: ["footage", "poster", "sat", "scatter", "footage", "portal"],
  s2: ["footage", "scatter", "footage", "poster", "footage", "bars", "footage", "portal"],
  // The drop: portal and bars back to back on the strongest line.
  s3: ["footage", "portal", "bars", "footage", "scatter", "footage", "poster"],
  s4: ["sat", "poster", "footage", "scatter", "footage", "bars", "footage", "portal"],
  s5: ["footage", "poster", "footage", "scatter", "footage", "portal", "footage", "bars"],
  s6: ["footage", "sat", "poster", "footage", "scatter", "footage", "portal", "bars"],
};
const SHOTS: Record<Id, Shot[]> = Object.fromEntries(
  IDS.map((id, si) => {
    const total = LEN(id) / BEAT;
    // s6 keeps its last 2 beats for the closing slam of the opening word.
    const body = id === "s6" ? total - 2 : total;
    const shots: Shot[] = [];
    let b = 0;
    let n = 0;
    let clipN = 0;
    while (b < body) {
      const len = Math.min(body - b, n === 0 ? 2 : rand(si * 50 + n) < 0.55 ? 1 : 2);
      const kind: Kind = n === 0 ? "word" : PATTERNS[id][(n - 1) % PATTERNS[id].length];
      const usesClip = kind === "footage" || kind === "portal" || kind === "bars";
      const clip = CLIPS[id][clipN % CLIPS[id].length];
      if (usesClip) clipN++;
      shots.push({ from: beat(b), len: beat(len), kind, seed: si * 100 + n, clip });
      b += len;
      n++;
    }
    if (id === "s6") shots.push({ from: beat(body), len: beat(2), kind: "word", seed: 999, clip: C.para });
    return [id, shots];
  }),
) as Record<Id, Shot[]>;
const shotAt = (id: Id, f: number) => SHOTS[id].find((s) => f >= s.from && f < s.from + s.len) ?? SHOTS[id][SHOTS[id].length - 1];
const isDark = (s: Shot, f: number) =>
  s.kind === "footage" || s.kind === "bars" || s.kind === "sat" || (s.kind === "portal" && f - s.from >= s.len - 8);

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
const Vertical: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <div style={{ position: "absolute", left: x, top: y, writingMode: "vertical-rl", fontFamily: wide, fontSize: 40, color: INK }}>{text}</div>
);

// --- Shots.
const Poster: React.FC<{ s: Shot; f: number; id: Id }> = ({ s, f, id }) => {
  const r = (k: number) => rand(s.seed * 7 + k);
  const t = f - s.from;
  const flip = r(1) < 0.5;
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      <Cone x={flip ? 620 : 40} y={520 + r(2) * 360} angle={(flip ? 180 : 0) + (r(3) - 0.5) * 30 + t * 0.6} color={r(4) < 0.5 ? VIOLET : PINK} size={760} />
      <Ring x={400 + r(5) * 220} y={700} w={640} h={520 + r(14) * 120} spin={t * 0.8} />
      <Ring x={480 + r(15) * 80} y={700} w={260} h={260} spin={-t * 2} dashed />
      <Disc x={flip ? 300 : 720} y={560 + r(6) * 280} d={360} />
      <div style={{ position: "absolute", left: 240 + r(7) * 300, top: 920, width: 200, height: 100, borderRadius: "200px 200px 0 0", background: INK, transform: "rotate(180deg)" }} />
      <Slab x={200 + r(8) * 560} y={420 + r(9) * 300} w={420} h={30} angle={-30 + t * 2.5} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={0} y1={1060} x2={1080 * lerp(t, 0, 10)} y2={1060 - 160 * r(10)} stroke={INK} strokeWidth={3} />
      </svg>
      <Dots x={SAFE.left + r(11) * 300} y={330} n={10} />
      <Pills x={720} y={400 + r(12) * 200} />
      {r(13) < 0.6 && <Squiggle y={880} p={lerp(t, 0, 14)} />}
      <Vertical x={820} y={460} text={FACTS[id].word} />
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
  { points: [[4, -0.6, -1], [1, 0.6, 1], [-1, 2, 0], [-4, 3, 1]], color: PINK },
  { points: [[-4, 2.2, -1], [-1, 0, 0.5], [2, 1.8, 1], [4, -0.4, 0]], color: BLUE },
];
const Ribbons: React.FC<{ t: number }> = ({ t }) => (
  <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0, 9], fov: 40 }} style={{ position: "absolute", inset: 0 }}>
    {RIBBONS.map((r, i) => (
      <Ribbon key={i} {...r} t={interpolate(t - i * 4, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    ))}
  </ThreeCanvas>
);
const Crosses: React.FC<{ seed: number }> = ({ seed }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <line x1={0} y1={1080} x2={1080} y2={1080} stroke="#FFFFFF" strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => (
      <text key={i} x={120 + rand(seed + i) * 680} y={380 + rand(seed + i + 9) * 520} fill="#FFFFFF" fontSize={44} fontFamily={mono}>
        +
      </text>
    ))}
  </svg>
);

// A clip starting at the shot's first frame, trimmed so it never runs out.
const Clipped: React.FC<{ s: Shot; salt: number }> = ({ s, salt }) => {
  const room = Math.max(0, s.clip.dur * FPS - s.len - 20);
  return (
    <Sequence from={s.from} durationInFrames={s.len} layout="none">
      <OffthreadVideo
        src={videoAsset(SLUG, s.clip.file)}
        muted
        trimBefore={Math.round(rand(s.seed + salt) * room)}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.clip.pos ?? "50% 50%" }}
      />
    </Sequence>
  );
};

const Footage: React.FC<{ s: Shot; f: number; ribbons?: boolean }> = ({ s, f, ribbons }) => {
  const t = f - s.from;
  const showRibbons = ribbons ?? rand(s.seed) < 0.6;
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Graded n={Math.floor(f / BEAT)}>
        <AbsoluteFill style={{ transform: `scale(${1.04 + t * 0.002})` }}>
          <Clipped s={s} salt={3} />
        </AbsoluteFill>
      </Graded>
      {showRibbons && <Ribbons t={t} />}
      <Crosses seed={s.seed} />
    </AbsoluteFill>
  );
};

// The view straight down, zooming with the altitude of the scene.
const Sat: React.FC<{ s: Shot; f: number; id: Id }> = ({ s, f, id }) => {
  const [a, b] = FACTS[id].alt ?? [39000, 30000];
  const sceneLen = LEN(id);
  const meters = interpolate(f, [0, sceneLen], [a, b]);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Graded n={Math.floor(f / BEAT)}>
        <SatelliteZoom slug={SLUG} lat={SAT.lat} lon={SAT.lon} from={SAT.from} to={SAT.to} zoom={Math.min(SAT.to + 1, altitudeZoom(meters, SAT.lat))} />
      </Graded>
      <Crosses seed={s.seed} />
      <div style={{ position: "absolute", right: SAFE.right, top: SAFE.top + 10, fontFamily: sans, fontWeight: 700, fontSize: 34, color: "#FFFFFF", textShadow: `3px 3px 0 ${INK}` }}>
        {SAT.credit}
      </div>
    </AbsoluteFill>
  );
};

// Colour-bar cards fanning through 3D over the footage.
const Bars: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  return (
    <AbsoluteFill>
      <Footage s={s} f={f} ribbons={false} />
      <AbsoluteFill style={{ perspective: 900 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 220 + i * 70 - t * 3,
              top: 520 + i * 22,
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
  const z = t < s.len - 12 ? 1 : interpolate(t, [s.len - 12, s.len], [1, 7], { easing: easeOut });
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "540px 720px" }}>
        {[1.2, 1.4, 1.65].map((k, i) => (
          <Ring key={i} x={540} y={720} w={520 * k} h={520 * k} spin={t * (i + 1) * (i % 2 ? -1.4 : 1)} dashed={i === 1} />
        ))}
        <div style={{ position: "absolute", left: 280, top: 460, width: 520, height: 520, borderRadius: "50%", overflow: "hidden" }}>
          <Graded n={Math.floor(f / BEAT) + 1}>
            <Clipped s={s} salt={5} />
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
const Scatter: React.FC<{ s: Shot; f: number; id: Id }> = ({ s, f, id }) => {
  const t = (f - s.from) / s.len;
  const cell = 1080 / COLS;
  const src = videoAsset(SLUG, `scatter-${id}.jpg`);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {/* Hidden copy so the render waits for the still to load. */}
      <Img src={src} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
      {/* Band clipped above the fact, so no pixel drifts over the text. */}
      <div style={{ position: "absolute", left: 0, top: 240, width: 1080, height: 840, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: ROWS * cell, filter: "grayscale(1) sepia(1) hue-rotate(150deg) saturate(5) brightness(1.1)" }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const x = i % COLS;
          const y = Math.floor(i / COLS);
          if (rand(i + s.seed) < 0.35) return null;
          const spread = Math.abs(t - 0.45) * 2.2;
          const dx = (rand(i * 3 + s.seed) - 0.5) * 600 * spread;
          const dy = (rand(i * 5 + s.seed) - 0.5) * 300 * spread;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x * cell + dx,
                top: y * cell + dy,
                width: cell * (rand(i * 7) < 0.3 ? 0.5 : 1),
                height: cell,
                backgroundImage: `url(${src})`,
                backgroundSize: `1080px ${ROWS * cell}px`,
                backgroundPosition: `${-x * cell}px ${-y * cell}px`,
                opacity: 1 - spread * 0.6,
              }}
            />
          );
        })}
      </div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={SAFE.left} y1={1095} x2={880} y2={1095} stroke={INK} strokeWidth={3} />
      </svg>
    </AbsoluteFill>
  );
};

// The key word slammed in, cropped off the left edge, over a cone.
const Word: React.FC<{ s: Shot; f: number; word: string }> = ({ s, f, word }) => {
  const t = f - s.from;
  const slam = t < 2 ? 1.3 : t < 4 ? 1.06 : 1;
  const size = Math.min(300, Math.round(1100 / (word.length * 0.95)));
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      <Cone x={460} y={720} angle={-10 + t * 0.8} color={VIOLET} size={900} />
      <Disc x={760} y={600} d={300} />
      <div style={{ position: "absolute", left: -30, top: 480, fontFamily: wide, fontSize: size, lineHeight: 1.1, color: INK, letterSpacing: -12, transform: `scale(${slam})`, transformOrigin: "left center", whiteSpace: "nowrap" }}>
        {word}
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={0} y1={460} x2={1080 * lerp(t, 0, 8)} y2={460} stroke={INK} strokeWidth={3} />
      </svg>
    </AbsoluteFill>
  );
};

// The scene's fact: a counter that rolls in (tabular digits, so nothing
// wobbles), then stays still while the shots cut underneath it.
const FactLayer: React.FC<{ id: Id; dark: boolean; f: number }> = ({ id, dark, f }) => {
  const fact = FACTS[id];
  const at = id === "s1" ? beat(1) : 0;
  if (f < at) return null;
  const p = interpolate(f - at, [0, 36], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const value = fmt(fact.from + (fact.to - fact.from) * p, fact.dec);
  const target = fmt(fact.to, fact.dec);
  const size = Math.min(180, Math.floor(770 / (target.length * 0.86)));
  const color = dark ? "#FFFFFF" : INK;
  const shadow = (n: number) => (dark ? `${n}px ${n}px 0 ${INK}` : undefined);
  return (
    <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: 1110, color }}>
      <div style={{ fontFamily: wide, fontSize: size, lineHeight: 1, letterSpacing: -2, fontVariantNumeric: "tabular-nums", textShadow: shadow(5), whiteSpace: "nowrap" }}>{value}</div>
      <div style={{ fontFamily: wide, fontSize: 54, lineHeight: 1.1, marginTop: 8, textShadow: shadow(4) }}>{fact.unit}</div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, lineHeight: 1.2, marginTop: 14, textShadow: shadow(3) }}>{fact.line}</div>
    </div>
  );
};

const Scene: React.FC<{ id: Id }> = ({ id }) => {
  const f = useCurrentFrame();
  const s = shotAt(id, f);
  const body =
    s.kind === "word" ? <Word s={s} f={f} word={s.seed === 999 ? FACTS.s1.word : FACTS[id].word} /> :
    s.kind === "poster" ? <Poster s={s} f={f} id={id} /> :
    s.kind === "portal" ? <Portal s={s} f={f} /> :
    s.kind === "scatter" ? <Scatter s={s} f={f} id={id} /> :
    s.kind === "bars" ? <Bars s={s} f={f} /> :
    s.kind === "sat" ? <Sat s={s} f={f} id={id} /> :
    <Footage s={s} f={f} />;
  return (
    <AbsoluteFill>
      {body}
      <FactLayer id={id} dark={isDark(s, f)} f={f} />
      {id === "s1" && f < beat(4) && (
        <>
          <div style={{ position: "absolute", left: 0, top: 226, width: 560, height: 96, background: INK }} />
          <Brand />
        </>
      )}
      <Voice slug={SLUG} id={id} />
      <Sfx id="thud" at={0} volume={0.3} />
      {SHOTS[id].map((sh) =>
        sh.kind === "portal" ? <Sfx key={sh.seed} id="whoosh" at={sh.from + sh.len - 12} volume={0.22} /> :
        sh.kind === "scatter" ? <Sfx key={sh.seed} id="pixel" at={sh.from} volume={0.18} /> :
        sh.kind === "word" && sh.seed === 999 ? <Sfx key={sh.seed} id="thud" at={sh.from} volume={0.3} /> : null,
      )}
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
