import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  Brand,
  CONTENT_W,
  FPS,
  SAFE,
  Terminal,
  beatmap,
  hit,
  sans,
} from "../../kit";
import beatJson from "./beatmap.json";
import {
  C,
  REPO_DATE,
  REPO_FULL,
  REPO_LICENSE,
  REPO_NAME,
  REPO_STARS,
  a,
  serif,
} from "./palette";

const MAP = beatmap(beatJson);

const ease = Easing.bezier(0.23, 1, 0.32, 1);
const inAt = (f: number, at: number, dur = 14) =>
  interpolate(f, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

// A full-frame stock shot, graded slightly desaturated with a soft vignette
// and a slow push-in. `pumpBase` is the shot's first frame in the whole video:
// in the high-energy section the picture breathes with the beats while the
// words stay still.
export const Footage: React.FC<{
  file: string;
  len: number;
  from?: number;
  pos?: string;
  pushTo?: number;
  pumpBase?: number;
  dim?: number;
  children?: ReactNode;
}> = ({ file, len, from = 0, pos = "50% 50%", pushTo = 0.07, pumpBase, dim = 0, children }) => {
  const f = useCurrentFrame();
  const s =
    interpolate(f, [0, Math.max(1, len)], [1.015, 1.015 + pushTo], {
      extrapolateRight: "clamp",
    }) + (pumpBase === undefined ? 0 : 0.015 * hit(MAP.beats, pumpBase + f, 9));

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.black }}>
      <OffthreadVideo
        src={a(file)}
        muted
        trimBefore={Math.round(from * FPS)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: pos,
          filter: "saturate(0.6) contrast(1.08) brightness(0.86)",
          transform: `scale(${s})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,7,8,0.55) 0%, rgba(5,7,8,0.09) 25%, rgba(5,7,8,0.08) 55%, rgba(5,7,8,0.84) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 78% 64% at 50% 46%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      {dim > 0 && <AbsoluteFill style={{ backgroundColor: `rgba(4,5,6,${dim})` }} />}
      {children}
    </AbsoluteFill>
  );
};

const captionStyle: CSSProperties = {
  fontFamily: serif,
  fontWeight: 500,
  lineHeight: 1.1,
  letterSpacing: "-0.012em",
  color: C.paper,
  textShadow: "0 2px 26px rgba(0,0,0,0.7)",
  textWrap: "balance",
};

// Documentary lower third: a drawn rule, a serif caption, an optional small
// sans line beneath it.
export const LowerThird: React.FC<{
  text: string;
  sub?: string;
  at?: number;
  size?: number;
}> = ({ text, sub, at = 0, size = 64 }) => {
  const f = useCurrentFrame();
  const p = inAt(f, at, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: SAFE.right,
        bottom: SAFE.bottom + 64,
      }}
    >
      <div
        style={{
          width: 88,
          height: 2,
          backgroundColor: C.paper,
          opacity: 0.9 * p,
          transform: `scaleX(${p})`,
          transformOrigin: "left",
          marginBottom: 26,
        }}
      />
      <div
        style={{
          ...captionStyle,
          fontSize: size,
          opacity: p,
          transform: `translateY(${(1 - p) * 16}px)`,
        }}
      >
        {text}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 18,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 36,
            lineHeight: 1.25,
            letterSpacing: "0.01em",
            color: C.dim,
            opacity: p * 0.95,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

// A small date and place line, the way a documentary stamps its reels.
export const Stamp: React.FC<{ place?: string; at?: number; style?: CSSProperties }> = ({
  place = "GitHub",
  at = 0,
  style,
}) => {
  const f = useCurrentFrame();
  const p = inAt(f, at, 16);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: p * 0.92,
        ...style,
      }}
    >
      <span style={{ fontFamily: serif, fontSize: 36, color: C.paper }}>{REPO_DATE}</span>
      <span style={{ width: 1, height: 26, backgroundColor: C.paper, opacity: 0.4 }} />
      <span
        style={{
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 34,
          color: C.dim,
          letterSpacing: "0.02em",
        }}
      >
        {place}
      </span>
    </div>
  );
};

// Key numbers, set huge on black between the scenes.
export const NumberCard: React.FC<{
  value: string;
  label: string;
  size?: number;
  foot?: string;
  at?: number;
}> = ({ value, label, size = 560, foot, at = 0 }) => {
  const f = useCurrentFrame();
  const p = inAt(f, at, 9);
  const scale = interpolate(f, [at, at + 18], [1.045, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 62% 46% at 50% 44%, rgba(255,255,255,0.05), rgba(0,0,0,0) 68%)",
        }}
      />
      <div
        style={{
          width: "100%",
          textAlign: "center",
          opacity: p,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontFamily: serif,
            fontWeight: 400,
            fontSize: size,
            lineHeight: 0.86,
            letterSpacing: "-0.035em",
            color: C.paper,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </div>
        <div style={{ width: 58, height: 1, backgroundColor: C.amber, margin: "44px auto 0" }} />
        <div
          style={{
            marginTop: 28,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 38,
            lineHeight: 1.3,
            color: C.dim,
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </div>
        {foot && (
          <div style={{ marginTop: 46, opacity: 0.85 }}>
            <Stamp place={foot} at={at + 10} style={{ justifyContent: "center" }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// A dark stage with the faintest pool of light, for intertitles and terminals.
export const DarkStage: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 70% 52% at 50% 44%, rgba(255,255,255,0.04), rgba(0,0,0,0) 70%)",
      }}
    />
    {children}
  </AbsoluteFill>
);

// Opening title card: the Cloudcode lockup on dark, the film's title set low,
// and the date and place of the story.
export const TitleCard: React.FC = () => {
  const f = useCurrentFrame();
  const p = inAt(f, 4, 22);
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 58% 44% at 50% 36%, rgba(255,255,255,0.055), rgba(0,0,0,0) 68%)",
        }}
      />
      <Brand />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          right: SAFE.right,
          bottom: SAFE.bottom + 72,
          opacity: p,
          transform: `translateY(${(1 - p) * 18}px)`,
        }}
      >
        <div
          style={{
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 34,
            letterSpacing: "0.05em",
            color: C.dim,
            marginBottom: 24,
          }}
        >
          {REPO_NAME}
        </div>
        <div
          style={{
            ...captionStyle,
            fontSize: 88,
            fontWeight: 500,
            color: C.paper,
          }}
        >
          Canh terminal cả đêm?
        </div>
        <div style={{ width: 96, height: 1, backgroundColor: C.amber, marginTop: 36 }} />
        <Stamp place="GitHub" at={12} style={{ marginTop: 22 }} />
      </div>
    </AbsoluteFill>
  );
};

// Terminal on its own dark stage, kept mounted across a scene so the command
// keeps typing while the background changes underneath it.
export const TerminalStage: React.FC<{ cmds: string[] }> = ({ cmds }) => {
  const f = useCurrentFrame();
  const p = inAt(f, 0, 12);
  return (
    <AbsoluteFill
      style={{
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: CONTENT_W,
          opacity: p,
          transform: `translateY(${(1 - p) * 14}px)`,
        }}
      >
        <Terminal
          cmds={cmds}
          width={CONTENT_W}
          fontSize={40}
          minHeight={0}
          bg={C.terminal}
          fg={C.paper}
          accent={C.amberSoft}
        />
      </div>
    </AbsoluteFill>
  );
};

// The subject's own avatar, set like a case file.
export const RepoCard: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  const row = (delay: number) => {
    const p = inAt(f, at + delay, 16);
    return { opacity: p, transform: `translateY(${(1 - p) * 20}px)` };
  };
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 58% 42% at 50% 40%, rgba(255,255,255,0.05), rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div style={row(0)}>
          <Img
            src={a("repos/KKKKhazix.png")}
            style={{
              width: 216,
              height: 216,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid rgba(239,233,221,0.28)",
            }}
          />
        </div>
        <div
          style={{
            ...captionStyle,
            ...row(8),
            fontSize: 84,
            fontWeight: 500,
            marginTop: 38,
          }}
        >
          {REPO_NAME}
        </div>
        <div
          style={{
            ...row(14),
            marginTop: 14,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 36,
            color: C.dim,
            letterSpacing: "0.02em",
          }}
        >
          {REPO_FULL}
        </div>
        <div
          style={{
            ...row(20),
            marginTop: 34,
            width: 72,
            height: 1,
            backgroundColor: C.amber,
          }}
        />
        <div
          style={{
            ...row(24),
            marginTop: 30,
            fontFamily: serif,
            fontSize: 70,
            color: C.paper,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {REPO_STARS}
          <span
            style={{
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 34,
              color: C.dim,
              marginLeft: 14,
            }}
          >
            sao
          </span>
        </div>
        <div
          style={{
            ...row(30),
            marginTop: 16,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 34,
            color: C.dim,
          }}
        >
          {REPO_LICENSE} · cập nhật {REPO_DATE}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Closing slate, then a slow fade to black.
export const EndSlate: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const p = inAt(f, 4, 24);
  const fade = interpolate(f, [len - 30, len - 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        padding: `${SAFE.top}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 44% at 50% 44%, rgba(255,255,255,0.045), rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        style={{
          width: "100%",
          textAlign: "center",
          opacity: p,
          transform: `translateY(${(1 - p) * 16}px)`,
        }}
      >
        <div
          style={{
            fontFamily: serif,
            fontSize: 118,
            fontWeight: 400,
            letterSpacing: "-0.03em",
            color: C.paper,
            lineHeight: 0.95,
          }}
        >
          {REPO_NAME}
        </div>
        <div style={{ width: 84, height: 1, backgroundColor: C.amber, margin: "40px auto" }} />
        <div
          style={{
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 36,
            color: C.dim,
            letterSpacing: "0.02em",
          }}
        >
          CLI agent chạy ngầm 24/7
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 34,
            color: C.slate,
          }}
        >
          {REPO_STARS} sao GitHub · MIT
        </div>
        <div style={{ marginTop: 46 }}>
          <Stamp place="GitHub" at={20} style={{ justifyContent: "center" }} />
        </div>
      </div>
      <AbsoluteFill style={{ backgroundColor: C.black, opacity: fade }} />
    </AbsoluteFill>
  );
};
