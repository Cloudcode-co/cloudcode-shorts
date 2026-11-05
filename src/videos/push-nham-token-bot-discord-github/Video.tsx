// Meme skit: one dark tech workspace photo behind everything, meme cats acting
// out each line in the lower half, with big outlined MemeCaption at the top.
// Fast cuts every 1.4s–1.5s with punchy zoom and flash transitions.
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  BRAND_SPACE,
  Brand,
  CONTENT_W,
  Meme,
  MemeCaption,
  Music,
  SAFE,
  Sfx,
  TikTokGuide,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import script from "./script.json";

const SLUG = script.slug;
const BG = "images/workspace-dark-pixabay-8431262.jpg";

type SingleMeme = {
  file: string;
  w: number;
  h: number;
  width?: number;
  mirror?: boolean;
  bottom?: number;
};

type DualMeme = {
  left: { file: string; w: number; h: number; width?: number; mirror?: boolean; left?: number };
  right: { file: string; w: number; h: number; width?: number; mirror?: boolean; left?: number };
  bottom?: number;
};

type ShotDef = {
  id: string;
  text: string;
  duration: number;
  size?: number;
  first?: boolean;
  hasPunch?: boolean;
  hasFlash?: boolean;
  sfx?: { id: string; volume?: number };
  meme?: SingleMeme;
  dual?: DualMeme;
};

const SHOTS: ShotDef[] = [
  // Scene 1: 270 frames (Hook)
  {
    id: "s1-1",
    text: "Dev 2 giờ sáng hí hửng",
    duration: 90,
    size: 78,
    first: true,
    hasPunch: true,
    sfx: { id: "thud", volume: 0.35 },
    meme: {
      file: "memes/cat-typing-laptop-giphy-WUlplcMpOCEmTGBtBW.gif",
      w: 500,
      h: 343,
      width: 740,
    },
  },
  {
    id: "s1-2",
    text: "code xong con bot Discord tích hợp AI",
    duration: 90,
    size: 74,
    hasPunch: true,
    hasFlash: true,
    sfx: { id: "pop", volume: 0.28 },
    meme: {
      file: "memes/cat-sunglasses-giphy-7JA8CIHsr0IfYPZpOE.gif",
      w: 450,
      h: 330,
      width: 740,
    },
  },
  {
    id: "s1-3",
    text: "cho anh em chém gió",
    duration: 90,
    size: 82,
    hasPunch: true,
    sfx: { id: "whoosh", volume: 0.28 },
    dual: {
      left: {
        file: "memes/cat-sunglasses-giphy-7JA8CIHsr0IfYPZpOE.gif",
        w: 450,
        h: 330,
        width: 440,
        left: 70,
        mirror: true,
      },
      right: {
        file: "memes/popcat-giphy-Wf9dyOrB0nGJn5FIYf.gif",
        w: 270,
        h: 480,
        width: 330,
        left: 520,
        mirror: true,
      },
    },
  },

  // Scene 2: 252 frames (Hook)
  {
    id: "s2-1",
    text: "Quen tay git add chấm,",
    duration: 84,
    size: 80,
    hasPunch: true,
    hasFlash: true,
    sfx: { id: "whoosh", volume: 0.3 },
    meme: {
      file: "memes/cat-typing-laptop-giphy-WUlplcMpOCEmTGBtBW.gif",
      w: 500,
      h: 343,
      width: 740,
      mirror: true,
    },
  },
  {
    id: "s2-2",
    text: "git commit fix bug",
    duration: 84,
    size: 82,
    hasPunch: true,
    sfx: { id: "pop", volume: 0.28 },
    meme: {
      file: "memes/cat-dancing-happy-giphy-r7ZzwJ34ueeQTpnwNx.gif",
      w: 480,
      h: 480,
      width: 740,
    },
  },
  {
    id: "s2-3",
    text: "rồi git push origin main đi ngủ",
    duration: 84,
    size: 76,
    hasPunch: true,
    hasFlash: true,
    sfx: { id: "ding", volume: 0.3 },
    meme: {
      file: "memes/cat-jumping-giphy-eDivWO7eIblEP6pq6w.gif",
      w: 500,
      h: 381,
      width: 740,
    },
  },

  // Scene 3: 270 frames (Build)
  {
    id: "s3-1",
    text: "Vừa đặt lưng xuống",
    duration: 90,
    size: 82,
    hasPunch: true,
    sfx: { id: "thud", volume: 0.35 },
    meme: {
      file: "memes/cat-sleeping-giphy-rRHR5IFJ7ygfBPlmdO.gif",
      w: 480,
      h: 386,
      width: 720,
    },
  },
  {
    id: "s3-2",
    text: "thì điện thoại ting ting",
    duration: 90,
    size: 82,
    hasPunch: true,
    hasFlash: true,
    sfx: { id: "ding", volume: 0.35 },
    meme: {
      file: "memes/cat-shocked-panic-giphy-yDt8QT3eMxg4pPgygu.gif",
      w: 480,
      h: 480,
      width: 740,
    },
  },
  {
    id: "s3-3",
    text: "10 cái mail GitGuardian cảnh báo lộ token",
    duration: 90,
    size: 72,
    hasPunch: true,
    sfx: { id: "whoosh", volume: 0.32 },
    meme: {
      file: "memes/cat-screaming-giphy-SH8s8xDq69Oda9RMPj.gif",
      w: 480,
      h: 480,
      width: 740,
    },
  },

  // Scene 4: 270 frames (Build)
  {
    id: "s4-1",
    text: "Bật vội máy check thẻ tín dụng",
    duration: 90,
    size: 76,
    hasPunch: true,
    hasFlash: true,
    sfx: { id: "whoosh", volume: 0.3 },
    meme: {
      file: "memes/cat-typing-laptop-giphy-WUlplcMpOCEmTGBtBW.gif",
      w: 500,
      h: 343,
      width: 740,
    },
  },
  {
    id: "s4-2",
    text: "với OpenAI",
    duration: 90,
    size: 86,
    hasPunch: true,
    sfx: { id: "pop", volume: 0.28 },
    meme: {
      file: "memes/cat-headache-giphy-IZc7cNWDdp530OSnrp.gif",
      w: 448,
      h: 480,
      width: 700,
    },
  },
  {
    id: "s4-3",
    text: "thấy bay sạch 100 đô trong 2 phút",
    duration: 90,
    size: 74,
    hasPunch: true,
    hasFlash: true,
    sfx: { id: "thud", volume: 0.4 },
    meme: {
      file: "memes/cat-crying-scream-giphy-j2ABrvu3ZG2e9e72f6.gif",
      w: 600,
      h: 600,
      width: 740,
    },
  },

  // Scene 5: 360 frames (Punchline)
  {
    id: "s5-1",
    text: "Nhóm bạn Discord vừa ping:",
    duration: 90,
    size: 78,
    hasPunch: true,
    sfx: { id: "ding", volume: 0.35 },
    meme: {
      file: "memes/popcat-giphy-Wf9dyOrB0nGJn5FIYf.gif",
      w: 270,
      h: 480,
      width: 520,
    },
  },
  {
    id: "s5-2",
    text: "Bot mượt quá mày,",
    duration: 90,
    size: 82,
    hasPunch: true,
    hasFlash: true,
    sfx: { id: "pop", volume: 0.3 },
    dual: {
      left: {
        file: "memes/crying-cat-meme-giphy-qxRMbqPKaXbUYB28Eu.gif",
        w: 467,
        h: 480,
        width: 440,
        left: 70,
      },
      right: {
        file: "memes/cat-dancing-happy-giphy-r7ZzwJ34ueeQTpnwNx.gif",
        w: 480,
        h: 480,
        width: 420,
        left: 510,
        mirror: true,
      },
    },
  },
  {
    id: "s5-3",
    text: "tao share link",
    duration: 90,
    size: 84,
    hasPunch: true,
    sfx: { id: "whoosh", volume: 0.3 },
    meme: {
      file: "memes/cat-laughing-giphy-PwiA9yeNye5PPstRdZ.gif",
      w: 480,
      h: 480,
      width: 620,
    },
  },
  {
    id: "s5-4",
    text: "cho cả trường dùng rồi",
    duration: 90,
    size: 80,
    hasPunch: true,
    hasFlash: true,
    sfx: { id: "thud", volume: 0.45 },
    meme: {
      file: "memes/crying-cat-meme-giphy-qxRMbqPKaXbUYB28Eu.gif",
      w: 467,
      h: 480,
      width: 760,
    },
  },
];

const TOTAL_FRAMES = SHOTS.reduce((acc, s) => acc + s.duration, 0);

// TikTok center of safe viewing area: (SAFE.left + (1080 - SAFE.right)) / 2 = (103 + 880) / 2 = 491.5
const SAFE_CENTER_X = 490;

const Shot: React.FC<{ shot: ShotDef }> = ({ shot }) => {
  const frame = useCurrentFrame();

  // Fast zoom punch on entrance (8 frames)
  const punch = shot.hasPunch
    ? interpolate(frame, [0, 8], [1.14, 1], {
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.23, 1, 0.32, 1),
      })
    : 1;

  // Blinding white flash on cut (4 frames)
  const flashOpacity =
    shot.hasFlash && frame < 5
      ? interpolate(frame, [0, 4], [0.85, 0], { extrapolateRight: "clamp" })
      : 0;

  const top = shot.first ? SAFE.top + BRAND_SPACE + 20 : SAFE.top + 20;

  return (
    <AbsoluteFill>
      {/* Caption at top */}
      <MemeCaption
        text={shot.text}
        size={shot.size ?? 78}
        style={{
          left: SAFE.left,
          width: CONTENT_W,
          top,
          transform: `scale(${punch})`,
          transformOrigin: "50% 50%",
        }}
      />

      {/* Single meme animal */}
      {shot.meme && (
        <Meme
          slug={SLUG}
          file={shot.meme.file}
          width={shot.meme.w}
          height={shot.meme.h}
          style={{
            left: SAFE_CENTER_X - (shot.meme.width ?? 720) / 2,
            width: shot.meme.width ?? 720,
            bottom: shot.meme.bottom ?? SAFE.bottom + 35,
            transformOrigin: "50% 100%",
            transform: `scale(${punch}) scaleX(${shot.meme.mirror ? -1 : 1})`,
          }}
        />
      )}

      {/* Two meme animals facing each other */}
      {shot.dual && (
        <>
          <Meme
            slug={SLUG}
            file={shot.dual.left.file}
            width={shot.dual.left.w}
            height={shot.dual.left.h}
            style={{
              left: shot.dual.left.left ?? 70,
              width: shot.dual.left.width ?? 420,
              bottom: shot.dual.bottom ?? SAFE.bottom + 35,
              transformOrigin: "50% 100%",
              transform: `scale(${punch}) scaleX(${shot.dual.left.mirror ? -1 : 1})`,
            }}
          />
          <Meme
            slug={SLUG}
            file={shot.dual.right.file}
            width={shot.dual.right.w}
            height={shot.dual.right.h}
            style={{
              left: shot.dual.right.left ?? 510,
              width: shot.dual.right.width ?? 420,
              bottom: shot.dual.bottom ?? SAFE.bottom + 35,
              transformOrigin: "50% 100%",
              transform: `scale(${punch}) scaleX(${shot.dual.right.mirror ? -1 : 1})`,
            }}
          />
        </>
      )}

      {/* Quick flash overlay on cut */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: flashOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Cut sound effect */}
      {shot.sfx && <Sfx id={shot.sfx.id} volume={shot.sfx.volume ?? 0.3} />}
    </AbsoluteFill>
  );
};

const Video: React.FC<VideoProps> = ({ guide }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#080B10" }}>
      {/* Whole background: developer desk setup at night */}
      <Img
        src={staticFile(`videos/${SLUG}/${BG}`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(0, 0, 0, 0.44)" }} />

      {/* Sequence of fast meme skit shots */}
      <Series>
        {SHOTS.map((shot) => (
          <Series.Sequence
            key={shot.id}
            name={shot.id}
            durationInFrames={shot.duration}
          >
            <Shot shot={shot} />
            {shot.first && <Brand />}
          </Series.Sequence>
        ))}
      </Series>

      {/* Music with meme volume */}
      <Music
        slug={SLUG}
        total={TOTAL_FRAMES}
        voiceRanges={[]}
        level={0.55}
      />

      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: Video,
  durationInFrames: TOTAL_FRAMES,
};
