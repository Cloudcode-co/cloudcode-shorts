import { loadFont } from "@remotion/google-fonts/Baloo2";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, Series, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { siClaude, siCursor } from "simple-icons";
import { Brand, BRAND_SPACE, Music, SAFE, Sfx, Voice, FPS, easeOut, videoAsset, type VideoDef, type VideoProps } from "../../kit";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const font = loadFont("normal", { weights: ["700", "800"], subsets: ["latin", "vietnamese"] }).fontFamily;

const C = {
  bg: "#1A0A4C",
  panel: "#2D1580",
  panelEdge: "#7B5CFF",
  gold: "#FFC93C",
  green: "#22D36B",
  red: "#FF5C7A",
  white: "#FFFFFF",
  dim: "#4A3A8F",
};

const TITLE = 42; // chapter card length in frames
const LEN = Object.fromEntries(
  Object.entries(timeline.scenes).map(([k, v]) => [k, Math.round(v.length * FPS)]),
) as Record<string, number>;
const TOTAL = Object.values(LEN).reduce((a, b) => a + b, 0);
const VO = (id: keyof typeof durations) => Math.round(durations[id] * FPS);

const S = script.scenes;
const OPTIONS = S[0].lines; // "A. Khoảng 3 giây", ...
const QUESTION = S[0].headline;
const logo = videoAsset(SLUG, "repos/debpalash.png");

const ring = (p: number) => Easing.out(Easing.cubic)(p);

// ---------- shared set ----------
const Set: React.FC<{ children: React.ReactNode; footage?: string; dark?: number }> = ({ children, footage, dark = 0.82 }) => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: font, overflow: "hidden" }}>
    {footage && (
      <AbsoluteFill>
        <OffthreadVideo src={videoAsset(SLUG, `footage/${footage}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: C.bg, opacity: dark }} />
      </AbsoluteFill>
    )}
    {/* studio spotlight sweeps */}
    <AbsoluteFill style={{ background: "conic-gradient(from 200deg at 50% 0%, transparent 0 20deg, rgba(123,92,255,0.18) 20deg 34deg, transparent 34deg 50deg, rgba(255,201,60,0.10) 50deg 62deg, transparent 62deg 360deg)" }} />
    {children}
    {/* gold bulbs along the bottom of the stage */}
  </AbsoluteFill>
);

const Pad: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = SAFE.top }) => (
  <AbsoluteFill style={{ padding: `${top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`, display: "flex", flexDirection: "column" }}>{children}</AbsoluteFill>
);

const Title: React.FC<{ text: string; n: string; brand?: boolean }> = ({ text, n, brand }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const out = interpolate(f, [TITLE - 6, TITLE], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: brand ? C.bg : C.gold, fontFamily: font, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: brand ? "repeating-conic-gradient(from 0deg at 50% 55%, #2D1580 0 7.5deg, #1A0A4C 7.5deg 15deg)" : "repeating-conic-gradient(from 0deg at 50% 55%, #FFD25E 0 7.5deg, #FFC93C 7.5deg 15deg)" }} />
      <AbsoluteFill style={{ padding: `${SAFE.top + (brand ? BRAND_SPACE : 0)}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`, justifyContent: "center", alignItems: "center", textAlign: "center", opacity: out }}>
        <div style={{ transform: `translateY(${(1 - p) * 60}px) rotate(${(1 - p) * -4}deg)`, opacity: p }}>
          <div style={{ fontSize: 340, fontWeight: 800, color: brand ? C.gold : C.bg, lineHeight: 0.85 }}>{n}</div>
          <div style={{ fontSize: 124, fontWeight: 800, color: brand ? C.white : C.bg, lineHeight: 1, textWrap: "balance" as never, marginTop: 20 }}>{text}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Panel: React.FC<{ children: React.ReactNode; size?: number; delay?: number; glow?: string }> = ({ children, size = 82, delay = 0, glow = C.panelEdge }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)`, background: C.panel, border: `8px solid ${glow}`, borderRadius: 56, boxShadow: `0 0 50px ${glow}88`, padding: "40px 44px", textAlign: "center", color: C.white, fontSize: size, fontWeight: 800, lineHeight: 1.08, textWrap: "balance" as never }}>
      {children}
    </div>
  );
};

type BtnState = "idle" | "win" | "lose";
const Btn: React.FC<{ text: string; letter: string; h?: number; fs?: number; state?: BtnState; delay?: number; at?: number }> = ({ text, letter, h = 190, fs = 68, state = "idle", delay = 0, at = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: { damping: 16, stiffness: 160 }, durationInFrames: 24 });
  const k = f - at;
  const win = state === "win" ? spring({ frame: k, fps, config: { damping: 8, stiffness: 180 } }) : 0;
  const shake = state === "lose" && k >= 0 && k < 40 ? Math.sin(k * 1.9) * 14 * (1 - k / 40) : 0;
  const dimP = state === "lose" ? interpolate(k, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const bg = state === "win" ? C.green : C.panel;
  const edge = state === "win" ? "#B6FFD2" : C.gold;
  const opacity = interpolate(p, [0, 1], [0, 1]) * (1 - 0.55 * dimP);
  const txt = text.replace(/^[A-D]\.\s*/, "");
  return (
    <div style={{ height: h, display: "flex", alignItems: "center", gap: 28, padding: "0 30px", borderRadius: h / 2.6, background: bg, border: `8px solid ${state === "lose" ? C.dim : edge}`, boxShadow: state === "win" ? `0 0 70px ${C.green}` : `0 10px 0 #0E0530`, opacity, transform: `translateX(${(1 - p) * -120 + shake}px) scale(${1 + win * 0.05})`, color: state === "win" ? "#06331A" : C.white, filter: dimP ? `grayscale(${dimP})` : undefined }}>
      <div style={{ width: Math.min(h - 60, 170), height: Math.min(h - 60, 170), borderRadius: "50%", background: state === "win" ? "#06331A" : C.gold, color: state === "win" ? C.green : C.bg, fontSize: fs, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{letter}</div>
      <div style={{ fontSize: fs, fontWeight: 800, lineHeight: 1.05, textWrap: "balance" as never }}>{txt}</div>
    </div>
  );
};

const Stack: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 28 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>{children}</div>
);
const letters = ["A", "B", "C", "D"];

// ---------- scenes ----------
const Q1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Set footage="developer-at-desk-night-pixabay-232538.mp4">
        <Pad top={SAFE.top + BRAND_SPACE}>
          <Panel delay={TITLE}>
            <Img src={logo} style={{ width: 90, height: 90, borderRadius: 24, marginBottom: 6 }} />
            <div>{QUESTION}</div>
          </Panel>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Stack gap={34}>
              {OPTIONS.map((o, i) => (
                <Btn key={o} text={o} letter={letters[i]} delay={TITLE + 60 + i * 18} h={210} fs={72} />
              ))}
            </Stack>
          </div>
        </Pad>
      </Set>
      {f < TITLE && (
        <AbsoluteFill><Title text="Câu hỏi" n="?" brand /></AbsoluteFill>
      )}
      <Brand />
      <Sfx id="thud" volume={0.5} />
      <Sfx id="whoosh" at={TITLE} volume={0.3} />
      {OPTIONS.map((_, i) => <Sfx key={i} id="pop" at={TITLE + 60 + i * 18} volume={0.25} />)}
      <Sequence from={TITLE} layout="none"><Voice slug={SLUG} id="s1" /></Sequence>
    </>
  );
};

const Countdown: React.FC = () => {
  const f = useCurrentFrame();
  const step = 56;
  const first = 6;
  const idx = Math.min(2, Math.max(0, Math.floor((f - first) / step)));
  const local = (f - first) - idx * step;
  const done = f >= first + step * 3;
  const nums = ["3", "2", "1"];
  const prog = interpolate(local, [0, step - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const R = 250;
  const circ = 2 * Math.PI * R;
  const pop = interpolate(local, [0, 10], [1.35, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const urgent = idx === 2;
  const col = urgent ? C.red : C.gold;
  return (
    <Set>
      <Pad>
        <Panel size={52} glow={C.panelEdge}>{QUESTION}</Panel>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <svg width={600} height={600} viewBox="0 0 600 600" style={{ position: "absolute" }}>
            <circle cx={300} cy={300} r={R} stroke={C.panel} strokeWidth={34} fill="none" />
            <circle cx={300} cy={300} r={R} stroke={col} strokeWidth={34} fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={done ? circ : circ * ring(prog)} transform="rotate(-90 300 300)" />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1={300} y1={20} x2={300} y2={44} stroke={C.white} strokeOpacity={0.5} strokeWidth={6} transform={`rotate(${i * 30} 300 300)`} />
            ))}
          </svg>
          <div style={{ fontSize: done ? 300 : 440, fontWeight: 800, color: col, transform: `scale(${done ? 1 : pop})`, textShadow: `0 0 60px ${col}99`, lineHeight: 1 }}>{done ? "?" : nums[idx]}</div>
        </div>
        <Stack gap={20}>
          {OPTIONS.map((o, i) => (<Btn key={o} text={o} letter={letters[i]} h={130} fs={56} />))}
        </Stack>
      </Pad>
      <Voice slug={SLUG} id="s2" />
      {[0, 1, 2].map((i) => <Sfx key={i} id="pixel" at={first + i * step} volume={0.4} />)}
      <Sfx id="whoosh" volume={0.25} />
    </Set>
  );
};

const Confetti: React.FC = () => {
  const f = useCurrentFrame();
  const colors = [C.gold, C.green, "#FF5C9A", "#5CC8FF", C.white, C.panelEdge];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 70 }, (_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const sp = 500 + random(`s${i}`) * 900;
        const t = f / FPS;
        const x = 540 + Math.cos(ang) * sp * t * 0.9;
        const y = 800 + Math.sin(ang) * sp * t * 0.9 - 300 * t + 1500 * t * t * 0.5;
        const w = 18 + random(`w${i}`) * 18;
        const op = interpolate(f, [60, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: w * 0.55, background: colors[i % colors.length], opacity: op, transform: `rotate(${f * (4 + random(`r${i}`) * 10)}deg)` }} />;
      })}
    </AbsoluteFill>
  );
};

const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Set>
      <Pad>
        <Panel size={52} glow={C.green} delay={0}>{QUESTION}</Panel>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Stack gap={30}>
            <Btn text={S[2].headline} letter="A" h={320} fs={88} state="win" />
            <Btn text={OPTIONS[1]} letter="B" h={170} fs={62} state="lose" at={6} />
            <Btn text={OPTIONS[2]} letter="C" h={170} fs={62} state="lose" at={10} />
          </Stack>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, color: C.gold, textAlign: "center", opacity: interpolate(f, [30, 46], [0, 1], { extrapolateRight: "clamp" }), textWrap: "balance" as never }}>{S[2].lines[0]}</div>
      </Pad>
      <Confetti />
      <Voice slug={SLUG} id="s3" />
      <Sfx id="ding" volume={0.5} />
      <Sfx id="thud" volume={0.4} />
      <Sfx id="pop" at={6} volume={0.3} />
    </Set>
  );
};

const Chapter: React.FC<{ title: string; n: string; id: keyof typeof durations; children: React.ReactNode; footage?: string }> = ({ title, n, id, children, footage }) => {
  const f = useCurrentFrame();
  return (
    <>
      <Set footage={footage}>{children}</Set>
      {f < TITLE && <AbsoluteFill><Title text={title} n={n} /></AbsoluteFill>}
      <Sfx id="whoosh" volume={0.35} />
      <Sfx id="pop" at={TITLE} volume={0.25} />
      <Sequence0 id={id} />
    </>
  );
};
const Sequence0: React.FC<{ id: keyof typeof durations }> = ({ id }) => (
  <Sequence from={TITLE} layout="none"><Voice slug={SLUG} id={id} /></Sequence>
);

// Shot helper: content is local to the shot, starting at `from` frame of the scene.
const Shot: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">{children}</Sequence>
);

const Big: React.FC<{ children: React.ReactNode; size: number; color?: string; delay?: number }> = ({ children, size, color = C.gold, delay = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: { damping: 13, stiffness: 150 }, durationInFrames: 26 });
  return <div style={{ fontSize: size, fontWeight: 800, color, lineHeight: 0.95, textAlign: "center", transform: `scale(${0.7 + 0.3 * p})`, opacity: Math.min(1, p * 2), textShadow: `0 0 50px ${color}66` }}>{children}</div>;
};
const Cap: React.FC<{ children: React.ReactNode; size?: number; delay?: number; color?: string }> = ({ children, size = 72, delay = 8, color = C.white }) => {
  const p = useInP(delay);
  return <div style={{ fontSize: size, fontWeight: 800, color, textAlign: "center", lineHeight: 1.08, textWrap: "balance" as never, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>{children}</div>;
};
const useInP = (delay: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
};
const Center: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 36 }) => (
  <Pad><div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "stretch", gap }}>{children}</div></Pad>
);

const Explain1: React.FC = () => (
  <Chapter title="Vì sao đáng dùng" n="1" id="s4" footage="content-creator-recording-studio-pixabay-122737.mp4">
    <Shot from={TITLE} to={190}>
      <Center>
        <Img src={logo} style={{ width: 300, height: 300, borderRadius: 64, alignSelf: "center", border: `8px solid ${C.gold}` }} />
        <Big size={150}>Chạy local</Big>
        <Cap size={64} delay={14}>Hoàn toàn cục bộ trên máy bạn</Cap>
      </Center>
    </Shot>
    <Shot from={190} to={340}>
      <Center gap={20}>
        <Big size={440}>646</Big>
        <Cap size={100} delay={10}>ngôn ngữ</Cap>
      </Center>
      <Sfx id="thud" volume={0.45} />
    </Shot>
    <Shot from={340} to={500}>
      <Center gap={40}>
        <Panel size={100} glow={C.gold}>Lồng tiếng khớp thời gian video gốc</Panel>
        <Cap size={76} color={C.gold} delay={22}>Tự động lồng tiếng cho video</Cap>
      </Center>
      <Sfx id="pop" volume={0.3} />
    </Shot>
    <Shot from={500} to={LEN.s4}>
      <Center gap={30}>
        <Big size={190} color={C.green}>0 đồng</Big>
        <Cap size={72} delay={10}>Không tốn phí API ElevenLabs</Cap>
      </Center>
      <Sfx id="ding" volume={0.35} />
    </Shot>
  </Chapter>
);

const IconCard: React.FC<{ icon: { title: string; hex: string; path: string }; delay: number }> = ({ icon, delay }) => {
  const p = useInP(delay);
  return (
    <div style={{ flex: 1, background: C.panel, border: `8px solid ${C.gold}`, borderRadius: 48, padding: "110px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 28, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
      <svg width={240} height={240} viewBox="0 0 24 24"><path d={icon.path} fill="#fff" /></svg>
      <div style={{ fontSize: 64, fontWeight: 800, color: C.white }}>{icon.title}</div>
    </div>
  );
};

const Explain2: React.FC = () => (
  <Chapter title="Cắm vào code" n="2" id="s5">
    <Shot from={TITLE} to={270}>
      <Center gap={24}>
        <Img src={logo} style={{ width: 240, height: 240, borderRadius: 56, alignSelf: "center", border: `8px solid ${C.gold}` }} />
        <Cap size={88} delay={0}>Local API cổng</Cap>
        <Big size={330}>3900</Big>
      </Center>
      <Sfx id="thud" volume={0.45} at={4} />
    </Shot>
    <Shot from={270} to={LEN.s5}>
      <Center gap={44}>
        <Cap size={80} color={C.gold} delay={0}>MCP server</Cap>
        <div style={{ display: "flex", gap: 36 }}>
          <IconCard icon={siCursor} delay={10} />
          <IconCard icon={siClaude} delay={22} />
        </div>
        <Cap size={60} delay={30}>Tích hợp trực tiếp</Cap>
      </Center>
      <Sfx id="pop" volume={0.3} at={10} />
      <Sfx id="pop" volume={0.3} at={22} />
    </Shot>
  </Chapter>
);

const Outro: React.FC = () => (
  <Chapter title="Đến lượt bạn" n="!" id="s6" >
    <Shot from={TITLE} to={LEN.s6}>
      <Pad>
        <Panel size={100} glow={C.gold}>{S[5].headline}</Panel>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Stack gap={40}>
            <Btn text={S[5].lines[0]} letter="A" h={320} fs={76} delay={50} />
            <Btn text={S[5].lines[1]} letter="B" h={320} fs={76} delay={110} state="idle" />
          </Stack>
        </div>
      </Pad>
      <Sfx id="pop" at={50} volume={0.3} />
      <Sfx id="pop" at={110} volume={0.3} />
    </Shot>
  </Chapter>
);

// ---------- timeline ----------
const VOICE_RANGES: [number, number][] = (() => {
  const starts: Record<string, number> = {};
  let at = 0;
  for (const k of Object.keys(LEN)) { starts[k] = at; at += LEN[k]; }
  const delay: Record<string, number> = { s1: TITLE, s4: TITLE, s5: TITLE, s6: TITLE };
  return Object.keys(LEN).map((k) => [starts[k] + (delay[k] ?? 0), starts[k] + (delay[k] ?? 0) + VO(k as keyof typeof durations)] as [number, number]);
})();

const Quiz: React.FC<VideoProps> = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence name="Question" durationInFrames={LEN.s1}><QDelayed /></Series.Sequence>
      <Series.Sequence name="Countdown" durationInFrames={LEN.s2}><Countdown /></Series.Sequence>
      <Series.Sequence name="Reveal" durationInFrames={LEN.s3}><Reveal /></Series.Sequence>
      <Series.Sequence name="Explain 1" durationInFrames={LEN.s4}><Explain1 /></Series.Sequence>
      <Series.Sequence name="Explain 2" durationInFrames={LEN.s5}><Explain2 /></Series.Sequence>
      <Series.Sequence name="Outro" durationInFrames={LEN.s6}><Outro /></Series.Sequence>
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
  </AbsoluteFill>
);
const QDelayed: React.FC = () => <Q1 />;

export const video: VideoDef = { id: SLUG, component: Quiz, durationInFrames: TOTAL };
