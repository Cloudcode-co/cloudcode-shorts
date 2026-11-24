import type { FC, ReactNode } from "react";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import {
  AbsoluteFill,
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  BRAND_SPACE,
  CONTENT_W,
  SAFE,
  display,
  easeOut,
  mono,
  sans,
  useIn,
  videoAsset,
} from "../../kit";
import type { Clip } from "./data";
import { C, fmt, SLUG } from "./theme";

/* ---------- broadcast chrome ---------- */

export const Backdrop: FC<{
  clip: Clip;
  len: number;
  dim?: number;
  zoom?: [number, number];
  pos?: string;
  trim?: number;
  pump?: number;
}> = ({ clip, len, dim = 0.58, zoom = [1.04, 1.14], pos = "50% 45%", trim = 0, pump = 0 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, len], [0, 1], { extrapolateRight: "clamp" });
  const scale = zoom[0] + (zoom[1] - zoom[0]) * t + pump;
  const loopFrames = Math.max(30, Math.round((clip.duration - trim) * 60));
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale, transformOrigin: "50% 45%" }}>
        <Loop durationInFrames={loopFrames}>
          <OffthreadVideo
            src={videoAsset(SLUG, clip.file)}
            muted
            trimBefore={Math.round(trim * 60)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: pos,
              filter: "saturate(0.55) contrast(1.04)",
            }}
          />
        </Loop>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: `rgba(6, 15, 32, ${dim})` }} />
    </AbsoluteFill>
  );
};

export const Counter: FC<{ n: number; size?: number; delay?: number; color?: string }> = ({
  n,
  size = 124,
  delay = 0,
  color = C.paper,
}) => {
  const p = useIn(delay, 16);
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.82,
        letterSpacing: -5,
        color,
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
        opacity: p,
        transform: `translateX(${(1 - p) * 44}px)`,
      }}
    >
      {n}
      <span style={{ color: C.red }}>/</span>3
    </div>
  );
};

export const Kicker: FC<{ label: string; at?: number }> = ({ label, at = 0 }) => {
  const p = useIn(at, 14);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
      }}
    >
      <div style={{ width: 24, height: 24, backgroundColor: C.red, flexShrink: 0 }} />
      <div
        style={{
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 0.6,
          color: C.paper,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Headline: FC<{
  text: string;
  top: number;
  at?: number;
  size?: number;
  width?: number;
  left?: number;
  color?: string;
  lineHeight?: number;
}> = ({ text, top, at = 0, size = 76, width = CONTENT_W, left = SAFE.left, color = C.paper, lineHeight = 1.04 }) => {
  const p = useIn(at, 16);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight,
        letterSpacing: -2,
        color,
        textWrap: "balance",
        textShadow: "0 3px 24px rgba(4, 10, 22, 0.65)",
        opacity: p,
        transform: `translateY(${(1 - p) * 34}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const SceneHead: FC<{
  kicker: string;
  headline: string;
  n: number;
  at?: number;
  size?: number;
  top?: number;
  width?: number;
}> = ({ kicker, headline, n, at = 0, size = 76, top = SAFE.top, width = CONTENT_W }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: CONTENT_W,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 24,
      }}
    >
      <div style={{ paddingTop: 12, flexShrink: 1 }}>
        <Kicker label={kicker} at={at} />
      </div>
      <Counter n={n} delay={at} />
    </div>
    <Headline text={headline} top={top + 122} size={size} width={width} at={at + 6} />
  </>
);

export const LowerThird: FC<{
  lines: string[];
  at: number;
  gap?: number;
  top?: number;
  width?: number;
}> = ({ lines, at, gap = 26, top = 1084, width = CONTENT_W }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width,
        backgroundColor: "rgba(7, 17, 35, 0.94)",
        borderLeft: `12px solid ${C.red}`,
        padding: "22px 28px 26px",
        boxSizing: "border-box",
      }}
    >
      {lines.map((line, i) => {
        const p = interpolate(f, [at + i * gap, at + i * gap + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeOut,
        });
        return (
          <div
            key={line}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 18,
              marginTop: i ? 10 : 0,
              opacity: p,
              transform: `translateX(${(1 - p) * -26}px)`,
            }}
          >
            <div style={{ width: 15, height: 15, backgroundColor: C.red, marginTop: 17, flexShrink: 0 }} />
            <div
              style={{
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 43,
                lineHeight: 1.2,
                color: C.paper,
                textWrap: "balance",
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- chapter title cards ---------- */

export const ChapterCard: FC<{
  n: number;
  title: string;
  kicker: string;
  clip: Clip;
  len: number;
  trim?: number;
  logo?: string;
  stats: string[];
  brandSpace?: boolean;
}> = ({ n, title, kicker, clip, len, trim = 0, logo, stats, brandSpace = false }) => {
  const p = useIn(0, 18);
  const p2 = useIn(6, 18);
  const p3 = useIn(13, 18);
  const top = SAFE.top + (brandSpace ? BRAND_SPACE : 0) + 22;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop clip={clip} len={len} trim={trim} dim={0.7} zoom={[1.02, 1.09]} pos="50% 50%" />
      <div style={{ position: "absolute", left: SAFE.left, top, width: CONTENT_W }}>
        <Kicker label={kicker} at={1} />
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 292,
            lineHeight: 0.8,
            letterSpacing: -16,
            color: C.paper,
            marginTop: 22,
            fontVariantNumeric: "tabular-nums",
            opacity: p,
            transform: `translateY(${(1 - p) * 42}px)`,
            textShadow: "0 6px 40px rgba(4, 10, 22, 0.6)",
          }}
        >
          {n}
          <span style={{ color: C.red }}>/</span>3
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 58,
            opacity: p2,
            transform: `translateY(${(1 - p2) * 28}px)`,
          }}
        >
          {logo ? (
            <div style={{ width: 118, height: 118, backgroundColor: "#000", flexShrink: 0 }}>
              <Img
                src={videoAsset(SLUG, logo)}
                style={{ width: 118, height: 118, objectFit: "cover", display: "block" }}
              />
            </div>
          ) : null}
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 86,
              lineHeight: 0.96,
              letterSpacing: -3,
              color: C.paper,
              textWrap: "balance",
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ width: 170, height: 10, backgroundColor: C.red, marginTop: 26, opacity: p2 }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 1000,
          width: CONTENT_W,
          backgroundColor: "rgba(7, 17, 35, 0.94)",
          borderLeft: `12px solid ${C.red}`,
          padding: "22px 28px 26px",
          boxSizing: "border-box",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: i ? 10 : 0,
              opacity: p3,
              transform: `translateY(${(1 - p3) * 18}px)`,
            }}
          >
            <div style={{ width: 13, height: 13, backgroundColor: C.red, flexShrink: 0 }} />
            <div
              style={{
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 41,
                lineHeight: 1.2,
                color: C.paper,
              }}
            >
              {s}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- the ticker ---------- */

const TICKER =
  "ONLOOK 27.839 SAO · SỬA CODE REACT TRỰC TIẾP · GIẤY PHÉP APACHE 2.0 · BUILDER.IO 8.890 SAO · HEADLESS CMS QUA API VÀ SDK · CLAUDE CODE HOẶC CHATGPT / CODEX · KẾT NỐI MCP · XUẤT HTML, PDF, PNG, JPEG · macOS 13+ · MIỄN PHÍ  ";

export const Ticker: FC = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: SAFE.right,
        top: 1348,
        height: 80,
        backgroundColor: C.ink,
        borderTop: `6px solid ${C.red}`,
        overflow: "hidden",
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: SAFE.left + 252,
          backgroundColor: C.red,
          display: "flex",
          alignItems: "center",
          paddingLeft: SAFE.left,
          boxSizing: "border-box",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: 0.5,
            color: "#fff",
          }}
        >
          TIN NÓNG
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left + 278,
          top: 0,
          height: 80,
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          transform: `translateX(${-f * 2.3}px)`,
        }}
      >
        <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, color: C.paper }}>
          {TICKER.repeat(10)}
        </span>
      </div>
    </div>
  );
};

/* ---------- logos and drawn glyphs ---------- */

export const StarIcon: FC<{ size?: number; color?: string }> = ({ size = 34, color = C.red }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 1.9l3.1 6.6 7.2.9-5.3 5 1.4 7.2L12 18l-6.4 3.6 1.4-7.2-5.3-5 7.2-.9z"
      fill={color}
    />
  </svg>
);

export const CloudIcon: FC<{ size?: number; color?: string }> = ({ size = 34, color = C.red }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M7 18.2h10.2a3.8 3.8 0 0 0 .4-7.6 6 6 0 0 0-11.6-1.4A4.6 4.6 0 0 0 7 18.2z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const ScreenIcon: FC<{ size?: number; color?: string }> = ({ size = 34, color = C.red }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2.5" y="3.5" width="19" height="14" rx="1.5" stroke={color} strokeWidth="2" />
    <path d="M9 21h6M12 17.5V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ArrowDown: FC<{ size?: number; color?: string }> = ({ size = 30, color = C.red }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3v16M5.5 13.5L12 20l6.5-6.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DocIcon: FC<{ size?: number; color?: string }> = ({ size = 40, color = C.paper }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 2.5h9l5 5v14H5z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M14 2.5v5h5M8.5 12h7M8.5 16h7" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const BookmarkIcon: FC<{ size?: number; color?: string }> = ({ size = 44, color = C.paper }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M6 2.5h12v19l-6-4.2-6 4.2z" fill={color} />
  </svg>
);

export const PlusIcon: FC<{ size?: number; color?: string }> = ({ size = 40, color = C.paper }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M11 3h2v8h8v2h-8v8h-2v-8H3v-2h8z" fill={color} />
  </svg>
);

export const CursorIcon: FC<{ size?: number; color?: string }> = ({ size = 46, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 2.6l15.4 9-6.6 1.4-3 6.3z" fill={color} stroke={C.ink} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

export const ChatIcon: FC<{ size?: number; color?: string }> = ({ size = 34, color = C.paper }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M3 4.5h18v12.2h-9.4L6 21.4v-4.7H3z"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- project card ---------- */

export const ProjectPanel: FC<{
  logo: string;
  name: string;
  stars: number;
  meta: string;
  role: string;
  at?: number;
  top?: number;
}> = ({ logo, name, stars, meta, role, at = 0, top = 720 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: CONTENT_W,
        backgroundColor: "rgba(7, 17, 35, 0.93)",
        borderLeft: `12px solid ${C.red}`,
        padding: "26px 28px",
        boxSizing: "border-box",
        display: "flex",
        gap: 26,
        alignItems: "center",
        opacity: p,
        transform: `translateX(${(1 - p) * -60}px)`,
      }}
    >
      <div style={{ width: 132, height: 132, backgroundColor: "#000", flexShrink: 0 }}>
        <Img
          src={videoAsset(SLUG, logo)}
          style={{ width: 132, height: 132, objectFit: "cover", display: "block" }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 62,
            lineHeight: 1,
            color: C.paper,
            letterSpacing: -1,
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 40,
            color: C.paper,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <StarIcon size={34} />
          {fmt(stars)} sao
        </div>
        <div
          style={{
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 34,
            color: C.muted,
          }}
        >
          <span style={{ color: C.red }}>{meta}</span>
          <span style={{ width: 5, height: 5, backgroundColor: C.muted }} />
          <span>{role}</span>
        </div>
      </div>
    </div>
  );
};

/* ---------- the wipe ---------- */

const NewsWipe: FC<TransitionPresentationComponentProps<{ direction: 1 | -1 }>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { direction } = passedProps;
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const shift = (1 - presentationProgress) * 100 * direction;
  const edge = direction === 1 ? { left: -22 } : { right: -22 };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shift}%)` }}>
        {children}
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 22, backgroundColor: C.red, ...edge }} />
      </div>
    </AbsoluteFill>
  );
};

export const newsWipe = (direction: 1 | -1 = 1): TransitionPresentation<{ direction: 1 | -1 }> => ({
  component: NewsWipe,
  props: { direction },
});

/* ---------- small bits ---------- */

export const MetaLine: FC<{ children: ReactNode; at?: number; size?: number; color?: string }> = ({
  children,
  at = 0,
  size = 36,
  color = C.muted,
}) => {
  const p = useIn(at, 14);
  return (
    <div
      style={{
        fontFamily: sans,
        fontWeight: 700,
        fontSize: size,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const MonoPath: FC<{ children: ReactNode; at?: number }> = ({ children, at = 0 }) => {
  const p = useIn(at, 14);
  return (
    <div
      style={{
        fontFamily: mono,
        fontWeight: 700,
        fontSize: 38,
        color: C.paper,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};
