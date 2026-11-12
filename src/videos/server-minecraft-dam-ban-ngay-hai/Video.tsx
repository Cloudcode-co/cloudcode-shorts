import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  beatmap,
  Brand,
  display,
  easeOut,
  hit,
  Meme,
  MemeCaption,
  Music,
  SAFE,
  sans,
  sectionAt,
  Sfx,
  TikTokGuide,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import beatsData from "./beatmap.json";
import timeline from "./timeline.json";

const SLUG = "server-minecraft-dam-ban-ngay-hai";
const TOTAL = Math.round(timeline.total * 60); // 1470 frames
const MAP = beatmap(beatsData);

// Background photo of gaming setup
const BG_IMAGE = "images/pc-setup-pixabay-289470.jpg";

// Memes
const MEME_THUMBS_UP = { file: "memes/cat-thumbs-up-giphy-2LpJ7vbsZLrNuM6mB2.gif", width: 480, height: 380 };
const MEME_TYPING = { file: "memes/cat-typing-fast-giphy-puiJGJ5TuGQcRenHji.gif", width: 480, height: 480 };
const MEME_DANCING = { file: "memes/cat-dancing-happy-giphy-r7ZzwJ34ueeQTpnwNx.gif", width: 480, height: 480 };
const MEME_SHOCKED = { file: "memes/omg-cat-giphy-VdW973aUsyVWTYuRkA.gif", width: 480, height: 480 };
const MEME_FACEPALM = { file: "memes/cat-disappointed-giphy-3L8IuNwzEAKMxUmRGF.gif", width: 360, height: 480 };
const MEME_CRYING = { file: "memes/cat-crying-rain-giphy-Ggt0IKtiYyTiHLQJFM.gif", width: 500, height: 500 };
const MEME_DOG_CRYING = { file: "memes/dog-crying-giphy-XHFV6AA8c51XygXto3.gif", width: 480, height: 480 };

// Chapters metadata
const CHAPTERS = [
  {
    from: 0,
    to: 48,
    num: "CHƯƠNG 1",
    title: "KÈO THỀ SỐNG CHẾT",
  },
  {
    from: 480,
    to: 520,
    num: "CHƯƠNG 2",
    title: "ĐÊM ĐẦU HUY HOÀNG",
  },
  {
    from: 708,
    to: 746,
    num: "CHƯƠNG 3",
    title: "ĐÚNG 24 GIỜ SAU...",
  },
  {
    from: 924,
    to: 962,
    num: "CHƯƠNG 4",
    title: "LỜI NGUYỀN SERVER 2 NGÀY",
  },
] as const;

// Transition cuts (frames where captions or chapters start)
const CUT_FRAMES = [0, 48, 252, 480, 520, 708, 746, 924, 962, 1134];

// Safe horizontal dimensions
const SAFE_WIDTH = 1080 - SAFE.left - SAFE.right; // 777px
const SAFE_CENTER_X = SAFE.left + SAFE_WIDTH / 2; // 491.5px

// Chapter title card shown before each section
const ChapterCard: React.FC<{
  num: string;
  title: string;
  from: number;
  to: number;
  first?: boolean;
}> = ({ num, title, from, to, first = false }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;

  const local = frame - from;
  const punch = interpolate(local, [0, 10], [1.18, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = interpolate(local, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        zIndex: 5,
        left: SAFE.left,
        width: SAFE_WIDTH,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        opacity: op,
        transform: `scale(${punch})`,
      }}
    >
      {first && <Brand />}
      <div
        style={{
          fontFamily: sans,
          fontSize: 38,
          fontWeight: 700,
          color: "#FFE600",
          letterSpacing: "0.18em",
          marginBottom: 16,
          textShadow: "0 4px 12px rgba(0, 0, 0, 0.9)",
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontFamily: display,
          fontSize: 66,
          fontWeight: 800,
          lineHeight: 1.15,
          color: "#FFFFFF",
          textWrap: "balance",
          textShadow: "0 6px 28px rgba(0, 0, 0, 0.95)",
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};

// Scene 1: Begging to open VPS
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const from = 48;
  const to = 252;
  if (frame < from || frame >= to) return null;

  const local = frame - from;
  const punch = interpolate(local, [0, 8], [1.14, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${punch})` }}>
      <MemeCaption
        text="Đám bạn thề sống chết chơi hết hè, năn nỉ mình bỏ tiền thuê VPS mở server"
        size={64}
        style={{
          top: 310,
          left: SAFE.left,
          width: SAFE_WIDTH,
        }}
      />
      {/* Two cats facing each other: left cat & mirrored right cat */}
      <Meme
        slug={SLUG}
        file={MEME_THUMBS_UP.file}
        width={MEME_THUMBS_UP.width}
        height={MEME_THUMBS_UP.height}
        style={{
          width: 380,
          left: 80,
          bottom: 500,
        }}
      />
      <Meme
        slug={SLUG}
        file={MEME_THUMBS_UP.file}
        width={MEME_THUMBS_UP.width}
        height={MEME_THUMBS_UP.height}
        style={{
          width: 380,
          right: SAFE.right + 10,
          bottom: 500,
          transform: "scaleX(-1)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 2: Config PaperMC all night
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const from = 252;
  const to = 480;
  if (frame < from || frame >= to) return null;

  const local = frame - from;
  const punch = interpolate(local, [0, 8], [1.14, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${punch})` }}>
      <MemeCaption
        text="Thức trắng đêm config PaperMC, chỉnh chunk mượt mà với cài cả đống plugin"
        size={64}
        style={{
          top: 270,
          left: SAFE.left,
          width: SAFE_WIDTH,
        }}
      />
      <Meme
        slug={SLUG}
        file={MEME_TYPING.file}
        width={MEME_TYPING.width}
        height={MEME_TYPING.height}
        style={{
          width: 520,
          left: SAFE_CENTER_X - 260,
          bottom: 500,
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 3: First night party
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const from = 520;
  const to = 708;
  if (frame < from || frame >= to) return null;

  const local = frame - from;
  const punch = interpolate(local, [0, 8], [1.14, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${punch})` }}>
      <MemeCaption
        text="Tối đầu tiên mở server chục thằng quẩy banh nóc, hú hét đào kim cương tới sáng"
        size={64}
        style={{
          top: 270,
          left: SAFE.left,
          width: SAFE_WIDTH,
        }}
      />
      {/* Two dancing cats facing each other */}
      <Meme
        slug={SLUG}
        file={MEME_DANCING.file}
        width={MEME_DANCING.width}
        height={MEME_DANCING.height}
        style={{
          width: 380,
          left: 80,
          bottom: 500,
        }}
      />
      <Meme
        slug={SLUG}
        file={MEME_DANCING.file}
        width={MEME_DANCING.width}
        height={MEME_DANCING.height}
        style={{
          width: 380,
          right: SAFE.right + 10,
          bottom: 500,
          transform: "scaleX(-1)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 4: 0/20 Online (The Drop / Reveal!)
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const from = 746;
  const to = 924;
  if (frame < from || frame >= to) return null;

  const local = frame - from;
  const punch = interpolate(local, [0, 10], [1.22, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${punch})` }}>
      <MemeCaption
        text="8 giờ tối hôm sau hào hứng mở máy vào kiểm tra: Server status 0/20 online"
        size={64}
        style={{
          top: 270,
          left: SAFE.left,
          width: SAFE_WIDTH,
        }}
      />
      <Meme
        slug={SLUG}
        file={MEME_SHOCKED.file}
        width={MEME_SHOCKED.width}
        height={MEME_SHOCKED.height}
        style={{
          width: 520,
          left: SAFE_CENTER_X - 260,
          bottom: 500,
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 5: Group chat excuses
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const from = 962;
  const to = 1134;
  if (frame < from || frame >= to) return null;

  const local = frame - from;
  const punch = interpolate(local, [0, 8], [1.14, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${punch})` }}>
      <MemeCaption
        text="Nhắn group hỏi thì đứa bảo buồn ngủ, đứa lướt TikTok, đứa rủ qua Valorant"
        size={64}
        style={{
          top: 270,
          left: SAFE.left,
          width: SAFE_WIDTH,
        }}
      />
      <Meme
        slug={SLUG}
        file={MEME_FACEPALM.file}
        width={MEME_FACEPALM.width}
        height={MEME_FACEPALM.height}
        style={{
          width: 520,
          left: SAFE_CENTER_X - 260,
          bottom: 500,
        }}
      />
    </AbsoluteFill>
  );
};

// Scene 6: VPS invoice 29 days left & lonely dog
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const from = 1134;
  const to = 1470;
  if (frame < from || frame >= to) return null;

  const local = frame - from;
  const punch = interpolate(local, [0, 8], [1.14, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${punch})` }}>
      <MemeCaption
        text="Nhìn hoá đơn VPS còn nguyên 29 ngày với con chó cưng ngồi bơ vơ giữa map"
        size={64}
        style={{
          top: 270,
          left: SAFE.left,
          width: SAFE_WIDTH,
        }}
      />
      {/* Crying cat on the left, crying dog on the right */}
      <Meme
        slug={SLUG}
        file={MEME_CRYING.file}
        width={MEME_CRYING.width}
        height={MEME_CRYING.height}
        style={{
          width: 380,
          left: 80,
          bottom: 500,
        }}
      />
      <Meme
        slug={SLUG}
        file={MEME_DOG_CRYING.file}
        width={MEME_DOG_CRYING.width}
        height={MEME_DOG_CRYING.height}
        style={{
          width: 380,
          right: SAFE.right + 10,
          bottom: 500,
        }}
      />
    </AbsoluteFill>
  );
};

// Flash effect on cuts
const FlashTransition: React.FC = () => {
  const frame = useCurrentFrame();

  let maxOpacity = 0;
  for (const cut of CUT_FRAMES) {
    if (frame >= cut && frame < cut + 6) {
      const op = interpolate(frame - cut, [0, 5], [0.75, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      if (op > maxOpacity) maxOpacity = op;
    }
  }

  if (maxOpacity <= 0) return null;

  return (
    <AbsoluteFill
      style={{
        zIndex: 20,
        pointerEvents: "none",
        backgroundColor: "#FFFFFF",
        opacity: maxOpacity,
      }}
    />
  );
};

const ServerMinecraftVideo: React.FC<VideoProps> = ({ guide }) => {
  const frame = useCurrentFrame();

  // DJ Cut pump on the background image
  const sec = sectionAt(MAP, frame);
  const bgPump =
    sec && sec.energy > 0.4
      ? 0.02 * hit(MAP.beats, frame, 8) + 0.03 * hit(MAP.downbeats, frame, 10)
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A", overflow: "hidden" }}>
      {/* Single still photo background matching the meme skit place */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          transform: `scale(${1 + bgPump})`,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={staticFile(`videos/${SLUG}/${BG_IMAGE}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.62) contrast(1.15)",
          }}
        />
        {/* Subtle radial vignette to focus attention on caption and meme stickers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)",
          }}
        />
      </div>

      {/* Chapters Title Cards */}
      {CHAPTERS.map((ch, i) => (
        <ChapterCard
          key={ch.num}
          num={ch.num}
          title={ch.title}
          from={ch.from}
          to={ch.to}
          first={i === 0}
        />
      ))}

      {/* Skit Shots */}
      <Scene1 />
      <Scene2 />
      <Scene3 />
      <Scene4 />
      <Scene5 />
      <Scene6 />

      {/* Quick flash transition between captions & chapters */}
      <FlashTransition />

      {/* Sound effects placed at cuts & punchlines */}
      <Sfx id="thud" at={0} volume={0.5} />
      <Sfx id="whoosh" at={48} volume={0.35} />
      <Sfx id="whoosh" at={252} volume={0.35} />
      <Sfx id="typing" at={260} frames={120} volume={0.25} />
      <Sfx id="whoosh" at={480} volume={0.4} />
      <Sfx id="pop" at={520} volume={0.35} />
      <Sfx id="thud" at={708} volume={0.45} />
      {/* The big drop reveal at frame 746 */}
      <Sfx id="thud" at={746} volume={0.65} />
      <Sfx id="pixel" at={750} volume={0.35} />
      <Sfx id="whoosh" at={924} volume={0.4} />
      <Sfx id="pop" at={962} volume={0.35} />
      <Sfx id="whoosh" at={1134} volume={0.35} />

      {/* Music ducked/leveled for meme format (silent explainer, no voiceover) */}
      <Music slug={SLUG} total={TOTAL} voiceRanges={[]} level={0.55} />

      {/* TikTok overlay guide for preview and QA */}
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: ServerMinecraftVideo,
  durationInFrames: TOTAL,
};
