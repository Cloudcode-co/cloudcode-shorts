import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { beatmap, CONTENT_W, display, easeOut, hit, SAFE, sans } from "../../kit";
import MAP_JSON from "./beatmap.json";
import { a, C, FRAME } from "./theme";

const MAP = beatmap(MAP_JSON);

// Frame-driven entrances (a component can be rendered under a Sequence, so
// the local frame is passed in rather than read from a hook).
export const inAt = (f: number, delay = 0, dur = 16) =>
  interpolate(f, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

export const rise = (p: number, dy = 28): CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dy}px)`,
});

// Full-frame story picture: darkened, slowly zooming, never a flat colour.
export const Backdrop: React.FC<{
  src: string;
  len: number;
  globalStart: number;
  kind?: "photo" | "video";
  position?: string;
  darkness?: number;
  playbackRate?: number;
  saturate?: number;
  topScrim?: boolean;
}> = ({
  src,
  len,
  globalStart,
  kind = "photo",
  position = "50% 45%",
  darkness = 0.58,
  playbackRate = 0.4,
  saturate = 1,
  topScrim = false,
}) => {
  const f = useCurrentFrame();
  const sec = MAP.sections.find((s) => globalStart + f >= s.from && globalStart + f < s.to);
  const pump = sec && sec.energy > 0.65 ? 0.012 * hit(MAP.beats, globalStart + f, 12) : 0;
  const zoom = 1.045 + (f / Math.max(1, len)) * 0.105 + pump;
  const media: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: position,
    filter: saturate === 1 ? undefined : `saturate(${saturate})`,
  };
  return (
    <AbsoluteFill style={{ background: C.navy, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {kind === "video" ? (
          <OffthreadVideo
            src={a(src)}
            muted
            playbackRate={playbackRate}
            style={media}
          />
        ) : (
          <Img src={a(src)} style={media} />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(4,10,22,${darkness})` }} />
      {topScrim && (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to bottom, rgba(4,10,22,0.94) 0px, rgba(4,10,22,0.72) 300px, rgba(4,10,22,0) 480px)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ---------- news desk chrome ----------

const TopBar: React.FC<{ f: number; label: string; delay: number }> = ({ f, label, delay }) => {
  const p = inAt(f, delay, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: FRAME.top,
        width: FRAME.barW,
        height: FRAME.barH,
        display: "flex",
        alignItems: "stretch",
        background: "rgba(4,11,24,0.94)",
        borderBottom: `3px solid ${C.rule}`,
        boxSizing: "border-box",
        opacity: p,
        transform: `translateY(${(1 - p) * -18}px)`,
      }}
    >
      <div
        style={{
          background: C.red,
          color: C.white,
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.03em",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          whiteSpace: "nowrap",
        }}
      >
        TIN NÓNG
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          color: C.white,
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 34,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Counter: React.FC<{ f: number; n: number; delay: number }> = ({ f, n, delay }) => {
  const p = inAt(f, delay, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: FRAME.counterX,
        top: FRAME.counterY,
        width: FRAME.counterW,
        background: "rgba(4,11,24,0.94)",
        borderTop: `6px solid ${C.red}`,
        padding: "12px 16px 14px",
        boxSizing: "border-box",
        opacity: p,
        transform: `translateY(${(1 - p) * -18}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          fontFamily: display,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: -4,
          color: C.white,
          lineHeight: 0.82,
        }}
      >
        <span style={{ fontSize: 116 }}>{n}</span>
        <span style={{ fontSize: 52, color: C.muted, letterSpacing: -2 }}>
          <span style={{ color: C.red }}>/</span>3
        </span>
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "-1px",
          color: C.muted,
          whiteSpace: "nowrap",
        }}
      >
        CÂU CHUYỆN
      </div>
    </div>
  );
};

// A broadcast ticker, not a watermark: it slides, and its facts change with
// the story. Two copies side by side make the loop seamless.
const Ticker: React.FC<{ f: number; text: string; delay: number }> = ({ f, text, delay }) => {
  const p = inAt(f, delay, 16);
  const shift = (((f % 1500) + 1500) % 1500) / 1500 * 50;
  const line = (
    <span style={{ whiteSpace: "pre", paddingRight: 44 }}>{text}</span>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: FRAME.tickerTop,
        width: CONTENT_W,
        height: FRAME.tickerH,
        display: "flex",
        alignItems: "stretch",
        background: "rgba(4,11,24,0.94)",
        borderTop: `4px solid ${C.red}`,
        boxSizing: "border-box",
        opacity: p,
        transform: `translateY(${(1 - p) * 70}px)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: C.red,
          color: C.white,
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          whiteSpace: "nowrap",
          flex: "none",
        }}
      >
        BẢN TIN
      </div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            width: "max-content",
            transform: `translateX(${-shift}%)`,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 34,
            color: C.white,
          }}
        >
          {line}
          {line}
        </div>
      </div>
    </div>
  );
};

export const Chrome: React.FC<{
  story: 1 | 2 | 3;
  label: string;
  ticker: string;
  f: number;
  dimAfter?: number;
  intro?: boolean;
}> = ({ story, label, ticker, f, dimAfter, intro = true }) => {
  const out = dimAfter === undefined ? 1 : 1 - inAt(f, dimAfter, 18);
  // After a wipe the new bulletin is already on air: its chrome is fully
  // there when the wipe clears, instead of re-entering on an empty frame.
  const bar = intro ? 8 : -30;
  const counter = intro ? 14 : -30;
  const tick = intro ? 26 : -30;
  return (
    <AbsoluteFill style={{ opacity: out, pointerEvents: "none" }}>
      <TopBar f={f} label={label} delay={bar} />
      <Counter f={f} n={story} delay={counter} />
      <Ticker f={f} text={ticker} delay={tick} />
    </AbsoluteFill>
  );
};

// ---------- lower thirds ----------

const face = (f: number, delay: number) => {
  const p = inAt(f, delay, 14);
  return {
    p,
    style: {
      opacity: p,
      transform: `translateX(${(1 - p) * -44}px)`,
      clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
    } as CSSProperties,
  };
};

export const LowerThird: React.FC<{
  f: number;
  kicker: string;
  text: string;
  delay?: number;
  size?: number;
}> = ({ f, kicker, text, delay = 0, size = 46 }) => {
  const { style } = face(f, delay);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: FRAME.lowerTop,
        width: CONTENT_W,
        boxSizing: "border-box",
        background: "rgba(4,11,24,0.95)",
        borderLeft: `10px solid ${C.red}`,
        padding: "14px 24px 16px 26px",
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.02em",
          color: C.red,
          lineHeight: 1.15,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.2,
          color: C.white,
          textWrap: "balance",
          marginTop: 4,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const FactStack: React.FC<{
  f: number;
  kicker: string;
  items: { at: number; text: ReactNode }[];
  delay?: number;
}> = ({ f, kicker, items, delay = 0 }) => {
  const { style } = face(f, delay);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: FRAME.lowerTop,
        width: CONTENT_W,
        boxSizing: "border-box",
        background: "rgba(4,11,24,0.95)",
        borderLeft: `10px solid ${C.red}`,
        padding: "12px 24px 14px 26px",
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.02em",
          color: C.red,
          lineHeight: 1.15,
        }}
      >
        {kicker}
      </div>
      <div style={{ marginTop: 2 }}>
        {items.map((item, i) => {
          const p = inAt(f, item.at, 14);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                opacity: p,
                transform: `translateY(${(1 - p) * 10}px)`,
                fontFamily: sans,
                fontWeight: 500,
                fontSize: 36,
                lineHeight: 1.3,
                color: C.white,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  marginTop: 15,
                  background: i === 0 ? C.red : C.muted,
                  flex: "none",
                }}
              />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- quick wipe between stories ----------

const WipeInner: React.FC = () => {
  const f = useCurrentFrame();
  const half = 8;
  const x = f <= half ? interpolate(f, [0, half], [-1140, 0]) : interpolate(f, [half, 16], [0, 1140]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: x - 24,
          width: 24,
          background: C.red,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: x,
          width: 1140,
          background: C.navy,
          borderLeft: `10px solid ${C.white}`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Wipe: React.FC<{ from: number }> = ({ from }) => (
  <Sequence from={from} durationInFrames={16} name="story wipe">
    <WipeInner />
  </Sequence>
);

// Flat white hit on a reveal, 0 before it.
export const Flash: React.FC<{ at: number; color?: string }> = ({ at, color = C.white }) => {
  const f = useCurrentFrame();
  const o = f < at ? 0 : interpolate(f - at, [0, 5], [0.8, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
};

