import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, useCurrentFrame } from "remotion";
import { siDocker } from "simple-icons";
import {
  BRAND_SPACE, Brand, FPS, Music, SAFE, Sfx, TikTokGuide, Voice, display, flash, sans,
  videoAsset, whip, zoomPunch, type VideoDef, type VideoProps,
} from "../../kit";
import beats from "./beatmap.json";
import durations from "./durations.json";
import timeline from "./timeline.json";

const SLUG = "tu-host-unleash-vs-flagsmith";
const T = 10; // transition frames, added to the shot before it
const G = (s: number) => Math.round(s * FPS);
const D = durations as Record<string, number>;
const TL = timeline.scenes as Record<string, { start: number; length: number }>;
const BEATS = beats.beats.map(G);

// Palette: studio purple and blue, gold, quiz green.
const BG = "#1A0A4A";
const PANEL_A = "#3A1F9E";
const PANEL_B = "#24146F";
const GOLD = "#FFC83D";
const GOLD_D = "#C98A00";
const GREEN = "#1FCB6A";
const BTN_A = "#4B35D1";
const BTN_B = "#33229B";
const W = 1080 - SAFE.left - SAFE.right; // 777

const out = Easing.bezier(0.23, 1, 0.32, 1);
const ramp = (f: number, a: number, d: number) =>
  f < a ? 0 : interpolate(f, [a, a + d], [0, 1], { extrapolateRight: "clamp", easing: out });

// ---- shot boundaries (global frames) ----
const SHOT_START = { a: 0, b: G(TL.s3.start), c: G(TL.s6.start), d: G(TL.s9.start) };
const TOTAL = G(timeline.total);
const LEN = {
  a: SHOT_START.b - SHOT_START.a + T,
  b: SHOT_START.c - SHOT_START.b + T,
  c: SHOT_START.d - SHOT_START.c + T,
  d: TOTAL - SHOT_START.d,
};
// scene start inside its shot, and the frame the voice reaches a moment (seconds into the clip)
const at = (id: string, shot: keyof typeof SHOT_START) => G(TL[id].start) - SHOT_START[shot];
const VOICE_RANGES: [number, number][] = Object.keys(TL).map((id) => [
  G(TL[id].start),
  G(TL[id].start) + G(D[id]),
]);

// ---------- pieces ----------
const Fade: React.FC<{ from: number; to?: number; children: React.ReactNode; dy?: number }> = ({
  from, to = Infinity, children, dy = 26,
}) => {
  const f = useCurrentFrame();
  const i = ramp(f, from, 14);
  const o = f < to ? 1 : 1 - ramp(f, to, 9);
  if (f < from || o <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: i * o, transform: `translateY(${(1 - i) * dy}px)` }}>
      {children}
    </div>
  );
};

const Stage: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = BEATS.reduce((m, b) => (f >= b ? Math.max(m, Math.exp(-(f - b) / 9)) : m), 0);
  return (
    <AbsoluteFill style={{ background: BG }}>
      {[1500, 1100, 720].map((s, i) => (
        <div
          key={s}
          style={{
            position: "absolute", left: 540 - s / 2, top: 860 - s / 2, width: s, height: s,
            borderRadius: "50%", border: `${6 + i * 2}px solid ${GOLD}`,
            opacity: 0.07 + pulse * 0.05, transform: `scale(${1 + (f % 600) * 0.0001 * (i + 1)})`,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260, background: "#12062F" }} />
    </AbsoluteFill>
  );
};

const Bulbs: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const f = useCurrentFrame();
  const step = Math.floor(f / 5);
  const pts: [number, number][] = [];
  const nx = 12, ny = Math.max(2, Math.round((h / w) * nx));
  for (let i = 0; i <= nx; i++) { pts.push([(w * i) / nx, 0]); }
  for (let j = 1; j <= ny; j++) { pts.push([w, (h * j) / (ny + 1)]); }
  for (let i = nx; i >= 0; i--) { pts.push([(w * i) / nx, h]); }
  for (let j = ny; j >= 1; j--) { pts.push([0, (h * j) / (ny + 1)]); }
  return (
    <>
      {pts.map(([x, y], i) => {
        const on = (i + step) % 3 === 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9,
              background: on ? "#FFF3B8" : GOLD_D, opacity: on ? 1 : 0.7,
            }}
          />
        );
      })}
    </>
  );
};

type PanelItem = { from: number; to?: number; head: string; sub?: string; size?: number; logo?: boolean };
const Panel: React.FC<{ h: number; items: PanelItem[] }> = ({ h, items }) => {
  const f = useCurrentFrame();
  const pulse = BEATS.reduce((m, b) => (f >= b ? Math.max(m, Math.exp(-(f - b) / 8)) : m), 0);
  return (
    <div
      style={{
        position: "relative", width: W, height: h, flex: "none", borderRadius: 44,
        background: `linear-gradient(160deg, ${PANEL_A}, ${PANEL_B})`,
        border: `7px solid ${GOLD}`,
        boxShadow: `0 0 ${34 + pulse * 22}px rgba(255, 200, 61, ${0.45 + pulse * 0.25})`,
      }}
    >
      <Bulbs w={W} h={h} />
      {items.map((it) => (
        <Fade key={it.head} from={it.from} to={it.to} dy={18}>
          <div style={{ position: "absolute", inset: 0, padding: "0 44px", display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  fontFamily: display, fontWeight: 800, fontSize: it.size ?? 78, lineHeight: 1.02,
                  color: "#FFFFFF", textWrap: "balance",
                }}
              >
                {it.head}
              </div>
              {it.sub && (
                <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: GOLD, textWrap: "balance" }}>
                  {it.sub}
                </div>
              )}
            </div>
            {it.logo && (
              <Img
                src={videoAsset(SLUG, "repos/Unleash.png")}
                style={{ width: 150, height: 150, borderRadius: 36, background: "#fff", border: `5px solid ${GOLD}` }}
              />
            )}
          </div>
        </Fade>
      ))}
    </div>
  );
};

type BtnProps = {
  letter?: string; text: string; sub?: string; h?: number; size?: number;
  appear: number; lit?: number; dim?: number;
};
const Button: React.FC<BtnProps> = ({ letter, text, sub, h = 150, size = 48, appear, lit, dim }) => {
  const f = useCurrentFrame();
  const a = ramp(f, appear, 16);
  const l = lit === undefined ? 0 : ramp(f, lit, 8);
  const d = dim === undefined ? 0 : ramp(f, dim, 12);
  const shake = dim !== undefined && f >= dim && f < dim + 28 ? Math.sin((f - dim) * 1.9) * 14 * (1 - (f - dim) / 28) : 0;
  const pop = lit === undefined || f < lit ? 1 : 1 + 0.06 * Math.exp(-(f - lit) / 7) * Math.cos((f - lit) / 2.4);
  const bg = l > 0.5 ? GREEN : `linear-gradient(180deg, ${BTN_A}, ${BTN_B})`;
  return (
    <div
      style={{
        position: "relative", width: W, minHeight: h, flex: "none", boxSizing: "border-box",
        borderRadius: 38, padding: "14px 30px", display: "flex", alignItems: "center", gap: 26,
        background: bg, border: `6px solid ${l > 0.5 ? "#C8FFDD" : GOLD}`,
        boxShadow: `0 10px 0 ${l > 0.5 ? "#0E8F47" : "#170B57"}${l > 0.5 ? `, 0 0 40px rgba(31,203,106,${0.7 * l})` : ""}`,
        opacity: a * (1 - d * 0.62),
        filter: d > 0 ? `saturate(${1 - d * 0.8})` : undefined,
        transform: `translate(${shake}px, ${(1 - a) * 40}px) scale(${pop})`,
      }}
    >
      {letter && (
        <div
          style={{
            flex: "none", width: 88, height: 88, borderRadius: 44, background: l > 0.5 ? "#FFFFFF" : GOLD,
            color: l > 0.5 ? "#0E8F47" : PANEL_B, fontFamily: display, fontWeight: 800, fontSize: 56,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {letter}
        </div>
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.08, color: "#fff", textWrap: "balance" }}>
          {text}
        </div>
        {sub && (
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, lineHeight: 1.15, color: l > 0.5 ? "#E6FFF0" : GOLD }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
};

const Col: React.FC<{ children: React.ReactNode; gap?: number; center?: boolean }> = ({ children, gap = 22, center }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap, justifyContent: center ? "center" : "flex-start", alignItems: "center" }}>
    {children}
  </div>
);

const Ring: React.FC<{ size: number; label: string; p: number; pop: number }> = ({ size, label, p, pop }) => {
  const r = size / 2 - 22;
  const C = 2 * Math.PI * r;
  const ang = p * 360;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill={PANEL_B} stroke="#12062F" strokeWidth={26} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GOLD} strokeWidth={26} strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * p}
        />
      </svg>
      <div
        style={{
          position: "absolute", left: size / 2 - 11, top: 0, width: 22, height: 22, borderRadius: 11, background: "#fff",
          transformOrigin: `11px ${size / 2}px`, transform: `rotate(${ang}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: display, fontWeight: 800, fontSize: size * 0.56, color: "#fff", transform: `scale(${pop})`,
          textShadow: `0 6px 0 ${GOLD_D}`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// 3-2-1 with a ring that drains over each second
const Countdown: React.FC<{ ticks: number[]; size: number; end: number }> = ({ ticks, size, end }) => {
  const f = useCurrentFrame();
  const idx = ticks.reduce((n, t, i) => (f >= t ? i : n), -1);
  if (idx < 0) return null;
  const t0 = ticks[idx];
  const t1 = ticks[idx + 1] ?? end;
  const p = Math.min(1, (f - t0) / (t1 - t0));
  const pop = 1 + 0.38 * Math.exp(-(f - t0) / 6);
  return <Ring size={size} label={String(ticks.length - idx)} p={p} pop={pop} />;
};

const rng = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const COLORS = [GOLD, "#FF4D8D", "#3EE6C4", "#FFFFFF", "#7C5CFF", GREEN];
const Confetti: React.FC<{ at: number; x: number; y: number; n?: number }> = ({ at: s, x, y, n = 70 }) => {
  const f = useCurrentFrame();
  if (f < s || f > s + 170) return null;
  const t = (f - s) / FPS;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 5 }}>
      {Array.from({ length: n }, (_, i) => {
        const ang = -Math.PI / 2 + (rng(i + 1) - 0.5) * 2.5;
        const sp = 600 + rng(i + 50) * 900;
        const px = x + Math.cos(ang) * sp * t * (1 - 0.25 * t);
        const py = y + Math.sin(ang) * sp * t + 1100 * t * t;
        const o = interpolate(t, [1.8, 2.8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: px, top: py, width: 18 + rng(i + 9) * 12, height: 12 + rng(i + 20) * 10,
              background: COLORS[i % COLORS.length], opacity: o,
              transform: `rotate(${rng(i + 3) * 360 + t * (300 + rng(i) * 500)}deg) scaleY(${Math.cos(t * 9 + i)})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Frame: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 0 }) => (
  <AbsoluteFill>
    <Stage />
    <AbsoluteFill
      style={{
        fontFamily: sans, padding: `${SAFE.top + top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
        display: "flex", flexDirection: "column", gap: 28,
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

const Zone: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "relative", flex: 1, width: W }}>{children}</div>
);

// ---------- SHOT A: the question, the countdown, the answer ----------
const ShotA: React.FC = () => {
  const s2 = at("s2", "a");
  const sec = (id: string, t: number, shot: keyof typeof SHOT_START) => at(id, shot) + G(t);
  const ticks = [109, 169, 228];
  const reveal = 288;
  return (
    <Frame top={BRAND_SPACE}>
      <Panel
        h={300}
        items={[
          { from: 4, to: s2 + 12, head: "Cloud hay tự host?", sub: "Thay LaunchDarkly?" },
          { from: s2 + 24, head: "Mã nguồn mở, tự quản lý", size: 62, logo: true },
        ]}
      />
      <Button letter="A" text="Cloud: LaunchDarkly" appear={30} dim={reveal} h={140} />
      <Button letter="B" text="Tự host: Unleash trên VPS" appear={44} lit={reveal} h={140} />
      <Zone>
        <Fade from={ticks[0] - 8} to={reveal + 6}>
          <Col center><Countdown ticks={ticks} size={330} end={reveal} /></Col>
        </Fade>
        <Fade from={sec("s2", 4.7, "a")}>
          <Col gap={18}>
            <Button text="TypeScript" appear={sec("s2", 4.7, "a")} h={132} size={56} />
            <Button text="AGPL-3.0" appear={sec("s2", 6.3, "a")} h={132} size={56} />
            <Button text="Self-hosted" appear={sec("s2", 8.8, "a")} lit={sec("s2", 9.2, "a")} h={132} size={56} />
          </Col>
        </Fade>
      </Zone>
      <Confetti at={reveal} x={540} y={760} />
      {[0, 1, 2].map((i) => <Sfx key={i} id="pop" at={ticks[i]} volume={0.3} />)}
      <Sfx id="ding" at={reveal} volume={0.45} />
      <Sfx id="pop" at={sec("s2", 4.7, "a")} volume={0.25} />
      <Sfx id="pop" at={sec("s2", 6.3, "a")} volume={0.25} />
      <Sfx id="pop" at={sec("s2", 8.8, "a")} volume={0.25} />
    </Frame>
  );
};

// ---------- SHOT B: how flags are evaluated ----------
const ShotB: React.FC = () => {
  const s4 = at("s4", "b");
  const s5 = at("s5", "b");
  const q = (id: string, t: number) => at(id, "b") + G(t);
  return (
    <Frame>
      <Panel
        h={300}
        items={[
          { from: 4, to: s4 + 4, head: "Flag chạy ở đâu?", logo: true },
          { from: s4, to: s5 + 4, head: "Dữ liệu ở lại app" },
          { from: s5, head: "Đổi flag, không redeploy", size: 70 },
        ]}
      />
      <Zone>
        <Fade from={4} to={s4 + 4}>
          <Col gap={34} center>
            <Button letter="1" text="Backend SDK" sub="tải cấu hình" appear={q("s3", 0.3)} lit={q("s3", 1.0)} h={200} size={58} />
            <Button letter="2" text="Cache trong memory" appear={q("s3", 2.4)} lit={q("s3", 3.1)} h={200} size={58} />
            <Button letter="3" text="Đánh giá cục bộ" sub="ngay trong ứng dụng" appear={q("s3", 4.6)} lit={q("s3", 5.3)} h={200} size={58} />
          </Col>
        </Fade>
        <Fade from={s4} to={s5 + 4}>
          <Col gap={40} center>
            <Button text="Độ trễ: thường vài giây" sub="khi cấu hình mới truyền xuống" appear={q("s4", 0.3)} lit={q("s4", 1.3)} h={290} size={68} />
            <Button text="User data không rời app" sub="không gửi lên Unleash server" appear={q("s4", 2.8)} lit={q("s4", 3.8)} h={290} size={68} />
          </Col>
        </Fade>
        <Fade from={s5}>
          <Col gap={30} center>
            <Button letter="A" text="Gradual rollout" appear={q("s5", 0.3)} h={170} size={56} />
            <Button letter="B" text="Canary" appear={q("s5", 2.0)} h={170} size={56} />
            <Button letter="C" text="A/B testing" appear={q("s5", 3.6)} h={170} size={56} />
            <Button letter="D" text="Kill switch" appear={q("s5", 5.0)} lit={q("s5", 6.6)} h={170} size={56} />
          </Col>
        </Fade>
      </Zone>
      {[q("s3", 0.3), q("s3", 2.4), q("s3", 4.6), q("s4", 0.3), q("s4", 2.8), q("s5", 0.3), q("s5", 2.0), q("s5", 3.6), q("s5", 5.0)].map((t) => (
        <Sfx key={t} id="pop" at={t} volume={0.22} />
      ))}
      <Sfx id="ding" at={q("s5", 6.6)} volume={0.3} />
    </Frame>
  );
};

// ---------- SHOT C: Compose, PostgreSQL round, hardening ----------
const ShotC: React.FC = () => {
  const s7 = at("s7", "c");
  const s8 = at("s8", "c");
  const q = (id: string, t: number) => at(id, "c") + G(t);
  const rev = q("s7", 3.2);
  return (
    <Frame>
      <Panel
        h={300}
        items={[
          { from: 4, to: s7 + 4, head: "Khởi chạy bằng Compose" },
          { from: s7, to: s8 + 4, head: "PostgreSQL là bắt buộc" },
          { from: s8, head: "Đừng bê nguyên local lên VPS", sub: "Mặc định: admin / unleash4all", size: 66 },
        ]}
      />
      <Zone>
        <Fade from={4} to={s7 + 4}>
          <Col gap={30} center>
            <div
              style={{
                width: 330, height: 330, borderRadius: 165, background: "#fff", border: `10px solid ${GOLD}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 24 24" width={210} height={210}>
                <path d={siDocker.path} fill={`#${siDocker.hex}`} />
              </svg>
            </div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 78, color: "#fff" }}>Docker Compose</div>
            <Button text="Server và database cùng chạy" appear={q("s6", 0.8)} lit={q("s6", 1.8)} h={140} size={46} />
          </Col>
        </Fade>
        <Fade from={s7} to={s8 + 4}>
          <Col gap={32} center>
            <Button letter="A" text="MySQL" sub="không hỗ trợ chính thức" appear={s7 + 6} dim={rev} h={230} size={64} />
            <Button letter="B" text="PostgreSQL" sub="Unleash 8.x: PostgreSQL 15+" appear={s7 + 18} lit={rev} h={230} size={64} />
            <Button letter="C" text="MariaDB" sub="không hỗ trợ chính thức" appear={s7 + 30} dim={rev} h={230} size={64} />
          </Col>
        </Fade>
        <Fade from={s8}>
          <Col gap={34} center>
            <Button letter="1" text="Đổi mật khẩu mặc định" appear={q("s8", 0.4)} lit={q("s8", 1.6)} h={180} size={54} />
            <Button letter="2" text="HTTPS + firewall" sub="reverse proxy" appear={q("s8", 3.2)} lit={q("s8", 4.6)} h={180} size={54} />
            <Button letter="3" text="Backup PostgreSQL" appear={q("s8", 6.4)} lit={q("s8", 7.6)} h={180} size={54} />
          </Col>
        </Fade>
      </Zone>
      <Confetti at={rev} x={540} y={1000} />
      <Sfx id="pop" at={q("s6", 0.8)} volume={0.25} />
      <Sfx id="ding" at={rev} volume={0.45} />
      {[q("s8", 0.4), q("s8", 3.2), q("s8", 6.4)].map((t) => <Sfx key={t} id="pop" at={t} volume={0.22} />)}
    </Frame>
  );
};

// ---------- SHOT D: Flagsmith question mark, sign-off ----------
const ShotD: React.FC = () => {
  const s10 = at("s10", "d");
  const q = (id: string, t: number) => at(id, "d") + G(t);
  const f = useCurrentFrame();
  // a slow ring that keeps ticking while the answer stays open
  const p = (f % 120) / 120;
  return (
    <Frame>
      <Panel
        h={300}
        items={[
          { from: 4, to: s10 + 4, head: "Unleash hay Flagsmith?" },
          { from: s10, head: "Tự host được, tự vận hành nhé", size: 70 },
        ]}
      />
      <Zone>
        <Fade from={4} to={s10 + 4}>
          <Col gap={26}>
            <Button letter="A" text="Unleash" sub={f >= q("s9", 1.0) ? "backend đánh giá cục bộ" : undefined} appear={14} lit={undefined} h={170} size={60} />
            <Button letter="B" text="Flagsmith" sub="chưa có so sánh trong nguồn" appear={26} h={170} size={60} />
            <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 10 }}>
              <Ring size={250} label="?" p={p} pop={1} />
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 60, lineHeight: 1.06, color: "#fff", width: 440, textWrap: "balance", opacity: ramp(f, q("s9", 0.4), 14) }}>
                Chưa đủ dữ liệu so sánh
              </div>
            </div>
          </Col>
        </Fade>
        <Fade from={s10}>
          <Col gap={34} center>
            <Img
              src={videoAsset(SLUG, "repos/Unleash.png")}
              style={{ width: 300, height: 300, borderRadius: 72, background: "#fff", border: `10px solid ${GOLD}` }}
            />
            <Button letter="A" text="Lưu video để thử sau" appear={q("s10", 0.4)} lit={q("s10", 1.0)} h={170} size={52} />
            <Button letter="B" text="Follow để xem phần tiếp" appear={q("s10", 2.2)} lit={q("s10", 2.8)} h={170} size={52} />
          </Col>
        </Fade>
      </Zone>
      <Confetti at={s10 + 6} x={540} y={900} n={80} />
      <Sfx id="ding" at={s10 + 6} volume={0.45} />
      <Sfx id="pop" at={q("s9", 0.4)} volume={0.25} />
      <Sfx id="pop" at={q("s10", 0.4)} volume={0.22} />
      <Sfx id="pop" at={q("s10", 2.2)} volume={0.22} />
    </Frame>
  );
};

const Quiz: React.FC<VideoProps> = ({ guide }) => {
  const timing = linearTiming({ durationInFrames: T });
  const voices = (ids: string[], shot: keyof typeof SHOT_START) =>
    ids.map((id) => (
      <Sequence key={id} from={at(id, shot)} layout="none" name={`voice: ${id}`}>
        <Voice slug={SLUG} id={id} />
      </Sequence>
    ));
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={LEN.a}>
          <ShotA />
          {voices(["s1", "s2"], "a")}
          <Sfx id="thud" volume={0.5} />
          <Brand />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip(1)} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={LEN.b}>
          <ShotB />
          {voices(["s3", "s4", "s5"], "b")}
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={zoomPunch()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={LEN.c}>
          <ShotC />
          {voices(["s6", "s7", "s8"], "c")}
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={flash(GOLD)} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={LEN.d}>
          <ShotD />
          {voices(["s9", "s10"], "d")}
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = { id: SLUG, component: Quiz, durationInFrames: TOTAL };
