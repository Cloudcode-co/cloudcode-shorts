import { linearTiming, TransitionSeries } from "@remotion/transitions";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  beatmap,
  Brand,
  BRAND_SPACE,
  CONTENT_W,
  flash,
  FPS,
  hit,
  Meme,
  MemeCaption,
  Music,
  SAFE,
  sectionAt,
  Sfx,
  TikTokGuide,
  type VideoDef,
  type VideoProps,
  zoomPunch,
} from "../../kit";
import beatmapJson from "./beatmap.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const MAP = beatmap(beatmapJson);
const TR = 10;
const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// One still photo as the whole background showing where the line happens
// Stylized dark IT bedroom setup with monitors and neon backlight at 2 AM
const BG_IMAGE = "images/gaming-setup-dark-room-pixabay-8431262.jpg";

type MemeSpec = {
  file: string;
  width: number;
  height: number;
  w: number;
  left?: number;
  mirror?: boolean;
};

type SceneConfig = {
  id: string;
  headline: string;
  fontSize: number;
  mainMeme: MemeSpec;
  partnerMeme?: MemeSpec;
  shake?: boolean;
  sfxCut?: string;
  sfxCutVol?: number;
  sfxExtra?: { id: string; at: number; frames?: number; volume: number };
};

const SCENE_CONFIGS: Record<string, SceneConfig> = {
  s1: {
    id: "s1",
    // 3 clean semantic lines, word for word from script
    headline: "Sinh viên IT 2 giờ sáng\nvừa code xong con bot AI\npush GitHub lấy le",
    fontSize: 62,
    mainMeme: {
      file: "memes/cat-typing-laptop-giphy-WUlplcMpOCEmTGBtBW.gif",
      width: 480,
      height: 328,
      w: 740,
      left: 110,
    },
    sfxCut: "thud",
    sfxCutVol: 0.35,
    sfxExtra: { id: "typing", at: 18, frames: 140, volume: 0.25 },
  },
  s2: {
    id: "s2",
    // Exactly 3 balanced lines, word for word from script, no wrapping
    headline: "Quên béng file .env chưa vào\ngitignore nhưng nghĩ bụng\nrepo vắng ai mà thèm soi",
    fontSize: 56,
    mainMeme: {
      file: "memes/cat-vibing-giphy-TXAA5G0GaioBMOjeR9.gif",
      width: 480,
      height: 480,
      w: 420,
      left: 100,
    },
    partnerMeme: {
      file: "memes/cat-sunglasses-giphy-7JA8CIHsr0IfYPZpOE.gif",
      width: 450,
      height: 330,
      w: 430,
      left: 450,
      mirror: true,
    },
    sfxCut: "whoosh",
    sfxCutVol: 0.32,
    sfxExtra: { id: "pop", at: 24, volume: 0.26 },
  },
  s3: {
    id: "s3",
    // 3 punchy balanced lines on the Drop
    headline: "Đúng mười phút sau\nbot cào tự động húp trọn\ncái API key mang đi cày",
    fontSize: 62,
    mainMeme: {
      file: "memes/cat-shocked-giphy-NEmydmd0cXFdj4ZH9m.gif",
      width: 480,
      height: 480,
      w: 680,
      left: 150,
    },
    sfxCut: "thud",
    sfxCutVol: 0.6,
    sfxExtra: { id: "pixel", at: 6, volume: 0.35 },
  },
  s4: {
    id: "s4",
    // 3 balanced lines with no single-word overflow
    headline: "App ngân hàng nổ ting ting\nliên tục thông báo trừ tiền\ntoken Claude tới tấp",
    fontSize: 58,
    mainMeme: {
      file: "memes/cat-scream-giphy-wgMv9pODE5jXElcpwt.gif",
      width: 480,
      height: 480,
      w: 700,
      left: 140,
    },
    shake: true,
    sfxCut: "ding",
    sfxCutVol: 0.45,
    sfxExtra: { id: "thud", at: 12, volume: 0.38 },
  },
  s5: {
    id: "s5",
    // 3 celebratory lines, word for word, no lone words
    headline: "Thần may mắn độ liền\nvì tài khoản thẻ visa\ncòn đúng bốn mươi hai nghìn",
    fontSize: 58,
    mainMeme: {
      file: "memes/cat-dancing-happy-giphy-r7ZzwJ34ueeQTpnwNx.gif",
      width: 480,
      height: 480,
      w: 430,
      left: 100,
    },
    partnerMeme: {
      file: "memes/cat-vibing-giphy-TXAA5G0GaioBMOjeR9.gif",
      width: 480,
      height: 480,
      w: 420,
      left: 460,
      mirror: true,
    },
    sfxCut: "ding",
    sfxCutVol: 0.4,
    sfxExtra: { id: "pop", at: 20, volume: 0.28 },
  },
};

const IDS = ["s1", "s2", "s3", "s4", "s5"] as const;
const LENS = IDS.map((id) => Math.round(timeline.scenes[id].length * FPS));
const TOTAL = LENS.reduce((a, b) => a + b, 0);

const STARTS: number[] = [];
let accumulated = 0;
for (const len of LENS) {
  STARTS.push(accumulated);
  accumulated += len;
}

const Scene: React.FC<{
  id: string;
  len: number;
  globalStart: number;
  first?: boolean;
}> = ({ id, len, globalStart, first }) => {
  const f = useCurrentFrame();
  const globalFrame = globalStart + f;
  const config = SCENE_CONFIGS[id];
  const sec = sectionAt(MAP, globalFrame);

  // Musical pump driven by beatmap
  const pump =
    sec.energy > 0.65
      ? 0.02 * hit(MAP.beats, globalFrame, 8) + 0.04 * hit(MAP.downbeats, globalFrame, 10)
      : 0.025 * hit(MAP.downbeats, globalFrame, 10);

  // Gentle camera drift building up in place
  const drift = interpolate(f, [0, len], [1.03, 1.09], {
    extrapolateRight: "clamp",
  });

  // Headline caption entrance pop
  const capIn = interpolate(f, [0, 8], [1.14, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: easeOut,
  });

  // Cat rhythm bounce on downbeats
  const catBounce = 0.045 * hit(MAP.downbeats, globalFrame, 8);

  // Panic trembling for scene 4 (credit card being drained)
  const shakeX = config.shake ? Math.sin(f * 0.9) * 6 : 0;
  const shakeY = config.shake ? Math.cos(f * 0.7) * 4 : 0;

  // Positioning
  const bottomAnchor = 1920 - SAFE.bottom - 10;
  const captionTop = first ? SAFE.top + BRAND_SPACE + 20 : SAFE.top + 20;

  const { mainMeme, partnerMeme } = config;
  const mainH = Math.round((mainMeme.w * mainMeme.height) / mainMeme.width);

  return (
    <AbsoluteFill style={{ backgroundColor: "#06080E", overflow: "hidden" }}>
      {/* Whole background photo: dark bedroom tech desk setup */}
      <AbsoluteFill
        style={{
          transform: `scale(${drift + pump}) translate(${shakeX * 0.3}px, ${shakeY * 0.3}px)`,
          transformOrigin: "50% 45%",
        }}
      >
        <Img
          src={staticFile(`videos/${SLUG}/${BG_IMAGE}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.58) saturate(1.2)",
          }}
        />
      </AbsoluteFill>

      {/* Dark gradient overlay for contrast with yellow text and animated stickers */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0.52) 100%)",
        }}
      />

      {/* Meme animals acting out the line in the lower half */}
      {partnerMeme ? (
        // Two meme animals facing each other (mirrored)
        <>
          <Meme
            slug={SLUG}
            file={mainMeme.file}
            width={mainMeme.width}
            height={mainMeme.height}
            style={{
              left: mainMeme.left ?? 100,
              top: bottomAnchor - mainH,
              width: mainMeme.w,
              transform: `scale(${1 + catBounce})`,
              transformOrigin: "50% 100%",
            }}
          />
          {(() => {
            const partnerH = Math.round(
              (partnerMeme.w * partnerMeme.height) / partnerMeme.width,
            );
            return (
              <Meme
                slug={SLUG}
                file={partnerMeme.file}
                width={partnerMeme.width}
                height={partnerMeme.height}
                style={{
                  left: partnerMeme.left ?? 460,
                  top: bottomAnchor - partnerH,
                  width: partnerMeme.w,
                  transform: `scaleX(${partnerMeme.mirror ? -1 : 1}) scale(${1 + catBounce})`,
                  transformOrigin: "50% 100%",
                }}
              />
            );
          })()}
        </>
      ) : (
        // Single meme animal centered in the lower half
        <Meme
          slug={SLUG}
          file={mainMeme.file}
          width={mainMeme.width}
          height={mainMeme.height}
          style={{
            left: (mainMeme.left ?? (1080 - mainMeme.w) / 2) + shakeX,
            top: bottomAnchor - mainH + shakeY,
            width: mainMeme.w,
            transform: `scale(${1 + catBounce})`,
            transformOrigin: "50% 100%",
          }}
        />
      )}

      {/* Big yellow outlined caption in plain spoken Vietnamese at the top */}
      <MemeCaption
        text={config.headline}
        size={config.fontSize}
        color="#FFE600"
        outline="#000000"
        style={{
          left: SAFE.left,
          width: CONTENT_W,
          top: captionTop,
          whiteSpace: "pre-line",
          lineHeight: 1.28,
          transform: `scale(${capIn})`,
          transformOrigin: "50% 30%",
        }}
      />

      {/* Opening shot carries the kit Brand lockup */}
      {first && <Brand />}

      {/* Sound effects */}
      {config.sfxCut && (
        <Sfx id={config.sfxCut} volume={config.sfxCutVol ?? 0.35} />
      )}
      {config.sfxExtra && (
        <Sfx
          id={config.sfxExtra.id}
          at={config.sfxExtra.at}
          frames={config.sfxExtra.frames}
          volume={config.sfxExtra.volume}
        />
      )}
    </AbsoluteFill>
  );
};

const LeakedApiKeyVideo: React.FC<VideoProps> = ({ guide }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#06080E" }}>
      <TransitionSeries>
        {IDS.flatMap((id, i) => {
          const isLast = i === IDS.length - 1;
          const duration = LENS[i] + (isLast ? 0 : TR);
          const items = [
            <TransitionSeries.Sequence
              key={id}
              name={id}
              durationInFrames={duration}
            >
              <Scene
                id={id}
                len={duration}
                globalStart={STARTS[i]}
                first={i === 0}
              />
            </TransitionSeries.Sequence>,
          ];

          if (!isLast) {
            const timing = linearTiming({ durationInFrames: TR });
            // Alternate between zoomPunch and flash (flash into Drop at s3 and Punchline at s5)
            items.push(
              i === 1 || i === 3 ? (
                <TransitionSeries.Transition
                  key={`tr-${id}`}
                  presentation={flash("#ffffff")}
                  timing={timing}
                />
              ) : (
                <TransitionSeries.Transition
                  key={`tr-${id}`}
                  presentation={zoomPunch()}
                  timing={timing}
                />
              ),
            );
          }

          return items;
        })}
      </TransitionSeries>

      {/* Meme format: silent explainer, background music plays at level 0.55 */}
      <Music slug={SLUG} total={TOTAL} voiceRanges={[]} level={0.55} />

      {/* TikTok UI safe overlay guide */}
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: LeakedApiKeyVideo,
  durationInFrames: TOTAL,
};
