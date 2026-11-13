import React from "react";
import { AbsoluteFill, Series } from "remotion";
import {
  FPS,
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";
import { Scene8 } from "./scenes/Scene8";
import { Scene9 } from "./scenes/Scene9";
import VO from "./durations.json";
import timeline from "./timeline.json";

const SLUG = "yogurt-ai-meeting-notes-self-host";

// Exact scene lengths calculated from timeline.json to synchronize perfectly with music
const S1_LEN = Math.round(timeline.scenes.s1.length * FPS); // 258 frames (~4.30s)
const S2_LEN = Math.round(timeline.scenes.s2.length * FPS); // 358 frames (~5.97s)
const S3_LEN = Math.round(timeline.scenes.s3.length * FPS); // 388 frames (~6.46s)
const S4_LEN = Math.round(timeline.scenes.s4.length * FPS); // 493 frames (~8.21s)
const S5_LEN = Math.round(timeline.scenes.s5.length * FPS); // 435 frames (~7.25s)
const S6_LEN = Math.round(timeline.scenes.s6.length * FPS); // 416 frames (~6.93s)
const S7_LEN = Math.round(timeline.scenes.s7.length * FPS); // 388 frames (~6.46s)
const S8_LEN = Math.round(timeline.scenes.s8.length * FPS); // 504 frames (~8.40s)
const TOTAL_FRAMES = Math.round(timeline.total * FPS); // 3712 frames
const S9_LEN = TOTAL_FRAMES - (S1_LEN + S2_LEN + S3_LEN + S4_LEN + S5_LEN + S6_LEN + S7_LEN + S8_LEN); // 472 frames (~7.87s)

// Voice intervals for music ducking
const VOICE_RANGES: [number, number][] = [
  [0, Math.round(VO.s1 * FPS)],
  [S1_LEN, S1_LEN + Math.round(VO.s2 * FPS)],
  [S1_LEN + S2_LEN, S1_LEN + S2_LEN + Math.round(VO.s3 * FPS)],
  [S1_LEN + S2_LEN + S3_LEN, S1_LEN + S2_LEN + S3_LEN + Math.round(VO.s4 * FPS)],
  [
    S1_LEN + S2_LEN + S3_LEN + S4_LEN,
    S1_LEN + S2_LEN + S3_LEN + S4_LEN + Math.round(VO.s5 * FPS),
  ],
  [
    S1_LEN + S2_LEN + S3_LEN + S4_LEN + S5_LEN,
    S1_LEN + S2_LEN + S3_LEN + S4_LEN + S5_LEN + Math.round(VO.s6 * FPS),
  ],
  [
    S1_LEN + S2_LEN + S3_LEN + S4_LEN + S5_LEN + S6_LEN,
    S1_LEN + S2_LEN + S3_LEN + S4_LEN + S5_LEN + S6_LEN + Math.round(VO.s7 * FPS),
  ],
  [
    S1_LEN + S2_LEN + S3_LEN + S4_LEN + S5_LEN + S6_LEN + S7_LEN,
    S1_LEN + S2_LEN + S3_LEN + S4_LEN + S5_LEN + S6_LEN + S7_LEN + Math.round(VO.s8 * FPS),
  ],
  [
    S1_LEN + S2_LEN + S3_LEN + S4_LEN + S5_LEN + S6_LEN + S7_LEN + S8_LEN,
    S1_LEN + S2_LEN + S3_LEN + S4_LEN + S5_LEN + S6_LEN + S7_LEN + S8_LEN + Math.round(VO.s9 * FPS),
  ],
];

const YogurtSelfHostVideo: React.FC<VideoProps> = ({ guide }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Series>
        {/* Scene 1: Hook - Hiểu lầm thuê VPS */}
        <Series.Sequence name="Scene 1" durationInFrames={S1_LEN}>
          <Scene1 len={S1_LEN} />
          <Voice slug={SLUG} id="s1" />
          <Sfx id="thud" volume={0.4} />
          <Sfx id="whoosh" at={75} volume={0.3} />
          <Sfx id="pixel" at={165} volume={0.25} />
        </Series.Sequence>

        {/* Scene 2: Yogurt chạy offline trên máy tính cá nhân */}
        <Series.Sequence name="Scene 2" durationInFrames={S2_LEN}>
          <Scene2 len={S2_LEN} />
          <Voice slug={SLUG} id="s2" />
          <Sfx id="thud" volume={0.4} />
          <Sfx id="whoosh" at={80} volume={0.3} />
          <Sfx id="pop" at={170} volume={0.3} />
        </Series.Sequence>

        {/* Scene 3: Không cần bot tham gia phòng họp */}
        <Series.Sequence name="Scene 3" durationInFrames={S3_LEN}>
          <Scene3 len={S3_LEN} />
          <Voice slug={SLUG} id="s3" />
          <Sfx id="thud" volume={0.4} />
          <Sfx id="whoosh" at={80} volume={0.3} />
          <Sfx id="pop" at={160} volume={0.3} />
          <Sfx id="pop" at={240} volume={0.3} />
        </Series.Sequence>

        {/* Scene 4: Bóc băng và tóm tắt bằng whisper & llama local */}
        <Series.Sequence name="Scene 4" durationInFrames={S4_LEN}>
          <Scene4 len={S4_LEN} />
          <Voice slug={SLUG} id="s4" />
          <Sfx id="whoosh" volume={0.3} />
          <Sfx id="pop" at={80} volume={0.3} />
          <Sfx id="pop" at={160} volume={0.3} />
          <Sfx id="pop" at={245} volume={0.3} />
          <Sfx id="whoosh" at={415} volume={0.35} />
        </Series.Sequence>

        {/* Scene 5: TURNING POINT & DROP - 8 GB RAM & 5 GB Model */}
        <Series.Sequence name="Scene 5" durationInFrames={S5_LEN}>
          <Scene5 len={S5_LEN} />
          <Voice slug={SLUG} id="s5" />
          <Sfx id="thud" at={9} volume={0.55} />
          <Sfx id="whoosh" at={90} volume={0.3} />
          <Sfx id="pop" at={175} volume={0.35} />
          <Sfx id="pop" at={260} volume={0.3} />
        </Series.Sequence>

        {/* Scene 6: Bật chế độ đa ngôn ngữ 99 ngôn ngữ */}
        <Series.Sequence name="Scene 6" durationInFrames={S6_LEN}>
          <Scene6 len={S6_LEN} />
          <Voice slug={SLUG} id="s6" />
          <Sfx id="thud" volume={0.4} />
          <Sfx id="whoosh" at={80} volume={0.3} />
          <Sfx id="pop" at={165} volume={0.3} />
          <Sfx id="ding" at={335} volume={0.35} />
        </Series.Sequence>

        {/* Scene 7: macOS only & MCP local server */}
        <Series.Sequence name="Scene 7" durationInFrames={S7_LEN}>
          <Scene7 len={S7_LEN} />
          <Voice slug={SLUG} id="s7" />
          <Sfx id="whoosh" volume={0.3} />
          <Sfx id="pop" at={80} volume={0.3} />
          <Sfx id="pop" at={160} volume={0.3} />
          <Sfx id="pop" at={240} volume={0.3} />
        </Series.Sequence>

        {/* Scene 8: Lựa chọn thay thế: Meetily (Rust + Tauri) */}
        <Series.Sequence name="Scene 8" durationInFrames={S8_LEN}>
          <Scene8 len={S8_LEN} />
          <Voice slug={SLUG} id="s8" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="whoosh" at={80} volume={0.3} />
          <Sfx id="typing" at={165} frames={70} volume={0.3} />
          <Sfx id="typing" at={250} frames={70} volume={0.3} />
          <Sfx id="ding" at={335} volume={0.35} />
        </Series.Sequence>

        {/* Scene 9: Outro - Lưu video & theo dõi */}
        <Series.Sequence name="Scene 9" durationInFrames={S9_LEN}>
          <Scene9 len={S9_LEN} />
          <Voice slug={SLUG} id="s9" />
          <Sfx id="thud" volume={0.45} />
          <Sfx id="whoosh" at={80} volume={0.3} />
          <Sfx id="pop" at={165} volume={0.3} />
          <Sfx id="ding" at={255} volume={0.35} />
        </Series.Sequence>
      </Series>

      {/* Global background music with voice ducking */}
      <Music slug={SLUG} total={TOTAL_FRAMES} voiceRanges={VOICE_RANGES} />

      {/* TikTok safe area visual guide for QA */}
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: YogurtSelfHostVideo,
  durationInFrames: TOTAL_FRAMES,
};
