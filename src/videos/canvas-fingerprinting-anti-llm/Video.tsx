import React from "react";
import { AbsoluteFill, Series } from "remotion";
import {
  FPS,
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  fit,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { KeyNumberCard } from "./components/Documentary";
import VO from "./durations.json";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";

const SLUG = "canvas-fingerprinting-anti-llm";

// Scene lengths timed to voice line + breath, never less than min animation frames
const S1_LEN = fit(VO.s1, 240);
const NUM_10K_LEN = 75;
const S2_LEN = fit(VO.s2, 660);
const NUM_1033_LEN = 75;
const S3_LEN = fit(VO.s3, 720);
const S4_LEN = fit(VO.s4, 660);
const S5_LEN = fit(VO.s5, 660);
const NUM_917K_LEN = 75;
const S6_LEN = fit(VO.s6, 780);
const S7_LEN = fit(VO.s7, 500);

const TOTAL =
  S1_LEN +
  NUM_10K_LEN +
  S2_LEN +
  NUM_1033_LEN +
  S3_LEN +
  S4_LEN +
  S5_LEN +
  NUM_917K_LEN +
  S6_LEN +
  S7_LEN;

// Frames where the voice is talking, ducking music under the voice
const VOICE_RANGES: [number, number][] = (() => {
  const ranges: [number, number][] = [];
  let at = 0;
  const say = (seconds: number) => {
    ranges.push([at, at + Math.round(seconds * FPS)]);
  };

  say(VO.s1);
  at += S1_LEN;

  // Key number 10.000: music swells
  at += NUM_10K_LEN;

  say(VO.s2);
  at += S2_LEN;

  // Key number 1.033: music swells
  at += NUM_1033_LEN;

  say(VO.s3);
  at += S3_LEN;

  // Scene 4 (turning point)
  say(VO.s4);
  at += S4_LEN;

  // Scene 5
  say(VO.s5);
  at += S5_LEN;

  // Key number 917.504: music swells
  at += NUM_917K_LEN;

  say(VO.s6);
  at += S6_LEN;

  say(VO.s7);
  at += S7_LEN;

  return ranges;
})();

const CanvasFingerprintingVideo: React.FC<VideoProps> = ({ guide }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Series>
        {/* Chapter 1: Khởi đầu */}
        <Series.Sequence name="Scene 1" durationInFrames={S1_LEN}>
          <Scene1 len={S1_LEN} />
          <Voice slug={SLUG} id="s1" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="whoosh" at={42} volume={0.25} />
        </Series.Sequence>

        {/* Key Number: 10.000 websites */}
        <Series.Sequence name="Stat 10.000" durationInFrames={NUM_10K_LEN}>
          <KeyNumberCard
            number="10.000"
            label="Website trong danh sách Tranco Top Sites"
            context="Crawl và hook API tự động bằng Playwright"
            len={NUM_10K_LEN}
          />
          <Sfx id="thud" volume={0.6} />
        </Series.Sequence>

        {/* Chapter 2: Cuộc điều tra */}
        <Series.Sequence name="Scene 2" durationInFrames={S2_LEN}>
          <Scene2 len={S2_LEN} />
          <Voice slug={SLUG} id="s2" />
          <Sfx id="whoosh" volume={0.35} />
          <Sfx id="pop" at={370} volume={0.25} />
        </Series.Sequence>

        {/* Key Number: 1.033 canvases */}
        <Series.Sequence name="Stat 1.033" durationInFrames={NUM_1033_LEN}>
          <KeyNumberCard
            number="1.033"
            label="Canvas Renderings Được Tập Hợp"
            context="Triển lãm trực tuyến tại fingerprint.garden"
            len={NUM_1033_LEN}
          />
          <Sfx id="thud" volume={0.6} />
        </Series.Sequence>

        {/* Chapter 3: Vườn Canvas */}
        <Series.Sequence name="Scene 3" durationInFrames={S3_LEN}>
          <Scene3 len={S3_LEN} />
          <Voice slug={SLUG} id="s3" />
          <Sfx id="whoosh" volume={0.35} />
          <Sfx id="pop" at={390} volume={0.25} />
        </Series.Sequence>

        {/* Chapter 4: Bước ngoặt bẫy sinh học */}
        <Series.Sequence name="Scene 4 (Turning Point)" durationInFrames={S4_LEN}>
          <Scene4 len={S4_LEN} />
          <Voice slug={SLUG} id="s4" />
          <Sfx id="thud" volume={0.5} />
          <Sfx id="whoosh" at={40} volume={0.35} />
          <Sfx id="pixel" at={180} volume={0.35} />
          <Sfx id="whoosh" at={430} volume={0.3} />
        </Series.Sequence>

        {/* Chapter 5: Astra vs GLM-5.3 */}
        <Series.Sequence name="Scene 5" durationInFrames={S5_LEN}>
          <Scene5 len={S5_LEN} />
          <Voice slug={SLUG} id="s5" />
          <Sfx id="whoosh" volume={0.35} />
          <Sfx id="ding" at={350} volume={0.35} />
        </Series.Sequence>

        {/* Key Number: 917.504 offset */}
        <Series.Sequence name="Stat 917.504" durationInFrames={NUM_917K_LEN}>
          <KeyNumberCard
            number="917.504"
            label="Độ Lệch Mã Unicode Giấu Prompt"
            context="String.fromCodePoint(c.codePointAt(0) - 917504)"
            len={NUM_917K_LEN}
          />
          <Sfx id="thud" volume={0.6} />
        </Series.Sequence>

        {/* Chapter 6: Mã vô hình */}
        <Series.Sequence name="Scene 6" durationInFrames={S6_LEN}>
          <Scene6 len={S6_LEN} />
          <Voice slug={SLUG} id="s6" />
          <Sfx id="whoosh" volume={0.35} />
          <Sfx id="pixel" at={410} volume={0.3} />
        </Series.Sequence>

        {/* Chapter 7: Bài học & CTA */}
        <Series.Sequence name="Scene 7" durationInFrames={S7_LEN}>
          <Scene7 len={S7_LEN} />
          <Voice slug={SLUG} id="s7" />
          <Sfx id="whoosh" volume={0.35} />
          <Sfx id="pop" at={290} volume={0.25} />
        </Series.Sequence>
      </Series>

      <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />

      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: CanvasFingerprintingVideo,
  durationInFrames: TOTAL,
};
