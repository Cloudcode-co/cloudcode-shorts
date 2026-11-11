import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { OffthreadVideo, AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Brand, BRAND_SPACE, CONTENT_W, FPS, Music, SAFE, Sfx, Terminal, TikTokGuide, TYPE_DELAY, Voice,
  beatmap, display, easeOut, enter, flash, hit, mono, sans, typingFrames, videoAsset, whip, zoomPunch,
  type VideoDef, type VideoProps,
} from "../../kit";
import beats from "./beatmap.json";
import durations from "./durations.json";
import facts from "./facts.json";
import timeline from "./timeline.json";

const SLUG = "memdoor-linux-team-mode-cli";
const MAP = beatmap(beats);
const T = timeline.scenes as Record<string, { start: number; length: number }>;
const F = (id: string) => Math.round(T[id].start * FPS);
const TOTAL = Math.round(timeline.total * FPS);
const TR = 10;

const C = {
  bg: "#080c11", panel: "#0e151e", line: "#22303f", text: "#e8f0f7", dim: "#7e92a6",
  ok: "#3ddc84", warn: "#ffb020", bad: "#ff5c5c", cyan: "#4cc9f0",
};

// shots: [first scene, last scene]
const SHOTS = [["s1", "s2"], ["s3", "s4"], ["s5", "s6"], ["s7", "s8"], ["s9", "s10"]] as const;
const shotStart = (i: number) => F(SHOTS[i][0]);
const shotEnd = (i: number) => (i === SHOTS.length - 1 ? TOTAL : shotStart(i + 1));
const shotLen = (i: number) => shotEnd(i) - shotStart(i);
const loc = (i: number, id: string) => F(id) - shotStart(i);

const num = (n: number, d = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const prog = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

const Light: React.FC<{ color?: string; off: number; size?: number }> = ({ color = C.ok, off, size = 24 }) => {
  const f = useCurrentFrame();
  const k = hit(MAP.beats, f + off, 14);
  return (
    <span style={{
      display: "inline-block", width: size, height: size, borderRadius: size, flex: "none",
      background: color, opacity: 0.65 + 0.35 * k, boxShadow: `0 0 ${6 + 14 * k}px ${color}`,
    }} />
  );
};

const Panel: React.FC<{
  title?: string; light?: string; off: number; delay?: number; style?: React.CSSProperties; children?: React.ReactNode; accent?: string;
}> = ({ title, light, off, delay = 0, style, children, accent }) => {
  const p = useCurrentFrameIn(delay);
  return (
    <div style={{
      background: C.panel, border: `2px solid ${accent ?? C.line}`, borderRadius: 14, padding: "18px 24px",
      boxSizing: "border-box", ...enter(p, 28), ...style,
    }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: mono, fontWeight: 700, fontSize: 34, color: C.dim, marginBottom: 8 }}>
          {light && <Light color={light} off={off} />}
          <span>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
};
function useCurrentFrameIn(delay: number, dur = 16) {
  const f = useCurrentFrame();
  return prog(f, delay, delay + dur);
}

const Head: React.FC<{ text: string; top: number; size?: number }> = ({ text, top, size = 84 }) => {
  const p = useCurrentFrameIn(0, 18);
  return (
    <div style={{
      position: "absolute", left: SAFE.left, top, width: CONTENT_W, fontFamily: display, fontWeight: 800,
      fontSize: size, lineHeight: 1.02, color: C.text, textWrap: "balance", ...enter(p, 30),
    }}>{text}</div>
  );
};

const Log: React.FC<{ lines: string[]; rows: number; every?: number; size?: number; color?: string }> = ({ lines, rows, every = 20, size = 34, color = C.ok }) => {
  const f = useCurrentFrame();
  const n = Math.floor(f / every) + 1;
  const vis = Array.from({ length: Math.min(rows, n) }, (_, i) => n - Math.min(rows, n) + i);
  const sub = (f % every) / every;
  return (
    <div style={{ fontFamily: mono, fontSize: size, lineHeight: 1.45, overflow: "hidden", height: rows * size * 1.45 }}>
      <div style={{ transform: `translateY(${n > rows ? -sub * size * 1.45 + 0 : 0}px)` }}>
        {vis.concat(n > rows ? [n] : []).map((k, i, a) => (
          <div key={k} style={{ whiteSpace: "pre", color: i === a.length - 1 ? color : C.dim, opacity: n > rows && i === 0 ? 1 - sub : 1 }}>
            {"› "}{lines[k % lines.length]}
          </div>
        ))}
      </div>
    </div>
  );
};

const Bar: React.FC<{ p: number; color: string; h?: number }> = ({ p, color, h = 22 }) => (
  <div style={{ height: h, background: "#16212d", borderRadius: 6, overflow: "hidden" }}>
    <div style={{ width: `${p * 100}%`, height: "100%", background: color }} />
  </div>
);

const Grid: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      background: C.bg,
      backgroundImage: `linear-gradient(${C.line}55 1px, transparent 1px), linear-gradient(90deg, ${C.line}55 1px, transparent 1px)`,
      backgroundSize: "60px 60px", backgroundPosition: `0 ${f * 0.3}px`,
    }} />
  );
};

const Footage: React.FC<{ file: string; dim: number; pos?: string }> = ({ file, dim, pos = "50% 50%" }) => (
  <AbsoluteFill>
    <OffthreadVideo src={videoAsset(SLUG, `footage/${file}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
    <AbsoluteFill style={{ background: C.bg, opacity: dim }} />
  </AbsoluteFill>
);

const Body: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", left: SAFE.left, top, width: CONTENT_W, bottom: 1920 - (1920 - SAFE.bottom), fontFamily: sans, color: C.text }}>{children}</div>
);

const Phase: React.FC<{ from: number; to?: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={to === undefined ? undefined : to - from} layout="none">
    <AbsoluteFill>{children}</AbsoluteFill>
  </Sequence>
);

/* ---------- Shot A: hook ---------- */
const ShotA: React.FC<{ off: number }> = ({ off }) => {
  const f = useCurrentFrame();
  const s2 = loc(0, "s2");
  const cost = interpolate(f, [14, 70], [0, 0.39], { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: easeOut });
  const sc = interpolate(f, [30, 90], [0, 9.8], { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: easeOut });
  const top = SAFE.top + BRAND_SPACE;
  return (
    <AbsoluteFill>
      <Grid />
      <Phase from={s2}><Footage file="programmer-typing-terminal-night-pixabay-3593.mp4" dim={0.88} /></Phase>
      <Head text="0.39 USD một bài toán khó" top={top} />
      <Body top={top + 200}>
        <div style={{ display: "flex", gap: 20 }}>
          <Panel title="API cost" light={C.ok} off={off} delay={10} style={{ flex: 1 }}>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 110, color: C.ok, fontVariantNumeric: "tabular-nums" }}>${num(cost, 2)}</div>
            <div style={{ fontFamily: sans, fontSize: 34, color: C.dim }}>trung vị một lượt chạy</div>
          </Panel>
          <Panel title="LCB Hard" light={C.cyan} off={off} delay={22} style={{ flex: 1 }}>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 110, color: C.cyan, fontVariantNumeric: "tabular-nums" }}>{num(sc, 1)}</div>
            <div style={{ fontFamily: sans, fontSize: 34, color: C.dim }}>trên thang 10</div>
          </Panel>
        </div>
        <div style={{ position: "relative", marginTop: 24, height: 580 }}>
          <Phase from={0} to={s2}>
            <Panel title="team-solve" light={C.ok} off={off} delay={40} style={{ height: 580 }}>
              <Log rows={10} every={26} lines={["planner ok", "ideator-1 ok", "ideator-2 ok", "solver ok", "manager review ok", "repair ok", "ledger saved"]} />
            </Panel>
          </Phase>
          <Phase from={s2}>
            <Panel title="Claude Code / Aider" light={C.warn} off={off} accent={C.warn} style={{ height: 280 }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 56, color: C.warn, lineHeight: 1.05 }}>Frontier model đơn lẻ</div>
              <div style={{ fontFamily: sans, fontSize: 40, color: C.text, marginTop: 10 }}>Phí API khá buốt ví</div>
              <div style={{ marginTop: 14 }}><Bar p={prog(f, s2 + 6, s2 + 50)} color={C.warn} /></div>
            </Panel>
            <Panel title="Memdoor Team Mode" light={C.ok} off={off} delay={12} accent={C.ok} style={{ position: "absolute", top: 300, left: 0, right: 0, height: 280 }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 56, color: C.ok, lineHeight: 1.05 }}>5 model mở giá rẻ</div>
              <div style={{ fontFamily: sans, fontSize: 40, color: C.text, marginTop: 10 }}>Chạy cùng nhau</div>
              <div style={{ marginTop: 14 }}><Bar p={prog(f, s2 + 20, s2 + 60) * 0.25} color={C.ok} /></div>
            </Panel>
          </Phase>
        </div>
      </Body>
    </AbsoluteFill>
  );
};

/* ---------- Shot B: architecture ---------- */
const ROLES = [
  ["planner", 1.2], ["ideator-1", 3.6], ["ideator-2", 4.1], ["solver", 7.0], ["manager", 8.4], ["repair", 9.8],
] as const;
const ShotB: React.FC<{ off: number }> = ({ off }) => {
  const f = useCurrentFrame();
  const s4 = loc(1, "s4");
  return (
    <AbsoluteFill>
      <Grid />
      <Phase from={0} to={s4}><Head text="Kiến trúc 5 vai trò độc lập" top={SAFE.top} /></Phase>
      <Phase from={s4}><Head text="Fresh context qua file trên đĩa" top={SAFE.top} /></Phase>
      <Body top={SAFE.top + 200}>
        <Panel title="memdoor · Go" light={C.cyan} off={off} delay={6} style={{ display: "block" }}>
          <div style={{ fontFamily: sans, fontSize: 40, color: C.text }}>Một file binary duy nhất</div>
        </Panel>
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {ROLES.map(([name, at], i) => {
            const d = Math.round(at * FPS);
            const p = prog(f, d, d + 16);
            const fresh = f >= s4 + i * 8;
            return (
              <div key={name} style={{ background: C.panel, border: `2px solid ${fresh ? C.ok : C.line}`, borderRadius: 14, padding: "14px 20px", ...enter(p, 24), opacity: p }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: mono, fontWeight: 700, fontSize: 36 }}>
                  <Light color={p > 0.9 ? C.ok : C.warn} off={off + i * 7} size={22} />{name}
                </div>
                <div style={{ fontFamily: mono, fontSize: 34, color: fresh ? C.ok : C.dim, marginTop: 4 }}>{fresh ? "ctx: fresh" : "running"}</div>
                <div style={{ marginTop: 8 }}><Bar p={fresh ? 1 : ((f - d) * 0.012) % 1} color={fresh ? C.ok : C.warn} h={12} /></div>
              </div>
            );
          })}
        </div>
        <Panel title="ledger trên ổ cứng" light={C.cyan} off={off} delay={s4} style={{ marginTop: 14, height: 330, opacity: f < s4 ? 0 : 1 }}>
          <Log rows={5} every={22} color={C.cyan} lines={["planner → ledger", "ideator-1 → ledger", "ideator-2 → ledger", "ledger → solver", "ledger → manager", "ledger → repair", "chat history: 0"]} />
        </Panel>
      </Body>
    </AbsoluteFill>
  );
};

/* ---------- Shot C: numbers ---------- */
const ShotC: React.FC<{ off: number }> = ({ off }) => {
  const f = useCurrentFrame();
  const s6 = loc(2, "s6");
  const acc = interpolate(f, [20, 110], [66.8, 92.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const g = facts.repos.find((r) => r.repo === "slee-persis/GVS5H")!;
  const m = facts.repos.find((r) => r.repo === "guregodevo/memdoor")!;
  const g6 = f - s6;
  const tok = interpolate(g6, [20, 90], [54661, 14367], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <AbsoluteFill>
      <Grid />
      <Phase from={0} to={s6}><Head text="Tăng độ chính xác" top={SAFE.top} /></Phase>
      <Phase from={s6}><Head text="Giảm 74% input token" top={SAFE.top} /></Phase>
      <Phase from={0} to={s6}>
        <Body top={SAFE.top + 130}>
          <Panel title="5 × Qwen3.8-27B" light={C.ok} off={off} delay={4}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Img src={staticFile(`videos/${SLUG}/${g.avatar}`)} style={{ width: 90, height: 90, borderRadius: 14 }} />
              <div style={{ fontFamily: mono, fontSize: 36, color: C.dim }}>{g.repo}</div>
            </div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 190, color: C.ok, fontVariantNumeric: "tabular-nums", lineHeight: 1.05, marginTop: 10 }}>{num(acc, 1)}%</div>
            <div style={{ fontFamily: mono, fontSize: 38, color: C.dim, margin: "4px 0 12px" }}>từ 66.8%</div>
            <Bar p={acc / 100} color={C.ok} h={30} />
          </Panel>
          <Panel title="LiveCodeBench Hard" light={C.cyan} off={off} delay={30} style={{ marginTop: 18 }}>
            <div style={{ fontFamily: mono, fontSize: 40, display: "flex", justifyContent: "space-between" }}><span style={{ color: C.ok }}>Team Mode</span><span style={{ color: C.ok, fontWeight: 700 }}>9.8 / 10</span></div>
            <div style={{ margin: "8px 0 20px" }}><Bar p={prog(f, 40, 100) * 0.98} color={C.ok} /></div>
            <div style={{ fontFamily: mono, fontSize: 40, display: "flex", justifyContent: "space-between" }}><span style={{ color: C.warn }}>Fable 5</span><span style={{ color: C.warn, fontWeight: 700 }}>8.0 / 10</span></div>
            <div style={{ marginTop: 8 }}><Bar p={prog(f, 50, 110) * 0.8} color={C.warn} /></div>
          </Panel>
          <Panel title="workers" light={C.ok} off={off} delay={60} style={{ marginTop: 18, height: 260 }}>
            <Log rows={3} every={24} color={C.ok} lines={["qwen3.8-27b #1 ok","qwen3.8-27b #2 ok","qwen3.8-27b #3 ok","qwen3.8-27b #4 ok","qwen3.8-27b #5 ok"]} />
          </Panel>
        </Body>
      </Phase>
      <Phase from={s6}>
        <Body top={SAFE.top + 210}>
          <Panel title="Jev · decision model" light={C.ok} off={off} delay={4}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Img src={staticFile(`videos/${SLUG}/${m.avatar}`)} style={{ width: 90, height: 90, borderRadius: 14 }} />
              <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 130, color: C.ok }}>{"< 0.5s"}</div>
            </div>
            <div style={{ fontFamily: sans, fontSize: 40, color: C.dim }}>phản hồi</div>
          </Panel>
          <Panel title="input token khi đọc codebase" light={C.cyan} off={off} delay={18} style={{ marginTop: 18 }}>
            <div style={{ fontFamily: mono, fontSize: 38, color: C.warn }}>trước 54,661</div>
            <Bar p={1} color={C.warn} h={26} />
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 120, color: C.ok, fontVariantNumeric: "tabular-nums", marginTop: 14 }}>{num(tok)}</div>
            <Bar p={tok / 54661} color={C.ok} h={26} />
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 200, color: C.ok, marginTop: 8, opacity: prog(g6, 80, 92), transform: `scale(${1 + 0.1 * (1 - prog(g6, 80, 100))})`, transformOrigin: "left" }}>-74%</div>
          </Panel>
        </Body>
      </Phase>
    </AbsoluteFill>
  );
};

/* ---------- Shot D: install ---------- */
const S7CMDS = ["curl -fsSL https://memdoor.ai/install.sh | bash", "export OPENROUTER_API_KEY=sk-or-..."];
const S8CMDS = ["memdoor connect local", "memdoor workflow run team-solve --wait"];
const ShotD: React.FC<{ off: number }> = ({ off }) => {
  const s8 = loc(3, "s8");
  return (
    <AbsoluteFill>
      <Grid />
      <Phase from={s8}><Footage file="server-room-glowing-racks-pixabay-171185.mp4" dim={0.82} /></Phase>
      <Phase from={0} to={s8}><Head text="Cài đặt một lệnh trên Linux" top={SAFE.top} /></Phase>
      <Phase from={s8}><Head text="Chạy offline và lưu ý context" top={SAFE.top} /></Phase>
      <Phase from={0} to={s8}>
        <Body top={SAFE.top + 220}>
          <Terminal cmds={S7CMDS} fontSize={40} minHeight={420} bg="#05080c" accent={C.ok} />
          <Panel title="cài binary + API key" light={C.cyan} off={off} delay={30} style={{ marginTop: 24 }}>
            <div style={{ fontFamily: sans, fontSize: 40 }}>Key cấp qua OpenRouter</div>
          </Panel>
          <Panel title="openrouter" light={C.cyan} off={off} delay={60} style={{ marginTop: 24, height: 330 }}>
            <Log rows={4} every={24} color={C.cyan} lines={["memdoor: một file Go binary","OPENROUTER_API_KEY: set","team-solve: sẵn sàng"]} />
          </Panel>
        </Body>
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(S7CMDS)} volume={0.2} />
      </Phase>
      <Phase from={s8}>
        <Body top={SAFE.top + 220}>
          <Terminal cmds={S8CMDS} fontSize={40} minHeight={330} bg="#05080c" accent={C.ok} />
          <Panel title="offline · GPU" light={C.ok} off={off} delay={40} style={{ marginTop: 24 }}>
            <div style={{ fontFamily: sans, fontSize: 40 }}>27B Q5 cần GPU 24 GB VRAM</div>
          </Panel>
          <Panel title="Ollama" light={C.warn} off={off} delay={70} accent={C.warn} style={{ marginTop: 18 }}>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 40, color: C.warn }}>OLLAMA_CONTEXT_LENGTH=32768</div>
            <div style={{ fontFamily: sans, fontSize: 38, marginTop: 6 }}>tránh nuốt mất lệnh gọi tool</div>
          </Panel>
          <Panel title="team-solve --wait" light={C.ok} off={off} delay={110} style={{ marginTop: 18, height: 250 }}>
            <Log rows={3} every={24} color={C.ok} lines={["planner ok","ideators ok","solver ok","manager ok","repair ok"]} />
          </Panel>
        </Body>
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(S8CMDS)} volume={0.2} />
      </Phase>
    </AbsoluteFill>
  );
};

/* ---------- Shot E: remote + outro ---------- */
const QR = 21;
const cell = (i: number, j: number) => {
  const fin = (a: number, b: number) => (a < 7 && b < 7) || (a < 7 && b > QR - 8) || (a > QR - 8 && b < 7);
  if (fin(i, j)) {
    const a = i % (QR - 7 > i ? 7 : QR), b = j;
    const ii = i < 7 ? i : i - (QR - 7), jj = j < 7 ? j : j - (QR - 7);
    void a; void b;
    return ii === 0 || ii === 6 || jj === 0 || jj === 6 || (ii >= 2 && ii <= 4 && jj >= 2 && jj <= 4);
  }
  return (i * 7 + j * 13 + i * j * 3) % 5 < 2;
};
const ShotE: React.FC<{ off: number }> = ({ off }) => {
  const f = useCurrentFrame();
  const s10 = loc(4, "s10");
  const m = facts.repos.find((r) => r.repo === "guregodevo/memdoor")!;
  const stars = Math.round(interpolate(f, [s10 + 20, s10 + 70], [0, m.stars], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut }));
  const px = 24;
  const scan = ((f - 40) % 120) / 120;
  return (
    <AbsoluteFill>
      <Grid />
      <Footage file="man-checking-smartphone-cafe-pixabay-202987.mp4" dim={0.8} />
      <Phase from={0} to={s10}><Head text="Theo dõi từ xa trên điện thoại" top={SAFE.top} /></Phase>
      <Phase from={0} to={s10}>
        <Body top={SAFE.top + 200}>
          <Panel title="/remote" light={C.ok} off={off} delay={6}>
            <div style={{ fontFamily: sans, fontSize: 40 }}>Link mã hóa đầu cuối E2E</div>
          </Panel>
          <div style={{ marginTop: 20, background: "#f4f7fa", padding: 26, borderRadius: 14, width: QR * px + 52, marginLeft: "auto", marginRight: "auto", position: "relative", ...enter(prog(f, 20, 36), 30) }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${QR}, ${px}px)`, gridAutoRows: `${px}px` }}>
              {Array.from({ length: QR * QR }, (_, k) => {
                const i = Math.floor(k / QR), j = k % QR;
                const on = cell(i, j) && f > 30 + (i + j) * 1.2;
                return <div key={k} style={{ background: on ? "#080c11" : "transparent" }} />;
              })}
            </div>
            {f > 90 && <div style={{ position: "absolute", left: 0, right: 0, top: 26 + scan * QR * px, height: 6, background: C.ok, boxShadow: `0 0 18px ${C.ok}` }} />}
          </div>
          <Panel title="quét mã QR" light={C.cyan} off={off} delay={60} style={{ marginTop: 20 }}>
            <div style={{ fontFamily: sans, fontSize: 40 }}>Mở trực tiếp terminal</div>
          </Panel>
        </Body>
      </Phase>
      <Phase from={s10}>
        <Head text="Lưu video và thử nghiệm ngay" top={SAFE.top} />
        <Body top={SAFE.top + 210}>
          <Panel title="memdoor · online" light={C.ok} off={off} delay={4}>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <Img src={staticFile(`videos/${SLUG}/${m.avatar}`)} style={{ width: 200, height: 200, borderRadius: 24 }} />
              <div>
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 104 }}>Memdoor</div>
                <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 60, color: C.ok, fontVariantNumeric: "tabular-nums" }}>{num(stars)} stars</div>
              </div>
            </div>
            <div style={{ fontFamily: mono, fontSize: 36, color: C.cyan, marginTop: 20 }}>github.com/guregodevo/memdoor</div>
          </Panel>
          <Panel title="Lab thử trên Linux" light={C.warn} off={off} delay={30} style={{ marginTop: 18 }}>
            <div style={{ fontFamily: sans, fontSize: 44, fontWeight: 700 }}>Lưu video để dựng lab chạy thử</div>
          </Panel>
          <Panel title="Follow kênh" light={C.ok} off={off} delay={50} style={{ marginTop: 18 }}>
            <div style={{ fontFamily: sans, fontSize: 44, fontWeight: 700 }}>Cập nhật công cụ mới</div>
          </Panel>
          <Panel title="team-solve" light={C.ok} off={off} delay={80} style={{ marginTop: 18, height: 260 }}>
            <Log rows={3} every={24} color={C.ok} lines={["5 model giá rẻ","chạy cùng nhau","chín nghìn đồng một bài toán?"]} />
          </Panel>
        </Body>
      </Phase>
    </AbsoluteFill>
  );
};

const SHOT_COMPONENTS = [ShotA, ShotB, ShotC, ShotD, ShotE];
const TRANSITIONS: any[] = [whip(1), flash(C.ok), zoomPunch(), whip(-1)];

const VOICE_RANGES: [number, number][] = Object.keys(T).map((id) => [
  F(id), F(id) + Math.round((durations as Record<string, number>)[id] * FPS),
]);

const Memdoor: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      {SHOT_COMPONENTS.flatMap((Comp, i) => {
        const last = i === SHOT_COMPONENTS.length - 1;
        const els = [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={shotLen(i) + (last ? 0 : TR)}>
            <Comp off={shotStart(i)} />
            {i === 0 && <Brand />}
          </TransitionSeries.Sequence>,
        ];
        if (!last)
          els.push(
            <TransitionSeries.Transition key={`t${i}`} presentation={TRANSITIONS[i]} timing={linearTiming({ durationInFrames: TR })} />,
          );
        return els;
      })}
    </TransitionSeries>
    {Object.keys(T).map((id) => (
      <Sequence key={id} from={F(id)} layout="none"><Voice slug={SLUG} id={id} /></Sequence>
    ))}
    {SHOTS.map((s, i) => (i > 0 ? <Sfx key={i} id={i === 2 ? "thud" : "whoosh"} at={shotStart(i)} volume={0.35} /> : null))}
    <Sfx id="pop" at={14} volume={0.25} />
    <Sfx id="ding" at={F("s5") + 110} volume={0.3} />
    <Sfx id="ding" at={F("s6") + 90} volume={0.3} />
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Memdoor, durationInFrames: TOTAL };
