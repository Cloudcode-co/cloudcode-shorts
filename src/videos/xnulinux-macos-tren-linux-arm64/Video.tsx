import { AbsoluteFill, Series } from "remotion";
import { Music, Sfx, TikTokGuide, Voice, type VideoDef, type VideoProps } from "../../kit";
import durations from "./durations.json";
import {
  BootTime,
  Compare,
  CpuMemory,
  End,
  Hook,
  Install,
  Parallel,
  Service,
  Stress,
} from "./scenes";
import { typingFrames, TYPE_DELAY } from "./terminal";
import { LENS, STARTS, TOTAL } from "./theme";

const SLUG = "xnulinux-macos-tren-linux-arm64";
const VO = durations as Record<string, number>;

const SCENES = [
  { id: "s1", C: Hook, name: "Hook" },
  { id: "s2", C: Compare, name: "Compare" },
  { id: "s3", C: Parallel, name: "Parallel" },
  { id: "s4", C: CpuMemory, name: "CPU and memory" },
  { id: "s5", C: BootTime, name: "Boot time" },
  { id: "s6", C: Stress, name: "WindowServer and stress" },
  { id: "s7", C: Install, name: "Install" },
  { id: "s8", C: Service, name: "Service and caveats" },
  { id: "s9", C: End, name: "End" },
] as const;

const VOICE_RANGES: [number, number][] = SCENES.map((s, i) => [
  STARTS[i],
  STARTS[i] + Math.round((VO[s.id] ?? 0) * 60),
]);

const INSTALL_CMDS = [
  "scripts/vm-xnu-build.sh",
  "scripts/vm-xnu-rebuild.sh",
  "scripts/mk-macvm-disk.sh",
  "scripts/xnulinux-boot.sh",
];

const XnulinuxMacos: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence name="Hook" durationInFrames={LENS[0]}>
        <Hook />
        <Voice slug={SLUG} id="s1" />
        <Sfx id="thud" volume={0.45} />
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(["insmod xnu.ko"])} volume={0.16} />
        <Sfx id="ding" at={52} volume={0.22} />
      </Series.Sequence>

      <Series.Sequence name="Compare" durationInFrames={LENS[1]}>
        <Compare />
        <Voice slug={SLUG} id="s2" />
        <Sfx id="whoosh" volume={0.3} />
        <Sfx id="pop" at={32} volume={0.2} />
        <Sfx id="pop" at={130} volume={0.2} />
        <Sfx id="pop" at={229} volume={0.24} />
        <Sfx id="ding" at={294} volume={0.2} />
      </Series.Sequence>

      <Series.Sequence name="Parallel" durationInFrames={LENS[2]}>
        <Parallel />
        <Voice slug={SLUG} id="s3" />
        <Sfx id="whoosh" volume={0.3} />
        {[0, 1, 2, 3].map((i) => (
          <Sfx key={i} id="pop" at={220 + i * 28} volume={0.16} />
        ))}
        <Sfx id="thud" at={329} volume={0.2} />
      </Series.Sequence>

      <Series.Sequence name="CPU and memory" durationInFrames={LENS[3]}>
        <CpuMemory />
        <Voice slug={SLUG} id="s4" />
        <Sfx id="whoosh" volume={0.3} />
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(["sysctl machdep.cpu"])} volume={0.16} />
        <Sfx id="pop" at={279} volume={0.22} />
        <Sfx id="thud" at={666} volume={0.5} />
      </Series.Sequence>

      <Series.Sequence name="Boot time" durationInFrames={LENS[4]}>
        <BootTime />
        <Voice slug={SLUG} id="s5" />
        <Sfx id="whoosh" volume={0.35} />
        <Sfx id="pop" at={198} volume={0.22} />
        <Sfx id="pop" at={329} volume={0.22} />
        <Sfx id="ding" at={410} volume={0.2} />
        <Sfx id="pop" at={460} volume={0.18} />
      </Series.Sequence>

      <Series.Sequence name="WindowServer and stress" durationInFrames={LENS[5]}>
        <Stress />
        <Voice slug={SLUG} id="s6" />
        <Sfx id="whoosh" volume={0.3} />
        {[13, 45, 78, 110].map((at) => (
          <Sfx key={at} id="pop" at={at} volume={0.18} />
        ))}
        <Sfx id="ding" at={536} volume={0.24} />
      </Series.Sequence>

      <Series.Sequence name="Install" durationInFrames={LENS[6]}>
        <Install />
        <Voice slug={SLUG} id="s7" />
        <Sfx id="whoosh" volume={0.3} />
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(INSTALL_CMDS)} volume={0.16} />
        {[300, 350, 400, 450].map((at) => (
          <Sfx key={at} id="pop" at={at} volume={0.18} />
        ))}
        <Sfx id="ding" at={450} volume={0.22} />
      </Series.Sequence>

      <Series.Sequence name="Service and caveats" durationInFrames={LENS[7]}>
        <Service />
        <Voice slug={SLUG} id="s8" />
        <Sfx id="whoosh" volume={0.3} />
        <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(["scripts/install-service.sh"])} volume={0.16} />
        <Sfx id="ding" at={102} volume={0.22} />
        <Sfx id="thud" at={363} volume={0.24} />
        <Sfx id="thud" at={400} volume={0.22} />
        <Sfx id="pop" at={420} volume={0.18} />
      </Series.Sequence>

      <Series.Sequence name="End" durationInFrames={LENS[8]}>
        <End />
        <Voice slug={SLUG} id="s9" />
        <Sfx id="whoosh" volume={0.3} />
        <Sfx id="pop" at={20} volume={0.22} />
        <Sfx id="ding" at={56} volume={0.24} />
        <Sfx id="pop" at={120} volume={0.18} />
      </Series.Sequence>
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: XnulinuxMacos,
  durationInFrames: TOTAL,
};
