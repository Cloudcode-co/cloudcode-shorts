import { siDocker } from "simple-icons";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { AbsoluteFill, Img, Loop, OffthreadVideo, Sequence, interpolate, useCurrentFrame } from "remotion";
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
  display,
  easeOut,
  mono,
  sans,
  typingFrames,
  useIn,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import timeline from "./timeline.json";

const SLUG = "open-notebook-tu-host-notebooklm";
const NAVY = "#0A1A3A";
const DEEP = "rgba(6,17,42,0.9)";
const RED = "#E5262B";
const MUTED = "#A9BBDD";
const T = 10; // wipe frames
const repo = facts.repos[0];
const STARS = repo.stars;
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

type Sid = keyof typeof timeline.scenes;
const sf = (id: string) => Math.round(timeline.scenes[id as Sid].start * FPS);
const vf = (id: string) => Math.round((durations as Record<string, number>)[id] * FPS);
const TOTAL = Math.round(timeline.total * FPS);

type Shot = {
  scenes: string[];
  bg: string;
  clip: number;
  rate: number;
  n: number | null;
  chapter: string;
  ticker: string[];
  late?: { scene: string; bg: string; clip: number; rate: number };
};
const SHOTS: Shot[] = [
  {
    scenes: ["s1", "s2"],
    bg: "footage/laptop-notes-research-documents-pixabay-41121.mp4",
    clip: 13,
    rate: 1,
    n: null,
    chapter: "",
    ticker: ["NotebookLM riêng của anh em", "Open Notebook là gì?", "Mã nguồn mở, MIT-licensed"],
  },
  {
    scenes: ["s3", "s4", "s5", "s6"],
    bg: "footage/developer-working-desk-at-night-pixabay-42305.mp4",
    clip: 15,
    rate: 0.45,
    n: 1,
    chapter: "Riêng tư, model tùy ý",
    ticker: ["Dữ liệu nằm trong hạ tầng", "20+ provider", "Nạp cả kho tài liệu", "Có citation để kiểm tra"],
  },
  {
    scenes: ["s7"],
    bg: "footage/friends-listening-podcast-together-pixabay-245932.mp4",
    clip: 7,
    rate: 0.9,
    n: 2,
    chapter: "Tài liệu thành podcast",
    ticker: ["Episode Profiles", "1–4 speaker", "Profile tùy chỉnh"],
  },
  {
    scenes: ["s8", "s9", "s10", "s11"],
    bg: "footage/typing-code-on-laptop-pixabay-43559.mp4",
    clip: 18,
    rate: 0.5,
    n: 3,
    chapter: "Chạy thử trên máy",
    ticker: ["Docker Compose", "docker-compose.yml", "OPEN_NOTEBOOK_ENCRYPTION_KEY", "http://localhost:8502"],
  },
  {
    scenes: ["s12", "s13", "s14"],
    bg: "footage/server-room-network-racks-pixabay-171185.mp4",
    clip: 21,
    rate: 0.6,
    n: 3,
    chapter: "Lưu ý trước khi chạy",
    ticker: ["Đừng public khi chưa khóa", "Nhớ kiểm tra ma trận model", "Lưu lại để thử"],
    late: { scene: "s14", bg: "footage/laptop-notes-research-documents-pixabay-41121.mp4", clip: 13, rate: 1 },
  },
];

// ---------- pieces ----------
const Bg: React.FC<{ shot: Shot; len: number }> = ({ shot, len }) => {
  const f = useCurrentFrame();
  const s = 1.06 + 0.16 * (f / len);
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})` }}>
        <Loop durationInFrames={Math.round((shot.clip / shot.rate) * FPS) - 2}>
          <OffthreadVideo
            src={videoAsset(SLUG, shot.bg)}
            muted
            playbackRate={shot.rate}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(6,17,42,0.58)" }} />
    </AbsoluteFill>
  );
};

const TOP_H = 92;
const TickerBar: React.FC<{ items: string[] }> = ({ items }) => {
  const f = useCurrentFrame();
  const text = Array(14).fill(items.join("   •   ")).join("   •   ");
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1344,
        height: 96,
        background: NAVY,
        borderTop: `6px solid ${RED}`,
        overflow: "hidden",
        fontFamily: sans,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 0,
          height: 90,
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          fontSize: 38,
          fontWeight: 500,
          color: "#FFFFFF",
          transform: `translateX(${-f * 2.4}px)`,
        }}
      >
        {text}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 380,
          height: 90,
          background: NAVY,
          borderRight: `4px solid ${RED}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: SAFE.left,
          boxSizing: "border-box",
          fontFamily: display,
          fontWeight: 800,
          fontSize: 40,
          color: RED,
        }}
      >
        TRỰC TIẾP
      </div>
    </div>
  );
};

const TopBar: React.FC<{ y: number; shot: Shot }> = ({ y, shot }) => {
  const f = useCurrentFrame();
  const dot = 0.55 + 0.45 * Math.abs(Math.sin(f / 18));
  const c = useIn(T, 18);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y,
          height: TOP_H,
          background: NAVY,
          borderTop: `8px solid ${RED}`,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${SAFE.right}px 0 ${SAFE.left}px`,
          fontFamily: display,
          fontWeight: 800,
          fontSize: 42,
        }}
      >
        <span style={{ color: RED, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ width: 22, height: 22, borderRadius: 11, background: RED, opacity: dot }} />
          TIN NÓNG
        </span>
        <span style={{ color: "#FFFFFF" }}>Open Notebook</span>
      </div>
      {shot.n !== null && (
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            top: y + TOP_H + 14,
            display: "flex",
            alignItems: "center",
            gap: 30,
            width: CONTENT_W,
            opacity: c,
            transform: `translateX(${(1 - c) * -80}px)`,
          }}
        >
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 150,
              lineHeight: 0.9,
              color: "#FFFFFF",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: -4,
            }}
          >
            {shot.n}
            <span style={{ color: RED }}>/3</span>
          </div>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 48,
              lineHeight: 1.05,
              color: "#FFFFFF",
              textWrap: "balance",
              flex: 1,
            }}
          >
            {shot.chapter}
          </div>
        </div>
      )}
    </>
  );
};

const Hl: React.FC<{ t: string; size?: number; delay?: number }> = ({ t, size = 88, delay = 0 }) => {
  const p = useIn(delay, 16);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px)`,
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        color: "#FFFFFF",
        textWrap: "balance",
      }}
    >
      {t}
    </div>
  );
};

const Row: React.FC<{
  t: string;
  sub?: string;
  delay: number;
  size?: number;
  font?: string;
  color?: string;
}> = ({ t, sub, delay, size = 48, font = sans, color = "#FFFFFF" }) => {
  const p = useIn(delay, 14);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateX(${(1 - p) * -70}px)`,
        background: DEEP,
        borderLeft: `10px solid ${RED}`,
        padding: "16px 28px",
        fontFamily: font,
        boxSizing: "border-box",
      }}
    >
      <div style={{ fontSize: size, fontWeight: 700, lineHeight: 1.15, color }}>{t}</div>
      {sub && <div style={{ fontSize: 38, fontWeight: 500, color: MUTED, marginTop: 4 }}>{sub}</div>}
    </div>
  );
};

const Statement: React.FC<{ t: string; delay: number; size?: number }> = ({ t, delay, size = 72 }) => {
  const p = useIn(delay, 14);
  const u = useIn(delay + 8, 22);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>
      <div style={{ display: "inline-block" }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.05, color: "#FFFFFF" }}>
          {t}
        </div>
        <div style={{ height: 6, width: `${u * 100}%`, background: RED, marginTop: 8 }} />
      </div>
    </div>
  );
};

const Big: React.FC<{ t: string; size: number; delay?: number; color?: string; font?: string }> = ({
  t,
  size,
  delay = 0,
  color = RED,
  font = display,
}) => {
  const p = useIn(delay, 18);
  return (
    <div
      style={{
        opacity: p,
        transform: `scale(${1.18 - 0.18 * p})`,
        transformOrigin: "left center",
        fontFamily: font,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.95,
        color,
        letterSpacing: -2,
      }}
    >
      {t}
    </div>
  );
};

const Mono: React.FC<{ t: string; delay: number; size?: number; color?: string; strike?: number }> = ({
  t,
  delay,
  size = 40,
  color = "#FFFFFF",
  strike = 0,
}) => {
  const p = useIn(delay, 14);
  return (
    <div
      style={{
        opacity: p,
        background: DEEP,
        padding: "16px 28px",
        fontFamily: mono,
        fontWeight: 700,
        fontSize: size,
        color,
        position: "relative",
        alignSelf: "flex-start",
      }}
    >
      {t}
      {strike > 0 && (
        <div
          style={{
            position: "absolute",
            left: 28,
            top: "50%",
            height: 6,
            width: `calc(${strike * 100}% - 56px)`,
            background: "#FFFFFF",
          }}
        />
      )}
    </div>
  );
};

// stagger helper: delay of item k of n across a voice clip of v frames
const at = (k: number, n: number, v: number) => Math.round(14 + (k * Math.max(16, Math.min(70, v - 60))) / n);

// ---------- scenes ----------
type SP = { v: number };
const S1: React.FC<SP> = ({ v }) => {
  const l = ["Tự host", "Chọn model", "Tạo podcast"];
  return (
    <>
      <Hl t="NotebookLM riêng của anh em" size={116} />
      <div style={{ height: 8 }} />
      {l.map((t, i) => (
        <Row key={t} t={t} delay={at(i + 1, 4, v)} size={58} />
      ))}
    </>
  );
};

const StarCard: React.FC<{ delay: number; logo?: number }> = ({ delay, logo = 210 }) => {
  const p = useIn(delay, 18);
  const c = useIn(delay + 6, 50);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px)`,
        background: DEEP,
        borderTop: `8px solid ${RED}`,
        padding: 28,
        display: "flex",
        gap: 30,
        alignItems: "center",
      }}
    >
      <Img
        src={videoAsset(SLUG, repo.avatar)}
        style={{ width: logo, height: logo, borderRadius: 26, background: "#FFFFFF", flexShrink: 0 }}
      />
      <div style={{ fontFamily: display, color: "#FFFFFF" }}>
        <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1 }}>{repo.name}</div>
        <div style={{ fontSize: 108, fontWeight: 800, lineHeight: 1.05, color: RED, fontVariantNumeric: "tabular-nums" }}>
          {fmt(Math.round(STARS * c))}
        </div>
        <div style={{ fontFamily: sans, fontSize: 40, fontWeight: 500, color: MUTED }}>sao trên GitHub</div>
      </div>
    </div>
  );
};

const S2: React.FC<SP> = ({ v }) => (
  <>
    <Hl t="Open Notebook là gì?" size={80} />
    <StarCard delay={12} />
    {["Mã nguồn mở", "MIT-licensed", "AI cho nghiên cứu"].map((t, i) => (
      <Row key={t} t={t} delay={at(i + 1, 4, v) + 60} size={46} />
    ))}
  </>
);

const S3: React.FC<SP> = ({ v }) => (
  <>
    <Hl t="Dữ liệu nằm trong hạ tầng" size={92} />
    <div style={{ height: 10 }} />
    {["Self-hosted", "Model local", "Dữ liệu không rời máy"].map((t, i) => (
      <Statement key={t} t={t} delay={at(i + 1, 4, v) + 10} size={78} />
    ))}
  </>
);

const S4: React.FC<SP> = ({ v }) => {
  const names = ["OpenAI", "Anthropic", "Google", "Mistral", "Ollama", "LM Studio", "vLLM"];
  return (
    <>
      <Hl t="Chọn model tùy ý" size={84} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <Big t="20+" size={250} />
        <Hl t="provider" size={70} delay={10} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 40px" }}>
        {names.map((t, i) => (
          <NameTag key={t} t={t} delay={at(i + 2, 9, v)} />
        ))}
      </div>
    </>
  );
};
const NameTag: React.FC<{ t: string; delay: number }> = ({ t, delay }) => {
  const p = useIn(delay, 12);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 54,
        color: "#FFFFFF",
        borderBottom: `6px solid ${RED}`,
        lineHeight: 1.2,
      }}
    >
      {t}
    </div>
  );
};

const S5: React.FC<SP> = ({ v }) => {
  const f = ["PDF", "Video", "Audio", "Web page", "Office"];
  return (
    <>
      <Hl t="Nạp cả kho tài liệu" size={80} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {f.map((t, i) => (
          <Cell key={t} t={t} delay={at(i, 8, v)} />
        ))}
        <Cell t="và nhiều định dạng khác" delay={at(5, 8, v)} wide />
      </div>
      <Row t="Chat theo ngữ cảnh" delay={at(6, 8, v)} size={50} />
      <Row t="Tìm kiếm full-text và vector" delay={at(7, 8, v)} size={50} />
    </>
  );
};
const Cell: React.FC<{ t: string; delay: number; wide?: boolean }> = ({ t, delay, wide }) => {
  const p = useIn(delay, 12);
  return (
    <div
      style={{
        opacity: p,
        transform: `scale(${0.94 + 0.06 * p})`,
        width: wide ? "100%" : "calc(50% - 8px)",
        boxSizing: "border-box",
        background: DEEP,
        border: "3px solid rgba(255,255,255,0.35)",
        padding: "12px 26px",
        fontFamily: display,
        fontWeight: 800,
        fontSize: wide ? 42 : 56,
        color: wide ? MUTED : "#FFFFFF",
      }}
    >
      {t}
    </div>
  );
};

const CITE_H = 540;
const CITE_CARD_W = 400;
const CiteCard: React.FC<{ t: string; y: number; delay: number }> = ({ t, y, delay }) => {
  const p = useIn(delay, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: CONTENT_W - CITE_CARD_W,
        top: y,
        width: CITE_CARD_W,
        height: 150,
        boxSizing: "border-box",
        opacity: p,
        transform: `translateX(${(1 - p) * 50}px)`,
        background: DEEP,
        borderLeft: `10px solid ${RED}`,
        display: "flex",
        alignItems: "center",
        paddingLeft: 30,
        fontFamily: display,
        fontWeight: 800,
        fontSize: 68,
        color: "#FFFFFF",
      }}
    >
      {t}
    </div>
  );
};

const S6: React.FC<SP> = ({ v }) => {
  const names = ["Source", "Note", "Insight"];
  const ys = [0, 195, 390];
  const ans = useIn(10, 16);
  return (
    <>
      <Hl t="Có citation để kiểm tra" size={84} />
      <div style={{ fontFamily: sans, fontSize: 44, fontWeight: 500, color: MUTED }}>
        Câu trả lời trỏ về nguồn đã dùng
      </div>
      <div style={{ position: "relative", width: CONTENT_W, height: CITE_H }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 250,
            height: CITE_H,
            boxSizing: "border-box",
            background: DEEP,
            border: "3px solid rgba(255,255,255,0.35)",
            padding: "30px 28px",
            opacity: ans,
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          {[100, 80, 100, 60, 90, 70, 100, 50].map((w, i) => (
            <div key={i} style={{ height: 14, width: `${w}%`, background: "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
        <svg width={CONTENT_W} height={CITE_H} style={{ position: "absolute", left: 0, top: 0 }}>
          {ys.map((y, i) => {
            const d = at(i + 1, 4, v);
            const p = useIn(d, 18);
            const cy = y + 75;
            return (
              <g key={i}>
                <line x1={250} y1={cy} x2={250 + (CONTENT_W - CITE_CARD_W - 250) * p} y2={cy} stroke={RED} strokeWidth={8} />
                <circle cx={250} cy={cy} r={30} fill={RED} opacity={p} />
                <text x={250} y={cy + 13} textAnchor="middle" fontFamily={display} fontWeight={800} fontSize={38} fill="#FFFFFF" opacity={p}>
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
        {names.map((t, i) => (
          <CiteCard key={t} t={t} y={ys[i]} delay={at(i + 1, 4, v) + 8} />
        ))}
      </div>
    </>
  );
};

const S7: React.FC<SP> = ({ v }) => (
  <>
    <Hl t="Biến tài liệu thành podcast" size={80} />
    <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
      <Big t="1–4" size={290} delay={at(2, 4, v)} />
      <Hl t="speaker" size={76} delay={at(2, 4, v) + 8} />
    </div>
    <Row t="Episode Profiles" delay={at(1, 4, v)} size={50} />
    <Row t="Profile tùy chỉnh" delay={at(3, 4, v)} size={50} />
  </>
);

const TerminalAt: React.FC<{ cmds: string[]; from: number; size?: number; h: number }> = ({ cmds, from, size = 40, h }) => (
  <div style={{ height: h, position: "relative" }}>
    <Sequence from={from} layout="none">
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <Terminal cmds={cmds} width={CONTENT_W} fontSize={size} minHeight={h} bg="#050D22" accent={RED} />
      </div>
      <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(cmds)} volume={0.22} />
    </Sequence>
  </div>
);

const S8: React.FC<SP> = ({ v }) => {
  const logo = useIn(8, 18);
  return (
    <>
      <Hl t="Cài bằng Docker Compose" size={84} />
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <svg
          viewBox="0 0 24 24"
          width={170}
          height={170}
          style={{ flexShrink: 0, opacity: logo, transform: `scale(${0.9 + 0.1 * logo})` }}
        >
          <path d={siDocker.path} fill="#2496ED" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1 }}>
          <Row t="macOS · Windows" sub="Docker Desktop" delay={at(1, 4, v)} size={46} />
          <Row t="Linux" sub="Docker Engine kèm Compose plugin" delay={at(2, 4, v)} size={46} />
        </div>
      </div>
      <TerminalAt cmds={["mkdir open-notebook && cd open-notebook"]} from={Math.max(60, v - 130)} h={170} />
    </>
  );
};

const S9: React.FC<SP> = () => (
  <>
    <Hl t="Tải cấu hình" size={92} />
    <Row t="docker-compose.yml" delay={10} size={50} />
    <TerminalAt
      cmds={[
        "curl -o docker-compose.yml https://raw.githubusercontent.com/lfnovo/open-notebook/main/docker-compose.yml",
        "openssl rand -hex 32",
      ]}
      from={20}
      h={420}
    />
    <Row t="Tạo encryption key" delay={150} size={50} />
  </>
);

const CodePanel: React.FC<{ title: string; delay: number; children: React.ReactNode }> = ({ title, delay, children }) => {
  const p = useIn(delay, 14);
  return (
    <div
      style={{
        opacity: p,
        background: "#050D22",
        borderTop: `8px solid ${RED}`,
        padding: "16px 28px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ fontFamily: sans, fontSize: 38, fontWeight: 500, color: MUTED }}>{title}</div>
      {children}
    </div>
  );
};

const S10: React.FC<SP> = ({ v }) => {
  const s = useIn(150, 40);
  const n = useIn(190, 18);
  return (
    <>
      <Hl t="Đừng bỏ qua encryption key" size={80} />
      <CodePanel title="docker-compose.yml" delay={14}>
        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 36, color: "#FFFFFF" }}>
          OPEN_NOTEBOOK_ENCRYPTION_KEY=
        </div>
        <div style={{ position: "relative", alignSelf: "flex-start", fontFamily: mono, fontWeight: 700, fontSize: 36, color: "#FF6B6F" }}>
          change-me-to-a-secret-string
          <div style={{ position: "absolute", left: 0, top: "50%", height: 6, width: `${s * 100}%`, background: "#FFFFFF" }} />
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 42, color: "#5BE49B", opacity: n, transform: `translateY(${(1 - n) * 16}px)` }}>
          secret vừa tạo bằng openssl
        </div>
      </CodePanel>
      <Row t="Giữ lại key" sub="Nó mã hóa API key đã lưu" delay={at(2, 4, v) + 70} size={48} />
      <TerminalAt cmds={["docker compose up -d"]} from={Math.max(300, v - 110)} h={130} />
    </>
  );
};

const S11: React.FC<SP> = ({ v }) => (
  <>
    <Hl t="Mở giao diện, nối model" size={84} />
    <Mono t="http://localhost:8502" delay={14} size={50} />
    <Row t="Models: thêm provider trong UI" sub="Không bỏ API key vào file cấu hình" delay={at(1, 5, v) + 40} size={42} />
    <Row t="Ít nhất một Language model" delay={at(3, 5, v) + 60} size={48} />
    <Row t="Và một Embedding model" delay={at(4, 5, v) + 60} size={48} />
  </>
);

const S12: React.FC<SP> = ({ v }) => (
  <>
    <Hl t="Đừng public khi chưa khóa" size={72} />
    <CodePanel title="Mặc định: mọi interface, chưa khóa" delay={10}>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 46, color: "#FF6B6F", lineHeight: 1.15 }}>
        8502 · 5055
      </div>
    </CodePanel>
    <CodePanel title="Bind về máy này" delay={at(2, 4, v) + 20}>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 40, color: "#5BE49B", lineHeight: 1.2 }}>
        127.0.0.1:8502<br />127.0.0.1:5055
      </div>
    </CodePanel>
    <CodePanel title="Hoặc bật password" delay={at(3, 4, v)}>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 38, color: "#FFFFFF" }}>OPEN_NOTEBOOK_PASSWORD</div>
    </CodePanel>
  </>
);

const S13: React.FC<SP> = ({ v }) => (
  <>
    <Hl t="Nhớ kiểm tra ma trận model" size={84} />
    <Row t="Ollama" sub="Có Language, Embedding; không có speech-to-text, text-to-speech" delay={at(1, 4, v)} size={56} font={display} />
    <Row t="Anthropic" sub="Thiếu Embedding" delay={at(2, 4, v)} size={56} font={display} />
    <Row t="Groq" sub="Thiếu Embedding" delay={at(3, 4, v)} size={56} font={display} />
    <div style={{ fontFamily: sans, fontSize: 42, fontWeight: 500, color: MUTED }}>
      Ghép provider khác cho Embedding
    </div>
  </>
);

const S14: React.FC<SP> = () => (
  <>
    <Hl t="Lưu lại để thử" size={104} />
    <StarCard delay={10} logo={190} />
    <Statement t="Save video" delay={50} size={80} />
    <Statement t="Follow để xem tiếp" delay={70} size={80} />
  </>
);

const SCENES: Record<string, React.FC<SP>> = {
  s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7,
  s8: S8, s9: S9, s10: S10, s11: S11, s12: S12, s13: S13, s14: S14,
};

const Block: React.FC<{ y0: number; len: number; last: boolean; children: React.ReactNode }> = ({
  y0,
  len,
  last,
  children,
}) => {
  const f = useCurrentFrame();
  const o = last ? 1 : interpolate(f, [len - 8, len], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: y0,
        width: CONTENT_W,
        height: 1320 - y0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 22,
        opacity: o,
      }}
    >
      {children}
    </div>
  );
};

const ShotView: React.FC<{ shot: Shot; idx: number; start: number; span: number; len: number }> = ({
  shot,
  idx,
  start,
  span,
  len,
}) => {
  const first = idx === 0;
  const barY = SAFE.top + (first ? BRAND_SPACE : 0);
  const y0 = shot.n === null ? barY + TOP_H + 26 : barY + TOP_H + 14 + 140 + 16;
  return (
    <AbsoluteFill>
      <Bg shot={shot} len={len} />
      {shot.late && (
        <Sequence from={sf(shot.late.scene) - start} durationInFrames={len - (sf(shot.late.scene) - start)} name="late-bg">
          <Bg shot={{ ...shot, ...shot.late }} len={len - (sf(shot.late.scene) - start)} />
        </Sequence>
      )}
      <TopBar y={barY} shot={shot} />
      <TickerBar items={shot.ticker} />
      {shot.scenes.map((id, i) => {
        const from = sf(id) - start;
        const next = shot.scenes[i + 1];
        const dur = next ? sf(next) - sf(id) : len - from;
        const Sc = SCENES[id];
        return (
          <Sequence key={id} from={from} durationInFrames={dur} name={id}>
            <Block y0={y0} len={dur} last={!next}>
              <Sc v={vf(id)} />
            </Block>
            <Voice slug={SLUG} id={id} />
            <Sfx id={i === 0 ? (first ? "thud" : "whoosh") : "pop"} volume={i === 0 ? 0.4 : 0.25} />
          </Sequence>
        );
      })}
      {first && <Brand />}
      {first && <Sfx id="ding" at={sf("s2") + 40} volume={0.2} />}
    </AbsoluteFill>
  );
};

const Component: React.FC<VideoProps> = ({ guide }) => {
  const starts = SHOTS.map((s) => sf(s.scenes[0]));
  const voiceRanges = Object.keys(timeline.scenes).map((id): [number, number] => [sf(id), sf(id) + vf(id)]);
  const items: React.ReactNode[] = [];
  SHOTS.forEach((shot, i) => {
    const span = (i + 1 < SHOTS.length ? starts[i + 1] : TOTAL) - starts[i];
    const len = span + (i + 1 < SHOTS.length ? T : 0);
    if (i > 0)
      items.push(
        <TransitionSeries.Transition
          key={`t${i}`}
          presentation={wipe({ direction: i % 2 ? "from-right" : "from-left" })}
          timing={linearTiming({ durationInFrames: T, easing: easeOut })}
        />,
      );
    items.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={len}>
        <ShotView shot={shot} idx={i} start={starts[i]} span={span} len={len} />
      </TransitionSeries.Sequence>,
    );
  });
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <TransitionSeries>{items}</TransitionSeries>
      <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = { id: SLUG, component: Component, durationInFrames: TOTAL };
