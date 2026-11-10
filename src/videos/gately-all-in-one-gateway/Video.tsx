import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  Series,
  useCurrentFrame,
} from "remotion";
import {
  beatmap,
  BRAND_SPACE,
  Brand,
  CONTENT_W,
  display,
  easeOut,
  FPS,
  hit,
  Music,
  SAFE,
  sans,
  Sfx,
  Terminal,
  TikTokGuide,
  TYPE_DELAY,
  typingFrames,
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
const NAVY = "#0A1A3C";
const DEEP = "#06112B";
const RED = "#E4262C";
const WHITE = "#FFFFFF";
const MAP = beatmap(beats);

type Repo = { repo: string; name: string; stars: number; avatar: string };
const REPOS = facts.repos as Repo[];
const repoOf = (id: string) => REPOS.find((r) => r.repo === id) as Repo;
const GATELY = "wangwanjie/gately";
const NPM = "NginxProxyManager/nginx-proxy-manager";

type Bg = { kind: "img" | "vid"; file: string; pos?: string };
const IMG = {
  net: { kind: "img", file: "images/network-cables-router-pixabay-197303.jpg" },
  lock: { kind: "img", file: "images/hacker-security-padlock-computer-pixabay-935619.jpg" },
  srv: { kind: "img", file: "images/server-rack-data-center-blue-pixabay-514641.jpg" },
  code: { kind: "img", file: "images/code-terminal-screen-pixabay-1568556.jpg" },
  rack: { kind: "img", file: "images/home-server-nas-pixabay-838378.jpg" },
  dev: { kind: "vid", file: "footage/developer-at-desk-night-pixabay-232538.mp4", pos: "40% 50%" },
  dc: { kind: "vid", file: "footage/server-room-datacenter-pixabay-171185.mp4" },
} satisfies Record<string, Bg>;
const BGS: Bg[] = [
  IMG.net, IMG.dev, IMG.rack, { ...IMG.net, pos: "50% 80%" }, { ...IMG.srv, pos: "50% 85%" }, IMG.code,
  IMG.dc, { ...IMG.code, pos: "50% 20%" }, { ...IMG.rack, pos: "50% 25%" }, { ...IMG.lock, pos: "50% 30%" },
  IMG.srv,
];

const CHAPTERS = ["Một cổng cho tất cả", "Gately gom những gì", "Sơ đồ và cài đặt", "Giữ an toàn"];
const CHAPTER_OF = [0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3];
const CARD_LEN = 66;
const WIPE = 16;

const ids = script.scenes.map((s) => s.id);
const starts = ids.map((id) => Math.round((timeline.scenes as Record<string, { start: number }>)[id].start * FPS));
const TOTAL = Math.round(timeline.total * FPS);
const lens = starts.map((s, i) => (i + 1 < starts.length ? starts[i + 1] : TOTAL) - s);

const inOut = Easing.bezier(0.76, 0, 0.24, 1);

// Entrance progress 0..1 starting at `delay` frames.
const useP = (delay: number, dur = 16) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
};

const Rise: React.FC<{ delay: number; children: ReactNode; style?: CSSProperties }> = ({ delay, children, style }) => {
  const p = useP(delay);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 28}px)`, ...style }}>{children}</div>;
};

const Backdrop: React.FC<{ bg: Bg; len: number; i: number }> = ({ bg, len, i }) => {
  const f = useCurrentFrame();
  const t = f / len;
  const scale = i % 2 === 0 ? 1.04 + t * 0.12 : 1.16 - t * 0.12;
  const media: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: bg.pos ?? "50% 50%",
  };
  return (
    <AbsoluteFill style={{ background: DEEP, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        {bg.kind === "vid" ? (
          <OffthreadVideo src={videoAsset(SLUG, bg.file)} muted style={media} />
        ) : (
          <Img src={videoAsset(SLUG, bg.file)} style={media} />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(6, 17, 43, 0.58)" }} />
    </AbsoluteFill>
  );
};

const Star: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2l3 7 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.8l1.8-7.3L1.5 9.6 9 9z" fill={RED} />
  </svg>
);

const RepoCard: React.FC<{ id: string; delay: number; big?: boolean; style?: CSSProperties }> = ({
  id,
  delay,
  big,
  style,
}) => {
  const r = repoOf(id);
  const p = useP(delay, 20);
  const logo = big ? 200 : 120;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: big ? 34 : 26,
        background: WHITE,
        color: NAVY,
        padding: big ? "30px 34px" : "20px 26px",
        borderLeft: `14px solid ${RED}`,
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        opacity: p,
        transform: `translateX(${(1 - p) * -90}px)`,
        ...style,
      }}
    >
      <Img src={videoAsset(SLUG, r.avatar)} style={{ width: logo, height: logo, borderRadius: 18 }} />
      <div style={{ fontFamily: sans }}>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: big ? 76 : 52, lineHeight: 1.05 }}>
          {r.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, fontSize: big ? 38 : 36, fontWeight: 700, whiteSpace: "nowrap" }}>
          <Star size={big ? 40 : 36} />
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.stars.toLocaleString("en-US")}</span>
          <span style={{ fontWeight: 500 }}>sao GitHub</span>
        </div>
      </div>
    </div>
  );
};

const Lower: React.FC<{ lines: string[]; delay: number }> = ({ lines, delay }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
    {lines.map((l, k) => (
      <LowerLine key={l} text={l} delay={delay + k * 26} red={k % 2 === 1} />
    ))}
  </div>
);
const LowerLine: React.FC<{ text: string; delay: number; red: boolean }> = ({ text, delay, red }) => {
  const p = useP(delay, 18);
  return (
    <div
      style={{
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        background: red ? RED : WHITE,
        color: red ? WHITE : NAVY,
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 42,
        lineHeight: 1.2,
        textWrap: "balance",
        padding: "16px 30px",
        maxWidth: CONTENT_W,
        boxSizing: "border-box",
      }}
    >
      {text}
    </div>
  );
};

const Headline: React.FC<{ text: string; size?: number; delay?: number; color?: string }> = ({
  text,
  size = 104,
  delay = 8,
  color = WHITE,
}) => (
  <Rise delay={delay}>
    <div
      style={{
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        color,
        textWrap: "balance",
        letterSpacing: -2,
      }}
    >
      {text}
    </div>
  </Rise>
);

const Underline: React.FC<{ delay: number; width: number }> = ({ delay, width }) => {
  const p = useP(delay, 22);
  return <div style={{ height: 10, width: width * p, background: RED, marginTop: 18 }} />;
};

// Big "1/4" story counter.
const Counter: React.FC<{ ch: number; start: number }> = ({ ch, start }) => {
  const f = useCurrentFrame();
  const pump = 1 + 0.05 * hit(MAP.beats, start + f, 9);
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 150,
          lineHeight: 1,
          color: WHITE,
          transform: `scale(${pump})`,
          transformOrigin: "0 100%",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {ch + 1}
        <span style={{ color: RED }}>/</span>
        {CHAPTERS.length}
      </div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: WHITE, whiteSpace: "nowrap" }}>
        {CHAPTERS[ch]}
      </div>
    </div>
  );
};

// Breaking-news bar with a scrolling ticker, sitting just above TikTok's caption zone.
const BAR_H = 88;
const BAR_TOP = 1920 - SAFE.bottom - BAR_H;
const Bar: React.FC<{ ticker: string; start: number }> = ({ ticker, start }) => {
  const f = useCurrentFrame();
  const p = useP(4, 16);
  const text = Array.from({ length: 8 }, () => ticker).join("      •      ");
  const pulse = hit(MAP.beats, start + f, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: BAR_TOP,
        height: BAR_H,
        background: NAVY,
        borderTop: `6px solid ${RED}`,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 36,
        color: WHITE,
        transform: `translateY(${(1 - p) * 110}px)`,
      }}
    >
      <div
        style={{
          flex: "none",
          padding: `0 24px 0 ${SAFE.left}px`,
          color: RED,
          fontWeight: 800,
          fontFamily: display,
          fontSize: 40,
          zIndex: 2,
          background: NAVY,
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: RED,
            opacity: 0.45 + 0.55 * pulse,
          }}
        />
        TIN NÓNG
      </div>
      <div style={{ whiteSpace: "nowrap", transform: `translateX(${-f * 3.2}px)`, paddingLeft: 24 }}>{text}</div>
    </div>
  );
};

// Wipe that reveals a scene: navy panel sliding off to the right with a red edge.
const WipeIn: React.FC<{ at: number; dur: number }> = ({ at, dur }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  const p = interpolate(f, [at, at + dur], [0, 1], { easing: inOut });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: NAVY, clipPath: `inset(0 0 0 ${p * 100}%)` }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${p * 100}%`,
          width: 26,
          background: RED,
          transform: "translateX(-100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const ChapterCard: React.FC<{ ch: number; first: boolean }> = ({ ch, first }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [CARD_LEN, CARD_LEN + WIPE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: inOut,
  });
  if (p >= 1) return null;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "rgba(10, 26, 60, 0.93)",
          clipPath: `inset(0 0 0 ${p * 100}%)`,
          padding: `${SAFE.top + (first ? BRAND_SPACE : 0)}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
          justifyContent: "center",
        }}
      >
        <Rise delay={0}>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 330,
              lineHeight: 1,
              color: WHITE,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {ch + 1}
            <span style={{ color: RED }}>/</span>
            {CHAPTERS.length}
          </div>
        </Rise>
        <Headline text={CHAPTERS[ch]} size={112} delay={6} />
        <Underline delay={12} width={420} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${p * 100}%`,
          width: 26,
          background: RED,
          transform: "translateX(-100%)",
        }}
      />
    </AbsoluteFill>
  );
};

type Ctx = { sc: (typeof script.scenes)[number]; len: number; dur: number; start: number };

// Delay (frames) at which the voice reaches roughly `frac` of its line.
const at = (c: Ctx, frac: number) => Math.round(c.dur * FPS * frac) + 10;

const Mid: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({ children, style }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, ...style }}>
    {children}
  </div>
);

const BigNumber: React.FC<{ value: string; size: number; delay: number; color?: string; slam?: number }> = ({
  value,
  size,
  delay,
  color = WHITE,
  slam,
}) => {
  const f = useCurrentFrame();
  const p = useP(delay, 14);
  const s = slam === undefined || f < slam ? 1 : 1 + 0.3 * Math.max(0, 1 - (f - slam) / 14);
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.95,
        color,
        letterSpacing: -4,
        opacity: p,
        transform: `scale(${s}) translateY(${(1 - p) * 40}px)`,
        transformOrigin: "0 60%",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
  );
};

const Cap: React.FC<{ text: string; delay: number; color?: string; size?: number }> = ({
  text,
  delay,
  color = WHITE,
  size = 52,
}) => (
  <Rise delay={delay}>
    <div style={{ fontFamily: sans, fontWeight: 700, fontSize: size, color, lineHeight: 1.15, textWrap: "balance" }}>
      {text}
    </div>
  </Rise>
);

const Protocols: React.FC<{ c: Ctx }> = ({ c }) => {
  const names = ["HTTPS", "SSH", "RDP", "OpenVPN"];
  const f = useCurrentFrame();
  const rowH = 112;
  const h = rowH * names.length;
  const draw = interpolate(f, [at(c, 0.3), at(c, 0.3) + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const portP = useP(at(c, 0.3) + 30, 18);
  return (
    <div style={{ display: "flex", alignItems: "center", height: h }}>
      <div style={{ width: 280, display: "flex", flexDirection: "column" }}>
        {names.map((n, k) => (
          <Rise key={n} delay={14 + k * 8} style={{ height: rowH, display: "flex", alignItems: "center" }}>
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 60,
                color: WHITE,
                borderBottom: `6px solid ${RED}`,
              }}
            >
              {n}
            </div>
          </Rise>
        ))}
      </div>
      <svg width={170} height={h} viewBox={`0 0 170 ${h}`}>
        {names.map((n, k) => {
          const y = rowH * k + rowH / 2;
          return (
            <path
              key={n}
              d={`M0 ${y} C 90 ${y}, 80 ${h / 2}, 170 ${h / 2}`}
              fill="none"
              stroke={WHITE}
              strokeWidth={6}
              strokeDasharray={400}
              strokeDashoffset={400 * (1 - draw)}
            />
          );
        })}
      </svg>
      <div
        style={{
          opacity: portP,
          transform: `scale(${0.9 + 0.1 * portP})`,
          background: WHITE,
          color: NAVY,
          borderLeft: `14px solid ${RED}`,
          padding: "18px 26px",
          fontFamily: display,
          fontWeight: 800,
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        <div style={{ fontSize: 150 }}>1</div>
        <div style={{ fontSize: 48 }}>cổng</div>
      </div>
    </div>
  );
};

const termDelay = (i: number) => (CHAPTER_OF[i - 1] !== CHAPTER_OF[i] ? CARD_LEN : 0) + 24;
const Term: React.FC<{ c: Ctx; minHeight: number }> = ({ c, minHeight }) => {
  const i = ids.indexOf(c.sc.id);
  return (
    <Sequence from={termDelay(i)} layout="none">
      <div style={{ opacity: 1, boxShadow: "0 12px 30px rgba(0,0,0,0.4)", borderLeft: `14px solid ${RED}` }}>
        <Terminal cmds={c.sc.commands} width={CONTENT_W - 14} fontSize={c.sc.id === "s8" ? 44 : 37} bg={DEEP} accent={RED} minHeight={minHeight} />
      </div>
    </Sequence>
  );
};

const Body: React.FC<{ i: number; c: Ctx }> = ({ i, c }) => {
  const { sc } = c;
  const l1 = at(c, 0.22);
  const l2 = at(c, 0.55);
  const lower = <Lower lines={sc.lines} delay={l1} />;
  switch (i) {
    case 0:
      return (
        <>
          <Mid>
            <BigNumber value="20" size={380} delay={10} color={RED} />
            <Cap text="giao thức mạng dùng chung" delay={20} size={58} />
            <Headline text={sc.headline} size={100} delay={30} />
          </Mid>
          <Lower lines={[sc.lines[1]]} delay={at(c, 0.6)} />
        </>
      );
    case 1:
      return (
        <>
          <Mid style={{ justifyContent: "flex-start", paddingTop: 20 }}>
            <Headline text={sc.headline} size={104} />
            <Underline delay={18} width={300} />
            <RepoCard id={NPM} delay={at(c, 0.25)} big style={{ marginTop: 30 }} />
          </Mid>
          {lower}
        </>
      );
    case 2:
      return (
        <>
          <Mid style={{ gap: 18 }}>
            <Headline text={sc.headline} size={96} delay={6} />
            <RepoCard id={GATELY} delay={10} big />
            <BigNumber
              value={repoOf(GATELY).stars.toLocaleString("en-US")}
              size={200}
              delay={20}
              slam={Math.max(0, MAP.drops[0] - c.start)}
            />
            <Cap text="sao GitHub, một binary Go" delay={30} />
          </Mid>
          {lower}
        </>
      );
    case 3:
      return (
        <>
          <Mid>
            <Headline text={sc.headline} size={92} />
            <Protocols c={c} />
          </Mid>
          <Lower lines={[sc.lines[0]]} delay={at(c, 0.2)} />
        </>
      );
    case 4:
      return (
        <>
          <Mid>
            <Headline text={sc.headline} size={108} />
            <Underline delay={16} width={360} />
            <div style={{ height: 14 }} />
            <Cap text="HTTP/3" delay={at(c, 0.2)} size={62} />
            <Cap text="Chứng chỉ tự động" delay={at(c, 0.3)} size={62} />
            <Cap text="Coraza + OWASP CRS v4" delay={at(c, 0.45)} size={62} color="#FFD7D8" />
          </Mid>
          <Lower lines={[sc.lines[1]]} delay={at(c, 0.7)} />
        </>
      );
    case 5:
      return (
        <>
          <Mid>
            <Headline text={sc.headline} size={96} />
            <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
              <BigNumber value="3" size={420} delay={at(c, 0.5)} color={RED} />
              <Cap text="bản cũ để rollback" delay={at(c, 0.55)} size={58} />
            </div>
            <Cap text="frp và Cloudflare Tunnel" delay={at(c, 0.1)} size={60} />
          </Mid>
          <Lower lines={[sc.lines[0]]} delay={at(c, 0.3)} />
        </>
      );
    case 6:
      return (
        <>
          <Mid style={{ gap: 20 }}>
            <Headline text={sc.headline} size={100} />
            <RepoCard id={GATELY} delay={at(c, 0.3)} />
            <RepoCard id={NPM} delay={at(c, 0.6)} />
            <BigNumber value="ARMv7" size={170} delay={at(c, 0.62)} color={RED} />
          </Mid>
          <Lower lines={[sc.lines[0]]} delay={at(c, 0.2)} />
        </>
      );
    case 7:
      return (
        <>
          <Mid>
            <Headline text={sc.headline} size={100} />
            <Term c={c} minHeight={130} />
          </Mid>
          <Lower lines={sc.lines} delay={at(c, 0.5)} />
        </>
      );
    case 8:
      return (
        <>
          <Mid>
            <Headline text={sc.headline} size={92} />
            <Term c={c} minHeight={130} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 10 }}>
              <BigNumber value="16680" size={210} delay={at(c, 0.62)} />
              <Cap text="cổng quản lý" delay={at(c, 0.66)} size={50} />
            </div>
          </Mid>
          <Lower lines={[sc.lines[0]]} delay={at(c, 0.2)} />
        </>
      );
    case 9:
      return (
        <>
          <Mid>
            <Headline text={sc.headline} size={104} />
            <Underline delay={16} width={330} />
            <div style={{ height: 16 }} />
            <Term c={c} minHeight={190} />
          </Mid>
          <Lower lines={sc.lines} delay={l2} />
        </>
      );
    default:
      return (
        <>
          <Mid>
            <RepoCard id={GATELY} delay={10} big />
            <Headline text="Lưu lại để thử nghiệm" size={112} delay={at(c, 0.15)} />
            <Underline delay={at(c, 0.2)} width={400} />
          </Mid>
          {lower}
        </>
      );
  }
};

const SceneShot: React.FC<{ i: number }> = ({ i }) => {
  const sc = script.scenes[i];
  const ch = CHAPTER_OF[i];
  const first = i === 0;
  const chapterStart = i === 0 || CHAPTER_OF[i - 1] !== ch;
  const c: Ctx = { sc, len: lens[i], dur: (durations as Record<string, number>)[sc.id], start: starts[i] };
  const ticker = [sc.headline, ...sc.lines].join("      •      ");
  const cmds = sc.commands;
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Backdrop bg={BGS[i]} len={lens[i]} i={i} />
      <AbsoluteFill
        style={{
          padding: `${SAFE.top + (first ? BRAND_SPACE : 0)}px ${SAFE.right}px ${1920 - BAR_TOP + 30}px ${SAFE.left}px`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Counter ch={ch} start={c.start} />
          <Body i={i} c={c} />
        </div>
      </AbsoluteFill>
      <Bar ticker={ticker} start={c.start} />
      {chapterStart && !first ? <ChapterCard ch={ch} first={first} /> : first ? null : <WipeIn at={0} dur={WIPE} />}
      {first && <Brand />}
      <Voice slug={SLUG} id={sc.id} />
      <Sfx id={chapterStart ? "thud" : "whoosh"} volume={0.3} at={chapterStart ? 0 : 2} />
      {chapterStart && !first && <Sfx id="whoosh" volume={0.3} at={CARD_LEN} />}
      <Sfx id="pop" volume={0.25} at={at(c, 0.25)} />
      {cmds.length > 0 && <Sfx id="typing" at={termDelay(i) + TYPE_DELAY} frames={typingFrames(cmds)} volume={0.22} />}
    </AbsoluteFill>
  );
};

const voiceRanges = ids.map((id, i): [number, number] => [
  starts[i],
  starts[i] + Math.round((durations as Record<string, number>)[id] * FPS),
]);

const Component: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ background: DEEP }}>
    <Series>
      {ids.map((id, i) => (
        <Series.Sequence key={id} name={id} durationInFrames={lens[i]}>
          <SceneShot i={i} />
        </Series.Sequence>
      ))}
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = { id: SLUG, component: Component, durationInFrames: TOTAL };
