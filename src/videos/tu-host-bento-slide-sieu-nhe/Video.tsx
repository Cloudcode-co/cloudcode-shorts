import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, Img, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  BRAND_SPACE,
  Brand,
  FPS,
  Music,
  SAFE,
  Sfx,
  Voice,
  display,
  easeOut,
  mono,
  sans,
  videoAsset,
  whip,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";

const SLUG = script.slug;
const ACC = "#A488F2"; // Bento's logo purple, lifted for contrast on dark
const BG = "#0e0c14";
const PANEL = "#16131f";
const LINE = "#2b2639";
const FG = "#ECE8F8";
const DIM = "#8a83a1";
const GREEN = "#4ADE80";
const T = 10; // transition frames
const F = (s: number) => Math.round(s * FPS);
const ST = script.scenes.reduce<Record<string, number>>((m, s, i) => {
  const starts = [0, 4.87, 9.17, 14.9, 19.93, 25.35];
  m[s.id] = F(starts[i]);
  return m;
}, {});
const TOTAL = F(32.27);
const D = durations as Record<string, number>;
const sc = (id: string) => script.scenes.find((s) => s.id === id)!;
const repo = facts.repos[0];

const CPF = 0.32; // characters typed per frame: a steady human pace
const ROW = 100;

const ease = (f: number, a: number, d = 14) =>
  interpolate(f, [a, a + d], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

const Check: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
    <path
      d="M4 12.5l5 5L20 6.5"
      fill="none"
      stroke={GREEN}
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type Item =
  | { at: number; kind: "cmd"; text: string }
  | { at: number; kind: "ok"; text: string }
  | { at: number; kind: "big"; text: string; sub?: string; size?: number };

export const cmdEnd = (it: { at: number; text: string }) => it.at + Math.ceil(it.text.length / CPF);

// A terminal window that fills its box. Commands type at a human pace with a
// blinking cursor; results are green-check lines taken from the research.
const Term: React.FC<{ items: Item[]; fontSize?: number; pad?: number }> = ({
  items,
  fontSize = 58,
  pad = 36,
}) => {
  const frame = useCurrentFrame();
  const visible = items.filter((i) => frame >= i.at);
  const last = visible[visible.length - 1];
  const cursorOn = Math.floor(frame / 18) % 2 === 0;
  const cursor = (
    <span
      style={{
        display: "inline-block",
        width: "0.55em",
        height: "1em",
        marginLeft: 6,
        verticalAlign: "-0.14em",
        background: cursorOn ? ACC : "transparent",
      }}
    />
  );
  const lastIsCmd = last?.kind === "cmd";
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        background: PANEL,
        border: `2px solid ${LINE}`,
        borderRadius: 30,
        padding: pad,
        fontFamily: `${mono}, ${sans}`,
        fontSize,
        color: FG,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", gap: 14, marginBottom: 26 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: i === 0 ? ACC : LINE }} />
        ))}
      </div>
      {visible.map((it, k) => {
        if (it.kind === "cmd") {
          const n = Math.min(it.text.length, Math.floor((frame - it.at) * CPF));
          return (
            <div key={k} style={{ minHeight: ROW, whiteSpace: "pre", fontWeight: 700 }}>
              <span style={{ color: ACC }}>$ </span>
              {it.text.slice(0, n)}
              {lastIsCmd && k === visible.length - 1 && cursor}
            </div>
          );
        }
        const p = ease(frame, it.at);
        if (it.kind === "ok") {
          return (
            <div
              key={k}
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                minHeight: ROW,
                paddingTop: 6,
                fontFamily: sans,
                fontWeight: 500,
                fontSize: fontSize * 0.78,
                lineHeight: 1.25,
                color: FG,
                opacity: p,
                transform: `translateY(${(1 - p) * 14}px)`,
              }}
            >
              <span style={{ marginTop: 4 }}>
                <Check size={Math.round(fontSize * 0.78)} />
              </span>
              <span>{it.text}</span>
            </div>
          );
        }
        return (
          <div
            key={k}
            style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)`, marginTop: 18, marginBottom: 18 }}
          >
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: it.size ?? fontSize * 1.9,
                lineHeight: 1.05,
                color: ACC,
                whiteSpace: "nowrap",
              }}
            >
              {it.text}
            </div>
            {it.sub && (
              <div style={{ fontFamily: sans, fontSize: fontSize * 0.7, color: DIM, marginTop: 8 }}>{it.sub}</div>
            )}
          </div>
        );
      })}
      {!lastIsCmd && last && (
        <div style={{ minHeight: ROW, whiteSpace: "pre", fontWeight: 700 }}>
          <span style={{ color: ACC }}>$ </span>
          {cursor}
        </div>
      )}
    </div>
  );
};

const Headline: React.FC<{ text: string; size?: number; at?: number; style?: React.CSSProperties }> = ({
  text,
  size = 88,
  at = 0,
  style,
}) => {
  const p = ease(useCurrentFrame(), at, 16);
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.04,
        color: "#fff",
        textWrap: "balance",
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

const Frame: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 0 }) => (
  <AbsoluteFill style={{ background: BG, fontFamily: sans }}>
    <AbsoluteFill
      style={{
        padding: `${SAFE.top + top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

const Logo: React.FC<{ size: number }> = ({ size }) => (
  <Img
    src={videoAsset(SLUG, repo.avatar)}
    style={{ width: size, height: size, borderRadius: size * 0.22, background: "#fff" }}
  />
);

// 1. Hook
const ShotHook: React.FC = () => {
  const frame = useCurrentFrame();
  const l1 = sc("s1").lines;
  const logo = ease(frame, 0, 16);
  return (
    <Frame top={BRAND_SPACE + 20}>
      <Brand />
      <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: logo }}>
        <Logo size={150} />
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, color: ACC }}>Bento</div>
      </div>
      <Headline text={sc("s1").headline} size={100} at={6} />
      <Term
        fontSize={68}
        items={[
          { at: 40, kind: "ok", text: l1[0] },
          { at: 100, kind: "ok", text: l1[1] },
        ]}
      />
    </Frame>
  );
};

// 2. One long terminal: three steps, each typed in place
const STEP_AT = [0, ST.s3 - ST.s2, ST.s4 - ST.s2];
const steps = [
  { id: "s2", cmd: "cd slides" },
  { id: "s3", cmd: "npm install" },
  { id: "s4", cmd: "npm run dev" },
];
const stepItems: Item[] = [];
const stepOutputs: Record<string, string | null> = {
  s2: null,
  s3: "Node 20+ và npm",
  s4: "Không cần backend",
};
steps.forEach((s, i) => {
  const cmd = { at: STEP_AT[i] + 26, kind: "cmd" as const, text: s.cmd };
  stepItems.push(cmd);
  const out = stepOutputs[s.id];
  if (out) stepItems.push({ at: cmdEnd(cmd) + 16, kind: "ok", text: out });
});

const ShotSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const cur = frame >= STEP_AT[2] ? 2 : frame >= STEP_AT[1] ? 1 : 0;
  const local = frame - STEP_AT[cur];
  const fadeOut =
    cur < 2
      ? interpolate(frame, [STEP_AT[cur + 1] - 8, STEP_AT[cur + 1]], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const p = ease(local, 0, 16) * fadeOut;
  return (
    <Frame>
      <div style={{ height: 196, position: "relative" }}>
        <Headline
          key={cur}
          text={sc(steps[cur].id).headline}
          size={88}
          at={cur === 0 ? 4 : STEP_AT[cur]}
          style={{ opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 56, color: ACC, minWidth: 250 }}>
          Bước {cur + 1}/3
        </div>
        <div style={{ flex: 1, display: "flex", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                background: i <= cur ? ACC : LINE,
              }}
            />
          ))}
        </div>
      </div>
      <Term items={stepItems} fontSize={74} />
    </Frame>
  );
};

// 3. Reveal: the address to open
const ShotOpen: React.FC = () => {
  const s5 = sc("s5");
  const url = s5.lines[0].replace("Truy cập ", "");
  return (
    <Frame>
      <Headline text={s5.headline} size={92} at={2} />
      <Term
        fontSize={70}
        items={[
          { at: 6, kind: "cmd", text: "npm run dev" },
          { at: 40, kind: "big", text: url.replace("http://", ""), sub: "Truy cập trên trình duyệt", size: 82 },
          { at: 96, kind: "ok", text: s5.lines[1] },
        ]}
      />
    </Frame>
  );
};

// 4. Outro
const ShotSave: React.FC = () => {
  const s6 = sc("s6");
  const frame = useCurrentFrame();
  const logo = ease(frame, 150, 16);
  return (
    <Frame>
      <Headline text={s6.headline} size={92} at={2} />
      <Term
        fontSize={66}
        items={[
          { at: 14, kind: "big", text: "~560 KB", sub: "Toàn bộ ứng dụng", size: 170 },
          { at: 60, kind: "ok", text: s6.lines[1] },
          { at: 100, kind: "ok", text: "Slide tự lưu dạng JSON" },
        ]}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: logo, height: 120 }}>
        <Logo size={96} />
        <div style={{ fontFamily: sans, color: "#fff" }}>
          <div style={{ fontSize: 44, fontWeight: 700 }}>{repo.name}</div>
          <div style={{ fontSize: 36, color: ACC }}>{repo.stars.toLocaleString("en-US")} sao GitHub</div>
        </div>
      </div>
    </Frame>
  );
};

const lens = {
  a: ST.s2 - ST.s1 + T,
  b: ST.s5 - ST.s2 + T,
  c: ST.s6 - ST.s5 + T,
  d: TOTAL - ST.s6,
};
const typeRange = (id: string, idx: number) => ({
  at: ST.s2 + STEP_AT[idx] + 26,
  n: Math.ceil(steps[idx].cmd.length / CPF),
  id,
});

const Comp: React.FC<VideoProps> = () => {
  const ids = script.scenes.map((s) => s.id);
  const voiceRanges = ids.map((id) => [ST[id], ST[id] + Math.ceil(D[id] * FPS)] as [number, number]);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={lens.a}>
          <ShotHook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip(1)} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={lens.b}>
          <ShotSteps />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={zoomPunch()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={lens.c}>
          <ShotOpen />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence durationInFrames={lens.d}>
          <ShotSave />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {ids.map((id) => (
        <Sequence key={id} from={ST[id]} layout="none" name={`voice ${id}`}>
          <Voice slug={SLUG} id={id} />
        </Sequence>
      ))}
      <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
      <Sfx id="pop" at={6} />
      <Sfx id="whoosh" at={ST.s2 - 4} />
      {steps.map((s, i) => {
        const r = typeRange(s.id, i);
        return <Sfx key={s.id} id="typing" at={r.at} frames={r.n} volume={0.3} />;
      })}
      <Sfx id="ding" at={ST.s3 + STEP_AT[0] + 0 + 0 + (steps[1].cmd.length / CPF | 0) + 44} volume={0.25} />
      <Sfx id="thud" at={ST.s5 - 4} />
      <Sfx id="ding" at={ST.s5 + 40} volume={0.3} />
      <Sfx id="pop" at={ST.s6 + 14} />
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Comp,
  durationInFrames: TOTAL,
};
