// "Engineer's notebook": four long shots, each one a page that fills up as the voice talks.
import { siAndroid, siApple, siFfmpeg, siGithub, siLinux, siRust, siClaude } from "simple-icons";
import { AbsoluteFill, Sequence, Series } from "remotion";
import {
  BRAND_SPACE,
  BREATH,
  Brand,
  FPS,
  Music,
  Sfx,
  TYPE_DELAY,
  Terminal,
  TikTokGuide,
  Voice,
  typingFrames,
  videoAsset,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import VO from "./durations.json";
import facts from "./facts.json";
import {
  Arrow,
  CLOUD_D,
  DARK,
  IconTile,
  LIGHT,
  Mark,
  Notebook,
  Pen,
  Polaroid,
  Reveal,
  STICKY,
  Sticky,
  Tape,
  Write,
  rectD,
  starD,
} from "./notebook";

const SLUG = "tu-host-concat-video-editor";
type Id = keyof typeof VO;

const LEAD = 10;
const GAP = 0.45;

// Where each scene's voice starts inside a shot, and how long the shot lasts.
const plan = (ids: Id[]) => {
  let t = LEAD;
  const starts: number[] = [];
  ids.forEach((id) => {
    starts.push(t);
    t += Math.ceil((VO[id] + GAP) * FPS);
  });
  const last = ids[ids.length - 1];
  return { ids, starts, len: starts[starts.length - 1] + Math.ceil((VO[last] + BREATH) * FPS) };
};

const A = plan(["s1", "s2", "s3"]);
const B = plan(["s4", "s5"]);
const C = plan(["s6", "s7"]);
const D = plan(["s8", "s9"]);
const SHOTS = [A, B, C, D];
const TOTAL = SHOTS.reduce((n, s) => n + s.len, 0);

const VOICE_RANGES: [number, number][] = (() => {
  const out: [number, number][] = [];
  let base = 0;
  SHOTS.forEach((s) => {
    s.ids.forEach((id, i) =>
      out.push([base + s.starts[i], base + s.starts[i] + Math.round(VO[id] * FPS)]),
    );
    base += s.len;
  });
  return out;
})();

// Frame (in the shot) where the voice of scene `id` reaches `frac` of its line.
const at = (start: number, id: Id, frac: number) => Math.round(start + frac * VO[id] * FPS);

const Voices: React.FC<{ plan: ReturnType<typeof plan> }> = ({ plan: p }) => (
  <>
    {p.ids.map((id, i) => (
      <Sequence key={id} from={p.starts[i]} layout="none" name={`voice ${id}`}>
        <Voice slug={SLUG} id={id} />
      </Sequence>
    ))}
  </>
);

const avatar = videoAsset(SLUG, facts.repos[0].avatar);
const stars = facts.repos[0].stars.toLocaleString("vi-VN");

// ---------------------------------------------------------------------------
// Shot A: hook, what it is, local. Dark page, with the Cloudcode lockup.
// ---------------------------------------------------------------------------
const ShotA: React.FC = () => {
  const [t1, t2, t3] = A.starts;
  const checks = [
    { text: "Mã nguồn mở", f: 0.58 },
    { text: "Không watermark", f: 0.76 },
    { text: "Thay thế CapCut", f: 0.92 },
  ];
  return (
    <Notebook theme={DARK}>
      <Write x={0} y={BRAND_SPACE} size={106} start={t1 + 4} dur={26}>
        Thay thế <Mark start={at(t1, "s1", 0.45)}>CapCut</Mark>
      </Write>
      <Write x={0} y={BRAND_SPACE + 114} size={106} start={t1 + 26} dur={22}>
        miễn phí?
      </Write>
      {checks.map((c, i) => {
        const y = 350 + i * 70;
        const s = at(t1, "s1", c.f);
        return (
          <div key={c.text}>
            <Pen d={rectD(40, 40, i + 3)} x={0} y={y + 8} start={s} dur={10} w={4} />
            <Pen d="M 8 28 L 19 40 L 47 0" x={0} y={y + 8} start={s + 8} dur={10} color={DARK.hl} w={6} />
            <Write x={66} y={y} size={50} start={s + 4} dur={16}>
              {c.text}
            </Write>
          </div>
        );
      })}

      <Polaroid x={0} y={590} w={230} rot={-4} start={t2 + 4} src={avatar} caption="jub0t/Concat" />
      <Write x={280} y={578} size={118} start={t2 + 14} dur={20}>
        Concat
      </Write>
      <Write x={280} y={700} size={52} start={at(t2, "s2", 0.4)} dur={18}>
        viết bằng <Mark start={at(t2, "s2", 0.5)}>Rust</Mark>
      </Write>
      <Write x={280} y={766} size={46} start={at(t2, "s2", 0.75)} dur={18}>
        hiệu năng mượt mà
      </Write>
      <Pen d={starD(22)} x={302} y={856} start={at(t2, "s2", 0.85)} dur={16} color={DARK.hl} fill={DARK.hl} w={4} />
      <Write x={340} y={832} size={44} start={at(t2, "s2", 0.9)} dur={14}>
        {stars} sao
      </Write>

      <Pen d={rectD(500, 220, 9)} x={0} y={940} start={t3 + 4} dur={30} />
      <Write x={28} y={954} size={74} start={at(t3, "s3", 0.2)} dur={16}>
        <Mark start={at(t3, "s3", 0.26)}>100% local</Mark>
      </Write>
      <Write x={28} y={1043} size={42} start={at(t3, "s3", 0.5)} dur={20}>
        offline, không tài khoản
      </Write>
      <Write x={28} y={1095} size={42} start={at(t3, "s3", 0.74)} dur={18}>
        dữ liệu không rời máy
      </Write>
      <Arrow x1={510} y1={1052} x2={562} y2={1022} start={at(t3, "s3", 0.8)} dur={12} color={DARK.hl} />
      <Pen d={CLOUD_D} x={580} y={966} start={at(t3, "s3", 0.84)} dur={16} w={5} />
      <Pen d="M 0 0 L 56 56" x={618} y={976} start={at(t3, "s3", 0.92)} dur={8} color={DARK.red} w={8} />
      <Pen d="M 56 0 L 0 56" x={618} y={976} start={at(t3, "s3", 0.92) + 6} dur={8} color={DARK.red} w={8} />
    </Notebook>
  );
};

const ShotAAudio: React.FC = () => {
  const [t1, t2, t3] = A.starts;
  return (
    <>
      <Voices plan={A} />
      <Sfx id="thud" volume={0.4} />
      <Sfx id="pop" at={t2 + 4} volume={0.25} />
      <Sfx id="ding" at={at(t3, "s3", 0.26)} volume={0.2} />
      <Sfx id="pixel" at={at(t1, "s1", 0.45)} volume={0.15} />
    </>
  );
};

// ---------------------------------------------------------------------------
// Shot B: offline AI, then the editor kit.
// ---------------------------------------------------------------------------
const WaveD = "M 0 40 L 10 20 L 20 62 L 30 6 L 40 76 L 50 26 L 60 56 L 70 14 L 80 66 L 90 30 L 100 50 L 120 40";

const ShotB: React.FC = () => {
  const [t4, t5] = B.starts;
  const rowAt = [0.38, 0.6, 0.8];
  const clips: { y: number; x: number; w: number; c: string }[] = [
    { y: 0, x: 20, w: 200, c: "#9CC3F2" },
    { y: 0, x: 250, w: 150, c: "#FFE14D" },
    { y: 0, x: 440, w: 260, c: "#9CC3F2" },
    { y: 1, x: 100, w: 260, c: "#F4A3A0" },
    { y: 1, x: 400, w: 200, c: "#F4A3A0" },
    { y: 2, x: 0, w: 330, c: "#A9E3B0" },
    { y: 2, x: 380, w: 330, c: "#A9E3B0" },
  ];
  return (
    <Notebook theme={LIGHT}>
      <Write x={0} y={0} size={100} start={t4 + 4} dur={22}>
        AI chạy <Mark start={at(t4, "s4", 0.3)}>offline</Mark>
      </Write>
      <Pen d={rectD(420, 84, 5)} x={0} y={140} start={at(t4, "s4", 0.18)} dur={20} />
      <Write x={26} y={160} size={46} start={at(t4, "s4", 0.2) + 8} dur={16}>
        Tải model một lần
      </Write>
      <Arrow x1={210} y1={232} x2={210} y2={296} start={at(t4, "s4", 0.3)} dur={14} color={LIGHT.red} />

      {/* caption doodle */}
      <Pen d={rectD(120, 84, 11)} x={0} y={316} start={at(t4, "s4", rowAt[0])} dur={14} />
      <Pen d="M 20 50 L 100 50" x={0} y={316} start={at(t4, "s4", rowAt[0]) + 10} dur={8} color={LIGHT.blue} w={6} />
      <Pen d="M 34 68 L 86 68" x={0} y={316} start={at(t4, "s4", rowAt[0]) + 16} dur={8} color={LIGHT.blue} w={6} />
      <Write x={170} y={326} size={46} start={at(t4, "s4", rowAt[0]) + 6} dur={18}>
        Auto-caption với <Mark start={at(t4, "s4", rowAt[0]) + 22}>Whisper</Mark>
      </Write>

      {/* cutout doodle */}
      <Pen d="M 60 8 C 80 8 82 44 60 44 C 38 44 40 8 60 8 Z" x={0} y={446} start={at(t4, "s4", rowAt[1])} dur={12} color={LIGHT.red} />
      <Pen d="M 14 84 C 14 54 106 54 106 84" x={0} y={446} start={at(t4, "s4", rowAt[1]) + 8} dur={12} color={LIGHT.red} />
      <Write x={170} y={456} size={46} start={at(t4, "s4", rowAt[1]) + 6} dur={16}>
        Tự động tách nền
      </Write>

      {/* waveform doodle */}
      <Pen d={WaveD} x={0} y={576} start={at(t4, "s4", rowAt[2])} dur={16} color={LIGHT.blue} w={6} />
      <Write x={170} y={586} size={44} start={at(t4, "s4", rowAt[2]) + 6} dur={20}>
        Text-to-speech & clone giọng
      </Write>

      {/* timeline */}
      <Write x={0} y={756} size={48} start={t5 + 6} dur={16}>
        Multi-track timeline
      </Write>
      {[0, 1, 2].map((k) => (
        <Pen key={k} d={rectD(740, 54, 20 + k)} x={0} y={822 + k * 66} start={t5 + 20 + k * 12} dur={20} w={4} />
      ))}
      {clips.map((c, i) => (
        <Pen
          key={i}
          d={rectD(c.w, 38, 40 + i)}
          x={c.x}
          y={830 + c.y * 66}
          start={t5 + 50 + i * 6}
          dur={12}
          color={LIGHT.ink}
          fill={c.c}
          w={3}
        />
      ))}
      <Pen d="M 0 -11 L 11 0 L 0 11 L -11 0 Z" x={338} y={849} start={at(t5, "s5", 0.3)} dur={8} color={LIGHT.red} fill={LIGHT.red} w={3} />
      <Pen d="M 0 -11 L 11 0 L 0 11 L -11 0 Z" x={606} y={915} start={at(t5, "s5", 0.34)} dur={8} color={LIGHT.red} fill={LIGHT.red} w={3} />
      <Pen d="M 480 802 L 480 1030" start={at(t5, "s5", 0.4)} dur={14} color={LIGHT.red} w={5} />
      <Pen d="M 466 794 L 494 794 L 480 814 Z" start={at(t5, "s5", 0.4) + 10} dur={8} color={LIGHT.red} fill={LIGHT.red} w={3} />

      <Sticky x={0} y={1056} w={470} start={at(t5, "s5", 0.5)} rot={-2} color={STICKY.yellow} size={42}>
        Hơn 100 hiệu ứng GPU
      </Sticky>
      <Write x={520} y={1036} size={38} start={at(t5, "s5", 0.74)} dur={12}>
        Xuất đến
      </Write>
      <Write x={520} y={1076} size={66} start={at(t5, "s5", 0.78)} dur={14}>
        <Mark start={at(t5, "s5", 0.84)}>4K 60fps</Mark>
      </Write>
    </Notebook>
  );
};

const ShotBAudio: React.FC = () => {
  const [t4, t5] = B.starts;
  return (
    <>
      <Voices plan={B} />
      <Sfx id="whoosh" volume={0.25} />
      <Sfx id="pop" at={at(t4, "s4", 0.38)} volume={0.2} />
      <Sfx id="pop" at={at(t5, "s5", 0.5)} volume={0.25} />
      <Sfx id="ding" at={at(t5, "s5", 0.84)} volume={0.2} />
    </>
  );
};

// ---------------------------------------------------------------------------
// Shot C: MCP / JSON-RPC diagram, then the build command.
// ---------------------------------------------------------------------------
const CMDS = ["cd src", "cargo run -p concat"];

const ShotC: React.FC = () => {
  const [t6, t7] = C.starts;
  const term = at(t7, "s7", 0.5);
  return (
    <Notebook theme={LIGHT}>
      <Write x={0} y={0} size={96} start={t6 + 4} dur={22}>
        <Mark start={at(t6, "s6", 0.2)}>MCP</Mark> + JSON-RPC
      </Write>

      {/* Concat */}
      <Pen d={rectD(337, 190, 31)} x={440} y={250} start={at(t6, "s6", 0.12)} dur={24} />
      <Polaroid x={458} y={274} w={130} rot={-3} start={at(t6, "s6", 0.12) + 10} src={avatar} />
      <Write x={604} y={310} size={50} start={at(t6, "s6", 0.12) + 20} dur={14}>
        Concat
      </Write>

      {/* AI agent -> MCP */}
      <Write x={340} y={186} size={44} start={at(t6, "s6", 0.24)} dur={10} color={LIGHT.red}>
        MCP
      </Write>
      <Pen d={rectD(320, 130, 33)} x={0} y={170} start={at(t6, "s6", 0.22)} dur={20} />
      <Write x={24} y={188} size={50} start={at(t6, "s6", 0.22) + 10} dur={12}>
        AI agent
      </Write>
      <Write x={24} y={244} size={40} start={at(t6, "s6", 0.22) + 18} dur={12}>
        như Claude
      </Write>
      <Arrow x1={324} y1={240} x2={436} y2={308} start={at(t6, "s6", 0.28)} dur={16} color={LIGHT.red} />
      <IconTile x={228} y={140} w={92} h={92} start={at(t6, "s6", 0.62)} rot={5} glyph={siClaude} fillColor={`#${siClaude.hex}`} />

      {/* Script -> JSON-RPC */}
      <Pen d={rectD(320, 110, 35)} x={0} y={400} start={at(t6, "s6", 0.4)} dur={20} />
      <Write x={24} y={430} size={50} start={at(t6, "s6", 0.4) + 10} dur={12}>
        Script của bạn
      </Write>
      <Arrow x1={324} y1={456} x2={436} y2={396} start={at(t6, "s6", 0.46)} dur={16} color={LIGHT.blue} />
      <Write x={330} y={474} size={38} start={at(t6, "s6", 0.5)} dur={12} color={LIGHT.blue}>
        JSON-RPC
      </Write>

      {/* result */}
      <Arrow x1={600} y1={446} x2={600} y2={566} start={at(t6, "s6", 0.74)} dur={14} color={LIGHT.red} />
      <Pen d={rectD(320, 100, 37)} x={440} y={578} start={at(t6, "s6", 0.78)} dur={16} />
      {[0, 1, 2].map((i) => (
        <Pen key={i} d={rectD(82, 66, 50 + i)} x={456 + i * 98} y={594} start={at(t6, "s6", 0.8) + i * 6} dur={10} w={3} />
      ))}
      <Sticky x={0} y={590} w={400} start={at(t6, "s6", 0.84)} rot={-3} color={STICKY.pink} size={40}>
        Agent <Mark start={at(t6, "s6", 0.9)}>tự dựng</Mark> video
      </Sticky>

      {/* build */}
      <Sticky x={0} y={760} w={400} start={t7 + 8} rot={2} color={STICKY.yellow} size={42}>
        Cần Rust và FFmpeg
      </Sticky>
      <IconTile x={450} y={752} w={100} h={100} start={t7 + 18} rot={-4} glyph={siRust} />
      <IconTile x={580} y={758} w={100} h={100} start={t7 + 26} rot={3} glyph={siFfmpeg} fillColor={`#${siFfmpeg.hex}`} />
      <Write x={0} y={894} size={46} start={at(t7, "s7", 0.4)} dur={18}>
        Chạy trực tiếp editor:
      </Write>
      <Reveal x={0} y={960} w={777} start={term}>
        <Sequence from={term} layout="none">
          <Terminal cmds={CMDS} fontSize={44} minHeight={190} bg="#17233B" accent="#FFE14D" />
        </Sequence>
      </Reveal>
      <Reveal x={0} y={0} start={term}>
        <Tape x={40} y={956} rot={-6} />
        <Tape x={690} y={956} rot={7} />
      </Reveal>
    </Notebook>
  );
};

const ShotCAudio: React.FC = () => {
  const [t6, t7] = C.starts;
  const term = at(t7, "s7", 0.5);
  return (
    <>
      <Voices plan={C} />
      <Sfx id="whoosh" volume={0.25} />
      <Sfx id="pop" at={at(t6, "s6", 0.12) + 10} volume={0.2} />
      <Sfx id="ding" at={at(t6, "s6", 0.2)} volume={0.2} />
      <Sfx id="pop" at={at(t6, "s6", 0.84)} volume={0.25} />
      <Sfx id="pop" at={t7 + 8} volume={0.25} />
      <Sfx id="typing" at={term + TYPE_DELAY} frames={typingFrames(CMDS)} volume={0.25} />
    </>
  );
};

// ---------------------------------------------------------------------------
// Shot D: where to get it, sign-off.
// ---------------------------------------------------------------------------
const TILE_W = 170;
const platforms = [
  { label: "macOS", glyph: siApple, f: 0.5 },
  {
    label: "Windows",
    glyph: {
      path: "M0 3.4 9.7 2.1V11.3H0ZM10.9 1.9 24 0V11.3H10.9ZM0 12.5H9.7V21.8L0 20.5ZM10.9 12.5H24V24L10.9 22.1Z",
    },
    f: 0.62,
  },
  { label: "Linux", glyph: siLinux, f: 0.74 },
  { label: "Android", glyph: siAndroid, f: 0.86 },
];

const ShotD: React.FC = () => {
  const [t8, t9] = D.starts;
  return (
    <Notebook theme={LIGHT}>
      <Write x={0} y={0} size={84} start={t8 + 4} dur={22}>
        Cài đặt đa nền tảng
      </Write>
      <Pen d={rectD(520, 100, 61)} x={0} y={120} start={at(t8, "s8", 0.15)} dur={24} />
      <IconTile x={20} y={130} w={80} h={80} start={at(t8, "s8", 0.15) + 12} rot={-4} glyph={siGithub} />
      <Write x={124} y={142} size={54} start={at(t8, "s8", 0.15) + 16} dur={16}>
        GitHub <Mark start={at(t8, "s8", 0.4)}>Releases</Mark>
      </Write>
      <Arrow x1={260} y1={228} x2={260} y2={282} start={at(t8, "s8", 0.4)} dur={12} color={LIGHT.red} bend={8} />
      <Pen d="M 85 306 L 85 284 L 655 284 L 655 306" start={at(t8, "s8", 0.44)} dur={20} color={LIGHT.red} />
      <Pen d="M 275 284 L 275 306" start={at(t8, "s8", 0.5)} dur={6} color={LIGHT.red} />
      <Pen d="M 465 284 L 465 306" start={at(t8, "s8", 0.5)} dur={6} color={LIGHT.red} />
      {platforms.map((p, i) => (
        <div key={p.label}>
          <IconTile
            x={i * (TILE_W + 20)}
            y={322}
            w={TILE_W}
            h={190}
            start={at(t8, "s8", p.f)}
            rot={[-2, 1.5, -1, 2][i]}
            glyph={p.glyph}
            label={p.label}
          />
        </div>
      ))}

      <Write x={0} y={604} size={58} start={t9 + 4} dur={30}>
        Anh em thấy Concat thế nào?
      </Write>
      <Sticky x={0} y={716} w={560} start={at(t9, "s9", 0.4)} rot={-2} color={STICKY.yellow} size={48}>
        <Mark start={at(t9, "s9", 0.46)} color="#FFF3A0">Lưu video</Mark> để thử lại
      </Sticky>
      <Pen d="M 0 0 L 76 0 L 76 112 L 38 80 L 0 112 Z" x={628} y={716} start={at(t9, "s9", 0.46)} dur={20} color={LIGHT.ink} fill={LIGHT.red} w={5} />
      <Sticky x={130} y={890} w={620} start={at(t9, "s9", 0.68)} rot={1.5} color={STICKY.green} size={48}>
        <Mark start={at(t9, "s9", 0.74)} color="#E8FF9E">Follow kênh</Mark> để cập nhật
        <br />
        công nghệ mới
      </Sticky>
    </Notebook>
  );
};

const ShotDAudio: React.FC = () => {
  const [t8, t9] = D.starts;
  return (
    <>
      <Voices plan={D} />
      <Sfx id="whoosh" volume={0.25} />
      {platforms.map((p) => (
        <Sfx key={p.label} id="pop" at={at(t8, "s8", p.f)} volume={0.18} />
      ))}
      <Sfx id="pop" at={at(t9, "s9", 0.4)} volume={0.25} />
      <Sfx id="ding" at={at(t9, "s9", 0.68)} volume={0.25} />
    </>
  );
};

// ---------------------------------------------------------------------------

const ConcatNotebook: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence name="A: what it is" durationInFrames={A.len}>
        <ShotA />
        <Brand />
        <ShotAAudio />
      </Series.Sequence>
      <Series.Sequence name="B: AI and editor" durationInFrames={B.len}>
        <ShotB />
        <ShotBAudio />
      </Series.Sequence>
      <Series.Sequence name="C: MCP and build" durationInFrames={C.len}>
        <ShotC />
        <ShotCAudio />
      </Series.Sequence>
      <Series.Sequence name="D: install and sign-off" durationInFrames={D.len}>
        <ShotD />
        <ShotDAudio />
      </Series.Sequence>
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: ConcatNotebook,
  durationInFrames: TOTAL,
};
