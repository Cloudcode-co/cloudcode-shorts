import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
} from "remotion";
import {
  BRAND_SPACE,
  CONTENT_W,
  SAFE,
  display,
  easeOut,
  hit,
  sans,
  sectionAt,
  type BrandIcon,
} from "../../kit";
import { Terminal } from "./term";
import {
  BGS,
  C,
  MAP,
  SCENES,
  STARTS,
  STORY_NAMES,
  STORY_STARTS,
  TOTAL,
  a,
  repoOf,
  stars,
  storyAt,
} from "./data";

// ---------------------------------------------------------------------------
// small motion helpers

export const useP = (delay = 0, dur = 16) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
};

export const Rise: React.FC<{
  delay?: number;
  dy?: number;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ delay = 0, dy = 28, children, style }) => {
  const p = useP(delay);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * dy}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// type

export const Headline: React.FC<{
  parts: { text: string; color?: string; size: number }[];
  delay?: number;
  style?: CSSProperties;
}> = ({ parts, delay = 6, style }) => (
  <div
    style={{
      fontFamily: display,
      fontWeight: 800,
      lineHeight: 0.98,
      letterSpacing: -2,
      textWrap: "balance",
      ...style,
    }}
  >
    {parts.map((p, k) => (
      <HeadlineLine
        key={k}
        text={p.text}
        color={p.color ?? C.white}
        size={p.size}
        delay={delay + k * 7}
      />
    ))}
  </div>
);

const HeadlineLine: React.FC<{
  text: string;
  color: string;
  size: number;
  delay: number;
}> = ({ text, color, size, delay }) => {
  const p = useP(delay, 16);
  return (
    <div
      style={{
        fontSize: size,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px)`,
        textShadow: "0 3px 26px rgba(5,14,30,0.55)",
      }}
    >
      {text}
    </div>
  );
};

export const Caption: React.FC<{
  text: string;
  delay?: number;
  color?: string;
  size?: number;
  weight?: number;
  style?: CSSProperties;
}> = ({ text, delay = 0, color = C.mist, size = 38, weight = 700, style }) => (
  <Rise delay={delay} dy={18}>
    <div
      style={{
        fontFamily: sans,
        fontWeight: weight,
        fontSize: size,
        color,
        lineHeight: 1.18,
        textWrap: "balance",
        textShadow: "0 2px 18px rgba(5,14,30,0.5)",
        ...style,
      }}
    >
      {text}
    </div>
  </Rise>
);

// ---------------------------------------------------------------------------
// chrome

const LABEL_W = 330;
const TICKER_RIGHT = 1080 - SAFE.right;

export const DeskHead: React.FC<{ g: number }> = ({ g }) => {
  const story = storyAt(g);
  if (story === 3) return null;
  const top = interpolate(g, [STARTS[1], STARTS[1] + 16], [SAFE.top + BRAND_SPACE, SAFE.top], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const since = g - STORY_STARTS[story];
  const slam = story === 0 ? 1 : 1 + 0.09 * Math.max(0, 1 - since / 12);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        display: "flex",
        alignItems: "flex-start",
        gap: 26,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 130,
          lineHeight: 0.86,
          color: C.white,
          fontVariantNumeric: "tabular-nums",
          transform: `scale(${slam})`,
          transformOrigin: "0 50%",
          textShadow: "0 4px 30px rgba(5,14,30,0.6)",
        }}
      >
        {story + 1}
        <span style={{ color: C.red }}>/</span>3
      </div>
      <div style={{ borderLeft: `4px solid ${C.red}`, paddingLeft: 20, paddingTop: 8 }}>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.red, lineHeight: 1 }}>
          Bản tin công nghệ
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 600,
            fontSize: 42,
            color: C.white,
            marginTop: 8,
            lineHeight: 1.05,
            whiteSpace: "nowrap",
            textShadow: "0 2px 16px rgba(5,14,30,0.55)",
          }}
        >
          {STORY_NAMES[story]}
        </div>
      </div>
    </div>
  );
};

export const TickerBar: React.FC<{ g: number }> = ({ g }) => {
  const appear = interpolate(g, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const copy = `${SCENES.map((s) => s.headline).join("      •      ")}      •      `;
  const pulse = hit(MAP.downbeats, g, 12);
  const x = -g * 2.7;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1920 - SAFE.bottom - 84,
        height: 84,
        background: C.navy,
        borderTop: `5px solid ${C.red}`,
        transform: `translateY(${(1 - appear) * 84}px)`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          flex: "none",
          height: "100%",
          background: C.red,
          display: "flex",
          alignItems: "center",
          gap: 14,
          paddingLeft: SAFE.left,
          paddingRight: 28,
          zIndex: 2,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: C.white,
            opacity: 0.45 + 0.55 * pulse,
          }}
        />
        <span
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 36,
            color: C.white,
            whiteSpace: "nowrap",
          }}
        >
          TIN NÓNG
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: LABEL_W,
          right: 1080 - TICKER_RIGHT,
          top: 0,
          bottom: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            whiteSpace: "nowrap",
            transform: `translateX(${x}px)`,
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 36,
            color: C.white,
          }}
        >
          {Array.from({ length: 10 }, (_, k) => (
            <span key={k}>{copy}</span>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 42,
            background: `linear-gradient(90deg, ${C.navy}, rgba(7,26,51,0))`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 42,
            background: `linear-gradient(270deg, ${C.navy}, rgba(7,26,51,0))`,
          }}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// backdrop: one full-frame picture per story, darkened and slow-zooming

export const Backdrop: React.FC<{ story: number; g: number }> = ({ story, g }) => {
  const bg = BGS[story];
  const from = STORY_STARTS[story];
  const to = story + 1 < STORY_STARTS.length ? STORY_STARTS[story + 1] : TOTAL;
  const p = Math.max(0, Math.min(1, (g - from) / (to - from)));
  const base = bg.kind === "vid" ? 1.04 : 1.08;
  const grow = bg.kind === "vid" ? 0.09 : 0.13;
  const sec = sectionAt(MAP, g);
  const pump =
    sec.energy > 0.6
      ? 0.018 * hit(MAP.beats, g, 10) + 0.016 * hit(MAP.downbeats, g, 12)
      : 0;
  const media: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: bg.pos,
  };
  return (
    <AbsoluteFill style={{ background: C.deep, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${(base + grow * p) * (1 + pump)})` }}>
        {bg.kind === "vid" ? (
          <OffthreadVideo src={a(bg.file)} muted style={media} />
        ) : (
          <Img src={a(bg.file)} style={media} />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(5,14,30,0.58)" }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,14,30,0.93) 0%, rgba(5,14,30,0.36) 20%, rgba(5,14,30,0) 42%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(0deg, rgba(5,14,30,0.97) 0%, rgba(5,14,30,0.58) 13%, rgba(5,14,30,0) 34%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// wipes

const WIPE_BOUNDS = [STARTS[3], STARTS[6], STARTS[9]];

// A navy panel with the new story number printed on it sweeps the frame and
// clears exactly as the next story starts.
export const StoryWipe: React.FC<{ g: number }> = ({ g }) => {
  const b = WIPE_BOUNDS.find((x) => g >= x - 8 && g < x + 5);
  if (b === undefined) return null;
  const t = g - (b - 8);
  const a1 = Math.min(1, t / 6);
  const a2 = Math.max(0, Math.min(1, (t - 6) / 6));
  const clip = t < 6 ? `inset(0 ${100 - a1 * 100}% 0 0)` : `inset(0 0 0 ${a2 * 100}%)`;
  const edge = (t < 6 ? a1 : a2) * 100;
  const story = STORY_STARTS.indexOf(b);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: C.navy, clipPath: clip }}>
        {story < 3 && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 300,
                lineHeight: 1,
                color: C.white,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {story + 1}
              <span style={{ color: C.red }}>/</span>3
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${edge}%`,
          width: 18,
          background: C.red,
          transform: "translateX(-100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Fast graphics wipe inside a story; the picture behind never changes.
export const GraphicSweep: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 7) return null;
  const p = easeOut(Math.min(1, f / 7));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{ background: "rgba(7,26,51,0.94)", clipPath: `inset(0 0 0 ${p * 100}%)` }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${p * 100}%`,
          width: 14,
          background: C.red,
          transform: "translateX(-100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// card pieces

export const Star: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
    <path
      d="M12 2.2l3.1 6.9 7.5.7-5.7 5 1.7 7.4L12 18.3 5.4 22.2l1.7-7.4-5.7-5 7.5-.7z"
      fill={C.red}
    />
  </svg>
);

export const RepoCard: React.FC<{
  name: string;
  delay: number;
  big?: boolean;
  style?: CSSProperties;
}> = ({ name, delay, big = false, style }) => {
  const r = repoOf(name);
  const p = useP(delay, 18);
  const logo = big ? 150 : 104;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: big ? 28 : 22,
        background: C.white,
        color: C.navy,
        padding: big ? "24px 30px" : "16px 22px",
        borderLeft: `12px solid ${C.red}`,
        boxShadow: "0 18px 40px rgba(0,0,0,0.42)",
        opacity: p,
        transform: `translateX(${(1 - p) * -90}px)`,
        ...style,
      }}
    >
      <Img
        src={a(r.avatar)}
        style={{ width: logo, height: logo, borderRadius: 16, background: "#E9EEF5", flex: "none" }}
      />
      <div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: big ? 64 : 48, lineHeight: 1.02 }}>
          {r.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 6,
            fontFamily: sans,
            fontWeight: 700,
            fontSize: big ? 40 : 34,
            whiteSpace: "nowrap",
          }}
        >
          <Star size={big ? 36 : 30} />
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{stars(r.stars)}</span>
          <span style={{ fontWeight: 500 }}>sao GitHub</span>
        </div>
      </div>
    </div>
  );
};

export const BrandGlyph: React.FC<{ icon: BrandIcon; size: number; color?: string }> = ({
  icon,
  size,
  color = C.navy,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
    <path d={icon.path} fill={color} />
  </svg>
);

export const ProviderTile: React.FC<{
  label: string;
  icon?: BrandIcon;
  delay: number;
}> = ({ label, icon, delay }) => {
  const p = useP(delay, 16);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
      }}
    >
      <div
        style={{
          width: 150,
          height: 150,
          background: C.white,
          borderBottom: `8px solid ${C.red}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
        }}
      >
        {icon ? (
          <BrandGlyph icon={icon} size={84} />
        ) : (
          <span style={{ fontFamily: display, fontWeight: 800, fontSize: 62, color: C.navy, letterSpacing: -2 }}>
            GPT
          </span>
        )}
      </div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: C.white }}>{label}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// terminal

export const TerminalPanel: React.FC<{
  cmds: string[];
  termDelay: number;
  fontSize?: number;
  minHeight?: number;
}> = ({ cmds, termDelay, fontSize = 38, minHeight = 280 }) => (
  <Sequence from={termDelay} layout="none">
    <div style={{ borderLeft: `12px solid ${C.red}`, boxShadow: "0 20px 44px rgba(0,0,0,0.45)" }}>
      <Terminal
        cmds={cmds}
        width={CONTENT_W - 12}
        fontSize={fontSize}
        minHeight={minHeight}
        bg={C.deep}
        fg={C.white}
        accent={C.red}
      />
    </div>
  </Sequence>
);

// ---------------------------------------------------------------------------
// lower third: the fact line of the shot, above the ticker

export const LowerThird: React.FC<{
  lines: string[];
  delay: number;
  stagger?: number;
  style?: CSSProperties;
}> = ({ lines, delay, stagger = 9, style }) => {
  const p = useP(delay, 16);
  return (
    <div style={{ marginTop: "auto", paddingTop: 18, ...style }}>
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          maxWidth: "100%",
          background: C.white,
          borderLeft: `12px solid ${C.red}`,
          borderTop: `6px solid ${C.red}`,
          boxShadow: "0 16px 34px rgba(0,0,0,0.38)",
          clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        }}
      >
        {lines.map((l, k) => (
          <LowerLine key={k} text={l} delay={delay + k * stagger} first={k === 0} />
        ))}
      </div>
    </div>
  );
};

const LowerLine: React.FC<{ text: string; delay: number; first: boolean }> = ({
  text,
  delay,
  first,
}) => {
  const p = useP(delay, 14);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 26px",
        opacity: p,
        transform: `translateX(${(1 - p) * -24}px)`,
        borderTop: first ? undefined : "2px solid rgba(7,26,51,0.12)",
      }}
    >
      <span style={{ width: 12, height: 12, background: C.red, flex: "none" }} />
      <span
        style={{
          fontFamily: first ? display : sans,
          fontWeight: first ? 700 : 500,
          fontSize: first ? 42 : 38,
          color: C.navy,
          lineHeight: 1.18,
          textWrap: "balance",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// diagram bits

export const ArrowRight: React.FC<{ p: number; width?: number; color?: string }> = ({
  p,
  width = 90,
  color = C.red,
}) => (
  <svg width={width} height={34} viewBox={`0 0 ${width} 34`} style={{ flex: "none" }}>
    <path
      d={`M0 17 H ${width - 16}`}
      stroke={color}
      strokeWidth={5}
      strokeDasharray={width}
      strokeDashoffset={width * (1 - p)}
    />
    <path
      d={`M${width - 22} 5 L ${width - 4} 17 L ${width - 22} 29`}
      fill="none"
      stroke={color}
      strokeWidth={5}
      strokeDasharray={50}
      strokeDashoffset={50 * (1 - p)}
    />
  </svg>
);

export const QuotaBar: React.FC<{ value: number; color?: string; height?: number }> = ({
  value,
  color = C.red,
  height = 22,
}) => (
  <div
    style={{
      height,
      flex: 1,
      background: "rgba(255,255,255,0.2)",
      overflow: "hidden",
    }}
  >
    <div style={{ height: "100%", width: `${value * 100}%`, background: color }} />
  </div>
);
