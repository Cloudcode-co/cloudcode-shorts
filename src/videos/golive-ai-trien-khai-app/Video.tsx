import { loadFont } from "@remotion/google-fonts/BarlowCondensed";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, Loop, OffthreadVideo, Sequence, useCurrentFrame } from "remotion";
import {
  BRAND_SPACE,
  Brand,
  FPS,
  Music,
  SAFE,
  Sfx,
  Terminal,
  TikTokGuide,
  TYPE_DELAY,
  Voice,
  beatmap,
  easeOut,
  flash,
  hit,
  mono,
  typingFrames,
  videoAsset,
  whip,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import beats from "./beatmap.json";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const MAP = beatmap(beats);
const cond = loadFont("normal", { weights: ["600", "800"], subsets: ["latin", "vietnamese"] }).fontFamily;

const TRANS = 10;
const LEFT = SAFE.left + 118; // content starts right of the rail
const RIGHT = SAFE.right;
const W = 1080 - LEFT - RIGHT;

// Each rank a step brighter; #1 is gold.
const RANKS: Record<number, { bg: string; accent: string; ink: string }> = {
  6: { bg: "#0E0814", accent: "#8E3FA6", ink: "#FFFFFF" },
  5: { bg: "#160B20", accent: "#9C46B5", ink: "#FFFFFF" },
  4: { bg: "#220F33", accent: "#B94FCE", ink: "#FFFFFF" },
  3: { bg: "#301448", accent: "#D46BF0", ink: "#FFFFFF" },
  2: { bg: "#431A63", accent: "#F28CFF", ink: "#FFFFFF" },
  1: { bg: "#1B1305", accent: "#FFC933", ink: "#FFF6D6" },
};

type Layout = "intro" | "hero" | "words" | "footage" | "terminal" | "checks";
type Scn = {
  id: string;
  rank: number; // 6 = intro, 1..5 countdown
  first?: boolean; // first scene of its rank: the numeral slams in
  layout: Layout;
  cardAt?: "top" | "bottom";
  cardSize?: number;
  footage?: string;
  words?: string[];
};

const SCENES: Scn[] = [
  { id: "s1", rank: 6, layout: "intro" },
  { id: "s2", rank: 5, first: true, layout: "hero", cardAt: "top", cardSize: 230 },
  { id: "s3", rank: 5, layout: "words", words: ["detect", "plan", "approve", "apply", "verify"] },
  { id: "s4", rank: 4, first: true, layout: "footage", footage: "footage/developer-working-late-desk-pixabay-215751.mp4" },
  { id: "s5", rank: 4, layout: "hero", cardAt: "bottom", cardSize: 200 },
  { id: "s6", rank: 3, first: true, layout: "terminal" },
  { id: "s7", rank: 3, layout: "terminal" },
  { id: "s8", rank: 2, first: true, layout: "checks" },
  { id: "s9", rank: 2, layout: "hero", cardAt: "bottom", cardSize: 170 },
  { id: "s10", rank: 2, layout: "footage", footage: "footage/server-room-racks-pixabay-171185.mp4" },
  { id: "s11", rank: 1, first: true, layout: "hero", cardAt: "top", cardSize: 220 },
  { id: "s12", rank: 1, layout: "hero", cardAt: "bottom", cardSize: 190 },
  { id: "s13", rank: 1, layout: "words", words: ["Plan", "Approve", "Apply", "Verify"] },
  { id: "s14", rank: 1, layout: "checks" },
];

const S = Object.fromEntries(script.scenes.map((s) => [s.id, s]));
const LEN = (id: string) => Math.round((timeline.scenes as Record<string, { length: number }>)[id].length * FPS);
const START = (id: string) => Math.round((timeline.scenes as Record<string, { start: number }>)[id].start * FPS);
const TOTAL = SCENES.reduce((n, s) => n + LEN(s.id), 0);

const stars = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ---- small helpers ---------------------------------------------------------

const prog = (f: number, at: number, dur = 12) =>
  interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

// A heavy slam: lands from too big, with a short settle.
const slamStyle = (f: number, at: number, from = 1.5): CSSProperties => {
  const p = prog(f, at, 9);
  return { opacity: p === 0 ? 0 : 1, transform: `scale(${from - (from - 1) * p})`, transformOrigin: "left center" };
};

// ---- stage: background, numeral, rail -------------------------------------

const Rail: React.FC<{ rank: number; accent: string; startFrame: number }> = ({ rank, accent, startFrame }) => {
  const f = useCurrentFrame();
  const pump = hit(MAP.beats, startFrame + f, 9);
  const ys = [0, 1, 2, 3, 4];
  const top = 380;
  const gap = 215;
  return (
    <>
      <div
        style={{ position: "absolute", left: SAFE.left + 28 - 3, top: top + 18, width: 6, height: gap * 4, background: "rgba(255,255,255,0.18)" }}
      />
      {ys.map((k) => {
        const r = 5 - k;
        const reached = rank <= 5 && r >= rank;
        const current = r === rank;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: SAFE.left + 28 - 21,
              top: top + k * gap - 3,
              width: 42,
              height: 42,
              borderRadius: 21,
              background: reached ? accent : "#2a1c36",
              border: `5px solid ${reached ? accent : "rgba(255,255,255,0.35)"}`,
              transform: `scale(${current ? 1.35 + pump * 0.25 : 1})`,
              boxSizing: "border-box",
            }}
          />
        );
      })}
    </>
  );
};

const Stage: React.FC<{ sc: Scn; children: ReactNode; bgNode?: ReactNode }> = ({ sc, children, bgNode }) => {
  const f = useCurrentFrame();
  const start = START(sc.id);
  const c = RANKS[sc.rank];
  const gold = sc.rank === 1;
  const slamAt = 6;
  const pump = hit(MAP.beats, start + f, 10) * 0.03 + hit(MAP.downbeats, start + f, 14) * 0.03;
  // Numeral: slams in bright on the first scene of a rank, then sits as a watermark.
  const slam = sc.first ? prog(f, slamAt, 9) : 1;
  const settle = sc.first ? prog(f, slamAt + 6, 36) : 1;
  const scale = sc.first ? 2.1 - 1.1 * slam : 1;
  const shake = sc.first && f > slamAt && f < slamAt + 14 ? Math.sin(f * 3) * (14 - (f - slamAt)) * 1.4 : 0;
  const numOpacity = sc.first ? (f < slamAt ? 0 : 1 - 0.78 * settle) : 0.22;
  const flashOp = gold && sc.first ? (f < 12 ? 0 : interpolate(f - 12, [0, 14], [0.7, 0], { extrapolateRight: "clamp" })) : 0;
  return (
    <AbsoluteFill style={{ background: c.bg, overflow: "hidden", fontFamily: cond }}>
      {bgNode}
      {sc.rank <= 5 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 330,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 960,
            lineHeight: 1,
            color: c.accent,
            opacity: numOpacity * (gold ? 0.9 : 1),
            transform: `translate(${shake}px, ${shake * 0.4}px) scale(${scale + pump})`,
            letterSpacing: -10,
            whiteSpace: "nowrap",
          }}
        >
          #{sc.rank}
        </div>
      )}
      <Rail rank={sc.rank} accent={c.accent} startFrame={start} />
      {children}
      {flashOp > 0 && <AbsoluteFill style={{ background: "#FFF3C0", opacity: flashOp }} />}
    </AbsoluteFill>
  );
};

const Content: React.FC<{ children: ReactNode; style?: CSSProperties; top?: number }> = ({ children, style, top = SAFE.top }) => (
  <div
    style={{
      position: "absolute",
      left: LEFT,
      width: W,
      top,
      bottom: 1920 - (1920 - SAFE.bottom),
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    {children}
  </div>
);

// ---- text pieces -----------------------------------------------------------

const Headline: React.FC<{ text: string; at?: number; size?: number; color?: string }> = ({ text, at = 4, size = 132, color = "#fff" }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.92,
        color,
        textWrap: "balance",
        ...slamStyle(f, at, 1.25),
      }}
    >
      {text}
    </div>
  );
};

// Lines enter one by one, then the highlight keeps moving down the list.
const Lines: React.FC<{ items: string[]; at: number; accent: string; ink: string; size?: number; stagger?: number; cycle?: number }> = ({
  items,
  at,
  accent,
  ink,
  size = 88,
  stagger = 30,
  cycle = 80,
}) => {
  const f = useCurrentFrame();
  const doneAt = at + items.length * stagger;
  const t = f - doneAt;
  const active = t < 0 ? items.length - 1 : Math.floor(t / cycle) % items.length;
  const since = t < 0 ? 99 : t % cycle;
  const nudge = prog(since, 0, 10);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {items.map((it, i) => {
        const p = prog(f, at + i * stagger, 14);
        const on = t < 0 ? i === Math.min(items.length - 1, Math.floor((f - at) / stagger)) : i === active;
        return (
          <div
            key={i}
            style={{
              fontWeight: 800,
              fontSize: size,
              lineHeight: 0.98,
              color: on ? accent : ink,
              opacity: p * (on ? 1 : 0.62),
              transform: `translateX(${(1 - p) * -70 + (on ? (t < 0 ? 12 : nudge * 14) : 0)}px)`,
              textWrap: "balance",
            }}
          >
            {it}
          </div>
        );
      })}
    </div>
  );
};

const LogoCard: React.FC<{ repo: string; size: number; at: number; accent: string; ink: string; hot?: boolean }> = ({ repo, size, at, accent, ink, hot }) => {
  const f = useCurrentFrame();
  const r = facts.repos.find((x) => x.repo === repo)!;
  const p = prog(f, at, 12);
  const nameFs = Math.min(size * 0.5, (W - 14 - 40 - 26 - size - 12) / (r.name.length * 0.48));
  const star = Math.round(r.stars * prog(f, at + 6, 40));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: 20,
        border: `7px solid ${accent}`,
        background: "rgba(10,5,16,0.78)",
        opacity: p === 0 ? 0 : 1,
        transform: `translateY(${(1 - p) * 90}px) scale(${1.15 - 0.15 * p})`,
        transformOrigin: "left center",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Img src={videoAsset(SLUG, r.avatar)} style={{ width: size, height: size, objectFit: "cover", flex: "none" }} />
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: nameFs, lineHeight: 1, color: ink, whiteSpace: "nowrap" }}>{r.name}</div>
        <div style={{ fontWeight: 800, fontSize: size * 0.42, lineHeight: 1.05, color: accent, fontVariantNumeric: "tabular-nums" }}>
          ★ {stars(star)}
        </div>
        <div style={{ fontWeight: 600, fontSize: 38, lineHeight: 1.2, whiteSpace: "nowrap", color: hot ? ink : "rgba(255,255,255,0.7)" }}>
          {r.language} · {r.license}
        </div>
      </div>
    </div>
  );
};

// ---- layouts ---------------------------------------------------------------

const Intro: React.FC<{ sc: Scn }> = ({ sc }) => {
  const f = useCurrentFrame();
  const c = RANKS[sc.rank];
  const s = S[sc.id];
  return (
    <Stage sc={sc}>
      <Brand />
      <Sfx id="thud" at={6} volume={0.5} />
      <Sfx id="thud" at={26} volume={0.5} />
      <Content top={SAFE.top + BRAND_SPACE + 10} style={{ justifyContent: "flex-start" }}>
        <div style={{ fontWeight: 800, lineHeight: 0.8, color: c.accent, letterSpacing: -4 }}>
          <div style={{ fontSize: 330, ...slamStyle(f, 4, 1.6) }}>TOP</div>
          <div style={{ fontSize: 560, marginTop: 6, ...slamStyle(f, 22, 1.8), color: "#fff" }}>5</div>
        </div>
        <div style={{ marginTop: 30 }}>
          <Headline text={s.headline} at={48} size={116} />
        </div>
        <div style={{ marginTop: 26 }}>
          <Lines items={s.lines} at={92} stagger={84} accent={c.accent} ink={c.ink} size={80} cycle={70} />
        </div>
      </Content>
    </Stage>
  );
};

const Hero: React.FC<{ sc: Scn }> = ({ sc }) => {
  const c = RANKS[sc.rank];
  const s = S[sc.id];
  const repo = s.repos[0];
  const cardTop = sc.cardAt === "top";
  // s2 holds its card for the music's drop.
  const cardAt = sc.id === "s2" ? Math.max(30, Math.round(7.546 * FPS) - START("s2")) : cardTop ? 22 : 70;
  const card = (
    <LogoCard repo={repo} size={sc.cardSize ?? 200} at={cardAt} accent={c.accent} ink={c.ink} hot={sc.rank === 1} />
  );
  const head = <Headline text={s.headline} at={6} size={sc.id === "s12" ? 136 : sc.id === "s11" ? 112 : 124} color={c.ink} />;
  const linesAt = cardTop ? Math.max(50, cardAt + 24) : 40;
  const lines = <Lines items={s.lines} at={linesAt} accent={c.accent} ink={c.ink} size={92} stagger={cardTop ? 34 : 38} />;
  return (
    <Stage sc={sc}>
      <Sfx id="thud" at={6} volume={0.45} />
      <Sfx id="pop" at={cardAt} volume={0.4} />
      {sc.id === "s2" && <Sfx id="thud" at={cardAt} volume={0.7} />}
      {sc.rank === 1 && sc.first && <Sfx id="ding" at={12} volume={0.5} />}
      <Content style={{ justifyContent: "space-between", paddingBottom: 20 }}>
        {cardTop ? (
          <>
            {head}
            {card}
            {lines}
          </>
        ) : (
          <>
            {head}
            {lines}
            {card}
          </>
        )}
      </Content>
    </Stage>
  );
};

const Words: React.FC<{ sc: Scn }> = ({ sc }) => {
  const f = useCurrentFrame();
  const c = RANKS[sc.rank];
  const s = S[sc.id];
  const words = sc.words!;
  const gap = sc.id === "s3" ? 50 : 62;
  const active = Math.min(words.length - 1, Math.max(0, Math.floor((f - 34) / gap)));
  const size = 180;
  return (
    <Stage sc={sc}>
      <Sfx id="thud" at={6} volume={0.4} />
      <Content style={{ justifyContent: "space-between", paddingBottom: 10 }}>
        <Headline text={s.headline} at={6} size={110} color={c.ink} />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {words.map((w, i) => {
            const at = 34 + i * gap;
            const p = prog(f, at, 10);
            const on = f >= at && i === active;
            return (
              <div key={w} style={{ display: "flex", alignItems: "baseline", gap: 28, opacity: p === 0 ? 0 : 1 }}>
                <div style={{ fontWeight: 800, fontSize: 70, color: c.accent, width: 80, fontVariantNumeric: "tabular-nums" }}>{i + 1}</div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: size,
                    lineHeight: 0.95,
                    color: on ? c.accent : c.ink,
                    opacity: f >= at && !on ? 0.7 : 1,
                    transform: `translateX(${(1 - p) * 160}px) scale(${1.12 - 0.12 * p})`,
                    transformOrigin: "left center",
                  }}
                >
                  {w}
                </div>
                {f >= at && <Sfx id="pop" at={at} volume={0.3} />}
              </div>
            );
          })}
        </div>
      </Content>
    </Stage>
  );
};

const FootageShot: React.FC<{ sc: Scn }> = ({ sc }) => {
  const f = useCurrentFrame();
  const c = RANKS[sc.rank];
  const s = S[sc.id];
  const clip = (facts.footage as { file: string; duration: number }[]).find((x) => x.file === sc.footage)!;
  const zoom = 1.04 + (f / LEN(sc.id)) * 0.1;
  const bgNode = (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Loop durationInFrames={Math.floor(clip.duration * FPS)}>
          <OffthreadVideo
            src={videoAsset(SLUG, sc.footage!.replace(/^/, ""))}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%" }}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: c.bg, opacity: 0.58 }} />
    </AbsoluteFill>
  );
  const top = sc.id === "s4";
  return (
    <Stage sc={sc} bgNode={bgNode}>
      <Sfx id="thud" at={6} volume={0.4} />
      <Content style={{ justifyContent: top ? "flex-end" : "space-between", gap: 40, paddingBottom: 20 }}>
        <Headline text={s.headline} at={6} size={150} color={c.ink} />
        <Lines items={s.lines} at={30} accent={c.accent} ink={c.ink} size={sc.id === "s4" ? 92 : 96} stagger={36} cycle={70} />
      </Content>
    </Stage>
  );
};

const TerminalShot: React.FC<{ sc: Scn }> = ({ sc }) => {
  const f = useCurrentFrame();
  const c = RANKS[sc.rank];
  const s = S[sc.id];
  const cmds = s.commands;
  const typingLen = typingFrames(cmds);
  const termAt = sc.id === "s6" ? 60 : 40;
  return (
    <Stage sc={sc}>
      <Sfx id="thud" at={6} volume={0.4} />
      <Sfx id="typing" at={termAt + TYPE_DELAY} frames={typingLen} volume={0.3} />
      <Content style={{ justifyContent: "space-between", paddingBottom: 20 }}>
        <Headline text={s.headline} at={6} size={sc.id === "s6" ? 140 : 132} color={c.ink} />
        <div style={{ opacity: f < termAt ? 0 : 1, transform: `translateY(${(1 - prog(f, termAt, 12)) * 80}px)` }}>
          <Sequence from={termAt} layout="none">
            <Terminal cmds={cmds} width={W} fontSize={36} minHeight={sc.id === "s6" ? 330 : 380} bg="#0c0612" accent={c.accent} />
          </Sequence>
        </div>
        <Lines items={s.lines} at={sc.id === "s6" ? 20 : 24} accent={c.accent} ink={c.ink} size={sc.id === "s6" ? 92 : 92} stagger={sc.id === "s6" ? 80 : 90} cycle={70} />
      </Content>
    </Stage>
  );
};

const Check: React.FC<{ color: string; p: number }> = ({ color, p }) => (
  <svg width="86" height="86" viewBox="0 0 86 86" style={{ flex: "none" }}>
    <path d="M10 46 L34 70 L76 16" fill="none" stroke={color} strokeWidth="14" strokeLinecap="butt" strokeDasharray="120" strokeDashoffset={120 * (1 - p)} />
  </svg>
);

const Checks: React.FC<{ sc: Scn }> = ({ sc }) => {
  const f = useCurrentFrame();
  const c = RANKS[sc.rank];
  const s = S[sc.id];
  const stagger = sc.id === "s14" ? 96 : 84;
  const at0 = 36;
  const t = f - (at0 + s.lines.length * stagger);
  const active = t < 0 ? -1 : Math.floor(t / 70) % s.lines.length;
  return (
    <Stage sc={sc}>
      <Sfx id="thud" at={6} volume={0.4} />
      <Content style={{ justifyContent: "space-between", paddingBottom: 10 }}>
        <Headline text={s.headline} at={6} size={sc.id === "s14" ? 170 : 150} color={c.ink} />
        <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
          {s.lines.map((l, i) => {
            const at = at0 + i * stagger;
            const p = prog(f, at, 14);
            const on = i === active || (t < 0 && f >= at && f < at + stagger);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, opacity: p === 0 ? 0 : 1, transform: `translateX(${(1 - p) * 120}px)` }}>
                <Check color={c.accent} p={prog(f, at + 6, 16)} />
                <div style={{ fontWeight: 800, fontSize: 120, lineHeight: 0.96, color: on ? c.accent : c.ink, textWrap: "balance" }}>{l}</div>
                {f >= at && <Sfx id="pop" at={at} volume={0.3} />}
              </div>
            );
          })}
        </div>
      </Content>
    </Stage>
  );
};

const SceneView: React.FC<{ sc: Scn }> = ({ sc }) => {
  switch (sc.layout) {
    case "intro":
      return <Intro sc={sc} />;
    case "hero":
      return <Hero sc={sc} />;
    case "words":
      return <Words sc={sc} />;
    case "footage":
      return <FootageShot sc={sc} />;
    case "terminal":
      return <TerminalShot sc={sc} />;
    case "checks":
      return <Checks sc={sc} />;
  }
};

// ---- video -----------------------------------------------------------------

const voiceRanges: [number, number][] = SCENES.map((s) => {
  const a = START(s.id);
  return [a, a + Math.round((durations as Record<string, number>)[s.id] * FPS)];
});

const presentationFor = (a: Scn, b: Scn) => {
  if (a.rank === b.rank) return fade();
  if (b.rank === 1) return flash("#FFE08A");
  return b.rank % 2 === 0 ? zoomPunch() : whip(1);
};

const Main: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
    <TransitionSeries>
      {SCENES.flatMap((sc, i) => {
        const last = i === SCENES.length - 1;
        const out = [
          <TransitionSeries.Sequence key={sc.id} durationInFrames={LEN(sc.id) + (last ? 0 : TRANS)}>
            <SceneView sc={sc} />
            <Voice slug={SLUG} id={sc.id} />
            {i > 0 && SCENES[i - 1].rank !== sc.rank && <Sfx id="whoosh" at={0} volume={0.3} />}
          </TransitionSeries.Sequence>,
        ];
        if (!last) {
          out.push(
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={presentationFor(sc, SCENES[i + 1]) as never}
              timing={linearTiming({ durationInFrames: TRANS })}
            />,
          );
        }
        return out;
      })}
    </TransitionSeries>
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Main, durationInFrames: TOTAL };
void mono;
