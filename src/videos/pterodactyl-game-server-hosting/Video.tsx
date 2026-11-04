// Blueprint-as-advert: cyan-blue drafting paper, white linework, chalk-yellow
// callouts. Four long shots, each one drawing builds up in place.
import { siDocker } from "simple-icons";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, Series, useCurrentFrame } from "remotion";
import {
  Brand,
  display,
  easeOut,
  fit,
  Music,
  sans,
  Sfx,
  TikTokGuide,
  videoAsset,
  Voice,
  type RepoFact,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import durations from "./durations.json";
import facts from "./facts.json";
import script from "./script.json";

const SLUG = script.slug;
const BG = "#0A3278";
const INK = "#EAF2FF";
const DIM = "#7FA8F0";
const HI = "#FFD23F";
const L = 103;
const R = 880;
const W = R - L;
const CX = (L + R) / 2;
const LOGO = "repos/pterodactyl.png";

const repos = facts.repos as RepoFact[];
const stars = (asked: string) =>
  (repos.find((r) => r.asked === asked)?.stars ?? 0).toLocaleString("en-US");

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const prog = (f: number, at: number, dur = 16, easing: (t: number) => number = easeOut) =>
  interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing });

// ---------- timing ----------
const GROUPS = [
  ["s1", "s2"],
  ["s3", "s4"],
  ["s5", "s6"],
  ["s7", "s8"],
];
const dur = durations as Record<string, number>;
const sceneLen = (id: string) => fit(dur[id], 120) + (id === "s8" ? 90 : 0);
const shotLens = GROUPS.map((g) => g.reduce((n, id) => n + sceneLen(id), 0));
const TOTAL = shotLens.reduce((a, b) => a + b, 0);
const voiceRanges: [number, number][] = [];
{
  let at = 0;
  GROUPS.forEach((g) =>
    g.forEach((id) => {
      voiceRanges.push([at, at + Math.round(dur[id] * 60)]);
      at += sceneLen(id);
    }),
  );
}

// ---------- drawing parts ----------
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    width={1080}
    height={1920}
    viewBox="0 0 1080 1920"
    style={{ position: "absolute", left: 0, top: 0 }}
  >
    {children}
  </svg>
);

const Draw: React.FC<{
  d: string;
  at: number;
  len?: number;
  w?: number;
  color?: string;
  dash?: string;
  fill?: string;
  fillAt?: number;
}> = ({ d, at, len = 26, w = 4, color = INK, dash, fill, fillAt }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, len, Easing.out(Easing.cubic));
  if (dash) {
    return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeDasharray={dash} opacity={p} />;
  }
  return (
    <>
      {fill && (
        <path d={d} fill={fill} opacity={prog(f, fillAt ?? at + len, 14)} stroke="none" />
      )}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={w}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - p}
        opacity={p > 0 ? 1 : 0}
      />
    </>
  );
};

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`;

const Grid: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", left: 0, top: 0, opacity: prog(f, 0, 24) }}
    >
      <defs>
        <pattern id="minor" width={40} height={40} patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(180,210,255,0.13)" strokeWidth={1.5} />
        </pattern>
        <pattern id="major" width={200} height={200} patternUnits="userSpaceOnUse">
          <path d="M200 0H0V200" fill="none" stroke="rgba(180,210,255,0.28)" strokeWidth={2.5} />
        </pattern>
      </defs>
      <rect width={1080} height={1920} fill="url(#minor)" />
      <rect width={1080} height={1920} fill="url(#major)" />
    </svg>
  );
};

// A dimension line under the headline, with end ticks.
const DimLine: React.FC<{ y?: number; at?: number }> = ({ y = 640, at = 10 }) => (
  <Svg>
    <Draw d={`M${L} ${y}H${R}`} at={at} len={34} w={3} color={DIM} />
    <Draw d={`M${L} ${y - 16}V${y + 16}`} at={at} len={10} w={3} color={DIM} />
    <Draw d={`M${R} ${y - 16}V${y + 16}`} at={at + 30} len={10} w={3} color={DIM} />
    <Draw d={`M${L + 26} ${y - 10}L${L} ${y}L${L + 26} ${y + 10}`} at={at + 24} len={10} w={3} color={DIM} />
    <Draw d={`M${R - 26} ${y - 10}L${R} ${y}L${R - 26} ${y + 10}`} at={at + 24} len={10} w={3} color={DIM} />
  </Svg>
);

const Head: React.FC<{ lines: string[]; size: number; at?: number; bottom?: number }> = ({
  lines,
  size,
  at = 0,
  bottom = 606,
}) => {
  const f = useCurrentFrame();
  const h = lines.length * size * 1.04;
  return (
    <div
      style={{
        position: "absolute",
        left: L,
        top: bottom - h,
        width: W,
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.04,
        color: INK,
      }}
    >
      {lines.map((l, i) => {
        const p = prog(f, at + i * 6, 20);
        return (
          <div key={l} style={{ opacity: p, translate: `0 ${(1 - p) * 30}px`, whiteSpace: "nowrap" }}>
            {l}
          </div>
        );
      })}
    </div>
  );
};

const Txt: React.FC<{
  x: number;
  y: number;
  w?: number;
  size?: number;
  at: number;
  color?: string;
  font?: string;
  weight?: 500 | 700 | 800;
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}> = ({ x, y, w = W, size = 40, at, color = INK, font = sans, weight = 700, align = "left", children }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.2,
        color,
        textAlign: align,
        textWrap: "balance",
        opacity: p,
        translate: `0 ${(1 - p) * 22}px`,
      }}
    >
      {children}
    </div>
  );
};

// A ticked line item (check drawn in yellow).
const Item: React.FC<{ x: number; y: number; w: number; at: number; size?: number; color?: string; children: React.ReactNode }> = ({
  x,
  y,
  w,
  at,
  size = 40,
  color = INK,
  children,
}) => (
  <>
    <Svg>
      <Draw d={`M${x} ${y + 24}L${x + 13} ${y + 38}L${x + 38} ${y + 6}`} at={at} len={14} w={6} color={HI} />
    </Svg>
    <Txt x={x + 62} y={y} w={w - 62} size={size} at={at + 4} color={color}>
      {children}
    </Txt>
  </>
);

// Fades a scene's layer out over its last frames (unless it is the shot's last).
const SceneLayer: React.FC<{ from: number; len: number; id: string; last?: boolean; children: React.ReactNode }> = ({
  from,
  len,
  id,
  last,
  children,
}) => {
  return (
    <Sequence from={from} durationInFrames={len} name={id} layout="none">
      <LayerInner len={len} last={last}>
        {children}
      </LayerInner>
      <Voice slug={SLUG} id={id} />
    </Sequence>
  );
};
const LayerInner: React.FC<{ len: number; last?: boolean; children: React.ReactNode }> = ({ len, last, children }) => {
  const f = useCurrentFrame();
  const o = last ? 1 : interpolate(f, [len - 12, len], [1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Paper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
    <Grid />
    {children}
  </AbsoluteFill>
);

// ---------- shot A: question, then the Panel window ----------
const ShotA: React.FC = () => {
  const [a, b] = GROUPS[0].map(sceneLen);
  const f = useCurrentFrame();
  return (
    <Paper>
      <DimLine />
      <Svg>
        <Draw d={rect(L, 820, W, 580)} at={20} len={50} w={5} />
        <Draw d={`M${L} 886H${R}`} at={50} len={30} w={3} color={DIM} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={L + 36 + i * 40} cy={853} r={11} fill="none" stroke={DIM} strokeWidth={3} opacity={prog(f, 60 + i * 6, 12)} />
        ))}
      </Svg>
      <SceneLayer from={0} len={a} id="s1">
        <Head lines={["Tự dựng", "server game"]} size={116} />
        <Txt x={L} y={670} size={42} at={22}>
          Quản lý game server dễ dàng?
        </Txt>
        <Txt x={L} y={728} size={42} at={50} color={HI}>
          Tự host cho hội bạn chơi
        </Txt>
        <div
          style={{
            position: "absolute",
            left: L,
            top: 890,
            width: W,
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: display,
            fontWeight: 800,
            fontSize: 460,
            color: "transparent",
            WebkitTextStroke: `5px ${INK}`,
            opacity: prog(f, 80, 26),
            translate: `0 ${(1 - prog(f, 80, 26)) * 40}px`,
          }}
        >
          ?
        </div>
        <Sfx id="pop" at={80} volume={0.3} />
      </SceneLayer>
      <SceneLayer from={a} len={b} id="s2" last>
        <Head lines={["Pterodactyl", "Panel"]} size={112} />
        <Logo at={26} x={L + 30} y={915} size={170} />
        <Txt x={L + 230} y={905} w={W - 260} size={96} at={60} color={HI} font={display} weight={800}>
          {stars("pterodactyl/panel")}
        </Txt>
        <Txt x={L + 230} y={1012} w={W - 260} size={38} at={70} color={DIM}>
          sao GitHub
        </Txt>
        <Svg>
          <Draw d={`M${L} 1120H${R}`} at={120} len={24} w={3} color={DIM} />
          <Draw d={`M${L} 1220H${R}`} at={300} len={24} w={3} color={DIM} />
          <Draw d={`M${L} 1320H${R}`} at={420} len={24} w={3} color={DIM} />
        </Svg>
        <Item x={L + 30} y={1148} w={W - 40} at={150}>
          Giao diện web trực quan
        </Item>
        <Item x={L + 30} y={1248} w={W - 40} at={330}>
          Mã nguồn mở miễn phí
        </Item>
        <Item x={L + 30} y={1338} w={W - 40} at={450}>
          Xây dựng bằng PHP, React và Go
        </Item>
        <Sfx id="whoosh" volume={0.25} />
        <Sfx id="pop" at={26} volume={0.3} />
        <Sfx id="ding" at={150} volume={0.2} />
      </SceneLayer>
    </Paper>
  );
};

const Logo: React.FC<{ at: number; x: number; y: number; size: number }> = ({ at, x, y, size }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 22);
  return (
    <>
      <Img
        src={videoAsset(SLUG, LOGO)}
        style={{ position: "absolute", left: x, top: y, width: size, height: size, opacity: p, translate: `0 ${(1 - p) * 24}px`, border: `3px solid ${INK}` }}
      />
    </>
  );
};

// ---------- shot B: Docker containers, then Wings ----------
const CONT_X = (i: number) => L + 20 + i * 254;
const ShotB: React.FC = () => {
  const [a, b] = GROUPS[1].map(sceneLen);
  const f = useCurrentFrame();
  const barAt = a + 130;
  return (
    <Paper>
      <DimLine />
      <Svg>
        <Draw d={rect(L, 720, W, 700)} at={14} len={50} w={5} />
        {[0, 1, 2].map((i) => {
          const x = CONT_X(i);
          const at = 70 + i * 70;
          const p = prog(f, at + 18, 20);
          return (
            <g key={i}>
              <Draw d={rect(x, 770, 230, 230)} at={at} len={30} w={4} />
              <Draw d={rect(x + 12, 782, 206, 206)} at={at + 14} len={20} w={2.5} color={DIM} dash="12 10" />
              <g transform={`translate(${x + 115 - 62} ${885 - 62}) scale(5.2)`} opacity={p}>
                <path d={siDocker.path} fill={INK} />
              </g>
            </g>
          );
        })}
        {/* Wings bar, drawn when scene 4 starts */}
        <Draw d={rect(L + 20, 1030, 737, 76)} at={barAt} len={36} w={4} color={HI} />
        {[0, 1, 2].map((i) => (
          <Draw key={i} d={`M${CONT_X(i) + 115} 1002V1030`} at={barAt + 30 + i * 8} len={10} w={4} color={HI} />
        ))}
      </Svg>
      <SceneLayer from={0} len={a} id="s3">
        <Head lines={["Đóng gói", "trong Docker"]} size={112} />
        <Item x={L + 20} y={1140} w={W - 30} at={110} size={40}>
          Cô lập từng game trong Docker
        </Item>
        <Item x={L + 20} y={1220} w={W - 30} at={330} size={40}>
          Bảo vệ an toàn cho hệ thống
        </Item>
        <Item x={L + 20} y={1300} w={W - 30} at={480} size={40}>
          Không lo xung đột môi trường
        </Item>
        <Sfx id="thud" volume={0.4} />
        <Sfx id="pop" at={70} volume={0.25} />
        <Sfx id="pop" at={140} volume={0.25} />
        <Sfx id="pop" at={210} volume={0.25} />
      </SceneLayer>
      <SceneLayer from={a} len={b} id="s4" last>
        <Head lines={["Control plane", "Pterodactyl Wings"]} size={78} />
        <Img
          src={videoAsset(SLUG, LOGO)}
          style={{ position: "absolute", left: L + 28, top: 1037, width: 62, height: 62, opacity: prog(f - a, 140, 16) }}
        />
        <Txt x={L + 108} y={1047} w={220} size={42} at={150} font={display} weight={800}>
          Wings
        </Txt>
        <Txt x={L + 330} y={1052} w={410} size={36} at={160} color={HI} align="right">
          {stars("pterodactyl/wings")} sao GitHub
        </Txt>
        <Item x={L + 20} y={1160} w={W - 30} at={120} size={40}>
          Control plane viết bằng Go
        </Item>
        <Item x={L + 20} y={1240} w={W - 30} at={330} size={40}>
          Giao tiếp qua HTTP API
        </Item>
        <Item x={L + 20} y={1320} w={W - 30} at={470} size={40}>
          Xem log và tạo backup
        </Item>
        <Sfx id="whoosh" volume={0.25} />
        <Sfx id="ding" at={140} volume={0.2} />
      </SceneLayer>
    </Paper>
  );
};

// ---------- shot C: SFTP, then the supported games ----------
const FileGlyph: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0H34L50 16V64H0Z M34 0V16H50" fill={BG} stroke={HI} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

const Cell: React.FC<{ x: number; y: number; w: number; h: number; at: number; title: string; sub?: string; accent?: boolean }> = ({
  x,
  y,
  w,
  h,
  at,
  title,
  sub,
  accent,
}) => (
  <>
    <Svg>
      <Draw d={rect(x, y, w, h)} at={at} len={26} w={4} color={accent ? HI : INK} />
    </Svg>
    <Txt x={x + 24} y={y + (sub ? 26 : h / 2 - 34)} w={w - 48} size={62} at={at + 8} font={display} weight={800} color={accent ? HI : INK}>
      {title}
    </Txt>
    {sub && (
      <Txt x={x + 24} y={y + 100} w={w - 48} size={36} at={at + 14} color={DIM}>
        {sub}
      </Txt>
    )}
  </>
);

const ShotC: React.FC = () => {
  const [a, b] = GROUPS[2].map(sceneLen);
  return (
    <Paper>
      <DimLine />
      <SceneLayer from={0} len={a} id="s5">
        <Head lines={["Tích hợp sẵn", "SFTP"]} size={124} />
        <FlowS5 />
        <Item x={L + 10} y={1170} w={W - 10} at={120} size={40}>
          Có sẵn SFTP server bên trong
        </Item>
        <Item x={L + 10} y={1250} w={W - 10} at={300} size={40}>
          Đăng nhập bằng tài khoản Panel
        </Item>
        <Item x={L + 10} y={1330} w={W - 10} at={430} size={40}>
          Truyền file tiện lợi
        </Item>
        <Sfx id="thud" volume={0.4} />
        <Sfx id="pop" at={60} volume={0.25} />
        <Sfx id="pop" at={140} volume={0.25} />
      </SceneLayer>
      <SceneLayer from={a} len={b} id="s6" last>
        <Head lines={["Hỗ trợ nhiều", "dòng game"]} size={112} />
        <Cell x={L} y={690} w={W} h={170} at={90} title="Minecraft" sub="Paper, Sponge, Bungeecord" accent />
        <Cell x={L} y={880} w={378} h={140} at={380} title="Rust" />
        <Cell x={L + 399} y={880} w={378} h={140} at={430} title="Terraria" />
        <Cell x={L} y={1040} w={378} h={140} at={490} title="CS:GO" />
        <Cell x={L + 399} y={1040} w={378} h={140} at={540} title="ARK" />
        <Cell x={L} y={1200} w={W} h={170} at={620} title="Bot Discord" sub="Node.js hoặc Python" accent />
        <Sfx id="whoosh" volume={0.25} />
        <Sfx id="pop" at={90} volume={0.25} />
        <Sfx id="pop" at={380} volume={0.2} />
        <Sfx id="pop" at={430} volume={0.2} />
        <Sfx id="pop" at={490} volume={0.2} />
        <Sfx id="pop" at={540} volume={0.2} />
        <Sfx id="ding" at={620} volume={0.2} />
      </SceneLayer>
    </Paper>
  );
};

const FlowS5: React.FC = () => {
  const f = useCurrentFrame();
  const glyph = (k: number) => {
    const t = ((f - 240 - k * 40) % 80) / 80;
    if (f < 240 + k * 40) return null;
    const y = 850 + t * 70;
    return (
      <g key={k} opacity={Math.min(1, t * 6, (1 - t) * 6)}>
        <FileGlyph x={CX - 25} y={y} />
      </g>
    );
  };
  return (
    <>
      <Svg>
        <Draw d={rect(L, 700, W, 140)} at={30} len={34} w={5} />
        <Draw d={rect(L, 960, W, 140)} at={80} len={34} w={5} color={HI} />
        <Draw d={`M${CX} 840V960`} at={130} len={24} w={3} color={DIM} />
        {glyph(0)}
        {glyph(1)}
      </Svg>
      <Logo at={36} x={L + 24} y={720} size={100} />
      <Txt x={L + 150} y={738} w={W - 170} size={42} at={50}>
        Tài khoản Panel
      </Txt>
      <Txt x={L + 24} y={992} w={W - 48} size={70} at={96} color={HI} font={display} weight={800}>
        Wings SFTP
      </Txt>
    </>
  );
};

// ---------- shot D: v2 Beta stack, then save + follow ----------
const plate = (cy: number) =>
  `M${CX} ${cy - 115}L${CX + 360} ${cy}L${CX} ${cy + 115}L${CX - 360} ${cy}Z`;
const PLATES = [
  { y: 1250, at: 170, label: "Stack công nghệ hiện đại", color: INK },
  { y: 1060, at: 330, label: "Giao diện quản trị mới", color: INK },
  { y: 870, at: 450, label: "Tích hợp Extension SDK", color: HI },
];

const ShotD: React.FC = () => {
  const [a, b] = GROUPS[3].map(sceneLen);
  return (
    <Paper>
      <DimLine />
      <SceneLayer from={0} len={a} id="s7">
        <Head lines={["Đã có bản", "v2 Beta"]} size={124} />
        <Plates />
        <Sfx id="thud" volume={0.4} />
        <Sfx id="pop" at={170} volume={0.25} />
        <Sfx id="pop" at={330} volume={0.25} />
        <Sfx id="ding" at={450} volume={0.25} />
      </SceneLayer>
      <SceneLayer from={a} len={b} id="s8" last>
        <Head lines={["Lưu lại", "và theo dõi"]} size={116} />
        <Svg>
          <Draw d={`M${CX - 200} 720H${CX + 20}V1140L${CX - 90} 1050L${CX - 200} 1140Z`} at={30} len={60} w={7} />
          <Draw d={`M${CX + 230} 880a90 90 0 1 0 0.1 0Z`} at={300} len={50} w={6} color={HI} />
          <Draw d={`M${CX + 230} 925V1015M${CX + 185} 970H${CX + 275}`} at={340} len={24} w={7} color={HI} />
        </Svg>
        <Txt x={L} y={1220} size={42} at={40}>
          Lưu video để tự host server
        </Txt>
        <Txt x={L} y={1280} size={42} at={330} color={HI}>
          Follow để đón xem công nghệ mới
        </Txt>
        <Sfx id="whoosh" volume={0.25} />
        <Sfx id="pop" at={90} volume={0.3} />
        <Sfx id="ding" at={340} volume={0.25} />
      </SceneLayer>
    </Paper>
  );
};

const Plates: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Svg>
        {PLATES.map((p, i) => {
          const rise = prog(f, p.at, 34);
          const cy = PLATES[0].y + (p.y - PLATES[0].y) * rise;
          const o = i === 0 ? prog(f, p.at, 10) : prog(f, p.at, 8);
          return (
            <g key={i} opacity={o}>
              <path d={plate(cy)} fill={BG} stroke={p.color} strokeWidth={5} strokeLinejoin="round" />
            </g>
          );
        })}
      </Svg>
      {PLATES.map((p) => (
        <Txt key={p.label} x={CX - 280} y={p.y - 26} w={560} size={40} at={p.at + 26} color={p.color} align="center">
          {p.label}
        </Txt>
      ))}
    </>
  );
};

// ---------- the video ----------
const Blueprint: React.FC<VideoProps> = ({ guide }) => {
  const shots = [ShotA, ShotB, ShotC, ShotD];
  return (
    <AbsoluteFill>
      <Series>
        {shots.map((S, i) => (
          <Series.Sequence key={i} durationInFrames={shotLens[i]} name={`shot ${i + 1}`}>
            <S />
            {i === 0 && <Brand />}
          </Series.Sequence>
        ))}
      </Series>
      <Music slug={SLUG} total={TOTAL} voiceRanges={voiceRanges} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Blueprint,
  durationInFrames: TOTAL,
};
