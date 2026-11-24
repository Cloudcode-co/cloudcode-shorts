// One still photo per place, one or two meme animals per line, one caption.
// Scene starts and lengths come from timeline.json; the caption text is the
// scene headline word for word, broken by meaning into at most three lines.
export const SLUG = "pi-hole-homelab-shopee-fail";

export type Place = "desk" | "living";

export const PLACES: Record<
  Place,
  { file: string; position: string; filter: string; tint: string }
> = {
  // A dark bedroom/computer room at night: the monitor is the only light.
  desk: {
    file: "images/gaming-pc-setup-rgb-pixabay-289470.jpg",
    position: "35% 42%",
    filter: "brightness(0.72) saturate(0.9) contrast(1.06)",
    tint: "rgba(4, 9, 22, 0.42)",
  },
  // The warm living room where the family runs into the blocked pages.
  living: {
    file: "images/cozy-living-room-pixabay-10505991.jpg",
    position: "50% 52%",
    filter: "brightness(0.8) saturate(0.95) contrast(1.03)",
    tint: "rgba(22, 9, 4, 0.36)",
  },
};

export type CatSpec = {
  file: string;
  width: number;
  height: number;
  left: number;
  /** px from the bottom of the 1920 frame; the cat sits low, above TikTok's caption */
  bottom: number;
  renderedWidth: number;
  delay: number;
  tilt: number;
  bob: number;
  shake?: number;
  mirror?: boolean;
};

export type SceneSpec = {
  id: string;
  start: number;
  len: number;
  place: Place;
  lines: string[];
  size: number;
  enter: "zoom" | "flash";
  cats: CatSpec[];
  /** local frame where the music drops (s2 only): flash + jump */
  dropAt?: number;
  /** local frame where the punchline deflates (s5 only) */
  slumpAt?: number;
};

const typing: CatSpec = {
  file: "memes/cat-typing-laptop-giphy-hiJ9ypGI5tIKdwKoK2.gif",
  width: 480,
  height: 296,
  left: 170,
  bottom: 520,
  renderedWidth: 700,
  delay: 8,
  tilt: -1.5,
  bob: 4,
};

const vibing: CatSpec = {
  file: "memes/cat-vibing-giphy-sTsg7kyZpBE6ecUVof.gif",
  width: 480,
  height: 480,
  left: 280,
  bottom: 520,
  renderedWidth: 520,
  delay: 6,
  tilt: 2,
  bob: 6,
};

const momYell: CatSpec = {
  file: "memes/cat-screaming-giphy-cODsKQjgESv852mIPd.gif",
  width: 480,
  height: 480,
  left: 90,
  bottom: 560,
  renderedWidth: 440,
  delay: 6,
  tilt: 6,
  bob: 2,
  shake: 5,
};

const boyCry: CatSpec = {
  file: "memes/cat-crying-giphy-Xr9TlAqw3S7VPOrftK.gif",
  width: 480,
  height: 398,
  left: 530,
  bottom: 640,
  renderedWidth: 380,
  delay: 14,
  tilt: -5,
  bob: 2,
  shake: 1.5,
  mirror: true,
};

const dadPanic: CatSpec = {
  file: "memes/cat-panic-giphy-eAot8Ldr85y3peseC3.gif",
  width: 480,
  height: 468,
  left: 64,
  bottom: 520,
  renderedWidth: 870,
  delay: 7,
  tilt: 3,
  bob: 4,
  shake: 1.5,
};

const facepalm: CatSpec = {
  file: "memes/cat-facepalm-giphy-vCUjNFrZOW7kjl9fEO.gif",
  width: 360,
  height: 480,
  left: 330,
  bottom: 520,
  renderedWidth: 420,
  delay: 8,
  tilt: -2,
  bob: 2,
};

export const SCENES: SceneSpec[] = [
  {
    id: "s1",
    start: 0,
    len: 270,
    place: "desk",
    lines: ["IT boy homelab hí hửng", "dựng Pi-hole trên VPS để", "chặn sạch quảng cáo mạng nhà"],
    size: 54,
    enter: "zoom",
    cats: [typing],
  },
  {
    id: "s2",
    start: 270,
    len: 252,
    place: "desk",
    lines: ["Tự tin set DNS thẳng", "vào router, khoe bố mẹ", "từ nay lướt web bao mượt"],
    size: 62,
    enter: "zoom",
    cats: [vibing],
    dropAt: 186,
  },
  {
    id: "s3",
    start: 522,
    len: 270,
    place: "living",
    lines: ["10 phút sau mẹ chạy sang phòng", "quát sao bấm link sale Shopee", "toàn báo lỗi"],
    size: 52,
    enter: "flash",
    cats: [momYell, boyCry],
  },
  {
    id: "s4",
    start: 792,
    len: 228,
    place: "living",
    lines: ["Bố thì càu nhàu TV thông minh", "tịt ngóm không load nổi", "clip YouTube"],
    size: 54,
    enter: "zoom",
    cats: [dadPanic],
  },
  {
    id: "s5",
    start: 1020,
    len: 360,
    place: "desk",
    lines: ["Vội vàng mò vào router đổi lại", "DNS 8.8.8.8 rồi đổ tội", "do đứt cáp quang biển"],
    size: 52,
    enter: "flash",
    cats: [facepalm],
    slumpAt: 270,
  },
];

export const TOTAL = SCENES.reduce((n, s) => n + s.len, 0);
