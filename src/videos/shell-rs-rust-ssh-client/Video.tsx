// What-if simulation: you are inside one SSH session. Four long shots of the
// real world (stock footage), a live session counter, a serif subtitle per beat.
import { AbsoluteFill, Loop, OffthreadVideo, Sequence, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { Brand, FPS, Music, SAFE, Sfx, TikTokGuide, Voice, easeOut, mono, sans, videoAsset, type VideoDef, type VideoProps } from "../../kit";
import durations from "./durations.json";
import timeline from "./timeline.json";

const SLUG = "shell-rs-rust-ssh-client";
const serif = loadSerif("italic", { weights: ["500"], subsets: ["latin", "vietnamese"] }).fontFamily;

const T = timeline.scenes as Record<string, { start: number; length: number }>;
const at = (id: string) => Math.round(T[id].start * FPS);
const TOTAL = Math.round(timeline.total * FPS);
const IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"];
const END = (id: string) => {
  const i = IDS.indexOf(id);
  return i === IDS.length - 1 ? TOTAL : at(IDS[i + 1]);
};
const sec = (s: number) => Math.round(s * FPS);

const SUBS: Record<string, string> = {
  s1: "Một phiên SSH. Soi được cả server.",
  s2: "Viết bằng Rust, GPU vẽ từng khung hình.",
  s3: "CPU, RAM, mạng: làm mới mỗi 2 giây.",
  s4: "Docker, log, restart: một cú click.",
  s5: "Rớt mạng? Phiên truyền file tự khôi phục.",
  s6: "Mật khẩu nằm trong Keychain của hệ điều hành.",
  s7: "AI agent chạy lệnh, không bao giờ thấy khóa.",
  s8: "Linux: tải AppImage, cấp quyền, chạy.",
  s9: "Thử shell-rs ngay.",
};

type Clip = { file: string; dur: number; pos: string; rate: number; credit: string };
const SHOTS: { from: string; to: string; clip: Clip }[] = [
  { from: "s1", to: "s2", clip: { file: "footage/server-room-flashing-lights-pixabay-171185.mp4", dur: 21, pos: "50% 50%", rate: 0.9, credit: "MozoMozo / Pixabay" } },
  { from: "s3", to: "s4", clip: { file: "footage/developer-working-late-at-night-pixabay-215751.mp4", dur: 18, pos: "60% 50%", rate: 0.8, credit: "G3Remote / Pixabay" } },
  { from: "s5", to: "s6", clip: { file: "footage/network-cables-data-center-blue-pixabay-14900.mp4", dur: 24, pos: "50% 50%", rate: 0.8, credit: "cipnt / Pixabay" } },
  { from: "s7", to: "s9", clip: { file: "footage/person-typing-on-keyboard-code-pixabay-10822.mp4", dur: 12, pos: "55% 50%", rate: 0.75, credit: "Coverr-Free-Footage / Pixabay" } },
];

const DROP_S5 = at("s5") + sec(3.2); // the connection drops
const RESUME_S5 = DROP_S5 + sec(1.9);
const GRADE_KEYS = [0, 12, 17.2, 28.7, 37.8, DROP_S5 / FPS, DROP_S5 / FPS + 0.5, RESUME_S5 / FPS, 47.9, 58.6, 70, 80, 89.9];
const GRADE_COLS = ["#2a5bff", "#2f6bff", "#ff9a3c", "#ffb15a", "#ff9a3c", "#ff9a3c", "#ff1f1f", "#ff1f1f", "#1fb6a6", "#ffa24a", "#ffa24a", "#ff9a3c", "#ff9a3c"];
const GRADE_OP = [0.36, 0.3, 0.3, 0.26, 0.28, 0.28, 0.5, 0.5, 0.26, 0.28, 0.26, 0.26, 0.28];

const World: React.FC<{ clip: Clip; len: number; first: number }> = ({ clip, len, first }) => {
  const f = useCurrentFrame();
  const g = f + first; // absolute frame
  const p = f / len;
  const pulse = (s: number) => (g < s ? 0 : 0.05 * Math.pow(1 - Math.min(1, (g - s) / 28), 2));
  const punch = pulse(at("s2")) + pulse(at("s4")) + pulse(RESUME_S5);
  const zoom = 1.1 + 0.12 * p + punch;
  // shake grows with the story's speed and spikes at the drop
  const speed = 1.5 + 6 * (g / TOTAL) + (g >= DROP_S5 && g < RESUME_S5 ? 9 : 0);
  const sx = Math.sin(g * 0.9) * speed + Math.sin(g * 2.3) * speed * 0.4;
  const sy = Math.cos(g * 1.1) * speed + Math.sin(g * 3.1) * speed * 0.3;
  const clipFrames = Math.floor((clip.dur * FPS) / clip.rate) - 4;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#05070b" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${zoom}) translateX(${-30 * p}px)` }}>
        <Loop durationInFrames={clipFrames}>
          <OffthreadVideo
            src={videoAsset(SLUG, clip.file)}
            muted
            playbackRate={clip.rate}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: clip.pos }}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(3,5,10,0.38)" }} />
    </AbsoluteFill>
  );
};

const Grade: React.FC = () => {
  const g = useCurrentFrame();
  const t = g / FPS;
  const color = interpolateColors(t, GRADE_KEYS, GRADE_COLS);
  const op = interpolate(t, GRADE_KEYS, GRADE_OP);
  return (
    <>
      <AbsoluteFill style={{ background: color, opacity: op, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: color, opacity: op * 0.35 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.78) 100%)" }} />
    </>
  );
};


const Counter: React.FC = () => {
  const g = useCurrentFrame();
  const t = g / FPS;
  const inB = g >= at("s3") && g < at("s5");
  const dropped = g >= DROP_S5 && g < RESUME_S5;
  let label = "PHIÊN SSH";
  let value = t.toFixed(1).padStart(5, "0");
  let unit = "GIÂY";
  let color = "#FFFFFF";
  if (inB) {
    const since = (g - at("s3")) / FPS;
    label = "LÀM MỚI SAU";
    value = (2 - (since % 2)).toFixed(1);
    unit = "GIÂY";
  }
  if (dropped) {
    label = "MẤT KẾT NỐI";
    const frozen = DROP_S5 / FPS;
    value = frozen.toFixed(1).padStart(5, "0");
    color = "#FF4A3D";
  }
  const appear = interpolate(g, [10, 34], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: 380, opacity: appear, transform: `translateY(${(1 - appear) * 16}px)`, color, textShadow: "0 2px 18px rgba(0,0,0,0.6)" }}>
      <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, letterSpacing: "0.28em" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6 }}>
        <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 150, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{value}</span>
        <span style={{ fontFamily: sans, fontWeight: 500, fontSize: 36, letterSpacing: "0.12em", opacity: 0.85 }}>{unit}</span>
      </div>
    </div>
  );
};

const Subtitle: React.FC<{ id: string }> = ({ id }) => {
  const f = useCurrentFrame();
  const len = END(id) - at(id);
  const inn = interpolate(f, [6, 24], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: easeOut });
  const out = interpolate(f, [len - 14, len - 2], [1, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const o = Math.min(inn, out);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: 1080 - SAFE.left - SAFE.right,
        bottom: SAFE.bottom + 80,
        textAlign: "center",
        fontFamily: serif,
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 58,
        lineHeight: 1.25,
        color: "#FFFFFF",
        textWrap: "balance",
        textShadow: "0 2px 20px rgba(0,0,0,0.85)",
        opacity: o,
        transform: `translateY(${(1 - inn) * 14}px)`,
      }}
    >
      {SUBS[id]}
    </div>
  );
};

const FADE = 12;

const Component: React.FC<VideoProps> = ({ guide }) => {
  const voiceRanges = IDS.map((id): [number, number] => [at(id), at(id) + Math.round(durations[id as keyof typeof durations] * FPS)]);
  return (
    <AbsoluteFill style={{ background: "#05070b" }}>
      {SHOTS.map((s, i) => {
        const from = at(s.from);
        const start = i === 0 ? 0 : from - FADE;
        const end = i === SHOTS.length - 1 ? TOTAL : END(s.to);
        return (
          <Sequence key={s.from} from={start} durationInFrames={end - start} name={`shot ${i + 1}`}>
            <FadeIn dur={i === 0 ? 0 : FADE}>
              <World clip={s.clip} len={end - start} first={start} />
              <AbsoluteFill>
                <div style={{ position: "absolute", left: SAFE.left, bottom: SAFE.bottom + 10, fontFamily: sans, fontWeight: 500, fontSize: 34, color: "rgba(255,255,255,0.7)", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
                  Video: {s.clip.credit}
                </div>
              </AbsoluteFill>
            </FadeIn>
            {i > 0 && <Sfx id="whoosh" at={FADE - 4} volume={0.3} />}
          </Sequence>
        );
      })}
      <Grade />
      <Counter />
      {IDS.map((id) => (
        <Sequence key={id} from={at(id)} durationInFrames={END(id) - at(id)} name={id}>
          <Subtitle id={id} />
          <Voice slug={SLUG} id={id} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={120}><Brand /></Sequence>
      <Sfx id="thud" volume={0.5} />
      <Sfx id="thud" at={at("s2")} volume={0.35} />
      <Sfx id="thud" at={at("s4")} volume={0.4} />
      <Sfx id="thud" at={DROP_S5} volume={0.4} />
      <Sfx id="ding" at={RESUME_S5} volume={0.3} />
      <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

const FadeIn: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = dur ? interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const video: VideoDef = { id: SLUG, component: Component, durationInFrames: TOTAL };
