import type { CSSProperties, ReactNode } from "react";
import { Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { beatmap, hit, mono } from "../../kit";
import { Terminal } from "./Terminal";
import beats from "./beatmap.json";
import facts from "./facts.json";
import { CW, RAIL_X, RANKS, X, asset, cond, type Rank, type RankTheme } from "./palette";

export const MAP = beatmap(beats);

export const prog = (f: number, at: number, dur = 12) =>
  interpolate(f, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.23, 1, 0.32, 1),
  });

const vi = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// ---- stage -----------------------------------------------------------------

// Giant rank numeral: slams in from too big, shakes on impact, then settles
// back to a watermark behind the entry.
const Numeral: React.FC<{ rank: Rank; at: number; pump: number }> = ({ rank, at, pump }) => {
  const f = useCurrentFrame();
  const c = RANKS[rank];
  if (f < at) return null;
  const hitIn = prog(f, at, 7);
  const settle = prog(f, at + 3, 26);
  const shake = f < at + 12 ? Math.sin((f - at) * 2.7) * (12 - (f - at)) * 1.1 : 0;
  const base = rank === 1 ? 0.16 : rank === 2 || rank === 3 ? 0.2 : 0.15;
  return (
    <div
      style={{
        position: "absolute",
        right: 24,
        top: rank === 1 ? 560 : 610,
        fontFamily: cond,
        fontWeight: 900,
        fontSize: rank === 1 ? 860 : 800,
        lineHeight: 0.78,
        letterSpacing: -20,
        whiteSpace: "nowrap",
        color: c.accent,
        opacity: base + (1 - base) * (1 - settle),
        transform: `translateX(${shake}px) scale(${(1 + 0.8 * (1 - hitIn)) * (1 + pump)})`,
        transformOrigin: "right center",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      #{rank}
    </div>
  );
};

// Five dots on the right: #5 bottom, #1 top, so the lit column rises as the
// countdown climbs. Completed ranks fill, the current one grows, the rest wait.
const Rail: React.FC<{ rank: Rank; showAt: number }> = ({ rank, showAt }) => {
  const f = useCurrentFrame();
  const c = RANKS[rank];
  if (f < showAt) return null;
  const enter = prog(f, showAt, 12);
  const grow = prog(f, showAt + 3, 14);
  // #1 at the top, #5 at the bottom: the lit column climbs as the countdown does.
  const y = (r: number) => 790 + (r - 1) * 150;
  const from = (4 - rank) / 4;
  const to = (5 - rank) / 4;
  const litScale = from + (to - from) * grow;
  const pulse = rank === 1 ? 1.03 + Math.sin(f / 8) * 0.025 : 1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: enter }}>
      <div
        style={{
          position: "absolute",
          left: RAIL_X - 1.5,
          top: y(1),
          width: 3,
          height: y(5) - y(1),
          background: c.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: RAIL_X - 2.5,
          top: y(1),
          width: 5,
          height: y(5) - y(1),
          background: c.accent,
          transform: `scaleY(${litScale})`,
          transformOrigin: "center bottom",
        }}
      />
      {[1, 2, 3, 4, 5].map((r) => {
        const reached = r >= rank;
        const active = r === rank;
        const size = active ? 46 : 22;
        return (
          <div key={r} style={{ position: "absolute", left: RAIL_X - size / 2, top: y(r) - size / 2, width: size, height: size }}>
            {active && (
              <div
                style={{
                  position: "absolute",
                  left: -5,
                  top: -5,
                  width: size + 10,
                  height: size + 10,
                  borderRadius: (size + 10) / 2,
                  border: `2px solid ${c.accent}`,
                  opacity: 0.32,
                  transform: `scale(${pulse})`,
                }}
              />
            )}
            <div
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                boxSizing: "border-box",
                border: `3px solid ${reached ? c.accent : c.line}`,
                background: reached ? c.accent : "transparent",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export const Stage: React.FC<{
  rank: Rank;
  slamAt: number;
  start: number;
  children: ReactNode;
  bg?: ReactNode;
  railAt?: number;
}> = ({ rank, slamAt, start, children, bg, railAt = 0 }) => {
  const f = useCurrentFrame();
  const c = RANKS[rank];
  const pump = rank === 1 ? 0.016 * hit(MAP.beats, start + f, 10) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, background: c.bg, overflow: "hidden", fontFamily: cond }}>
      {bg}
      <Numeral rank={rank} at={slamAt} pump={pump} />
      <Rail rank={rank} showAt={railAt} />
      {children}
    </div>
  );
};

// ---- type ------------------------------------------------------------------

export const Headline: React.FC<{
  text: string;
  at: number;
  c: RankTheme;
  size?: number;
  y?: number;
  style?: CSSProperties;
}> = ({ text, at, c, size = 96, y = 290, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 11);
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: y,
        width: CW,
        fontFamily: cond,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: -1,
        color: c.ink,
        textWrap: "balance",
        whiteSpace: "pre-line",
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px) scale(${1.07 - 0.07 * p})`,
        transformOrigin: "left top",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const Marked: React.FC<{
  text: string;
  tokens?: string[];
  c: RankTheme;
  monoTokens?: boolean;
}> = ({ text, tokens = [], c, monoTokens }) => {
  if (!tokens.length) return <>{text}</>;
  const re = new RegExp(`(${tokens.map(escapeRe).join("|")})`);
  return (
    <>
      {text.split(re).map((part, i) =>
        tokens.includes(part) ? (
          <span
            key={i}
            style={{
              color: c.accent,
              fontFamily: monoTokens ? mono : undefined,
              fontWeight: monoTokens ? 700 : 900,
              fontSize: monoTokens ? "0.82em" : undefined,
              letterSpacing: monoTokens ? 0 : undefined,
            }}
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
};

export const Line: React.FC<{
  text: string;
  at: number;
  c: RankTheme;
  size?: number;
  y?: number;
  weight?: 600 | 900;
  tokens?: string[];
  monoTokens?: boolean;
  style?: CSSProperties;
}> = ({ text, at, c, size = 56, y, weight = 600, tokens, monoTokens, style }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        top: y,
        width: CW,
        fontFamily: cond,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.06,
        color: c.ink,
        opacity: p,
        transform: `translateX(${(1 - p) * -46}px)`,
        ...style,
      }}
    >
      <Marked text={text} tokens={tokens} c={c} monoTokens={monoTokens} />
    </div>
  );
};

// ---- entry card ------------------------------------------------------------

export const Card: React.FC<{
  repo: string;
  at: number;
  avatar: number;
  c: RankTheme;
  meta?: boolean;
  style?: CSSProperties;
}> = ({ repo, at, avatar, c, meta = true, style }) => {
  const f = useCurrentFrame();
  const r = facts.repos.find((x) => x.asked === repo);
  if (!r) return null;
  const p = prog(f, at, 14);
  const stars = r.stars;
  const name = Math.min(avatar * 0.46, 106);
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        display: "inline-flex",
        alignItems: "center",
        gap: 24,
        padding: 18,
        border: `3px solid ${c.accent}`,
        borderRadius: 4,
        background: c.panel,
        opacity: p,
        transform: `translateY(${(1 - p) * 38}px) scale(${1.05 - 0.05 * p})`,
        transformOrigin: "left center",
        ...style,
      }}
    >
      <Img
        src={asset(r.avatar as string)}
        style={{ width: avatar, height: avatar, objectFit: "cover", borderRadius: 2, flex: "none" }}
      />
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ fontWeight: 900, fontSize: name, lineHeight: 0.95, color: c.ink, whiteSpace: "nowrap" }}>
          {r.name}
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: Math.max(38, avatar * 0.3),
            lineHeight: 1.1,
            color: c.accent,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          ★ {vi(stars)} sao
        </div>
        {meta && (
          <div style={{ fontWeight: 600, fontSize: 34, lineHeight: 1.2, color: c.dim, whiteSpace: "nowrap" }}>
            {r.language} · {r.license}
          </div>
        )}
      </div>
    </div>
  );
};

// ---- panels ----------------------------------------------------------------

export const Panel: React.FC<{
  rows: { text: string; tokens?: string[] }[];
  at: number;
  c: RankTheme;
  style: CSSProperties;
  size?: number;
}> = ({ rows, at, c, style, size = 40 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: X,
        width: CW,
        boxSizing: "border-box",
        padding: "18px 22px",
        borderLeft: `7px solid ${c.accent}`,
        borderTop: `2px solid ${c.line}`,
        background: c.panel,
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        ...style,
      }}
    >
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            fontFamily: cond,
            fontWeight: 600,
            fontSize: size,
            lineHeight: 1.14,
            color: c.ink,
            marginTop: i === 0 ? 0 : 10,
          }}
        >
          <Marked text={row.text} tokens={row.tokens} c={c} />
        </div>
      ))}
    </div>
  );
};

// ---- commands --------------------------------------------------------------

// 720 wide: at 34 px / 0.6 em that is 32 columns, so a 30-character command
// ("sudo apt install nasm binutils") stays on one line instead of splitting a
// word. The rail sits at 856, clear of it.
export const Term: React.FC<{ cmds: string[]; c: RankTheme; fontSize?: number; minHeight?: number }> = ({
  cmds,
  c,
  fontSize = 34,
  minHeight = 0,
}) => (
  <div
    style={{
      width: 720,
      border: `2px solid ${c.accent}`,
      borderRadius: 30,
      overflow: "hidden",
    }}
  >
    <Terminal cmds={cmds} width={720} fontSize={fontSize} minHeight={minHeight} bg="#07090D" fg={c.ink} accent={c.accent} />
  </div>
);

// Three ticks for the three command steps of the #1 entry.
export const Steps: React.FC<{ active: number; at: number; c: RankTheme; style?: CSSProperties }> = ({
  active,
  at,
  c,
  style,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 10);
  return (
    <div style={{ position: "absolute", left: X, display: "flex", gap: 14, opacity: p, ...style }}>
      {[0, 1, 2].map((i) => {
        const done = i <= active;
        return (
          <div
            key={i}
            style={{
              width: 84,
              height: 10,
              borderRadius: 2,
              background: done ? c.accent : c.line,
              opacity: i === active ? 1 : done ? 0.55 : 0.7,
              transform: `scaleX(${i === active ? 1 : 0.82})`,
              transformOrigin: "left center",
            }}
          />
        );
      })}
    </div>
  );
};


