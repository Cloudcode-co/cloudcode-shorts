import { FPS, beatmap } from "../../kit";
import beatmapJson from "./beatmap.json";
import timeline from "./timeline.json";
import type { Tone } from "./palette";

export const MAP = beatmap(beatmapJson);

export type Id = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8" | "s9";
export const IDS: Id[] = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"];

export const START = (id: Id) => Math.round(timeline.scenes[id].start * FPS);
export const LEN = (id: Id) => {
  const i = IDS.indexOf(id);
  return (i === IDS.length - 1
    ? Math.round(timeline.total * FPS)
    : Math.round(timeline.scenes[IDS[i + 1]].start * FPS)) - START(id);
};
export const TOTAL = Math.round(timeline.total * FPS);

// Scenes overlap by these many frames to cross-fade; the extra frames are added
// to the outgoing scene, so every scene still starts on its timeline second.
export const TAIL: Record<Id, number> = {
  s1: 10,
  s2: 12,
  s3: 8,
  s4: 10,
  s5: 8,
  s6: 0,
  s7: 10,
  s8: 14,
  s9: 0,
};
export const SCENE_DUR = (id: Id) => LEN(id) + TAIL[id];

export type ClipKey =
  | "hello"
  | "serverRoom"
  | "racks"
  | "racks2"
  | "cables"
  | "typing"
  | "code"
  | "harddrive"
  | "padlock"
  | "folders"
  | "laptops"
  | "multitask";

export type Clip = {
  file: string;
  dur: number;
  pos: string;
  credit: string;
};

export const CLIPS: Record<ClipKey, Clip> = {
  hello: {
    file: "footage/glowing-computer-monitor-dark-room-pixabay-28320.mp4",
    dur: 5,
    pos: "50% 50%",
    credit: "PIXABAY · CLIPLY",
  },
  serverRoom: {
    file: "footage/server-room-data-center-pixabay-380334.mp4",
    dur: 8,
    pos: "50% 50%",
    credit: "PIXABAY · MRWASHINGT0N",
  },
  racks: {
    file: "footage/modern-server-room-racks-glowing-pixabay-171185.mp4",
    dur: 21,
    pos: "50% 44%",
    credit: "PIXABAY · MOZOMOZO",
  },
  racks2: {
    file: "footage/server-rack-blinking-lights-pixabay-14906.mp4",
    dur: 8,
    pos: "50% 50%",
    credit: "PIXABAY · CIPNT",
  },
  cables: {
    file: "footage/network-cables-ethernet-pixabay-14900.mp4",
    dur: 24,
    pos: "50% 50%",
    credit: "PIXABAY · CIPNT",
  },
  typing: {
    file: "footage/typing-on-laptop-keyboard-pixabay-43559.mp4",
    dur: 18,
    pos: "50% 50%",
    credit: "PIXABAY · PHOTODHABA",
  },
  code: {
    file: "footage/programmer-code-screen-pixabay-348042.mp4",
    dur: 10,
    pos: "50% 40%",
    credit: "PIXABAY · DOKTORKLEINMUSIC",
  },
  harddrive: {
    file: "footage/hard-drive-server-hardware-pixabay-73328.mp4",
    dur: 31,
    pos: "50% 50%",
    credit: "PIXABAY · MARANDAP",
  },
  padlock: {
    file: "footage/padlock-computer-security-pixabay-133084.mp4",
    dur: 10,
    pos: "50% 50%",
    credit: "PIXABAY · JULIENTROMEUR",
  },
  folders: {
    file: "footage/files-documents-desk-pixabay-349087.mp4",
    dur: 17,
    pos: "50% 50%",
    credit: "PIXABAY · MUHAMMADAHMAD10",
  },
  laptops: {
    file: "footage/two-laptops-workspace-pixabay-251763.mp4",
    dur: 15,
    pos: "50% 50%",
    credit: "PIXABAY · GLOBLERANKSSEO",
  },
  multitask: {
    file: "footage/programmer-multitasking-multiple-monitor-pixabay-23355.mp4",
    dur: 55,
    pos: "50% 50%",
    credit: "PIXABAY · NINOSOUZA",
  },
};

export type WorldKind =
  | "desktop"
  | "link"
  | "key"
  | "gate"
  | "log"
  | "script"
  | "sudo"
  | "port"
  | "two"
  | "drag"
  | "tools"
  | "warning"
  | "gpu"
  | "dawn"
  | "rack";

export type ShotSpec = {
  at: number;
  kind: "footage" | "terminal" | WorldKind;
  tone: Tone;
  clip?: ClipKey;
  trim?: number;
  pos?: string;
  variant?: number;
  // How hard the camera pushes through the shot.
  drive?: number;
};

// Cuts land on the track's downbeats (about every 1.4 s), so every scene is a
// run of short shots. Each scene's last shot runs into the cross-fade tail.
export const SHOTS: Record<Id, ShotSpec[]> = {
  s1: [
    { at: 0, kind: "footage", tone: "cold", clip: "hello", trim: 10, drive: 0.6 },
    { at: 131, kind: "footage", tone: "cold", clip: "serverRoom", trim: 40, drive: 1.2 },
    { at: 216, kind: "desktop", tone: "cold", variant: 1, drive: 1 },
  ],
  s2: [
    { at: 0, kind: "footage", tone: "warm", clip: "racks", trim: 30, drive: 1.2 },
    { at: 144, kind: "terminal", tone: "warm", variant: 1 },
    { at: 229, kind: "port", tone: "warm", drive: 1 },
    { at: 315, kind: "footage", tone: "warm", clip: "harddrive", trim: 90, drive: 0.8 },
    { at: 401, kind: "footage", tone: "warm", clip: "cables", trim: 200, drive: 1.4 },
  ],
  s3: [
    { at: 0, kind: "footage", tone: "cold", clip: "racks", trim: 620, drive: 0.9 },
    { at: 114, kind: "link", tone: "cold", variant: 1, drive: 0.8 },
    { at: 199, kind: "footage", tone: "cold", clip: "cables", trim: 660, drive: 1.1 },
    { at: 286, kind: "rack", tone: "cold", variant: 1 },
    { at: 371, kind: "footage", tone: "cold", clip: "code", trim: 30, drive: 0.7 },
  ],
  s4: [
    { at: 0, kind: "key", tone: "cold", drive: 0.6 },
    { at: 154, kind: "footage", tone: "cold", clip: "typing", trim: 180, drive: 1 },
    { at: 239, kind: "desktop", tone: "cold", variant: 2, drive: 1.1 },
    { at: 326, kind: "footage", tone: "cold", clip: "racks2", trim: 90, drive: 1.2 },
    { at: 411, kind: "desktop", tone: "cold", variant: 3, drive: 1.4 },
  ],
  s5: [
    { at: 0, kind: "gate", tone: "cold", variant: 1, drive: 0.8 },
    { at: 99, kind: "footage", tone: "cold", clip: "typing", trim: 480, drive: 1.2 },
    { at: 185, kind: "log", tone: "cold", variant: 2, drive: 0.9 },
    { at: 270, kind: "footage", tone: "cold", clip: "multitask", trim: 600, drive: 0.8 },
    { at: 357, kind: "gate", tone: "cold", variant: 2, drive: 1 },
    { at: 443, kind: "footage", tone: "cold", clip: "racks2", trim: 260, drive: 1.2 },
  ],
  s6: [
    { at: 0, kind: "log", tone: "cold", variant: 1, drive: 1 },
    { at: 120, kind: "script", tone: "cold", drive: 0.9 },
    { at: 206, kind: "sudo", tone: "cold", variant: 1, drive: 0.7 },
    { at: 293, kind: "footage", tone: "cold", clip: "padlock", trim: 60, drive: 1 },
    { at: 371, kind: "sudo", tone: "cold", variant: 2, drive: 1.1 },
  ],
  s7: [
    { at: 0, kind: "two", tone: "warm", variant: 1, drive: 1.1 },
    { at: 87, kind: "drag", tone: "warm", variant: 1, drive: 1.2 },
    { at: 172, kind: "footage", tone: "warm", clip: "cables", trim: 300, drive: 1 },
    { at: 258, kind: "tools", tone: "warm", drive: 1 },
    { at: 345, kind: "footage", tone: "warm", clip: "laptops", trim: 60, drive: 1.1 },
    { at: 430, kind: "desktop", tone: "warm", variant: 4, drive: 1.2 },
  ],
  s8: [
    { at: 0, kind: "warning", tone: "warning", variant: 1, drive: 0.9 },
    { at: 90, kind: "footage", tone: "warning", clip: "harddrive", trim: 900, drive: 1 },
    { at: 176, kind: "warning", tone: "warning", variant: 2, drive: 1.2 },
    { at: 261, kind: "terminal", tone: "warning", variant: 2 },
    { at: 348, kind: "gpu", tone: "warning", variant: 1, drive: 1 },
    { at: 433, kind: "footage", tone: "warning", clip: "code", trim: 300, drive: 1.3 },
    { at: 518, kind: "gpu", tone: "warning", variant: 2, drive: 1.1 },
    { at: 604, kind: "gpu", tone: "warning", variant: 3, drive: 1.5 },
  ],
  s9: [
    { at: 0, kind: "footage", tone: "dawn", clip: "racks", trim: 980, drive: 0.8 },
    { at: 65, kind: "desktop", tone: "dawn", variant: 5, drive: 0.7 },
    { at: 147, kind: "footage", tone: "dawn", clip: "typing", trim: 760, drive: 1 },
    { at: 232, kind: "dawn", tone: "dawn", variant: 1, drive: 0.7 },
    { at: 317, kind: "footage", tone: "dawn", clip: "multitask", trim: 1500, drive: 0.9 },
    { at: 404, kind: "dawn", tone: "dawn", variant: 2, drive: 1.1 },
    { at: 490, kind: "desktop", tone: "dawn", variant: 6, drive: 0.6 },
  ],
};

export type Sub = { at: number; text: string };

// One short serif line per beat, in the voice's own words.
export const SUBS: Sub[] = [
  { at: 0, text: "Quản lý VPS Linux bằng giao diện desktop" },
  { at: 131, text: "Không cài agent, không mở port mới" },
  { at: 330, text: "Cách cũ: cài web panel thẳng vào server" },
  { at: 474, text: "curl script chạy ngay trên server" },
  { at: 559, text: "rồi mở thêm một cổng web" },
  { at: 645, text: "mọi thứ nằm trên server của bạn" },
  { at: 790, text: "Davish thì agentless hoàn toàn" },
  { at: 904, text: "chỉ chạy từ máy cá nhân" },
  { at: 1076, text: "qua SSH và SFTP sẵn có" },
  { at: 1264, text: "Kết nối thẳng bằng SSH key" },
  { at: 1418, text: "không màn hình đăng nhập web" },
  { at: 1503, text: "không tiến trình chạy ngầm" },
  { at: 1590, text: "server không phải cài thêm gì" },
  { at: 1747, text: "Lệnh can thiệp hiện ra trước" },
  { at: 1932, text: "đúng câu lệnh, rồi mới chạy" },
  { at: 2104, text: "nên không sợ thao tác nhầm" },
  { at: 2240, text: "Mọi lệnh được ghi vào command log" },
  { at: 2360, text: "xuất thành shell script khi cần" },
  { at: 2446, text: "mật khẩu sudo chỉ nằm trên RAM" },
  { at: 2611, text: "và biến mất sau 15 phút" },
  { at: 2680, text: "Mỗi server là một workspace riêng" },
  { at: 2767, text: "kéo thả file giữa hai VPS" },
  { at: 2938, text: "Docker, Nginx, Cron ngay trên cửa sổ" },
  { at: 3110, text: "quản lý nhiều server trong một desktop" },
  { at: 3191, text: "Bộ cài chưa được ký số" },
  { at: 3367, text: "SmartScreen hoặc macOS sẽ cảnh báo" },
  { at: 3539, text: "trên Linux NVIDIA, GPU render tắt mặc định" },
  { at: 3709, text: "bật lại bằng biến môi trường" },
  { at: 3819, text: "Lưu video lại để thử Davish" },
  { at: 3966, text: "một dự án mã nguồn mở GPL-3.0" },
  { at: 4136, text: "follow kênh để cập nhật công cụ mới" },
];

export type Tele = {
  label: string;
  unit: string;
  from: number;
  to: number;
  dur: number;
  at: number;
  sub: string;
  accent: string;
  clock?: boolean;
  dec?: number;
};

// The sudo timer only starts when the voice reaches it; before that the HUD
// reads the live session clock while the command log plays.
export const SUDO_AT = START("s6") + 206;
export const SESSION = {
  label: "PHIÊN SSH",
  unit: "đang chạy",
  sub: "COMMAND LOG · ĐANG GHI",
  accent: "#A6E9FF",
};

export const TELE: Record<Id, Tele> = {
  s1: {
    label: "AGENT TRÊN SERVER",
    unit: "tiến trình",
    from: 0,
    to: 0,
    dur: 1,
    at: START("s1"),
    sub: "CỔNG MỚI · 0",
    accent: "#A6E9FF",
  },
  s2: {
    label: "CÀI TRÊN SERVER",
    unit: "script",
    from: 0,
    to: 1,
    dur: 40,
    at: START("s2"),
    sub: "PORT WEB · MỞ",
    accent: "#F2A65A",
  },
  s3: {
    label: "TIẾN TRÌNH NỀN",
    unit: "đang chạy",
    from: 1,
    to: 0,
    dur: 24,
    at: START("s3"),
    sub: "SSH + SFTP",
    accent: "#C6F45B",
  },
  s4: {
    label: "CỔNG MỚI",
    unit: "cổng",
    from: 0,
    to: 0,
    dur: 1,
    at: START("s4"),
    sub: "SSH KEY · DESKTOP",
    accent: "#A6E9FF",
  },
  s5: {
    label: "XÁC NHẬN TRƯỚC",
    unit: "bước",
    from: 0,
    to: 1,
    dur: 26,
    at: START("s5"),
    sub: "CÂU LỆNH HIỆN RA TRƯỚC",
    accent: "#F3F8FF",
  },
  s6: {
    label: "SUDO TRONG RAM",
    unit: "còn lại",
    from: 0,
    to: 0,
    dur: 1,
    at: SUDO_AT,
    sub: "RAM · XOÁ SAU 15 PHÚT",
    accent: "#C6F45B",
    clock: true,
  },
  s7: {
    label: "SERVER TRONG WORKSPACE",
    unit: "VPS",
    from: 1,
    to: 2,
    dur: 9,
    at: START("s7"),
    sub: "DOCKER · NGINX · CRON",
    accent: "#F2A65A",
  },
  s8: {
    label: "CẢNH BÁO KÝ SỐ",
    unit: "lần mở đầu",
    from: 0,
    to: 1,
    dur: 18,
    at: START("s8"),
    sub: "GPU RENDER · MẶC ĐỊNH TẮT",
    accent: "#FF4234",
  },
  s9: {
    label: "SAO GITHUB",
    unit: "sao",
    from: 0,
    to: 327,
    dur: 150,
    at: START("s9"),
    sub: "GPL-3.0 · GO",
    accent: "#C6F45B",
  },
};

export const TELE_AT = (f: number): { id: Id; cfg: Tele } => {
  let id: Id = "s1";
  for (const k of IDS) if (f >= START(k)) id = k;
  return { id, cfg: TELE[id] };
};
