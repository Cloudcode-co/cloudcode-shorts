// breakcore-swiss example (roi-tu-do, scenes s1–s3): footage-first, cut to the
// beats measured from the track (timeline.json `beats`), and never the same
// shot twice. Every shot draws its own variant from a seed: which kind it is
// (dealt from a shuffled deck, never the kind of the two shots before), and
// every position, colour, curve and count inside it.
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typeface from "../../../public/fonts/unbounded-900.typeface.json";
import { Brand, FPS, Music, SAFE, TikTokGuide, Voice, mono, sans, videoAsset, type VideoDef, type VideoProps } from "../../kit";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = "roi-tu-do-tu-ria-vu-tru";
const wide = loadUnbounded("normal", { weights: ["900"], subsets: ["latin", "vietnamese"] }).fontFamily;

const INK = "#0B0B0C";
const PAPER = "#FFFFFF";
const CYAN = "#19C6E6";
const RED = "#FF2E4D";
const BLUE = "#2340FF";
const ACCENTS = ["#8A6CFF", "#FF3EA5", "#19C6E6", "#C6FF1A", "#FF8A1F"];
const RIBBON_COLORS = ["#FFE44D", "#FF3EA5", BLUE, "#19E6D2", "#FF8A1F", "#C6FF1A", "#FFFFFF"];

type Id = "s1" | "s2" | "s3";
const IDS: Id[] = ["s1", "s2", "s3"];
const fr = (s: number) => Math.round(s * FPS);
const START = (id: Id) => fr(timeline.scenes[id].start);
const LEN = (id: Id) => fr(timeline.scenes[id].length);
const TOTAL = START("s3") + LEN("s3");
const scene = (id: Id) => script.scenes.find((s) => s.id === id)!;
// One short word per scene for the type shots, picked from what the voice says:
// never the headline number, which the fact layer already shows.
const KEY: Record<Id, string> = { s1: "RƠI", s2: "MACH", s3: "XOAY" };
// The track's own beats, in frames from the start of the video.
const BEATS = timeline.beats.map(fr);
const CLIPS: Record<Id, string[]> = {
  s1: ["footage/space-jumper-stratosphere-edge-pixabay-126663.mp4", "footage/astronaut-helmet-visor-pixabay-132347.mp4"],
  s2: ["footage/space-jumper-stratosphere-edge-pixabay-126663.mp4", "footage/astronaut-helmet-visor-pixabay-132347.mp4"],
  s3: ["footage/astronaut-centrifuge-spin-training-pixabay-143016.mp4", "footage/astronaut-helmet-visor-pixabay-132347.mp4"],
};
const STILLS = ["still-0.jpg", "still-1.jpg", "still-2.jpg"];

const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const pick = <T,>(xs: T[], n: number) => xs[Math.floor(rand(n) * xs.length) % xs.length];
const between = (n: number, lo: number, hi: number) => lo + rand(n) * (hi - lo);

// --- Inserts: whole-frame, 2 frames on the off-beat after every other beat.
const INSERTS = BEATS.slice(2, -1)
  .map((b, i) => ({ at: Math.round((b + BEATS[i + 3]) / 2), k: i }))
  .filter((x) => x.k % 2 === 0 && x.at < TOTAL - 4);
const insertStyle = (f: number): CSSProperties => {
  const hit = INSERTS.find((i) => f >= i.at && f < i.at + 2);
  if (!hit) return {};
  const v = Math.floor(rand(hit.at) * 5);
  return [
    { filter: "invert(1)" },
    { filter: `drop-shadow(${between(hit.at, 10, 22)}px 0 0 ${RED}) drop-shadow(-${between(hit.at + 1, 10, 22)}px 0 0 ${CYAN})` },
    { transform: "scaleX(-1)" },
    { transform: `scaleX(${between(hit.at, 1.6, 2.6)}) skewX(${between(hit.at + 2, -20, 20)}deg)` },
    { transform: `translateY(${between(hit.at, -60, 60)}px) scaleY(1.15)`, filter: "contrast(1.8)" },
  ][v];
};

// --- Duotone regrade per beat: every clip lands on the same colours.
const MONO = "grayscale(1) contrast(1.35) brightness(1.15)";
const GRADES: { filter: string; tint?: string }[] = [
  { filter: "none" },
  { filter: MONO, tint: "linear-gradient(180deg, #19E6D2, #C6FF1A)" },
  { filter: MONO, tint: "linear-gradient(180deg, #FF7AD9, #8B5CF6)" },
  { filter: "sepia(0.9) saturate(1.4)" },
  { filter: MONO, tint: "linear-gradient(180deg, #FF8A1F, #FF2E4D)" },
];
const beatIndex = (f: number) => BEATS.filter((b) => b <= f).length;
const Graded: React.FC<{ n: number; children: ReactNode }> = ({ n, children }) => {
  const g = GRADES[n % GRADES.length];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: g.filter }}>{children}</AbsoluteFill>
      {g.tint && <AbsoluteFill style={{ background: g.tint, mixBlendMode: "multiply" }} />}
    </AbsoluteFill>
  );
};

// --- The shot list: cut on the scene's beats (and half-beats in the drop),
// one or two pieces per shot; the kind never repeats the last two.
type Kind = "word" | "poster" | "footage" | "portal" | "scatter" | "bars" | "strips" | "maskword" | "tiles" | "word3d" | "bars3d";
const KINDS: Kind[] = ["poster", "footage", "portal", "scatter", "bars", "strips", "maskword", "tiles", "word3d", "bars3d"];
// Kinds are dealt like cards: every kind once, in a seeded order, before any comes back.
let deck: Kind[] = [];
const deal = (n: number, recent: Kind[]): Kind => {
  if (deck.length === 0) deck = KINDS.map((k, i) => ({ k, r: rand(n * 17 + i) })).sort((a, b) => a.r - b.r).map((x) => x.k);
  const i = deck.findIndex((k) => !recent.includes(k));
  return deck.splice(Math.max(0, i), 1)[0];
};
type Shot = { from: number; len: number; kind: Kind; g: number; clip: string };
const dropping = (id: Id) => timeline.sections.some((s) => s.name === "Drop" && s.scenes.includes(id));
let counter = 0;
const SHOTS: Record<Id, Shot[]> = Object.fromEntries(
  IDS.map((id) => {
    const len = LEN(id);
    const local = BEATS.map((b) => b - START(id)).filter((b) => b > 6 && b < len - 6);
    const cuts = dropping(id) ? local.flatMap((b, i) => (i + 1 < local.length && rand(b) < 0.4 ? [b, Math.round((b + local[i + 1]) / 2)] : [b])) : local;
    const points = [0, ...cuts, len];
    const shots: Shot[] = [];
    const recent: Kind[] = [];
    let i = 0;
    while (i < points.length - 1) {
      const first = shots.length === 0;
      const take = first ? 2 : rand(counter * 13 + 1) < 0.6 ? 1 : 2;
      const end = points[Math.min(i + take, points.length - 1)];
      let kind: Kind = "word";
      if (!first) kind = deal(counter, recent);
      recent.unshift(kind);
      recent.length = Math.min(recent.length, 2);
      const clips = CLIPS[id];
      shots.push({ from: points[i], len: end - points[i], kind, g: counter, clip: clips[Math.floor(rand(counter * 7) * clips.length)] });
      counter++;
      i += take;
    }
    return [id, shots];
  }),
) as Record<Id, Shot[]>;
const shotAt = (id: Id, f: number) => SHOTS[id].find((s) => f >= s.from && f < s.from + s.len) ?? SHOTS[id][SHOTS[id].length - 1];
const isDark = (k: Kind) => k === "footage" || k === "bars" || k === "bars3d" || k === "strips" || k === "tiles";


// A clip at its own crop, zoom and drift for this shot.
const Clip: React.FC<{ s: Shot; salt?: number; style?: CSSProperties }> = ({ s, salt = 0, style }) => {
  const f = useCurrentFrame();
  const n = s.g * 17 + salt;
  const zoom = between(n, 1, 1.45);
  const dx = between(n + 1, -40, 40);
  const t = (f - s.from) / Math.max(1, s.len);
  return (
    <Sequence from={s.from} layout="none">
      <OffthreadVideo
        src={videoAsset(SLUG, s.clip)}
        muted
        trimBefore={Math.round(between(n + 2, 0, 400))}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${between(n + 3, 20, 80)}% 50%`,
          transform: `scale(${zoom + t * 0.08}) translateX(${dx * t}px)`,
          ...style,
        }}
      />
    </Sequence>
  );
};

// --- 3D. Ribbons are flat glossy bands, lit, two colours along their length;
// their count, curves, width, twist and colours change every shot.
const Lights: React.FC<{ n: number }> = ({ n }) => (
  <>
    <ambientLight intensity={0.55} />
    <directionalLight position={[3, 5, 8]} intensity={1.4} />
    <pointLight position={[-5, 2, 4]} intensity={60} color={pick(ACCENTS, n)} />
    <pointLight position={[5, -2, 4]} intensity={60} color={pick(ACCENTS, n + 1)} />
  </>
);
const bandGeometry = (points: [number, number, number][], t: number, width: number, twist: number, a: string, b: string) => {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const steps = 90;
  const end = Math.max(0.02, t);
  const pos: number[] = [];
  const col: number[] = [];
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  for (let i = 0; i <= steps; i++) {
    const u = (i / steps) * end;
    const p = curve.getPoint(u);
    const tan = curve.getTangent(u);
    const side = new THREE.Vector3(0, 0, 1).cross(tan).normalize();
    side.applyAxisAngle(tan, u * twist);
    const w = width * Math.min(1, (i / steps) * 6, ((steps - i) / steps) * 6 + 0.3);
    pos.push(p.x + side.x * w, p.y + side.y * w, p.z + side.z * w, p.x - side.x * w, p.y - side.y * w, p.z - side.z * w);
    const c = ca.clone().lerp(cb, i / steps);
    col.push(c.r, c.g, c.b, c.r, c.g, c.b);
  }
  const idx: number[] = [];
  for (let i = 0; i < steps; i++) idx.push(2 * i, 2 * i + 1, 2 * i + 2, 2 * i + 1, 2 * i + 3, 2 * i + 2);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};
type Band = { points: [number, number, number][]; a: string; b: string; width: number; twist: number; delay: number };
const Ribbon: React.FC<{ r: Band; t: number }> = ({ r, t }) => {
  const geometry = useMemo(() => bandGeometry(r.points, t, r.width, r.twist, r.a, r.b), [r, t]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.22} metalness={0.35} emissive="#222222" />
    </mesh>
  );
};
const Ribbons: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame();
  const n = s.g * 101;
  const count = 1 + Math.floor(rand(n) * 3);
  const set = useMemo<Band[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const side = rand(n + i * 9) < 0.5 ? -1 : 1;
        const m = 4 + Math.floor(rand(n + i) * 3);
        const points: [number, number, number][] = Array.from({ length: m }, (_, k) => [
          side * (-4.8 + (9.6 * k) / (m - 1)),
          between(n + i * 7 + k, -0.6, 3),
          between(n + i * 5 + k, -2, 2),
        ]);
        return {
          points,
          a: pick(RIBBON_COLORS, n + i * 3),
          b: pick(RIBBON_COLORS, n + i * 3 + 1),
          width: between(n + i * 11, 0.12, 0.42),
          twist: between(n + i * 13, -9, 9),
          delay: i * Math.round(between(n + i, 2, 8)),
        };
      }),
    [n, count],
  );
  return (
    <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0, 9], fov: 40 }} style={{ position: "absolute", inset: 0 }}>
      <Lights n={n} />
      {set.map((r, i) => (
        <Ribbon key={i} r={r} t={interpolate(f - s.from - r.delay, [0, Math.max(12, s.len * 0.8)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      ))}
    </ThreeCanvas>
  );
};

// The key word as real extruded type (Unbounded 900 as a three.js typeface,
// public/fonts), in steep perspective, lit from two coloured sides.
const FONT = new FontLoader().parse(typeface as unknown as ConstructorParameters<typeof Font>[0]);
const Word3DMesh: React.FC<{ text: string; n: number; t: number }> = ({ text, n, t }) => {
  const geometry = useMemo(() => {
    const g = new TextGeometry(text, { font: FONT, size: 1, depth: between(n, 0.35, 0.8), curveSegments: 6, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.025, bevelSegments: 3 });
    g.computeBoundingBox();
    const box = g.boundingBox!;
    g.translate(-(box.max.x + box.min.x) / 2, -(box.max.y + box.min.y) / 2, 0);
    return g;
  }, [text, n]);
  const box = geometry.boundingBox;
  const width = box ? box.max.x - box.min.x : 4;
  const scale = Math.min(1.2, 4.2 / width);
  const slam = t < 3 ? 1.25 : 1;
  return (
    <group
      position={[between(n + 1, -0.3, 0.3), between(n + 2, 0.4, 1.2), 0]}
      rotation={[between(n + 3, -0.6, -0.3) + t * 0.002, between(n + 4, -0.4, 0.4) + t * 0.004, between(n + 5, -0.2, 0.2)]}
      scale={scale * slam}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial color={pick(["#111114", "#F4F4F4", "#2340FF"], n + 6)} metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  );
};
const Word3D: React.FC<{ s: Shot; f: number; id: Id }> = ({ s, f, id }) => {
  const t = f - s.from;
  const n = s.g * 89;
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      {PIECES[5](n, t, id)}
      {PIECES[0](n + 3, t, id)}
      <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0, 9], fov: 40 }} style={{ position: "absolute", inset: 0 }}>
        <Lights n={n} />
        <Word3DMesh text={KEY[id]} n={n} t={t} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// Colour-bar cards as real 3D panels flying past the camera.
let barsTex: THREE.CanvasTexture | null = null;
const barsTexture = () => {
  if (barsTex) return barsTex;
  const c = document.createElement("canvas");
  c.width = 280;
  c.height = 180;
  const ctx = c.getContext("2d")!;
  BARS.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(i * 40, 0, 40, 120);
  });
  ["#0000C0", "#111111", "#C000C0", "#111111", "#00C0C0", "#111111", "#C0C0C0"].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(i * 40, 120, 40, 20);
  });
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 140, 70, 40);
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(70, 140, 210, 40);
  barsTex = new THREE.CanvasTexture(c);
  barsTex.colorSpace = THREE.SRGBColorSpace;
  return barsTex;
};
const Bars3D: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  const n = s.g * 73;
  const count = 4 + Math.floor(rand(n) * 6);
  const map = barsTexture();
  return (
    <AbsoluteFill>
      <Footage s={s} f={f} />
      <ThreeCanvas width={1080} height={1920} camera={{ position: [0, 0, 9], fov: 40 }} style={{ position: "absolute", inset: 0 }}>
        <Lights n={n} />
        {Array.from({ length: count }, (_, i) => (
          <mesh
            key={i}
            position={[between(n + i * 3, -2.5, 2.5) + Math.sin(t / 20 + i) * 0.3, between(n + i * 5, -0.5, 3.2), between(n + i, -6, 2) + t * between(n + 50, 0.04, 0.12)]}
            rotation={[between(n + i * 7, -0.6, 0.6), between(n + i * 9, -1.2, 1.2) + t * 0.02 * (i % 2 ? 1 : -1), between(n + i * 11, -0.3, 0.3)]}
          >
            <boxGeometry args={[1.4, 0.9, 0.04]} />
            <meshStandardMaterial map={map} roughness={0.35} metalness={0.1} />
          </mesh>
        ))}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// --- Poster vocabulary: each poster draws 5-7 of these, placed by its seed.
const Ring: React.FC<{ x: number; y: number; w: number; h: number; spin: number; dashed?: boolean; weight?: number }> = ({ x, y, w, h, spin, dashed, weight = 3 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: "50%", border: `${weight}px ${dashed ? "dashed" : "solid"} ${INK}`, transform: `rotate(${spin}deg)` }} />
);
type Piece = (n: number, t: number, id: Id) => ReactNode;
const PIECES: Piece[] = [
  (n, t) => <Ring x={between(n, 250, 830)} y={between(n + 1, 450, 1000)} w={between(n + 2, 380, 760)} h={between(n + 3, 300, 640)} spin={t * between(n + 4, -1.5, 1.5)} />,
  (n, t) => <Ring x={between(n, 300, 780)} y={between(n + 1, 500, 950)} w={between(n + 2, 160, 320)} h={between(n + 2, 160, 320)} spin={t * 3} dashed />,
  (n) => {
    const d = between(n, 200, 420);
    const x = between(n + 1, 200, 860);
    const y = between(n + 2, 420, 1000);
    return <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: `radial-gradient(circle, ${INK} 0%, #555 ${between(n + 3, 10, 30)}%, #DDD 52%, transparent 70%)` }} />;
  },
  (n) => <div style={{ position: "absolute", left: between(n, 150, 750), top: between(n + 1, 500, 1000), width: between(n + 2, 140, 260), height: between(n + 2, 70, 130), borderRadius: "300px 300px 0 0", background: INK, transform: `rotate(${pick([0, 90, 180, 270], n + 3)}deg)` }} />,
  (n, t) => <div style={{ position: "absolute", left: between(n, 100, 700), top: between(n + 1, 400, 1000), width: between(n + 2, 260, 520), height: between(n + 3, 18, 60), background: INK, transform: `rotate(${between(n + 4, -60, 60) + t * between(n + 5, -3, 3)}deg)` }} />,
  (n, t) => {
    const size = between(n, 600, 1000);
    return <div style={{ position: "absolute", left: between(n + 1, -100, 600), top: between(n + 2, 400, 1000) - size / 2, width: size, height: size, background: `linear-gradient(90deg, transparent, ${pick(ACCENTS, n + 3)})`, clipPath: "polygon(0 50%, 100% 0, 100% 100%)", transform: `rotate(${between(n + 4, -180, 180) + t * 0.7}deg)`, transformOrigin: "0 50%", opacity: 0.8 }} />;
  },
  (n) => (
    <div style={{ position: "absolute", left: between(n, SAFE.left, 600), top: between(n + 1, 300, 1000), display: "grid", gridTemplateColumns: `repeat(${Math.floor(between(n + 2, 4, 12))}, 9px)`, gap: 9 }}>
      {Array.from({ length: Math.floor(between(n + 3, 8, 48)) }, (_, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 5, background: INK }} />)}
    </div>
  ),
  (n) => (
    <>
      {Array.from({ length: Math.floor(between(n, 2, 5)) }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: between(n + 1, 500, 820) + i * 14, top: between(n + 2, 380, 900) + i * 40, width: 64, height: 16, borderRadius: 8, background: CYAN, transform: `rotate(${between(n + 3, -40, 40)}deg)` }} />
      ))}
    </>
  ),
  (n, t) => {
    const y = between(n, 900, 1060);
    const amp = between(n + 1, 30, 70);
    const step = between(n + 2, 50, 90);
    const d = Array.from({ length: 16 }, (_, i) => `${i === 0 ? "M" : "Q"}${40 + i * step} ${i % 2 ? -amp : amp} ${40 + i * step + step / 2} 0`).join(" ");
    return (
      <svg width={1080} height={200} style={{ position: "absolute", left: 0, top: y }} viewBox="0 -100 1080 200">
        <path d={d} stroke={pick([BLUE, INK, "#FF3EA5"], n + 3)} strokeWidth={6} fill="none" strokeDasharray={1600} strokeDashoffset={1600 * (1 - Math.min(1, t / 14))} />
      </svg>
    );
  },
  (n, t) => (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <line x1={0} y1={between(n, 400, 1050)} x2={1080 * Math.min(1, t / 10)} y2={between(n + 1, 400, 1050)} stroke={INK} strokeWidth={3} />
    </svg>
  ),
  (n, _t, id) => <div style={{ position: "absolute", left: between(n, 700, 850), top: between(n + 1, 380, 700), writingMode: "vertical-rl", fontFamily: wide, fontSize: 34, color: INK }}>{KEY[id]}</div>,
  (n) => (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d={`M ${between(n + i, 0, 300)} ${between(n + i + 1, 500, 1000)} C ${between(n + i + 2, 200, 800)} ${between(n + i + 3, 300, 1100)}, ${between(n + i + 4, 200, 800)} ${between(n + i + 5, 300, 1100)}, ${between(n + i + 6, 700, 1080)} ${between(n + i + 7, 500, 1000)}`} stroke={i === 0 ? INK : "#C9D3FF"} strokeWidth={i === 0 ? 3 : 2} fill="none" />
      ))}
    </svg>
  ),
];
const Poster: React.FC<{ s: Shot; f: number; id: Id }> = ({ s, f, id }) => {
  const t = f - s.from;
  const n = s.g * 53;
  const count = 5 + Math.floor(rand(n) * 3);
  const chosen = [...PIECES.keys()].sort((a, b) => rand(n + a) - rand(n + b)).slice(0, count);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {chosen.map((k) => (
        <React.Fragment key={k}>{PIECES[k](n + k * 19, t, id)}</React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

const Footage: React.FC<{ s: Shot; f: number }> = ({ s, f }) => (
  <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
    <Graded n={beatIndex(s.from + START_OF.get(s)!) + s.g}>
      <Clip s={s} />
    </Graded>
    {rand(s.g * 3) < 0.65 && <Ribbons s={s} />}
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {rand(s.g * 5) < 0.6 && <line x1={0} y1={between(s.g, 900, 1090)} x2={1080} y2={between(s.g + 1, 900, 1090)} stroke="#FFFFFF" strokeWidth={3} />}
      {Array.from({ length: Math.floor(between(s.g * 7, 0, 6)) }, (_, i) => (
        <text key={i} x={between(s.g + i, 120, 820)} y={between(s.g + i + 9, 380, 1000)} fill="#FFFFFF" fontSize={40} fontFamily={mono}>
          +
        </text>
      ))}
    </svg>
  </AbsoluteFill>
);

// Colour-bar cards: their own number, path and angle every time.
const BARS = ["#C0C0C0", "#C0C000", "#00C0C0", "#00C000", "#C000C0", "#C00000", "#0000C0"];
const Bars: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  const n = s.g * 71;
  const cards = 3 + Math.floor(rand(n) * 5);
  const dir = rand(n + 1) < 0.5 ? -1 : 1;
  return (
    <AbsoluteFill>
      <Footage s={s} f={f} />
      <AbsoluteFill style={{ perspective: 900 }}>
        {Array.from({ length: cards }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: between(n + 2, 120, 420) + i * between(n + 3, 40, 90) + dir * t * between(n + 4, 2, 6),
              top: between(n + 5, 420, 760) + i * between(n + 6, -30, 30),
              width: between(n + 7, 200, 320),
              height: between(n + 7, 130, 200),
              display: "flex",
              transform: `rotateY(${dir * (-60 + i * 9) + t * between(n + 8, 0.6, 2)}deg) rotateZ(${between(n + 9, -15, 15) + i * 3}deg)`,
              boxShadow: "0 0 0 4px #FFFFFF",
            }}
          >
            {BARS.map((c) => (
              <div key={c} style={{ flex: 1, background: c }} />
            ))}
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Footage in a ring portal at its own place and size, zoomed through at the end.
const Portal: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  const n = s.g * 37;
  const d = between(n, 380, 600);
  const x = between(n + 1, 380, 700);
  const y = between(n + 2, 620, 860);
  const z = t < s.len - 12 ? 1 : interpolate(t, [s.len - 12, s.len], [1, between(n + 3, 5, 9)]);
  const rings = 2 + Math.floor(rand(n + 4) * 3);
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${x}px ${y}px` }}>
        {Array.from({ length: rings }, (_, i) => (
          <Ring key={i} x={x} y={y} w={d * (1.15 + i * 0.22)} h={d * (1.15 + i * 0.22) * between(n + 5, 0.8, 1)} spin={t * (i + 1) * (i % 2 ? -1.3 : 1)} dashed={i % 2 === 1} weight={i === 0 ? 8 : 3} />
        ))}
        <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", overflow: "hidden" }}>
          <Graded n={s.g + 1}>
            <Clip s={s} salt={5} />
          </Graded>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// A still that gathers into a clear picture, holds, then blows apart.
const Scatter: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = (f - s.from) / Math.max(1, s.len);
  const n = s.g * 43;
  const cols = Math.floor(between(n, 14, 26));
  const cell = 1080 / cols;
  const rows = Math.ceil(between(n + 1, 0.45, 0.75) * (1920 / cell));
  const top = between(n + 2, 300, 1500 - rows * cell);
  const spread = t < 0.25 ? (0.25 - t) / 0.25 : t > 0.65 ? (t - 0.65) / 0.35 : 0;
  const sideways = rand(n + 3) < 0.5;
  const still = pick(STILLS, n + 4);
  const g = GRADES[Math.floor(rand(n + 5) * GRADES.length)];
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 0, top, width: 1080, height: rows * cell, filter: g.filter }}>
        {Array.from({ length: cols * rows }, (_, i) => {
          const x = i % cols;
          const y = Math.floor(i / cols);
          if (rand(i + n) < 0.12 * spread) return null;
          const dx = (rand(i * 3 + n) - (sideways ? 0.2 : 0.5)) * (sideways ? 900 : 500) * spread;
          const dy = (rand(i * 5 + n) - 0.5) * (sideways ? 120 : 500) * spread;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x * cell + dx,
                top: y * cell + dy,
                width: cell + 1,
                height: cell + 1,
                backgroundImage: `url(${videoAsset(SLUG, still)})`,
                backgroundSize: `1080px 1920px`,
                backgroundPosition: `${-x * cell}px ${-(top + y * cell)}px`,
                opacity: 1 - spread * 0.5,
              }}
            />
          );
        })}
      </div>
      {g.tint && <div style={{ position: "absolute", left: 0, top, width: 1080, height: rows * cell, background: g.tint, mixBlendMode: "multiply" }} />}
    </AbsoluteFill>
  );
};

// Footage in horizontal strips sliding against each other.
const Strips: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  const n = s.g * 29;
  const count = 3 + Math.floor(rand(n) * 4);
  const h = 1920 / count;
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: i * h, width: 1080, height: h, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: (i % 2 ? -1 : 1) * t * between(n + i, 2, 8), top: -i * h, width: 1080, height: 1920 }}>
            <Graded n={s.g + i}>
              <Clip s={s} salt={i % 2} />
            </Graded>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// A 2x2 or 3x2 grid of the same moment in different grades.
const Tiles: React.FC<{ s: Shot; f: number }> = ({ s }) => {
  const n = s.g * 61;
  const cols = 2;
  const rows = rand(n) < 0.5 ? 2 : 3;
  return (
    <AbsoluteFill style={{ background: INK }}>
      {Array.from({ length: cols * rows }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: (i % cols) * 540, top: Math.floor(i / cols) * (1920 / rows), width: 540, height: 1920 / rows, overflow: "hidden", border: "3px solid #FFFFFF", boxSizing: "border-box" }}>
          <Graded n={s.g + i}>
            <Clip s={s} salt={i} />
          </Graded>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// The scene's key word huge, with the footage only inside its letters.
const MaskWord: React.FC<{ s: Shot; f: number; id: Id }> = ({ s, f, id }) => {
  const t = f - s.from;
  const word = KEY[id];
  const n = s.g * 23;
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      <AbsoluteFill>
        <Graded n={s.g}>
          <Clip s={s} />
        </Graded>
      </AbsoluteFill>
      {/* White everywhere but the glyphs: "lighten" keeps the clip only where the text is black. */}
      <AbsoluteFill style={{ background: PAPER, mixBlendMode: "lighten" }}>
        <div style={{ position: "absolute", left: between(n, -80, 0), top: between(n + 1, 420, 700), fontFamily: wide, fontSize: between(n + 2, 380, 520), lineHeight: 1, color: INK, letterSpacing: -20, whiteSpace: "nowrap", transform: `scale(${1 + t * 0.002})` }}>
          {word}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// The key word slammed in, cropped off the frame.
const Word: React.FC<{ s: Shot; f: number; id: Id }> = ({ s, f, id }) => {
  const t = f - s.from;
  const word = KEY[id];
  const slam = t < 2 ? 1.3 : t < 4 ? 1.06 : 1;
  const n = s.g * 47;
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      {PIECES[5](n, t, id)}
      {PIECES[2](n + 9, t, id)}
      <div style={{ position: "absolute", left: between(n, -60, 0), top: between(n + 1, 480, 640), fontFamily: wide, fontSize: between(n + 2, 260, 340), lineHeight: 1, color: INK, letterSpacing: -12, transform: `scale(${slam})`, transformOrigin: "left center", whiteSpace: "nowrap" }}>
        {word}
      </div>
      {PIECES[9](n + 3, t, id)}
    </AbsoluteFill>
  );
};

// The scene's fact stays put while the shots cut underneath it.
// Set on solid label blocks, so it reads over any shot, busy footage included.
const FactLayer: React.FC<{ id: Id; dark: boolean; f: number }> = ({ id, dark, f }) => {
  const sc = scene(id);
  const long = sc.headline.length > 8;
  if (f < 30) return null;
  const block = dark ? PAPER : INK;
  const text = dark ? INK : "#FFFFFF";
  return (
    <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: 1110, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ background: block, color: text, padding: "10px 18px 6px", fontFamily: wide, fontSize: long ? 72 : 112, lineHeight: 1, letterSpacing: -2 }}>{sc.headline}</div>
      <div style={{ background: block, color: text, padding: "6px 18px 8px", fontFamily: sans, fontWeight: 700, fontSize: 36 }}>{sc.lines[0]}</div>
    </div>
  );
};

const START_OF = new Map<Shot, number>(IDS.flatMap((id) => SHOTS[id].map((s) => [s, START(id)] as [Shot, number])));

const Scene: React.FC<{ id: Id }> = ({ id }) => {
  const f = useCurrentFrame();
  const s = shotAt(id, f);
  const body =
    s.kind === "word" ? <Word s={s} f={f} id={id} /> :
    s.kind === "poster" ? <Poster s={s} f={f} id={id} /> :
    s.kind === "portal" ? <Portal s={s} f={f} /> :
    s.kind === "scatter" ? <Scatter s={s} f={f} /> :
    s.kind === "bars" ? <Bars s={s} f={f} /> :
    s.kind === "strips" ? <Strips s={s} f={f} /> :
    s.kind === "tiles" ? <Tiles s={s} f={f} /> :
    s.kind === "maskword" ? <MaskWord s={s} f={f} id={id} /> :
    s.kind === "word3d" ? <Word3D s={s} f={f} id={id} /> :
    s.kind === "bars3d" ? <Bars3D s={s} f={f} /> :
    <Footage s={s} f={f} />;
  return (
    <AbsoluteFill>
      {body}
      <FactLayer id={id} dark={isDark(s.kind)} f={f} />
      {id === "s1" && f < (BEATS[4] ?? 120) && (
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
