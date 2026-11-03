import type { FC } from "react";
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
import VO from "./durations.json";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";
import { Scene8 } from "./scenes/Scene8";
import { Scene9 } from "./scenes/Scene9";

const SLUG = "tu-host-peach-metadata-manager";

// Each shot lasts as long as its voiceover clip plus breath
const S1 = fit(VO.s1, 240);
const S2 = fit(VO.s2, 360);
const S3 = fit(VO.s3, 420);
const S4 = fit(VO.s4, 360);
const S5 = fit(VO.s5, 360);
const S6 = fit(VO.s6, 420);
const S7 = fit(VO.s7, 360);
const S8 = fit(VO.s8, 360);
const S9 = fit(VO.s9, 360) + 60; // Hold end card 1s extra for signoff

const TOTAL = S1 + S2 + S3 + S4 + S5 + S6 + S7 + S8 + S9;

// Calculate voice talking ranges for music ducking
const VOICE_RANGES: [number, number][] = (() => {
  const ranges: [number, number][] = [];
  let at = 0;
  const say = (seconds: number, len: number) => {
    ranges.push([at, at + Math.round(seconds * FPS)]);
    at += len;
  };
  say(VO.s1, S1);
  say(VO.s2, S2);
  say(VO.s3, S3);
  say(VO.s4, S4);
  say(VO.s5, S5);
  say(VO.s6, S6);
  say(VO.s7, S7);
  say(VO.s8, S8);
  say(VO.s9, S9);
  return ranges;
})();

const PeachMetadataManagerVideo: FC<VideoProps> = ({ guide }) => {
  return (
    <AbsoluteFill>
      <Series>
        {/* Scene 1: Hook */}
        <Series.Sequence name="Scene 1: Hook" durationInFrames={S1}>
          <Scene1 len={S1} />
          <Voice slug={SLUG} id="s1" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="pop" at={42} volume={0.25} />
          <Sfx id="pop" at={90} volume={0.25} />
          <Sfx id="thud" at={155} volume={0.3} />
          <Sfx id="ding" at={220} volume={0.3} />
        </Series.Sequence>

        {/* Scene 2: Intro Peach */}
        <Series.Sequence name="Scene 2: Intro" durationInFrames={S2}>
          <Scene2 slug={SLUG} len={S2} />
          <Voice slug={SLUG} id="s2" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="pop" at={38} volume={0.3} />
          <Sfx id="thud" at={105} volume={0.35} />
          <Sfx id="pop" at={175} volume={0.25} />
          <Sfx id="ding" at={250} volume={0.3} />
          <Sfx id="thud" at={325} volume={0.25} />
        </Series.Sequence>

        {/* Scene 3: Auto Scrape */}
        <Series.Sequence name="Scene 3: Scrape" durationInFrames={S3}>
          <Scene3 len={S3} />
          <Voice slug={SLUG} id="s3" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="pixel" at={42} volume={0.3} />
          <Sfx id="pop" at={115} volume={0.25} />
          <Sfx id="pop" at={200} volume={0.25} />
          <Sfx id="pop" at={285} volume={0.25} />
          <Sfx id="ding" at={390} volume={0.3} />
        </Series.Sequence>

        {/* Scene 4: Local Edits & Storage */}
        <Series.Sequence name="Scene 4: Local Storage" durationInFrames={S4}>
          <Scene4 len={S4} />
          <Voice slug={SLUG} id="s4" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="thud" at={40} volume={0.35} />
          <Sfx id="pop" at={115} volume={0.25} />
          <Sfx id="pop" at={195} volume={0.25} />
          <Sfx id="ding" at={280} volume={0.3} />
        </Series.Sequence>

        {/* Scene 5: Unified Sources */}
        <Series.Sequence name="Scene 5: Unified Sources" durationInFrames={S5}>
          <Scene5 len={S5} />
          <Voice slug={SLUG} id="s5" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="pop" at={38} volume={0.25} />
          <Sfx id="pop" at={100} volume={0.25} />
          <Sfx id="pop" at={165} volume={0.25} />
          <Sfx id="thud" at={235} volume={0.35} />
          <Sfx id="ding" at={315} volume={0.3} />
        </Series.Sequence>

        {/* Scene 6: Player & Task Center */}
        <Series.Sequence name="Scene 6: Player & Tasks" durationInFrames={S6}>
          <Scene6 len={S6} />
          <Voice slug={SLUG} id="s6" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="pop" at={38} volume={0.25} />
          <Sfx id="pixel" at={110} volume={0.25} />
          <Sfx id="pixel" at={160} volume={0.25} />
          <Sfx id="thud" at={220} volume={0.35} />
          <Sfx id="pop" at={310} volume={0.25} />
          <Sfx id="ding" at={410} volume={0.3} />
        </Series.Sequence>

        {/* Scene 7: Magnet & Follow */}
        <Series.Sequence name="Scene 7: Magnet & Follow" durationInFrames={S7}>
          <Scene7 len={S7} />
          <Voice slug={SLUG} id="s7" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="thud" at={38} volume={0.35} />
          <Sfx id="pop" at={115} volume={0.25} />
          <Sfx id="pop" at={180} volume={0.25} />
          <Sfx id="pixel" at={265} volume={0.25} />
          <Sfx id="ding" at={365} volume={0.3} />
        </Series.Sequence>

        {/* Scene 8: Cross Platform & Demo */}
        <Series.Sequence name="Scene 8: Cross Platform" durationInFrames={S8}>
          <Scene8 len={S8} />
          <Voice slug={SLUG} id="s8" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="pop" at={38} volume={0.25} />
          <Sfx id="pop" at={75} volume={0.25} />
          <Sfx id="thud" at={130} volume={0.35} />
          <Sfx id="pixel" at={210} volume={0.3} />
          <Sfx id="ding" at={330} volume={0.3} />
        </Series.Sequence>

        {/* Scene 9: Call to Action */}
        <Series.Sequence name="Scene 9: CTA" durationInFrames={S9}>
          <Scene9 slug={SLUG} len={S9} />
          <Voice slug={SLUG} id="s9" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="pop" at={38} volume={0.25} />
          <Sfx id="pop" at={110} volume={0.3} />
          <Sfx id="ding" at={195} volume={0.35} />
          <Sfx id="thud" at={290} volume={0.4} />
        </Series.Sequence>
      </Series>

      <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: PeachMetadataManagerVideo,
  durationInFrames: TOTAL,
};
