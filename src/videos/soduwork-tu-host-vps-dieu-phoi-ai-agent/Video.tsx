// What-if simulation, seen through the viewer's eyes: a request crossing a team
// of agents, cut as a flight through the machine. One live instrument reads
// harnesses, stars and sign-offs; one serif line of subtitle carries the voice.
// Footage and photos fill the frame and never stop moving; the colour goes from
// cold blue high up, through warm brass, to red when the beta bites.
import { loadFont } from "@remotion/google-fonts/Lora";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import React from "react";
import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
} from "remotion";
import {
  Brand,
  BRAND_SPACE,
  FPS,
  Music,
  SAFE,
  Sfx,
  TikTokGuide,
  Voice,
  beatmap,
  buildUp,
  easeOut,
  hit,
  sectionAt,
  videoAsset,
  whip,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { Terminal, TYPE_DELAY, typingFrames } from "./Terminal";
import beatmapJson from "./beatmap.json";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const MAP = beatmap(beatmapJson);

const serif = loadFont("italic", { weights: ["500"], subsets: ["latin", "vietnamese"] })
  .fontFamily;
const serifTitle = loadFont("normal", { weights: ["600"], subsets: ["latin", "vietnamese"] })
  .fontFamily;

const C = {
  ink: "#060A12",
  paper: "#F3F0EA",
  ice: "#CFE2F7",
  steel: "#8FB0D8",
  dify: "#2A5BFF",
  brass: "#C9965C",
  ember: "#E4743F",
  alert: "#FF4438",
  pass: "#7CD9A6",
};

type Id = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8" | "s9" | "s10" | "s11";
const IDS: Id[] = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11"];
const TL = timeline.scenes as Record<Id, { start: number; length: number }>;
const LEN = (id: Id) => Math.round(TL[id].length * FPS);
const START = (() => {
  const out = {} as Record<Id, number>;
  let at = 0;
  for (const id of IDS) {
    out[id] = at;
    at += LEN(id);
  }
  return out;
})();
const TOTAL = IDS.reduce((n, id) => n + LEN(id), 0);

// Transitions shorten the timeline, so each scene before one carries its frames.
const TRANS: Partial<Record<Id, number>> = { s1: 10, s2: 12, s7: 8, s10: 10 };
const SEQ_LEN = (id: Id) => LEN(id) + (TRANS[id] ?? 0);

const scene = (id: Id) =>
  (script.scenes as { id: string; headline: string; lines: string[]; commands: string[] }[]).find(
    (s) => s.id === id,
  )!;

// ---------------------------------------------------------------------------
// The live counter: one value curve per reading, eased, with steady formatting.

const smooth = (t: number) => t * t * (3 - 2 * t);
const keyVal = (keys: [number, number][], f: number) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f0, v0] = keys[i - 1];
    const [f1, v1] = keys[i];
    if (f <= f1) return v0 + (v1 - v0) * smooth((f - f0) / Math.max(1, f1 - f0));
  }
  return keys[keys.length - 1][1];
};

const HARNESS_KEYS: [number, number][] = [
  [0, 0],
  [START.s3 + 32, 0],
  [START.s3 + 78, 1],
  [START.s5 + 70, 1],
  [START.s5 + 150, 2],
  [START.s7 + 30, 2],
  [START.s7 + 92, 9],
];
const STAR_KEYS: [number, number][] = [
  [START.s2, 0],
  [START.s2 + 150, 161593],
];
const SIGN_KEYS: [number, number][] = [
  [START.s4, 0],
  [START.s4 + 112, 0],
  [START.s4 + 126, 1],
];

const pad2 = (n: number) => String(Math.max(0, Math.round(n))).padStart(2, "0");
const padStars = (n: number) => {
  const s = String(Math.max(0, Math.round(n))).padStart(6, "0");
  return `${s.slice(0, 3)}.${s.slice(3)}`;
};

const sceneAt = (gf: number) => {
  let id: Id = "s1";
  for (const k of IDS) if (gf >= START[k]) id = k;
  return { id, local: gf - START[id] };
};

const hudLine = (id: Id, local: number, gf: number) => {
  switch (id) {
    case "s1":
      return { text: "SIGN-OFFS 00 · HUMAN", tone: C.ice };
    case "s2":
      return { text: `DIFY · STARS ${padStars(keyVal(STAR_KEYS, gf))}`, tone: C.ice };
    case "s3":
      return { text: "SODUWORK · JAVASCRIPT · MIT", tone: C.paper };
    case "s4": {
      const v = Math.round(keyVal(SIGN_KEYS, gf));
      return { text: `SIGN-OFFS ${pad2(v)} · HUMAN`, tone: v > 0 ? C.pass : C.paper };
    }
    case "s5":
      if (local < 190) return { text: "REVIEW · OPENCODE", tone: C.steel };
      if (local < 300) return { text: "REVIEW · FAIL · RETURN", tone: C.alert };
      return { text: "REVIEW · PASS", tone: C.pass };
    case "s6":
      return { text: "AUTO-HANDOFF · OFF", tone: C.brass };
    case "s7":
      return { text: "HISTORY KEPT · MID-CHAT", tone: C.ice };
    case "s8":
      return { text: "PLUGINS 01 · TEAM", tone: C.brass };
    case "s9":
      return { text: "SERVICES 03 · COMMANDS 02", tone: C.ice };
    case "s10":
      return { text: "PUBLIC BETA · SELF-HOST", tone: C.alert };
    case "s11":
      return local < 226
        ? { text: "SODUWORK · STARS 006.095", tone: C.paper }
        : { text: "SIGN-OFFS 01 · HUMAN", tone: C.pass };
  }
};

// ---------------------------------------------------------------------------
// Media. Every shot is a full-frame piece of the world, cropped and graded.

type VideoMedia = {
  kind: "video";
  file: string;
  dur: number;
  pos?: string;
  at?: number;
  credit: string;
};
type PhotoMedia = { kind: "photo"; file: string; pos?: string; credit: string };
type Media = VideoMedia | PhotoMedia;
type Shot = { at: number; media: Media; dir: 1 | -1 };

const V = (
  file: string,
  dur: number,
  credit: string,
  pos?: string,
  at?: number,
): VideoMedia => ({ kind: "video", file, dur, credit, pos, at });
const P = (file: string, credit: string, pos?: string): PhotoMedia => ({
  kind: "photo",
  file,
  credit,
  pos,
});

const FOOT = {
  monitor: (pos?: string, at?: number) =>
    V("footage/developer-looking-at-monitor-pixabay-1210.mp4", 10, "PIXABAY · TBIT", pos, at),
  code: (pos?: string, at?: number) =>
    V("footage/programming-code-screen-pixabay-348042.mp4", 10, "PIXABAY · doktorkleinmusic", pos, at),
  data: (pos?: string, at?: number) =>
    V("footage/data-center-servers-pixabay-4001.mp4", 30, "PIXABAY · FindingFootage", pos, at),
  robot: (pos?: string, at?: number) =>
    V("footage/robot-arm-working-pixabay-160974.mp4", 18, "PIXABAY · Dimitri_K", pos, at),
  servers: (pos?: string, at?: number) =>
    V("footage/server-room-datacenter-racks-pixabay-171185.mp4", 21, "PIXABAY · MozoMozo", pos, at),
  collab: (pos?: string, at?: number) =>
    V("footage/colleagues-collaborating-tech-office-pixabay-183107.mp4", 17, "PIXABAY · riaz-baloch", pos, at),
  team: (pos?: string, at?: number) =>
    V("footage/team-working-office-laptops-pixabay-268230.mp4", 12, "PIXABAY · isuruzampa", pos, at),
  hands: (pos?: string, at?: number) =>
    V("footage/hands-typing-keyboard-dark-pixabay-3174.mp4", 12, "PIXABAY · Coverr", pos, at),
  fiber: (pos?: string, at?: number) =>
    V("footage/fiber-optic-cables-light-pixabay-278840.mp4", 10, "PIXABAY · doktorkleinmusic", pos, at),
};
const PIC = {
  circuit: (pos?: string) => P("images/circuit-board-macro-blue-pixabay-4199160.jpg", "PIXABAY · guypracy", pos),
  sign: (pos?: string) => P("images/signing-document-close-up-pixabay-2654081.jpg", "PIXABAY · AbsolutVision", pos),
  hand: (pos?: string) => P("images/business-handshake-pixabay-10222194.jpg", "PIXABAY · ZaidAysh_Graphix", pos),
  gears: (pos?: string) => P("images/gears-mechanism-macro-pixabay-4651185.jpg", "PIXABAY · Holedulidu", pos),
};

const SHOTS: Record<Id, Shot[]> = {
  s1: [
    { at: 0, media: FOOT.monitor("50% 50%", 0.5), dir: 1 },
    { at: 100, media: FOOT.monitor("44% 48%", 4), dir: -1 },
    { at: 231, media: FOOT.monitor("56% 50%", 7), dir: 1 },
  ],
  s2: [
    { at: 0, media: FOOT.code("50% 32%", 0.3), dir: 1 },
    { at: 42, media: FOOT.code("50% 60%", 3.5), dir: -1 },
    { at: 173, media: FOOT.fiber("50% 50%", 2), dir: 1 },
    { at: 304, media: FOOT.code("50% 40%", 7), dir: -1 },
  ],
  s3: [
    { at: 0, media: PIC.circuit("50% 45%"), dir: 1 },
    { at: 35, media: FOOT.fiber("50% 50%", 1), dir: -1 },
    { at: 166, media: FOOT.fiber("50% 50%", 5), dir: 1 },
    { at: 297, media: PIC.circuit("50% 60%"), dir: -1 },
  ],
  s4: [
    { at: 0, media: PIC.sign("50% 38%"), dir: 1 },
    { at: 26, media: PIC.sign("50% 55%"), dir: -1 },
    { at: 158, media: PIC.sign("50% 70%"), dir: 1 },
  ],
  s5: [
    { at: 0, media: FOOT.robot("50% 50%", 2), dir: 1 },
    { at: 133, media: FOOT.code("50% 50%", 2), dir: -1 },
    { at: 264, media: FOOT.robot("45% 50%", 9), dir: 1 },
  ],
  s6: [
    { at: 0, media: FOOT.collab("50% 45%", 3), dir: 1 },
    { at: 30, media: FOOT.team("50% 50%", 2), dir: -1 },
    { at: 161, media: FOOT.collab("45% 50%", 9), dir: 1 },
    { at: 292, media: FOOT.team("55% 50%", 7), dir: -1 },
  ],
  s7: [
    { at: 0, media: FOOT.servers("50% 40%", 3), dir: 1 },
    { at: 40, media: FOOT.servers("50% 60%", 8), dir: -1 },
    { at: 171, media: FOOT.servers("50% 50%", 16), dir: 1 },
    { at: 302, media: FOOT.servers("50% 45%", 13), dir: -1 },
  ],
  s8: [
    { at: 0, media: PIC.gears("50% 45%"), dir: 1 },
    { at: 121, media: PIC.gears("50% 62%"), dir: -1 },
    { at: 250, media: PIC.hand("50% 50%"), dir: 1 },
  ],
  s9: [
    { at: 0, media: FOOT.servers("50% 50%", 5), dir: 1 },
    { at: 141, media: FOOT.servers("50% 35%", 11), dir: -1 },
    { at: 272, media: FOOT.servers("50% 50%", 16), dir: 1 },
  ],
  s10: [
    { at: 0, media: FOOT.hands("50% 50%", 1), dir: 1 },
    { at: 134, media: FOOT.code("50% 50%", 5), dir: -1 },
    { at: 265, media: FOOT.hands("45% 50%", 6), dir: 1 },
    { at: 396, media: PIC.circuit("50% 55%"), dir: -1 },
  ],
  s11: [
    { at: 0, media: FOOT.monitor("50% 50%", 0.2), dir: 1 },
    { at: 89, media: FOOT.team("50% 50%", 4), dir: -1 },
    { at: 220, media: PIC.hand("50% 45%"), dir: 1 },
    { at: 351, media: PIC.sign("50% 55%"), dir: -1 },
  ],
};

const shotAt = (id: Id, f: number) => {
  const list = SHOTS[id];
  let cur = list[0];
  for (const s of list) if (f >= s.at) cur = s;
  return cur;
};
const shotLen = (id: Id, s: Shot) => {
  const list = SHOTS[id];
  const i = list.indexOf(s);
  return (i + 1 < list.length ? list[i + 1].at : LEN(id)) - s.at;
};

// ---------------------------------------------------------------------------
// Grade: cold blue high, brass and paper lower, red when it goes wrong.

type Grade = { filter: string; tint: string; tintOpacity: number; wash: string };
const GRADES: Record<Id, Grade> = {
  s1: {
    filter: "saturate(0.55) contrast(1.18) brightness(0.6) hue-rotate(-12deg)",
    tint: "#1B3A66",
    tintOpacity: 0.5,
    wash: "linear-gradient(180deg, rgba(5,10,22,0.72), rgba(3,7,14,0.18) 45%, rgba(3,6,12,0.78))",
  },
  s2: {
    filter: "saturate(0.75) contrast(1.12) brightness(0.68) hue-rotate(-18deg)",
    tint: "#21408F",
    tintOpacity: 0.48,
    wash: "linear-gradient(180deg, rgba(4,9,24,0.68), rgba(8,20,60,0.18) 50%, rgba(3,7,18,0.8))",
  },
  s3: {
    filter: "saturate(0.85) contrast(1.12) brightness(0.76) hue-rotate(-6deg)",
    tint: "#3E6E9E",
    tintOpacity: 0.44,
    wash: "linear-gradient(180deg, rgba(6,14,28,0.6), rgba(20,52,84,0.14) 52%, rgba(4,10,20,0.78))",
  },
  s4: {
    filter: "sepia(0.24) saturate(0.92) contrast(1.06) brightness(0.78)",
    tint: "#B07A44",
    tintOpacity: 0.42,
    wash: "linear-gradient(180deg, rgba(20,12,8,0.58), rgba(120,80,40,0.16) 48%, rgba(14,9,6,0.8))",
  },
  s5: {
    filter: "saturate(0.8) contrast(1.16) brightness(0.7)",
    tint: "#2E5A85",
    tintOpacity: 0.46,
    wash: "linear-gradient(180deg, rgba(4,10,20,0.66), rgba(30,70,110,0.14) 50%, rgba(3,8,16,0.8))",
  },
  s6: {
    filter: "sepia(0.16) saturate(1.06) contrast(1.06) brightness(0.76)",
    tint: "#9A5E36",
    tintOpacity: 0.4,
    wash: "linear-gradient(180deg, rgba(16,10,7,0.6), rgba(130,80,42,0.16) 50%, rgba(12,8,5,0.8))",
  },
  s7: {
    filter: "saturate(0.7) contrast(1.16) brightness(0.66) hue-rotate(-10deg)",
    tint: "#1E4A78",
    tintOpacity: 0.52,
    wash: "linear-gradient(180deg, rgba(3,8,18,0.7), rgba(20,60,100,0.14) 50%, rgba(2,6,14,0.82))",
  },
  s8: {
    filter: "sepia(0.34) saturate(1.08) contrast(1.05) brightness(0.78)",
    tint: "#A8743F",
    tintOpacity: 0.44,
    wash: "linear-gradient(180deg, rgba(18,11,7,0.6), rgba(140,92,46,0.16) 48%, rgba(12,8,5,0.82))",
  },
  s9: {
    filter: "saturate(0.7) contrast(1.12) brightness(0.64) hue-rotate(-8deg)",
    tint: "#123A5E",
    tintOpacity: 0.54,
    wash: "linear-gradient(180deg, rgba(3,8,15,0.72), rgba(12,44,74,0.12) 48%, rgba(2,6,12,0.84))",
  },
  s10: {
    filter: "saturate(0.82) contrast(1.16) brightness(0.6) hue-rotate(-12deg)",
    tint: "#7A2E20",
    tintOpacity: 0.5,
    wash: "linear-gradient(180deg, rgba(18,6,5,0.72), rgba(120,34,22,0.16) 48%, rgba(12,4,4,0.84))",
  },
  s11: {
    filter: "sepia(0.2) saturate(1.02) contrast(1.05) brightness(0.78)",
    tint: "#9E6438",
    tintOpacity: 0.4,
    wash: "linear-gradient(180deg, rgba(16,10,6,0.6), rgba(140,90,50,0.14) 50%, rgba(10,7,4,0.8))",
  },
};

// ---------------------------------------------------------------------------
// Small shared parts.

const Credit: React.FC<{ text: string; f: number }> = ({ text, f }) => {
  const o = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        right: SAFE.right,
        top: SAFE.top + 6,
        fontFamily: "monospace",
        fontSize: 34,
        letterSpacing: 1,
        color: `rgba(235,244,255,${0.6 * o})`,
        textShadow: "0 2px 14px rgba(0,0,0,0.9)",
        textAlign: "right",
      }}
    >
      {text}
    </div>
  );
};

const ChapterCard: React.FC<{ n: number; title: string; f: number; dur: number }> = ({
  n,
  title,
  f,
  dur,
}) => {
  const pin = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const pout = interpolate(f, [dur - 16, dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const o = Math.min(pin, pout);
  const size = Math.min(118, Math.floor(760 / (title.length * 0.6)));
  const rule = interpolate(f, [8, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 62% 40% at 50% 50%, rgba(3,7,14,0.62), rgba(3,7,14,0.1) 70%, transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          top: 830,
          textAlign: "center",
          transform: `translateY(${(1 - pin) * 22}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 36,
            letterSpacing: 8,
            color: C.steel,
          }}
        >
          CHƯƠNG {String(n).padStart(2, "0")}
        </div>
        <div
          style={{
            fontFamily: serifTitle,
            fontSize: size,
            lineHeight: 1.08,
            color: C.paper,
            marginTop: 12,
            textShadow: "0 4px 40px rgba(0,0,0,0.75)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            height: 1,
            width: 300 * rule,
            margin: "28px auto 0",
            background: "rgba(225,238,255,0.62)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// One short serif line per story beat, centred low.
const SUBS: Record<Id, { at: number; text: string }[]> = {
  s1: [
    { at: 55, text: "Chatbot trả lời xong là hết việc" },
    { at: 112, text: "Ai chịu trách nhiệm kiểm tra?" },
    { at: 238, text: "Chatbot xong, ai nghiệm thu?" },
  ],
  s2: [
    { at: 10, text: "Dify dựng pipeline RAG" },
    { at: 82, text: "Workflow AI kéo thả, trực quan" },
    { at: 190, text: "Canvas · RAG · LLMOps" },
    { at: 318, text: "Từ prototype đến production" },
  ],
  s3: [
    { at: 66, text: "SoduWork: engine cho team" },
    { at: 112, text: "Mã nguồn mở JavaScript, MIT" },
    { at: 196, text: "Giao việc và quản trị cho cả đội" },
    { at: 318, text: "Không chỉ là một chatbot" },
  ],
  s4: [
    { at: 10, text: "Yêu cầu gắn sẵn tiêu chí nghiệm thu" },
    { at: 72, text: "Chỉ kết thúc khi người tạo việc ký duyệt" },
    { at: 205, text: "Không dừng ở câu trả lời chatbot" },
  ],
  s5: [
    { at: 70, text: "Pi thực hiện công việc" },
    { at: 104, text: "OpenCode review theo tiêu chuẩn" },
    { at: 176, text: "Model riêng, đối soát độc lập" },
    { at: 280, text: "Review fail: trả lại kèm lý do" },
    { at: 322, text: "Đạt chuẩn mới đi tiếp" },
  ],
  s6: [
    { at: 10, text: "Giao task cho agent đồng nghiệp" },
    { at: 64, text: "Agent làm việc và review" },
    { at: 172, text: "Nhưng không tự ý chuyển việc" },
    { at: 300, text: "Quy trình do người và plugin kiểm soát" },
  ],
  s7: [
    { at: 10, text: "Hỗ trợ 9 harness độc lập" },
    { at: 78, text: "Pi · OpenCode · DeepSeek Harness" },
    { at: 178, text: "Qwen Code · Kimi Code · Codex" },
    { at: 304, text: "Đổi runtime vẫn giữ lịch sử" },
  ],
  s8: [
    { at: 10, text: "Lưu phiên chat thành công thành plugin" },
    { at: 130, text: "Qua review, cả team dùng lại" },
    { at: 256, text: "Một người giỏi, cả đội cùng chạy" },
  ],
  s9: [
    { at: 10, text: "Một server: Hub, console, Postgres" },
    { at: 108, text: "Chỉ cần hai lệnh Python có sẵn" },
    { at: 214, text: "Lệnh hai in mật khẩu admin ban đầu" },
    { at: 312, text: "Docker dựng cả hệ thống trên VPS" },
  ],
  s10: [
    { at: 62, text: "Public Beta: cân nhắc trước production" },
    { at: 158, text: "Lưu API key chưa đủ" },
    { at: 286, text: "Phải thêm chat model thủ công" },
  ],
  s11: [
    { at: 10, text: "Lưu video để tự host trên VPS" },
    { at: 96, text: "Follow kênh để cập nhật công cụ mới" },
    { at: 226, text: "Chatbot trả lời xong, ai nghiệm thu?" },
  ],
};

const Subtitle: React.FC<{ id: Id; f: number }> = ({ id, f }) => {
  const subs = SUBS[id];
  let idx = -1;
  for (let i = 0; i < subs.length; i++) if (f >= subs[i].at) idx = i;
  if (idx < 0) return null;
  const s = subs[idx];
  const end = idx + 1 < subs.length ? subs[idx + 1].at : LEN(id);
  const pin = interpolate(f, [s.at, s.at + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const pout = interpolate(f, [end - 8, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const o = Math.min(pin, pout);
  return (
    <div
      style={{
        position: "absolute",
        left: 200,
        right: 200,
        bottom: SAFE.bottom + 44,
        textAlign: "center",
        opacity: o,
        transform: `translateY(${(1 - pin) * 10}px)`,
      }}
    >
      <div
        style={{
          fontFamily: serif,
          fontStyle: "italic",
          fontSize: 44,
          lineHeight: 1.34,
          color: C.paper,
          textWrap: "balance",
          textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 0 50px rgba(0,0,0,0.55)",
        }}
      >
        {s.text}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// The world: media, camera drift and shake, grade, vignette, scanlines.

const MediaView: React.FC<{ m: Media; p: number; dir: 1 | -1; filter: string }> = ({
  m,
  p,
  dir,
  filter,
}) => {
  const scale =
    m.kind === "photo"
      ? 1.04 + (dir === 1 ? p * 0.09 : (1 - p) * 0.09)
      : 1.015 + (dir === 1 ? p * 0.045 : (1 - p) * 0.045);
  const x = (dir === 1 ? -1 : 1) * p * 26;
  const y = (dir === 1 ? 1 : -1) * p * 14;
  const style: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: m.pos ?? "50% 50%",
    filter,
  };
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}>
      {m.kind === "photo" ? (
        <Img src={videoAsset(SLUG, m.file)} style={style} />
      ) : (
        <OffthreadVideo
          src={videoAsset(SLUG, m.file)}
          muted
          trimBefore={Math.round((m.at ?? 0) * FPS)}
          style={style}
        />
      )}
    </AbsoluteFill>
  );
};

const World: React.FC<{ id: Id; f: number; gf: number; shot: Shot }> = ({ id, f, gf, shot }) => {
  const grade = GRADES[id];
  const p = Math.min(1, Math.max(0, (f - shot.at) / Math.max(1, shotLen(id, shot))));
  const sec = gf <= MAP.sections[0].from ? MAP.sections[0] : sectionAt(MAP, gf);
  const rise = buildUp(MAP, gf, 8);
  const sinceDrop = gf - MAP.drops[0];
  const dropKick = sinceDrop >= 0 && sinceDrop < 40 ? Math.pow(1 - sinceDrop / 40, 2) * 9 : 0;
  const amp = 0.6 + sec.energy * 2.1 + rise * 2.4 + dropKick;
  const dx = Math.sin(gf * 1.7) * amp + Math.sin(gf * 3.3 + 1.2) * amp * 0.35;
  const dy = Math.cos(gf * 1.3 + 0.7) * amp * 0.7;
  const rot = Math.sin(gf * 0.9 + 2) * amp * 0.018;
  const pump =
    sec.energy > 0.6 ? 0.016 * hit(MAP.beats, gf, 9) + 0.018 * hit(MAP.downbeats, gf, 12) : 0;
  const contrast = 1 + rise * 0.16;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${1.07 + pump})` }}>
        <MediaView m={shot.media} p={p} dir={shot.dir} filter={`${grade.filter} contrast(${contrast})`} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{ backgroundColor: grade.tint, opacity: grade.tintOpacity, mixBlendMode: "soft-light" }}
      />
      <AbsoluteFill style={{ background: grade.wash }} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 58% at 50% 42%, transparent 34%, rgba(0,0,0,0.34) 72%, rgba(0,0,0,0.62) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.032) 0px, rgba(255,255,255,0.032) 1px, transparent 1px, transparent 4px)",
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene storytelling layered over the world.

const Signal: React.FC<{ f: number }> = ({ f }) => {
  const p = interpolate(f, [60, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const d =
    "M60 980 L210 980 L244 936 L270 1030 L298 962 L322 980 L468 980 L502 922 L528 1042 L556 950 L582 980 L724 980 L756 942 L782 1014 L806 980 L1020 980";
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.55 * p }}>
      <path
        d={d}
        fill="none"
        stroke={C.ice}
        strokeWidth={2}
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 9px rgba(160,200,255,0.65))" }}
      />
      <path
        d={d}
        fill="none"
        stroke={C.ice}
        strokeWidth={2}
        strokeDasharray="6 15"
        strokeDashoffset={-f * 2.2}
        opacity={0.8}
      />
    </svg>
  );
};

const DifyFlow: React.FC<{ f: number }> = ({ f }) => {
  const nodes = [
    { x: 250, y: 790, label: "WORKFLOW", at: 14 },
    { x: 540, y: 690, label: "RAG", at: 46 },
    { x: 810, y: 860, label: "LLMOPS", at: 78 },
  ];
  const show = (at: number) =>
    interpolate(f, [at, at + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
  const draw = interpolate(f, [24, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path
          d="M250 790 C 360 790, 380 690, 540 690 S 700 860, 810 860"
          fill="none"
          stroke={C.ice}
          strokeWidth={2}
          opacity={0.55}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
        {nodes.map((n, i) => (
          <g key={n.label} opacity={show(n.at)}>
            <circle cx={n.x} cy={n.y} r={16} fill="none" stroke={C.ice} strokeWidth={2} />
            <circle cx={n.x} cy={n.y} r={4} fill={i === 1 ? C.dify : C.paper} />
          </g>
        ))}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.label}
          style={{
            position: "absolute",
            left: n.x,
            top: n.y + 28,
            transform: `translateX(-50%) translateY(${(1 - show(n.at)) * 8}px)`,
            opacity: show(n.at),
            fontFamily: "monospace",
            fontSize: 36,
            letterSpacing: 2,
            color: C.ice,
            textShadow: "0 2px 16px rgba(0,0,0,0.9)",
            whiteSpace: "nowrap",
          }}
        >
          {n.label}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const EngineReveal: React.FC<{ f: number }> = ({ f }) => {
  const p = interpolate(f, [62, 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const rule = interpolate(f, [70, 104], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 646,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      <div style={{ fontFamily: serifTitle, fontSize: 104, lineHeight: 1, color: C.paper }}>
        SoduWork
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 36,
          letterSpacing: 4,
          color: C.steel,
          marginTop: 16,
        }}
      >
        AI-NATIVE ENGINE
      </div>
      <div style={{ height: 1, width: 470 * rule, background: "rgba(225,238,255,0.5)", marginTop: 20 }} />
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 34,
          letterSpacing: 3,
          color: "rgba(238,246,255,0.7)",
          marginTop: 16,
        }}
      >
        MULTI-HARNESS · MULTI-AGENT
      </div>
    </div>
  );
};

const SignHere: React.FC<{ f: number; final?: boolean }> = ({ f, final }) => {
  const at = final ? 360 : 58;
  const draw = interpolate(f, [at, at + 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const check = interpolate(f, [at + 56, at + 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <path
        d="M180 1005 C 235 962, 270 1054, 330 1006 S 420 964, 466 1020 S 550 1062, 612 1002"
        fill="none"
        stroke={C.paper}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.9}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
        style={{ filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.7))" }}
      />
      <g opacity={check} transform={`translate(690 1002) scale(${0.9 + check * 0.1})`}>
        <circle r={36} fill="none" stroke={C.pass} strokeWidth={3} />
        <path d="M-15 2 L-3 15 L17 -14" fill="none" stroke={C.pass} strokeWidth={4} strokeLinecap="round" />
      </g>
    </svg>
  );
};

const DualHarness: React.FC<{ f: number }> = ({ f }) => {
  const p = (at: number) =>
    interpolate(f, [at, at + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
  const state = f < 190 ? "REVIEW" : f < 300 ? "REVIEW FAIL" : "PASS";
  const tone = f < 190 ? C.steel : f < 300 ? C.alert : C.pass;
  const dot =
    f < 130
      ? 210 + 660 * Math.min(1, Math.max(0, (f - 20) / 110))
      : f < 190
        ? 870
        : f < 300
          ? 870 - 660 * Math.min(1, (f - 190) / 100)
          : 680;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: SAFE.left, top: 690, opacity: p(68) }}>
        <div style={{ fontFamily: "monospace", fontSize: 68, letterSpacing: 2, color: C.paper }}>PI</div>
        <div style={{ fontFamily: "monospace", fontSize: 34, letterSpacing: 3, color: C.steel, marginTop: 4 }}>
          DOES THE WORK
        </div>
      </div>
      <div style={{ position: "absolute", right: SAFE.right, top: 690, textAlign: "right", opacity: p(82) }}>
        <div style={{ fontFamily: "monospace", fontSize: 68, letterSpacing: 2, color: C.paper }}>OPENCODE</div>
        <div style={{ fontFamily: "monospace", fontSize: 34, letterSpacing: 3, color: C.steel, marginTop: 4 }}>
          REVIEWS
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 210,
          top: 800,
          width: 660,
          height: 1,
          background: "rgba(225,238,255,0.32)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: dot - 9,
          top: 791,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: tone,
          boxShadow: `0 0 22px ${tone}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: 850,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 64,
          letterSpacing: 4,
          color: tone,
          textShadow: "0 2px 22px rgba(0,0,0,0.9)",
          opacity: p(130),
        }}
      >
        {state}
      </div>
      {f >= 300 && (
        <div
          style={{
            position: "absolute",
            left: 150,
            right: 150,
            top: 938,
            textAlign: "center",
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 36,
            color: C.pass,
            opacity: p(306),
          }}
        >
          kèm lý do khi trả lại
        </div>
      )}
    </AbsoluteFill>
  );
};

const Delegation: React.FC<{ f: number }> = ({ f }) => {
  const p = (at: number) =>
    interpolate(f, [at, at + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
  const dot = 200 + 640 * Math.min(1, Math.max(0, (f - 30) / 150));
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 660,
          fontFamily: "monospace",
          fontSize: 40,
          letterSpacing: 3,
          color: C.paper,
          opacity: p(12),
        }}
      >
        YOU
      </div>
      <div
        style={{
          position: "absolute",
          right: SAFE.right,
          top: 660,
          fontFamily: "monospace",
          fontSize: 40,
          letterSpacing: 3,
          color: C.paper,
          opacity: p(12),
          textAlign: "right",
        }}
      >
        COLLEAGUE
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <line x1={200} y1={742} x2={840} y2={742} stroke={C.alert} strokeWidth={2} strokeDasharray="10 12" opacity={0.55 * p(20)} />
        <g opacity={p(58)} transform="translate(520 742)">
          <line x1={-14} y1={-14} x2={14} y2={14} stroke={C.alert} strokeWidth={3} />
          <line x1={14} y1={-14} x2={-14} y2={14} stroke={C.alert} strokeWidth={3} />
        </g>
        <line x1={200} y1={880} x2={840} y2={880} stroke={C.ice} strokeWidth={2} opacity={0.6} />
        <circle cx={520} cy={880} r={26} fill="none" stroke={C.brass} strokeWidth={3} opacity={p(40)} />
        <circle cx={dot} cy={880} r={8} fill={C.paper} opacity={p(30)} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 360,
          right: 360,
          top: 764,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 34,
          letterSpacing: 3,
          color: C.alert,
          opacity: 0.8 * p(58),
        }}
      >
        AUTO HANDOFF
      </div>
      <div
        style={{
          position: "absolute",
          left: 520,
          top: 948,
          transform: "translateX(-50%)",
          fontFamily: "monospace",
          fontSize: 36,
          letterSpacing: 4,
          color: C.brass,
          opacity: p(40),
        }}
      >
        PLUGIN
      </div>
      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          top: 1020,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 34,
          letterSpacing: 4,
          color: C.pass,
          opacity: p(70),
        }}
      >
        GOVERNED
      </div>
    </AbsoluteFill>
  );
};

const NineHarness: React.FC<{ f: number }> = ({ f }) => {
  const names = [
    "Pi",
    "OpenCode",
    "DeepSeek Harness",
    "Qwen Code",
    "Kimi Code",
    "Codex Harness",
    "Codex",
  ];
  const appear = (i: number) =>
    interpolate(f, [28 + i * 9, 40 + i * 9], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
  const big = interpolate(f, [18, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: SAFE.right,
          top: 690,
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 230,
          lineHeight: 0.9,
          letterSpacing: -8,
          color: C.paper,
          opacity: big * 0.95,
          textShadow: "0 4px 30px rgba(0,0,0,0.6)",
          fontVariantNumeric: "tabular-nums",
          transform: `translateY(${(1 - big) * 16}px)`,
        }}
      >
        09
      </div>
      {names.map((name, i) => {
        const col = i < 4 ? 0 : 1;
        const row = col === 0 ? i : i - 4;
        const o = appear(i);
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: col === 0 ? SAFE.left : 500,
              top: 1010 + row * 56,
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: o,
              transform: `translateX(${(1 - o) * -12}px)`,
              fontFamily: "monospace",
              fontSize: 34,
              letterSpacing: 1,
              color: C.ice,
              whiteSpace: "nowrap",
              textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            }}
          >
            <span style={{ width: 8, height: 8, background: C.brass, display: "inline-block" }} />
            {name}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Plugin: React.FC<{ f: number }> = ({ f }) => {
  const t = interpolate(f, [46, 112], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <AbsoluteFill>
      {[0, 1, 2].map((i) => {
        const w = (330 - i * 48) * (1 - t * 0.8);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 180 + t * 420,
              top: 690 + i * 58 - t * (i * 20),
              width: w,
              height: 8,
              background: C.ice,
              opacity: 0.55 * (1 - t),
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 640,
          width: 150,
          height: 150,
          border: `2px solid rgba(235,245,255,${0.75 * t})`,
          borderRadius: 4,
          opacity: t,
          transform: `scale(${0.92 + t * 0.08})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 68,
            top: 68,
            width: 14,
            height: 14,
            background: C.brass,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 812,
          width: 150,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 34,
          letterSpacing: 2,
          color: C.paper,
          opacity: t,
        }}
      >
        PLUGIN
      </div>
      <div
        style={{
          position: "absolute",
          left: 200,
          right: 200,
          top: 930,
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 34,
          letterSpacing: 4,
          color: C.paper,
          textShadow: "0 2px 18px rgba(0,0,0,0.95)",
          opacity: interpolate(f, [130, 150], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        REVIEWED · REUSABLE
      </div>
    </AbsoluteFill>
  );
};

const Deploy: React.FC<{ f: number }> = ({ f }) => {
  const cmds = scene("s9").commands;
  const p = interpolate(f, [22, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: SAFE.left, top: 640, opacity: p }}>
        <div style={{ fontFamily: "monospace", fontSize: 34, letterSpacing: 4, color: C.ice }}>
          HUB · CONSOLE
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: SAFE.right,
          top: 640,
          fontFamily: "monospace",
          fontSize: 34,
          letterSpacing: 4,
          color: C.ice,
          opacity: p,
          textAlign: "right",
        }}
      >
        POSTGRESQL
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 706,
          width: 777,
          height: 1,
          background: "rgba(225,238,255,0.35)",
          opacity: p,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 748,
          opacity: p,
          transform: `translateY(${(1 - p) * 18}px)`,
        }}
      >
        <Terminal
          cmds={cmds}
          width={777}
          fontSize={34}
          minHeight={240}
          bg="rgba(3,8,15,0.8)"
          fg="#EDF4FF"
          accent={C.brass}
        />
      </div>
    </AbsoluteFill>
  );
};

const Beta: React.FC<{ f: number }> = ({ f }) => {
  const p = interpolate(f, [58, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 714,
          width: 777 * p,
          height: 1,
          background: C.alert,
          opacity: 0.55,
        }}
      />
    </AbsoluteFill>
  );
};

const SceneOverlay: React.FC<{ id: Id; f: number }> = ({ id, f }) => {
  switch (id) {
    case "s1":
      return <Signal f={f} />;
    case "s2":
      return <DifyFlow f={f} />;
    case "s3":
      return <EngineReveal f={f} />;
    case "s4":
      return <SignHere f={f} />;
    case "s5":
      return (
        <>
          <DualHarness f={f} />
          <AbsoluteFill
            style={{
              background: C.alert,
              opacity: f < 190 ? 0 : interpolate(f, [190, 206, 292, 312], [0, 0.22, 0.22, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
          <AbsoluteFill
            style={{
              background: "#EAF3FF",
              opacity:
                f < MAP.drops[0] - START.s5
                  ? 0
                  : interpolate(f, [MAP.drops[0] - START.s5, MAP.drops[0] - START.s5 + 8], [0.6, 0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
            }}
          />
        </>
      );
    case "s6":
      return <Delegation f={f} />;
    case "s7":
      return <NineHarness f={f} />;
    case "s8":
      return <Plugin f={f} />;
    case "s9":
      return <Deploy f={f} />;
    case "s10":
      return <Beta f={f} />;
    case "s11":
      return <SignHere f={f} final />;
    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
// Scenes.

const CARDS: Partial<Record<Id, { n: number; title: string; dur: number }>> = {
  s1: { n: 1, title: "Câu trả lời", dur: 56 },
  s3: { n: 2, title: "Điều phối", dur: 56 },
  s5: { n: 3, title: "Nghiệm thu", dur: 64 },
  s10: { n: 4, title: "Trước khi chạy", dur: 58 },
};

const Scene: React.FC<{ id: Id }> = ({ id }) => {
  const f = useCurrentFrame();
  const gf = START[id] + f;
  const shot = shotAt(id, f);
  const card = CARDS[id];
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <World id={id} f={f} gf={gf} shot={shot} />
      <SceneOverlay id={id} f={f} />
      {card && (f < card.dur ? <ChapterCard n={card.n} title={card.title} f={f} dur={card.dur} /> : null)}
      <Subtitle id={id} f={f} />
      <Credit text={shot.media.credit} f={f - shot.at} />
      {id === "s1" && <Brand />}
      <Voice slug={SLUG} id={id} />
      <Sfx id="whoosh" at={0} volume={0.17} />
      {id === "s1" && <Sfx id="thud" at={0} volume={0.24} />}
      {id === "s3" && <Sfx id="thud" at={0} volume={0.22} />}
      {id === "s5" && <Sfx id="thud" at={Math.max(0, MAP.drops[0] - START.s5)} volume={0.34} />}
      {id === "s4" && <Sfx id="ding" at={140} volume={0.28} />}
      {id === "s5" && <Sfx id="thud" at={196} volume={0.2} />}
      {id === "s5" && <Sfx id="ding" at={304} volume={0.26} />}
      {id === "s7" && [0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Sfx key={i} id="pop" at={30 + i * 9} volume={0.14} />
      ))}
      {id === "s9" && (
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(scene("s9").commands)} volume={0.16} />
      )}
      {id === "s10" && <Sfx id="thud" at={0} volume={0.22} />}
      {id === "s11" && <Sfx id="ding" at={370} volume={0.26} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// The instrument and the frame.

const Hud: React.FC<{ f: number }> = ({ f }) => {
  const { id, local } = sceneAt(f);
  const line = hudLine(id, local, f);
  const harness = keyVal(HARNESS_KEYS, f);
  const rail = f / TOTAL;
  const chapters = [START.s3, START.s5, START.s10].map((x) => x / TOTAL);
  const lineIn = id === "s1" ? 1 : interpolate(local, [0, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + BRAND_SPACE + 38,
        width: 640,
        fontFamily: "monospace",
        color: C.paper,
        textShadow: "0 2px 18px rgba(0,0,0,0.92)",
        opacity: interpolate(f, [0, 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div style={{ fontSize: 34, letterSpacing: 8, color: C.steel }}>HARNESSES</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: 2 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 148,
            lineHeight: 0.86,
            letterSpacing: -4,
            fontVariantNumeric: "tabular-nums",
            color: C.paper,
          }}
        >
          {pad2(harness)}
        </div>
        <div
          style={{
            fontSize: 34,
            letterSpacing: 4,
            color: C.steel,
            paddingBottom: 18,
          }}
        >
          RUNTIME
        </div>
      </div>
      <div style={{ height: 1, width: 430, background: "rgba(225,238,255,0.3)", margin: "16px 0 12px" }} />
      <div style={{ fontSize: 36, letterSpacing: 1, color: line.tone, opacity: lineIn }}>
        {line.text}
      </div>
      <div
        style={{
          position: "relative",
          width: 300,
          height: 2,
          marginTop: 18,
          background: "rgba(225,238,255,0.16)",
        }}
      >
        {chapters.map((c) => (
          <div
            key={c}
            style={{
              position: "absolute",
              left: `${c * 100}%`,
              top: -4,
              width: 1,
              height: 10,
              background: "rgba(225,238,255,0.4)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: `calc(${Math.min(1, rail) * 100}% - 2px)`,
            top: -5,
            width: 5,
            height: 12,
            background: C.paper,
          }}
        />
      </div>
    </div>
  );
};

const Frame: React.FC<VideoProps> = ({ guide }) => {
  const f = useCurrentFrame();
  const ranges: [number, number][] = IDS.map((id) => [
    START[id],
    START[id] + Math.round(durations[id] * FPS),
  ]);
  const fadeIn = interpolate(f, [0, 14], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const seqs: React.ReactNode[] = [];
  IDS.forEach((id, i) => {
    seqs.push(
      <TransitionSeries.Sequence key={id} name={id} durationInFrames={SEQ_LEN(id)}>
        <Scene id={id} />
      </TransitionSeries.Sequence>,
    );
    const t = TRANS[id];
    if (i < IDS.length - 1 && t) {
      const timing = linearTiming({ durationInFrames: t });
      seqs.push(
        id === "s1" ? (
          <TransitionSeries.Transition key={`t-${id}`} presentation={whip(1)} timing={timing} />
        ) : id === "s2" || id === "s7" ? (
          <TransitionSeries.Transition key={`t-${id}`} presentation={whip(-1)} timing={timing} />
        ) : (
          <TransitionSeries.Transition key={`t-${id}`} presentation={fade()} timing={timing} />
        ),
      );
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <TransitionSeries>{seqs}</TransitionSeries>
      <Hud f={f} />
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fadeIn }} />
      <Music slug={SLUG} total={TOTAL} voiceRanges={ranges} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Frame,
  durationInFrames: TOTAL,
};
