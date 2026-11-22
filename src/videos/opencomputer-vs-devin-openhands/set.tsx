import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  Loop,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { CONTENT_W, HEIGHT, SAFE } from "../../kit";
import { a, C, headingSize, rise, round } from "./theme";

// ---------------------------------------------------------------- the set

const Beam: React.FC<{ left: number; width: number; tilt: number; color: string }> = ({
  left,
  width,
  tilt,
  color,
}) => (
  <div
    style={{
      position: "absolute",
      top: -100,
      left,
      width,
      height: 1500,
      background: `linear-gradient(180deg, ${color}, rgba(20,8,47,0))`,
      clipPath: "polygon(44% 0, 56% 0, 100% 100%, 0 100%)",
      rotate: `${tilt}deg`,
      opacity: 0.55,
    }}
  />
);

// The persistent game-show set: deep purple studio, gold arch, stage floor and
// footlights. It never cuts between scenes, so the quiz board feels like one
// long take. `alert` reddens the room for the licence/security round.
export const Stage: React.FC<{ alert?: number; glow?: number }> = ({ alert = 0, glow = 0 }) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 120) * 20;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 780px 700px at ${50 + sway / 30}% 330px, rgba(255,201,74,${0.14 + glow * 0.08}), rgba(20,8,47,0) 70%)`,
        }}
      />
      <Beam left={40} width={420} tilt={-7} color="rgba(255,201,74,0.13)" />
      <Beam left={620} width={420} tilt={7} color="rgba(122,91,199,0.28)" />

      {/* gold arch, the back wall of the studio */}
      <div
        style={{
          position: "absolute",
          left: 38,
          right: 38,
          top: 172,
          height: 1450,
          border: "3px solid rgba(255,201,74,0.22)",
          borderBottom: "none",
          borderRadius: "480px 480px 0 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 74,
          right: 74,
          top: 214,
          height: 1400,
          border: "2px solid rgba(255,201,74,0.12)",
          borderBottom: "none",
          borderRadius: "460px 460px 0 0",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 620px 420px at 50% 820px, rgba(92,44,170,0.42), rgba(14,5,36,0) 70%)",
        }}
      />

      {/* stage floor */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 500,
          background:
            "linear-gradient(180deg, rgba(36,16,82,0) 0%, rgba(36,16,82,0.8) 44%, #1B0B44 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1404,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(255,201,74,0.5), transparent)",
        }}
      />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const lit = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f * 0.08 + i * 1.4));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: 452,
              left: 90 + i * 150,
              width: 22,
              height: 22,
              borderRadius: 11,
              background: C.goldHot,
              opacity: 0.25 + lit * 0.5,
              boxShadow: "0 0 26px 6px rgba(255,201,74,0.28)",
            }}
          />
        );
      })}

      {alert > 0 && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 760px 720px at 50% 430px, rgba(255,60,90,0.34), rgba(66,4,26,0) 72%)",
            opacity: alert,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// Bulbs around the question board, half-lit and chasing slowly like a marquee.
const Bulbs: React.FC = () => {
  const f = useCurrentFrame();
  const bulb = (key: string, top: boolean, i: number) => {
    const lit = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(f * 0.16 + i * 1.15 + (top ? 0 : 1.6)));
    return (
      <div
        key={key}
        style={{
          position: "absolute",
          left: `${10 + (i * 80) / 11}%`,
          [top ? "top" : "bottom"]: -9,
          width: 14,
          height: 14,
          marginLeft: -7,
          borderRadius: 7,
          background: C.goldHot,
          opacity: 0.2 + lit * 0.8,
          boxShadow: `0 0 ${8 + lit * 14}px ${lit * 4}px rgba(255,201,74,0.35)`,
        }}
      />
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 12 }, (_, i) => bulb(`t${i}`, true, i))}
      {Array.from({ length: 12 }, (_, i) => bulb(`b${i}`, false, i))}
    </div>
  );
};

// ---------------------------------------------------------------- the board

export type OptState = "idle" | "correct" | "wrong" | "dim";
type IconKind = "clock" | "lock" | "computer" | "chat" | "git" | "bolt" | "docker";

export type Opt = {
  letter: string;
  text: string;
  at: number;
  states?: { at: number; state: OptState }[];
  shakeAt?: number;
  icon?: IconKind;
};

const stateAt = (f: number, states?: Opt["states"]) => {
  let current: OptState = "idle";
  let since = -1;
  for (const s of states ?? []) {
    if (f >= s.at) {
      current = s.state;
      since = s.at;
    }
  }
  return { current, since };
};

const Glyph: React.FC<{ kind: IconKind; color: string }> = ({ kind, color }) => {
  const common = { fill: "none", stroke: color, strokeWidth: 2.4, strokeLinecap: "round" as const };
  return (
    <svg width={50} height={50} viewBox="0 0 24 24" style={{ flex: "none" }}>
      {kind === "clock" && (
        <>
          <circle cx="12" cy="12" r="9" {...common} />
          <path d="M12 7v5l3.4 2" {...common} />
        </>
      )}
      {kind === "lock" && (
        <>
          <rect x="4.5" y="10" width="15" height="10" rx="2.5" {...common} />
          <path d="M8 10V7.5a4 4 0 018 0V10" {...common} />
        </>
      )}
      {kind === "computer" && (
        <>
          <rect x="3" y="4.5" width="18" height="12" rx="2" {...common} />
          <path d="M9 20h6M12 16.5V20" {...common} />
        </>
      )}
      {kind === "chat" && (
        <path d="M4 5h16v11H9l-5 4z" {...common} strokeLinejoin="round" />
      )}
      {kind === "git" && (
        <>
          <circle cx="6" cy="6" r="2.4" {...common} />
          <circle cx="6" cy="18" r="2.4" {...common} />
          <circle cx="18" cy="12" r="2.4" {...common} />
          <path d="M6 8.5v7M8.2 6.7c4 0 3.2 5.3 7.5 5.3" {...common} />
        </>
      )}
      {kind === "bolt" && (
        <path d="M13 2L5 13h6l-1 9 8-12h-6z" fill={color} />
      )}
      {kind === "docker" && (
        <>
          <rect x="4" y="11" width="4" height="4" {...common} />
          <rect x="9" y="11" width="4" height="4" {...common} />
          <rect x="14" y="11" width="4" height="4" {...common} />
          <rect x="9" y="6" width="4" height="4" {...common} />
          <path d="M3 17c4 3 12 3 16-1" {...common} />
        </>
      )}
    </svg>
  );
};

const StatusIcon: React.FC<{ state: OptState }> = ({ state }) => {
  if (state === "correct") {
    return (
      <svg width={54} height={54} viewBox="0 0 24 24" style={{ flex: "none" }}>
        <circle cx="12" cy="12" r="11" fill={C.cream} />
        <path
          d="M6.5 12.4l3.6 3.6 7.4-8"
          fill="none"
          stroke="#0B6B49"
          strokeWidth={2.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (state === "wrong") {
    return (
      <svg width={54} height={54} viewBox="0 0 24 24" style={{ flex: "none" }}>
        <circle cx="12" cy="12" r="11" fill="rgba(255,78,100,0.18)" />
        <path
          d="M8 8l8 8M16 8l-8 8"
          fill="none"
          stroke={C.red}
          strokeWidth={2.8}
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return null;
};

// One chunky answer button. It changes face in place: gold idle, lit green
// when right, dimmed and shaking when wrong.
export const OptionButton: React.FC<{ opt: Opt; index: number }> = ({ opt, index }) => {
  const f = useCurrentFrame();
  const p = rise(f, opt.at, 12);
  const { current, since } = stateAt(f, opt.states);
  const isDeep = opt.text.length > 34;
  const shake =
    opt.shakeAt !== undefined && f >= opt.shakeAt
      ? Math.sin((f - opt.shakeAt) * 1.9) * 8 * Math.max(0, 1 - (f - opt.shakeAt) / 18)
      : 0;
  const pop = current === "correct" && since >= 0 ? 1 + 0.03 * Math.max(0, 1 - (f - since) / 14) : 1;

  const face =
    current === "correct"
      ? {
          bg: C.green,
          border: C.greenBright,
          text: "#032C1B",
          badgeBg: C.cream,
          badgeText: "#0B6B49",
          icon: "#032C1B",
        }
      : current === "wrong"
        ? {
            bg: "#3B173F",
            border: "rgba(255,78,100,0.6)",
            text: "rgba(255,244,216,0.5)",
            badgeBg: "rgba(255,78,100,0.22)",
            badgeText: C.red,
            icon: "rgba(255,244,216,0.45)",
          }
        : current === "dim"
          ? {
              bg: "rgba(45,21,96,0.6)",
              border: "rgba(255,201,74,0.16)",
              text: "rgba(255,244,216,0.38)",
              badgeBg: "rgba(255,244,216,0.12)",
              badgeText: "rgba(255,244,216,0.5)",
              icon: "rgba(255,244,216,0.3)",
            }
          : {
              bg: C.btn,
              border: "rgba(255,201,74,0.42)",
              text: C.cream,
              badgeBg: C.gold,
              badgeText: "#241050",
              icon: C.gold,
            };

  return (
    <div
      style={{
        position: "absolute",
        top: 302 + index * 160,
        left: 0,
        width: "100%",
        height: 140,
        opacity: p,
        translate: `${shake}px ${(1 - p) * 28}px`,
        scale: String((0.97 + 0.03 * p) * pop),
      }}
    >
      {current === "correct" && (
        <div
          style={{
            position: "absolute",
            inset: -18,
            borderRadius: 48,
            background: "radial-gradient(ellipse at 50% 50%, rgba(25,195,125,0.42), rgba(25,195,125,0) 70%)",
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          height: "100%",
          borderRadius: 30,
          background: face.bg,
          border: `3px solid ${face.border}`,
          boxShadow: "inset 0 -9px 0 rgba(8,3,24,0.32)",
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "0 22px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            flex: "none",
            background: face.badgeBg,
            color: face.badgeText,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: round,
            fontWeight: 800,
            fontSize: 42,
          }}
        >
          {opt.letter}
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            fontFamily: round,
            fontWeight: 700,
            fontSize: isDeep ? 35 : 38,
            lineHeight: 1.08,
            color: face.text,
            textWrap: "balance",
          }}
        >
          {opt.text}
        </div>
        <div style={{ flex: "none", marginLeft: 4 }}>
          {current === "correct" || current === "wrong" ? (
            <StatusIcon state={current} />
          ) : opt.icon ? (
            <Glyph kind={opt.icon} color={face.icon} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

// The big glowing question board.
export const Panel: React.FC<{ heading: string; at: number }> = ({ heading, at }) => {
  const f = useCurrentFrame();
  const p = rise(f, at, 14);
  // A small board hit when a round replaces the last one.
  const hit = 1 - rise(f, 0, 6);
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 272,
        scale: String(1 + 0.012 * hit),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -30,
          borderRadius: 70,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255,201,74,0.25), rgba(255,201,74,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 46,
          background: C.panel,
          border: `4px solid ${C.gold}`,
          boxShadow:
            "inset 0 -12px 0 rgba(10,4,28,0.5), inset 0 0 0 6px rgba(255,201,74,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        <Bulbs />
        <div
          style={{
            opacity: p,
            translate: `0px ${(1 - p) * 24}px`,
            scale: String(0.96 + 0.04 * p),
            fontFamily: round,
            fontWeight: 800,
            fontSize: headingSize(heading),
            lineHeight: 1.02,
            color: C.cream,
            textAlign: "center",
            textWrap: "balance",
            whiteSpace: "pre-line",
          }}
        >
          {heading}
        </div>
      </div>
    </div>
  );
};

// Everything readable sits inside TikTok's safe area.
export const Content: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      top: SAFE.top,
      width: CONTENT_W,
      height: HEIGHT - SAFE.top - SAFE.bottom,
    }}
  >
    {children}
  </div>
);

export const FootageBg: React.FC<{ file: string }> = ({ file }) => (
  <AbsoluteFill style={{ opacity: 0.38 }}>
    <Loop durationInFrames={600}>
      <OffthreadVideo
        src={a(file)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%" }}
      />
    </Loop>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(14,5,36,0.66) 0%, rgba(14,5,36,0.88) 100%)",
      }}
    />
  </AbsoluteFill>
);

// The lower "console" of the set. Each scene builds its own content inside it;
// a real clip can run behind the content like the studio's video screen.
export const Console: React.FC<{ children: ReactNode; video?: string; at?: number }> = ({
  children,
  video,
  at = -16,
}) => {
  const f = useCurrentFrame();
  const p = rise(f, at, 12);
  return (
    <div
      style={{
        position: "absolute",
        top: 634,
        left: 0,
        width: "100%",
        height: 400,
        borderRadius: 34,
        overflow: "hidden",
        background: C.console,
        border: "2px solid rgba(255,201,74,0.22)",
        boxSizing: "border-box",
      }}
    >
      {video && <FootageBg file={video} />}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: 24,
          opacity: p,
          translate: `0px ${(1 - p) * 14}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// A scene on the board: question, two answer buttons, console. Layers
// crossfade while the set stays put.
export const Quiz: React.FC<{
  heading: string;
  headingAt?: number;
  options: Opt[];
  video?: string;
  consoleAt?: number;
  children: ReactNode;
}> = ({ heading, headingAt = -16, options, video, consoleAt = -16, children }) => (
  <div style={{ position: "absolute", left: 0, top: 84, width: "100%", height: 1034 }}>
    <Panel heading={heading} at={headingAt} />
    {options.map((o, i) => (
      <OptionButton key={o.letter} opt={o} index={i} />
    ))}
    <Console video={video} at={consoleAt}>
      {children}
    </Console>
  </div>
);

// A scene layer: visible from `start`, gone `end + 10`; children run on their
// own sequence so their frame starts at the scene start.
export const Layer: React.FC<{ start: number; end: number; children: ReactNode }> = ({
  start,
  end,
  children,
}) => {
  const f = useCurrentFrame();
  // Inside a shot the board flips in place: one round replaces the next on the
  // cut, with no double exposure of old and new options.
  if (f < start || f >= end) return null;
  return (
    <AbsoluteFill>
      <Sequence from={start} durationInFrames={Math.max(1, end - start)} layout="none">
        {children}
      </Sequence>
    </AbsoluteFill>
  );
};

// The huge 3-2-1 with a ring that empties once per second.
export const Countdown: React.FC<{ start: number; tick?: number }> = ({ start, tick = 36 }) => {
  const f = useCurrentFrame();
  const total = tick * 3;
  const local = f - start;
  if (local < 0 || local > total + 9) return null;
  const k = Math.min(2, Math.floor(local / tick));
  const n = 3 - k;
  const ringP = Math.min(1, (local - k * tick) / tick);
  const numP = rise(local, k * tick, 8);
  const out = 1 - rise(local, total, 4);
  const R = 196;
  const CIRC = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ zIndex: 20, background: "rgba(10,3,26,0.64)", opacity: out }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: 520, height: 520 }}>
          <svg width={520} height={520} viewBox="0 0 520 520">
            <circle cx="260" cy="260" r={R} fill="none" stroke="rgba(255,201,74,0.16)" strokeWidth={18} />
            <circle
              cx="260"
              cy="260"
              r={R}
              fill="none"
              stroke={C.gold}
              strokeWidth={18}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - ringP)}
              transform="rotate(-90 260 260)"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: round,
              fontWeight: 800,
              fontSize: 300,
              lineHeight: 1,
              color: C.goldHot,
              opacity: numP,
              scale: String(1.24 - 0.24 * numP),
            }}
          >
            {n}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Celebration burst, deterministic across renders. Kept below the question
// board so it decorates the answers and the floor, never the words.
type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
};

const COLORS = [C.gold, C.goldHot, C.cream, C.greenBright, "#B79AFF"];
const PIECES: Piece[] = Array.from({ length: 78 }, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  return {
    x: 540 + (r(1) - 0.5) * 300,
    y: 1330 + (r(2) - 0.5) * 50,
    vx: (r(3) - 0.5) * 1700,
    vy: -200 - r(4) * 350,
    w: 8 + r(5) * 12,
    h: 5 + r(6) * 8,
    rot: r(7) * 360,
    vr: (r(8) - 0.5) * 900,
    color: COLORS[i % COLORS.length],
  };
});

export const Confetti: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const t = (f - at) / 60;
  if (f < at || t > 1.9) return null;
  const fade = t < 1.15 ? 1 : Math.max(0, 1 - (t - 1.15) / 0.75);
  return (
    <AbsoluteFill style={{ zIndex: 15, pointerEvents: "none" }}>
      {PIECES.map((p, i) => {
        const x = p.x + p.vx * t;
        const y = p.y + p.vy * t + 0.5 * 1600 * t * t;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: p.w,
              height: p.h,
              borderRadius: 2,
              background: p.color,
              opacity: fade,
              translate: `${x}px ${y}px`,
              rotate: `${p.rot + p.vr * t}deg`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Small shared bits used by the console content.
export const Avatar: React.FC<{ file: string; size: number; ring?: boolean }> = ({
  file,
  size,
  ring = true,
}) => (
  <Img
    src={a(file)}
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      flex: "none",
      border: ring ? `3px solid ${C.gold}` : undefined,
      boxSizing: "border-box",
    }}
  />
);

