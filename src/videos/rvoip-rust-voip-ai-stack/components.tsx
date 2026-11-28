import {
  AbsoluteFill,
  Img,
  Loop,
  OffthreadVideo,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import {
  AMBER,
  COLD,
  CONTENT_W,
  GREEN,
  INK,
  MOODS,
  RED,
  SAFE,
  STEEL,
  VIOLET,
  WHITE,
  WARM,
  easeOut,
  formatNumber,
  getShake,
  impulse,
  moodAt,
  mono,
  readCounter,
  sans,
  serif,
  serifItalic,
  type Mood,
} from "./theme";
import { videoAsset } from "../../kit";

const SLUG = "rvoip-rust-voip-ai-stack";

// ---------------------------------------------------------------------------
// The world. Every shot is full-bleed real footage or a photo, always moving:
// a slow push, a drift and a hand-held shake that grows with the story's speed.
// ---------------------------------------------------------------------------

export type WorldProps = {
  kind: "video" | "photo";
  src: string;
  shotLen: number;
  mood: Mood;
  shake: number;
  trimBefore?: number;
  rate?: number;
  position?: string;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  cropTop?: boolean;
  dim?: number;
  impulseAt?: number;
  impulsePower?: number;
};

export const World: React.FC<WorldProps> = ({
  kind,
  src,
  shotLen,
  mood,
  shake,
  trimBefore = 0,
  rate = 0.92,
  position = "50% 50%",
  zoomFrom = 1.12,
  zoomTo = 1.22,
  panX = 0,
  panY = 0,
  cropTop = false,
  dim = 0.1,
  impulseAt,
  impulsePower = 0,
}) => {
  const frame = useCurrentFrame();
  const style = MOODS[mood];
  const p = shotLen <= 1 ? 1 : frame / (shotLen - 1);
  const zoom = interpolate(frame, [0, Math.max(1, shotLen)], [zoomFrom, zoomTo], {
    extrapolateRight: "clamp",
  });
  const amp = shake + impulse(frame, impulseAt ?? -9999, impulsePower);
  const s = getShake(frame, amp);
  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    objectPosition: position,
    filter: style.filter,
    ...(cropTop
      ? { transform: "scale(2.02)", transformOrigin: "50% 8%" }
      : {}),
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: INK }}>
      <AbsoluteFill
        style={{
          transform: `translate(${s.x + panX * p}px, ${s.y + panY * p}px) rotate(${s.rot}deg) scale(${zoom})`,
        }}
      >
        {kind === "video" ? (
          <Loop durationInFrames={shotLen}>
            <OffthreadVideo
              src={videoAsset(SLUG, src)}
              muted
              trimBefore={trimBefore}
              playbackRate={rate}
              style={mediaStyle}
            />
          </Loop>
        ) : (
          <Img src={videoAsset(SLUG, src)} style={mediaStyle} />
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: style.wash }} />
      <AbsoluteFill style={{ background: `rgba(2,5,9,${dim})` }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Global atmosphere: a vignette, readability scrims, drifting data ticks and a
// slow scan line. They sit over the worlds, under the words.
// ---------------------------------------------------------------------------

export const GlobalAtmosphere: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(2,5,9,0.8) 0%, rgba(2,5,9,0.36) 15%, rgba(2,5,9,0) 33%, rgba(2,5,9,0) 62%, rgba(2,5,9,0.5) 84%, rgba(2,5,9,0.92) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 82% 70% at 50% 47%, rgba(0,0,0,0) 36%, rgba(1,3,6,0.82) 100%)",
      }}
    />
  </AbsoluteFill>
);

export const SimRain: React.FC = () => {
  const f = useCurrentFrame();
  const accent = MOODS[moodAt(f)].accent;
  const ticks = Array.from({ length: 28 }, (_, i) => {
    const x = 20 + random(`rx${i}`) * 1040;
    const len = 24 + random(`rl${i}`) * 96;
    const speed = 0.6 + random(`rs${i}`) * 2.4;
    const off = random(`ro${i}`) * 2400;
    const op = 0.06 + random(`ra${i}`) * 0.14;
    const wide = random(`rw${i}`) > 0.86;
    return { x, len, y: ((off + f * speed) % 2500) - 250, op, wide };
  });
  const scanY = ((f * 2.1) % 2500) - 250;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {ticks.map((t, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            width: t.wide ? 3 : 1,
            height: t.len,
            background: accent,
            opacity: t.op,
            borderRadius: 2,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          background: accent,
          opacity: 0.05,
        }}
      />
    </AbsoluteFill>
  );
};

// A live signal trace that reads the same counter as the HUD.
const COUNTER_KEYS: [number, number][] = [
  [0, 0],
  [84, 0],
  [316, 8000],
  [420, 8000],
  [624, 150],
  [843, 150],
  [1212, 150],
  [1402, 8348],
  [1719, 8348],
  [1900, 1204],
  [2188, 1204],
  [2318, 2408],
  [2560, 2408],
  [2580, 1204],
  [3770, 1204],
  [3900, 1],
  [4256, 1],
  [4400, 8348],
  [4720, 8348],
];

export const Waveform: React.FC = () => {
  const f = useCurrentFrame();
  const accent = MOODS[moodAt(f)].accent;
  const now = readCounter(f, COUNTER_KEYS);
  const before = readCounter(Math.max(0, f - 8), COUNTER_KEYS);
  const rate = Math.abs(now - before) / 8;
  const speed = Math.min(1, rate / 22);
  const red = moodAt(f) === "red";
  const amp = 6 + speed * 24 + (red ? 14 : 0);
  const w = CONTENT_W;
  const h = 64;
  const N = 120;
  const phase = f * 0.16;
  const pts = Array.from({ length: N }, (_, i) => {
    const x = (i / (N - 1)) * w;
    const wobble = 0.45 + 0.55 * Math.sin((i / N) * Math.PI);
    const y =
      h / 2 +
      Math.sin((i / N) * 6.3 + phase) * amp * wobble +
      Math.sin((i / N) * 17.4 - f * 0.31) * amp * 0.3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 1168,
        width: w,
        height: h,
        pointerEvents: "none",
        opacity: 0.55,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke={accent} strokeOpacity={0.14} strokeWidth={1} />
        <polyline points={pts} fill="none" stroke={accent} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// The live counter. One continuous instrument across the whole film.
// ---------------------------------------------------------------------------

type HudState = {
  label: string;
  secondary: string;
  unit: string;
  accent: string;
  warn?: boolean;
  shake: number;
};

const stateFor = (f: number): HudState => {
  if (f < 316)
    return { label: "CALLS / SEC · 1 VM", secondary: "1 MÁY ẢO · KHÔNG ASTERISK", unit: "CPS", accent: COLD, shake: 3 };
  if (f < 624)
    return { label: "CALLS / SEC · ASTERISK", secondary: "BIÊN DỊCH C · NHIỀU FILE", unit: "CPS", accent: STEEL, shake: 2 };
  if (f < 843)
    return { label: "CALLS / SEC · ASTERISK", secondary: "FD 1024 · ~150 CUỘC GỌI", unit: "CPS", accent: AMBER, shake: 2 };
  if (f < 1009)
    return { label: "CALLS / SEC · THƯ VIỆN", secondary: "1 CRATE · NHÚNG VÀO APP", unit: "CPS", accent: GREEN, shake: 1.2 };
  if (f < 1212)
    return { label: "CALLS / SEC · THƯ VIỆN", secondary: "KHÔNG SERVER RỜI BÊN CẠNH", unit: "CPS", accent: COLD, shake: 1.4 };
  if (f < 1402)
    return { label: "CALLS / SEC · SIP TLS", secondary: "AWS C8I.4XLARGE · 16 vCPU", unit: "CPS", accent: COLD, shake: 4 };
  if (f < 1719)
    return { label: "CALLS / SEC · SIP TLS", secondary: "32 GiB · p50 1 MS · p99 6 MS", unit: "CPS", accent: COLD, shake: 5 };
  if (f < 1925)
    return { label: "CALLS / SEC · RTP G.711", secondary: "CUỘC GỌI 10 GIÂY", unit: "CPS", accent: AMBER, shake: 3 };
  if (f < 2188)
    return { label: "CALLS / SEC · RTP G.711", secondary: "ĐỒNG THỜI 12.000 · p50 1 MS", unit: "CPS", accent: COLD, shake: 3 };
  if (f < 2318)
    return { label: "CALLS / SEC · HỆ RVOIP", secondary: "TẢI CHUẨN · 1.204 CPS", unit: "CPS", accent: STEEL, shake: 2 };
  if (f < 2580)
    return { label: "TẢI VÀO / SEC · GẤP ĐÔI", secondary: "503 · TỪ CHỐI PHẦN THỪA", unit: "CPS", accent: RED, warn: true, shake: 7 };
  if (f < 2720)
    return { label: "CALLS / SEC · HỒI PHỤC", secondary: "VỀ LẠI 1.204 CPS", unit: "CPS", accent: AMBER, shake: 2 };
  if (f < 2984)
    return { label: "CALLS / SEC · 1 CALL MODEL", secondary: "SIP · WEBRTC · SRTP", unit: "CPS", accent: VIOLET, shake: 4.5 };
  if (f < 3247)
    return { label: "CALLS / SEC · 1 CALL MODEL", secondary: "VAPI · WEBSOCKET 2 CHIỀU", unit: "CPS", accent: VIOLET, shake: 4 };
  if (f < 3508)
    return { label: "CALLS / SEC · 4 API", secondary: "4 TẦNG API · RUST SDK", unit: "CPS", accent: AMBER, shake: 2 };
  if (f < 3770)
    return { label: "CALLS / SEC · 4 API", secondary: "SIP BETA · WEBRTC PREVIEW", unit: "CPS", accent: STEEL, shake: 1.8 };
  if (f < 4256)
    return { label: "CUỘC GỌI · LOCAL", secondary: "CLONE · CARGO RUN", unit: "CUỘC", accent: GREEN, shake: 1 };
  if (f < 4428)
    return { label: "CALLS / SEC · SIP TLS", secondary: "ĐỒNG THỜI 12.000", unit: "CPS", accent: WARM, shake: 3 };
  return { label: "CALLS / SEC · SIP TLS", secondary: "12.000 ĐỒNG THỜI · 1 VM", unit: "CPS", accent: COLD, shake: 3.5 };
};

const CARD_STARTS = [0, 843, 2720, 3770];
export const CARD_LEN = 66;

const hudOpacity = (f: number) => {
  let o = 1;
  for (const s of CARD_STARTS) {
    if (f >= s - 6 && f < s + CARD_LEN) {
      o = Math.min(o, interpolate(f, [s - 6, s], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    } else if (f >= s + CARD_LEN && f < s + CARD_LEN + 12) {
      o = Math.min(o, interpolate(f, [s + CARD_LEN, s + CARD_LEN + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    }
  }
  return o;
};

export const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const state = stateFor(f);
  const value = formatNumber(readCounter(f, COUNTER_KEYS));
  const opacity = hudOpacity(f);
  if (opacity <= 0) return null;
  const s = getShake(f, state.shake * 0.14);
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top + 94,
        left: SAFE.left,
        right: SAFE.right,
        textAlign: "center",
        opacity,
        transform: `translate(${s.x}px, ${s.y}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: mono,
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: 4.5,
          color: "rgba(238,244,247,0.82)",
          whiteSpace: "nowrap",
          textShadow: "0 2px 14px rgba(0,0,0,0.95)",
        }}
      >
        {state.label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 16,
          marginTop: 2,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 166,
            fontWeight: 700,
            letterSpacing: -5,
            lineHeight: 1.02,
            fontVariantNumeric: "tabular-nums",
            color: state.warn ? "#FFE0DA" : WHITE,
            textShadow: state.warn
              ? "0 0 34px rgba(255,81,64,0.55), 0 3px 22px rgba(0,0,0,0.95)"
              : "0 3px 26px rgba(0,0,0,0.92)",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: mono,
            fontSize: 42,
            fontWeight: 500,
            letterSpacing: 3,
            color: state.accent,
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
          }}
        >
          {state.unit}
        </span>
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 36,
          fontWeight: 400,
          letterSpacing: 1.5,
          color: state.warn ? "rgba(255,178,168,0.92)" : "rgba(238,244,247,0.64)",
          whiteSpace: "nowrap",
          marginTop: 8,
          textShadow: "0 2px 14px rgba(0,0,0,0.95)",
        }}
      >
        {state.secondary}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// One short serif italic line per beat, centred low.
// ---------------------------------------------------------------------------

type Sub = { from: number; to: number; text: string };

export const SUBTITLES: Sub[] = [
  { from: 66, to: 316, text: "Một máy ảo, hơn 8.000 cuộc gọi mỗi giây?" },
  { from: 316, to: 624, text: "Asterisk: biên dịch C, hàng loạt file cấu hình." },
  { from: 624, to: 843, text: "Mặc định chỉ chịu khoảng 150 cuộc gọi SIP." },
  { from: 909, to: 1009, text: "rvoip là thư viện VoIP thuần Rust." },
  { from: 1009, to: 1212, text: "Nhúng thẳng vào code ứng dụng." },
  { from: 1212, to: 1402, text: "Máy ảo 16 vCPU, 32 GiB RAM." },
  { from: 1402, to: 1719, text: "8.348 CPS báo hiệu SIP qua TLS." },
  { from: 1719, to: 1925, text: "RTP G.711, mỗi cuộc gọi 10 giây." },
  { from: 1925, to: 2188, text: "12.000 cuộc gọi đồng thời, thiết lập 1 ms." },
  { from: 2188, to: 2318, text: "Tải gấp đôi công suất tối đa." },
  { from: 2318, to: 2580, text: "Phần thừa bị từ chối ngay bằng 503." },
  { from: 2580, to: 2720, text: "Giảm tải là hồi phục sạch." },
  { from: 2786, to: 2984, text: "SIP, WebRTC và SRTP chung một call model." },
  { from: 2984, to: 3247, text: "Adapter WebSocket cho AI agent Vapi." },
  { from: 3247, to: 3508, text: "Bốn tầng API cho Rustacean." },
  { from: 3508, to: 3770, text: "SIP beta; WebRTC và AI còn preview." },
  { from: 3836, to: 4256, text: "Clone repo, gọi thử ngay trên máy." },
  { from: 4256, to: 4428, text: "Lưu video, tự host thử trên VPS." },
  { from: 4428, to: 4720, text: "Theo dõi kênh để cập nhật công nghệ mới." },
];

export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const sub = SUBTITLES.find((s) => f >= s.from && f < s.to);
  if (!sub) return null;
  const p = interpolate(f, [sub.from, sub.from + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: SAFE.bottom + 30,
        left: SAFE.left,
        right: SAFE.right,
        textAlign: "center",
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          display: "inline-block",
          maxWidth: CONTENT_W - 16,
          fontFamily: serifItalic,
          fontStyle: "italic",
          fontSize: 54,
          fontWeight: 500,
          lineHeight: 1.3,
          letterSpacing: 0.1,
          color: "#F8F2E8",
          textWrap: "balance",
          textShadow:
            "0 3px 22px rgba(0,0,0,0.95), 0 1px 5px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.75)",
        }}
      >
        {sub.text}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Credits, small in a corner and changing with every shot.
// ---------------------------------------------------------------------------

type Credit = { from: number; to: number; text: string; side: "left" | "right" };

export const CREDITS: Credit[] = [
  { from: 0, to: 316, text: "Pixabay · cipnt", side: "right" },
  { from: 316, to: 624, text: "Pixabay · voltamax", side: "left" },
  { from: 624, to: 843, text: "Pixabay · Mabelle-Elise", side: "left" },
  { from: 843, to: 1009, text: "Pixabay · nanoslavic", side: "left" },
  { from: 1009, to: 1212, text: "Pixabay · doktorkleinmusic", side: "left" },
  { from: 1212, to: 1402, text: "Pixabay · MozoMozo", side: "left" },
  { from: 1402, to: 1719, text: "Pixabay · cipnt", side: "left" },
  { from: 1719, to: 1925, text: "Pixabay · mephala1980", side: "left" },
  { from: 1925, to: 2188, text: "Pixabay · cipnt", side: "left" },
  { from: 2188, to: 2318, text: "Pixabay · cipnt", side: "left" },
  { from: 2318, to: 2580, text: "Pixabay · TBIT", side: "left" },
  { from: 2580, to: 2720, text: "Pixabay · cipnt", side: "left" },
  { from: 2720, to: 2853, text: "Pixabay · doktorkleinmusic", side: "left" },
  { from: 2853, to: 2984, text: "Pixabay · MozoMozo", side: "left" },
  { from: 2984, to: 3115, text: "Pixabay · doktorkleinmusic", side: "left" },
  { from: 3115, to: 3247, text: "Pixabay · MozoMozo", side: "left" },
  { from: 3247, to: 3508, text: "Pixabay · blickpixel", side: "left" },
  { from: 3508, to: 3639, text: "Pixabay · voltamax", side: "left" },
  { from: 3639, to: 3770, text: "Pixabay · Coverr", side: "left" },
  { from: 3770, to: 4256, text: "Pixabay · voltamax", side: "left" },
  { from: 4256, to: 4428, text: "Pixabay · cipnt", side: "left" },
  { from: 4428, to: 4720, text: "Pixabay · doktorkleinmusic", side: "left" },
];

export const Credits: React.FC = () => {
  const f = useCurrentFrame();
  const c = CREDITS.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  const p = interpolate(f, [c.from, c.from + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: SAFE.top + 6,
        ...(c.side === "left" ? { left: SAFE.left } : { right: SAFE.right }),
        opacity: p * 0.6,
        fontFamily: sans,
        fontSize: 34,
        fontWeight: 500,
        letterSpacing: 0.6,
        color: "#FFFFFF",
        textShadow: "0 1px 8px rgba(0,0,0,0.95)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {c.text}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Chapter title cards: four cuts to black-ish, big serif, no panel.
// ---------------------------------------------------------------------------

export const ChapterCard: React.FC<{ start: number; numeral: string; title: string; accent: string; drop?: boolean }> = ({
  start,
  numeral,
  title,
  accent,
  drop = false,
}) => {
  const f = useCurrentFrame();
  const local = f - start;
  if (local < 0 || local >= CARD_LEN) return null;
  const env = interpolate(local, [0, 8, CARD_LEN - 12, CARD_LEN], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p = interpolate(local, [4, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const numP = interpolate(local, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const flash = drop ? interpolate(local, [0, 7], [0.42, 0], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          opacity: env,
          background:
            "radial-gradient(ellipse 74% 54% at 50% 46%, rgba(2,5,9,0.78) 0%, rgba(2,5,9,0.56) 58%, rgba(2,5,9,0.4) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 250,
          paddingLeft: SAFE.left,
          paddingRight: SAFE.right,
          boxSizing: "border-box",
          opacity: env,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 42,
            fontWeight: 500,
            letterSpacing: 8,
            color: accent,
            opacity: numP * 0.95,
            textShadow: "0 2px 16px rgba(0,0,0,0.9)",
          }}
        >
          {numeral}
        </div>
        <div
          style={{
            width: 96 * numP,
            height: 1,
            background: accent,
            opacity: 0.55 * numP,
            margin: "22px 0 26px",
          }}
        />
        <div
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 110,
            lineHeight: 1.02,
            letterSpacing: 1,
            color: "#F7F2E9",
            opacity: p,
            transform: `translateY(${(1 - p) * 26}px) scale(${1.04 - p * 0.04})`,
            textShadow: "0 8px 50px rgba(0,0,0,0.9)",
            textAlign: "center",
          }}
        >
          {title}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#FFF7EC", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// The overload moment: a red 503 field plus one huge refusal.
// ---------------------------------------------------------------------------

export const FailureField: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 10, len - 14, len], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const items = Array.from({ length: 34 }, (_, i) => {
    const x = 103 + random(`fx${i}`) * 620;
    const y0 = random(`fy${i}`) * 600;
    const speed = 0.5 + random(`fs${i}`) * 2.1;
    const size = 34 + Math.floor(random(`fz${i}`) * 18);
    const op = 0.1 + random(`fo${i}`) * 0.24;
    return { x, y: 594 + ((y0 + f * speed) % 590), size, op };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: fade }}>
      {items.map((t, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: t.x,
            top: t.y,
            fontFamily: mono,
            fontSize: t.size,
            fontWeight: 500,
            color: `rgba(255,81,64,${t.op})`,
            textShadow: "0 0 18px rgba(255,40,20,0.35)",
          }}
        >
          503
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const Big503: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 5], [0, 1], { extrapolateRight: "clamp", easing: easeOut });
  const fade = interpolate(f, [80, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", justifyContent: "center", alignItems: "center", opacity: fade, paddingBottom: 180 }}>
      <div
        style={{
          fontFamily: mono,
          fontSize: 300,
          fontWeight: 700,
          letterSpacing: -12,
          color: "rgba(255,86,68,0.9)",
          opacity: p,
          transform: `scale(${1.18 - p * 0.18})`,
          textShadow: "0 0 80px rgba(255,40,20,0.55), 0 12px 60px rgba(0,0,0,0.8)",
        }}
      >
        503
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Brand and closing fades.
// ---------------------------------------------------------------------------

export const EndFade: React.FC = () => {
  const f = useCurrentFrame();
  const start = interpolate(f, [0, 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const end = interpolate(f, [4692, 4719], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = Math.max(start, end);
  if (o <= 0) return null;
  return <AbsoluteFill style={{ backgroundColor: "#02050A", opacity: o, pointerEvents: "none" }} />;
};

// Colours re-exported for scenes to use without another import.
export const PALETTE = { COLD, GREEN, AMBER, RED, VIOLET, STEEL, WHITE };
