import type { CSSProperties, ReactNode } from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { Sfx, display, easeOut, FPS, mono, sans, videoAsset, SAFE } from "../../kit";

export const SLUG = "handy-offline-speech-to-text";
export const s = (sec: number) => Math.round(sec * FPS);

export const C = {
  bg: "#15111B",
  inBg: "#2B2535",
  pink: "#F7A8C8",
  ink: "#1B1220",
  dim: "#A79FB5",
  green: "#8EE3B0",
  amber: "#FFC76B",
  teal: "#6FD6D0",
};

export type Who = {
  name?: string;
  color: string;
  img?: string;
  letter?: string;
  icon?: string; // simple-icons path
};

export const HANDY: Who = { name: "Handy", color: C.pink, img: "repos/cjpais.png" };
export const CJ: Who = { name: "CJ Pais", color: C.pink, img: "repos/cjpais.png" };
export const ASKER: Who = { color: "#7C8CFF" };

export const Avatar: React.FC<{ who: Who; size?: number }> = ({ who, size = 84 }) => {
  const base: CSSProperties = {
    width: size,
    height: size,
    borderRadius: size / 2,
    flexShrink: 0,
    overflow: "hidden",
    background: who.color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  if (who.img)
    return (
      <div style={base}>
        <Img src={videoAsset(SLUG, who.img)} style={{ width: size, height: size, objectFit: "cover" }} />
      </div>
    );
  if (who.icon)
    return (
      <div style={{ ...base, background: "#fff" }}>
        <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58}>
          <path d={who.icon} fill={who.color} />
        </svg>
      </div>
    );
  if (who.letter)
    return (
      <div style={{ ...base, fontFamily: display, fontWeight: 800, fontSize: size * 0.5, color: C.ink }}>
        {who.letter}
      </div>
    );
  return (
    <div style={base}>
      <svg viewBox="0 0 24 24" width={size * 0.7} height={size * 0.7} style={{ marginTop: size * 0.2 }}>
        <circle cx="12" cy="8" r="4.2" fill={C.ink} />
        <path d="M3 24c0-6 4-9 9-9s9 3 9 9z" fill={C.ink} />
      </svg>
    </div>
  );
};

const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 12, padding: "16px 8px" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: C.dim,
            opacity: 0.4 + 0.6 * Math.max(0, Math.sin((frame - i * 5) / 5)),
          }}
        />
      ))}
    </div>
  );
};

// A chat message. A typing indicator shows for `typing` frames, then the
// bubble pops in at frame `at`.
export const Msg: React.FC<{
  at: number;
  who?: Who;
  out?: boolean;
  typing?: number;
  children: ReactNode;
  bare?: boolean; // no bubble padding (media, code)
  maxW?: number;
  hideAvatar?: boolean;
}> = ({ at, who, out, typing = 30, children, bare, maxW = 700, hideAvatar }) => {
  const frame = useCurrentFrame();
  if (frame < at - typing) return null;
  const isTyping = frame < at;
  const p = interpolate(frame, [at, at + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const sender = out ? undefined : (who ?? ASKER);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: out ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 16,
        marginBottom: 20,
      }}
    >
      {!out && (hideAvatar ? <div style={{ width: 84, flexShrink: 0 }} /> : <Avatar who={sender!} />)}
      <div style={{ maxWidth: maxW, minWidth: 0 }}>
        {!isTyping && sender?.name && !hideAvatar && (
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: sender.color, marginBottom: 6, marginLeft: 8 }}>
            {sender.name}
          </div>
        )}
        <div
          style={{
            background: out ? C.pink : C.inBg,
            color: out ? C.ink : "#fff",
            borderRadius: 38,
            borderBottomLeftRadius: out ? 38 : 10,
            borderBottomRightRadius: out ? 10 : 38,
            overflow: "hidden",
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 44,
            lineHeight: 1.28,
            ...(isTyping
              ? { padding: "10px 26px" }
              : { padding: bare ? 0 : "22px 32px", opacity: p, translate: `0px ${(1 - p) * 26}px`, scale: String(0.95 + 0.05 * p) }),
          }}
        >
          {isTyping ? <Dots /> : children}
        </div>
      </div>
      <Sfx id="pop" at={at} volume={0.18} frames={20} />
    </div>
  );
};

export const ChatHeader: React.FC<{ who: Who; title: string; sub: string; at?: number }> = ({
  who,
  title,
  sub,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22,
      height: 120,
      borderBottom: "2px solid rgba(255,255,255,0.1)",
      marginBottom: 14,
      flexShrink: 0,
    }}
  >
    <Avatar who={who} size={92} />
    <div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: "#fff", lineHeight: 1.05 }}>{title}</div>
      <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, color: C.dim }}>{sub}</div>
    </div>
  </div>
);

export const Thread: React.FC<{ children: ReactNode; padTop?: number }> = ({ children, padTop = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      right: SAFE.right,
      top: SAFE.top + padTop,
      bottom: SAFE.bottom,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </div>
);

// Bottom-anchored message list.
export const Feed: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: 0, overflow: "hidden" }}>
    {children}
  </div>
);

export const Composer: React.FC<{ children?: ReactNode }> = ({ children }) => (
  <div
    style={{
      height: 104,
      flexShrink: 0,
      border: "3px solid rgba(255,255,255,0.18)",
      borderRadius: 52,
      display: "flex",
      alignItems: "center",
      padding: "0 36px",
      fontFamily: sans,
      fontSize: 38,
      color: C.dim,
      gap: 18,
    }}
  >
    {children ?? "Nhắn tin…"}
  </div>
);

export const Wave: React.FC<{ n?: number; h?: number; color?: string; active?: boolean; seed?: number }> = ({
  n = 22,
  h = 90,
  color = C.pink,
  active = true,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, height: h }}>
      {Array.from({ length: n }, (_, i) => {
        const v = active ? 0.25 + 0.75 * Math.abs(Math.sin(frame / 6 + i * 1.7 + seed) * Math.cos(frame / 11 + i)) : 0.12;
        return <div key={i} style={{ width: 9, height: h * v, borderRadius: 5, background: color }} />;
      })}
    </div>
  );
};

export const mono_ = mono;
