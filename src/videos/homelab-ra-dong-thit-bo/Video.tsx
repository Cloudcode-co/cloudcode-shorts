import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import {
  BRAND_SPACE,
  Brand,
  FPS,
  Meme,
  Music,
  SAFE,
  Sfx,
  TikTokGuide,
  CONTENT_W,
  sans,
  easeOut,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = "homelab-ra-dong-thit-bo";

type Scene = (typeof script.scenes)[number];
type MemeFact = (typeof facts.memes)[number];
const tl = timeline.scenes as Record<string, { start: number; length: number }>;

const msgs = script.scenes.map((s: Scene) => ({
  id: s.id,
  text: s.headline,
  me: s.lines[0] === "me",
  start: Math.round(tl[s.id].start * FPS),
  meme: facts.memes.find((m: MemeFact) => m.scene === s.id),
}));

const total = Math.round(timeline.total * FPS);
const T_THEM = 46; // frames of typing dots before a "them" bubble
const T_ME = 20;
const stickerW = (id: string) => (id === "s7" ? 520 : 280);
const bubbleAt = (m: (typeof msgs)[number]) => m.start + (m.me ? T_ME : T_THEM);
const slotAt = (m: (typeof msgs)[number]) => m.start + (m.me ? 3 : 5);

// Four long shots; the thread keeps building inside each one.
const SHOTS = [
  { from: 0, to: 540, bg: "#10252B", panel: "#16343C", status: "#7CF2B0" },
  { from: 540, to: 810, bg: "#2D1B10", panel: "#3B2415", status: "#FFB347" },
  { from: 810, to: 1092, bg: "#33100F", panel: "#471816", status: "#FF7A6B" },
  { from: 1092, to: total, bg: "#14182B", panel: "#1C2240", status: "#9DB4FF" },
];

const Slot: React.FC<{ at: number; g: number; children: React.ReactNode }> = ({ at, g, children }) => {
  const p = interpolate(g, [at, at + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  if (g < at) return null;
  return (
    <div style={{ display: "grid", gridTemplateRows: `${p}fr`, opacity: p, flexShrink: 0 }}>
      <div style={{ overflow: "hidden", minHeight: 0 }}>
        <div style={{ paddingTop: 18 }}>{children}</div>
      </div>
    </div>
  );
};

const Dots: React.FC<{ g: number; me: boolean }> = ({ g, me }) => (
  <div style={{ display: "flex", gap: 12, padding: "26px 30px" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          background: me ? "#0B2A1C" : "#FFFFFF",
          opacity: 0.35 + 0.65 * Math.max(0, Math.sin((g - i * 5) / 4.5)),
          transform: `translateY(${-6 * Math.max(0, Math.sin((g - i * 5) / 4.5))}px)`,
        }}
      />
    ))}
  </div>
);

const Avatar: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: "#FFB347",
      color: "#3B2415",
      fontFamily: sans,
      fontWeight: 700,
      fontSize: size * 0.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    H
  </div>
);

const Message: React.FC<{ m: (typeof msgs)[number]; g: number }> = ({ m, g }) => {
  const b = bubbleAt(m);
  const typing = g < b;
  const pop = interpolate(g, [b, b + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const bubble = (
    <div
      style={{
        maxWidth: 640,
        background: m.me ? "#7CF2B0" : "#2B3040",
        color: m.me ? "#0B2A1C" : "#FFFFFF",
        borderRadius: 40,
        borderBottomRightRadius: m.me ? 10 : 40,
        borderBottomLeftRadius: m.me ? 40 : 10,
        fontFamily: sans,
        fontWeight: 500,
        fontSize: 46,
        lineHeight: 1.28,
        padding: typing ? 0 : "22px 32px",
        transform: typing ? undefined : `scale(${0.92 + 0.08 * pop})`,
        transformOrigin: m.me ? "100% 100%" : "0% 100%",
        textWrap: "pretty",
      }}
    >
      {typing ? <Dots g={g} me={m.me} /> : m.text}
    </div>
  );
  return (
    <div style={{ display: "flex", justifyContent: m.me ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 16 }}>
      {!m.me && <Avatar size={72} />}
      {bubble}
    </div>
  );
};

const Thread: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 20 }}>
    {msgs.map((m) => (
      <div key={m.id} style={{ display: "contents" }}>
        <Slot at={slotAt(m)} g={g}>
          <Message m={m} g={g} />
        </Slot>
        {m.meme && (
          <Slot at={bubbleAt(m) + 14} g={g}>
            <div style={{ paddingLeft: 88, position: "relative", height: Math.round((m.meme.height / m.meme.width) * stickerW(m.id)) + 8 }}>
              <Meme
                slug={SLUG}
                file={m.meme.file}
                width={m.meme.width}
                height={m.meme.height}
                style={{ left: 88, top: 0, width: stickerW(m.id) }}
              />
            </div>
          </Slot>
        )}
      </div>
    ))}
  </div>
);

const Phone: React.FC<{ shot: (typeof SHOTS)[number]; first: boolean; from: number }> = ({ shot, first, from }) => {
  const local = useCurrentFrame();
  const g = from + local;
  const top = first ? SAFE.top + BRAND_SPACE : SAFE.top;
  const typingThem = msgs.some((m) => !m.me && g >= slotAt(m) && g < bubbleAt(m));
  const typingMe = msgs.some((m) => m.me && g >= slotAt(m) && g < bubbleAt(m));
  const status = typingThem ? "đang soạn tin…" : typingMe ? "đang xem" : "đang hoạt động";
  const open = interpolate(local, [0, 10], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  return (
    <AbsoluteFill style={{ background: shot.bg }}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top,
          width: CONTENT_W,
          bottom: SAFE.bottom,
          display: "flex",
          flexDirection: "column",
          opacity: 0.4 + 0.6 * open,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22, paddingBottom: 22, borderBottom: "3px solid rgba(255,255,255,0.12)" }}>
          <Avatar size={96} />
          <div style={{ fontFamily: sans, color: "#FFFFFF", minWidth: 0 }}>
            <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.15 }}>{facts.contact}</div>
            <div style={{ fontSize: 34, fontWeight: 500, color: shot.status }}>{status}</div>
          </div>
        </div>
        <Thread g={g} />
        <div
          style={{
            height: 96,
            borderRadius: 48,
            background: shot.panel,
            display: "flex",
            alignItems: "center",
            paddingLeft: 36,
            fontFamily: sans,
            fontSize: 36,
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Nhắn tin
        </div>
      </div>
      {first && <Brand />}
    </AbsoluteFill>
  );
};

const Video: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    {SHOTS.map((s, i) => (
      <Sequence key={i} from={s.from} durationInFrames={s.to - s.from} name={`shot ${i + 1}`}>
        <Phone shot={s} first={i === 0} from={s.from} />
        {i > 0 && <Sfx id="whoosh" volume={0.25} />}
      </Sequence>
    ))}
    {msgs.map((m) => (
      <Sfx key={m.id} id={m.me ? "pop" : "ding"} at={bubbleAt(m)} volume={0.3} />
    ))}
    <Sfx id="thud" at={bubbleAt(msgs[6])} volume={0.4} />
    <Music slug={SLUG} total={total} voiceRanges={[]} level={0.55} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Video, durationInFrames: total };
