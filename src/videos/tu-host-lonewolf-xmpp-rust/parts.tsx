import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Loop,
  OffthreadVideo,
  useCurrentFrame,
} from "remotion";
import { hit, sectionAt } from "../../kit";
import { BAR_H, BAR_TOP, C, F, SL, SW, TICKER_H, TICKER_TOP, a, stars } from "./palette";
import { MAP, clamp, land } from "./plan";

// ---------------------------------------------------------------- picture ---

// Full-frame picture for a shot: real footage, darkened, easing slowly closer
// for the whole shot. Never a flat colour.
export const Backdrop: React.FC<{
  clip: string;
  len: number;
  start: number;
  clipFrames: number;
  rate?: number;
  pos?: string;
  zoom?: [number, number];
}> = ({ clip, len, start, clipFrames, rate = 1, pos = "50% 50%", zoom = [1.05, 1.12] }) => {
  const f = useCurrentFrame();
  const g = start + f;
  const p = Math.min(1, f / Math.max(1, len));
  const energy = sectionAt(MAP, g).energy;
  const pump = energy > 0.6 ? 0.012 * hit(MAP.beats, g, 9) : 0;
  const scale = zoom[0] + (zoom[1] - zoom[0]) * p + pump;
  const wall = Math.floor(clipFrames / rate);
  const video = (
    <OffthreadVideo
      src={a(clip)}
      muted
      playbackRate={rate}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: pos,
        filter: "saturate(0.6) contrast(1.08)",
      }}
    />
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.ink }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 44%" }}>
        {wall < len + 4 ? <Loop durationInFrames={Math.max(40, wall - 2)}>{video}</Loop> : video}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "rgba(2,9,20,0.56)" }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(2,9,20,0.8) 0%, rgba(2,9,20,0.22) 25%, rgba(2,9,20,0.14) 60%, rgba(2,9,20,0.86) 100%)",
        }}
      />
      {/* The lockup and the bar live in the top band: keep it dark there. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(2,9,20,0.52) 0px, rgba(2,9,20,0.42) 300px, rgba(2,9,20,0) 560px)",
        }}
      />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ transitions ---

// A navy panel with a red leading edge sweeps off to the left in 11 frames,
// revealing the new story. `flash` adds a white hit once the panel has cleared.
export const Wipe: React.FC<{ flash?: boolean }> = ({ flash = false }) => {
  const f = useCurrentFrame();
  const t = land(f, 0, 11);
  return (
    <>
      {t < 1 ? (
        <AbsoluteFill style={{ transform: `translateX(${-100 * t}%)`, backgroundColor: C.navy }}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 48, backgroundColor: C.red }} />
          <div
            style={{
              position: "absolute",
              right: 48,
              top: 0,
              bottom: 0,
              width: 10,
              backgroundColor: "rgba(255,255,255,0.86)",
            }}
          />
        </AbsoluteFill>
      ) : null}
      {flash ? (
        <AbsoluteFill
          style={{
            backgroundColor: C.white,
            opacity:
              f < 6 ? 0 : interpolate(f, [6, 7, 22], [0, 0.6, 0], { ...clamp }),
          }}
        />
      ) : null}
    </>
  );
};

// A short dissolve between two scenes of the same shot: the picture stays
// still, so the layout change reads as a reframe rather than a cut.
export const SceneIn: React.FC<{ children: ReactNode; dur?: number }> = ({ children, dur = 5 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: land(f, 0, dur) }}>{children}</AbsoluteFill>;
};

// ----------------------------------------------------------------- chrome ---

// Slim breaking-news bar: red masthead, the story's kicker, and the 1/3 counter.
export const TopBar: React.FC<{
  kicker: string;
  index: number | null;
  hideAt?: number;
}> = ({ kicker, index, hideAt }) => {
  const f = useCurrentFrame();
  const p = land(f, 2, 12) * (1 - (hideAt === undefined ? 0 : land(f, hideAt, 10)));
  return (
    <div
      style={{
        position: "absolute",
        left: SL,
        top: BAR_TOP,
        width: SW,
        height: BAR_H,
        display: "flex",
        opacity: p,
        transform: `translateY(${(1 - p) * -26}px)`,
      }}
    >
      <div
        style={{
          width: 170,
          background: C.red,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 34,
          color: C.white,
        }}
      >
        BẢN TIN
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          background: "rgba(4,16,31,0.94)",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          fontFamily: F.sans,
          fontWeight: 700,
          fontSize: 34,
          color: C.white,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {kicker}
      </div>
      {index !== null ? (
        <div
          style={{
            width: 150,
            background: C.white,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 2,
            fontFamily: F.sans,
            fontWeight: 900,
            fontSize: 60,
            color: C.onPaper,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {index}
          <span style={{ fontSize: 34, fontWeight: 700, color: "#5A6C82" }}>/{3}</span>
        </div>
      ) : null}
    </div>
  );
};

// Bottom crawl. Mono so the loop width is exact; it carries only real facts.
const TICK_ITEMS = [
  "LONEWOLF 111 SAO GITHUB",
  "REDB 4.944 SAO",
  "EJABBERD CẦN ERLANG/OTP VÀ LIBEXPAT",
  "PROSODY CHẠY TRÊN NỀN LUA",
  "V0.3.0 HỖ TRỢ FEDERATION",
  "ACME TỰ CẤP CHỨNG CHỈ LET'S ENCRYPT",
  "PHIÊN BẢN PRE-1.0 CHẠY SINGLE-NODE",
];
const TICK_SEP = "  ·  ";
const TICK_LINE = TICK_ITEMS.join(TICK_SEP) + TICK_SEP;
const TICK_CHAR = 34 * 0.6;

export const Ticker: React.FC<{ start: number; appearAt?: number }> = ({ start, appearAt }) => {
  const f = useCurrentFrame();
  const g = start + f;
  const width = TICK_LINE.length * TICK_CHAR;
  const x = -((g * 2.1) % width);
  const p = appearAt === undefined ? 1 : land(g, appearAt, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: SL,
        top: TICKER_TOP,
        width: SW,
        height: TICKER_H,
        display: "flex",
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      <div
        style={{
          width: 170,
          background: C.red,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 34,
          color: C.white,
          flexShrink: 0,
        }}
      >
        TIN MỚI
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          position: "relative",
          overflow: "hidden",
          background: "rgba(4,16,31,0.95)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            transform: `translateX(${x}px)`,
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 34,
            color: C.white,
          }}
        >
          {TICK_LINE + TICK_LINE}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- content ---

// Project card: real avatar, name, language/licence, real GitHub stars.
export const ProjectCard: React.FC<{
  logo: string;
  name: string;
  meta: string;
  count: number;
  at: number;
  y: number;
  h?: number;
  size?: number;
}> = ({ logo, name, meta, count, at, y, h = 196, size = 52 }) => {
  const f = useCurrentFrame();
  const p = land(f, at, 13);
  return (
    <div
      style={{
        position: "absolute",
        left: SL,
        top: y,
        width: SW,
        height: h,
        display: "flex",
        alignItems: "center",
        gap: 24,
        background: C.white,
        borderRadius: 4,
        paddingLeft: 28,
        paddingRight: 26,
        boxSizing: "border-box",
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${(1 - p) * 32}px)`,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, background: C.red }} />
      <Img
        src={a(logo)}
        style={{
          width: 104,
          height: 104,
          borderRadius: 12,
          border: "2px solid #DCE6F1",
          background: "#EEF3F9",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 1,
            color: C.onPaper,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 600,
            fontSize: 34,
            lineHeight: 1.2,
            color: C.onPaperDim,
            marginTop: 9,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {meta}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontFamily: F.sans,
            fontWeight: 900,
            fontSize: 66,
            lineHeight: 1,
            color: C.onPaper,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {stars(count)}
        </div>
        <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 34, color: C.onPaperDim, marginTop: 3 }}>
          sao GitHub
        </div>
      </div>
    </div>
  );
};

// Fact lower third: red label block, white panel, one fact at a time. A later
// fact can take the same slot; the earlier one leaves as it arrives.
export const LowerThird: React.FC<{
  at: number;
  until?: number;
  y: number;
  label: string;
  text: string;
  h?: number;
}> = ({ at, until, y, label, text, h = 150 }) => {
  const f = useCurrentFrame();
  const p = land(f, at, 12) * (1 - (until === undefined ? 0 : land(f, until, 7)));
  return (
    <div
      style={{
        position: "absolute",
        left: SL,
        top: y,
        width: SW,
        height: h,
        display: "flex",
        background: C.white,
        borderRadius: 4,
        overflow: "hidden",
        opacity: p,
        transform: `translateX(${(1 - p) * -46}px)`,
      }}
    >
      <div
        style={{
          width: 200,
          flexShrink: 0,
          background: C.red,
          color: C.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 14px",
          fontFamily: F.sans,
          fontWeight: 800,
          fontSize: 34,
          lineHeight: 1.15,
          textAlign: "center",
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          fontFamily: F.sans,
          fontWeight: 700,
          fontSize: 38,
          lineHeight: 1.18,
          color: C.onPaper,
          textWrap: "balance",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Navy instrument panel (a terminal's neighbour, a diagram, a config file).
export const Panel: React.FC<{
  at: number;
  y: number;
  h: number;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ at, y, h, children, style }) => {
  const f = useCurrentFrame();
  const p = land(f, at, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: SL,
        top: y,
        width: SW,
        height: h,
        boxSizing: "border-box",
        background: "rgba(4,16,31,0.93)",
        border: "2px solid rgba(255,255,255,0.18)",
        borderTop: `5px solid ${C.red}`,
        borderRadius: 4,
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

