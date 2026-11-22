import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile } from "remotion";
import {
  Brand,
  CONTENT_W,
  Meme,
  MemeCaption,
  SAFE,
  Terminal,
  display,
  easeOut,
  sans,
} from "../../kit";
import facts from "./facts.json";
import { Chevron, GroupAvatar, PixelBurst, PixelFace, SendArrow, TntBlock } from "./pixel";

export const SLUG = "host-server-minecraft-ban-than-pha-lag";
export const PHOTO = staticFile(
  `videos/${SLUG}/images/gaming-keyboard-rgb-pixabay-7550908.jpg`,
);

export const C = {
  bg: "#0E0A08",
  card: "#1C1511",
  them: "#241C16",
  themText: "#F5EDE3",
  me: "#6DBE45",
  meText: "#0C1607",
  meAccent: "#0A3A0C",
  gold: "#F3B33D",
  green: "#7ED957",
  red: "#E5484D",
  dim: "rgba(245,237,227,0.58)",
  faint: "rgba(245,237,227,0.34)",
  line: "rgba(245,237,227,0.13)",
};

type MemeFact = (typeof facts.memes)[number];

const memeOf = (scene: string) => facts.memes.find((m) => m.scene === scene) as MemeFact;

// ---------------------------------------------------------------- the script

export const S3_LINES = [
  "Thằng bạn thân vừa vào đúng mười phút",
  "đã dựng xong máy nhân bản TNT",
  "và farm mía nghìn block",
];

export type Msg = {
  id: string;
  at: number;
  from: "me" | "them";
  kind: "text" | "sticker" | "monitor" | "ssh";
  text?: string;
  meme?: MemeFact;
  typingFrom?: number;
  stickerW?: number;
};

export const MESSAGES: Msg[] = [
  { id: "s1a", at: 34, from: "me", kind: "text", text: "Tự tin thuê con VPS giá rẻ" },
  { id: "s1b", at: 58, from: "me", kind: "text", text: "mở server Minecraft rủ đám bạn thân vào quẩy" },
  {
    id: "s1cat",
    at: 144,
    from: "them",
    kind: "sticker",
    meme: memeOf("s1"),
    typingFrom: 118,
    stickerW: 360,
  },
  { id: "s2a", at: 232, from: "me", kind: "text", text: "Mạnh mồm gáy trên Discord" },
  { id: "s2b", at: 258, from: "me", kind: "text", text: "server tao tối ưu Paper" },
  { id: "s2c", at: 286, from: "me", kind: "text", text: "bao mượt không giật lag" },
  {
    id: "s2cat",
    at: 344,
    from: "them",
    kind: "sticker",
    meme: memeOf("s2"),
    typingFrom: 318,
    stickerW: 320,
  },
  { id: "s3a", at: 517, from: "them", kind: "text", text: S3_LINES[0], typingFrom: 488 },
  { id: "s3b", at: 543, from: "them", kind: "text", text: S3_LINES[1] },
  { id: "s3c", at: 570, from: "them", kind: "text", text: S3_LINES[2] },
  {
    id: "s3cat",
    at: 636,
    from: "them",
    kind: "sticker",
    meme: memeOf("s3"),
    typingFrom: 608,
    stickerW: 310,
  },
  { id: "s4a", at: 758, from: "them", kind: "text", text: "RAM nhảy vọt lên 99%," },
  { id: "s4mon", at: 776, from: "me", kind: "monitor" },
  { id: "s4b", at: 792, from: "them", kind: "text", text: "TPS tụt thẳng từ 20 về 0.5" },
  { id: "s4c", at: 812, from: "them", kind: "text", text: "rồi đơ toàn tập" },
  {
    id: "s5a",
    at: 1008,
    from: "them",
    kind: "text",
    text: "Cả nhóm quay ra chửi admin lùa gà",
    typingFrom: 984,
  },
  { id: "s5ssh", at: 1016, from: "me", kind: "ssh" },
  { id: "s5b", at: 1050, from: "them", kind: "text", text: "trong khi terminal SSH còn éo thèm phản hồi" },
];

// Reactions sit on the message they answer, like an emoji on a bubble.
export const REACTIONS = [
  { after: "s4c", at: 844, width: 158, meme: memeOf("s4") },
  { after: "s5b", at: 1092, width: 158, meme: memeOf("s5") },
];
export const LAST_MESSAGE = MESSAGES[MESSAGES.length - 1];
export const TYPING_STARTS = MESSAGES.filter((m) => m.typingFrom !== undefined).map(
  (m) => m.typingFrom as number,
);

const typingAt = (g: number) =>
  MESSAGES.find(
    (m) => m.typingFrom !== undefined && g >= (m.typingFrom as number) && g < m.at,
  );

// ---------------------------------------------------------------- type

const TOKENS = /(VPS|Paper|TNT|SSH|99%|20|0\.5|mười phút|nghìn block)/;

const Tinted: React.FC<{ text: string; me: boolean }> = ({ text, me }) => (
  <>
    {text.split(TOKENS).map((part, i) =>
      i % 2 === 1 ? (
        <span
          key={i}
          style={{ color: me ? C.meAccent : C.gold, fontWeight: 700 }}
        >
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      ),
    )}
  </>
);

// ---------------------------------------------------------------- bubbles

const Bubble: React.FC<{
  text: string;
  me: boolean;
  size?: number;
  maxWidth?: number;
  style?: CSSProperties;
}> = ({ text, me, size = 48, maxWidth = 620, style }) => (
  <div
    style={{
      maxWidth,
      background: me ? C.me : C.them,
      color: me ? C.meText : C.themText,
      borderRadius: 32,
      borderBottomRightRadius: me ? 10 : 32,
      borderBottomLeftRadius: me ? 32 : 10,
      padding: "20px 28px",
      fontFamily: sans,
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.3,
      textWrap: "balance",
      boxSizing: "border-box",
      ...style,
    }}
  >
    <Tinted text={text} me={me} />
  </div>
);

const Dots: React.FC<{ g: number }> = ({ g }) => (
  <div style={{ display: "flex", gap: 12, padding: "26px 28px" }}>
    {[0, 1, 2].map((i) => {
      const s = Math.max(0, Math.sin((g - i * 5) / 4.5));
      return (
        <div
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: "rgba(245,237,227,0.9)",
            opacity: 0.3 + 0.7 * s,
            transform: `translateY(${-6 * s}px)`,
          }}
        />
      );
    })}
  </div>
);

const SenderName: React.FC<{ children: ReactNode; align: "left" | "right" }> = ({
  children,
  align,
}) => (
  <div
    style={{
      fontFamily: sans,
      fontSize: 34,
      fontWeight: 700,
      color: C.dim,
      marginBottom: 7,
      textAlign: align,
      paddingLeft: align === "left" ? 76 : 0,
      paddingRight: align === "right" ? 6 : 0,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------- attachments

const MonitorCard: React.FC<{ g: number; at: number }> = ({ g, at }) => {
  const p = interpolate(g, [at, at + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const fall = interpolate(g, [at + 8, at + 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tps = Math.max(0.5, Math.round((20 - 19.5 * fall * fall) * 10) / 10);
  const dead = g >= at + 46;
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = (i / 24) * fall;
    const v = 20 - 19.5 * t * t;
    pts.push(`${10 + t * 520},${68 - (v / 20) * 56}`);
  }
  const last = pts[pts.length - 1]?.split(",").map(Number) ?? [10, 12];
  return (
    <div
      style={{
        width: 640,
        background: "#140F0C",
        border: `2px solid rgba(229,72,77,${dead ? 0.85 : 0.45})`,
        borderRadius: 26,
        padding: "18px 28px 10px",
        boxSizing: "border-box",
        opacity: p,
        transform: `scale(${0.96 + 0.04 * p})`,
        transformOrigin: "100% 100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: sans, fontSize: 34, fontWeight: 700, color: C.dim }}>RAM</span>
        <span
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 78,
            lineHeight: 1,
            color: C.red,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          99%
        </span>
      </div>
      <div
        style={{
          height: 20,
          marginTop: 10,
          borderRadius: 5,
          background: "#2A1714",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${99 * p}%`,
            height: "100%",
            background: C.red,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: 12,
        }}
      >
        <span style={{ fontFamily: sans, fontSize: 34, fontWeight: 700, color: C.dim }}>TPS</span>
        <span
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 56,
            lineHeight: 1,
            color: tps < 1 ? C.red : C.gold,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {tps.toFixed(1)}
        </span>
      </div>
      <svg width={560} height={78} viewBox="0 0 560 78" style={{ marginTop: 2 }}>
        <polyline points={pts.join(" ")} fill="none" stroke={C.gold} strokeWidth={5} strokeLinejoin="round" />
        <rect x={last[0] - 7} y={last[1] - 7} width={14} height={14} fill={C.red} />
      </svg>
    </div>
  );
};

// The admin pastes one command and the server never answers: the kit terminal
// types it character for character, then the cursor just blinks.
export const SSH_CMD = "ssh admin@vps";

const SshCard: React.FC<{ at: number }> = ({ at }) => (
  <div
    style={{
      width: 640,
      border: "2px solid rgba(126,217,87,0.3)",
      borderRadius: 28,
      overflow: "hidden",
    }}
  >
    <Sequence from={at} durationInFrames={300} layout="none" name="ssh">
      <Terminal
        cmds={[SSH_CMD]}
        width={636}
        fontSize={38}
        minHeight={0}
        bg="#0C100C"
        fg="#C9F5A9"
        accent="#7ED957"
      />
    </Sequence>
  </div>
);

// ---------------------------------------------------------------- one message

const popStyle = (g: number, at: number, from: "me" | "them"): CSSProperties => {
  const p = interpolate(g, [at, at + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * 16}px) scale(${0.95 + 0.05 * p})`,
    transformOrigin: from === "me" ? "100% 100%" : "0% 100%",
  };
};

const stickerStyle = (g: number, at: number, w: number): CSSProperties => {
  const s = spring({
    frame: Math.max(0, g - at),
    fps: 60,
    config: { damping: 10, stiffness: 190, mass: 0.9 },
    durationInFrames: 22,
  });
  return {
    position: "relative",
    width: w,
    opacity: Math.min(1, Math.max(0, (g - at) / 4)),
    transform: `scale(${0.88 + 0.12 * s})`,
    transformOrigin: "0% 100%",
  };
};

const MessageRow: React.FC<{ m: Msg; g: number; showName: boolean }> = ({ m, g, showName }) => {
  const me = m.from === "me";
  if (m.kind === "sticker" && m.meme) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: 16 }}>
        {showName && <SenderName align="left">Bạn thân</SenderName>}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
          <PixelFace kind="orange" size={64} />
          <Meme
            slug={SLUG}
            file={m.meme.file}
            width={m.meme.width}
            height={m.meme.height}
            style={{ ...stickerStyle(g, m.at, m.stickerW ?? 340), position: "relative" }}
          />
        </div>
      </div>
    );
  }
  if (m.kind === "monitor" || m.kind === "ssh") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: 16 }}>
        {showName && <SenderName align="right">Admin</SenderName>}
        <div style={popStyle(g, m.at, "me")}>
          {m.kind === "monitor" ? <MonitorCard g={g} at={m.at} /> : <SshCard at={m.at} />}
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: me ? "flex-end" : "flex-start",
        marginTop: 16,
      }}
    >
      {showName && <SenderName align={me ? "right" : "left"}>{me ? "Admin" : "Bạn thân"}</SenderName>}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, maxWidth: "100%" }}>
        {!me && <PixelFace kind="orange" size={64} />}
        <div style={popStyle(g, m.at, m.from)}>
          <Bubble text={m.text ?? ""} me={me} />
        </div>
      </div>
    </div>
  );
};

const TypingRow: React.FC<{ g: number; from: number }> = ({ g, from }) => {
  const p = interpolate(g, [from, from + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 14,
        marginTop: 16,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      <PixelFace kind="orange" size={64} />
      <div
        style={{
          background: C.them,
          borderRadius: 32,
          borderBottomLeftRadius: 10,
        }}
      >
        <Dots g={g} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- chapter card

export type Chapter = {
  from: number;
  to: number;
  title: string;
  pos: string;
  brand?: boolean;
};

export const CHAPTERS: Chapter[] = [
  { from: 0, to: 26, title: "THUÊ VPS GIÁ RẺ", pos: "52% 30%", brand: true },
  { from: 462, to: 488, title: "MƯỜI PHÚT SAU", pos: "34% 58%" },
  { from: 732, to: 758, title: "RAM 99%", pos: "62% 62%" },
  { from: 960, to: 986, title: "CHỬI ADMIN", pos: "46% 44%" },
];

export const CARD_ENDINGS = CHAPTERS.map((c) => c.to);

export const ChapterCard: React.FC<{ g: number; chapter: Chapter }> = ({ g, chapter }) => {
  if (g < chapter.from || g >= chapter.to) return null;
  const local = g - chapter.from;
  const p = interpolate(local, [0, 11], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const zoom = interpolate(local, [0, chapter.to - chapter.from], [1.04, 1.1]);
  const rise = interpolate(local, [0, chapter.to - chapter.from], [0, -14]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img
          src={PHOTO}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: chapter.pos,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "rgba(8,5,3,0.76)" }} />
      <AbsoluteFill
        style={{
          padding: `${SAFE.top + 40}px ${SAFE.right}px ${SAFE.bottom}px ${SAFE.left}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(30,23,18,0.94)",
            border: "2px solid rgba(245,237,227,0.10)",
            borderRadius: 48,
            padding: "36px 40px 42px",
            transform: `translateY(${(1 - p) * 28 + rise}px) scale(${0.92 + 0.08 * p})`,
            transformOrigin: "0% 100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
            <GroupAvatar size={74} />
            <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: C.dim }}>
              Hội bạn thân
            </div>
          </div>
          <MemeCaption
            text={chapter.title}
            size={92}
            color={C.gold}
            outline="#0B0704"
            style={{ position: "relative", width: "100%" }}
          />
        </div>
      </AbsoluteFill>
      {chapter.brand && <Brand />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the drop slate

export const DROP_FROM = 517;
export const DROP_TO = 623;

export const DropSlate: React.FC<{ g: number }> = ({ g }) => {
  if (g < DROP_FROM || g >= DROP_TO) return null;
  const local = g - DROP_FROM;
  const flash = local < 9 ? 0.92 * (1 - local / 9) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <Img
        src={PHOTO}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "55% 64%",
          opacity: 0.22,
          transform: `scale(${1.06 + local * 0.0008})`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(8,5,3,0.7)" }} />
      <PixelBurst g={g} from={DROP_FROM} x={770} y={520} />
      <AbsoluteFill
        style={{
          padding: `${SAFE.top + 170 + 20}px ${SAFE.right}px ${SAFE.bottom + 120}px ${SAFE.left}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <PixelFace kind="orange" size={72} />
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: C.themText }}>
            Bạn thân
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
          {S3_LINES.map((line, i) => {
            const at = DROP_FROM + i * 26;
            const q = interpolate(g, [at, at + 8], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            });
            return (
              <div
                key={line}
                style={{
                  opacity: q,
                  transform: `translateY(${(1 - q) * 34}px) scale(${1.04 - 0.04 * q})`,
                  transformOrigin: "0% 100%",
                }}
              >
                <Bubble text={line} me={false} size={50} maxWidth={680} />
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "center",
            opacity: g >= 543 ? 1 : 0,
            transform: `scale(${0.9 + 0.1 * spring({ frame: Math.max(0, g - 543), fps: 60, config: { damping: 11, stiffness: 170 }, durationInFrames: 24 })}) rotate(-7deg)`,
          }}
        >
          <TntBlock size={200} />
        </div>
      </AbsoluteFill>
      <ChatHeader g={g} />
      <ChatInput />
      <AbsoluteFill
        style={{ backgroundColor: "#FFF3E2", opacity: flash, pointerEvents: "none", zIndex: 30 }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the app

export const ChatHeader: React.FC<{ g: number }> = ({ g }) => {
  const typing = typingAt(g);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: SAFE.top + 170,
          backgroundColor: "#0B0806",
          borderBottom: `2px solid ${C.line}`,
          zIndex: 20,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: SAFE.top,
          width: CONTENT_W,
          height: 168,
          display: "flex",
          alignItems: "center",
          gap: 16,
          zIndex: 21,
        }}
      >
        <Chevron />
        <GroupAvatar size={92} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 46,
              color: C.themText,
              lineHeight: 1.08,
              whiteSpace: "nowrap",
            }}
          >
            Hội bạn thân
          </div>
          <div
            style={{
              fontFamily: sans,
              fontWeight: 500,
              fontSize: 34,
              marginTop: 5,
              color: typing ? C.gold : C.green,
              whiteSpace: "nowrap",
            }}
          >
            {typing ? "Bạn thân đang gõ…" : "đang hoạt động"}
          </div>
        </div>
      </div>
    </>
  );
};

export const ChatInput: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      width: CONTENT_W,
      bottom: SAFE.bottom,
      height: 96,
      borderRadius: 48,
      backgroundColor: "rgba(26,20,15,0.94)",
      border: `2px solid ${C.line}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 12px 0 32px",
      boxSizing: "border-box",
      zIndex: 20,
    }}
  >
    <span style={{ fontFamily: sans, fontSize: 36, fontWeight: 500, color: C.dim }}>
      Nhắn tin
    </span>
    <div
      style={{
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: C.me,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SendArrow />
    </div>
  </div>
);

export const ChatStage: React.FC<{ g: number }> = ({ g }) => {
  const typing = typingAt(g);
  const open = interpolate(g, [26, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const punch = Math.max(
    0,
    ...[...CARD_ENDINGS, DROP_TO].map((end) => {
      const d = g - end;
      return d >= 0 && d < 9 ? 1 - d / 9 : 0;
    }),
  );
  const shake = g >= 840 && g < 854 ? Math.sin((g - 840) * 1.7) * 7 * (1 - (g - 840) / 14) : 0;
  const scale = 1 + 0.022 * punch;
  const wave = 1.04 + g * 0.000025;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translateY(${(1 - open) * 20}px) scale(${scale}) translateX(${shake}px)`,
          opacity: 0.8 + 0.2 * open,
        }}
      >
        <Img
          src={PHOTO}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 42%",
            opacity: 0.4,
            transform: `scale(${wave})`,
          }}
        />
        <AbsoluteFill style={{ backgroundColor: "rgba(10,7,5,0.64)" }} />

        {/* the fade sits behind the thread, so it only darkens the background
            and never dims message text scrolling under the header */}
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            top: SAFE.top + 170,
            width: CONTENT_W,
            height: 200,
            background:
              "linear-gradient(to bottom, #0B0806 0%, #0B0806 60px, rgba(11,8,6,0.85) 124px, rgba(11,8,6,0) 200px)",
            pointerEvents: "none",
          }}
        />

        <ChatHeader g={g} />

        {/* thread */}
        <div
          style={{
            position: "absolute",
            left: SAFE.left,
            top: SAFE.top + 80,
            width: CONTENT_W,
            bottom: SAFE.bottom + 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              paddingBottom: 30,
              opacity: interpolate(g, [26, 40], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <GroupAvatar size={168} />
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 46,
                color: C.themText,
                lineHeight: 1.1,
              }}
            >
              Hội bạn thân
            </div>
          </div>
          <div
            style={{
              fontFamily: sans,
              fontSize: 34,
              fontWeight: 500,
              color: C.faint,
              textAlign: "center",
              paddingBottom: 4,
            }}
          >
            Hôm nay
          </div>
          {MESSAGES.map((m, i) => {
            if (g < m.at) return null;
            const prev = MESSAGES[i - 1];
            const showName = !prev || prev.from !== m.from;
            const reaction = REACTIONS.find((r) => r.after === m.id);
            return (
              <div key={m.id} style={{ display: "contents" }}>
                <MessageRow m={m} g={g} showName={showName} />
                {reaction && g >= reaction.at && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingRight: 8,
                      marginTop: -2,
                      opacity: Math.min(1, (g - reaction.at) / 4),
                      transform: `scale(${
                        0.86 +
                        0.14 *
                          spring({
                            frame: Math.max(0, g - reaction.at),
                            fps: 60,
                            config: { damping: 12, stiffness: 200 },
                            durationInFrames: 18,
                          })
                      })`,
                      transformOrigin: "100% 0%",
                    }}
                  >
                    <Meme
                      slug={SLUG}
                      file={reaction.meme.file}
                      width={reaction.meme.width}
                      height={reaction.meme.height}
                      style={{ position: "relative", width: reaction.width }}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {typing && <TypingRow g={g} from={typing.typingFrom as number} />}
        </div>

        <ChatInput />
      </AbsoluteFill>

      {/* the freeze flash when the server dies */}
      {g >= 840 && g < 852 && (
        <AbsoluteFill
          style={{
            backgroundColor: C.red,
            opacity: 0.26 * (1 - (g - 840) / 12),
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
