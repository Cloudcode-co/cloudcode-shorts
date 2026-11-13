import React from "react";
import { AbsoluteFill, Series } from "remotion";
import {
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  type VideoDef,
  type VideoProps,
  typingFrames,
} from "../../kit";
import { SLUG, FPS } from "./palette";
import durations from "./durations.json";
import timeline from "./timeline.json";

import { SceneHook } from "./scenes/SceneHook";
import { SceneBuild } from "./scenes/SceneBuild";
import { SceneRank5 } from "./scenes/SceneRank5";
import { SceneRank4 } from "./scenes/SceneRank4";
import { SceneRank3 } from "./scenes/SceneRank3";
import { SceneRank2 } from "./scenes/SceneRank2";
import { SceneRank1 } from "./scenes/SceneRank1";
import { SceneInstall } from "./scenes/SceneInstall";
import { SceneConfig } from "./scenes/SceneConfig";
import { SceneDirect } from "./scenes/SceneDirect";
import { SceneOutro } from "./scenes/SceneOutro";

// Scene durations from timeline.json (in frames)
const LENS = {
  s1: Math.round(timeline.scenes.s1.length * FPS), // 281
  s2: Math.round(timeline.scenes.s2.length * FPS), // 493
  s3: Math.round(timeline.scenes.s3.length * FPS), // 465
  s4: Math.round(timeline.scenes.s4.length * FPS), // 450
  s5: Math.round(timeline.scenes.s5.length * FPS), // 383
  s6: Math.round(timeline.scenes.s6.length * FPS), // 479
  s7: Math.round(timeline.scenes.s7.length * FPS), // 517
  s8: Math.round(timeline.scenes.s8.length * FPS), // 276
  s9: Math.round(timeline.scenes.s9.length * FPS), // 435
  s10: Math.round(timeline.scenes.s10.length * FPS), // 402
  s11: Math.round(timeline.scenes.s11.length * FPS), // 511
};

const TOTAL_FRAMES = Object.values(LENS).reduce((sum, n) => sum + n, 0);

// Duck music during voice lines
const SCENE_KEYS = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10",
  "s11",
] as const;

const VOICE_RANGES: [number, number][] = (() => {
  const ranges: [number, number][] = [];
  let at = 0;
  for (const k of SCENE_KEYS) {
    const sec = durations[k];
    const durFrames = Math.round(sec * FPS);
    ranges.push([at, at + durFrames]);
    at += LENS[k];
  }
  return ranges;
})();

export const OmniDiffVideo: React.FC<VideoProps> = ({ guide }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Series>
        {/* s1: Hook - 98% lượt git diff dưới 100ms */}
        <Series.Sequence name="Hook (s1)" durationInFrames={LENS.s1}>
          <SceneHook len={LENS.s1} />
          <Voice slug={SLUG} id="s1" />
          <Sfx id="whoosh" at={0} volume={0.3} />
          <Sfx id="thud" at={35} volume={0.4} />
          <Sfx id="pixel" at={45} volume={0.25} />
        </Series.Sequence>

        {/* s2: Build - Hạn chế của Delta & Difftastic */}
        <Series.Sequence name="Build (s2)" durationInFrames={LENS.s2}>
          <SceneBuild len={LENS.s2} />
          <Voice slug={SLUG} id="s2" />
          <Sfx id="whoosh" at={0} volume={0.3} />
          <Sfx id="pop" at={40} volume={0.25} />
          <Sfx id="whoosh" at={260} volume={0.25} />
          <Sfx id="pop" at={274} volume={0.25} />
        </Series.Sequence>

        {/* s3: Rank #5 - Tree-sitter cho 26 ngôn ngữ */}
        <Series.Sequence name="Rank #5 (s3)" durationInFrames={LENS.s3}>
          <SceneRank5 len={LENS.s3} />
          <Voice slug={SLUG} id="s3" />
          <Sfx id="thud" at={13} volume={0.45} />
          <Sfx id="pop" at={24} volume={0.25} />
        </Series.Sequence>

        {/* s4: Rank #4 - Nhận diện di chuyển code */}
        <Series.Sequence name="Rank #4 (s4)" durationInFrames={LENS.s4}>
          <SceneRank4 len={LENS.s4} />
          <Voice slug={SLUG} id="s4" />
          <Sfx id="thud" at={13} volume={0.45} />
          <Sfx id="pop" at={24} volume={0.25} />
        </Series.Sequence>

        {/* s5: Rank #3 - Tự động ghim ngữ cảnh */}
        <Series.Sequence name="Rank #3 (s5)" durationInFrames={LENS.s5}>
          <SceneRank3 len={LENS.s5} />
          <Voice slug={SLUG} id="s5" />
          <Sfx id="thud" at={13} volume={0.45} />
          <Sfx id="pop" at={24} volume={0.25} />
        </Series.Sequence>

        {/* s6: Rank #2 - Diff ảnh, font chữ và file nén (REVEAL DROP!) */}
        <Series.Sequence name="Rank #2 (s6)" durationInFrames={LENS.s6}>
          <SceneRank2 len={LENS.s6} />
          <Voice slug={SLUG} id="s6" />
          <Sfx id="whoosh" at={0} volume={0.4} />
          <Sfx id="thud" at={41} volume={0.45} />
          <Sfx id="pop" at={50} volume={0.25} />
        </Series.Sequence>

        {/* s7: Rank #1 - Giao diện TUI 24-bit Truecolor (Gold treatment + Flash!) */}
        <Series.Sequence name="Rank #1 (s7)" durationInFrames={LENS.s7}>
          <SceneRank1 len={LENS.s7} />
          <Voice slug={SLUG} id="s7" />
          <Sfx id="ding" at={2} volume={0.4} />
          <Sfx id="thud" at={13} volume={0.5} />
          <Sfx id="pop" at={26} volume={0.25} />
        </Series.Sequence>

        {/* s8: Cài đặt qua Homebrew */}
        <Series.Sequence name="Install (s8)" durationInFrames={LENS.s8}>
          <SceneInstall len={LENS.s8} />
          <Voice slug={SLUG} id="s8" />
          <Sfx id="whoosh" at={0} volume={0.3} />
          <Sfx
            id="typing"
            at={16}
            frames={typingFrames(["brew install ivankovic/omnidiff/omnidiff"])}
            volume={0.25}
          />
        </Series.Sequence>

        {/* s9: Cấu hình Git difftool */}
        <Series.Sequence name="Config (s9)" durationInFrames={LENS.s9}>
          <SceneConfig len={LENS.s9} />
          <Voice slug={SLUG} id="s9" />
          <Sfx id="whoosh" at={0} volume={0.3} />
          <Sfx
            id="typing"
            at={16}
            frames={typingFrames(["omnidiff git configure"])}
            volume={0.25}
          />
        </Series.Sequence>

        {/* s10: Dùng trực tiếp qua GIT_EXTERNAL_DIFF */}
        <Series.Sequence name="Direct (s10)" durationInFrames={LENS.s10}>
          <SceneDirect len={LENS.s10} />
          <Voice slug={SLUG} id="s10" />
          <Sfx id="whoosh" at={0} volume={0.3} />
          <Sfx
            id="typing"
            at={16}
            frames={typingFrames(["GIT_EXTERNAL_DIFF=omnidiff git diff"])}
            volume={0.25}
          />
        </Series.Sequence>

        {/* s11: Outro & Call to Action */}
        <Series.Sequence name="Outro (s11)" durationInFrames={LENS.s11}>
          <SceneOutro len={LENS.s11} />
          <Voice slug={SLUG} id="s11" />
          <Sfx id="whoosh" at={0} volume={0.3} />
          <Sfx id="ding" at={32} volume={0.35} />
        </Series.Sequence>
      </Series>

      {/* Music Track ducked under voiceover */}
      <Music slug={SLUG} total={TOTAL_FRAMES} voiceRanges={VOICE_RANGES} />

      {/* Preview guide overlay */}
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: OmniDiffVideo,
  durationInFrames: TOTAL_FRAMES,
};
