import { loadFont } from "@remotion/google-fonts/SourceSerif4";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Loop,
  Sequence,
  OffthreadVideo,
  useCurrentFrame,
} from "remotion";
import { Brand, FPS, Music, Sfx, Voice, SAFE, CONTENT_W, videoAsset, type VideoDef } from "../../kit";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const serif = loadFont("normal", { weights: ["400", "600", "700"], subsets: ["latin", "vietnamese"] }).fontFamily;
const ease = Easing.bezier(0.23, 1, 0.32, 1);

type Card = { big: string; label: string };
const CARDS: Record<string, Card | undefined> = {
  s1: { big: "284B", label: "tham số, không cần GPU" },
  s2: { big: "13.17B", label: "tham số active" },
  s3: { big: "56.56 GiB", label: "1.71 bpw" },
  s5: { big: "32768", label: "context, 16 thread" },
  s6: { big: "57.61 GiB", label: "đỉnh VmRSS ở 256K" },
  s7: { big: "44.36", label: "token mỗi giây khi prefill" },
  s8: { big: "+77%", label: "prefill: 25 lên 44.36 tok/s" },
  s9: { big: "type 40", label: "unknown tensor type 40" },
  s10: { big: "9.1–14.7", label: "token mỗi giây khi decode" },
};
// When the number card shows in each scene (share of the voice clip) and how long.
const CARD_AT: Record<string, [number, number]> = {
  s1: [0.45, 1.9], s2: [0.55, 2.2], s3: [0.5, 2.4], s5: [0.6, 2.2],
  s6: [0.4, 1.6], s7: [0.3, 1.4], s8: [0.25, 1.4], s9: [0.62, 2.4], s10: [0.5, 2.8],
};

const ids = script.scenes.map((s) => s.id);
const frames = (id: string) => Math.round((timeline.scenes as Record<string, { length: number }>)[id].length * FPS);
const startOf = (id: string) => ids.slice(0, ids.indexOf(id)).reduce((n, x) => n + frames(x), 0);
const TOTAL = ids.reduce((n, id) => n + frames(id), 0);

type Shot = { name: string; scenes: string[]; clip: string; from: number; pos: string };
const SHOTS: Shot[] = [
  { name: "Hook", scenes: ["s1", "s2"], clip: "footage/developer-at-desk-night-pixabay-232538.mp4", from: 0, pos: "50% 50%" },
  { name: "Build", scenes: ["s3", "s4", "s5"], clip: "footage/code-on-computer-screen-pixabay-14214.mp4", from: 0, pos: "50% 50%" },
  { name: "Reveal", scenes: ["s6", "s7", "s8"], clip: "footage/linux-server-room-pixabay-171185.mp4", from: 0, pos: "50% 50%" },
  { name: "Outro", scenes: ["s9", "s10"], clip: "footage/developer-at-desk-night-pixabay-232538.mp4", from: 0, pos: "30% 50%" },
];
const CLIP_LEN: Record<string, number> = {
  "footage/developer-at-desk-night-pixabay-232538.mp4": 12,
  "footage/code-on-computer-screen-pixabay-14214.mp4": 12,
  "footage/linux-server-room-pixabay-171185.mp4": 21,
};

const sceneOf = (id: string) => script.scenes.find((s) => s.id === id)!;

const NumberCard: React.FC<{ id: string; len: number }> = ({ id, len }) => {
  const f = useCurrentFrame();
  const card = CARDS[id];
  if (!card) return null;
  const vo = (durations as Record<string, number>)[id] * FPS;
  const [share, hold] = CARD_AT[id];
  const s = Math.round(vo * share);
  const e = Math.min(len - 6, s + Math.round(hold * FPS));
  if (f < s || f >= e) return null;
  const quick = ["s6", "s7", "s8"].includes(id);
  const p = interpolate(f - s, [0, quick ? 3 : 14], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const out = interpolate(f, [e - (quick ? 2 : 10), e], [1, 0], { extrapolateLeft: "clamp" });
  const size = Math.min(300, Math.floor(CONTENT_W / (card.big.length * 0.5)));
  return (
    <AbsoluteFill style={{ background: "#000", opacity: Math.min(1, p * 3) * out, alignItems: "center", justifyContent: "center", padding: `0 ${SAFE.right}px 0 ${SAFE.left}px` }}>
      <div style={{ transform: `scale(${0.94 + 0.06 * p + (f - s) * 0.00025})`, textAlign: "center", fontFamily: serif, color: "#EDE7DA" }}>
        <div style={{ fontSize: size, fontWeight: 700, lineHeight: 1, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", letterSpacing: -2 }}>{card.big}</div>
        <div style={{ width: 120 * p, height: 3, background: "#B9A27A", margin: "34px auto 28px" }} />
        <div style={{ fontSize: 46, fontWeight: 400, fontStyle: "italic", opacity: p, color: "#CFC6B2", textWrap: "balance" }}>{card.label}</div>
      </div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ id: string; len: number }> = ({ id, len }) => {
  const f = useCurrentFrame();
  const sc = sceneOf(id);
  const p = interpolate(f, [4, 26], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: ease });
  const out = interpolate(f, [len - 8, len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: SAFE.left, width: CONTENT_W, bottom: SAFE.bottom + 20, opacity: p * out, transform: `translateY(${(1 - p) * 18}px)`, fontFamily: serif, color: "#F1EBDD", textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}>
      <div style={{ width: 90, height: 3, background: "#B9A27A", marginBottom: 22 }} />
      <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.1, textWrap: "balance" }}>{sc.headline}</div>
      <div style={{ marginTop: 18, fontSize: 38, fontStyle: "italic", lineHeight: 1.3, color: "#D8CFBB", textWrap: "balance" }}>{sc.lines.join("  ·  ")}</div>
    </div>
  );
};

const Shots: React.FC = () => {
  return (
    <AbsoluteFill>
      {SHOTS.map((shot) => {
        const first = startOf(shot.scenes[0]);
        const len = shot.scenes.reduce((n, id) => n + frames(id), 0);
        return (
          <ShotLayer key={shot.name} shot={shot} from={first} len={len} />
        );
      })}
    </AbsoluteFill>
  );
};

const ShotLayer: React.FC<{ shot: Shot; from: number; len: number }> = ({ shot, from, len }) => {
  let at = 0;
  return (
    <Sequence from={from} durationInFrames={len} name={shot.name}>
      <ShotBase shot={shot} len={len} />
      {shot.name === "Hook" && <Sequence durationInFrames={frames("s1")}><Brand color="#EDE7DA" /></Sequence>}
      {shot.scenes.map((id) => {
        const from2 = at;
        const l = frames(id);
        at += l;
        return (
          <Sequence key={id} from={from2} durationInFrames={l} name={id}>
            <Caption id={id} len={l} />
            <NumberCard id={id} len={l} />
            <Voice slug={SLUG} id={id} />
            {CARDS[id] && <Sfx id="thud" at={Math.round((durations as Record<string, number>)[id] * FPS * CARD_AT[id][0])} volume={0.3} />}
          </Sequence>
        );
      })}
    </Sequence>
  );
};

const ShotBase: React.FC<{ shot: Shot; len: number }> = ({ shot, len }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, len], [1.0, 1.14]);
  const clipFrames = CLIP_LEN[shot.clip] * FPS - 30;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Loop durationInFrames={clipFrames}>
          <OffthreadVideo src={videoAsset(SLUG, shot.clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: shot.pos, filter: `saturate(0.62) contrast(1.05) brightness(${shot.name === "Build" ? 0.7 : 0.55})` }} />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.7) 100%)" }} />
    </AbsoluteFill>
  );
};

const VOICE_RANGES: [number, number][] = ids.map((id) => {
  const s = startOf(id);
  return [s, s + Math.round((durations as Record<string, number>)[id] * FPS)];
});

const Doc: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Shots />
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: () => <Doc />,
  durationInFrames: TOTAL,
};
