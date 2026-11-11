// News desk bulletin: 5 long shots, each building in place over its own
// full-frame picture. Scene changes inside a shot use a quick red wipe.
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Loop,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
} from "remotion";
import {
  BRAND_SPACE,
  Brand,
  CONTENT_W,
  display,
  easeOut,
  enter,
  FPS,
  mono,
  Music,
  SAFE,
  sans,
  Sfx,
  Terminal,
  typingFrames,
  TYPE_DELAY,
  useIn,
  videoAsset,
  Voice,
  type VideoDef,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import timeline from "./timeline.json";

const SLUG = "moli-rust-headless-browser";
const NAVY = "#0A1736";
const DEEP = "#050C20";
const RED = "#FF3B3B";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.55)";

const repo = facts.repos[0];
const STARS = repo.stars.toLocaleString("en-US");
const T = 12; // wipe between shots, frames

type Scene = { id: string; start: number; len: number };
const sc = (id: string): Scene => {
  const t = (timeline.scenes as Record<string, { start: number; length: number }>)[id];
  return { id, start: Math.round(t.start * FPS), len: Math.round(t.length * FPS) };
};
const dur = (id: string) => (durations as Record<string, number>)[id];

type ShotDef = {
  scenes: string[];
  footage: string;
  clip: number; // seconds of the clip to loop
  pos: string;
  label: string;
  ticker: number;
};
const SHOTS: ShotDef[] = [
  { scenes: ["s1", "s2"], footage: "frustrated-developer-looking-at-server-t-pixabay-171185.mp4", clip: 19, pos: "50% 40%", label: "Vấn đề", ticker: 0 },
  { scenes: ["s3", "s4", "s5"], footage: "server-rack-blinking-lights-in-datacente-pixabay-14900.mp4", clip: 22, pos: "50% 50%", label: "Cách hoạt động", ticker: 0 },
  { scenes: ["s6", "s7"], footage: "programming-code-on-monitor-pixabay-28320.mp4", clip: 4.5, pos: "50% 50%", label: "Kết quả", ticker: 0 },
  { scenes: ["s8", "s9"], footage: "typing-on-keyboard-hacker-pixabay-3174.mp4", clip: 11, pos: "50% 50%", label: "Cách dùng", ticker: 0 },
  { scenes: ["s10"], footage: "developer-smiling-closing-laptop-pixabay-1625.mp4", clip: 14, pos: "50% 50%", label: "Kết", ticker: 0 },
];
const TOTAL = Math.round(timeline.total * FPS);
const shotStart = (i: number) => sc(SHOTS[i].scenes[0]).start;
const shotNominal = (i: number) =>
  (i + 1 < SHOTS.length ? shotStart(i + 1) : TOTAL) - shotStart(i);

// ---------- shared pieces ----------

const Backdrop: React.FC<{ s: ShotDef; len: number }> = ({ s, len }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, len], [1.04, 1.2]);
  const clipFrames = Math.floor(s.clip * FPS);
  return (
    <AbsoluteFill style={{ background: DEEP, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Loop durationInFrames={clipFrames}>
          <OffthreadVideo
            src={videoAsset(SLUG, `footage/${s.footage}`)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos }}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(6,14,40,${/typing|laptop/.test(s.footage) ? 0.7 : 0.52})` }} />
    </AbsoluteFill>
  );
};

const Counter: React.FC<{ n: number; label: string }> = ({ n, label }) => {
  const p = useIn(4, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + BRAND_SPACE,
        display: "flex",
        alignItems: "flex-end",
        gap: 28,
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 190,
          lineHeight: 0.82,
          color: WHITE,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: -4,
        }}
      >
        {n}
        <span style={{ color: RED }}>/</span>
        <span style={{ fontSize: 120, color: MUTED }}>{SHOTS.length}</span>
      </div>
      <div style={{ fontFamily: sans, paddingBottom: 4 }}>
        <div style={{ color: RED, fontWeight: 700, fontSize: 40 }}>Tin nóng</div>
        <div style={{ color: WHITE, fontWeight: 700, fontSize: 40 }}>{label}</div>
      </div>
    </div>
  );
};

const TICKER =
  `Moli: trình duyệt headless bằng Rust   /   ${STARS} sao trên GitHub   /   ${repo.license}   /   1 tiến trình, 24 luồng   /   78 MiB so với 734 MiB   /   Lexbench 93.10%   /   `;

const Ticker: React.FC<{ offset: number }> = ({ offset }) => {
  const frame = useCurrentFrame() + offset;
  const phase = (frame * 2.4) % 2400;
  const item = (
    <span style={{ whiteSpace: "pre" }}>{TICKER}</span>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 1366,
        width: CONTENT_W,
        height: 74,
        background: WHITE,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        borderTop: `6px solid ${RED}`,
        boxSizing: "border-box",
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 34,
        color: NAVY,
      }}
    >
      <div style={{ color: RED, fontWeight: 800, padding: "0 20px", whiteSpace: "nowrap", fontFamily: display }}>
        Tin nóng
      </div>
      <div style={{ flex: 1, overflow: "hidden", height: "100%", display: "flex", alignItems: "center" }}>
        <TickerRun phase={phase} item={item} />
      </div>
    </div>
  );
};

// Two identical copies side by side; -50% of the pair's own width is one full loop.
const TickerRun: React.FC<{ phase: number; item: ReactNode }> = ({ phase, item }) => (
  <div
    style={{
      display: "flex",
      width: "max-content",
      transform: `translateX(${-(phase / 2400) * 50}%)`,
    }}
  >
    {item}
    {item}
    {item}
    {item}
  </div>
);

const Hl: React.FC<{ children: ReactNode; size?: number; delay?: number }> = ({
  children,
  size = 88,
  delay = 0,
}) => {
  const p = useIn(delay, 16);
  return (
    <div
      style={{
        ...enter(p, 36),
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        color: WHITE,
        textWrap: "balance",
        letterSpacing: -1.5,
      }}
    >
      {children}
    </div>
  );
};

// Lower third: a navy strip with a red edge, sliding in from the left.
const LT: React.FC<{ text: ReactNode; delay: number; size?: number; style?: CSSProperties }> = ({
  text,
  delay,
  size = 40,
  style,
}) => {
  const p = useIn(delay, 16);
  return (
    <div
      style={{
        alignSelf: "flex-start",
        maxWidth: CONTENT_W,
        boxSizing: "border-box",
        background: "rgba(6,14,38,0.92)",
        borderLeft: `10px solid ${RED}`,
        padding: "14px 28px",
        fontFamily: sans,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.2,
        color: WHITE,
        opacity: p,
        transform: `translateX(${(1 - p) * -80}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

const Star: React.FC<{ size: number; color?: string }> = ({ size, color = RED }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 1.8l3 6.6 7.2.8-5.4 4.8 1.5 7.1L12 17.4l-6.3 3.7 1.5-7.1L1.8 9.2 9 8.4z" fill={color} />
  </svg>
);

const useCount = (to: number, delay: number, frames = 40) => {
  const f = useCurrentFrame();
  return Math.round(
    interpolate(f, [delay, delay + frames], [0, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    }),
  );
};

const Col: React.FC<{ children: ReactNode; gap?: number; justify?: CSSProperties["justifyContent"] }> = ({
  children,
  gap = 24,
  justify = "space-between",
}) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      top: 548,
      width: CONTENT_W,
      height: 800,
      display: "flex",
      flexDirection: "column",
      justifyContent: justify,
      gap,
    }}
  >
    {children}
  </div>
);

// News card: white panel, navy text, logo + name + real star count.
const RepoCard: React.FC<{ delay: number; big?: boolean }> = ({ delay, big = true }) => {
  const p = useIn(delay, 18);
  const av = big ? 150 : 120;
  return (
    <div
      style={{
        ...enter(p, 50),
        width: CONTENT_W,
        boxSizing: "border-box",
        background: WHITE,
        borderTop: `10px solid ${RED}`,
        padding: big ? "28px 34px" : "20px 28px",
        display: "flex",
        alignItems: "center",
        gap: 30,
        fontFamily: sans,
        color: NAVY,
      }}
    >
      <Img
        src={videoAsset(SLUG, repo.avatar)}
        style={{ width: av, height: av, borderRadius: 24, objectFit: "cover", flex: "none" }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: big ? 96 : 70, lineHeight: 1 }}>
          {repo.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: big ? 12 : 6,
            fontWeight: 700,
            fontSize: big ? 52 : 40,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <Star size={big ? 54 : 40} />
          {STARS}
          <span style={{ fontWeight: 500, fontSize: big ? 36 : 34, color: "#44506e" }}>sao</span>
        </div>
        {big && (
          <div style={{ fontWeight: 500, fontSize: 36, color: "#44506e", marginTop: 8 }}>
            {repo.language} · {repo.license}
          </div>
        )}
      </div>
    </div>
  );
};

const BarRow: React.FC<{
  name: string;
  value: string;
  ratio: number;
  delay: number;
  hero?: boolean;
  nameW?: number;
  valueW?: number;
}> = ({ name, value, ratio, delay, hero, nameW = 190, valueW = 215 }) => {
  const f = useCurrentFrame();
  const p = useIn(delay, 30);
  const grow = interpolate(f, [delay, delay + 40], [0, ratio], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: p,
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 38,
        color: WHITE,
        height: 52,
      }}
    >
      <div style={{ width: nameW, color: hero ? WHITE : MUTED }}>{name}</div>
      <div style={{ flex: 1, height: 30, background: "rgba(255,255,255,0.12)" }}>
        <div
          style={{
            width: `${grow * 100}%`,
            height: "100%",
            background: hero ? WHITE : "rgba(255,255,255,0.5)",
          }}
        />
      </div>
      <div style={{ width: valueW, textAlign: "right", fontVariantNumeric: "tabular-nums", color: hero ? WHITE : MUTED }}>
        {value}
      </div>
    </div>
  );
};

const GroupTitle: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const p = useIn(delay, 14);
  return (
    <div style={{ ...enter(p, 16), fontFamily: display, fontWeight: 800, fontSize: 46, color: WHITE, marginBottom: 6 }}>
      {text}
    </div>
  );
};

// ---------- scenes ----------

const S1: React.FC = () => {
  const n = useCount(734, 10, 50);
  const p = useIn(10, 16);
  const line = useIn(60, 20);
  return (
    <Col>
      <Hl>Chromium ngốn kiệt RAM VPS</Hl>
      <div style={{ ...enter(p, 40) }}>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 44, color: MUTED }}>Chrome: RAM</div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 300,
            lineHeight: 0.95,
            color: WHITE,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -6,
          }}
        >
          {n}
          <span style={{ fontSize: 90, letterSpacing: 0, marginLeft: 16 }}>MiB</span>
        </div>
        <div style={{ height: 12, width: CONTENT_W * line, background: RED, marginTop: 10 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <LT text="Đẻ 11 tiến trình / 123 luồng" delay={90} />
        <LT text="Dễ sập VPS cấu hình thấp" delay={190} />
      </div>
    </Col>
  );
};

const S2: React.FC = () => (
  <Col>
    <RepoCard delay={4} />
    <Hl delay={40}>Moli viết bằng Rust độc lập</Hl>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <LT text="Browser kernel độc lập" delay={120} />
      <LT text="Không phải bản bọc Chromium" delay={180} />
      <LT text="Mã nguồn mở Apache-2.0" delay={260} />
    </div>
  </Col>
);

const S3: React.FC = () => {
  const f = useCurrentFrame();
  const strike = interpolate(f, [215, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const flick = f < 215 ? 0.82 + 0.18 * Math.sin(f * 0.9) : 0.45;
  const p = useIn(30, 16);
  return (
    <Col>
      <Hl>Không vẽ<br />giao diện thừa</Hl>
      <div style={{ ...enter(p, 40), position: "relative", alignSelf: "flex-start" }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 270,
            lineHeight: 1,
            color: WHITE,
            opacity: flick,
            letterSpacing: -6,
          }}
        >
          paint
        </div>
        <div
          style={{
            position: "absolute",
            left: -10,
            top: "52%",
            height: 20,
            width: `calc(${strike * 100}% + 20px)`,
            background: RED,
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <LT text="Thường thì: Chrome render liên tục" delay={40} />
        <LT text="Còn Moli: xử lý DOM và JS trên RAM" delay={215} />
        <LT text="Bỏ qua bước paint tốn tài nguyên" delay={330} />
      </div>
    </Col>
  );
};

const Duel: React.FC<{ name: string; a: number; b: number; delay: number; hero?: boolean }> = ({
  name,
  a,
  b,
  delay,
  hero,
}) => {
  const p = useIn(delay, 18);
  const na = useCount(a, delay, 22);
  const nb = useCount(b, delay + 6, 30);
  const c = hero ? WHITE : MUTED;
  const num: CSSProperties = {
    fontFamily: display,
    fontWeight: 800,
    fontSize: 175,
    lineHeight: 0.95,
    color: c,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: -4,
  };
  const unit: CSSProperties = { fontFamily: sans, fontWeight: 700, fontSize: 38, color: c };
  return (
    <div style={{ ...enter(p, 40), borderLeft: `10px solid ${hero ? RED : "rgba(255,255,255,0.3)"}`, paddingLeft: 28 }}>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 46, color: c }}>{name}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
        <div>
          <div style={num}>{na}</div>
          <div style={unit}>tiến trình</div>
        </div>
        <div>
          <div style={num}>{nb}</div>
          <div style={unit}>luồng</div>
        </div>
      </div>
    </div>
  );
};

const S4: React.FC = () => (
  <Col>
    <Hl size={74}>1 tiến trình duy nhất</Hl>
    <Duel name="Chromium" a={11} b={123} delay={20} />
    <Duel name="Moli" a={1} b={24} delay={215} hero />
    <LT text="Cắt giảm tải tối đa cho CPU" delay={370} />
  </Col>
);

const S5: React.FC = () => (
  <Col>
    <Hl size={80}>
      Tiết kiệm <span style={{ color: RED }}>gần 90%</span> bộ nhớ
    </Hl>
    <div>
      <GroupTitle text="RAM đỉnh" delay={10} />
      <BarRow name="Chrome" value="734 MiB" ratio={1} delay={20} />
      <BarRow name="Moli" value="78 MiB" ratio={78 / 734} delay={50} hero />
    </div>
    <div>
      <GroupTitle text="Khởi động CDP" delay={260} />
      <BarRow name="Chrome" value="169.37 ms" ratio={1} delay={270} />
      <BarRow name="Moli" value="34.85 ms" ratio={34.85 / 169.37} delay={300} hero />
    </div>
    <div>
      <GroupTitle text="CPU trung vị" delay={420} />
      <BarRow name="Chrome" value="177 ms" ratio={1} delay={430} />
      <BarRow name="Moli" value="24 ms" ratio={24 / 177} delay={460} hero />
    </div>
  </Col>
);

const S6: React.FC = () => {
  const n = useCount(9310, 14, 50);
  const p = useIn(14, 16);
  return (
    <Col>
      <RepoCard delay={0} big={false} />
      <div style={enter(p, 40)}>
        <Hl size={66}>Tỷ lệ tương thích</Hl>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 214,
            lineHeight: 1,
            color: RED,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -5,
          }}
        >
          {Math.floor(n / 100)}.{String(n % 100).padStart(2, "0")}%
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: WHITE, marginTop: 6 }}>
          Moli 1.1.17: 1,795 / 1,928 tác vụ
        </div>
      </div>
      <div>
        <BarRow name="Moli" value="93.10%" ratio={0.931} delay={140} hero nameW={230} valueW={150} />
        <BarRow name="Lightpanda" value="81.38%" ratio={0.8138} delay={200} nameW={230} valueW={150} />
        <BarRow name="Obscura" value="60.22%" ratio={0.6022} delay={260} nameW={230} valueW={150} />
      </div>
    </Col>
  );
};

const S7: React.FC = () => {
  const p = useIn(20, 18);
  const code = ['chromium.connectOverCDP(', '  "http://127.0.0.1:9222")'];
  const f = useCurrentFrame();
  const typed = Math.floor(Math.max(0, f - 36) * 1.3);
  const t1 = code[0].slice(0, typed);
  const t2 = code[1].slice(0, Math.max(0, typed - code[0].length));
  const words = ["CDP", "WebDriver Classic", "BiDi"];
  return (
    <Col>
      <Hl size={80}>Cắm thẳng vào Playwright</Hl>
      <div
        style={{
          ...enter(p, 40),
          background: DEEP,
          borderTop: `8px solid ${RED}`,
          padding: "30px 32px",
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: "56px",
          color: WHITE,
          minHeight: 160,
          whiteSpace: "pre",
        }}
      >
        <div>{t1}</div>
        <div style={{ color: RED }}>{t2}</div>
      </div>
      <div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: MUTED, marginBottom: 6 }}>
          Hỗ trợ cả
        </div>
        {words.map((w, i) => (
          <Word key={w} text={w} delay={150 + i * 40} />
        ))}
      </div>
      <LT text="Không cần cài ChromeDriver" delay={340} />
    </Col>
  );
};

const Word: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const p = useIn(delay, 16);
  return (
    <div
      style={{
        ...enter(p, 30),
        fontFamily: display,
        fontWeight: 800,
        fontSize: 72,
        lineHeight: 1.1,
        color: WHITE,
        borderBottom: "3px solid rgba(255,255,255,0.3)",
      }}
    >
      {text}
    </div>
  );
};

const S8: React.FC = () => {
  const f = useCurrentFrame();
  const flip = interpolate(f, [120, 138], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const p = useIn(16, 18);
  const tiles = useIn(230, 18);
  return (
    <Col>
      <Hl size={80}>Bật layout khi cần thiết</Hl>
      <div style={{ ...enter(p, 40), display: "flex", alignItems: "center", gap: 36 }}>
        <svg width={220} height={118} viewBox="0 0 260 140" style={{ flex: "none" }}>
          <rect
            x={4}
            y={4}
            width={252}
            height={132}
            rx={66}
            fill={flip > 0.5 ? RED : "rgba(255,255,255,0.18)"}
            stroke={WHITE}
            strokeWidth={5}
          />
          <circle cx={70 + flip * 120} cy={70} r={50} fill={WHITE} />
        </svg>
        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 56, color: flip > 0.5 ? RED : MUTED }}>
          --layout
        </div>
      </div>
      <div style={{ position: "relative", height: 125 }}>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - flip }}>
          <LT text="Mặc định: Layout mock nhẹ" delay={30} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: flip, transform: `translateY(${(1 - flip) * 20}px)` }}>
          <LT text="Thêm --layout: dựng hình, chụp screenshot" delay={0} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 24, ...enter(tiles, 40) }}>
        {["PNG", "PDF"].map((w) => (
          <div
            key={w}
            style={{
              flex: 1,
              border: `5px solid ${WHITE}`,
              background: "rgba(6,14,38,0.8)",
              padding: "16px 0",
              textAlign: "center",
              fontFamily: display,
              fontWeight: 800,
              fontSize: 96,
              color: WHITE,
              lineHeight: 1.1,
            }}
          >
            {w}
          </div>
        ))}
      </div>
      <LT text="Xuất ảnh PNG hoặc tài liệu PDF" delay={240} />
    </Col>
  );
};

const CMDS = ["moli serve", "moli serve --layout"];
const S9: React.FC = () => (
  <Col>
    <Hl>Khởi động chỉ với một lệnh</Hl>
    <div style={{ position: "relative" }}>
      <Terminal cmds={CMDS} fontSize={52} minHeight={290} bg={DEEP} accent={RED} />
      <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(CMDS)} volume={0.25} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <LT text="Chạy automation server cơ bản" delay={60} />
      <LT text="Hoặc bật thêm layout đồ họa" delay={190} />
    </div>
    <RepoCard delay={250} big={false} />
  </Col>
);

const S10: React.FC = () => (
  <Col>
    <Hl size={80}>Tối ưu RAM cho AI Agent</Hl>
    <RepoCard delay={20} />
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <LT text="Lưu video để áp dụng" delay={70} />
      <LT text="Follow kênh để xem thêm tool hay" delay={190} />
      <LT text="Tạm biệt Chromium ngốn 700MB RAM" size={36} delay={330} style={{ borderLeftColor: WHITE }} />
    </div>
  </Col>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9, s10: S10 };

// ---------- a shot ----------

const WipeBar: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at - 9 || f > at + 9) return null;
  const x = interpolate(f, [at - 9, at + 9], [-105, 105], { easing: Easing.bezier(0.65, 0, 0.35, 1) });
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}%)`, background: RED, zIndex: 20 }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 36, background: WHITE }} />
    </AbsoluteFill>
  );
};

const Shot: React.FC<{ i: number }> = ({ i }) => {
  const s = SHOTS[i];
  const base = shotStart(i);
  const len = shotNominal(i) + T;
  const scenes = s.scenes.map(sc);
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Backdrop s={s} len={len} />
      {i === 0 && <Brand />}
      <Counter n={i + 1} label={s.label} />
      {scenes.map((c, k) => {
        const Scene = SCENES[c.id];
        const from = c.start - base;
        const last = k === scenes.length - 1;
        return (
          <Sequence key={c.id} from={from} durationInFrames={last ? len - from : c.len} name={c.id}>
            <Voice slug={SLUG} id={c.id} />
            <Scene />
          </Sequence>
        );
      })}
      {scenes.slice(1).map((c) => (
        <WipeBar key={c.id} at={c.start - base} />
      ))}
      {scenes.slice(1).map((c) => (
        <Sfx key={c.id} id="whoosh" at={c.start - base - 8} frames={40} volume={0.3} />
      ))}
      {i > 0 && <Sfx id="whoosh" at={0} frames={40} volume={0.3} />}
      <Ticker offset={base} />
    </AbsoluteFill>
  );
};

const voiceRanges: [number, number][] = Object.keys(durations).map((id) => {
  const c = sc(id);
  return [c.start, c.start + Math.round(dur(id) * FPS)];
});

const Moli: React.FC = () => (
  <AbsoluteFill style={{ background: DEEP }}>
    <TransitionSeries>
      {SHOTS.flatMap((_, i) => {
        const dir = (["from-left", "from-right"] as const)[i % 2];
        const seq = (
          <TransitionSeries.Sequence
            key={`s${i}`}
            durationInFrames={shotNominal(i) + (i + 1 < SHOTS.length ? T : 0) + (i === 0 ? 0 : 0)}
          >
            <Shot i={i} />
          </TransitionSeries.Sequence>
        );
        if (i + 1 >= SHOTS.length) return [seq];
        return [
          seq,
          <TransitionSeries.Transition
            key={`t${i}`}
            presentation={wipe({ direction: dir })}
            timing={linearTiming({ durationInFrames: T })}
          />,
        ];
      })}
    </TransitionSeries>
    <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
    <Sfx id="thud" at={sc("s4").start + 215} frames={30} volume={0.3} />
    <Sfx id="thud" at={sc("s6").start + 14} frames={30} volume={0.4} />
    <Sfx id="ding" at={sc("s10").start + 330} frames={60} volume={0.25} />
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Moli,
  durationInFrames: TOTAL,
};
