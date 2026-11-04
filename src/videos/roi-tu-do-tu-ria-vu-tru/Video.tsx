import { loadFont as loadSerif } from "@remotion/google-fonts/Lora";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  altitudeZoom,
  Brand,
  BRAND_SPACE,
  FPS,
  mono,
  Music,
  SAFE,
  sans,
  SatelliteZoom,
  Sfx,
  TikTokGuide,
  Voice,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const SAT = facts.satellite;

const serif = loadSerif("italic", { weights: ["500"], subsets: ["latin", "vietnamese"] }).fontFamily;

type Kind = "sat" | "jumper" | "centrifuge" | "visor" | "clouds" | "skydiver";
const CLIPS: Record<Exclude<Kind, "sat">, { file: string; seconds: number; pos: string }> = {
  jumper: { file: "footage/space-jumper-stratosphere-edge-pixabay-126663.mp4", seconds: 14, pos: "50% 50%" },
  centrifuge: { file: "footage/astronaut-centrifuge-spin-training-pixabay-143016.mp4", seconds: 16, pos: "50% 50%" },
  visor: { file: "footage/astronaut-helmet-visor-pixabay-132347.mp4", seconds: 55, pos: "50% 50%" },
  clouds: { file: "footage/clouds-from-above-aerial-pixabay-382383.mp4", seconds: 20, pos: "50% 50%" },
  skydiver: { file: "footage/skydiver-landing-in-desert-pixabay-284568.mp4", seconds: 17, pos: "50% 50%" },
};

// ---- Timing: every scene starts on its timeline.json start. ----
const IDS = script.scenes.map((s) => s.id) as ("s1" | "s2" | "s3" | "s4" | "s5" | "s6")[];
const sceneLen = (id: (typeof IDS)[number]) => Math.round(timeline.scenes[id].length * FPS);
const STARTS: number[] = [];
IDS.reduce((at, id) => {
  STARTS.push(at);
  return at + sceneLen(id);
}, 0);
const TOTAL = STARTS[5] + sceneLen("s6");
const sec = (f: number) => f / FPS;

// Which shots each scene cuts between (a new one about every 1.4s).
const PATTERNS: Record<(typeof IDS)[number], Kind[]> = {
  s1: ["sat", "jumper", "sat", "jumper"],
  s2: ["sat", "jumper", "sat", "visor", "sat", "clouds"],
  s3: ["sat", "centrifuge", "sat", "centrifuge"],
  s4: ["sat", "clouds", "sat", "clouds"],
  s5: ["sat", "visor", "sat", "visor"],
  s6: ["sat", "clouds", "sat", "skydiver", "skydiver", "skydiver", "skydiver", "skydiver", "skydiver"],
};
const TILTS = [0, -8, 6, -4, 10, -11, 5, -6, 9];

type Shot = { at: number; len: number; kind: Kind; n: number; tilt: number; scene: number };
const SHOTS: Shot[] = [];
IDS.forEach((id, si) => {
  const len = sceneLen(id);
  const count = Math.ceil(len / (1.4 * FPS));
  const each = len / count;
  for (let i = 0; i < count; i++) {
    const at = STARTS[si] + Math.round(i * each);
    const end = STARTS[si] + Math.round((i + 1) * each);
    SHOTS.push({
      at,
      len: end - at,
      kind: PATTERNS[id][i % PATTERNS[id].length],
      n: SHOTS.length,
      tilt: TILTS[(SHOTS.length * 5) % TILTS.length],
      scene: si,
    });
  }
});

// ---- The simulation: altitude (m), speed (km/h), from the script's numbers. ----
const T = (s: number) => s * FPS;
const lerpKeys = (f: number, keys: [number, number][], easing = Easing.inOut(Easing.quad)) => {
  for (let i = 0; i < keys.length - 1; i++) {
    if (f <= keys[i + 1][0]) {
      return interpolate(f, [keys[i][0], keys[i + 1][0]], [keys[i][1], keys[i + 1][1]], {
        easing,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }
  return keys[keys.length - 1][1];
};
const altitude = (f: number) =>
  lerpKeys(f, [
    [0, 39000],
    [T(3.4), 39000],
    [T(31.5), 19000],
    [T(44), 15000],
    [T(58), 2500],
    [TOTAL, 0],
  ], Easing.linear);
const speed = (f: number) =>
  lerpKeys(f, [
    [T(3.4), 0],
    [T(14.5), 1357.64],
    [TOTAL, 1357.64],
  ], Easing.out(Easing.cubic));

// Energy of the shake over the story.
const shakeLevel = (f: number) =>
  lerpKeys(f, [
    [0, 0.12],
    [T(4), 0.2],
    [T(14), 0.8],
    [T(20), 1],
    [T(44), 0.85],
    [T(56), 0.5],
    [TOTAL, 0.12],
  ], Easing.linear);

// ---- Colour that follows the story: cold blue high, red when it goes wrong, warm low. ----
const COLD = "#2d6bff";
const RED = "#ff2230";
const AMBER = "#ff9a3c";
const GOLD = "#ffc46b";
const GRADE_T = [0, 19.5, 20.5, 30.2, 31.2, 42.2, 43.2, 52.4, 53.4, TOTAL / FPS].map(T);
const GRADE_C = [COLD, COLD, RED, RED, AMBER, AMBER, RED, RED, GOLD, GOLD];

// ---- Numbers ----
const fmt = (n: number, decimals = 0) => {
  const [i, d] = n.toFixed(decimals).split(".");
  const grouped = i.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return d ? `${grouped},${d}` : grouped;
};

const Counter: React.FC = () => {
  const f = useCurrentFrame();
  const t = sec(f);
  const alt = Math.round(altitude(f));
  const spd = speed(f);
  const s3 = STARTS[2];
  const s5 = STARTS[4];

  let label: string | null = null;
  let value = "";
  let unit = "";
  if (f < STARTS[2]) {
    label = "TỐC ĐỘ";
    value = fmt(spd, 2);
    unit = "km/h";
  } else if (f < STARTS[3]) {
    const k = f - s3;
    if (k < T(5.3)) {
      label = "XOAY";
      value = String(Math.round(interpolate(k, [T(0.4), T(3.4)], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })));
      unit = "vòng/phút";
    } else {
      label = "LỰC LY TÂM";
      value = "> " + Math.round(interpolate(k, [T(5.4), T(7.6)], [1, 22], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
      unit = "G";
    }
  } else if (f >= s5 && f < STARTS[5]) {
    label = "TỈNH TÁO";
    value = String(Math.round(interpolate(f - s5, [T(3.4), T(8.8)], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
    unit = "giây";
  }

  // The altitude readout hits hard on the story's own marks.
  const marks = [STARTS[3] + T(0.4), STARTS[5] + T(0.4)];
  const hit = Math.max(
    0,
    ...marks.map((m) => interpolate(f - m, [0, 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })),
  );
  const num: React.CSSProperties = { fontFamily: mono, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#fff", lineHeight: 1 };
  const small: React.CSSProperties = { fontFamily: sans, fontWeight: 500, fontSize: 34, letterSpacing: "0.22em", color: "rgba(255,255,255,0.8)" };
  const hue = interpolateColors(f, GRADE_T, GRADE_C);

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + BRAND_SPACE + 14,
        textShadow: "0 2px 18px rgba(0,0,0,0.65)",
        width: 1080 - SAFE.left - SAFE.right,
      }}
    >
      <div style={small}>ĐỘ CAO</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, transform: `scale(${1 + hit * 0.06})`, transformOrigin: "left center" }}>
        <span style={{ ...num, fontSize: 168 }}>{fmt(alt)}</span>
        <span style={{ ...num, fontSize: 52, color: "rgba(255,255,255,0.85)" }}>m</span>
      </div>
      <div style={{ height: 84, marginTop: 30 }}>
        {label && (
          <>
            <div style={{ ...small, color: "#fff", fontWeight: 700, textShadow: `0 2px 4px rgba(0,0,0,0.7), 0 0 22px rgba(0,0,0,0.75), 0 0 2px ${hue}` }}>{label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{ ...num, fontSize: 74 }}>{value}</span>
              <span style={{ ...num, fontSize: 38, color: "rgba(255,255,255,0.85)" }}>{unit}</span>
            </div>
          </>
        )}
      </div>
      <span style={{ display: "none" }}>{t}</span>
    </div>
  );
};

// ---- Subtitles: one short line per beat, centred low. ----
const SUBS: [number, number, string][] = [
  [0, 0, "Nhảy xuống từ độ cao 39 km…"],
  [0, 2.6, "Điều gì sẽ xảy ra?"],
  [1, 0, "Tầng bình lưu loãng hơn khoảng 1.000 lần"],
  [1, 3.8, "Bạn không thấy gió cản, như bơi không có nước"],
  [1, 8.3, "Sau khoảng 40 giây: 1.357,64 km/h"],
  [1, 11.3, "Bạn vượt bức tường âm thanh"],
  [2, 0, "Bạn dễ bị xoay phẳng, mất kiểm soát"],
  [2, 3.4, "Tới 120 vòng/phút"],
  [2, 5.4, "Lực ly tâm hơn 22 lần trọng lực"],
  [2, 8.1, "Máu dồn lên đầu, bạn ngất lịm"],
  [3, 0, "Xuống 19.000 m: giới hạn Armstrong"],
  [3, 4.1, "Áp suất tụt sâu"],
  [3, 6.3, "Bộ đồ rách, chất lỏng trong phổi sôi hơi"],
  [4, 0, "Bộ đồ hở một lỗ nhỏ như đầu kim"],
  [4, 3.6, "Bạn tỉnh táo tối đa khoảng 15 giây"],
  [4, 7, "Trên 15.000 m, con người không thể thở"],
  [5, 0, "Bung dù ở khoảng 2.500 m"],
  [5, 3.6, "Bạn sẽ sống sót tiếp đất!"],
  [5, 6.6, "Anh em muốn mô phỏng kịch bản nào tiếp theo?"],
];
const SUB_FRAMES = SUBS.map(([si, s, text]) => ({ at: STARTS[si] + Math.round(s * FPS), text }));

const Subtitle: React.FC = () => {
  const f = useCurrentFrame();
  let idx = 0;
  SUB_FRAMES.forEach((s, i) => {
    if (f >= s.at) idx = i;
  });
  const cur = SUB_FRAMES[idx];
  const p = interpolate(f - cur.at, [0, 10], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.23, 1, 0.32, 1) });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: SAFE.right,
        bottom: 1920 - 1372,
        textAlign: "center",
        fontFamily: serif,
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 58,
        lineHeight: 1.22,
        color: "#fff",
        textWrap: "balance",
        textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 0 28px rgba(0,0,0,0.75)",
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      {cur.text}
    </div>
  );
};

// ---- One shot of the world. ----
const rotationFit = (deg: number) => {
  const a = Math.abs((deg * Math.PI) / 180);
  const w = Math.abs(Math.cos(a)) * 1080 + Math.abs(Math.sin(a)) * 1920;
  const h = Math.abs(Math.sin(a)) * 1080 + Math.abs(Math.cos(a)) * 1920;
  return Math.max(w / 1080, h / 1920) * 1.02;
};

const S3_FROM = STARTS[2];
const S3_TO = STARTS[3];

const WorldShot: React.FC<{ shot: Shot }> = ({ shot }) => {
  const local = useCurrentFrame();
  const f = shot.at + local;
  const punch = interpolate(local, [0, 9], [1.07, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.23, 1, 0.32, 1) });

  if (shot.kind === "sat") {
    const spinning = f >= S3_FROM && f < S3_TO;
    const ramp = interpolate(f - S3_FROM, [0, T(2)], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const deg = spinning ? (f - S3_FROM) * 7 * ramp : shot.tilt;
    const scale = rotationFit(deg);
    const zoom = Math.min(SAT.to + 1, Math.max(SAT.from, altitudeZoom(altitude(f), SAT.lat))) - Math.log2(scale);
    return (
      <AbsoluteFill style={{ transform: `scale(${punch})` }}>
        <AbsoluteFill style={{ transform: `rotate(${deg}deg) scale(${scale})`, filter: "contrast(1.35) saturate(1.3) brightness(0.95)" }}>
          <SatelliteZoom slug={SLUG} lat={SAT.lat} lon={SAT.lon} from={SAT.from} to={SAT.to} zoom={zoom} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  const clip = CLIPS[shot.kind];
  const clipFrames = clip.seconds * FPS;
  const room = Math.max(1, clipFrames - shot.len - 20);
  const start = (shot.n * 211 + 40) % room;
  return (
    <AbsoluteFill style={{ transform: `scale(${punch})`, background: "#05070d" }}>
      <OffthreadVideo
        src={staticFile(`videos/${SLUG}/${clip.file}`)}
        muted
        trimBefore={start}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: clip.pos }}
      />
      <AbsoluteFill style={{ background: "rgba(3,6,14,0.3)" }} />
    </AbsoluteFill>
  );
};

// ---- Camera shake: grows with speed, applied to the world only. ----
const Shake: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const k = shakeLevel(f);
  const n = (a: number, b: number, c: number) => Math.sin(f * a + c) * 0.6 + Math.sin(f * b + c * 2.3) * 0.4;
  const x = n(1.9, 3.7, 0.4) * 16 * k;
  const y = n(2.3, 4.1, 1.7) * 16 * k;
  const r = n(1.3, 2.9, 2.2) * 0.9 * k;
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(1.06)` }}>{children}</AbsoluteFill>
  );
};

const Grade: React.FC = () => {
  const f = useCurrentFrame();
  const c = interpolateColors(f, GRADE_T, GRADE_C);
  const dark = interpolate(f, [0, T(2.2)], [0.45, 0.1], { extrapolateRight: "clamp" });
  // Red pulses harder when it goes wrong.
  const wrong = (f >= S3_FROM && f < STARTS[3]) || (f >= STARTS[4] && f < STARTS[5]);
  const pulse = wrong ? 0.1 * (0.5 + 0.5 * Math.sin(f * 0.22)) : 0;
  return (
    <>
      <AbsoluteFill style={{ background: c, opacity: 0.26 + pulse, mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: c, opacity: 0.14 + pulse }} />
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dark})` }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 62% at 50% 46%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 62%, rgba(0,0,0,0.5) 78%)",
        }}
      />
    </>
  );
};

// A white flash on the big moments (the music changes there).
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = Math.max(
    0,
    ...[STARTS[1], STARTS[2], STARTS[5]].map((s) =>
      interpolate(f - s, [0, 7], [0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ),
  );
  return <AbsoluteFill style={{ background: "#fff", opacity: o }} />;
};

const CREDITS = "Ảnh vệ tinh: NASA, USGS · Video: Pixabay";
const Credit: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      top: 1386,
      fontFamily: sans,
      fontWeight: 500,
      fontSize: 34,
      color: "rgba(255,255,255,0.55)",
      textShadow: "0 1px 8px rgba(0,0,0,0.8)",
    }}
  >
    {CREDITS}
  </div>
);

const VOICE_RANGES: [number, number][] = IDS.map((id, i) => [STARTS[i], STARTS[i] + Math.round(durations[id] * FPS)]);

const Sim: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: "#05070d", fontFamily: sans }}>
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Shake>
        {SHOTS.map((s) => (
          <Sequence key={s.n} from={s.at} durationInFrames={s.len} name={`${s.kind} ${s.n}`} premountFor={30}>
            <WorldShot shot={s} />
          </Sequence>
        ))}
      </Shake>
    </AbsoluteFill>
    <Grade />
    <Counter />
    <Subtitle />
    <Credit />
    <Flash />
    <Sequence durationInFrames={T(3.4)} layout="none">
      <Brand />
    </Sequence>
    {IDS.map((id, i) => (
      <Sequence key={id} from={STARTS[i]} layout="none" name={id}>
        <Voice slug={SLUG} id={id} />
        <Sfx id={i === 0 || i === 2 || i === 5 ? "thud" : "whoosh"} volume={0.4} />
      </Sequence>
    ))}
    <Sfx id="ding" at={STARTS[5] + T(3.6)} volume={0.3} />
    <Sfx id="pop" at={STARTS[3] + T(0.4)} volume={0.3} />
    <Sfx id="pop" at={STARTS[4] + T(3.6)} volume={0.3} />
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Sim, durationInFrames: TOTAL };
