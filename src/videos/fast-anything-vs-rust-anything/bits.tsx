import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { CONTENT_W, SAFE, easeOut } from "../../kit";
import { C, fmt, grotesk } from "./theme";
import { STORY_START, storyAt } from "./timing";

export const AREA_BOTTOM = 1318;

// ---------------------------------------------------------------------------
// Motion helpers: short entrances, strong ease-out, never from scale(0).
// ---------------------------------------------------------------------------

export const useAt = (at = 0, dur = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
};

export const rise = (p: number, dy = 26): CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dy}px)`,
});

export const slide = (p: number, dx = -34): CSSProperties => ({
  opacity: p,
  transform: `translateX(${(1 - p) * dx}px)`,
});

// ---------------------------------------------------------------------------
// Full-frame picture: covered, darkened, slowly zooming across the story.
// ---------------------------------------------------------------------------

export const Backdrop: React.FC<{
  src: string;
  globalStart: number;
  storyStart: number;
  storyEnd: number;
  dim?: number;
  pos?: string;
  trimBefore?: number;
  clipFrames?: number;
  loopFrames?: number;
  rate?: number;
  image?: boolean;
}> = ({
  src,
  globalStart,
  storyStart,
  storyEnd,
  dim = 0.4,
  pos = "50% 50%",
  trimBefore,
  clipFrames,
  loopFrames,
  rate,
  image,
}) => {
  const f = useCurrentFrame();
  const g = globalStart + f;
  const progress = Math.min(1, Math.max(0, (g - storyStart) / (storyEnd - storyStart)));
  const scale = 1.05 + progress * 0.1;

  const cover: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: pos,
  };

  const media = image ? (
    <Img src={src} style={cover} />
  ) : (
    <OffthreadVideo
      muted
      src={src}
      trimBefore={trimBefore}
      trimAfter={clipFrames}
      playbackRate={rate}
      style={cover}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 50%" }}>
        {loopFrames ? <Loop durationInFrames={loopFrames}>{media}</Loop> : media}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: `rgba(3, 12, 28, ${dim})` }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(3,12,28,0.78) 0%, rgba(3,12,28,0.14) 42%, rgba(3,12,28,0.42) 70%, rgba(3,12,28,0.95) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// The desk: a slim breaking-news bar, the big story counter, a moving ticker.
// Rendered above the scene stack so it stays put while stories wipe through.
// ---------------------------------------------------------------------------

const TICKER: string[] = [
  "VIẾT LẠI 5% CODE NGHẼN · 95% CÒN LẠI GIỮ NGUYÊN · REWRITE TOÀN BỘ MẤT HÀNG THÁNG · FAST-ANYTHING VS RUST-ANYTHING",
  "FAST-ANYTHING 1.971 SAO · PYTHON DEDUPE 4,91s XUỐNG 42ms · TYPESCRIPT 3,11s XUỐNG 155ms · 500 LẦN GỌI THỰC TẾ · 1 HÀM = 1 CRATE",
  "RUST-ANYTHING 8.033 SAO · JSON-SERVER 79–85ms XUỐNG 8–10ms · RAM IDLE 74MB XUỐNG 3,5MB · REWRITE TỪNG PHẦN · APP LIFT",
  "CODING AGENT VIẾT RUST · CÔNG CỤ ĐO LƯỜNG VÀ XÁC MINH · CHẠY TRÊN STAGING · NPM I -G @EL4CTEO/FAST-ANYTHING · FAST-ANYTHING GO",
];

const BAR_RIGHT = ["23.11", "HỒ SƠ 01", "HỒ SƠ 02", "HỒ SƠ 03"];

const TopBar: React.FC<{ story: number }> = ({ story }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      top: SAFE.top,
      width: CONTENT_W,
      height: 64,
      display: "flex",
      fontFamily: grotesk,
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    }}
  >
    <div
      style={{
        width: 200,
        flexShrink: 0,
        background: C.red,
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 34,
        fontWeight: 800,
        whiteSpace: "nowrap",
        borderRight: "3px solid rgba(255,255,255,0.9)",
      }}
    >
      TIN NÓNG
    </div>
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: C.navyMid,
        color: C.white,
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        fontSize: 34,
        fontWeight: 700,
        borderLeft: "2px solid rgba(255,255,255,0.16)",
        whiteSpace: "nowrap",
      }}
    >
      BẢN TIN CÔNG NGHỆ
    </div>
    <div
      style={{
        width: 200,
        flexShrink: 0,
        background: "#081A34",
        color: C.steel,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 34,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {BAR_RIGHT[story]}
    </div>
  </div>
);

const Counter: React.FC<{ story: number; globalFrame: number }> = ({ story, globalFrame }) => {
  if (story === 0) return null;
  const from = STORY_START[story];
  const p = interpolate(globalFrame, [from, from + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 332,
        right: SAFE.right,
        display: "flex",
        alignItems: "flex-end",
        gap: 14,
        fontFamily: grotesk,
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px)`,
      }}
    >
      <div style={{ width: 10, height: 100, background: C.red, marginBottom: 14 }} />
      <div
        style={{
          fontSize: 150,
          fontWeight: 900,
          lineHeight: 0.78,
          color: C.white,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {story}
      </div>
      <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1, color: C.steel, marginBottom: 4 }}>
        /3
      </div>
    </div>
  );
};

const Ticker: React.FC<{ story: number; globalFrame: number }> = ({ story, globalFrame }) => {
  const text = TICKER[story];
  const period = 1050;
  const x = -((globalFrame % period) / period) * (100 / 3);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1348,
        height: 92,
        background: "rgba(3, 13, 28, 0.96)",
        borderTop: `3px solid ${C.red}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: CONTENT_W,
          top: 0,
          bottom: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            transform: `translateX(${x}%)`,
            fontFamily: grotesk,
            fontSize: 38,
            fontWeight: 600,
            color: "#DCE7F7",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i}>
              {text}
              <span style={{ color: C.red, padding: "0 28px" }}>•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Desk: React.FC = () => {
  const g = useCurrentFrame();
  const story = storyAt(g);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {g >= 297 ? <TopBar story={story} /> : null}
      <Counter story={story} globalFrame={g} />
      <Ticker story={story} globalFrame={g} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Layout inside the safe area.
// ---------------------------------------------------------------------------

export const Area: React.FC<{
  top?: number;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ top = 520, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      top,
      width: CONTENT_W,
      height: AREA_BOTTOM - top,
      fontFamily: grotesk,
      ...style,
    }}
  >
    {children}
  </div>
);

export const RedSquare: React.FC<{ size?: number; style?: CSSProperties }> = ({
  size = 14,
  style,
}) => <div style={{ width: size, height: size, background: C.red, flexShrink: 0, ...style }} />;

export const Avatar: React.FC<{ src: string; size: number; style?: CSSProperties }> = ({
  src,
  size,
  style,
}) => (
  <Img
    src={src}
    style={{ width: size, height: size, objectFit: "cover", display: "block", ...style }}
  />
);

// A GitHub star count that counts up on its beat. Tabular digits so the row
// does not wobble while it climbs.
export const StarNumber: React.FC<{
  to: number;
  at: number;
  dur?: number;
  style?: CSSProperties;
}> = ({ to, at, dur = 34, style }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{fmt(to * p)}</span>
  );
};

// Broadcast lower third: a red keyline, a navy plate, a fact. Sits at the
// bottom of the content area, above the ticker.
export const LowerThird: React.FC<{
  at: number;
  kicker?: string;
  text: string;
  alert?: boolean;
}> = ({ at, kicker, text, alert }) => {
  const p = useAt(at, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        background: "rgba(3, 14, 30, 0.9)",
        borderLeft: `9px solid ${C.red}`,
        borderTop: alert ? `2px solid rgba(225,19,43,0.55)` : "2px solid rgba(255,255,255,0.12)",
        padding: "16px 22px 20px",
        ...slide(p, -40),
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        {kicker ? (
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: C.red,
              lineHeight: 1.1,
            }}
          >
            {kicker}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: C.white,
            lineHeight: 1.2,
            textWrap: "balance",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
