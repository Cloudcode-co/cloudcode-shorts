// A tech-news bulletin about win4wine: Windows XP's explorer.exe running as
// the Linux desktop shell. Navy desk graphics, one red accent, a picture behind
// every story, a 1/3 story counter and a bottom ticker. Every shot changes at
// least every 1.5 s: the scenes cut between full-frame compositions, while the
// live picture keeps a slow push underneath.
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  useCurrentFrame,
} from "remotion";
import { siDebian, siReactos, siWine, type SimpleIcon } from "simple-icons";
import {
  BRAND_SPACE,
  Brand,
  beatmap,
  buildUp,
  CONTENT_W,
  easeOut,
  enter,
  FPS,
  flash,
  hit,
  mono,
  Music,
  SAFE,
  sans,
  sectionAt,
  Sfx,
  Terminal,
  TikTokGuide,
  TYPE_DELAY,
  typingFrames,
  useIn,
  videoAsset,
  Voice,
  whip,
  type VideoDef,
} from "../../kit";
import beatJson from "./beatmap.json";
import durations from "./durations.json";
import facts from "./facts.json";
import timeline from "./timeline.json";

const SLUG = "win4wine-xp-explorer-linux";
const A = (path: string) => videoAsset(SLUG, path);
const archivo = loadArchivo("normal", {
  weights: ["700", "800"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

// ---------- palette and layout ----------

const INK = "#050B18";
const NAVY = "#0A1736";
const PAPER = "#F5F7FB";
const WHITE = "#FFFFFF";
const RED = "#E4322B";
const MUTED = "rgba(255,255,255,0.62)";
const SLATE = "#44506E";
const XP_BAR = "linear-gradient(180deg,#2C5CA8,#14346B)";
const XP_TASKBAR = "linear-gradient(180deg,#1B3F7C,#0E2550)";

const BAR_H = 64;
const COUNTER_H = 170;
const CONTENT_BOTTOM = 1330;
const TICKER_TOP = 1356;
const TOP_S1 = 604;
const TOP_ALL = 520;

type Repo = (typeof facts.repos)[number];
const WIN = facts.repos[0] as Repo;
const CHI = facts.repos[1] as Repo;

const TL = timeline.scenes as Record<string, { start: number; length: number }>;
const ORDER = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"] as const;
const LENS = ORDER.map((id) => Math.round(TL[id].length * FPS));
const STARTS = ORDER.map((_, i) => LENS.slice(0, i).reduce((a, b) => a + b, 0));
const TOTAL = LENS.reduce((a, b) => a + b, 0);
const START = (id: (typeof ORDER)[number]) => STARTS[ORDER.indexOf(id)];
const S3_START = START("s3");
const S8_START = START("s8");
const S2_START = START("s2");
const DROP = 1606; // 26.773 s, the beatmap's drop
const VO = durations as Record<string, number>;

const STORY_LABEL = ["XP thật trên Linux", "Bên trong win4wine", "Tự thử trên Debian 13"];

const MAP = beatmap(beatJson);
const STARS_WIN = WIN.stars.toLocaleString("vi-VN");
const STARS_CHI = CHI.stars.toLocaleString("vi-VN");
const TICKER = `win4wine ${STARS_WIN} sao  /  Chicago95 ${STARS_CHI} sao  /  Wine 11.0 vá 151 bản  /  explorer.exe từ ISO XP SP3  /  IE6 và Media Player 9  /  ReactOS 0.4.16  /  Debian 13  /  biên dịch ~1,5 giờ  /  `;

// ---------- small helpers ----------

const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);

const rev = (t: number, at: number, dur = 16) =>
  interpolate(t, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

const Star: React.FC<{ size: number; color?: string }> = ({ size, color = RED }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
    <path
      d="M12 1.8l3 6.6 7.2.8-5.4 4.8 1.5 7.1L12 17.4l-6.3 3.7 1.5-7.1L1.8 9.2 9 8.4z"
      fill={color}
    />
  </svg>
);

const SIcon: React.FC<{ icon: SimpleIcon; size: number; color?: string }> = ({
  icon,
  size,
  color = WHITE,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
    <path d={icon.path} fill={color} />
  </svg>
);

const useCount = (to: number, at: number, frames = 40) => {
  const f = useCurrentFrame();
  return Math.round(
    interpolate(f, [at, at + frames], [0, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    }),
  );
};

// ---------- shared broadcast parts ----------

const Hl: React.FC<{
  at: number;
  children: ReactNode;
  size?: number;
  style?: CSSProperties;
  color?: string;
}> = ({ at, children, size = 92, style, color = WHITE }) => {
  const p = useIn(at, 18);
  return (
    <div
      style={{
        ...enter(p, 40),
        fontFamily: archivo,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.98,
        letterSpacing: -2,
        color,
        textWrap: "balance",
        textShadow: "0 3px 24px rgba(0,0,0,0.4)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const LT: React.FC<{
  at: number;
  children: ReactNode;
  size?: number;
  style?: CSSProperties;
}> = ({ at, children, size = 40, style }) => {
  const p = useIn(at, 16);
  return (
    <div
      style={{
        ...enter(p, 26),
        alignSelf: "flex-start",
        maxWidth: 720,
        boxSizing: "border-box",
        background: "rgba(5,12,28,0.93)",
        borderLeft: `10px solid ${RED}`,
        padding: "15px 25px",
        fontFamily: sans,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.25,
        color: WHITE,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Kicker: React.FC<{ at: number; children: ReactNode; style?: CSSProperties }> = ({
  at,
  children,
  style,
}) => {
  const p = useIn(at, 14);
  return (
    <div
      style={{
        ...enter(p, 18),
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 38,
        color: RED,
        letterSpacing: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Rule: React.FC<{ at: number; width?: number; style?: CSSProperties }> = ({
  at,
  width = 240,
  style,
}) => {
  const p = useIn(at, 16);
  return (
    <div
      style={{
        width,
        height: 8,
        background: RED,
        transform: `scaleX(${p})`,
        transformOrigin: "left center",
        ...style,
      }}
    />
  );
};

const Stage: React.FC<{ top?: number; children: ReactNode }> = ({ top = TOP_ALL, children }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      top,
      width: CONTENT_W,
      height: CONTENT_BOTTOM - top,
      fontFamily: sans,
    }}
  >
    {children}
  </div>
);

const RepoCard: React.FC<{
  at: number;
  repo: Repo;
  tone?: "light" | "dark";
  meta?: string;
}> = ({ at, repo, tone = "light", meta }) => {
  const p = useIn(at, 18);
  const stars = repo.stars.toLocaleString("vi-VN");
  const dark = tone === "dark";
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 44}px) scale(${0.97 + 0.03 * p})`,
        width: CONTENT_W,
        boxSizing: "border-box",
        background: dark ? "rgba(8,16,36,0.95)" : PAPER,
        borderTop: `9px solid ${RED}`,
        border: dark ? "2px solid rgba(255,255,255,0.16)" : "none",
        borderTopWidth: 9,
        borderTopStyle: "solid",
        borderTopColor: RED,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: 26,
      }}
    >
      <Img
        src={A(repo.avatar)}
        style={{
          width: 126,
          height: 126,
          objectFit: "cover",
          flex: "none",
          border: `3px solid ${dark ? RED : NAVY}`,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: archivo,
            fontWeight: 800,
            fontSize: 74,
            lineHeight: 1,
            color: dark ? WHITE : NAVY,
          }}
        >
          {repo.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 50,
            color: dark ? WHITE : NAVY,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <Star size={44} />
          {stars}
          <span style={{ fontSize: 34, fontWeight: 500, color: dark ? MUTED : SLATE }}>sao</span>
        </div>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 34,
            color: dark ? MUTED : SLATE,
            marginTop: 5,
          }}
        >
          {meta ?? `${repo.language}${repo.license ? ` / ${repo.license}` : ""}`}
        </div>
      </div>
    </div>
  );
};

// XP-style window chrome, used as the diagram frame for the real subject.
const WinBtn: React.FC<{ kind: "min" | "max" | "close" }> = ({ kind }) => (
  <div
    style={{
      width: 27,
      height: 27,
      border: "2px solid #FFFFFF",
      background: kind === "close" ? RED : "#3D6FBC",
      position: "relative",
      flex: "none",
      boxSizing: "border-box",
    }}
  >
    {kind === "min" && (
      <div style={{ position: "absolute", left: 5, right: 5, bottom: 6, height: 3, background: WHITE }} />
    )}
    {kind === "max" && (
      <div style={{ position: "absolute", left: 5, top: 5, right: 5, bottom: 5, border: "2px solid #FFFFFF" }} />
    )}
    {kind === "close" && (
      <>
        <div
          style={{
            position: "absolute",
            left: 3,
            top: 11,
            width: 19,
            height: 3,
            background: WHITE,
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 3,
            top: 11,
            width: 19,
            height: 3,
            background: WHITE,
            transform: "rotate(-45deg)",
          }}
        />
      </>
    )}
  </div>
);

const XpWindow: React.FC<{
  at: number;
  title: string;
  children: ReactNode;
  width?: number;
  classic?: boolean;
  slam?: boolean;
  style?: CSSProperties;
}> = ({ at, title, children, width = 720, classic = false, slam = false, style }) => {
  const f = useCurrentFrame();
  const t = f - at;
  const p = slam
    ? spring({ frame: t, fps: FPS, config: { damping: 16, stiffness: 210, mass: 0.6 } })
    : rev(f, at, 16);
  return (
    <div
      style={{
        width,
        boxSizing: "border-box",
        background: PAPER,
        border: `3px solid ${classic ? "#6B6B6B" : NAVY}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px) scale(${0.94 + 0.06 * p})`,
        ...style,
      }}
    >
      <div
        style={{
          height: 58,
          background: classic ? "#0A246A" : XP_BAR,
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "0 14px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 34,
            color: WHITE,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        {!classic && (
          <>
            <WinBtn kind="min" />
            <WinBtn kind="max" />
            <WinBtn kind="close" />
          </>
        )}
      </div>
      <div style={{ padding: 26 }}>{children}</div>
    </div>
  );
};

const WinFlag: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 3,
        flex: "none",
      }}
    >
      <div style={{ background: RED }} />
      <div style={{ background: NAVY }} />
      <div style={{ background: NAVY }} />
      <div style={{ background: RED }} />
    </div>
  );
};

const TrayIcon: React.FC<{ kind: "net" | "vol" | "batt"; size?: number; color?: string }> = ({
  kind,
  size = 36,
  color = WHITE,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
    {kind === "net" && (
      <>
        <rect x={2} y={15} width={5} height={7} fill={color} />
        <rect x={9} y={10} width={5} height={12} fill={color} />
        <rect x={16} y={4} width={5} height={18} fill={color} />
      </>
    )}
    {kind === "vol" && (
      <>
        <path d="M3 9h4l5-4v14l-5-4H3z" fill={color} />
        <path d="M16 8a6 6 0 010 8" stroke={color} strokeWidth={2} fill="none" />
        <path d="M19 5a10 10 0 010 14" stroke={color} strokeWidth={2} fill="none" />
      </>
    )}
    {kind === "batt" && (
      <>
        <rect x={2} y={7} width={17} height={10} fill="none" stroke={color} strokeWidth={2} />
        <rect x={20} y={10} width={2} height={4} fill={color} />
        <rect x={5} y={10} width={11} height={4} fill={color} />
      </>
    )}
  </svg>
);

const Taskbar: React.FC<{ at: number; classic?: boolean }> = ({ at, classic = false }) => {
  const p = useIn(at, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: CONTENT_W,
        height: 76,
        boxSizing: "border-box",
        background: classic ? "#D4D0C8" : XP_TASKBAR,
        borderTop: classic ? "3px solid #FFFFFF" : "3px solid #6E96CC",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 12px",
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
      }}
    >
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 16px",
          background: classic ? "#D4D0C8" : PAPER,
          border: classic ? "3px solid #404040" : `3px solid ${NAVY}`,
          boxShadow: classic ? "inset 2px 2px 0 #FFFFFF, inset -2px -2px 0 #808080" : undefined,
        }}
      >
        <WinFlag size={26} />
        <span
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 34,
            color: classic ? "#000000" : NAVY,
            fontStyle: classic ? "italic" : "normal",
            lineHeight: 1,
          }}
        >
          Start
        </span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <TrayIcon kind="net" color={classic ? NAVY : WHITE} />
        <TrayIcon kind="vol" color={classic ? NAVY : WHITE} />
        <TrayIcon kind="batt" color={classic ? NAVY : WHITE} />
      </div>
    </div>
  );
};

// ---------- scenes ----------

const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Brand />
      <Stage top={TOP_S1}>
        {f < 120 && (
          <>
            <Hl at={8} size={96} style={{ position: "absolute", left: 0, top: 0 }}>
              Explorer.exe
              <br />
              trên Linux
            </Hl>
            <Rule at={70} width={300} style={{ position: "absolute", left: 0, top: 232 }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 262,
                ...enter(rev(f, 78, 16), 20),
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 38,
                color: WHITE,
              }}
            >
              Windows XP / Wine
            </div>
            <LT at={44} style={{ position: "absolute", left: 0, top: 330 }}>
              Chạy explorer.exe trên Wine
            </LT>
          </>
        )}
        {f >= 120 && f < 240 && (
          <>
            <XpWindow at={120} title="explorer.exe" width={724} style={{ position: "absolute", left: 0, top: 0 }}>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: RED }}>Windows XP</div>
              <div
                style={{
                  fontFamily: archivo,
                  fontWeight: 800,
                  fontSize: 66,
                  lineHeight: 1,
                  color: NAVY,
                  marginTop: 4,
                }}
              >
                Desktop shell
              </div>
              <div style={{ width: 220, height: 8, background: RED, marginTop: 18 }} />
              <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 36, color: SLATE, marginTop: 14 }}>
                chạy trực tiếp trong Wine
              </div>
            </XpWindow>
            <LT at={178} style={{ position: "absolute", left: 0, top: 380 }}>
              Không chỉ là bộ giao diện
            </LT>
          </>
        )}
        {f >= 240 && f < 330 && (
          <>
            <RepoCard at={240} repo={WIN} />
            <LT at={300} style={{ position: "absolute", left: 0, top: 300 }}>
              {WIN.name} / GitHub
            </LT>
          </>
        )}
        {f >= 330 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 10,
                ...enter(rev(f, 330, 18), 30),
                fontFamily: archivo,
                fontWeight: 800,
                fontSize: 146,
                lineHeight: 1,
                letterSpacing: -4,
                color: WHITE,
                whiteSpace: "nowrap",
              }}
            >
              Thử chưa?
            </div>
            <Rule at={366} width={CONTENT_W} style={{ position: "absolute", left: 0, top: 184 }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 204,
                ...enter(rev(f, 372, 16), 20),
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 44,
                color: RED,
              }}
            >
              explorer.exe
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 270,
                ...enter(rev(f, 382, 16), 20),
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 36,
                color: MUTED,
              }}
            >
              trên Windows XP / Linux
            </div>
            <LT at={350} style={{ position: "absolute", left: 0, top: 350 }}>
              Không chỉ là bộ giao diện
            </LT>
          </>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Stage>
        {f < 100 && (
          <>
            <Hl at={8} size={94} style={{ position: "absolute", left: 0, top: 0 }}>
              Khác biệt
              <br />
              với Chicago95
            </Hl>
            <Rule at={62} width={300} style={{ position: "absolute", left: 0, top: 226 }} />
            <LT at={48} style={{ position: "absolute", left: 0, top: 256 }}>
              Theme bọc ngoài desktop XFCE
            </LT>
          </>
        )}
        {f >= 100 && f < 210 && (
          <>
            <RepoCard at={84} repo={CHI} tone="dark" meta="HTML / theme XFCE" />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 300,
                ...enter(rev(f, 150, 16), 20),
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 36,
                color: MUTED,
              }}
            >
              một bộ theme, không phải shell
            </div>
          </>
        )}
        {f >= 210 && f < 300 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: CONTENT_W,
              background: "rgba(8,16,36,0.95)",
              borderTop: `9px solid ${RED}`,
              border: "2px solid rgba(255,255,255,0.16)",
              borderTopWidth: 9,
              borderTopColor: RED,
              boxSizing: "border-box",
              ...enter(rev(f, 210, 16), 36),
            }}
          >
            {[
              { repo: CHI, role: "theme GTK / XFCE", hero: false },
              { repo: WIN, role: "explorer.exe thật", hero: true },
            ].map((row, i) => {
              const p = rev(f, 216 + i * 32, 16);
              return (
                <div
                  key={row.repo.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 22,
                    padding: "20px 24px",
                    borderLeft: `10px solid ${row.hero ? RED : "rgba(255,255,255,0.18)"}`,
                    borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.16)" : undefined,
                    opacity: p,
                    transform: `translateX(${(1 - p) * -30}px)`,
                  }}
                >
                  <Img
                    src={A(row.repo.avatar)}
                    style={{
                      width: 84,
                      height: 84,
                      objectFit: "cover",
                      border: `2px solid ${row.hero ? RED : "rgba(255,255,255,0.3)"}`,
                      flex: "none",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: archivo,
                        fontWeight: 800,
                        fontSize: 56,
                        lineHeight: 1,
                        color: row.hero ? WHITE : MUTED,
                      }}
                    >
                      {row.repo.name}
                    </div>
                    <div
                      style={{
                        fontFamily: sans,
                        fontWeight: 700,
                        fontSize: 34,
                        color: row.hero ? WHITE : MUTED,
                        marginTop: 6,
                      }}
                    >
                      {row.role}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: sans,
                      fontWeight: 700,
                      fontSize: 40,
                      color: row.hero ? RED : MUTED,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {row.repo.stars.toLocaleString("vi-VN")}
                    <span style={{ fontSize: 34, fontWeight: 500 }}> sao</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {f >= 300 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                ...enter(rev(f, 300, 18), 30),
                fontFamily: archivo,
                fontWeight: 800,
                fontSize: 156,
                lineHeight: 0.96,
                letterSpacing: -4,
                color: WHITE,
              }}
            >
              Theme
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 172,
                ...enter(rev(f, 316, 18), 30),
                fontFamily: archivo,
                fontWeight: 800,
                fontSize: 66,
                lineHeight: 1,
                color: RED,
              }}
            >
              không phải shell
            </div>
            <Rule at={336} width={CONTENT_W} style={{ position: "absolute", left: 0, top: 252 }} />
            <LT at={326} style={{ position: "absolute", left: 0, top: 300 }}>
              Chỉ đổi giao diện bên ngoài
            </LT>
          </>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Stage>
        {f < 110 && (
          <>
            <Hl at={8} size={94} style={{ position: "absolute", left: 0, top: 0 }}>
              Nhị phân XP
              <br />
              nguyên bản
            </Hl>
            <Rule at={66} width={300} style={{ position: "absolute", left: 0, top: 226 }} />
            <LT at={52} style={{ position: "absolute", left: 0, top: 258 }}>
              Trích xuất từ ISO Windows XP
            </LT>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 360,
                ...enter(rev(f, 88, 16), 20),
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 40,
                color: RED,
              }}
            >
              Windows XP ISO
            </div>
          </>
        )}
        {f >= 110 && f < 240 && (
          <>
            <XpWindow at={110} title="explorer.exe" width={724} style={{ position: "absolute", left: 0, top: 0 }}>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: RED }}>Windows XP</div>
              <div
                style={{
                  fontFamily: archivo,
                  fontWeight: 800,
                  fontSize: 68,
                  lineHeight: 1,
                  color: NAVY,
                  marginTop: 4,
                }}
              >
                bản gốc
              </div>
              <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 40, color: SLATE, marginTop: 16 }}>
                explorer.exe
              </div>
            </XpWindow>
            <LT at={172} style={{ position: "absolute", left: 0, top: 372 }}>
              Dùng explorer.exe nguyên bản
            </LT>
          </>
        )}
        {f >= 240 && f < 340 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 10,
                ...enter(rev(f, 242, 16), 20),
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 40,
                color: RED,
              }}
            >
              Windows XP
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 70,
                ...enter(rev(f, 240, 18), 34),
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 94,
                lineHeight: 1,
                letterSpacing: -3,
                color: WHITE,
              }}
            >
              explorer.exe
            </div>
            <Rule at={286} width={CONTENT_W} style={{ position: "absolute", left: 0, top: 190 }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 214,
                ...enter(rev(f, 292, 16), 20),
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 40,
                color: MUTED,
              }}
            >
              trích xuất từ ISO
            </div>
            <LT at={300} style={{ position: "absolute", left: 0, top: 320 }}>
              Không phải bản mô phỏng
            </LT>
          </>
        )}
        {f >= 340 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: CONTENT_W,
                ...enter(rev(f, 332, 18), 36),
                background: PAPER,
                border: `3px solid ${NAVY}`,
              }}
            >
              <div
                style={{
                  background: RED,
                  color: WHITE,
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 34,
                  padding: "10px 22px",
                }}
              >
                Lấy từ ISO Windows XP
              </div>
              <div style={{ padding: "22px 24px" }}>
                <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 48, color: NAVY }}>
                  explorer.exe
                </div>
                <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 36, color: SLATE, marginTop: 4 }}>
                  nhị phân nguyên bản
                </div>
                <div
                  style={{
                    fontFamily: sans,
                    fontWeight: 700,
                    fontSize: 36,
                    color: NAVY,
                    marginTop: 18,
                    paddingTop: 16,
                    borderTop: "2px solid rgba(10,23,54,0.16)",
                  }}
                >
                  Không chỉnh sửa nhị phân của Windows
                </div>
              </div>
            </div>
            <LT at={388} style={{ position: "absolute", left: 0, top: 340 }}>
              Khác biệt nằm ở Wine
            </LT>
          </>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

const S4: React.FC = () => {
  const f = useCurrentFrame();
  const patched = useCount(151, 234, 46);
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Stage>
        {f < 230 && (
          <>
            <Hl at={-20} size={86} style={{ position: "absolute", left: 0, top: 0 }}>
              Wine làm
              <br />
              desktop shell
            </Hl>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 200,
                width: CONTENT_W,
                background: "rgba(8,16,36,0.95)",
                border: "2px solid rgba(255,255,255,0.16)",
                borderTop: `9px solid ${RED}`,
                borderTopWidth: 9,
                borderTopColor: RED,
                boxSizing: "border-box",
                ...enter(rev(f, -4, 14), 30),
              }}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 36,
                  color: MUTED,
                  padding: "18px 24px 6px",
                }}
              >
                Đồ thật từ XP
              </div>
              {[
                { name: "Taskbar", value: "thật" },
                { name: "Start Menu", value: "thật" },
                { name: "Wine 11.0", value: "vá 151 bản" },
              ].map((row, i) => {
                const p = rev(f, -6 + i * 5, 10);
                return (
                  <div
                    key={row.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "15px 24px",
                      borderTop: "1px solid rgba(255,255,255,0.14)",
                      opacity: p,
                      transform: `translateX(${(1 - p) * -24}px)`,
                    }}
                  >
                    <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 42, color: WHITE }}>
                      {row.name}
                    </span>
                    <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: RED }}>
                      {row.value}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 566,
                ...enter(rev(f, 150, 18), 30),
                fontFamily: archivo,
                fontWeight: 800,
                fontSize: 78,
                lineHeight: 1,
                color: WHITE,
              }}
            >
              đều là đồ thật
            </div>
          </>
        )}
        {f >= 230 && f < 330 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                ...enter(rev(f, 230, 16), 20),
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 40,
                color: RED,
              }}
            >
              Wine 11.0
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 44,
                ...enter(rev(f, 232, 18), 34),
                fontFamily: archivo,
                fontWeight: 800,
                fontSize: 300,
                lineHeight: 0.9,
                letterSpacing: -8,
                color: WHITE,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {patched}
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 326,
                ...enter(rev(f, 270, 16), 20),
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 46,
                color: WHITE,
              }}
            >
              bản vá
            </div>
            <LT at={292} style={{ position: "absolute", left: 0, top: 410 }}>
              Vá 151 bản sửa lỗi
            </LT>
          </>
        )}
        {f >= 330 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 30,
                display: "flex",
                alignItems: "center",
                gap: 24,
                ...enter(rev(f, 330, 16), 24),
              }}
            >
              <SIcon icon={siWine} size={78} color={RED} />
              <span
                style={{
                  fontFamily: mono,
                  fontWeight: 700,
                  fontSize: 88,
                  lineHeight: 1,
                  letterSpacing: -2,
                  color: WHITE,
                }}
              >
                wine 11.0
              </span>
            </div>
            <Rule at={364} width={CONTENT_W} style={{ position: "absolute", left: 0, top: 170 }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 198,
                ...enter(rev(f, 366, 16), 20),
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 44,
                color: WHITE,
              }}
            >
              WoW64
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 258,
                ...enter(rev(f, 380, 16), 20),
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 36,
                color: WHITE,
              }}
            >
              ứng dụng 32-bit và 64-bit
            </div>
            <LT at={352} style={{ position: "absolute", left: 0, top: 380 }}>
              Bản Wine đã vá cho shell XP
            </LT>
          </>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Stage>
        <Taskbar at={0} />
        {f < 105 && (
          <>
            <Kicker at={0} style={{ position: "absolute", left: 0, top: 0 }}>
              Tích hợp ứng dụng Linux
            </Kicker>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 88,
                ...enter(rev(f, 0, 18), 34),
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 92,
                lineHeight: 1,
                letterSpacing: -4,
                color: WHITE,
              }}
            >
              bridge-wm
            </div>
            <Rule at={34} width={CONTENT_W} style={{ position: "absolute", left: 0, top: 206 }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 234,
                ...enter(rev(f, 38, 16), 20),
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 42,
                color: WHITE,
              }}
            >
              X11 + Win32
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 294,
                ...enter(rev(f, 52, 16), 20),
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 34,
                color: WHITE,
              }}
            >
              cầu nối cửa sổ Linux và XP
            </div>
            <LT at={68} style={{ position: "absolute", left: 0, top: 392 }}>
              Cửa sổ Linux mang viền XP
            </LT>
          </>
        )}
        {f >= 105 && f < 215 && (
          <>
            <Kicker at={105} style={{ position: "absolute", left: 0, top: 0 }}>
              Tích hợp ứng dụng Linux
            </Kicker>
            <XpWindow
              at={105}
              title="Ứng dụng Linux"
              width={720}
              slam
              style={{ position: "absolute", left: 0, top: 88 }}
            >
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: RED }}>Khung cửa sổ XP</div>
              <div
                style={{
                  fontFamily: archivo,
                  fontWeight: 800,
                  fontSize: 56,
                  lineHeight: 1,
                  color: NAVY,
                  marginTop: 2,
                }}
              >
                Taskbar + Alt+Tab
              </div>
              <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, color: SLATE, marginTop: 10 }}>
                nằm trong All Programs
              </div>
            </XpWindow>
            <LT at={170} style={{ position: "absolute", left: 0, top: 430 }}>
              Cửa sổ Linux mang viền XP
            </LT>
          </>
        )}
        {f >= 215 && f < 325 && (
          <>
            <Kicker at={215} style={{ position: "absolute", left: 0, top: 0 }}>
              Tích hợp ứng dụng Linux
            </Kicker>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 72,
                ...enter(rev(f, 215, 16), 30),
                width: 566,
                background: PAPER,
                border: `3px solid ${NAVY}`,
              }}
            >
              <div
                style={{
                  background: XP_BAR,
                  color: WHITE,
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 34,
                  padding: "10px 20px",
                }}
              >
                All Programs
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "18px 20px",
                  borderLeft: `8px solid ${RED}`,
                }}
              >
                <div style={{ width: 34, height: 34, background: RED, flex: "none" }} />
                <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: NAVY }}>
                  Ứng dụng Linux
                </span>
              </div>
              <div
                style={{
                  padding: "0 20px 18px 28px",
                  fontFamily: sans,
                  fontWeight: 500,
                  fontSize: 34,
                  color: SLATE,
                }}
              >
                Taskbar, Alt+Tab như XP
              </div>
            </div>
            <LT at={283} style={{ position: "absolute", left: 0, top: 400 }}>
              Nằm gọn trong All Programs
            </LT>
          </>
        )}
        {f >= 325 && (
          <>
            <Kicker at={325} style={{ position: "absolute", left: 0, top: 0 }}>
              Tích hợp ứng dụng Linux
            </Kicker>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 96,
                width: 640,
                background: "rgba(8,16,36,0.95)",
                border: "2px solid rgba(255,255,255,0.18)",
                borderLeft: `10px solid ${RED}`,
                boxSizing: "border-box",
                padding: "22px 26px",
                ...enter(rev(f, 325, 16), 30),
              }}
            >
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: WHITE }}>
                Khay hệ thống
              </div>
              {[
                { kind: "net" as const, label: "NetworkManager" },
                { kind: "vol" as const, label: "PipeWire / PulseAudio" },
              ].map((row, i) => {
                const p = rev(f, 343 + i * 24, 16);
                return (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      marginTop: i === 0 ? 18 : 12,
                      opacity: p,
                      transform: `translateX(${(1 - p) * -20}px)`,
                    }}
                  >
                    <TrayIcon kind={row.kind} size={44} color={WHITE} />
                    <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: WHITE }}>
                      {row.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <LT at={389} style={{ position: "absolute", left: 0, top: 400 }}>
              Hỗ trợ khay hệ thống và Alt+Tab
            </LT>
          </>
        )}
      </Stage>
    </AbsoluteFill>
  );
};
const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Stage>
        {f < 110 && (
          <>
            <Hl at={8} size={90} style={{ position: "absolute", left: 0, top: 0 }}>
              Chạy IE6 và
              <br />
              Media Player
            </Hl>
            <Rule at={64} width={300} style={{ position: "absolute", left: 0, top: 212 }} />
            <LT at={50} style={{ position: "absolute", left: 0, top: 244 }}>
              Internet Explorer 6 hoạt động
            </LT>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 360,
                ...enter(rev(f, 88, 16), 20),
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 40,
                color: RED,
              }}
            >
              Windows XP ISO
            </div>
          </>
        )}
        {f >= 110 && f < 230 && (
          <>
            <div style={{ display: "flex", gap: 37, position: "absolute", left: 0, top: 0 }}>
              {[
                { big: "IE6", name: "Internet Explorer 6", at: 110 },
                { big: "WMP9", name: "Windows Media Player 9", at: 128 },
              ].map((app, i) => {
                const p = rev(f, app.at, 18);
                return (
                  <div
                    key={app.big}
                    style={{
                      width: 370,
                      boxSizing: "border-box",
                      background: i === 0 ? PAPER : "rgba(8,16,36,0.95)",
                      borderTop: `9px solid ${RED}`,
                      border: i === 0 ? "none" : "2px solid rgba(255,255,255,0.16)",
                      borderTopWidth: 9,
                      borderTopStyle: "solid",
                      borderTopColor: RED,
                      padding: "22px 24px 26px",
                      opacity: p,
                      transform: `translateY(${(1 - p) * 40}px)`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: archivo,
                        fontWeight: 800,
                        fontSize: 130,
                        lineHeight: 1,
                        letterSpacing: -4,
                        color: i === 0 ? NAVY : WHITE,
                      }}
                    >
                      {app.big}
                    </div>
                    <div
                      style={{
                        fontFamily: sans,
                        fontWeight: 700,
                        fontSize: 34,
                        lineHeight: 1.2,
                        color: i === 0 ? SLATE : MUTED,
                        marginTop: 8,
                      }}
                    >
                      {app.name}
                    </div>
                  </div>
                );
              })}
            </div>
            <LT at={176} style={{ position: "absolute", left: 0, top: 400 }}>
              Windows Media Player 9 từ ISO
            </LT>
          </>
        )}
        {f >= 230 && f < 340 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                display: "flex",
                justifyContent: "center",
                ...enter(rev(f, 230, 18), 30),
              }}
            >
              <div
                style={{
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  border: "10px solid rgba(255,255,255,0.8)",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 34,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.28)",
                  }}
                />
                <div
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    border: `4px solid ${RED}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: archivo,
                    fontWeight: 800,
                    fontSize: 54,
                    color: WHITE,
                    letterSpacing: -1,
                  }}
                >
                  ISO
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 410,
                ...enter(rev(f, 258, 16), 20),
                fontFamily: archivo,
                fontWeight: 800,
                fontSize: 58,
                color: WHITE,
              }}
            >
              Windows XP
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 482,
                ...enter(rev(f, 276, 16), 20),
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 42,
                color: RED,
              }}
            >
              IE6 / WMP9
            </div>
            <LT at={300} style={{ position: "absolute", left: 0, top: 570 }}>
              Cả hai đều trích xuất từ đĩa cài
            </LT>
          </>
        )}
        {f >= 340 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: CONTENT_W,
                ...enter(rev(f, 332, 18), 36),
                background: PAPER,
                border: `3px solid ${NAVY}`,
              }}
            >
              <div
                style={{
                  background: RED,
                  color: WHITE,
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 34,
                  padding: "10px 22px",
                }}
              >
                Từ đĩa cài Windows XP
              </div>
              <div style={{ padding: "14px 24px 22px" }}>
                {["Internet Explorer 6", "Windows Media Player 9"].map((name, i) => {
                  const p = rev(f, 344 + i * 12, 16);
                  return (
                    <div
                      key={name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "14px 0",
                        borderTop: i === 0 ? undefined : "1px solid rgba(10,23,54,0.16)",
                        opacity: p,
                        transform: `translateX(${(1 - p) * -20}px)`,
                      }}
                    >
                      <div style={{ width: 26, height: 26, background: RED, flex: "none" }} />
                      <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: NAVY }}>
                        {name}
                      </span>
                      <span style={{ marginLeft: "auto", fontFamily: sans, fontWeight: 500, fontSize: 34, color: SLATE }}>
                        từ ISO
                      </span>
                    </div>
                  );
                })}
                <div
                  style={{
                    fontFamily: sans,
                    fontWeight: 700,
                    fontSize: 36,
                    color: NAVY,
                    paddingTop: 16,
                    borderTop: "2px solid rgba(10,23,54,0.16)",
                  }}
                >
                  Chạy trên Wine như đồ thật
                </div>
              </div>
            </div>
            <LT at={392} style={{ position: "absolute", left: 0, top: 360 }}>
              Không cần cài Windows
            </LT>
          </>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Stage>
        {f < 110 && (
          <>
            <Hl at={8} size={104} style={{ position: "absolute", left: 0, top: 0 }}>
              Tùy chọn
              <br />
              ReactOS
            </Hl>
            <Rule at={66} width={300} style={{ position: "absolute", left: 0, top: 232 }} />
            <LT at={50} style={{ position: "absolute", left: 0, top: 264 }}>
              Không bắt buộc có ISO XP
            </LT>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 370,
                ...enter(rev(f, 86, 18), 20),
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 44,
                color: RED,
              }}
            >
              ReactOS 0.4.16
            </div>
          </>
        )}
        {f >= 110 && f < 230 && (
          <>
            <XpWindow
              at={110}
              title="ReactOS Shell"
              width={724}
              classic
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <SIcon icon={siReactos} size={62} color={NAVY} />
                <div style={{ fontFamily: archivo, fontWeight: 800, fontSize: 54, color: NAVY }}>ReactOS</div>
                <div style={{ marginLeft: "auto", fontFamily: mono, fontWeight: 700, fontSize: 38, color: RED }}>
                  0.4.16
                </div>
              </div>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 48, color: NAVY, marginTop: 18 }}>
                Windows 2000 Classic
              </div>
              <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, color: SLATE, marginTop: 4 }}>
                shell nguồn mở, script tự tải
              </div>
            </XpWindow>
            <LT at={180} style={{ position: "absolute", left: 0, top: 390 }}>
              Giao diện Windows 2000 Classic
            </LT>
          </>
        )}
        {f >= 230 && f < 360 && (
          <>
            <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: RED, ...enter(rev(f, 230, 16), 20) }}>
              Chọn nguồn shell
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 60,
                width: CONTENT_W,
                ...enter(rev(f, 230, 16), 30),
                background: "rgba(8,16,36,0.95)",
                border: "2px solid rgba(255,255,255,0.16)",
                borderTop: `9px solid ${RED}`,
                boxSizing: "border-box",
              }}
            >
              {[
                { name: "ISO Windows XP", note: "tự chuẩn bị", hero: false, icon: null },
                { name: "ReactOS 0.4.16", note: "nguồn mở, tự tải", hero: true, icon: siReactos },
              ].map((row, i) => {
                const p = rev(f, 240 + i * 36, 16);
                return (
                  <div
                    key={row.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      padding: "22px 24px",
                      borderLeft: `10px solid ${row.hero ? RED : "rgba(255,255,255,0.18)"}`,
                      borderTop: i === 0 ? undefined : "1px solid rgba(255,255,255,0.14)",
                      opacity: p,
                      transform: `translateX(${(1 - p) * -26}px)`,
                    }}
                  >
                    {row.icon ? (
                      <SIcon icon={row.icon} size={54} color={row.hero ? WHITE : MUTED} />
                    ) : (
                      <div style={{ width: 54, height: 54, border: "3px solid rgba(255,255,255,0.3)", flex: "none" }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: sans,
                          fontWeight: 700,
                          fontSize: 40,
                          color: row.hero ? WHITE : MUTED,
                        }}
                      >
                        {row.name}
                      </div>
                      <div
                        style={{
                          fontFamily: sans,
                          fontWeight: 500,
                          fontSize: 34,
                          color: row.hero ? WHITE : MUTED,
                          marginTop: 2,
                        }}
                      >
                        {row.note}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <LT at={316} style={{ position: "absolute", left: 0, top: 410 }}>
              Không cần ISO vẫn chạy được shell
            </LT>
          </>
        )}
        {f >= 360 && (
          <>
            <Taskbar at={360} classic />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                ...enter(rev(f, 360, 18), 30),
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 40,
                color: RED,
              }}
            >
              ReactOS Shell
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 52,
                ...enter(rev(f, 362, 18), 36),
                fontFamily: archivo,
                fontWeight: 800,
                fontSize: 100,
                lineHeight: 0.96,
                letterSpacing: -4,
                color: WHITE,
              }}
            >
              Windows 2000
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 170,
                ...enter(rev(f, 376, 18), 30),
                fontFamily: archivo,
                fontWeight: 800,
                fontSize: 66,
                lineHeight: 1,
                color: RED,
              }}
            >
              Classic
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 280,
                ...enter(rev(f, 396, 16), 20),
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 36,
                color: WHITE,
              }}
            >
              shell nguồn mở, không cần ISO Microsoft
            </div>
            <LT at={420} style={{ position: "absolute", left: 0, top: 400 }}>
              Một lựa chọn thay thế ISO XP
            </LT>
          </>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

const CMDS = [
  "git clone https://github.com/mikuta0407/win4wine.git ~/win4wine",
  "cd ~/win4wine",
  "scripts/setup.sh --media /path/to/WindowsXPSP3.iso --greeter",
];

const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      {f < 100 && (
        <Stage>
          <Hl at={8} size={92} style={{ position: "absolute", left: 0, top: 0 }}>
            Cách cài trên
            <br />
            Debian 13
          </Hl>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 210,
              display: "flex",
              alignItems: "center",
              gap: 20,
              ...enter(rev(f, 40, 16), 24),
            }}
          >
            <SIcon icon={siDebian} size={72} color={RED} />
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: WHITE }}>
              Debian 13 / cài mới
            </span>
          </div>
          <Rule at={80} width={300} style={{ position: "absolute", left: 0, top: 290 }} />
          <LT at={58} style={{ position: "absolute", left: 0, top: 322 }}>
            Chỉ thử trên Debian 13 cài mới
          </LT>
        </Stage>
      )}
      {f >= 100 && (
        <>
          <Stage>
            <div style={{ opacity: f >= 360 && f < 460 ? 0 : 1 }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                display: "flex",
                alignItems: "center",
                gap: 14,
                ...enter(rev(f, 100, 14), 16),
              }}
            >
              <SIcon icon={siDebian} size={38} color={RED} />
              <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: WHITE }}>
                Debian 13
              </span>
              <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 34, color: MUTED }}>Terminal</span>
            </div>
            <Sequence from={100} durationInFrames={LENS[7] - 100 + 10} layout="none">
              <div style={{ position: "absolute", left: 0, top: 68 }}>
                <Terminal
                  cmds={CMDS}
                  width={CONTENT_W}
                  fontSize={40}
                  minHeight={452}
                  bg="#071021"
                  fg={WHITE}
                  accent={RED}
                />
              </div>
            </Sequence>
            <LT at={206} style={{ position: "absolute", left: 0, top: 548 }}>
              Chạy trên Debian 13 cài mới
            </LT>
            <LT at={300} style={{ position: "absolute", left: 0, top: 626 }} size={38}>
              Biên dịch Wine mất ~1,5 giờ
            </LT>
            </div>
          </Stage>
          {f >= 360 && f < 460 && (
            <AbsoluteFill>
              <div
                style={{
                  position: "absolute",
                  left: SAFE.left,
                  top: 620,
                  width: CONTENT_W,
                  textShadow: "0 4px 26px rgba(0,0,0,0.55)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 80,
                    background: RED,
                    transform: `scaleY(${rev(f, 360, 14)})`,
                    transformOrigin: "top center",
                    marginBottom: 20,
                  }}
                />
                <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: RED }}>Biên dịch Wine</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 18, marginTop: 2 }}>
                  <div
                    style={{
                      fontFamily: archivo,
                      fontWeight: 800,
                      fontSize: 238,
                      lineHeight: 0.86,
                      letterSpacing: -8,
                      color: WHITE,
                      fontVariantNumeric: "tabular-nums",
                      ...enter(rev(f, 368, 18), 30),
                    }}
                  >
                    1,5
                  </div>
                  <div
                    style={{
                      fontFamily: archivo,
                      fontWeight: 800,
                      fontSize: 104,
                      lineHeight: 1,
                      color: WHITE,
                      paddingBottom: 16,
                      ...enter(rev(f, 380, 18), 20),
                    }}
                  >
                    giờ
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: sans,
                    fontWeight: 700,
                    fontSize: 38,
                    color: WHITE,
                    marginTop: 18,
                    ...enter(rev(f, 396, 16), 20),
                  }}
                >
                  trên CPU 4 nhân
                </div>
                <div
                  style={{
                    fontFamily: sans,
                    fontWeight: 500,
                    fontSize: 34,
                    color: WHITE,
                    marginTop: 8,
                    ...enter(rev(f, 412, 16), 20),
                  }}
                >
                  thời gian build từ mã nguồn
                </div>
              </div>
            </AbsoluteFill>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Stage>
        {f < 130 && (
          <>
            <Hl at={8} size={94} style={{ position: "absolute", left: 0, top: 0 }}>
              Lưu lại thử
              <br />
              trên máy ảo
            </Hl>
            <Rule at={66} width={300} style={{ position: "absolute", left: 0, top: 226 }} />
            <LT at={52} style={{ position: "absolute", left: 0, top: 258 }}>
              Khuyến cáo thử trên máy ảo
            </LT>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 366,
                width: CONTENT_W,
                background: "rgba(8,16,36,0.95)",
                border: "2px solid rgba(255,255,255,0.16)",
                borderTop: `9px solid ${RED}`,
                borderTopWidth: 9,
                borderTopColor: RED,
                boxSizing: "border-box",
                ...enter(rev(f, 0, 14), 26),
              }}
            >
              <div
                style={{
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: 36,
                  color: MUTED,
                  padding: "18px 24px 6px",
                }}
              >
                Trước khi thử
              </div>
              {[
                { name: "Lưu video", value: "xem lại sau" },
                { name: "Máy ảo", value: "thử an toàn" },
              ].map((row, i) => {
                const p = rev(f, 6 + i * 8, 12);
                return (
                  <div
                    key={row.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 24px",
                      borderTop: "1px solid rgba(255,255,255,0.14)",
                      opacity: p,
                      transform: `translateX(${(1 - p) * -24}px)`,
                    }}
                  >
                    <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: WHITE }}>
                      {row.name}
                    </span>
                    <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: RED }}>
                      {row.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {f >= 130 && f < 280 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                ...enter(rev(f, 130, 18), 34),
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 86,
                lineHeight: 1,
                letterSpacing: -3,
                color: WHITE,
              }}
            >
              explorer.exe
            </div>
            <Rule at={168} width={CONTENT_W} style={{ position: "absolute", left: 0, top: 118 }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 150,
                ...enter(rev(f, 172, 16), 20),
                fontFamily: archivo,
                fontWeight: 800,
                fontSize: 62,
                color: RED,
              }}
            >
              Windows XP
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 230,
                ...enter(rev(f, 188, 16), 20),
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 36,
                color: MUTED,
              }}
            >
              chạy như desktop shell trên Linux
            </div>
            <LT at={196} style={{ position: "absolute", left: 0, top: 340 }}>
              Lưu video để thử trên máy ảo
            </LT>
          </>
        )}
        {f >= 280 && f < 400 && (
          <>
            <Kicker at={280} style={{ position: "absolute", left: 0, top: 0 }}>
              Theo dõi kênh
            </Kicker>
            <Hl at={290} size={96} style={{ position: "absolute", left: 0, top: 58 }}>
              Xem thêm
              <br />
              mẹo mới
            </Hl>
            <Rule at={332} width={CONTENT_W} style={{ position: "absolute", left: 0, top: 276 }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 306,
                ...enter(rev(f, 336, 16), 20),
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 36,
                color: WHITE,
              }}
            >
              explorer.exe trên Windows XP / Linux
            </div>
          </>
        )}
        {f >= 400 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                ...enter(rev(f, 400, 16), 20),
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 36,
                color: RED,
              }}
            >
              Hết bản tin
            </div>
            <div style={{ position: "absolute", left: 0, top: 64 }}>
              <RepoCard at={408} repo={WIN} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 380,
                ...enter(rev(f, 452, 16), 20),
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 36,
                color: WHITE,
              }}
            >
              explorer.exe chạy trên Linux
            </div>
          </>
        )}
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- persistent broadcast furniture ----------

const storyAt = (f: number) => (f < S3_START ? 1 : f < S8_START ? 2 : 3);

const TopBar: React.FC = () => {
  const f = useCurrentFrame();
  const lift = interpolate(f, [S2_START - 6, S2_START + 8], [BRAND_SPACE, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const story = storyAt(f);
  const at = story === 1 ? -99999 : story === 2 ? S3_START : S8_START;
  const p = story === 1 ? 1 : rev(f, at, 10);
  const prev = Math.max(1, story - 1);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + lift,
        width: CONTENT_W,
        height: BAR_H,
        display: "flex",
        background: "rgba(6,13,30,0.95)",
        borderBottom: `3px solid ${RED}`,
        boxSizing: "border-box",
        zIndex: 30,
      }}
    >
      <div
        style={{
          width: 228,
          background: RED,
          color: WHITE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: archivo,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 0.5,
          flex: "none",
        }}
      >
        TIN NÓNG
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 34,
            color: WHITE,
            opacity: 1 - p,
            transform: `translateY(${-p * 26}px)`,
          }}
        >
          {STORY_LABEL[prev - 1]}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 34,
            color: WHITE,
            opacity: p,
            transform: `translateY(${(1 - p) * 26}px)`,
          }}
        >
          {STORY_LABEL[story - 1]}
        </div>
      </div>
    </div>
  );
};

const Counter: React.FC = () => {
  const f = useCurrentFrame();
  const lift = interpolate(f, [S2_START - 6, S2_START + 8], [BRAND_SPACE, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const story = storyAt(f);
  const at = story === 1 ? -99999 : story === 2 ? S3_START : S8_START;
  const p = story === 1 ? 1 : rev(f, at, 10);
  const prev = Math.max(1, story - 1);
  const digit: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: 128,
    fontFamily: archivo,
    fontWeight: 800,
    fontSize: 154,
    lineHeight: "170px",
    letterSpacing: -6,
    color: WHITE,
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + lift + BAR_H + 12,
        height: COUNTER_H,
        display: "flex",
        alignItems: "flex-end",
        zIndex: 30,
      }}
    >
      <div style={{ position: "relative", width: 128, height: COUNTER_H }}>
        <div style={{ ...digit, opacity: 1 - p, transform: `translateY(${-p * 42}px)` }}>{prev}</div>
        <div style={{ ...digit, opacity: p, transform: `translateY(${(1 - p) * 42}px)` }}>{story}</div>
      </div>
      <div
        style={{
          fontFamily: archivo,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: "138px",
          color: RED,
        }}
      >
        /
      </div>
      <div
        style={{
          fontFamily: archivo,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: "138px",
          color: MUTED,
        }}
      >
        3
      </div>
      <div style={{ paddingBottom: 12, marginLeft: 20 }}>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: WHITE }}>Câu chuyện</div>
      </div>
    </div>
  );
};

const TickerRun: React.FC<{ phase: number }> = ({ phase }) => (
  <div
    style={{
      display: "flex",
      width: "max-content",
      transform: `translateX(${-phase * 50}%)`,
    }}
  >
    <span style={{ whiteSpace: "pre", paddingRight: 90 }}>{TICKER}</span>
    <span style={{ whiteSpace: "pre", paddingRight: 90 }}>{TICKER}</span>
  </div>
);

const Ticker: React.FC = () => {
  const f = useCurrentFrame();
  const phase = (f % 2600) / 2600;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: TICKER_TOP,
        width: CONTENT_W,
        height: 84,
        background: PAPER,
        borderTop: `7px solid ${RED}`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 30,
      }}
    >
      <div
        style={{
          flex: "none",
          width: 112,
          height: "100%",
          background: RED,
          color: WHITE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: archivo,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 0.5,
        }}
      >
        25.11
      </div>
      <div style={{ flex: 1, overflow: "hidden", height: "100%", display: "flex", alignItems: "center" }}>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 34,
            color: NAVY,
            whiteSpace: "nowrap",
          }}
        >
          <TickerRun phase={phase} />
        </div>
      </div>
    </div>
  );
};

// ---------- picture bed ----------

const Story1: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, S3_START], [1.04, 1.13], { extrapolateRight: "clamp" });
  const op = 1 - interpolate(f, [S3_START - 12, S3_START], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: op, transform: `scale(${zoom})` }}>
      <OffthreadVideo
        src={A("footage/old-computer-pixabay-355395.mp4")}
        muted
        playbackRate={0.35}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 46%" }}
      />
    </AbsoluteFill>
  );
};

const Story2: React.FC<{ from: number }> = ({ from }) => {
  const t = useCurrentFrame();
  const gf = t + from;
  const len = S8_START - from;
  const zoom = interpolate(t, [0, len], [1.02, 1.12], { extrapolateRight: "clamp" });
  const sec = sectionAt(MAP, gf);
  const pump = sec.energy > 0.65 ? 0.02 * hit(MAP.beats, gf, 9) : 0;
  const rise = buildUp(MAP, gf, 8);
  const punch = interpolate(gf, [DROP, DROP + 16], [0.05, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opIn = interpolate(t, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opOut = 1 - interpolate(t, [len - 12, len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity: opIn * opOut,
        transform: `scale(${zoom * (1 + pump + rise * 0.04 + punch)})`,
      }}
    >
      <OffthreadVideo
        src={A("footage/linux-laptop-pixabay-16858.mp4")}
        muted
        playbackRate={0.2}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 48%" }}
      />
    </AbsoluteFill>
  );
};

const Story3: React.FC = () => {
  const t = useCurrentFrame();
  const len = TOTAL - (S8_START - 12);
  const zoom = interpolate(t, [0, len], [1.02, 1.1], { extrapolateRight: "clamp" });
  const op = interpolate(t, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: op, transform: `scale(${zoom})` }}>
      <OffthreadVideo
        src={A("footage/computer-monitor-screen-pixabay-346861.mp4")}
        muted
        playbackRate={0.5}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 44%" }}
      />
    </AbsoluteFill>
  );
};

const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
    <Sequence durationInFrames={S3_START} name="story 1 picture">
      <Story1 />
    </Sequence>
    <Sequence
      from={S3_START - 12}
      durationInFrames={S8_START - (S3_START - 12)}
      name="story 2 picture"
    >
      <Story2 from={S3_START - 12} />
    </Sequence>
    <Sequence from={S8_START - 12} durationInFrames={TOTAL - (S8_START - 12)} name="story 3 picture">
      <Story3 />
    </Sequence>
    <AbsoluteFill style={{ background: "rgba(4,9,22,0.56)" }} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(4,9,22,0.72) 0%, rgba(4,9,22,0.1) 32%, rgba(4,9,22,0.1) 68%, rgba(4,9,22,0.5) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(90deg, rgba(4,9,22,0.72) 0%, rgba(4,9,22,0.18) 46%, rgba(4,9,22,0) 70%)",
      }}
    />
  </AbsoluteFill>
);

// A red wipe over both story cuts.
const RedWipes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {[
        { b: S3_START, dir: 1 },
        { b: S8_START, dir: -1 },
      ].map(({ b, dir }) => {
        const p = (f - (b - 14)) / 22;
        if (p < 0 || p > 1) return null;
        const x = interpolate(p, [0, 1], [-115 * dir, 115 * dir], { easing: easeInOut });
        return (
          <AbsoluteFill
            key={b}
            style={{ transform: `translateX(${x}%)`, background: RED, zIndex: 60, pointerEvents: "none" }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 42,
                background: PAPER,
                right: dir > 0 ? 0 : undefined,
                left: dir < 0 ? 0 : undefined,
              }}
            />
          </AbsoluteFill>
        );
      })}
    </>
  );
};

// ---------- assembly ----------

const SCENES: Record<string, React.FC> = {
  s1: S1,
  s2: S2,
  s3: S3,
  s4: S4,
  s5: S5,
  s6: S6,
  s7: S7,
  s8: S8,
  s9: S9,
};

const transitionAfter = (i: number) => {
  if (i === 1) {
    return (
      <TransitionSeries.Transition
        key={`t${i}`}
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: 12 })}
      />
    );
  }
  if (i === 6) {
    return (
      <TransitionSeries.Transition
        key={`t${i}`}
        presentation={wipe({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 12 })}
      />
    );
  }
  if (i === 3) {
    return (
      <TransitionSeries.Transition
        key={`t${i}`}
        presentation={flash()}
        timing={linearTiming({ durationInFrames: 4 })}
      />
    );
  }
  return (
    <TransitionSeries.Transition
      key={`t${i}`}
      presentation={whip(i % 2 === 0 ? -1 : 1)}
      timing={linearTiming({ durationInFrames: 10 })}
    />
  );
};

const voiceRanges: [number, number][] = ORDER.map((id, i) => [
  STARTS[i],
  STARTS[i] + Math.round(VO[id] * FPS),
]);

const Win4Wine: React.FC<{ guide: boolean }> = ({ guide }) => {
  const items: ReactNode[] = [];
  ORDER.forEach((id, i) => {
    const Scene = SCENES[id];
    items.push(
      <TransitionSeries.Sequence
        key={id}
        name={id}
        durationInFrames={
          LENS[i] + (i < ORDER.length - 1 ? (i === 1 || i === 6 ? 12 : i === 3 ? 4 : 10) : 0)
        }
      >
        <Scene />
        <Voice slug={SLUG} id={id} />
      </TransitionSeries.Sequence>,
    );
    if (i < ORDER.length - 1) items.push(transitionAfter(i));
  });

  return (
    <AbsoluteFill style={{ background: INK }}>
      <Backdrop />
      <TransitionSeries>{items}</TransitionSeries>
      <TopBar />
      <Counter />
      <Ticker />
      <RedWipes />
      <Sfx id="typing" at={S8_START + 100 + TYPE_DELAY} frames={typingFrames(CMDS)} volume={0.22} />
      {[
        { id: "whoosh", at: START("s2") - 4, volume: 0.26 },
        { id: "whoosh", at: START("s3") - 4, volume: 0.3 },
        { id: "whoosh", at: START("s4") - 4, volume: 0.24 },
        { id: "thud", at: DROP, volume: 0.42 },
        { id: "ding", at: DROP + 10, volume: 0.24 },
        { id: "whoosh", at: START("s6") - 4, volume: 0.24 },
        { id: "whoosh", at: START("s7") - 4, volume: 0.24 },
        { id: "whoosh", at: START("s8") - 4, volume: 0.3 },
        { id: "whoosh", at: START("s9") - 4, volume: 0.26 },
        { id: "pop", at: START("s1") + 240, volume: 0.2 },
        { id: "pop", at: START("s2") + 100, volume: 0.2 },
        { id: "pop", at: START("s3") + 110, volume: 0.2 },
        { id: "pop", at: START("s4") + 105, volume: 0.2 },
        { id: "pop", at: START("s4") + 230, volume: 0.22 },
        { id: "pop", at: START("s6") + 110, volume: 0.2 },
        { id: "pop", at: START("s7") + 110, volume: 0.2 },
        { id: "pop", at: START("s8") + 360, volume: 0.24 },
        { id: "ding", at: START("s9") + 400, volume: 0.3 },
      ].map((s, i) => (
        <Sfx key={i} id={s.id} at={s.at} volume={s.volume} />
      ))}
      <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Win4Wine,
  durationInFrames: TOTAL,
};
