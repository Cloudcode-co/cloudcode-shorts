// News desk: a tech bulletin in five long shots. Navy, white, one red accent.
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Loop,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
} from "remotion";
import {
  beatmap,
  CONTENT_W,
  display,
  easeOut,
  FPS,
  hit,
  Music,
  nextOf,
  SAFE,
  sans,
  mono,
  Sfx,
  Brand,
  Terminal,
  typingFrames,
  TYPE_DELAY,
  useIn,
  videoAsset,
  Voice,
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
const NAVY = "#0A1630";
const NAVY_DEEP = "#060D1F";
const RED = "#F0343A";
const WHITE = "#FFFFFF";
const T = 12; // wipe length
const KEPT = facts.repos[0];

const IDS = script.scenes.map((s) => s.id) as (keyof typeof durations)[];
const SF = Object.fromEntries(
  IDS.map((id) => [id, Math.round(timeline.scenes[id].start * FPS)]),
) as Record<string, number>;
const TOTAL = Math.round(timeline.total * FPS);

const STARTS = [0, SF.s3, SF.s6, SF.s8, SF.s10];
const LENS = STARTS.map((s, i) => (i < STARTS.length - 1 ? STARTS[i + 1] - s + T : TOTAL - s));

const VOICE_RANGES: [number, number][] = IDS.map((id) => [
  SF[id],
  SF[id] + Math.round(durations[id] * FPS),
]);

// ---------- pieces ----------

const Backdrop: React.FC<{
  file: string;
  clip: number; // seconds of clip available
  rate?: number;
  trim?: number; // seconds
  len: number;
  focus?: string;
}> = ({ file, clip, rate = 1, trim = 0, len, focus = "50% 50%" }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, len], [1.05, 1.22]);
  const loop = Math.max(30, Math.floor(((clip - trim - 0.3) / rate) * FPS));
  return (
    <AbsoluteFill style={{ background: NAVY_DEEP, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: focus }}>
        <Loop durationInFrames={loop}>
          <OffthreadVideo
            src={videoAsset(SLUG, file)}
            muted
            playbackRate={rate}
            trimBefore={Math.round(trim * FPS)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(6,13,31,0.6)" }} />
    </AbsoluteFill>
  );
};

// Shows its children from `from` to `to` (shot frames); children get local frames.
const Phase: React.FC<{ from: number; to?: number; children: React.ReactNode }> = ({
  from,
  to,
  children,
}) => (
  <Sequence from={from} durationInFrames={to === undefined ? undefined : to - from} layout="none">
    <PhaseInner d={to === undefined ? undefined : to - from}>{children}</PhaseInner>
  </Sequence>
);
const PhaseInner: React.FC<{ d?: number; children: React.ReactNode }> = ({ d, children }) => {
  const f = useCurrentFrame();
  const o = d === undefined ? 1 : interpolate(f, [d - 10, d], [1, 0], { extrapolateLeft: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const TopBar: React.FC<{ topic: string }> = ({ topic }) => {
  const f = useCurrentFrame();
  const p = useIn(0, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 330,
        height: 72,
        background: "rgba(10,22,48,0.94)",
        borderTop: `5px solid ${RED}`,
        display: "flex",
        alignItems: "center",
        paddingLeft: SAFE.left,
        paddingRight: SAFE.right,
        gap: 18,
        fontFamily: display,
        fontWeight: 800,
        fontSize: 38,
        color: WHITE,
        transform: `translateX(${(1 - p) * -120}px)`,
        opacity: p,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          background: RED,
          opacity: 0.55 + 0.45 * hit(MAP.beats, f, 14),
        }}
      />
      <span style={{ color: RED }}>TIN NÓNG</span>
      <span style={{ flex: 1, textAlign: "right", fontFamily: sans, fontWeight: 700, fontSize: 36 }}>
        {topic}
      </span>
    </div>
  );
};

const Ticker: React.FC<{ items: string[] }> = ({ items }) => {
  const f = useCurrentFrame();
  const x = 1080 - f * 3.2;
  const row = [...items, ...items, ...items, ...items, ...items, ...items, ...items, ...items];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1346,
        height: 92,
        background: "rgba(10,22,48,0.96)",
        borderTop: `5px solid ${RED}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 40,
          whiteSpace: "nowrap",
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 40,
          color: WHITE,
          transform: `translateX(${x}px)`,
        }}
      >
        {row.map((t, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 40 }}>
            {t}
            <span style={{ width: 16, height: 16, background: RED, display: "inline-block" }} />
          </span>
        ))}
      </div>
    </div>
  );
};

const TickerPhased: React.FC<{ phases: { from: number; items: string[] }[] }> = ({ phases }) => {
  const f = useCurrentFrame();
  const cur = [...phases].reverse().find((p) => f >= p.from) ?? phases[0];
  return <Ticker items={cur.items} />;
};

const Counter: React.FC<{ n: number; at: number; start: number }> = ({ n, at, start }) => {
  const f = useCurrentFrame();
  const p = f < at ? 0 : interpolate(f - at, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const pump = 1 + 0.05 * hit(MAP.downbeats, start + f, 14);
  if (f < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        fontFamily: display,
        fontWeight: 800,
        fontSize: 200,
        lineHeight: 0.95,
        color: WHITE,
        fontVariantNumeric: "tabular-nums",
        opacity: p,
        transform: `scale(${(1.35 - 0.35 * p) * pump})`,
        transformOrigin: "0% 60%",
        letterSpacing: -6,
      }}
    >
      {n}
      <span style={{ color: RED }}>/</span>3
    </div>
  );
};

// A headline wiping in from the left, with a red underline drawn below it.
const H: React.FC<{ text: string; size?: number; delay?: number; color?: string }> = ({
  text,
  size = 96,
  delay = 0,
  color = WHITE,
}) => {
  const p = useIn(delay, 18);
  const u = useIn(delay + 10, 22);
  return (
    <div style={{ width: CONTENT_W }}>
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.02,
          color,
          textWrap: "balance",
          clipPath: `inset(-10% ${(1 - p) * 100}% -10% 0)`,
          transform: `translateX(${(1 - p) * -40}px)`,
        }}
      >
        {text}
      </div>
      <div style={{ height: 8, width: 200 * u, background: RED, marginTop: 14 }} />
    </div>
  );
};

// A lower-third: navy panel, red rule, white text.
const Fact: React.FC<{ text: string; delay: number; size?: number; font?: string; width?: number }> = ({
  text,
  delay,
  size = 46,
  font = sans,
  width = CONTENT_W,
}) => {
  const p = useIn(delay, 16);
  return (
    <div
      style={{
        width,
        boxSizing: "border-box",
        background: "rgba(10,22,48,0.94)",
        borderLeft: `10px solid ${RED}`,
        padding: "16px 28px",
        fontFamily: font,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.15,
        color: WHITE,
        opacity: p,
        transform: `translateX(${(1 - p) * -60}px)`,
      }}
    >
      {text}
    </div>
  );
};

const Star: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <polygon
      points="12,1.8 15,8.6 22.4,9.3 16.8,14.2 18.5,21.5 12,17.7 5.5,21.5 7.2,14.2 1.6,9.3 9,8.6"
      fill={RED}
    />
  </svg>
);

const ProjectCard: React.FC<{ delay: number; big?: boolean }> = ({ delay, big }) => {
  const p = useIn(delay, 20);
  const s = useIn(delay + 18, 40);
  const stars = Math.round(KEPT.stars * s);
  const logo = big ? 220 : 170;
  return (
    <div
      style={{
        width: CONTENT_W,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: big ? 34 : 28,
        background: "rgba(10,22,48,0.95)",
        borderLeft: `10px solid ${RED}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 50}px)`,
      }}
    >
      <Img
        src={videoAsset(SLUG, KEPT.avatar)}
        style={{ width: logo, height: logo, borderRadius: 28, objectFit: "cover" }}
      />
      <div style={{ color: WHITE }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: big ? 130 : 104, lineHeight: 1 }}>
          Kept
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 12,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 64,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <Star size={58} />
          {stars}
          <span style={{ fontFamily: sans, fontWeight: 500, fontSize: 38 }}>stars</span>
        </div>
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 36, marginTop: 8, opacity: 0.85 }}>
          {KEPT.license} · {KEPT.language}
        </div>
      </div>
    </div>
  );
};

// The shared frame of a shot: picture, bar, ticker, content area.
const ShotFrame: React.FC<{
  start: number;
  len: number;
  topic: string;
  ticker: { from: number; items: string[] }[];
  counter?: number;
  counterAt?: number;
  bg: React.ComponentProps<typeof Backdrop>;
  children: React.ReactNode;
}> = ({ start, len, topic, ticker, counter, counterAt = 6, bg, children }) => (
  <AbsoluteFill style={{ background: NAVY_DEEP }}>
    <Backdrop {...bg} len={len} />
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 430,
        width: CONTENT_W,
        height: 890,
      }}
    >
      {counter !== undefined && <Counter n={counter} at={counterAt} start={start} />}
      {children}
    </div>
    <TopBar topic={topic} />
    <TickerPhased phases={ticker} />
  </AbsoluteFill>
);

// Region under the counter (or at the top when there is none).
const Region: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", left: 0, top, width: CONTENT_W, bottom: 0 }}>
    <AbsoluteFill>{children}</AbsoluteFill>
  </div>
);

const Col: React.FC<{ gap?: number; children: React.ReactNode }> = ({ gap = 22, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap, width: CONTENT_W }}>{children}</div>
);

const off = (id: string, start: number) => SF[id] - start;

// ---------- shot 1: hook ----------

const Shot1: React.FC = () => {
  const start = STARTS[0];
  const len = LENS[0];
  const b = off("s2", start);
  const bigIn = useIn(4, 22);
  return (
    <AbsoluteFill>
    <ShotFrame
      start={start}
      len={len}
      topic="Kept trên VPS"
      ticker={[
        { from: 0, items: ["Kept trên VPS", "1 GB RAM, 1 CPU"] },
        { from: b, items: ["Inventory cho cả nhà", "Nhà", "Gara", "Kho"] },
      ]}
      bg={{ file: "footage/developer-organizing-home-storage-pixabay-215189.mp4", clip: 51, len, focus: "40% 50%" }}
    >
      <Region top={0}>
        <Phase from={0} to={b}>
          <Col gap={26}>
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 360,
                lineHeight: 0.9,
                color: RED,
                letterSpacing: -10,
                opacity: bigIn,
                transform: `translateY(${(1 - bigIn) * 60}px) scale(${1 + 0.04 * hit(MAP.beats, start + 0, 14)})`,
                transformOrigin: "0 50%",
              }}
            >
              1 GB
            </div>
            <H text="RAM vẫn đủ?" size={150} delay={14} />
            <Fact text="Kept trên VPS" delay={64} size={54} />
            <Fact text="1 GB RAM, 1 CPU" delay={80} size={54} />
          </Col>
        </Phase>
        <Phase from={b}>
          <Col gap={26}>
            <H text="Inventory cho cả nhà" size={118} delay={0} />
            <ProjectCard delay={26} big />
            <div style={{ display: "flex", gap: 18, width: CONTENT_W }}>
              {["Nhà", "Gara", "Kho"].map((t, i) => (
                <Fact key={t} text={t} delay={150 + i * 34} size={56} width={(CONTENT_W - 36) / 3} />
              ))}
            </div>
          </Col>
        </Phase>
      </Region>
      <Sfx id="thud" volume={0.45} />
      <Sfx id="pop" at={b + 26} volume={0.25} />
    </ShotFrame>
    <Brand />
    </AbsoluteFill>
  );
};

// ---------- shot 2: 1/3 inventory ----------

const ATTRS = ["Vị trí", "Hộp", "Ảnh", "Giấy tờ", "Giao dịch", "Tag", "Số lượng", "Lịch sử"];

const QR: React.FC<{ size: number }> = ({ size }) => {
  const f = useCurrentFrame();
  const n = 21;
  const cell = size / n;
  const finder = (x: number, y: number) => x < 7 && y < 7 ? true : x > 13 && y < 7 ? true : x < 7 && y > 13;
  const ring = (x: number, y: number) => {
    const fx = x > 13 ? x - 14 : x;
    const fy = y > 13 ? y - 14 : y;
    const m = Math.max(Math.abs(fx - 3), Math.abs(fy - 3));
    return m === 3 || m <= 1;
  };
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const on = finder(x, y) ? ring(x, y) : ((x * 7 + y * 13 + x * y * 3) % 5) % 2 === 0 && (x + y) % 3 !== 1;
      if (on) cells.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell + 0.5} height={cell + 0.5} fill={NAVY} />);
    }
  const scan = ((f - 80) % 110) / 110;
  return (
    <div style={{ position: "relative", width: size + 40, height: size + 40, background: WHITE, padding: 20, boxSizing: "border-box" }}>
      <svg width={size} height={size}>{cells}</svg>
      {f > 80 && (
        <div
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            top: 20 + Math.abs(scan * 2 - 1) * size - 3,
            height: 6,
            background: RED,
          }}
        />
      )}
    </div>
  );
};

const IsoMap: React.FC = () => {
  const f = useCurrentFrame();
  const plate = (cx: number, cy: number, w: number, h: number, delay: number, fill: string) => {
    const p = interpolate(f, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
    return (
      <g opacity={p} transform={`translate(0 ${(1 - p) * -40})`}>
        <polygon
          points={`${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`}
          fill={fill}
          stroke={WHITE}
          strokeWidth={4}
        />
        <polygon
          points={`${cx - w / 2},${cy} ${cx},${cy + h / 2} ${cx + w / 2},${cy} ${cx + w / 2},${cy + 22} ${cx},${cy + h / 2 + 22} ${cx - w / 2},${cy + 22}`}
          fill="rgba(255,255,255,0.18)"
          stroke={WHITE}
          strokeWidth={3}
        />
      </g>
    );
  };
  const line = (y: number, delay: number) => {
    const p = interpolate(f, [delay, delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
    return <line x1={400} y1={y} x2={400 + 90 * p} y2={y} stroke={RED} strokeWidth={5} />;
  };
  const label = (y: number, t: string, delay: number) => {
    const p = interpolate(f, [delay + 8, delay + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <text x={505} y={y + 16} fill={WHITE} fontFamily={display} fontWeight={800} fontSize={52} opacity={p}>
        {t}
      </text>
    );
  };
  const cubeP = interpolate(f, [150, 168], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <svg width={CONTENT_W * 0.8} height={376} viewBox="0 0 777 470">
      {plate(220, 360, 400, 150, 20, "rgba(10,22,48,0.9)")}
      {plate(220, 235, 300, 112, 70, "rgba(10,22,48,0.9)")}
      {plate(220, 120, 190, 72, 120, "rgba(10,22,48,0.9)")}
      <g opacity={cubeP} transform={`translate(0 ${(1 - cubeP) * -30})`}>
        <polygon points="220,60 250,76 220,92 190,76" fill={WHITE} />
        <polygon points="190,76 220,92 220,124 190,108" fill={RED} />
        <polygon points="220,92 250,76 250,108 220,124" fill="rgba(255,255,255,0.7)" />
      </g>
      {line(360, 30)}
      {label(360, "Tầng", 30)}
      {line(235, 80)}
      {label(235, "Phòng", 80)}
      {line(110, 130)}
      {label(110, "Kệ và hộp", 130)}
    </svg>
  );
};

const Shot2: React.FC = () => {
  const start = STARTS[1];
  const len = LENS[1];
  const b = off("s4", start);
  const c = off("s5", start);
  const at = nextOf(MAP.drops, start) - start;
  return (
    <ShotFrame
      start={start}
      len={len}
      topic="Kho đồ có ngữ cảnh"
      counter={1}
      counterAt={at}
      ticker={[
        { from: 0, items: ["Ảnh, giấy tờ, bảo hành", "Vị trí, hộp, lịch sử"] },
        { from: b, items: ["ID ngắn", "QR cho từng hộp", "In nhãn, quét, mở hộp"] },
        { from: c, items: ["Bản đồ 3D", "Tầng, phòng, kệ và hộp", "Graph: quan hệ địa điểm và đồ vật"] },
      ]}
      bg={{ file: "footage/warehouse-shelves-boxes-pixabay-43658.mp4", clip: 10, rate: 0.6, len, focus: "50% 55%" }}
    >
      <Region top={205}>
        <Phase from={0} to={b}>
          <Col gap={24}>
            <H text="Không chỉ danh sách" size={100} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px", width: CONTENT_W }}>
              {ATTRS.map((t, i) => (
                <Fact key={t} text={t} delay={130 + i * 30} size={50} font={display} width={(CONTENT_W - 18) / 2} />
              ))}
            </div>
            <Fact text="Tìm lại đồ có ngữ cảnh" delay={420} size={50} />
          </Col>
        </Phase>
        <Phase from={b} to={c}>
          <Col gap={24}>
            <H text="Quét QR mở đúng hộp" size={96} />
            <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
              <QRIn />
              <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                {["In nhãn", "Quét một cái", "Mở thẳng hộp"].map((t, i) => (
                  <Fact key={t} text={`${i + 1}. ${t}`} delay={60 + i * 60} size={44} width={CONTENT_W - 330 - 30} />
                ))}
              </div>
            </div>
            <Fact text="ID ngắn" delay={250} size={50} />
          </Col>
        </Phase>
        <Phase from={c}>
          <Col gap={20}>
            <H text="Bản đồ 3D của nhà" size={100} />
            <IsoMap />
          </Col>
        </Phase>
      </Region>
      <Sfx id="whoosh" at={0} volume={0.3} />
      <Sfx id="thud" at={at} volume={0.5} />
      <Sfx id="pop" at={b + 60} volume={0.25} />
      <Sfx id="ding" at={b + 90} volume={0.2} />
      <Sfx id="pop" at={c + 20} volume={0.25} />
    </ShotFrame>
  );
};

const QRIn: React.FC = () => {
  const p = useIn(10, 20);
  return (
    <div style={{ opacity: p, transform: `translateX(${(1 - p) * -50}px)` }}>
      <QR size={290} />
    </div>
  );
};

// ---------- shot 3: 2/3 AI + MCP ----------

const Step: React.FC<{ text: string; delay: number; last?: boolean; hot?: boolean }> = ({
  text,
  delay,
  last,
  hot,
}) => {
  const p = useIn(delay, 16);
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 24, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 30 }}>
        <div style={{ width: 30, height: 30, borderRadius: 15, background: hot ? RED : WHITE }} />
        {!last && <div style={{ flex: 1, width: 5, background: WHITE, opacity: 0.8 }} />}
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 54,
          lineHeight: 1,
          color: hot ? RED : WHITE,
          paddingBottom: last ? 0 : 26,
          marginTop: -6,
          textShadow: "0 2px 14px rgba(6,13,31,0.8)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Typed: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const f = useCurrentFrame();
  const p = useIn(delay - 6, 14);
  const n = Math.max(0, Math.min(text.length, Math.floor((f - delay) * 0.7)));
  return (
    <div
      style={{
        width: CONTENT_W,
        boxSizing: "border-box",
        background: WHITE,
        color: NAVY,
        padding: "26px 32px",
        fontFamily: display,
        fontWeight: 800,
        fontSize: 60,
        minHeight: 110,
        opacity: p,
      }}
    >
      {text.slice(0, n)}
      <span style={{ color: RED, opacity: Math.floor(f / 16) % 2 === 0 ? 1 : 0 }}>|</span>
    </div>
  );
};

const Shot3: React.FC = () => {
  const start = STARTS[2];
  const len = LENS[2];
  const b = off("s7", start);
  const at = nextOf(MAP.beats, start + 4) - start;
  return (
    <ShotFrame
      start={start}
      len={len}
      topic="AI trong kho đồ"
      counter={2}
      counterAt={at}
      ticker={[
        { from: 0, items: ["AI đề xuất, anh em duyệt", "OpenAI", "Anthropic", "Google, Ollama"] },
        { from: b, items: ["MCP: read hoặc read-write", "Không có công cụ xóa", "Hỏi vị trí cái khoan"] },
      ]}
      bg={{ file: "footage/artificial-intelligence-chip-circuit-pixabay-267058.mp4", clip: 20, rate: 0.8, len, focus: "50% 50%" }}
    >
      <Region top={205}>
        <Phase from={0} to={b}>
          <Col gap={26}>
            <H text="AI đề xuất, anh em duyệt" size={96} />
            <div style={{ marginTop: 6 }}>
              <Step text="Chụp đồ hoặc hóa đơn" delay={20} />
              <Step text="AI đề xuất thông tin" delay={70} />
              <Step text="Chờ anh em xác nhận" delay={130} last hot />
            </div>
            <div style={{ display: "flex", gap: 14, width: CONTENT_W }}>
              <Fact text="OpenAI" delay={190} size={42} width={(CONTENT_W - 28) / 3} />
              <Fact text="Anthropic" delay={210} size={42} width={(CONTENT_W - 28) / 3} />
              <Fact text="Google, Ollama" delay={230} size={42} width={(CONTENT_W - 28) / 3} />
            </div>
          </Col>
        </Phase>
        <Phase from={b}>
          <Col gap={26}>
            <H text="Hỏi kho đồ bằng ngôn ngữ tự nhiên" size={84} />
            <Typed text="Cái khoan nằm ở đâu?" delay={26} />
            <Fact text="Read hoặc read-write" delay={120} size={50} />
            <Fact text="Không có công cụ xóa" delay={150} size={50} />
            <Fact text="địa-chỉ-Kept/mcp" delay={220} size={46} font={mono} />
          </Col>
        </Phase>
      </Region>
      <Sfx id="whoosh" at={0} volume={0.3} />
      <Sfx id="pop" at={at} volume={0.3} />
      <Sfx id="ding" at={b + 220} volume={0.2} />
    </ShotFrame>
  );
};

// ---------- shot 4: 3/3 install ----------

const CMDS = script.scenes.find((s) => s.id === "s8")!.commands;
const TERM_AT = 150;

const Shot4: React.FC = () => {
  const start = STARTS[3];
  const len = LENS[3];
  const b = off("s9", start);
  const at = nextOf(MAP.beats, start + 4) - start;
  const tp = useIn(TERM_AT, 16);
  return (
    <ShotFrame
      start={start}
      len={len}
      topic="Cài và giữ an toàn"
      counter={3}
      counterAt={at}
      ticker={[
        { from: 0, items: ["Docker Compose v2", "Cổng mặc định: 8080", "PostgreSQL 18 và pgvector"] },
        { from: b, items: ["Recovery kit ngoài server", "HTTPS khi cần camera", "App offline, push, location"] },
      ]}
      bg={{ file: "footage/server-room-security-monitoring-pixabay-171185.mp4", clip: 21, len, focus: "50% 50%" }}
    >
      <Region top={205}>
        <Phase from={0} to={b}>
          <Col gap={24}>
            <H text="Cài bằng Docker Compose" size={88} />
            <Fact text="Docker Compose v2" delay={30} size={50} />
            <Fact text="Cổng mặc định: 8080" delay={60} size={50} />
            <Fact text="PostgreSQL 18 và pgvector" delay={90} size={50} />
          </Col>
          <Sequence from={TERM_AT} layout="none">
            <div style={{ position: "absolute", left: 0, top: 225, opacity: tp, transform: `translateY(${(1 - tp) * 40}px)` }}>
              <Terminal cmds={CMDS} fontSize={36} minHeight={430} bg={NAVY_DEEP} accent={RED} />
            </div>
            <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(CMDS)} volume={0.25} />
          </Sequence>
        </Phase>
        <Phase from={b}>
          <Col gap={20}>
            <H text="Đừng bỏ qua HTTPS" size={84} />
            <Fact text="Recovery kit ngoài server" delay={30} size={52} />
            <Fact text="HTTPS cho:" delay={90} size={46} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 18px", width: CONTENT_W }}>
              {["Camera", "App offline", "Push", "Location"].map((t, i) => (
                <Fact key={t} text={t} delay={130 + i * 30} size={50} font={display} width={(CONTENT_W - 18) / 2} />
              ))}
            </div>
          </Col>
          <Sfx id="pop" at={30} volume={0.25} />
          <Sfx id="ding" at={130} volume={0.2} />
        </Phase>
      </Region>
      <Sfx id="whoosh" at={0} volume={0.3} />
      <Sfx id="pop" at={at} volume={0.3} />
    </ShotFrame>
  );
};

// ---------- shot 5: data + sign off ----------

const Shot5: React.FC = () => {
  const start = STARTS[4];
  const len = LENS[4];
  const b = off("s11", start);
  const c = off("s12", start);
  return (
    <ShotFrame
      start={start}
      len={len}
      topic="Dữ liệu của anh em"
      ticker={[
        { from: 0, items: ["Không telemetry", "Backup mã hóa", "Restic, S3, SFTP"] },
        { from: b, items: ["Chụp và quét", "Nhắc bảo hành", "Theo dõi khoản mượn"] },
        { from: c, items: ["Lưu lại để thử", "Kept trên VPS", "Follow để xem thêm"] },
      ]}
      bg={{ file: "footage/developer-organizing-home-storage-pixabay-215189.mp4", clip: 51, trim: 18, len, focus: "60% 50%" }}
    >
      <Region top={0}>
        <Phase from={0} to={b}>
          <Col gap={26}>
            <H text="Dữ liệu vẫn trong tay mình" size={100} />
            <Fact text="Không telemetry" delay={100} size={60} />
            <Fact text="Backup mã hóa" delay={170} size={60} />
            <Fact text="Restic, S3, SFTP" delay={260} size={60} />
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 20 }}>
              <Img src={videoAsset(SLUG, KEPT.avatar)} style={{ width: 100, height: 100, borderRadius: 22 }} />
              <span style={{ fontFamily: display, fontWeight: 800, fontSize: 64, color: WHITE }}>Kept</span>
            </div>
          </Col>
        </Phase>
        <Phase from={b} to={c}>
          <Col gap={26}>
            <H text="Quản lý sau khi nhập kho" size={110} />
            {["Chụp và quét, cả offline", "Nhắc hạn bảo hành", "Theo dõi khoản mượn", "Tồn kho thấp"].map((t, i) => (
              <Fact key={t} text={t} delay={90 + i * 80} size={54} />
            ))}
            <Fact text="App, email, push, ntfy, Telegram, calendar" delay={440} size={40} />
          </Col>
        </Phase>
        <Phase from={c}>
          <Col gap={28}>
            <H text="Lưu lại để thử" size={110} />
            <ProjectCard delay={20} big />
            <Fact text="Kept trên VPS" delay={90} size={50} />
            <Fact text="Follow để xem thêm" delay={120} size={50} />
          </Col>
        </Phase>
      </Region>
      <Sfx id="whoosh" at={0} volume={0.3} />
      <Sfx id="pop" at={c + 20} volume={0.3} />
      <Sfx id="ding" at={c + 60} volume={0.2} />
    </ShotFrame>
  );
};

// ---------- video ----------

const SHOTS = [Shot1, Shot2, Shot3, Shot4, Shot5];
const DIRS = ["from-left", "from-right", "from-left", "from-right"] as const;

const KeptVideo: React.FC<VideoProps> = () => (
  <AbsoluteFill style={{ background: NAVY_DEEP }}>
    <TransitionSeries>
      {SHOTS.flatMap((Shot, i) => {
        const items = [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={LENS[i]}>
            <Shot />
          </TransitionSeries.Sequence>,
        ];
        if (i < SHOTS.length - 1)
          items.push(
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={wipe({ direction: DIRS[i] })}
              timing={linearTiming({ durationInFrames: T })}
            />,
          );
        return items;
      })}
    </TransitionSeries>
    {IDS.map((id) => (
      <Sequence key={id} from={SF[id]} layout="none">
        <Voice slug={SLUG} id={id} />
      </Sequence>
    ))}
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: KeptVideo,
  durationInFrames: TOTAL,
};
