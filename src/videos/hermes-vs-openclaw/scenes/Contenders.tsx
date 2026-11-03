import { Img } from "remotion";
import { Shot, display, enter, useIn } from "../../../kit";
import { C, a } from "../palette";

// `crop` places the source image inside a square tile so only the mascot shows:
// h = rendered image height, x/y = offset of its top-left corner, all in px.
type Kin = {
  name: string;
  desc: string;
  img: string;
  crop: { h: number; x: number; y: number };
  bg: string;
};

const TILE = 168;

// Lighter OpenClaw-style agents; artwork from each project's README.
const CLAW_KIN: Kin[] = [
  {
    name: "NanoClaw",
    desc: "Mọi lệnh chạy trong container",
    img: "agents/nanoclaw-logo.png",
    crop: { h: 208, x: -32, y: -9 },
    bg: C.white,
  },
  {
    name: "nanobot",
    desc: "Viết bằng Python, code gọn dễ đọc",
    img: "agents/nanobot-cover.svg",
    crop: { h: 225, x: -44, y: -28 },
    bg: "#0d1117",
  },
  {
    name: "PicoClaw",
    desc: "Viết bằng Go, chạy được trên máy rất yếu",
    img: "agents/picoclaw-logo.webp",
    crop: { h: 203, x: -228, y: 5 },
    bg: C.white,
  },
  {
    name: "ZeroClaw",
    desc: "Viết bằng Rust, một file chạy vài MB",
    img: "agents/avatar-zeroclaw-labs.png",
    crop: { h: 239, x: -35, y: -7 },
    bg: C.white,
  },
];

// Agents in Hermes' lane (memory, learning, long-running); logos are the GitHub org avatars.
const square = { h: TILE, x: 0, y: 0 };
const HERMES_KIN: Kin[] = [
  {
    name: "Letta",
    desc: "Bộ nhớ dài hạn, tự cải thiện theo thời gian",
    img: "agents/avatar-letta-ai.png",
    crop: square,
    bg: C.white,
  },
  {
    name: "Agent Zero",
    desc: "Framework agent cá nhân, mã nguồn mở",
    img: "agents/avatar-agent0ai.png",
    crop: square,
    bg: C.white,
  },
  {
    name: "Goose",
    desc: "Tự cài, chạy, sửa và test code",
    img: "agents/avatar-aaif-goose.png",
    crop: square,
    bg: C.white,
  },
  {
    name: "Vellum",
    desc: "Trợ lý chạy 24/7, nhớ thói quen của bạn",
    img: "agents/avatar-vellum-ai.png",
    crop: square,
    bg: C.white,
  },
];

export const FAMILY_FIRST = 30;
export const FAMILY_GAP = 55;
const FIRST = FAMILY_FIRST;
const GAP = FAMILY_GAP;

const Row: React.FC<{ kin: Kin; delay: number }> = ({ kin, delay }) => {
  const p = useIn(delay);
  return (
    <div style={{ ...enter(p), display: "flex", gap: 32, alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: TILE,
          height: TILE,
          flexShrink: 0,
          borderRadius: 28,
          overflow: "hidden",
          background: kin.bg,
        }}
      >
        <Img
          src={a(kin.img)}
          style={{
            position: "absolute",
            height: kin.crop.h,
            left: kin.crop.x,
            top: kin.crop.y,
            maxWidth: "none",
          }}
        />
      </div>
      <div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 60,
            color: C.white,
            lineHeight: 1.05,
          }}
        >
          {kin.name}
        </div>
        <div style={{ fontSize: 40, fontWeight: 500, color: C.white, opacity: 0.85, lineHeight: 1.3, marginTop: 6 }}>
          {kin.desc}
        </div>
      </div>
    </div>
  );
};

const KinShot: React.FC<{
  len: number;
  bg: string;
  title: string;
  kin: Kin[];
  tail: string;
}> = ({ len, bg, title, kin, tail }) => {
  const head = useIn(0);
  const end = useIn(FIRST + kin.length * GAP + 20);
  return (
    <Shot bg={bg} len={len} style={{ gap: 24 }}>
      <div
        style={{
          ...enter(head),
          fontFamily: display,
          fontWeight: 800,
          fontSize: 80,
          lineHeight: 1.02,
          color: C.white,
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      {kin.map((k, i) => (
        <Row key={k.name} kin={k} delay={FIRST + i * GAP} />
      ))}
      <div
        style={{
          ...enter(end),
          fontSize: 40,
          fontWeight: 700,
          color: C.gold,
          marginTop: 10,
        }}
      >
        {tail}
      </div>
    </Shot>
  );
};

export const Contenders: React.FC<{ len: number }> = ({ len }) => (
  <KinShot
    len={len}
    bg={C.sea}
    title="OpenClaw còn cả một họ hàng"
    kin={CLAW_KIN}
    tail="Nhẹ hơn, nhưng cũng ít tính năng hơn."
  />
);

export const HermesRivals: React.FC<{ len: number }> = ({ len }) => (
  <KinShot
    len={len}
    bg={C.hermesInk}
    title="Hermes cũng có đối thủ"
    kin={HERMES_KIN}
    tail="Mỗi cái một thế mạnh, Hermes nhiều sao GitHub nhất."
  />
);
