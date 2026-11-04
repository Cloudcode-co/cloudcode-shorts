import { loadFont } from "@remotion/google-fonts/BarlowCondensed";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  interpolateColors,
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
  easeOut,
  flash,
  sans,
  typingFrames,
  videoAsset,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const cond = loadFont("normal", { weights: ["700", "800"], subsets: ["latin", "vietnamese"] }).fontFamily;

type Scene = (typeof script.scenes)[number];
type Repo = (typeof facts.repos)[number];
const T = 12; // transition frames
const f = (s: number) => Math.round(s * FPS);
const START = (id: string) => f(timeline.scenes[id as "s1"].start);
const DUR = (id: string) => durations[id as "s1"];
const TOTAL = f(timeline.total);
const B1 = START("s2");
const B2 = START("s7");
const repoOf = (s: Scene) => facts.repos.find((r) => r.repo === s.repos[0]) as Repo;
const scene = (id: string) => script.scenes.find((s) => s.id === id) as Scene;

// Rank palette: each step brighter, #1 gold.
const RANKS = [
  { id: "s2", rank: 5, bg: "#0A0F1E", accent: "#5B8CFF", card: "#131C36" },
  { id: "s3", rank: 4, bg: "#0B1B24", accent: "#22D3C5", card: "#12303C" },
  { id: "s4", rank: 3, bg: "#1A1236", accent: "#B47BFF", card: "#2A1D55" },
  { id: "s5", rank: 2, bg: "#2E1210", accent: "#FF6A3D", card: "#4A1D18" },
  { id: "s6", rank: 1, bg: "#3A2A04", accent: "#FFC81E", card: "#54400A" },
];
const GOLD = "#FFC81E";

const nf = (n: number) => n.toLocaleString("en-US");

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const prog = (frame: number, from: number, dur: number) =>
  interpolate(frame, [from, from + dur], [0, 1], { ...clamp, easing: easeOut });

// ---------- shared pieces ----------

const Avatar: React.FC<{ repo: Repo; size: number; radius?: number; border?: string }> = ({
  repo,
  size,
  radius = 28,
  border,
}) => (
  <Img
    src={videoAsset(SLUG, repo.avatar)}
    style={{
      width: size,
      height: size,
      borderRadius: radius,
      objectFit: "cover",
      border,
      boxSizing: "border-box",
      flexShrink: 0,
    }}
  />
);

const Underline: React.FC<{ color: string; p: number; width: number }> = ({ color, p, width }) => (
  <div style={{ height: 6, width: width * p, background: color, marginTop: 6, borderRadius: 3 }} />
);

// ---------- Shot 1: intro ----------

const IntroShot: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = DUR("s1") * FPS;
  const slam = interpolate(frame, [0, 10], [1.5, 1], { ...clamp, easing: easeOut });
  const shake = Math.sin(frame * 2.1) * interpolate(frame, [0, 14], [10, 0], clamp);
  const order = [4, 3, 2, 1, 0]; // five logos, #5 first
  const lines = scene("s1").lines;
  return (
    <AbsoluteFill style={{ background: "#0A0F1E", overflow: "hidden", fontFamily: sans }}>
      <OffthreadVideo
        src={videoAsset(SLUG, "footage/developer-working-on-computer-pixabay-3145.mp4")}
        muted
        trimBefore={90}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "40% 50%" }}
      />
      <AbsoluteFill style={{ background: "rgba(7,10,22,0.8)" }} />
      <Brand />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: SAFE.top + BRAND_SPACE + 10,
          width: CONTENT_W + 90,
        }}
      >
        <div
          style={{
            fontFamily: cond,
            fontWeight: 800,
            lineHeight: 0.82,
            transform: `translateX(${shake}px) scale(${slam})`,
            transformOrigin: "left center",
            opacity: Math.min(1, frame / 3),
            display: "flex",
            alignItems: "baseline",
            gap: 24,
          }}
        >
          <span style={{ fontSize: 300, color: "#FFFFFF" }}>TOP</span>
          <span style={{ fontSize: 640, color: RANKS[0].accent }}>5</span>
        </div>
        <div
          style={{
            fontFamily: cond,
            fontWeight: 800,
            fontSize: 112,
            lineHeight: 1.08,
            color: "#FFFFFF",
            marginTop: 20,
            opacity: prog(frame, 14, 16),
            transform: `translateY(${(1 - prog(frame, 14, 16)) * 30}px)`,
          }}
        >
          SANDBOX AI AGENT
          <br />
          <span style={{ color: RANKS[1].accent }}>TRÊN LINUX</span>
        </div>
        <div style={{ marginTop: 40 }}>
          {lines.map((l, i) => {
            const p = prog(frame, dur * (0.3 + i * 0.22), 16);
            return (
              <div
                key={l}
                style={{
                  fontWeight: 700,
                  fontSize: 46,
                  color: "#E8ECF8",
                  marginBottom: 14,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -40}px)`,
                }}
              >
                {l}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 36 }}>
          {order.map((ri, k) => {
            const p = prog(frame, 40 + k * 14, 14);
            const r = RANKS[k];
            return (
              <div key={r.id} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
                <Avatar repo={repoOf(scene(r.id))} size={118} radius={26} border={`5px solid ${r.accent}`} />
              </div>
            );
          })}
        </div>
      </div>
      <Sfx id="thud" volume={0.5} />
      {order.map((_, k) => (
        <Sfx key={k} id="pop" at={40 + k * 14} volume={0.2} />
      ))}
    </AbsoluteFill>
  );
};

// ---------- Shot 2: the countdown ----------

const RAIL_X = SAFE.left + 40;
const CONTENT_X = RAIL_X + 100;
const COL_W = 1080 - SAFE.right - CONTENT_X;
const RAIL_TOP = SAFE.top + 70;
const RAIL_STEP = 232;

const localStart = (id: string) => START(id) - B1;

const Rail: React.FC<{ frame: number }> = ({ frame }) => {
  const idx = RANKS.reduce((acc, r, i) => (frame >= localStart(r.id) ? i : acc), 0);
  const since = frame - localStart(RANKS[idx].id);
  const prev = Math.max(0, idx - 1);
  const lineEnd = prev + (idx - prev) * prog(since, 0, 18);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: RAIL_X - 3,
          top: RAIL_TOP,
          width: 6,
          height: RAIL_STEP * 4,
          background: "rgba(255,255,255,0.16)",
          borderRadius: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: RAIL_X - 3,
          top: RAIL_TOP,
          width: 6,
          height: RAIL_STEP * lineEnd,
          background: RANKS[idx].accent,
          borderRadius: 3,
        }}
      />
      {RANKS.map((r, i) => {
        const reached = i <= idx;
        const active = i === idx;
        const pop = active ? interpolate(since, [0, 6, 18], [0.6, 1.25, 1], { ...clamp, easing: easeOut }) : 1;
        return (
          <div
            key={r.id}
            style={{
              position: "absolute",
              left: RAIL_X - 34,
              top: RAIL_TOP + i * RAIL_STEP - 34,
              width: 68,
              height: 68,
              borderRadius: 34,
              boxSizing: "border-box",
              background: reached ? r.accent : RANKS[idx].bg,
              border: `5px solid ${reached ? r.accent : "rgba(255,255,255,0.3)"}`,
              color: reached ? "#0B0B10" : "rgba(255,255,255,0.55)",
              fontFamily: cond,
              fontWeight: 800,
              fontSize: 44,
              lineHeight: "58px",
              textAlign: "center",
              transform: `scale(${pop})`,
            }}
          >
            {r.rank}
          </div>
        );
      })}
    </>
  );
};

const RankScene: React.FC<{ spec: (typeof RANKS)[number]; id: string }> = ({ spec, id }) => {
  const frame = useCurrentFrame();
  const s = scene(id);
  const repo = repoOf(s);
  const gold = spec.rank === 1;
  const tagline = s.headline.split(": ")[1] ?? s.headline;
  const hasCmd = s.commands.length > 0;

  // numeral: slams in big, then settles into a watermark
  const slamScale = interpolate(frame, [0, 9], [1.8, 1], { ...clamp, easing: easeOut });
  const shake = Math.sin(frame * 2.4) * interpolate(frame, [0, 16], [14, 0], clamp);
  const solid = interpolate(frame, [0, 3, 22, 44], [0, 1, 1, 0.16 + (5 - spec.rank) * 0.035], clamp);
  const outline = interpolate(frame, [18, 44], [0, 0.85], clamp);
  const numeralStyle = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    fontFamily: cond,
    fontWeight: 800,
    fontSize: hasCmd ? 470 : 640,
    lineHeight: 0.8,
    whiteSpace: "nowrap" as const,
    transform: `translateX(${shake}px) scale(${slamScale})`,
    transformOrigin: "left center",
  };

  const cardP = prog(frame, 8, 16);
  const stars = Math.round(interpolate(frame, [14, 44], [0, repo.stars], { ...clamp, easing: easeOut }));
  const nameSize = Math.min(hasCmd ? 88 : 112, 410 / (repo.name.length * 0.53));
  const tagP = prog(frame, 22, 16);

  const lineAt = (i: number) => 34 + i * 18;
  const cmdAt = 70;
  const shownLines = hasCmd ? s.lines.slice(0, 2) : s.lines;

  return (
    <AbsoluteFill>
      {/* numeral */}
      <div style={{ position: "absolute", left: CONTENT_X - 10, top: SAFE.top - 20, width: COL_W, height: 520 }}>
        <div style={{ ...numeralStyle, color: spec.accent, opacity: solid }}>#{spec.rank}</div>
        <div
          style={{
            ...numeralStyle,
            color: "transparent",
            WebkitTextStroke: `7px ${spec.accent}`,
            opacity: outline,
          }}
        >
          #{spec.rank}
        </div>
      </div>

      {/* tagline + lines / terminal */}
      <div
        style={{
          position: "absolute",
          left: CONTENT_X,
          top: SAFE.top + (hasCmd ? 200 : 290),
          width: COL_W,
        }}
      >
      <div
          style={{
            width: COL_W,
            marginBottom: 22,
            boxSizing: "border-box",
            padding: hasCmd ? 20 : 28,
            display: "flex",
            alignItems: "center",
            gap: 28,
            background: spec.card,
            borderRadius: 30,
            border: gold ? `6px solid ${GOLD}` : `3px solid ${spec.accent}66`,
            opacity: cardP,
            transform: `translateX(${(1 - cardP) * 90}px)`,
          }}
        >
          <Avatar repo={repo} size={hasCmd ? 140 : 170} radius={26} border={`5px solid ${spec.accent}`} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: cond,
                fontWeight: 800,
                fontSize: nameSize,
                lineHeight: 1,
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              {repo.name}
            </div>
            <div
              style={{
                fontFamily: cond,
                fontWeight: 700,
                fontSize: 76,
                lineHeight: 1.05,
                marginTop: 8,
                color: spec.accent,
              }}
            >
              ★ {nf(stars)}
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: cond,
            fontWeight: 800,
            fontSize: hasCmd ? 68 : 78,
            lineHeight: 1,
            color: "#FFFFFF",
            textWrap: "balance",
            opacity: tagP,
            transform: `translateY(${(1 - tagP) * 26}px)`,
          }}
        >
          {tagline}
          <Underline color={spec.accent} p={tagP} width={Math.min(COL_W, tagline.length * 28)} />
        </div>
        <div style={{ marginTop: hasCmd ? 14 : 30 }}>
          {shownLines.map((l, i) => {
            const p = prog(frame, lineAt(i), 16);
            return (
              <div
                key={l}
                style={{
                  display: "flex",
                  gap: 16,
                  fontSize: hasCmd ? 36 : 44,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: "#EEF1FA",
                  marginBottom: hasCmd ? 8 : 24,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -36}px)`,
                }}
              >
                <span style={{ color: spec.accent, fontFamily: cond, fontWeight: 800 }}>/</span>
                <span style={{ textWrap: "balance" }}>{l}</span>
              </div>
            );
          })}
        </div>
        {hasCmd && (
          <Sequence from={cmdAt} layout="none">
            <div style={{ marginTop: 14 }}>
              <Terminal
                cmds={s.commands}
                width={COL_W}
                fontSize={34}
                minHeight={150}
                bg="#0B0B10"
                accent={spec.accent}
              />
            </div>
            <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(s.commands)} volume={0.2} />
          </Sequence>
        )}
      </div>

      <Sfx id="thud" volume={gold ? 0.7 : 0.5} />
      <Sfx id="pop" at={10} volume={0.25} />
      {gold && <Sfx id="ding" at={6} volume={0.35} />}
    </AbsoluteFill>
  );
};

const CountdownShot: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = RANKS.reduce((acc, r, i) => (frame >= localStart(r.id) ? i : acc), 0);
  const start = localStart(RANKS[idx].id);
  const prevBg = RANKS[Math.max(0, idx - 1)].bg;
  const bg = idx === 0 ? RANKS[0].bg : interpolateColors(frame, [start, start + 10], [prevBg, RANKS[idx].bg]);
  const goldAt = localStart("s6");
  const flashOp = interpolate(frame, [goldAt, goldAt + 3, goldAt + 20], [0, 0.95, 0], clamp);
  return (
    <AbsoluteFill style={{ background: bg, fontFamily: sans }}>
      {/* rising energy: a bright slab on the right edge grows with each rank */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 28 + idx * 22,
          background: RANKS[idx].accent,
          opacity: 0.9,
        }}
      />
      <Rail frame={frame} />
      {RANKS.map((r, i) => {
        const from = localStart(r.id);
        const to = i === RANKS.length - 1 ? 99999 : localStart(RANKS[i + 1].id);
        return (
          <Sequence key={r.id} from={from} durationInFrames={to - from} name={`#${r.rank}`}>
            <RankScene spec={r} id={r.id} />
          </Sequence>
        );
      })}
      {flashOp > 0 && <AbsoluteFill style={{ background: "#FFF3C4", opacity: flashOp }} />}
    </AbsoluteFill>
  );
};

// ---------- Shot 3: outro ----------

const OutroShot: React.FC = () => {
  const frame = useCurrentFrame();
  const s = scene("s7");
  const ranked = [...RANKS].reverse();
  const q1 = prog(frame, 6, 16);
  return (
    <AbsoluteFill style={{ background: "#3A2A04", fontFamily: sans }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, background: GOLD }} />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: SAFE.top,
          width: CONTENT_W,
        }}
      >
        <div
          style={{
            fontFamily: cond,
            fontWeight: 800,
            fontSize: 136,
            lineHeight: 1.1,
            color: "#FFFFFF",
            opacity: q1,
            transform: `translateY(${(1 - q1) * 40}px)`,
          }}
        >
          BẠN SẼ CHỌN
          <br />
          <span style={{ color: GOLD }}>CÔNG CỤ NÀO?</span>
        </div>
        <div style={{ marginTop: 44 }}>
          {ranked.map((r, i) => {
            const repo = repoOf(scene(r.id));
            const p = prog(frame, 22 + i * 9, 14);
            return (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  marginBottom: 24,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 60}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: cond,
                    fontWeight: 800,
                    fontSize: 72,
                    width: 90,
                    color: r.accent,
                    lineHeight: 1,
                  }}
                >
                  #{r.rank}
                </div>
                <Avatar repo={repo} size={80} radius={18} border={`4px solid ${r.accent}`} />
                <div
                  style={{
                    fontFamily: cond,
                    fontWeight: 800,
                    fontSize: 64,
                    color: "#FFFFFF",
                    lineHeight: 1,
                    flex: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {repo.name}
                </div>
                <div style={{ fontFamily: cond, fontWeight: 700, fontSize: 42, color: r.accent, whiteSpace: "nowrap" }}>
                  ★ {nf(repo.stars)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 34 }}>
          {s.lines.map((l, i) => {
            const p = prog(frame, 70 + i * 18, 16);
            return (
              <div
                key={l}
                style={{
                  fontSize: 46,
                  fontWeight: 700,
                  color: "#FFF3C4",
                  marginBottom: 12,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 20}px)`,
                }}
              >
                {l}
                <Underline color={GOLD} p={p} width={Math.min(CONTENT_W, l.length * 24)} />
              </div>
            );
          })}
        </div>
      </div>
      <Sfx id="pop" at={20} volume={0.25} />
      <Sfx id="ding" at={70} volume={0.3} />
    </AbsoluteFill>
  );
};

// ---------- assemble ----------

const VOICE_RANGES: [number, number][] = script.scenes.map((s) => [
  START(s.id),
  START(s.id) + Math.round(DUR(s.id) * FPS),
]);

const Top5: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: "#0A0F1E" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={B1 + T} name="Intro">
        <IntroShot />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomPunch()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={B2 - B1 + T} name="Countdown">
        <CountdownShot />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={flash("#FFE9A0")} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence durationInFrames={TOTAL - B2} name="Outro">
        <OutroShot />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    {script.scenes.map((s) => (
      <Sequence key={s.id} from={START(s.id)} layout="none" name={`voice ${s.id}`}>
        <Voice slug={SLUG} id={s.id} />
      </Sequence>
    ))}
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Top5,
  durationInFrames: TOTAL,
};
