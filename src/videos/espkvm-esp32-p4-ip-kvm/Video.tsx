import React from "react";
import { AbsoluteFill, Series } from "remotion";
import {
  Brand,
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  FPS,
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
import { Scene10 } from "./scenes/Scene10";
import durations from "./durations.json";
import timeline from "./timeline.json";

const SLUG = "espkvm-esp32-p4-ip-kvm";

// Exact scene lengths from timeline.json
const SCENE_LENS = {
  s1: Math.round(timeline.scenes.s1.length * FPS), // 353
  s2: Math.round(timeline.scenes.s2.length * FPS), // 339
  s3: Math.round(timeline.scenes.s3.length * FPS), // 411
  s4: Math.round(timeline.scenes.s4.length * FPS), // 593
  s5: Math.round(timeline.scenes.s5.length * FPS), // 516
  s6: Math.round(timeline.scenes.s6.length * FPS), // 498
  s7: Math.round(timeline.scenes.s7.length * FPS), // 446
  s8: Math.round(timeline.scenes.s8.length * FPS), // 479
  s9: Math.round(timeline.scenes.s9.length * FPS), // 465
  s10: Math.round(timeline.scenes.s10.length * FPS), // 464
};

const TOTAL_FRAMES = Object.values(SCENE_LENS).reduce((acc, v) => acc + v, 0); // 4564

// Precalculated voiceover ranges for ducking music under voice
const VOICE_RANGES: [number, number][] = (() => {
  const ranges: [number, number][] = [];
  let at = 0;
  const scenes = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"] as const;
  for (const id of scenes) {
    const durSec = durations[id];
    ranges.push([at, at + Math.round(durSec * FPS)]);
    at += SCENE_LENS[id];
  }
  return ranges;
})();

const EspkvmSimulation: React.FC<VideoProps> = ({ guide }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Music slug={SLUG} total={TOTAL_FRAMES} voiceRanges={VOICE_RANGES} />

      <Series>
        {/* Scene 1: Server down at BIOS */}
        <Series.Sequence name="s1-bios-crisis" durationInFrames={SCENE_LENS.s1}>
          <Scene1 len={SCENE_LENS.s1} />
          <Voice slug={SLUG} id="s1" />
          <Sfx id="thud" volume={0.4} />
          <Brand />
        </Series.Sequence>

        {/* Scene 2: Kernel panic dark walk */}
        <Series.Sequence name="s2-kernel-panic" durationInFrames={SCENE_LENS.s2}>
          <Scene2 len={SCENE_LENS.s2} />
          <Voice slug={SLUG} id="s2" />
          <Sfx id="whoosh" volume={0.3} />
        </Series.Sequence>

        {/* Scene 3: Microcontroller solution ESP32-P4 */}
        <Series.Sequence name="s3-esp32-p4" durationInFrames={SCENE_LENS.s3}>
          <Scene3 len={SCENE_LENS.s3} />
          <Voice slug={SLUG} id="s3" />
          <Sfx id="pixel" volume={0.3} />
        </Series.Sequence>

        {/* Scene 4: Hardware bridge HDMI to CSI */}
        <Series.Sequence name="s4-hdmi-csi" durationInFrames={SCENE_LENS.s4}>
          <Scene4 len={SCENE_LENS.s4} />
          <Voice slug={SLUG} id="s4" />
          <Sfx id="whoosh" volume={0.3} />
        </Series.Sequence>

        {/* Scene 5: THE DROP! 60ms Latency & 70KB web console */}
        <Series.Sequence name="s5-drop-60ms" durationInFrames={SCENE_LENS.s5}>
          <Scene5 len={SCENE_LENS.s5} />
          <Voice slug={SLUG} id="s5" />
          <Sfx id="thud" volume={0.6} />
          <Sfx id="pixel" at={15} volume={0.35} />
        </Series.Sequence>

        {/* Scene 6: Virtual Media ISO Boot from BIOS */}
        <Series.Sequence name="s6-virtual-media" durationInFrames={SCENE_LENS.s6}>
          <Scene6 len={SCENE_LENS.s6} />
          <Voice slug={SLUG} id="s6" />
          <Sfx id="pop" volume={0.35} />
        </Series.Sequence>

        {/* Scene 7: Web Serial browser flashing */}
        <Series.Sequence name="s7-web-serial" durationInFrames={SCENE_LENS.s7}>
          <Scene7 len={SCENE_LENS.s7} />
          <Voice slug={SLUG} id="s7" />
          <Sfx id="whoosh" volume={0.3} />
        </Series.Sequence>

        {/* Scene 8: MX1.25 OTG port & cert.pem CA */}
        <Series.Sequence name="s8-mx125-wiring" durationInFrames={SCENE_LENS.s8}>
          <Scene8 len={SCENE_LENS.s8} />
          <Voice slug={SLUG} id="s8" />
          <Sfx id="whoosh" volume={0.3} />
        </Series.Sequence>

        {/* Scene 9: Security alert & WireGuard / Tailscale */}
        <Series.Sequence name="s9-wireguard-tunnel" durationInFrames={SCENE_LENS.s9}>
          <Scene9 len={SCENE_LENS.s9} />
          <Voice slug={SLUG} id="s9" />
          <Sfx id="whoosh" volume={0.3} />
        </Series.Sequence>

        {/* Scene 10: Homelab restored success outro */}
        <Series.Sequence name="s10-homelab-success" durationInFrames={SCENE_LENS.s10}>
          <Scene10 len={SCENE_LENS.s10} />
          <Voice slug={SLUG} id="s10" />
          <Sfx id="ding" at={10} volume={0.35} />
        </Series.Sequence>
      </Series>

      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );
};

export const video: VideoDef = {
  id: SLUG,
  component: EspkvmSimulation,
  durationInFrames: TOTAL_FRAMES,
};
