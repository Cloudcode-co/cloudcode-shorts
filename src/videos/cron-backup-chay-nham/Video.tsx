import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, interpolate } from "remotion";
import { useCurrentFrame } from "remotion";
import {
  Brand,
  FPS,
  Meme,
  Music,
  SAFE,
  Sfx,
  easeOut,
  mono,
  sans,
  display,
  whip,
  type VideoDef,
} from "../../kit";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const TOTAL = Math.round(timeline.total * FPS);
const TRANS = 10;

const head = (id: string) => script.scenes.find((s) => s.id === id)!.headline;
const memeOf = (id: string) => {
  const m = facts.memes.find((x) => x.scene === id)!;
  return { file: m.file, width: m.width, height: m.height };
};

// ---- palette: night-time dev chat, amber (the alarm clock) for "me" ----
const BG = "#0D1217";
const BG_PANIC = "#1C0D0D";
const BAR = "#141C24";
const THEM = "#1F2A35";
const ME = "#FFB020";
const TXT = "#EAF0F4";
const MUTED = "#8FA1B0";
const CRON = "#27C4B5";
const SERVER = "#FF6B5B";

type Who = "Cron" | "Server";
type Item = {
  id: string;
  kind: "bubble" | "code" | "sticker" | "divider";
  side: "me" | "them";
  who?: Who;
  text?: string;
  lines?: number;
  at: number; // seconds, absolute in the video
  typing?: number; // typing indicator starts (seconds, absolute)
  w?: number;
  h?: number;
  meme?: { file: string; width: number; height: number };
  slam?: boolean;
};

const GAP = 22;
const VIEW_TOP = 470;
const VIEW_H = 850;
const AV = 84;
const LEFT = SAFE.left; // 103
const RIGHT_EDGE = 1080 - SAFE.right; // 880
const NAME_H = 44;
const TYPING_H = 88;

const itemH = (it: Item) => {
  if (it.kind === "bubble") return (it.lines ?? 2) * 62 + 46 + (it.who ? NAME_H : 0);
  if (it.kind === "code") return 104;
  if (it.kind === "divider") return 56;
  return it.h ?? 300;
};

const sticker = (id: string, w: number, side: "me" | "them", at: number): Item => {
  const m = memeOf(id);
  return { id: `st-${id}`, kind: "sticker", side, at, meme: m, w, h: Math.round((w * m.height) / m.width) };
};

// ---------------- icons ----------------
const ClockIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="15" stroke={color} strokeWidth="4" />
    <path d="M24 15v10l7 4" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 12l6-6M41 12l-6-6" stroke={color} strokeWidth="4" strokeLinecap="round" />
  </svg>
);
const ServerIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="8" y="9" width="32" height="12" rx="3" stroke={color} strokeWidth="4" />
    <rect x="8" y="27" width="32" height="12" rx="3" stroke={color} strokeWidth="4" />
    <circle cx="15" cy="15" r="2" fill={color} />
    <circle cx="15" cy="33" r="2" fill={color} />
  </svg>
);
const Avatar: React.FC<{ who: Who; size?: number }> = ({ who, size = AV }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: who === "Cron" ? CRON : SERVER,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {who === "Cron" ? (
      <ClockIcon size={size * 0.64} color="#06201D" />
    ) : (
      <ServerIcon size={size * 0.64} color="#2A0A06" />
    )}
  </div>
);

// ---------------- a chat shot ----------------
type ShotProps = {
  offset: number; // seconds: where this shot starts in the video
  items: Item[];
  bgTo?: string;
  bgAt?: number; // seconds absolute when bg shifts
  slamAt?: number; // seconds absolute of the drop
  brand?: boolean;
  startBg?: string;
  pad?: number; // space above the first item
};

const ChatShot: React.FC<ShotProps> = ({ offset, items, bgTo, bgAt, slamAt, brand, startBg = BG, pad = 0 }) => {
  const f = useCurrentFrame();
  const fr = (t: number) => Math.round((t - offset) * FPS);

  // stack layout (final positions)
  let cursor = pad;
  const laid = items.map((it) => {
    const h = itemH(it);
    const y = cursor;
    cursor += h + GAP;
    return { it, y, h };
  });

  // scroll keyframes: bring the newest thing (or typing dots) to the bottom
  const events: { f: number; target: number }[] = [];
  laid.forEach(({ it, y, h }) => {
    if (it.typing !== undefined) events.push({ f: fr(it.typing), target: y + TYPING_H + (it.who ? NAME_H : 0) });
    events.push({ f: fr(it.at), target: y + h });
  });
  events.sort((a, b) => a.f - b.f);
  let prevF = 0;
  let scroll = 0;
  for (const e of events) {
    const fin = Math.max(prevF, Math.max(0, e.target - VIEW_H + 6));
    if (f >= e.f) {
      const p = interpolate(f, [e.f, e.f + 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeOut,
      });
      scroll = prevF + (fin - prevF) * p;
    }
    prevF = fin;
  }

  // who is typing right now
  const typer = laid.find(({ it }) => it.typing !== undefined && f >= fr(it.typing) && f < fr(it.at));
  const subtitle = typer
    ? `${typer.it.side === "me" ? "Dev" : typer.it.who} đang nhập…`
    : "Dev, Cron, Server";

  // the drop
  const sf = slamAt !== undefined ? fr(slamAt) : Infinity;
  const since = f - sf;
  const shake = since >= 0 && since < 26 ? Math.exp(-since / 6) : 0;
  const sx = shake * 16 * Math.sin(since * 2.3);
  const sy = shake * 12 * Math.cos(since * 3.1);
  const flash = since >= 0 ? interpolate(since, [0, 14], [0.32, 0], { extrapolateRight: "clamp" }) : 0;

  const bgMix =
    bgTo && bgAt !== undefined
      ? interpolate(f, [fr(bgAt), fr(bgAt) + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;
  const bg = bgMix > 0 ? mix(startBg, bgTo!, bgMix) : startBg;

  return (
    <AbsoluteFill style={{ background: bg, fontFamily: sans }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        {/* thread */}
        <div
          style={{ position: "absolute", left: 0, right: 0, top: VIEW_TOP, height: VIEW_H, overflow: "hidden" }}
        >
          {laid.map(({ it, y, h }) => {
            const at = fr(it.at);
            const p = interpolate(f, [at, at + 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            });
            if (f < at) {
              // typing indicator takes the slot of the message about to land
              if (it.typing !== undefined && f >= fr(it.typing) && it.kind === "bubble") {
                const tp = interpolate(f, [fr(it.typing), fr(it.typing) + 10], [0, 1], {
                  extrapolateRight: "clamp",
                  easing: easeOut,
                });
                return <Typing key={it.id} it={it} y={y - scroll} p={tp} f={f} />;
              }
              return null;
            }
            const sy0 = y - scroll;
            // an item is gone before its top edge reaches the clip line: never a sliced bubble or sticker
            const fade = interpolate(sy0, [-8, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const slamP = it.slam ? interpolate(f - at, [0, 16], [1.09, 1], { extrapolateRight: "clamp", easing: easeOut }) : 1;
            return (
              <div
                key={it.id}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: sy0,
                  height: h,
                  opacity: p * fade,
                  transform: `translateY(${(1 - p) * 34}px)`,
                }}
              >
                <Row it={it} h={h} slam={slamP} f={f - at} />
              </div>
            );
          })}
        </div>

        {/* header */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: VIEW_TOP - 8,
            background: BAR,
            boxShadow: "0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: LEFT,
              top: 334,
              width: RIGHT_EDGE - LEFT,
              height: 112,
              display: "flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 96,
                background: ME,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ClockIcon size={62} color="#2A1A00" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 42, color: TXT, lineHeight: 1.15, whiteSpace: "nowrap" }}>
                Cron backup chạy nhầm giờ
              </div>
              <div style={{ fontWeight: 500, fontSize: 34, color: typer ? CRON : MUTED, lineHeight: 1.3, marginTop: 2 }}>
                {subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* input bar */}
        <div style={{ position: "absolute", left: 0, right: 0, top: VIEW_TOP + VIEW_H + 8, bottom: 0, background: BAR }}>
          <div
            style={{
              position: "absolute",
              left: LEFT,
              top: 16,
              width: RIGHT_EDGE - LEFT - 90,
              height: 92,
              borderRadius: 46,
              background: "#0D1217",
              display: "flex",
              alignItems: "center",
              paddingLeft: 34,
              fontSize: 38,
              fontWeight: 500,
              color: "#5C6C79",
            }}
          >
            Nhắn tin…
          </div>
          <div
            style={{
              position: "absolute",
              left: RIGHT_EDGE - 76,
              top: 24,
              width: 76,
              height: 76,
              borderRadius: 76,
              background: ME,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="38" height="38" viewBox="0 0 24 24" fill="#2A1A00">
              <path d="M3 20.5l18-8.5L3 3.5v6.6l11 1.9-11 1.9z" />
            </svg>
          </div>
        </div>
      </AbsoluteFill>

      {flash > 0 && <AbsoluteFill style={{ background: `rgba(255,40,30,${flash})` }} />}
      {brand && <Brand />}

      {/* sounds */}
      {laid.map(({ it }) =>
        it.kind === "bubble" || it.kind === "code" ? (
          <Sfx key={it.id} id={it.slam ? "thud" : it.side === "me" ? "pop" : "ding"} at={Math.max(0, fr(it.at))} volume={it.slam ? 0.6 : 0.22} />
        ) : null,
      )}
    </AbsoluteFill>
  );
};

const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};

const Typing: React.FC<{ it: Item; y: number; p: number; f: number }> = ({ it, y, p, f }) => {
  const me = it.side === "me";
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: me ? undefined : LEFT,
        right: me ? 1080 - RIGHT_EDGE : undefined,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        display: "flex",
        gap: 16,
        alignItems: "flex-end",
      }}
    >
      {!me && it.who && <Avatar who={it.who} />}
      <div>
        {!me && it.who && (
          <div style={{ fontSize: 34, fontWeight: 700, color: it.who === "Cron" ? CRON : SERVER, marginBottom: 4 }}>{it.who}</div>
        )}
        <div
          style={{
            height: TYPING_H,
            padding: "0 38px",
            borderRadius: 36,
            background: me ? ME : THEM,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {[0, 1, 2].map((i) => {
            const b = Math.sin((f - i * 5) / 5);
            return (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 18,
                  background: me ? "#2A1A00" : MUTED,
                  opacity: 0.55 + 0.45 * Math.max(0, b),
                  transform: `translateY(${-8 * Math.max(0, b)}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ it: Item; h: number; slam: number; f: number }> = ({ it, h, slam, f }) => {
  const me = it.side === "me";
  if (it.kind === "divider") {
    return (
      <div style={{ textAlign: "center", fontSize: 36, fontWeight: 700, color: MUTED, lineHeight: `${h}px`, paddingLeft: LEFT, width: RIGHT_EDGE - LEFT, boxSizing: "content-box" }}>
        {it.text}
      </div>
    );
  }
  const wrapStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    display: "flex",
    gap: 16,
    alignItems: "flex-end",
    ...(me ? { right: 1080 - RIGHT_EDGE } : { left: LEFT }),
  };
  if (it.kind === "sticker") {
    const sp = interpolate(f, [0, 16], [0.82, 1], { extrapolateRight: "clamp", easing: easeOut });
    const m = it.meme!;
    return (
      <div style={{ ...wrapStyle, height: h }}>
        {!me && <div style={{ width: AV }} />}
        <div style={{ position: "relative", width: it.w, height: h, transform: `scale(${sp})`, transformOrigin: me ? "100% 100%" : "0% 100%" }}>
          <Meme slug={SLUG} file={m.file} width={m.width} height={m.height} style={{ left: 0, top: 0, width: it.w, height: h }} />
        </div>
      </div>
    );
  }
  if (it.kind === "code") {
    return (
      <div style={{ ...wrapStyle, height: h }}>
        <div
          style={{
            height: h,
            padding: "0 40px",
            borderRadius: 30,
            background: "#06090C",
            border: "2px solid #2A3642",
            display: "flex",
            alignItems: "center",
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 52,
            color: "#7CFFB2",
            letterSpacing: "0.08em",
            whiteSpace: "pre",
          }}
        >
          {it.text}
        </div>
      </div>
    );
  }
  return (
    <div style={{ ...wrapStyle, height: h, transform: `scale(${slam})`, transformOrigin: me ? "100% 100%" : "0% 100%" }}>
      {!me && it.who && <Avatar who={it.who} />}
      <div style={{ maxWidth: me ? 740 : 680 }}>
        {!me && it.who && (
          <div style={{ fontSize: 34, fontWeight: 700, color: it.who === "Cron" ? CRON : SERVER, height: NAME_H - 4 }}>{it.who}</div>
        )}
        <div
          style={{
            padding: "22px 28px",
            borderRadius: 36,
            borderBottomLeftRadius: me ? 36 : 10,
            borderBottomRightRadius: me ? 10 : 36,
            background: me ? ME : THEM,
            color: me ? "#1E1300" : TXT,
            fontSize: 48,
            fontWeight: 700,
            lineHeight: "62px",
            textWrap: "pretty",
          }}
        >
          {it.text}
        </div>
      </div>
    </div>
  );
};

// ---------------- the three shots ----------------
const D = 8.3;
const E = 17.1;

const shotA: Item[] = [
  { id: "m1", kind: "bubble", side: "me", text: head("s1"), lines: 3, at: 0.15 },
  sticker("s1", 460, "me", 1.1),
  { id: "m2", kind: "bubble", side: "them", who: "Cron", text: head("s2"), lines: 2, at: 4.2, typing: 3.55 },
  { id: "c2", kind: "code", side: "me", text: "0 2 * * *", at: 5.05 },
  sticker("s2", 330, "them", 6.1),
];

const shotB: Item[] = [
  { id: "d3", kind: "divider", side: "them", text: "Sáng hôm sau", at: 8.35 },
  { id: "m3", kind: "bubble", side: "me", text: head("s3"), lines: 2, at: 9.05, typing: 8.55 },
  { id: "c3", kind: "code", side: "me", text: "* * * * *", at: 9.95 },
  sticker("s3", 600, "me", 10.8),
  { id: "m4", kind: "bubble", side: "them", who: "Server", text: head("s4"), lines: 3, at: 12.4, typing: 11.5, slam: true },
  sticker("s4", 440, "them", 13.3),
];

const shotC: Item[] = [
  { id: "m4c", kind: "bubble", side: "them", who: "Server", text: head("s4"), lines: 3, at: -1 },
  { id: "m5", kind: "bubble", side: "me", text: head("s5"), lines: 3, at: 17.55, typing: 17.12 },
  sticker("s5", 240, "me", 19.0),
];

const fA = Math.round(D * FPS) + TRANS;
const fB = Math.round((E - D) * FPS) + TRANS;
const fC = TOTAL - (fA - TRANS) - (fB - TRANS);

const Video: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={fA} name="chat-night">
        <ChatShot offset={0} items={shotA} brand />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip(1)} timing={linearTiming({ durationInFrames: TRANS })} />
      <TransitionSeries.Sequence durationInFrames={fB} name="chat-morning">
        <ChatShot offset={D} items={shotB} bgTo={BG_PANIC} bgAt={12.4} slamAt={12.4} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip(1)} timing={linearTiming({ durationInFrames: TRANS })} />
      <TransitionSeries.Sequence durationInFrames={fC} name="chat-facepalm">
        <ChatShot offset={E} items={shotC} startBg={BG_PANIC} pad={40} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Music slug={SLUG} total={TOTAL} voiceRanges={[]} level={0.55} />
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Video,
  durationInFrames: TOTAL,
};
