// nanobot, Breakcore Swiss: regraded stock footage and white Swiss posters cut
// hard on the track's measured beats (1–2 beats a shot, half-beats inside the
// drops), every other shot full-bleed footage regraded on each beat, 2-frame
// inserts on the snare, and each scene's fact still at one spot on top.
// Built from .claude/skills/edit-styles/examples/breakcore-swiss.tsx.
import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import typeface from "../../../public/fonts/unbounded-900.typeface.json";
import {
  Brand,
  FPS,
  Music,
  SAFE,
  CONTENT_W,
  easeOut,
  Sfx,
  Terminal,
  TikTokGuide,
  TYPE_DELAY,
  Voice,
  beatmap,
  hit,
  mono,
  sans,
  sectionAt,
  typingFrames,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import beatJson from "./beatmap.json";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = "nanobot-agent-ai-ca-nhan-tu-host";
const wide = loadUnbounded("normal", { weights: ["900"], subsets: ["latin", "vietnamese"] }).fontFamily;

// White paper and ink; cyan leads, taken from the HKUDS avatar's glowing network.
const INK = "#0B0B0C";
const PAPER = "#FFFFFF";
const CYAN = "#19C6E6";
const RED = "#FF2E4D";
const BLUE = "#2340FF";
const ACCENTS = ["#8A6CFF", "#FF3EA5", "#19C6E6", "#C6FF1A", "#FF8A1F"];
const RIBBON_COLORS = ["#FFE44D", "#FF3EA5", BLUE, "#19E6D2", "#FF8A1F", "#C6FF1A", "#FFFFFF"];

type Id = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8" | "s9" | "s10";
const IDS: Id[] = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"];
const fr = (s: number) => Math.round(s * FPS);
const START = (id: Id) => fr(timeline.scenes[id].start);
const LEN = (id: Id) => fr(timeline.scenes[id].length);
const TOTAL = START("s10") + LEN("s10");
const scene = (id: Id) => script.scenes.find((s) => s.id === id)!;

// One short word per scene for the type shots, from what the voice says.
const KEY: Record<Id, string> = {
  s1: "AGENT",
  s2: "NANO",
  s3: "CHAT",
  s4: "FILE",
  s5: "NHỚ",
  s6: "CÀI",
  s7: "SSH",
  s8: "HELLO",
  s9: "MODEL",
  s10: "KHÓA",
};
// The facts under each scene: its headline and every line (arrows written out).
const FACT_LINES = (id: Id) => scene(id).lines.map((l) => l.replace(" → ", " · "));
// When each line comes in, in scene frames: where its first word falls in the
// spoken text (by share of characters across the clip), else spread over the
// clip; snapped to a nearby beat, always in order and before the scene ends.
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();
const LINE_AT = (id: Id): number[] => {
  const sc = scene(id);
  const spoken = fold(sc.text.replace(/\[[^\]]*\]\s*/g, ""));
  const clip = Math.round(durations[id] * FPS);
  const n = sc.lines.length;
  const out: number[] = [];
  sc.lines.forEach((line, i) => {
    const word = fold(line.split(/[\s·→]+/)[0]);
    const pos = word.length > 2 ? spoken.indexOf(word) : -1;
    const guess = pos >= 0 ? (pos / spoken.length) * clip : 30 + (i * (clip - 30) * 0.8) / n;
    const abs = START(id) + guess;
    const near = BEATS.reduce((a, b) => (Math.abs(b - abs) < Math.abs(a - abs) ? b : a), BEATS[0]);
    let at = Math.round(Math.abs(near - abs) <= 10 ? near - START(id) : guess);
    at = Math.max(at, 30, i > 0 ? out[i - 1] + 14 : 0);
    out.push(Math.min(at, LEN(id) - 45));
  });
  return out;
};

// The track's measured beats (beatmap.json), in frames; past the last
// measured beat the grid carries on at the track's own period.
const MAP = beatmap(beatJson);
const BEATS: number[] = (() => {
  const b = [...MAP.beats];
  while (b[b.length - 1] + MAP.period < TOTAL + MAP.period) b.push(Math.round(b[b.length - 1] + MAP.period));
  return b;
})();
// Snares: beats 2 and 4 of each bar, counted from the downbeats.
const SNARES: number[] = BEATS.filter((b) => {
  const d = MAP.downbeats.filter((x) => x <= b).pop();
  if (d === undefined) return false;
  const k = Math.round((b - d) / MAP.period) % 4;
  return k === 1 || k === 3;
});
const energyAt = (f: number) => sectionAt(MAP, f).energy;

const CLIPS: Record<Id, string[]> = {
  s1: ["data-center-server-rack-pixabay-171185", "humanoid-robot-pixabay-334173", "server-room-pixabay-345428", "person-typing-laptop-night-pixabay-10822"],
  s2: ["programmer-coding-monitor-pixabay-23355", "code-on-screen-pixabay-14214", "humanoid-robot-pixabay-334173"],
  s3: ["developer-chatting-at-desk-pixabay-232538", "smartphone-messaging-app-pixabay-3172", "person-using-phone-chat-pixabay-38084"],
  s4: ["documents-paper-office-pixabay-34258", "spreadsheet-laptop-screen-pixabay-1058", "code-on-screen-pixabay-14214", "calendar-schedule-pixabay-197974"],
  s5: ["brain-neurons-pixabay-324831", "person-sleeping-dreaming-pixabay-358932", "documents-paper-office-pixabay-34258"],
  s6: ["hands-typing-keyboard-pixabay-3174", "programmer-coding-monitor-pixabay-23355", "code-on-screen-pixabay-14214"],
  s7: ["server-room-pixabay-345428", "network-cables-server-pixabay-14900", "cloud-computing-pixabay-68978"],
  s8: ["person-typing-laptop-night-pixabay-10822", "hands-typing-keyboard-pixabay-3174", "smartphone-messaging-app-pixabay-3172"],
  s9: ["computer-chip-circuit-pixabay-311332", "data-center-server-rack-pixabay-171185", "cloud-computing-pixabay-68978"],
  s10: ["clock-time-lapse-pixabay-61621", "padlock-security-pixabay-133084", "network-cables-server-pixabay-14900", "server-room-pixabay-345428"],
};
const CLIP_SECONDS: Record<string, number> = Object.fromEntries(
  facts.footage.map((c) => [c.file.replace("footage/", "").replace(".mp4", ""), c.duration]),
);
const STILLS = ["still-0.jpg", "still-1.jpg", "still-2.jpg", "still-3.jpg"];

const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const pick = <T,>(xs: T[], n: number) => xs[Math.floor(rand(n) * xs.length) % xs.length];
const between = (n: number, lo: number, hi: number) => lo + rand(n) * (hi - lo);

// --- Inserts: whole-frame, 2 frames on the snare. In the quiet sections only
// on beat 4, in the loud ones on 2 and 4. Smear and the invert flash lead.
const INSERTS = SNARES.filter((b, i) => b > 30 && b < TOTAL - 6 && (energyAt(b) > 0.35 || i % 2 === 1));
const insertStyle = (f: number): CSSProperties => {
  const at = INSERTS.find((i) => f >= i && f < i + 2);
  if (at === undefined) return {};
  const v = Math.floor(rand(at) * 7);
  return [
    { filter: "invert(1)" },
    { transform: `scaleX(${between(at, 1.6, 2.6)}) skewX(${between(at + 2, -20, 20)}deg)` },
    { filter: `drop-shadow(${between(at, 10, 22)}px 0 0 ${RED}) drop-shadow(-${between(at + 1, 10, 22)}px 0 0 ${CYAN})` },
    { filter: "invert(1)" },
    { transform: "scaleX(-1)" },
    { transform: `scaleX(${between(at + 5, 1.6, 2.6)}) skewX(${between(at + 6, -20, 20)}deg)` },
    { transform: `translateY(${between(at, -60, 60)}px) scaleY(1.15)`, filter: "contrast(1.8)" },
  ][v];
};

// --- Duotone regrade: every clip lands on the same colours.
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

// --- The shot list.
type Kind = "word" | "outro" | "blank" | "poster" | "footage" | "portal" | "scatter" | "bars" | "strips" | "maskword" | "tiles" | "word3d" | "bars3d";
// Every other shot is full-bleed footage; the ones between are dealt from this deck.
const KINDS: Kind[] = ["poster", "portal", "scatter", "bars", "strips", "maskword", "tiles", "word3d", "bars3d"];
let deck: Kind[] = [];
const deal = (n: number, recent: Kind[]): Kind => {
  if (deck.length === 0) deck = KINDS.map((k, i) => ({ k, r: rand(n * 17 + i) })).sort((a, b) => a.r - b.r).map((x) => x.k);
  const i = deck.findIndex((k) => !recent.includes(k));
  return deck.splice(Math.max(0, i), 1)[0];
};
type Shot = { from: number; len: number; kind: Kind; g: number; clip: string; start: number };
// The drop each scene holds (local frame), if any.
const dropIn = (id: Id) => {
  const d = MAP.drops.find((x) => x > START(id) && x < START(id) + LEN(id));
  return d === undefined ? null : d - START(id);
};
// The shot on each drop: the biggest move of its scene.
const DROP_KIND: Partial<Record<Id, Kind>> = { s4: "word3d", s7: "portal" };
let counter = 0;
export const SHOTS: Record<Id, Shot[]> = Object.fromEntries(
  IDS.map((id) => {
    const len = LEN(id);
    const S = START(id);
    const drop = dropIn(id);
    const local = BEATS.map((b) => b - S).filter((b) => b > 6 && b < len - 6);
    // Half-beat cuts only where the track is loud.
    const cuts = local.flatMap((b, i) => {
      const next = local[i + 1];
      const loud = energyAt(S + b) > 0.65;
      return next !== undefined && loud && rand(b + S) < 0.3 && b !== drop ? [b, Math.round((b + next) / 2)] : [b];
    });
    // Take something away on the half-beat before the drop.
    const blankAt = drop === null ? null : drop - Math.round(MAP.period / 2);
    let points = [0, ...cuts.filter((c) => blankAt === null || c < blankAt || c >= drop!), len];
    if (blankAt !== null) points = [...points, blankAt].sort((a, b) => a - b);
    const shots: Shot[] = [];
    const recent: Kind[] = [];
    const clips = CLIPS[id];
    // The last scene ends on the opening's word, from the last beat before the end.
    const outroAt = id === "s10" ? points.find((p) => p >= len - 84 && p < len) ?? null : null;
    let i = 0;
    while (i < points.length - 1) {
      const p = points[i];
      const first = shots.length === 0;
      const outro = p === outroAt;
      const loud = energyAt(S + p) > 0.65;
      let take = outro ? points.length : first ? 2 : loud ? (rand(counter * 13 + 1) < 0.7 ? 1 : 2) : 2;
      // Never run a shot across the blank, the drop or the outro.
      for (let k = 1; k <= take && i + k < points.length; k++) {
        const q = points[i + k];
        if (k < take && (q === blankAt || q === drop || q === outroAt)) take = k;
      }
      const end = points[Math.min(i + take, points.length - 1)];
      let kind: Kind;
      if (outro) kind = "outro";
      else if (first) kind = "word";
      else if (p === blankAt) kind = "blank";
      else if (p === drop && DROP_KIND[id]) kind = DROP_KIND[id]!;
      else if (recent[0] !== "footage") kind = "footage";
      else kind = deal(counter, recent);
      if (kind !== "footage" && kind !== "blank") {
        recent.unshift(kind);
        recent.length = Math.min(recent.length, 2);
      } else if (kind === "footage") {
        recent.unshift("footage");
        recent.length = Math.min(recent.length, 2);
      }
      shots.push({ from: p, len: end - p, kind, g: counter, clip: clips[Math.floor(rand(counter * 7) * clips.length)], start: S });
      counter++;
      i += take;
    }
    return [id, shots];
  }),
) as Record<Id, Shot[]>;
const shotAt = (id: Id, f: number) => SHOTS[id].find((s) => f >= s.from && f < s.from + s.len) ?? SHOTS[id][SHOTS[id].length - 1];
const isDark = (k: Kind) => k === "footage" || k === "bars" || k === "bars3d" || k === "strips" || k === "tiles";

// A clip at its own crop, zoom, drift and start point for this shot.
const Clip: React.FC<{ s: Shot; salt?: number; style?: CSSProperties }> = ({ s, salt = 0, style }) => {
  const f = useCurrentFrame();
  const n = s.g * 17 + salt;
  const zoom = between(n, 1, 1.45);
  const dx = between(n + 1, -40, 40);
  const t = (f - s.from) / Math.max(1, s.len);
  const room = Math.max(0, (CLIP_SECONDS[s.clip] ?? 8) * FPS - s.len - 20);
  return (
    <Sequence from={s.from} layout="none">
      <OffthreadVideo
        src={videoAsset(SLUG, `footage/${s.clip}.mp4`)}
        muted
        trimBefore={Math.round(between(n + 2, 0, room))}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${between(n + 3, 25, 75)}% 50%`,
          transform: `scale(${zoom + t * 0.08}) translateX(${dx * t}px)`,
          ...style,
        }}
      />
    </Sequence>
  );
};

// --- 3D.
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
      position={[between(n + 1, -0.3, 0.3), between(n + 2, 0.6, 1.4), 0]}
      rotation={[between(n + 3, -0.6, -0.3) + t * 0.002, between(n + 4, -0.4, 0.4) + t * 0.004, between(n + 5, -0.2, 0.2)]}
      scale={scale * slam}
    >
      <mesh geometry={geometry}>
        <meshStandardMaterial color={pick(["#111114", "#F4F4F4", BLUE], n + 6)} metalness={0.6} roughness={0.25} />
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
      <Footage s={s} f={f} ribbons={false} />
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
  (n, t) => <Ring x={between(n, 250, 830)} y={between(n + 1, 560, 1000)} w={between(n + 2, 380, 760)} h={between(n + 3, 300, 600)} spin={t * between(n + 4, -1.5, 1.5)} />,
  (n, t) => <Ring x={between(n, 300, 780)} y={between(n + 1, 500, 950)} w={between(n + 2, 160, 320)} h={between(n + 2, 160, 320)} spin={t * 3} dashed />,
  (n) => {
    const d = between(n, 200, 420);
    const x = between(n + 1, 200, 860);
    const y = between(n + 2, 520, 1000);
    return <div style={{ position: "absolute", left: x - d / 2, top: y - d / 2, width: d, height: d, borderRadius: "50%", background: `radial-gradient(circle, ${INK} 0%, #555 ${between(n + 3, 10, 30)}%, #DDD 52%, transparent 70%)` }} />;
  },
  (n) => <div style={{ position: "absolute", left: between(n, 150, 750), top: between(n + 1, 500, 1000), width: between(n + 2, 140, 260), height: between(n + 2, 70, 130), borderRadius: "300px 300px 0 0", background: INK, transform: `rotate(${pick([0, 90, 180, 270], n + 3)}deg)` }} />,
  (n, t) => <div style={{ position: "absolute", left: between(n, 100, 700), top: between(n + 1, 400, 1000), width: between(n + 2, 260, 520), height: between(n + 3, 18, 60), background: INK, transform: `rotate(${between(n + 4, -60, 60) + t * between(n + 5, -3, 3)}deg)` }} />,
  (n, t) => {
    const size = between(n, 600, 1000);
    return <div style={{ position: "absolute", left: between(n + 1, -100, 600), top: between(n + 2, 500, 1000) - size / 2, width: size, height: size, background: `linear-gradient(90deg, transparent, ${pick(ACCENTS, n + 3)})`, clipPath: "polygon(0 50%, 100% 0, 100% 100%)", transform: `rotate(${between(n + 4, -180, 180) + t * 0.7}deg)`, transformOrigin: "0 50%", opacity: 0.8 }} />;
  },
  (n) => (
    <div style={{ position: "absolute", left: between(n, SAFE.left, 600), top: between(n + 1, 400, 1000), display: "grid", gridTemplateColumns: `repeat(${Math.floor(between(n + 2, 4, 12))}, 9px)`, gap: 9 }}>
      {Array.from({ length: Math.floor(between(n + 3, 8, 48)) }, (_, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: 5, background: INK }} />)}
    </div>
  ),
  (n) => (
    <>
      {Array.from({ length: Math.floor(between(n, 2, 5)) }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: between(n + 1, 500, 820) + i * 14, top: between(n + 2, 420, 900) + i * 40, width: 64, height: 16, borderRadius: 8, background: CYAN, transform: `rotate(${between(n + 3, -40, 40)}deg)` }} />
      ))}
    </>
  ),
  (n, t) => {
    const y = between(n, 880, 1000);
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
      <line x1={0} y1={between(n, 420, 1050)} x2={1080 * Math.min(1, t / 10)} y2={between(n + 1, 420, 1050)} stroke={INK} strokeWidth={3} />
    </svg>
  ),
  (n, _t, id) => <div style={{ position: "absolute", left: between(n, 700, 830), top: between(n + 1, 420, 640), writingMode: "vertical-rl", fontFamily: wide, fontSize: 36, color: INK }}>{KEY[id]}</div>,
  (n) => (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d={`M ${between(n + i, 0, 300)} ${between(n + i + 1, 500, 1000)} C ${between(n + i + 2, 200, 800)} ${between(n + i + 3, 400, 1100)}, ${between(n + i + 4, 200, 800)} ${between(n + i + 5, 400, 1100)}, ${between(n + i + 6, 700, 1080)} ${between(n + i + 7, 500, 1000)}`} stroke={i === 0 ? INK : "#C9D3FF"} strokeWidth={i === 0 ? 3 : 2} fill="none" />
      ))}
    </svg>
  ),
  // A still from the scene's footage, framed on the paper.
  (n) => {
    const w = between(n, 260, 420);
    return (
      <div style={{ position: "absolute", left: between(n + 1, 120, 900 - w), top: between(n + 2, 420, 760), width: w, height: w * 1.4, backgroundImage: `url(${videoAsset(SLUG, pick(STILLS, n + 3))})`, backgroundSize: "cover", filter: MONO }} />
    );
  },
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

// Full-bleed footage, regraded on every beat it crosses, often with ribbons.
const Footage: React.FC<{ s: Shot; f: number; ribbons?: boolean }> = ({ s, f, ribbons = true }) => (
  <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
    <Graded n={beatIndex(f + s.start) + s.g}>
      <Clip s={s} />
    </Graded>
    {ribbons && rand(s.g * 3) < 0.7 && <Ribbons s={s} />}
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {rand(s.g * 5) < 0.6 && <line x1={0} y1={between(s.g, 880, 1080)} x2={1080} y2={between(s.g + 1, 880, 1080)} stroke="#FFFFFF" strokeWidth={3} />}
      {Array.from({ length: Math.floor(between(s.g * 7, 0, 6)) }, (_, i) => (
        <text key={i} x={between(s.g + i, 120, 820)} y={between(s.g + i + 9, 420, 1000)} fill="#FFFFFF" fontSize={40} fontFamily={mono}>
          +
        </text>
      ))}
    </svg>
  </AbsoluteFill>
);

const BARS = ["#C0C0C0", "#C0C000", "#00C0C0", "#00C000", "#C000C0", "#C00000", "#0000C0"];
const Bars: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  const n = s.g * 71;
  const cards = 3 + Math.floor(rand(n) * 5);
  const dir = rand(n + 1) < 0.5 ? -1 : 1;
  return (
    <AbsoluteFill>
      <Footage s={s} f={f} ribbons={false} />
      <AbsoluteFill style={{ perspective: 900 }}>
        {Array.from({ length: cards }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: between(n + 2, 120, 420) + i * between(n + 3, 40, 90) + dir * t * between(n + 4, 2, 6),
              top: between(n + 5, 440, 760) + i * between(n + 6, -30, 30),
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

const Portal: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = f - s.from;
  const n = s.g * 37;
  const d = between(n, 400, 600);
  const x = between(n + 1, 380, 700);
  const y = between(n + 2, 640, 820);
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

const Scatter: React.FC<{ s: Shot; f: number }> = ({ s, f }) => {
  const t = (f - s.from) / Math.max(1, s.len);
  const n = s.g * 43;
  const cols = Math.floor(between(n, 14, 24));
  const cell = 1080 / cols;
  const rows = Math.ceil(between(n + 1, 0.4, 0.6) * (1920 / cell));
  const top = between(n + 2, 380, 1400 - rows * cell);
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

const MaskWord: React.FC<{ s: Shot; f: number; id: Id }> = ({ s, f, id }) => {
  const t = f - s.from;
  const word = KEY[id];
  const n = s.g * 23;
  const size = Math.min(between(n + 2, 380, 520), 1500 / word.length);
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      <AbsoluteFill>
        <Graded n={s.g}>
          <Clip s={s} />
        </Graded>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: PAPER, mixBlendMode: "lighten" }}>
        <div style={{ position: "absolute", left: between(n, -80, 0), top: between(n + 1, 460, 640), fontFamily: wide, fontSize: size, lineHeight: 1, color: INK, letterSpacing: -20, whiteSpace: "nowrap", transform: `scale(${1 + t * 0.002})` }}>
          {word}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// The key word slammed in (2 frames oversized, then set), cropped off the left.
const Word: React.FC<{ s: Shot; f: number; word: string; top?: number }> = ({ s, f, word, top }) => {
  const t = f - s.from;
  const slam = t < 2 ? 1.3 : t < 4 ? 1.06 : 1;
  const n = s.g * 47;
  // 2–4 poster pieces behind the word, a different set every time.
  const behind = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11].sort((a, b) => rand(n + a) - rand(n + b)).slice(0, 2 + Math.floor(rand(n + 40) * 3));
  const color = pick([INK, INK, BLUE], n + 41);
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      {behind.map((k) => (
        <React.Fragment key={k}>{PIECES[k](n + k * 13, t, "s1")}</React.Fragment>
      ))}
      <div style={{ position: "absolute", left: between(n, -60, 0), top: top ?? between(n + 1, 480, 660), fontFamily: wide, fontSize: Math.min(between(n + 2, 270, 340), 1400 / word.length), lineHeight: 1, color, letterSpacing: -12, transform: `scale(${slam})`, transformOrigin: "left center", whiteSpace: "nowrap" }}>
        {word}
      </div>
    </AbsoluteFill>
  );
};

// The scene's fact stays put while the shots cut underneath it.
const FACT_BOTTOM = SAFE.bottom + 10;
const FactLayer: React.FC<{ id: Id; dark: boolean; f: number }> = ({ id, dark, f }) => {
  const sc = scene(id);
  const ats = useMemo(() => LINE_AT(id), [id]);
  if (f < 30) return null;
  const block = dark ? PAPER : INK;
  const text = dark ? INK : "#FFFFFF";
  // Every line keeps its slot from the start, so the block never shifts as
  // lines arrive; it sits on the bottom of the safe area.
  return (
    <div style={{ position: "absolute", left: SAFE.left, width: CONTENT_W, bottom: FACT_BOTTOM, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ background: block, color: text, padding: "14px 20px 10px", fontFamily: wide, fontSize: 60, lineHeight: 1.12, letterSpacing: -1, textWrap: "balance", maxWidth: CONTENT_W }}>{sc.headline}</div>
      {FACT_LINES(id).map((line, i) => {
        const t = f - ats[i];
        const p = t < 0 ? 0 : interpolate(t, [0, 10], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
        return (
          <div key={i} style={{ background: block, color: text, padding: "6px 20px 10px", fontFamily: sans, fontWeight: 700, fontSize: 38, opacity: p, transform: `translateX(${(1 - p) * -24}px)` }}>
            {line}
          </div>
        );
      })}
    </div>
  );
};

// Commands typed in the kit terminal, character for character, above the fact.
const TERM: Partial<Record<Id, { at: number; cmds: string[] }>> = {
  s6: { at: 150, cmds: scene("s6").commands },
  s7: { at: 24, cmds: scene("s7").commands },
};
const TermLayer: React.FC<{ id: Id }> = ({ id }) => {
  const t = TERM[id];
  if (!t) return null;
  return (
    <Sequence from={t.at} layout="none">
      <div style={{ position: "absolute", left: SAFE.left, top: id === "s6" ? 780 : 820 }}>
        <Terminal cmds={t.cmds} width={CONTENT_W} fontSize={36} minHeight={0} bg={INK} accent={CYAN} />
      </div>
      <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(t.cmds)} volume={0.25} />
    </Sequence>
  );
};

const Scene: React.FC<{ id: Id }> = ({ id }) => {
  const f = useCurrentFrame();
  const s = shotAt(id, f);
  const abs = f + START(id);
  // Pump the picture (never the text) on the beats where the track is loud.
  const loud = energyAt(abs) > 0.65;
  const pump = loud ? 1 + 0.02 * hit(BEATS, abs, 10) + 0.03 * hit(MAP.downbeats, abs, 12) : 1;
  const body =
    s.kind === "word" ? <Word s={s} f={f} word={KEY[id]} /> :
    s.kind === "outro" ? <Word s={s} f={f} word={KEY.s1} top={560} /> :
    s.kind === "blank" ? <AbsoluteFill style={{ background: PAPER }} /> :
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
  const drop = dropIn(id);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${pump})` }}>{body}</AbsoluteFill>
      <TermLayer id={id} />
      <FactLayer id={id} dark={isDark(s.kind)} f={f} />
      {id === "s1" && f < BEATS[4] && (
        <>
          <div style={{ position: "absolute", left: 0, top: 226, width: 560, height: 96, background: INK }} />
          <Brand />
        </>
      )}
      <Voice slug={SLUG} id={id} />
      <Sfx id="thud" at={0} volume={0.22} />
      {drop !== null && <Sfx id="whoosh" at={drop} volume={0.3} />}
      {SHOTS[id].filter((x) => x.kind === "scatter").map((x) => <Sfx key={x.g} id="pixel" at={x.from} volume={0.16} />)}
    </AbsoluteFill>
  );
};

// The drop lands with a 3-frame invert flash over everything.
const dropFlash = (f: number): CSSProperties => (MAP.drops.some((d) => f >= d && f < d + 3) ? { filter: "invert(1)" } : {});

const Main: React.FC<VideoProps> = ({ guide }) => {
  const f = useCurrentFrame();
  const ranges: [number, number][] = IDS.map((id) => [START(id), START(id) + Math.round(durations[id] * FPS)]);
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <AbsoluteFill style={{ ...insertStyle(f), ...dropFlash(f) }}>
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
