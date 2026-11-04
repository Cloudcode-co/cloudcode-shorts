// Server-room flythrough: one aisle of 3D racks, the camera stops on the rack
// that matters for each line; the copy sits on a flat panel over the scene.
import { useThree } from "@react-three/fiber";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, Series, useCurrentFrame } from "remotion";
import {
  Brand,
  FPS,
  Music,
  Sfx,
  Stage3D,
  TikTokGuide,
  Voice,
  CONTENT_W,
  SAFE,
  display,
  easeOut,
  fit,
  sans,
  useImageTexture,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import script from "./script.json";

const SLUG = script.slug;
const BG = "#07070d";
const SPACING = 1.1;
const RACK_FRONT = 1.45;
const LOGO_Z = -50;

type Stop = { n: number; side: 1 | -1 | 0; shift: number };
type Shot = {
  ids: string[];
  key: string; // the one coloured key light, taken from the logo's sky and glow
  camY: number;
  stops: Stop[];
  startOffset: number;
};

const SHOTS: Shot[] = [
  {
    ids: ["s1", "s2", "s3"],
    key: "#ff8f7a",
    camY: 1.7,
    stops: [
      { n: 3, side: 1, shift: 0.9 },
      { n: 9, side: -1, shift: -0.8 },
      { n: 15, side: 1, shift: 0.9 },
    ],
    startOffset: 7,
  },
  {
    ids: ["s4", "s5"],
    key: "#6f86ff",
    camY: 1.5,
    stops: [
      { n: 21, side: -1, shift: -0.8 },
      { n: 28, side: 1, shift: 0.9 },
    ],
    startOffset: 6,
  },
  {
    ids: ["s6", "s7", "s8"],
    key: "#ff8f7a",
    camY: 1.9,
    stops: [
      { n: 6, side: 1, shift: -0.8 },
      { n: 12, side: -1, shift: 0.9 },
      { n: 18, side: 1, shift: -0.8 },
    ],
    startOffset: 6,
  },
  {
    ids: ["s9", "s10"],
    key: "#6f86ff",
    camY: 1.7,
    stops: [
      { n: 29, side: -1, shift: 0.9 },
      { n: 0, side: 0, shift: 0.9 },
    ],
    startOffset: 6,
  },
];

const sceneOf = (id: string) => script.scenes.find((s) => s.id === id)!;
const lenOf = (id: string) => fit((durations as Record<string, number>)[id], 60);
const shotLen = (s: Shot) => s.ids.reduce((a, id) => a + lenOf(id), 0);
const TOTAL = SHOTS.reduce((a, s) => a + shotLen(s), 0);

const VOICE_RANGES: [number, number][] = [];
{
  let at = 0;
  for (const sh of SHOTS)
    for (const id of sh.ids) {
      VOICE_RANGES.push([at, at + Math.round((durations as Record<string, number>)[id] * FPS)]);
      at += lenOf(id);
    }
}

// ---------- 3D ----------

const hash = (a: number, b: number, c: number) => {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
};

const stopZ = (st: Stop) => (st.side === 0 ? LOGO_Z + 7.6: -SPACING * st.n + 3.6);
const lookAt = (st: Stop, y: number): [number, number, number] =>
  st.side === 0
    ? [0, 1.9 + st.shift * 0.5, LOGO_Z]
    : [st.side * RACK_FRONT, y + st.shift, -SPACING * st.n];

const move = Easing.bezier(0.45, 0, 0.15, 1);
const CREEP = 0.4;

const useCameraPath = (shot: Shot) => {
  const frame = useCurrentFrame();
  const startZ = stopZ(shot.stops[0]) + shot.startOffset;
  let acc = 0;
  let k = 0;
  for (; k < shot.ids.length - 1; k++) {
    if (frame < acc + lenOf(shot.ids[k])) break;
    acc += lenOf(shot.ids[k]);
  }
  const L = lenOf(shot.ids[k]);
  const local = Math.min(frame - acc, L);
  const mEnd = L * 0.5;
  const p = move(Math.min(1, Math.max(0, local / mEnd)));
  const creep = Math.min(1, Math.max(0, (local - mEnd) / (L - mEnd))) * CREEP;
  const cur = shot.stops[k];
  const prev = shot.stops[k - 1];
  const fromZ = prev ? stopZ(prev) - CREEP : startZ;
  const toZ = stopZ(cur);
  const z = fromZ + (toZ - fromZ) * p - creep;
  const camX = (s: Stop | undefined) => (s ? -s.side * 0.35 : 0);
  const x = camX(prev) + (camX(cur) - camX(prev)) * p;
  const ahead: [number, number, number] = [0, shot.camY, startZ - 8];
  const a = prev ? lookAt(prev, shot.camY) : ahead;
  const b = lookAt(cur, shot.camY);
  const look = a.map((v, i) => v + (b[i] - v) * p) as [number, number, number];
  return { x, z, look, k, localInScene: frame - acc };
};

const Rig: React.FC<{ shot: Shot; children: (z: number, activeN: number) => React.ReactNode }> = ({
  shot,
  children,
}) => {
  const { camera } = useThree();
  const { x, z, look, k } = useCameraPath(shot);
  camera.position.set(x, shot.camY, z);
  camera.lookAt(look[0], look[1], look[2]);
  camera.updateMatrixWorld();
  return <>{children(z, shot.stops[k].side === 0 ? -1 : shot.stops[k].n)}</>;
};

const GREEN = "#3dff9a";
const AMBER = "#ffb43a";
const OFF = "#161a1c";

const Rack: React.FC<{ n: number; side: 1 | -1; active: boolean; keyColor: string }> = ({
  n,
  side,
  active,
  keyColor,
}) => {
  const frame = useCurrentFrame();
  const z = -SPACING * n;
  const fx = side * (RACK_FRONT - 0.012);
  const seed = n * 2 + (side === 1 ? 1 : 0);
  const rows = [0.7, 1.3, 1.9, 2.5];
  return (
    <group>
      <mesh position={[side * (RACK_FRONT + 0.55), 1.7, z]}>
        <boxGeometry args={[1.1, 3.4, 0.9]} />
        <meshStandardMaterial color={active ? "#1d1d2c" : "#101018"} roughness={0.6} metalness={0.4} />
      </mesh>
      {rows.map((y, r) => (
        <mesh key={r} position={[fx, y, z]}>
          <boxGeometry args={[0.02, 0.2, 0.78]} />
          <meshStandardMaterial color="#232333" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}
      {rows.flatMap((y, r) =>
        [0, 1, 2].map((c) => {
          const id = r * 3 + c;
          const period = 14 + (hash(seed, id, 7) % 40);
          const on = active || hash(seed, id, Math.floor(frame / period)) % 100 < 62;
          const col = active ? keyColor : hash(seed, id, 3) % 4 === 0 ? AMBER : GREEN;
          return (
            <mesh key={id} position={[fx - side * 0.012, y, z - 0.27 + c * 0.14]}>
              <boxGeometry args={[0.02, 0.07, 0.07]} />
              <meshBasicMaterial color={on ? col : OFF} />
            </mesh>
          );
        }),
      )}
      <mesh position={[fx - side * 0.02, 0.32, z]}>
        <boxGeometry args={[0.04, 0.05, 0.9]} />
        <meshBasicMaterial color={n % 3 === 0 ? keyColor : "#2a3a55"} />
      </mesh>
    </group>
  );
};

const Logo: React.FC = () => {
  const tex = useImageTexture(videoAsset(SLUG, "repos/gitroomhq.png"));
  return (
    <group position={[0, 1.9, LOGO_Z - 0.4]}>
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[2.8, 2.8, 0.05]} />
        <meshStandardMaterial color="#10101a" />
      </mesh>
      <mesh>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={tex} />
      </mesh>
    </group>
  );
};

const Aisle: React.FC<{ shot: Shot }> = ({ shot }) => (
  <Rig shot={shot}>
    {(z, activeN) => {
      const nMin = Math.max(0, Math.floor(-(z + 5) / SPACING));
      const nMax = Math.min(44, Math.ceil(-(z - 12) / SPACING));
      const racks: React.ReactNode[] = [];
      for (let n = nMin; n <= nMax; n++)
        for (const side of [1, -1] as const)
          racks.push(<Rack key={`${n}${side}`} n={n} side={side} active={n === activeN} keyColor={shot.key} />);
      return (
        <>
          <fog attach="fog" args={[BG, 7, 22]} />
          <pointLight position={[0, 2.6, z - 2.2]} color={shot.key} intensity={38} distance={13} decay={2} />
          <mesh position={[0, 0, -26]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[6, 64]} />
            <meshStandardMaterial color="#0b0b13" roughness={0.35} metalness={0.6} />
          </mesh>
          {[-0.95, 0.95].map((x) => (
            <mesh key={x} position={[x, 0.02, -26]}>
              <boxGeometry args={[0.04, 0.02, 64]} />
              <meshBasicMaterial color={shot.key} />
            </mesh>
          ))}
          {[-0.9, 0.9].map((x) => (
            <mesh key={x} position={[x, 3.7, -26]}>
              <boxGeometry args={[0.5, 0.1, 64]} />
              <meshStandardMaterial color="#1b1c27" />
            </mesh>
          ))}
          <mesh position={[0, 3.55, -26]}>
            <boxGeometry args={[0.06, 0.06, 64]} />
            <meshBasicMaterial color="#3a4a6a" />
          </mesh>
          <mesh position={[0, 4.1, -26]}>
            <boxGeometry args={[6, 0.1, 64]} />
            <meshStandardMaterial color="#08080e" />
          </mesh>
          <mesh position={[0, 2, LOGO_Z - 0.6]}>
            <planeGeometry args={[8, 6]} />
            <meshStandardMaterial color="#0a0a12" />
          </mesh>
          <Logo />
          {racks}
        </>
      );
    }}
  </Rig>
);

// ---------- 2D copy ----------

const Typed: React.FC<{ text: string; start: number; size: number; color?: string }> = ({
  text,
  start,
  size,
  color = "#f1f1f7",
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - start) * 1.3)));
  return (
    <div style={{ fontFamily: sans, fontWeight: 500, fontSize: size, lineHeight: 1.3, color }}>
      {text.slice(0, n)}
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </div>
  );
};

type Layout = { pos: "top" | "bottom"; big?: string; logo?: boolean; headSize: number };
const LAYOUTS: Record<string, Layout> = {
  s1: { pos: "bottom", logo: true, headSize: 92 },
  s2: { pos: "top", big: "AGPL-3.0", headSize: 66 },
  s3: { pos: "bottom", big: "34", headSize: 70 },
  s4: { pos: "top", headSize: 84 },
  s5: { pos: "bottom", headSize: 74 },
  s6: { pos: "top", headSize: 72 },
  s7: { pos: "bottom", headSize: 84 },
  s8: { pos: "top", headSize: 76 },
  s9: { pos: "bottom", big: "10/34", headSize: 66 },
  s10: { pos: "top", headSize: 92 },
};

const Copy: React.FC<{ id: string; key_: string }> = ({ id, key_ }) => {
  const sc = sceneOf(id);
  const lay = LAYOUTS[id];
  const vf = (durations as Record<string, number>)[id] * FPS;
  const head = useIn2(4);
  const gap = Math.max(36, (vf * 0.62) / sc.lines.length);
  const panel = useIn2(18);
  return (
    <AbsoluteFill
      style={{
        left: SAFE.left,
        top: SAFE.top,
        width: CONTENT_W,
        height: 1920 - SAFE.top - SAFE.bottom,
        display: "flex",
        flexDirection: "column",
        justifyContent: lay.pos === "top" ? "flex-start" : "flex-end",
        gap: 28,
        fontFamily: sans,
      }}
    >
      {lay.logo && (
        <Img
          src={videoAsset(SLUG, "repos/gitroomhq.png")}
          style={{
            width: 300,
            height: 300,
            borderRadius: 60,
            objectFit: "cover",
            boxShadow: `0 0 90px ${key_}88`,
            ...ent(head),
          }}
        />
      )}
      {lay.big && (
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: lay.big.length > 3 ? 190 : 300,
            lineHeight: 0.95,
            color: key_,
            textShadow: `0 4px 40px ${BG}`,
            ...ent(head),
          }}
        >
          {lay.big}
        </div>
      )}
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: lay.headSize,
          lineHeight: 1.08,
          color: "#fff",
          textWrap: "balance",
          textShadow: `0 4px 30px ${BG}, 0 0 8px ${BG}`,
          ...ent(head),
        }}
      >
        {sc.headline}
      </div>
      <div
        style={{
          background: "rgba(7,7,13,0.82)",
          border: `2px solid ${key_}66`,
          borderRadius: 28,
          padding: "30px 34px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          ...ent(panel),
        }}
      >
        {sc.lines.map((l, i) => (
          <div key={l} style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
            <div style={{ width: 16, height: 16, marginTop: 17, flex: "none", background: key_ }} />
            <Typed text={l} start={26 + i * gap} size={42} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const useIn2 = (delay: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
};
const ent = (p: number): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * 28}px)`,
});

// ---------- composition ----------

const ShotView: React.FC<{ shot: Shot }> = ({ shot }) => {
  let at = 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Stage3D background={BG} camera={[0, shot.camY, 6]} fov={58}>
        <Aisle shot={shot} />
      </Stage3D>
      {shot.ids.map((id) => {
        const from = at;
        at += lenOf(id);
        return (
          <Sequence key={id} from={from} durationInFrames={lenOf(id)} name={id}>
            <Voice slug={SLUG} id={id} />
            <Sfx id="whoosh" at={4} volume={0.18} />
            <Sfx id="pop" at={20} volume={0.2} />
            {id === "s10" && <Sfx id="ding" at={30} volume={0.2} />}
            <Copy id={id} key_={shot.key} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Postiz: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Series>
      {SHOTS.map((s, i) => (
        <Series.Sequence key={i} name={`Aisle ${i + 1}`} durationInFrames={shotLen(s)}>
          <ShotView shot={s} />
          {i === 0 && <Brand />}
        </Series.Sequence>
      ))}
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Postiz,
  durationInFrames: TOTAL,
};
