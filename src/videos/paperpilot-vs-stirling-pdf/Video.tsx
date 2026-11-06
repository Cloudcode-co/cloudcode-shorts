import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import {
  AbsoluteFill,
  Img,
  Loop,
  OffthreadVideo,
  Sequence,
  Series,
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
  TYPE_DELAY,
  Terminal,
  TikTokGuide,
  Voice,
  easeOut,
  typingFrames,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const serif = loadSerif("normal", { weights: ["400", "600"], subsets: ["latin", "vietnamese"] }).fontFamily;
const serifIt = loadSerif("italic", { weights: ["400"], subsets: ["latin", "vietnamese"] }).fontFamily;

const INK = "#F2EDE2";
const MUTED = "#CFC8B8";
const AMBER = "#E3B873";
const SAGE = "#9CC49A";
const RUST = "#E2765F";
const BLACK = "#0A0A0A";

type Scene = (typeof script.scenes)[number];
const scenes = script.scenes;
const dur = (id: string) => (durations as Record<string, number>)[id];
const lens = scenes.map((s) => Math.round((timeline.scenes as Record<string, { length: number }>)[s.id].length * FPS));
const offs = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
const TOTAL = lens.reduce((a, b) => a + b, 0);
const idx = (id: string) => scenes.findIndex((s) => s.id === id);
const sec = (t: number) => Math.round(t * FPS);

// Four long shots: the music's sections.
const SHOTS = [
  { ids: ["s1", "s2"] },
  { ids: ["s3", "s4", "s5"] },
  { ids: ["s6", "s7", "s8", "s9"] },
  { ids: ["s10", "s11", "s12"] },
].map((sh) => {
  const a = idx(sh.ids[0]);
  const b = idx(sh.ids[sh.ids.length - 1]);
  const start = offs[a];
  const len = offs[b] + lens[b] - start;
  return { ...sh, start, len };
});

const voiceRanges: [number, number][] = scenes.map((s, i) => [offs[i], offs[i] + sec(dur(s.id))]);

// ---------- pieces ----------

const Reveal: React.FC<{ at: number; children: React.ReactNode; dy?: number; style?: React.CSSProperties }> = ({
  at,
  children,
  dy = 22,
  style,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style }}>{children}</div>;
};

// Footage, graded slightly desaturated, slow push-in, soft vignette.
const Footage: React.FC<{
  file: string;
  len: number;
  rate?: number;
  trim?: number;
  pos?: string;
  zoom?: [number, number];
  dark?: number;
  loopFrames?: number;
}> = ({ file, len, rate = 1, trim = 0, pos = "50% 50%", zoom = [1.02, 1.14], dark = 0.4, loopFrames }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, len], zoom, { extrapolateRight: "clamp" });
  const video = (
    <OffthreadVideo
      src={videoAsset(SLUG, file)}
      muted
      playbackRate={rate}
      trimBefore={trim}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: pos,
        filter: "saturate(0.68) contrast(1.06) brightness(0.92)",
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: BLACK, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        {loopFrames ? <Loop durationInFrames={loopFrames}>{video}</Loop> : video}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(10,8,6,${dark})` }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.62) 100%)",
        }}
      />
      <AbsoluteFill
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }}
      />
    </AbsoluteFill>
  );
};

// Lower-third caption: a drawn rule, the headline in serif, then its lines.
const LowerThird: React.FC<{ sc: Scene; lines?: boolean; color?: string; at?: number }> = ({
  sc,
  lines = true,
  color = AMBER,
  at = 6,
}) => {
  const f = useCurrentFrame();
  const rule = interpolate(f, [at, at + 24], [0, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const n = sc.lines.length;
  const d = dur(sc.id) * FPS;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: CONTENT_W,
        bottom: SAFE.bottom + 24,
        textShadow: "0 2px 18px rgba(0,0,0,0.75)",
      }}
    >
      <div style={{ width: rule, height: 4, background: color, marginBottom: 22 }} />
      <Reveal at={at + 4}>
        <div
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 72,
            lineHeight: 1.08,
            color: INK,
            textWrap: "balance",
          }}
        >
          {sc.headline}
        </div>
      </Reveal>
      {lines &&
        sc.lines.map((l, i) => (
          <Reveal key={l} at={at + 30 + (i * d * 0.7) / Math.max(1, n)} dy={14}>
            <div
              style={{
                fontFamily: serifIt,
                fontSize: 44,
                lineHeight: 1.25,
                marginTop: i === 0 ? 14 : 4,
                color: MUTED,
              }}
            >
              {l}
            </div>
          </Reveal>
        ))}
    </div>
  );
};

// Big pull lines in the middle of the frame, each arriving at a time in seconds.
const Pull: React.FC<{
  items: { text: string; at: number; color?: string; size?: number; nowrap?: boolean }[];
  size?: number;
  top?: number;
}> = ({ items, size = 96, top = 400 }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      width: CONTENT_W,
      top,
      display: "flex",
      flexDirection: "column",
      gap: 34,
      textShadow: "0 2px 22px rgba(0,0,0,0.8)",
    }}
  >
    {items.map((it, i) => (
      <Reveal key={it.text} at={sec(it.at)} dy={30}>
        <div
          style={{
            fontFamily: i % 2 === 0 ? serif : serifIt,
            fontWeight: i % 2 === 0 ? 600 : 400,
            fontSize: it.size ?? size,
            lineHeight: 1.06,
            color: it.color ?? INK,
            textWrap: "balance",
            whiteSpace: it.nowrap ? "nowrap" : undefined,
          }}
        >
          {it.text}
        </div>
      </Reveal>
    ))}
  </div>
);

// A key number set huge on black.
const NumberCard: React.FC<{ big: string; small: string; from: number; to: number; size?: number }> = ({
  big,
  small,
  from,
  to,
  size = 280,
}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const o = interpolate(f, [from, from + 8, to - 10, to], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const z = interpolate(f, [from, to], [0.95, 1.03]);
  return (
    <AbsoluteFill style={{ background: BLACK, opacity: o }}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: CONTENT_W,
          top: 640,
          transform: `scale(${z})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: size,
            lineHeight: 1,
            color: INK,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {big}
        </div>
        <div style={{ width: 150, height: 4, background: AMBER, margin: "34px 0 26px" }} />
        <div style={{ fontFamily: serifIt, fontSize: 56, color: MUTED }}>{small}</div>
      </div>
    </AbsoluteFill>
  );
};

const Cut: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    <AbsoluteFill style={{ background: BLACK }}>{children}</AbsoluteFill>
  </Sequence>
);

// ---------- scenes ----------

const S1: React.FC<{ sc: Scene }> = ({ sc }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: CONTENT_W,
        top: SAFE.top + BRAND_SPACE + 480,
        textShadow: "0 2px 22px rgba(0,0,0,0.8)",
      }}
    >
      <Reveal at={14} dy={30}>
        <div
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 124,
            lineHeight: 1.02,
            color: INK,
            textWrap: "balance",
          }}
        >
          {sc.headline}
        </div>
      </Reveal>
      <Reveal at={sec(1.6)} dy={16}>
        <div style={{ width: 150, height: 4, background: AMBER, margin: "34px 0 22px" }} />
        <div style={{ fontFamily: serifIt, fontSize: 56, color: AMBER }}>{sc.lines[0]}</div>
      </Reveal>
    </div>
    <Sfx id="thud" volume={0.45} />
  </>
);

const repo = facts.repos[0];
const S2: React.FC<{ sc: Scene }> = ({ sc }) => (
  <>
    <Reveal at={sec(0.9)} style={{ position: "absolute", left: SAFE.left, top: SAFE.top + BRAND_SPACE + 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, textShadow: "0 2px 18px rgba(0,0,0,0.8)" }}>
        <Img
          src={videoAsset(SLUG, repo.avatar as string)}
          style={{ width: 112, height: 112, borderRadius: 24, background: "#fff" }}
        />
        <div>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 64, color: INK, lineHeight: 1 }}>
            {repo.name}
          </div>
          <div style={{ fontFamily: serifIt, fontSize: 40, color: AMBER, marginTop: 8 }}>
            {repo.stars.toLocaleString("en-US")} sao GitHub
          </div>
        </div>
      </div>
    </Reveal>
    <LowerThird sc={sc} />
  </>
);

const S3: React.FC<{ sc: Scene }> = ({ sc }) => (
  <>
    <Pull
      items={[
        { text: sc.lines[0], at: 0.6 },
        { text: sc.lines[1], at: 2.25, color: AMBER },
      ]}
      size={104}
      top={420}
    />
    <LowerThird sc={sc} lines={false} />
    <Sfx id="pop" at={sec(2.25)} volume={0.3} />
  </>
);

const S4: React.FC<{ sc: Scene }> = ({ sc }) => (
  <>
    <Pull
      items={[
        { text: sc.lines[0], at: 0.8, size: 66, nowrap: true },
        { text: sc.lines[1], at: 5.4, color: AMBER, size: 84 },
      ]}
      size={92}
      top={420}
    />
    <LowerThird sc={sc} lines={false} />
  </>
);

const WORDS: [string, number][] = [
  ["CLI", 1.2],
  ["REST", 2.9],
  ["MCP", 4.3],
  ["WASM", 6.1],
];
const S5: React.FC<{ sc: Scene }> = ({ sc }) => {
  const f = useCurrentFrame();
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 330,
          width: CONTENT_W,
          textShadow: "0 2px 22px rgba(0,0,0,0.8)",
        }}
      >
        {WORDS.map(([w, t], i) => {
          const next = i < WORDS.length - 1 ? sec(WORDS[i + 1][1]) : 1e9;
          const dim = f >= next ? 0.5 : 1;
          return (
            <Reveal key={w} at={sec(t)} dy={26}>
              <div
                style={{
                  fontFamily: serif,
                  fontWeight: 600,
                  fontSize: 190,
                  lineHeight: 1.02,
                  color: i === WORDS.length - 1 ? AMBER : INK,
                  opacity: dim,
                }}
              >
                {w}
              </div>
            </Reveal>
          );
        })}
      </div>
      <LowerThird sc={sc} lines={false} />
    </>
  );
};

const S6: React.FC<{ sc: Scene }> = ({ sc }) => (
  <>
    <div style={{ position: "absolute", left: SAFE.left, top: 300 }}>
      <Terminal cmds={sc.commands} fontSize={36} minHeight={400} bg="rgba(12,12,12,0.88)" accent={AMBER} />
    </div>
    <LowerThird sc={sc} />
    <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(sc.commands)} volume={0.22} />
    <NumberCard big="7823" small="localhost" from={sec(3.3)} to={sec(5.9)} size={300} />
    <Sfx id="ding" at={sec(3.3)} volume={0.3} />
  </>
);

const S7: React.FC<{ sc: Scene }> = ({ sc }) => (
  <>
    <div style={{ position: "absolute", left: SAFE.left, top: 300 }}>
      <Terminal cmds={sc.commands} fontSize={36} minHeight={520} bg="rgba(12,12,12,0.88)" accent={AMBER} />
    </div>
    <LowerThird sc={sc} />
    <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(sc.commands)} volume={0.22} />
    <NumberCard big="1.75+" small="Rust" from={sec(5.0)} to={sec(7.9)} size={270} />
    <Sfx id="ding" at={sec(5.0)} volume={0.3} />
  </>
);

// The turning point: hard, quick cuts on black.
const S8: React.FC<{ sc: Scene }> = ({ sc }) => {
  const f = useCurrentFrame();
  const jolt = (from: number) => (f < from ? 1 : interpolate(f - from, [0, 20], [1.05, 1], { extrapolateRight: "clamp", easing: easeOut }));
  const center: React.CSSProperties = {
    position: "absolute",
    left: SAFE.left,
    width: CONTENT_W,
    top: 560,
  };
  return (
    <>
      <Cut from={0} to={sec(3.0)}>
        <Reveal at={6} dy={20} style={center}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 104, lineHeight: 1.06, color: INK, textWrap: "balance" }}>
            {sc.headline}
          </div>
        </Reveal>
      </Cut>
      <Cut from={sec(3.0)} to={sec(4.5)}>
        <div style={{ ...center, top: 640, transform: `scale(${jolt(sec(3.0))})`, transformOrigin: "left center" }}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 190, lineHeight: 1, color: RUST, whiteSpace: "nowrap" }}>
            {sc.lines[0]}
          </div>
        </div>
      </Cut>
      <Cut from={sec(4.5)} to={sec(5.6)}>
        <div style={{ ...center, transform: `scale(${jolt(sec(4.5))})`, transformOrigin: "left center" }}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 110, lineHeight: 1.06, color: INK }}>
            {sc.lines[1]}
          </div>
        </div>
      </Cut>
      <Cut from={sec(5.6)} to={lens[idx("s8")]}>
        <div style={{ ...center, transform: `scale(${jolt(sec(5.6))})`, transformOrigin: "left center" }}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 110, lineHeight: 1.06, color: INK, textWrap: "balance" }}>
            {sc.lines[2]}
          </div>
        </div>
      </Cut>
      <Sfx id="thud" at={sec(3.0)} volume={0.4} />
      <Sfx id="whoosh" at={sec(4.5)} volume={0.25} />
      <Sfx id="whoosh" at={sec(5.6)} volume={0.25} />
    </>
  );
};

const S9: React.FC<{ sc: Scene }> = ({ sc }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 420,
        width: CONTENT_W,
        paddingLeft: 36,
        borderLeft: `5px solid ${RUST}`,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        textShadow: "0 2px 22px rgba(0,0,0,0.8)",
      }}
    >
      <Reveal at={sec(2.2)}>
        <div style={{ fontFamily: serifIt, fontSize: 84, lineHeight: 1.08, color: INK }}>{sc.lines[1]}</div>
      </Reveal>
      <Reveal at={sec(5.2)}>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 84, lineHeight: 1.08, color: RUST }}>{sc.lines[0]}</div>
      </Reveal>
    </div>
    <LowerThird sc={sc} lines={false} color={RUST} />
  </>
);

const S10: React.FC<{ sc: Scene }> = ({ sc }) => (
  <>
    <LowerThird sc={sc} />
    <NumberCard big="0.6.1" small="pre-release" from={sec(0.3)} to={sec(4.2)} size={270} />
    <Sfx id="thud" at={sec(0.3)} volume={0.4} />
  </>
);

const S11: React.FC<{ sc: Scene }> = ({ sc }) => (
  <>
    <Pull
      items={[
        { text: sc.lines[0], at: 1.0, color: SAGE },
        { text: sc.lines[1], at: 6.4, color: RUST },
      ]}
      size={98}
      top={420}
    />
    <LowerThird sc={sc} lines={false} />
  </>
);

const S12: React.FC<{ sc: Scene }> = ({ sc }) => (
  <AbsoluteFill style={{ background: BLACK }}>
    <div style={{ position: "absolute", left: SAFE.left, width: CONTENT_W, top: 560 }}>
      <Reveal at={10} dy={26}>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 132, lineHeight: 1.03, color: INK, textWrap: "balance" }}>
          {sc.headline}
        </div>
      </Reveal>
      <Reveal at={sec(1.2)} dy={14}>
        <div style={{ width: 150, height: 4, background: AMBER, margin: "36px 0 28px" }} />
      </Reveal>
      {sc.lines.map((l, i) => (
        <Reveal key={l} at={sec(1.6 + i * 1.3)} dy={14}>
          <div style={{ fontFamily: serifIt, fontSize: 62, lineHeight: 1.3, color: i === 0 ? AMBER : MUTED }}>{l}</div>
        </Reveal>
      ))}
    </div>
  </AbsoluteFill>
);

const SCENE: Record<string, React.FC<{ sc: Scene }>> = {
  s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10, s11: S11, s12: S12,
};

// ---------- shots ----------

const FOOT = {
  desk: "footage/developer-working-late-desk-pixabay-215751.mp4",
  server: "footage/server-room-closeup-pixabay-171185.mp4",
  screens: "footage/developer-comparing-software-screens-pixabay-4733.mp4",
};

const ShotBackdrop: React.FC<{ n: number }> = ({ n }) => {
  const sh = SHOTS[n];
  const rel = (id: string) => offs[idx(id)] - sh.start;
  const L = (id: string) => lens[idx(id)];
  if (n === 0) return <Footage file={FOOT.desk} len={sh.len} pos="50% 50%" zoom={[1.0, 1.14]} dark={0.42} />;
  if (n === 1)
    return <Footage file={FOOT.server} len={sh.len} rate={0.7} pos="50% 30%" zoom={[1.25, 1.42]} dark={0.2} />;
  if (n === 2) {
    const a = L("s6") + L("s7");
    const c = L("s9");
    return (
      <>
        <Sequence from={0} durationInFrames={a}>
          <Footage file={FOOT.screens} len={a} rate={0.6} pos="50% 50%" dark={0.3} zoom={[1.02, 1.12]} />
        </Sequence>
        <Sequence from={rel("s9")} durationInFrames={c}>
          <Footage file={FOOT.screens} len={c} rate={0.7} trim={sec(8)} pos="35% 50%" dark={0.3} zoom={[1.0, 1.14]} />
        </Sequence>
      </>
    );
  }
  const a = L("s10") + L("s11");
  return (
    <Sequence from={0} durationInFrames={a}>
      <Footage file={FOOT.desk} len={a} rate={0.6} trim={sec(3)} pos="30% 50%" dark={0.5} zoom={[1.02, 1.14]} />
    </Sequence>
  );
};

const ShotView: React.FC<{ n: number }> = ({ n }) => {
  const sh = SHOTS[n];
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 14, sh.len - 12, sh.len], [n === 0 ? 0 : 1, 0, 0, n === SHOTS.length - 1 ? 0 : 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: BLACK }}>
      <ShotBackdrop n={n} />
      {sh.ids.map((id) => {
        const i = idx(id);
        const C = SCENE[id];
        return (
          <Sequence key={id} from={offs[i] - sh.start} durationInFrames={lens[i]} name={id}>
            <C sc={scenes[i]} />
            <Voice slug={SLUG} id={id} />
          </Sequence>
        );
      })}
      {n === 0 && <Brand />}
      <AbsoluteFill style={{ background: BLACK, opacity: fade, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Doc: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: BLACK }}>
    <Series>
      {SHOTS.map((sh, n) => (
        <Series.Sequence key={n} durationInFrames={sh.len} name={`shot ${n + 1}`}>
          <ShotView n={n} />
        </Series.Sequence>
      ))}
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Doc, durationInFrames: TOTAL };
