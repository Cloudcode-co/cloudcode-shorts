import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  BRAND_SPACE,
  Brand,
  FPS,
  Meme,
  MemeCaption,
  Music,
  SAFE,
  SIDE_CROP,
  Sfx,
  TikTokGuide,
  beatmap,
  flash,
  hit,
  sectionAt,
  zoomPunch,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import beatmapJson from "./beatmap.json";
import script from "./script.json";
import timeline from "./timeline.json";

const SLUG = script.slug;
const MAP = beatmap(beatmapJson);
const TR = 10;
const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

// Background still photos per place (changed only when the place changes)
// Place 1 (s1, s2): Bedroom desk with homelab laptop
// Place 2 (s3, s4): Classroom in Vietnam (at school when alert sounds)
// Place 3 (s5): Home with electric fan plugged in
const PLACES: Record<string, string> = {
  s1: "images/desk-laptop-pixabay-4222025.jpg",
  s2: "images/desk-laptop-pixabay-4222025.jpg",
  s3: "images/classroom-pixabay-10377109.jpg",
  s4: "images/classroom-pixabay-10377109.jpg",
  s5: "images/electric-fan-pixabay-144499.jpg",
};

type SceneConfig = {
  id: string;
  headline: string;
  mainMeme: { file: string; width: number; height: number; w: number };
  partnerMeme?: { file: string; width: number; height: number; w: number };
  sfxCut?: string;
  sfxBeat?: string;
};

const SCENE_CONFIGS: Record<string, SceneConfig> = {
  s1: {
    id: "s1",
    headline: "Sinh viên IT tận dụng con laptop cũ\ngãy bản lề làm server cắm 24/7",
    mainMeme: {
      file: "memes/cat-typing-laptop-giphy-WUlplcMpOCEmTGBtBW.gif",
      width: 500,
      height: 343,
      w: 560,
    },
    sfxCut: "whoosh",
    sfxBeat: "pop",
  },
  s2: {
    id: "s2",
    headline: "Tự hào khoe anh em uptime 99 ngày,\ngáy to hơn cả Senior DevOps",
    mainMeme: {
      file: "memes/cat-dancing-giphy-oNngkg8JedLXxrLWBi.gif",
      width: 480,
      height: 480,
      w: 380,
    },
    partnerMeme: {
      file: "memes/cat-thumbs-up-giphy-2LpJ7vbsZLrNuM6mB2.gif",
      width: 480,
      height: 379,
      w: 360,
    },
    sfxCut: "pop",
    sfxBeat: "pop",
  },
  s3: {
    id: "s3",
    headline: "Đang trên trường\nthì Telegram réo inh ỏi:\nCụm server bay màu không dấu vết",
    mainMeme: {
      file: "memes/surprised-cat-giphy-NEmydmd0cXFdj4ZH9m.gif",
      width: 500,
      height: 500,
      w: 520,
    },
    sfxCut: "thud",
    sfxBeat: "pixel",
  },
  s4: {
    id: "s4",
    headline: "Mồ hôi lạnh toát ra,\ntưởng chập điện nổ bình\nvội mở camera check gấp",
    mainMeme: {
      file: "memes/cat-scream-giphy-cVOLDjWXc2WavRzRvq.gif",
      width: 480,
      height: 360,
      w: 560,
    },
    sfxCut: "whoosh",
    sfxBeat: "pop",
  },
  s5: {
    id: "s5",
    headline: "Thấy mẹ vừa rút phích cắm server ra\nđể cắm quạt máy vì trời nóng",
    mainMeme: {
      file: "memes/crying-cat-meme-giphy-qxRMbqPKaXbUYB28Eu.gif",
      width: 467,
      height: 480,
      w: 520,
    },
    sfxCut: "ding",
    sfxBeat: "pop",
  },
};

const Scene: React.FC<{
  id: string;
  len: number;
  globalStart: number;
  first?: boolean;
}> = ({ id, len, globalStart, first }) => {
  const f = useCurrentFrame();
  const globalFrame = globalStart + f;
  const config = SCENE_CONFIGS[id];
  const bgImage = PLACES[id];
  const sec = sectionAt(MAP, globalFrame);

  // Musical pump driven by beatmap: active during high energy drop
  const pump =
    sec.energy > 0.65
      ? 0.02 * hit(MAP.beats, globalFrame, 8) + 0.045 * hit(MAP.downbeats, globalFrame, 12)
      : sec.energy > 0.35
        ? 0.025 * hit(MAP.downbeats, globalFrame, 10)
        : 0;

  // Gentle camera drift
  const drift = interpolate(f, [0, len], [1.04, 1.1]);

  // Caption entrance pop
  const capIn = interpolate(f, [0, 9], [1.16, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: easeOut,
  });

  // Cat bounce on downbeats
  const catBounce = 0.05 * hit(MAP.downbeats, globalFrame, 10);

  // Layout calculations
  const bottomAnchor = 1920 - SAFE.bottom - 20;

  // Caption container positioning
  const captionTop = first ? SAFE.top + BRAND_SPACE + 20 : SAFE.top + 20;
  const captionWidth = 1080 - (SIDE_CROP + 20) * 2;
  const captionLeft = (1080 - captionWidth) / 2;

  const { mainMeme, partnerMeme } = config;
  const mainH = Math.round((mainMeme.w * mainMeme.height) / mainMeme.width);

  return (
    <AbsoluteFill style={{ backgroundColor: "#08080c", overflow: "hidden" }}>
      {/* Background still photo showing where the line happens */}
      <AbsoluteFill
        style={{
          transform: `scale(${drift + pump})`,
          transformOrigin: "50% 45%",
        }}
      >
        <Img
          src={staticFile(`videos/${SLUG}/${bgImage}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.62) saturate(1.15)",
          }}
        />
      </AbsoluteFill>

      {/* Vignette / dark overlay for optimal caption and sticker contrast */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Meme animals acting out the scene in the lower half */}
      {partnerMeme ? (
        // Two meme animals facing each other (mirrored)
        <>
          {/* Left cat: Dancing IT student */}
          <Meme
            slug={SLUG}
            file={mainMeme.file}
            width={mainMeme.width}
            height={mainMeme.height}
            style={{
              left: 110,
              top: bottomAnchor - mainH,
              width: mainMeme.w,
              transform: `scale(${1 + catBounce})`,
              transformOrigin: "50% 100%",
            }}
          />
          {/* Right cat: Friend giving thumbs up, mirrored */}
          {(() => {
            const partnerH = Math.round((partnerMeme.w * partnerMeme.height) / partnerMeme.width);
            return (
              <Meme
                slug={SLUG}
                file={partnerMeme.file}
                width={partnerMeme.width}
                height={partnerMeme.height}
                style={{
                  left: 500,
                  top: bottomAnchor - partnerH + 20,
                  width: partnerMeme.w,
                  transform: `scaleX(-1) scale(${1 + catBounce})`,
                  transformOrigin: "50% 100%",
                }}
              />
            );
          })()}
        </>
      ) : (
        // Single meme cat centered in the lower half
        <Meme
          slug={SLUG}
          file={mainMeme.file}
          width={mainMeme.width}
          height={mainMeme.height}
          style={{
            left: (1080 - mainMeme.w) / 2,
            top: bottomAnchor - mainH,
            width: mainMeme.w,
            transform: `scale(${1 + catBounce})`,
            transformOrigin: "50% 100%",
          }}
        />
      )}

      {/* Plain spoken Vietnamese big MemeCaption at the top (yellow with black outline) */}
      <MemeCaption
        text={config.headline}
        size={56}
        color="#FFE600"
        outline="#000000"
        style={{
          left: captionLeft,
          width: captionWidth,
          top: captionTop,
          whiteSpace: "pre-line",
          lineHeight: 1.28,
          transform: `scale(${capIn})`,
          transformOrigin: "50% 20%",
        }}
      />

      {/* Opening shot carries the kit Brand lockup */}
      {first && <Brand />}

      {/* Sound effects */}
      {config.sfxCut && <Sfx id={config.sfxCut} volume={0.32} />}
      {config.sfxBeat && <Sfx id={config.sfxBeat} at={16} volume={0.25} />}
    </AbsoluteFill>
  );
};

const IDS = ["s1", "s2", "s3", "s4", "s5"] as const;
const LENS = IDS.map((id) => Math.round(timeline.scenes[id].length * FPS));
const TOTAL = LENS.reduce((a, b) => a + b, 0);

// Global start frames per scene
const STARTS: number[] = [];
let accumulated = 0;
for (const len of LENS) {
  STARTS.push(accumulated);
  accumulated += len;
}

const HomelabLaptopCuMatDien: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <TransitionSeries>
      {IDS.flatMap((id, i) => {
        const isLast = i === IDS.length - 1;
        const duration = LENS[i] + (isLast ? 0 : TR);
        const items = [
          <TransitionSeries.Sequence key={id} name={id} durationInFrames={duration}>
            <Scene id={id} len={duration} globalStart={STARTS[i]} first={i === 0} />
          </TransitionSeries.Sequence>,
        ];

        if (!isLast) {
          const timing = linearTiming({ durationInFrames: TR });
          // Alternate between zoomPunch and flash (especially flash into the Drop at s3 and Outro at s5)
          items.push(
            i === 1 || i === 3 ? (
              <TransitionSeries.Transition key={`tr-${id}`} presentation={flash("#ffffff")} timing={timing} />
            ) : (
              <TransitionSeries.Transition key={`tr-${id}`} presentation={zoomPunch()} timing={timing} />
            ),
          );
        }

        return items;
      })}
    </TransitionSeries>

    {/* Silent meme skit: music plays at full level with no voiceover ducking */}
    <Music slug={SLUG} total={TOTAL} voiceRanges={[]} level={0.55} />

    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: HomelabLaptopCuMatDien,
  durationInFrames: TOTAL,
};
