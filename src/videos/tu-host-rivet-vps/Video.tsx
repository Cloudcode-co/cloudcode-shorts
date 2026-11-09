import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
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
  TYPE_DELAY,
  Voice,
  display,
  easeOut,
  sans,
  typingFrames,
  useIn,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const NAVY = "#0A1630";
const PANEL = "rgba(8,18,44,0.86)";
const RED = "#E5252A";
const WHITE = "#FFFFFF";
const T = 12; // wipe length in frames
const TOP = SAFE.top + BRAND_SPACE;
const MAIN_TOP = 610;

type Scene = (typeof script.scenes)[number];
const sc = (id: string) => script.scenes.find((s) => s.id === id) as Scene;
const dur = (id: string) => Math.round((durations as Record<string, number>)[id] * FPS);
const startF = (id: string) =>
  Math.round((timeline.scenes as Record<string, { start: number }>)[id].start * FPS);
const TOTAL = Math.round(timeline.total * FPS);
const rivet = facts.repos[0];
const stars = rivet.stars.toLocaleString("de-DE");

// ---------- small parts ----------
const clipX = (p: number) => `inset(0 ${(1 - p) * 100}% 0 0)`;

const Headline: React.FC<{ text: string; size?: number; delay?: number }> = ({
  text,
  size = 96,
  delay = 0,
}) => {
  const p = useIn(delay, 16);
  const u = useIn(delay + 8, 20);
  return (
    <div style={{ position: "relative", paddingBottom: 26 }}>
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.02,
          color: WHITE,
          textWrap: "balance",
          clipPath: clipX(p),
          transform: `translateX(${(1 - p) * -40}px)`,
        }}
      >
        {text}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 8,
          width: 170 * u,
          background: RED,
        }}
      />
    </div>
  );
};

// A lower-third: navy panel with a red edge, wiping in from the left.
const Lower: React.FC<{ text: string; delay: number; size?: number; mono?: boolean }> = ({
  text,
  delay,
  size = 50,
  mono,
}) => {
  const p = useIn(delay, 14);
  return (
    <div
      style={{
        alignSelf: "flex-start",
        clipPath: clipX(p),
        background: PANEL,
        borderLeft: `10px solid ${RED}`,
        padding: "16px 30px",
        fontFamily: mono ? "monospace" : sans,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.12,
        color: WHITE,
        maxWidth: CONTENT_W,
        textWrap: "balance",
      }}
    >
      {text}
    </div>
  );
};

const Star: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2l3.1 6.6 7.2.9-5.3 5 1.4 7.2L12 18.1 5.6 21.7 7 14.5 1.7 9.5l7.2-.9z"
      fill={WHITE}
    />
  </svg>
);

// Beat of a shot: positioned in the main area, fades out at its end.
const Beat: React.FC<{ len: number; last?: boolean; children: React.ReactNode }> = ({
  len,
  last,
  children,
}) => {
  const f = useCurrentFrame();
  const out = last ? 1 : interpolate(f, [len - 10, len], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill
      style={{
        left: SAFE.left,
        top: MAIN_TOP,
        width: CONTENT_W,
        height: 730,
        right: "auto",
        bottom: "auto",
        opacity: out,
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const at = (d: number, frac: number) => Math.round(d * frac);

// ---------- scenes ----------
const S1: React.FC = () => {
  const d = dur("s1");
  const s = sc("s1");
  const card = useIn(at(d, 0.35), 16);
  return (
    <>
      <Headline text={s.headline} size={96} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          marginTop: 10,
          opacity: card,
          transform: `translateY(${(1 - card) * 40}px)`,
          background: PANEL,
          borderLeft: `10px solid ${RED}`,
          padding: "16px 30px",
          alignSelf: "flex-start",
        }}
      >
        <Img src={videoAsset(SLUG, rivet.avatar)} style={{ width: 120, height: 120, borderRadius: 22 }} />
        <div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 80, color: WHITE, lineHeight: 1 }}>
            {rivet.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, fontFamily: sans, fontWeight: 700, fontSize: 44, color: WHITE }}>
            <Star size={42} />
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{stars}</span>
            <span style={{ opacity: 0.7 }}>trên GitHub</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
        {s.lines.map((l, i) => (
          <Lower key={l} text={l} delay={at(d, 0.55) + i * 12} size={46} />
        ))}
      </div>
    </>
  );
};

const S2: React.FC = () => {
  const d = dur("s2");
  const s = sc("s2");
  const f = useCurrentFrame();
  const nodes = useIn(at(d, 0.12), 16);
  const call = at(d, 0.55);
  const lineP = useIn(at(d, 0.2), 24);
  const dotT = interpolate(f, [call, call + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const hot = f >= call + 24;
  const node = (label: string, red: boolean): React.CSSProperties => ({
    width: 290,
    height: 170,
    border: `6px solid ${red ? RED : WHITE}`,
    background: PANEL,
    color: WHITE,
    fontFamily: display,
    fontWeight: 800,
    fontSize: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    opacity: nodes,
    transform: `translateY(${(1 - nodes) * 30}px)`,
    boxShadow: red && hot ? `0 0 0 8px rgba(229,37,42,0.35)` : undefined,
  });
  return (
    <>
      <Headline text={s.headline} size={88} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, height: 190 }}>
        <div style={node("", false)}>Rivet loop</div>
        <div style={{ position: "absolute", left: 290, right: 290, top: 93, height: 6, background: "rgba(255,255,255,0.25)" }}>
          <div style={{ height: 6, width: `${lineP * 100}%`, background: WHITE }} />
        </div>
        {f >= call && (
          <div style={{ position: "absolute", top: 76, left: 290 + dotT * (CONTENT_W - 580) - 20, width: 40, height: 40, borderRadius: 20, background: RED }} />
        )}
        <div style={node("", true)}>Sandbox</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
        {s.lines.map((l, i) => (
          <Lower key={l} text={l} delay={at(d, 0.3) + i * at(d, 0.28)} size={46} />
        ))}
      </div>
    </>
  );
};

const S3: React.FC = () => {
  const d = dur("s3");
  const s = sc("s3");
  return (
    <>
      <Headline text={s.headline} size={104} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 40, rowGap: 36, marginTop: 24 }}>
        {s.lines.map((l, i) => (
          <Cell key={l} i={i} text={l} delay={at(d, 0.22) + i * at(d, 0.15)} />
        ))}
      </div>
    </>
  );
};
const Cell: React.FC<{ i: number; text: string; delay: number }> = ({ i, text, delay }) => {
  const p = useIn(delay, 16);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)`, borderTop: `6px solid ${RED}`, paddingTop: 14 }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: RED }}>{`0${i + 1}`}</div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 68, color: WHITE, lineHeight: 1.05 }}>{text}</div>
    </div>
  );
};

const S4: React.FC = () => {
  const d = dur("s4");
  const s = sc("s4");
  const f = useCurrentFrame();
  const times = [0.12, 0.42, 0.62].map((x) => at(d, x));
  const active = times.filter((t) => f >= t).length - 1;
  return (
    <>
      <Headline text={s.headline} size={100} />
      <div style={{ position: "relative", marginTop: 30, paddingLeft: 70, display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ position: "absolute", left: 22, top: 20, bottom: 20, width: 6, background: "rgba(255,255,255,0.25)" }} />
        {s.lines.map((l, i) => (
          <Step key={l} text={l} delay={times[i]} on={i === active} />
        ))}
      </div>
    </>
  );
};
const Step: React.FC<{ text: string; delay: number; on: boolean }> = ({ text, delay, on }) => {
  const p = useIn(delay, 16);
  return (
    <div style={{ position: "relative", opacity: p * (on ? 1 : 0.55), transform: `translateX(${(1 - p) * -40}px)`, fontFamily: display, fontWeight: 800, fontSize: 70, color: WHITE, lineHeight: 1.05 }}>
      <div style={{ position: "absolute", left: -61, top: 14, width: 40, height: 40, borderRadius: 20, background: on ? RED : WHITE }} />
      {text}
    </div>
  );
};

const S5: React.FC = () => {
  const d = dur("s5");
  const s = sc("s5");
  const big = useIn(at(d, 0.08), 18);
  return (
    <>
      <Headline text={s.headline} size={84} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 30, marginTop: 6, opacity: big, transform: `translateY(${(1 - big) * 40}px)` }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 330, lineHeight: 0.85, color: WHITE }}>S3</div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 62, color: WHITE, paddingBottom: 10 }}>{s.lines[0]}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
        {s.lines.slice(1).map((l, i) => (
          <Struck key={l} text={l} delay={at(d, 0.4) + i * at(d, 0.2)} />
        ))}
      </div>
    </>
  );
};
const Struck: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const p = useIn(delay, 14);
  const k = useIn(delay + 14, 14);
  return (
    <div style={{ alignSelf: "flex-start", position: "relative", clipPath: clipX(p), background: PANEL, borderLeft: `10px solid ${RED}`, padding: "16px 30px", fontFamily: sans, fontWeight: 700, fontSize: 58, color: WHITE }}>
      {text}
      <div style={{ position: "absolute", left: 30, top: "54%", height: 7, width: `calc(${k * 100}% - 60px)`, background: RED }} />
    </div>
  );
};

const S6: React.FC = () => {
  const d = dur("s6");
  const s = sc("s6");
  return (
    <>
      <Headline text={s.headline} size={84} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 0 }}>
        {s.lines.map((l, i) => (
          <Row key={l} i={i} text={l} delay={at(d, 0.12) + i * at(d, 0.13)} />
        ))}
      </div>
      <div style={{ marginTop: 6 }}>
        <Lower text="1 instance để thử, từ 3 cho production" delay={at(d, 0.72)} size={44} />
      </div>
    </>
  );
};
const Row: React.FC<{ i: number; text: string; delay: number }> = ({ i, text, delay }) => {
  const p = useIn(delay, 16);
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 26, opacity: p, transform: `translateX(${(1 - p) * -50}px)`, borderBottom: "3px solid rgba(255,255,255,0.3)", paddingBottom: 6 }}>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 50, color: RED, fontVariantNumeric: "tabular-nums" }}>{`0${i + 1}`}</span>
      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 64, color: WHITE }}>{text}</span>
    </div>
  );
};

const S7: React.FC = () => {
  const d = dur("s7");
  const s = sc("s7");
  const t = useIn(at(d, 0.3), 14);
  return (
    <>
      <Headline text={s.headline} size={128} />
      <Lower text={s.lines[0]} delay={8} size={50} />
      <div style={{ marginTop: 26, opacity: t }}>
        <Sequence from={at(d, 0.3)} layout="none">
          <Terminal cmds={s.commands} fontSize={40} minHeight={250} bg="#060D20" accent={RED} />
          <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(s.commands)} volume={0.25} />
        </Sequence>
      </div>
    </>
  );
};

const S8: React.FC = () => {
  const d = dur("s8");
  const s = sc("s8");
  const [a, b] = [0.38, 0.62].map((x) => at(d, x));
  return (
    <>
      <Headline text={s.headline} size={98} />
      <Lower text={s.lines[0]} delay={at(d, 0.12)} size={48} />
      <div style={{ display: "flex", gap: 36, marginTop: 24 }}>
        <Port n="6420" label="node" delay={a} red />
        <Port n="6421" label="private network" delay={b} />
      </div>
    </>
  );
};
const Port: React.FC<{ n: string; label: string; delay: number; red?: boolean }> = ({ n, label, delay, red }) => {
  const p = useIn(delay, 16);
  return (
    <div style={{ flex: 1, opacity: p, transform: `translateY(${(1 - p) * 40}px)`, borderTop: `8px solid ${red ? RED : WHITE}`, paddingTop: 10 }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 150, lineHeight: 1, color: WHITE, fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 44, color: WHITE, opacity: 0.85 }}>{label}</div>
    </div>
  );
};

const S9: React.FC = () => {
  const d = dur("s9");
  const s = sc("s9");
  const tAt = at(d, 0.5);
  const t = useIn(tAt, 14);
  return (
    <>
      <Headline text={s.headline} size={92} />
      <Lower text={s.lines[0]} delay={at(d, 0.12)} size={48} mono />
      <Lower text={s.lines[1]} delay={at(d, 0.26)} size={44} />
      <div style={{ marginTop: 20, opacity: t }}>
        <Sequence from={tAt} layout="none">
          <Terminal cmds={s.commands} fontSize={40} minHeight={210} bg="#060D20" accent={RED} />
          <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(s.commands)} volume={0.25} />
        </Sequence>
      </div>
    </>
  );
};

const S10: React.FC = () => {
  const d = dur("s10");
  const s = sc("s10");
  const f = useCurrentFrame();
  const swap = at(d, 0.76);
  const end = useIn(swap + 8, 18);
  const listOut = interpolate(f, [swap, swap + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Headline text={s.headline} size={100} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 6, opacity: listOut }}>
        {s.lines.map((l, i) => (
          <Lower key={l} text={l} delay={at(d, 0.1) + i * at(d, 0.2)} size={50} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 300, width: CONTENT_W, opacity: end, transform: `translateY(${(1 - end) * 30}px)` }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 92, lineHeight: 1.04, color: WHITE, textWrap: "balance" }}>
          Lưu video để thử, follow để xem thêm
        </div>
        <div style={{ height: 8, width: 170 * end, background: RED, marginTop: 14 }} />
      </div>
    </>
  );
};

const SCENES: Record<string, React.FC> = { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10 };

// ---------- shots ----------
type ShotDef = {
  n: number;
  label: string;
  ids: string[];
  clip: string;
  clipLen: number; // seconds in the file
  rate: number;
  pos?: string;
};
const SHOTS: ShotDef[] = [
  { n: 1, label: "Rivet là gì", ids: ["s1", "s2"], clip: "footage/programmer-typing-code-laptop-pixabay-4733.mp4", clipLen: 14, rate: 0.9, pos: "40% 50%" },
  { n: 2, label: "Cách hoạt động", ids: ["s3", "s4", "s5"], clip: "footage/server-room-lights-pixabay-171185.mp4", clipLen: 20, rate: 0.7 },
  { n: 3, label: "Tự host trên VPS", ids: ["s6", "s7", "s8", "s9"], clip: "footage/data-center-server-rack-pixabay-242599.mp4", clipLen: 4.6, rate: 0.55, pos: "50% 50%" },
  { n: 4, label: "Nhớ giới hạn", ids: ["s10"], clip: "footage/padlock-security-cyber-pixabay-299519.mp4", clipLen: 10, rate: 0.6, pos: "50% 50%" },
];
const COUNT = SHOTS.length;

const Ticker: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const unit = `${text}   |   `;
  const w = unit.length * 21; // ~px per char at 36px
  const x = -((f * 3) % w);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1356, height: 84, background: WHITE, display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{ width: 10, height: 84, background: RED, marginLeft: SAFE.left - 20 }} />
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 38, color: RED, marginLeft: 20, whiteSpace: "nowrap" }}>TIN NÓNG</div>
      <div style={{ position: "relative", flex: 1, marginLeft: 26, height: 84, overflow: "hidden", marginRight: 200 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: 84, display: "flex", alignItems: "center", whiteSpace: "nowrap", fontFamily: sans, fontWeight: 700, fontSize: 36, color: NAVY, transform: `translateX(${x}px)` }}>
          {unit.repeat(4)}
        </div>
      </div>
    </div>
  );
};

const Backdrop: React.FC<{ def: ShotDef; len: number }> = ({ def, len }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, len], [1.04, 1.2]);
  const loop = Math.floor((def.clipLen / def.rate) * FPS);
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Loop durationInFrames={loop}>
          <OffthreadVideo
            src={staticFile(`videos/${SLUG}/${def.clip}`)}
            muted
            playbackRate={def.rate}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: def.pos ?? "50% 50%" }}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(8,16,40,0.55)" }} />
    </AbsoluteFill>
  );
};

const Counter: React.FC<{ n: number; label: string }> = ({ n, label }) => {
  const p = useIn(2, 18);
  const u = useIn(10, 20);
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: TOP, width: CONTENT_W, opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 210, lineHeight: 0.9, color: WHITE, fontVariantNumeric: "tabular-nums" }}>
          {n}
          <span style={{ color: RED }}>/</span>
          <span style={{ opacity: 0.6 }}>{COUNT}</span>
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: WHITE, paddingBottom: 14, lineHeight: 1.1 }}>{label}</div>
      </div>
      <div style={{ height: 8, width: CONTENT_W * u, background: RED, marginTop: 14 }} />
    </div>
  );
};

const ShotView: React.FC<{ def: ShotDef; len: number; shotStart: number }> = ({ def, len, shotStart }) => {
  const ticker = def.ids.map((id) => sc(id).headline).join("   |   ");
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Backdrop def={def} len={len} />
      <Counter n={def.n} label={def.label} />
      {def.ids.map((id, i) => {
        const from = startF(id) - shotStart;
        const nextId = def.ids[i + 1];
        const to = nextId ? startF(nextId) - shotStart : len;
        const Scene = SCENES[id.toUpperCase()];
        return (
          <Sequence key={id} from={from} durationInFrames={to - from} name={id} layout="none">
            <Beat len={to - from} last={!nextId}>
              <Scene />
            </Beat>
          </Sequence>
        );
      })}
      <Ticker text={ticker} />
      {def.n === 1 && <Brand />}
    </AbsoluteFill>
  );
};

const Main: React.FC<VideoProps> = () => {
  const starts = SHOTS.map((s) => startF(s.ids[0]));
  const lens = SHOTS.map((_, i) => (i + 1 < SHOTS.length ? starts[i + 1] : TOTAL) - starts[i]);
  const voiceRanges = script.scenes.map((s) => [startF(s.id), startF(s.id) + dur(s.id)] as [number, number]);
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <TransitionSeries>
        {SHOTS.flatMap((def, i) => {
          const last = i === SHOTS.length - 1;
          const out = [
            <TransitionSeries.Sequence key={def.n} durationInFrames={lens[i] + (last ? 0 : T)}>
              <ShotView def={def} len={lens[i] + (last ? 0 : T)} shotStart={starts[i]} />
            </TransitionSeries.Sequence>,
          ];
          if (!last)
            out.push(
              <TransitionSeries.Transition
                key={`t${def.n}`}
                presentation={wipe({ direction: i % 2 ? "from-right" : "from-left" })}
                timing={linearTiming({ durationInFrames: T })}
              />,
            );
          return out;
        })}
      </TransitionSeries>
      {script.scenes.map((s) => (
        <Sequence key={s.id} from={startF(s.id)} durationInFrames={dur(s.id) + 4} layout="none" name={`voice ${s.id}`}>
          <Voice slug={SLUG} id={s.id} />
        </Sequence>
      ))}
      <Sfx id="thud" at={0} volume={0.5} />
      {starts.slice(1).map((s) => (
        <Sfx key={s} id="whoosh" at={s - 2} volume={0.35} />
      ))}
      <Sfx id="pop" at={startF("s3") + 80} volume={0.2} />
      <Sfx id="ding" at={startF("s10") + at(dur("s10"), 0.8)} volume={0.3} />
      <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Main,
  durationInFrames: TOTAL,
};
