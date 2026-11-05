import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Loop,
  OffthreadVideo,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  BRAND_SPACE,
  Brand,
  CONTENT_W,
  FPS,
  Music,
  SAFE,
  Sfx,
  Terminal,
  TikTokGuide,
  TYPE_DELAY,
  Voice,
  display,
  easeOut,
  sans,
  typingFrames,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = "subnetdesk-lan-remote-desktop";
const NAVY = "#0A1A3A";
const DEEP = "#050E24";
const RED = "#E8283A";
const WHITE = "#FFFFFF";
const T = 12; // wipe length

type SceneId = keyof typeof durations;
const scene = (id: string) => script.scenes.find((s) => s.id === id)!;
const startF = (id: string) => Math.round(timeline.scenes[id as SceneId].start * FPS);
const durF = (id: string) => Math.round(durations[id as SceneId] * FPS);
const repo = (name: string) => facts.repos.find((r) => r.repo === name)!;
const stars = (n: number) => n.toLocaleString("en-US");

const SHOTS = [
  { first: "s1", footage: "footage/developer-at-desk-night-pixabay-232538.mp4", clip: 12 },
  { first: "s3", footage: "footage/home-network-router-cables-pixabay-14900.mp4", clip: 24 },
  { first: "s6", footage: "footage/cyber-security-lock-digital-pixabay-318322.mp4", clip: 8 },
  { first: "s10", footage: "footage/server-room-datacenter-lights-pixabay-171185.mp4", clip: 21 },
];
const TOTAL = Math.round(timeline.total * FPS);
const BASE = SHOTS.map((s, i) => (i + 1 < SHOTS.length ? startF(SHOTS[i + 1].first) : TOTAL) - startF(s.first));

const Backdrop: React.FC<{ file: string; clip: number; len: number; pos?: string }> = ({ file, clip, len, pos = "50% 50%" }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, len], [1.04, 1.18], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: DEEP, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <Loop durationInFrames={Math.floor(clip * FPS) - 4}>
          <OffthreadVideo
            src={videoAsset(SLUG, file)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(5,14,36,0.62)" }} />
    </AbsoluteFill>
  );
};

// A beat lives from `from` to `to` (local frames) in the same slot.
const Beat: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    <BeatInner len={to - from}>{children}</BeatInner>
  </Sequence>
);
const BeatInner: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [len - 10, len], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, opacity: out, display: "flex", flexDirection: "column", gap: 18 }}>
      {children}
    </div>
  );
};

const Headline: React.FC<{ text: string; size?: number; delay?: number }> = ({ text, size = 84, delay = 0 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        color: WHITE,
        textWrap: "balance",
        opacity: p,
        transform: `translateX(${(1 - p) * -60}px)`,
        textShadow: "0 3px 18px rgba(0,0,0,0.45)",
      }}
    >
      {text}
    </div>
  );
};

// Lower-third fact: navy panel, red rule on the left.
const Fact: React.FC<{ text: string; delay: number; size?: number }> = ({ text, delay, size = 40 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <div
      style={{
        display: "flex",
        opacity: p,
        transform: `translateX(${(1 - p) * -80}px)`,
        background: NAVY,
        borderLeft: `10px solid ${RED}`,
        padding: "14px 24px",
        fontFamily: sans,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.18,
        color: WHITE,
        alignSelf: "flex-start",
        maxWidth: CONTENT_W,
        boxSizing: "border-box",
      }}
    >
      {text}
    </div>
  );
};

const Facts: React.FC<{ id: string; size?: number; skip?: number }> = ({ id, size, skip = 0 }) => {
  const lines = scene(id).lines.slice(skip);
  const step = Math.round((durF(id) * 0.62) / lines.length);
  return (
    <>
      {lines.map((l, i) => (
        <Fact key={l} text={l} delay={26 + i * step} size={size} />
      ))}
    </>
  );
};

const Star: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" style={{ marginRight: 10, flex: "none" }}>
    <polygon points="12,2 15,9 22,9.5 16.5,14 18.5,21.5 12,17.5 5.5,21.5 7.5,14 2,9.5 9,9" fill={RED} />
  </svg>
);

// Story card: logo, name, real star count counting up.
const StoryCard: React.FC<{ name: string; delay?: number; size?: number }> = ({ name, delay = 0, size = 140 }) => {
  const f = useCurrentFrame();
  const r = repo(name);
  const p = interpolate(f, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const c = interpolate(f, [delay + 6, delay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        background: WHITE,
        borderBottom: `8px solid ${RED}`,
        padding: 16,
        width: CONTENT_W,
        boxSizing: "border-box",
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      <Img src={videoAsset(SLUG, r.avatar)} style={{ width: size, height: size, borderRadius: 18, background: NAVY, flex: "none" }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 68, lineHeight: 1, color: NAVY }}>{r.name}</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 10, fontFamily: sans, fontWeight: 700, fontSize: 40, color: NAVY, fontVariantNumeric: "tabular-nums" }}>
          <Star />
          {stars(Math.round(r.stars * c))} sao GitHub
        </div>
      </div>
    </div>
  );
};

const Counter: React.FC<{ n: number; tag: string; top: number }> = ({ n, tag, top }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  return (
    <div style={{ position: "absolute", left: 0, top, opacity: p, transform: `translateX(${(1 - p) * -100}px)`, display: "flex", alignItems: "baseline", gap: 24 }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 165, lineHeight: 1, color: WHITE, fontVariantNumeric: "tabular-nums" }}>
        {n}
        <span style={{ color: RED }}>/3</span>
      </div>
      <div style={{ fontFamily: display, fontWeight: 600, fontSize: 52, color: WHITE }}>{tag}</div>
    </div>
  );
};

const Ticker: React.FC<{ items: string[] }> = ({ items }) => {
  const f = useCurrentFrame();
  const text = [...items, ...items, ...items, ...items];
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: CONTENT_W,
        bottom: SAFE.bottom + 6,
        height: 76,
        background: NAVY,
        borderTop: `5px solid ${RED}`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ flex: "none", padding: "0 18px", fontFamily: display, fontWeight: 800, fontSize: 36, color: RED, background: DEEP, height: "100%", display: "flex", alignItems: "center", position: "relative", zIndex: 2 }}>
        Tin nóng
      </div>
      <div style={{ flex: 1, overflow: "hidden", height: "100%", position: "relative" }}>
        <div style={{ position: "absolute", whiteSpace: "nowrap", top: 0, height: "100%", display: "flex", alignItems: "center", fontFamily: sans, fontWeight: 700, fontSize: 36, color: WHITE, transform: `translateX(${-f * 3.2}px)` }}>
          {text.map((t, i) => (
            <React.Fragment key={i}>
              <span>{t}</span>
              <span style={{ display: "inline-block", width: 14, height: 14, background: RED, margin: "0 28px" }} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// Voices + frame layout shared by all shots.
const Frame: React.FC<{
  shot: number;
  children: React.ReactNode;
  counter?: { n: number; tag: string };
  ticker: string[];
  brand?: boolean;
  voices: string[];
}> = ({ shot, children, counter, ticker, brand, voices }) => {
  const s = SHOTS[shot];
  const base = startF(s.first);
  const len = BASE[shot] + (shot + 1 < SHOTS.length ? T : 0);
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Backdrop file={s.footage} clip={s.clip} len={len} pos={shot === 3 ? "50% 35%" : "50% 50%"} />
      {voices.map((id) => (
        <Sequence key={id} from={startF(id) - base} layout="none">
          <Voice slug={SLUG} id={id} />
        </Sequence>
      ))}
      <Sfx id="whoosh" at={0} volume={0.3} />
      {brand && <Brand />}
      <AbsoluteFill
        style={{
          padding: `${SAFE.top + (brand ? BRAND_SPACE : 0)}px ${SAFE.right}px ${SAFE.bottom + 6 + 76 + 40}px ${SAFE.left}px`,
        }}
      >
        <div style={{ position: "relative", width: CONTENT_W, height: "100%" }}>
          {counter && <Counter n={counter.n} tag={counter.tag} top={0} />}
          {children}
        </div>
      </AbsoluteFill>
      <Ticker items={ticker} />
    </AbsoluteFill>
  );
};

const local = (shot: number, id: string) => startF(id) - startF(SHOTS[shot].first);
const slot = (shot: number, id: string, endId?: string) => {
  const from = local(shot, id);
  const to = endId ? local(shot, endId) : BASE[shot] + (shot + 1 < SHOTS.length ? T : 0);
  return { from, to: to + (endId ? 4 : 0) };
};

// The card slot, directly under the counter.
const CardSlot: React.FC<{ from: number; to: number; name: string }> = ({ from, to, name }) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    <div style={{ position: "absolute", left: 0, top: 205 }}>
      <StoryCard name={name} />
    </div>
    <Sfx id="pop" at={2} volume={0.3} />
  </Sequence>
);

// ---------------------------------------------------------------- shot 1
const ShotProblem: React.FC = () => {
  const a = slot(0, "s1", "s2");
  const b = slot(0, "s2");
  return (
    <Frame
      shot={0}
      brand
      counter={{ n: 1, tag: "Vấn đề" }}
      voices={["s1", "s2"]}
      ticker={[scene("s1").headline, ...scene("s2").lines]}
    >
      <Beat from={a.from} to={a.to}>
        <Headline text={scene("s1").headline} size={112} delay={4} />
        <Facts id="s1" size={44} />
      </Beat>
      <CardSlot from={b.from} to={b.to} name="rustdesk/rustdesk" />
      <Beat from={b.from} to={b.to}>
        <Headline text={scene("s2").headline} size={76} delay={4} />
        <Facts id="s2" size={36} />
      </Beat>
    </Frame>
  );
};

// ---------------------------------------------------------------- shot 2
const Direct: React.FC = () => {
  const f = useCurrentFrame();
  const line = interpolate(f, [18, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const strike = interpolate(f, [40, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const node = (x: number, label: string) => (
    <g>
      <rect x={x} y={70} width={170} height={110} rx={14} fill={NAVY} stroke={WHITE} strokeWidth={5} />
      <text x={x + 85} y={140} textAnchor="middle" fontFamily={display} fontWeight={800} fontSize={44} fill={WHITE}>
        {label}
      </text>
    </g>
  );
  return (
    <svg width={CONTENT_W} height={160} viewBox={`0 25 ${CONTENT_W} 160`} style={{ display: "block" }}>
      {node(0, "Máy 1")}
      {node(CONTENT_W - 170, "Máy 2")}
      <line x1={170} y1={125} x2={170 + (CONTENT_W - 340) * line} y2={125} stroke={RED} strokeWidth={10} strokeLinecap="round" />
      <text x={CONTENT_W / 2} y={50} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={40} fill={WHITE} opacity={0.9}>
        Relay server
      </text>
      <line x1={CONTENT_W / 2 - 120} y1={38} x2={CONTENT_W / 2 - 120 + 240 * strike} y2={38} stroke={RED} strokeWidth={8} />
    </svg>
  );
};

const Scan: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={CONTENT_W} height={200} viewBox={`0 30 ${CONTENT_W} 200`} style={{ display: "block" }}>
      {[0, 1, 2].map((i) => {
        const t = ((f + i * 30) % 90) / 90;
        return <circle key={i} cx={CONTENT_W / 2} cy={130} r={20 + t * 110} fill="none" stroke={WHITE} strokeWidth={5} opacity={1 - t} />;
      })}
      <circle cx={CONTENT_W / 2} cy={130} r={22} fill={RED} />
    </svg>
  );
};

const ShotSolution: React.FC = () => {
  const a = slot(1, "s3", "s4");
  const b = slot(1, "s4", "s5");
  const c = slot(1, "s5");
  const all = { from: a.from, to: c.to };
  return (
    <Frame
      shot={1}
      counter={{ n: 2, tag: "Giải pháp" }}
      voices={["s3", "s4", "s5"]}
      ticker={[scene("s3").headline, scene("s4").headline, scene("s5").headline]}
    >
      <CardSlot from={all.from} to={all.to} name="zibo-chen/SubnetDesk" />
      <Beat from={a.from} to={a.to}>
        <Headline text={scene("s3").headline} size={96} delay={4} />
        <Facts id="s3" size={44} />
      </Beat>
      <Beat from={b.from} to={b.to}>
        <Direct />
        <Headline text={scene("s4").headline} size={72} delay={4} />
        <Facts id="s4" size={38} />
      </Beat>
      <Beat from={c.from} to={c.to}>
        <Scan />
        <Headline text={scene("s5").headline} size={80} delay={4} />
        <Facts id="s5" size={38} />
      </Beat>
    </Frame>
  );
};

// ---------------------------------------------------------------- shot 3
const ShotDetails: React.FC = () => {
  const a = slot(2, "s6", "s7");
  const b = slot(2, "s7", "s8");
  const c = slot(2, "s8", "s9");
  const d = slot(2, "s9");
  const cmds = scene("s9").commands;
  return (
    <Frame
      shot={2}
      counter={{ n: 3, tag: "Chi tiết" }}
      voices={["s6", "s7", "s8", "s9"]}
      ticker={[scene("s6").headline, scene("s7").headline, scene("s8").headline, scene("s9").headline]}
    >
      <CardSlot from={a.from} to={d.to} name="zibo-chen/SubnetDesk" />
      <Beat from={a.from} to={a.to}>
        <Headline text={scene("s6").headline} size={88} delay={4} />
        <Facts id="s6" size={40} />
      </Beat>
      <Beat from={b.from} to={b.to}>
        <Headline text={scene("s7").headline} size={88} delay={4} />
        <Facts id="s7" size={40} />
      </Beat>
      <Beat from={c.from} to={c.to}>
        <Headline text={scene("s8").headline} size={88} delay={4} />
        <Facts id="s8" size={38} />
      </Beat>
      <Beat from={d.from} to={d.to}>
        <Headline text={scene("s9").headline} size={88} delay={4} />
        <Terminal cmds={cmds} width={CONTENT_W} fontSize={34} minHeight={380} bg={DEEP} fg={WHITE} accent={RED} />
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(cmds)} volume={0.2} />
      </Beat>
    </Frame>
  );
};

// ---------------------------------------------------------------- shot 4
const ShotOutro: React.FC = () => (
  <Frame shot={3} voices={["s10"]} ticker={[...scene("s10").lines]}>
    <Beat from={0} to={BASE[3] + 60}>
      <Headline text={scene("s10").headline} size={110} delay={6} />
      <Facts id="s10" size={44} />
    </Beat>
  </Frame>
);

const Main: React.FC<VideoProps> = ({ guide }) => {
  const parts = [ShotProblem, ShotSolution, ShotDetails, ShotOutro];
  const ranges: [number, number][] = script.scenes.map((s) => [startF(s.id), startF(s.id) + durF(s.id)]);
  return (
    <AbsoluteFill style={{ background: DEEP }}>
      <TransitionSeries>
        {parts.map((P, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={BASE[i] + (i + 1 < parts.length ? T : 0)}>
              <P />
            </TransitionSeries.Sequence>
            {i + 1 < parts.length && (
              <TransitionSeries.Transition
                presentation={wipe({ direction: i % 2 === 0 ? "from-left" : "from-right" })}
                timing={linearTiming({ durationInFrames: T })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Music slug={SLUG} total={TOTAL} voiceRanges={ranges} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Main,
  durationInFrames: TOTAL,
};
