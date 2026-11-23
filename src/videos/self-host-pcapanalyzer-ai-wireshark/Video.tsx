// News desk bulletin: three stories over five long shots. Each story keeps one
// full-frame picture and one chrome strip while its content builds in place;
// quick wipes hide the two story cuts, and the AI shot cuts on the music drop.
import { AbsoluteFill, Sequence } from "remotion";
import {
  Brand,
  Music,
  Sfx,
  TikTokGuide,
  typingFrames,
  Voice,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { Wipe } from "./chrome";
import { Story1 } from "./Story1";
import { Story2 } from "./Story2";
import { INSTALL_CMDS, Story3 } from "./Story3";
import { SLUG } from "./theme";
import { DROP, SHOTS, STORIES, TOTAL, VOICES, WIPE_1, WIPE_2, START } from "./timing";

const TYPE = typingFrames(INSTALL_CMDS);

const Bulletin: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    {STORIES.map((s, i) => (
      <Sequence key={s.id} from={s.start} durationInFrames={s.len} name={`Story ${s.id}/3`}>
        {i === 0 ? <Story1 /> : i === 1 ? <Story2 /> : <Story3 />}
      </Sequence>
    ))}

    {/* The lockup lives on the opening shot only. */}
    <Sequence durationInFrames={SHOTS.a.len} name="Brand">
      <Brand />
    </Sequence>

    <Wipe from={WIPE_1} />
    <Wipe from={WIPE_2} />

    {VOICES.map((v) => (
      <Sequence key={v.id} from={v.at} durationInFrames={v.frames} layout="none" name={`voice: ${v.id}`}>
        <Voice slug={SLUG} id={v.id} />
      </Sequence>
    ))}

    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICES.map((v) => [v.at, v.at + v.frames])} />

    {/* Cuts and reveals, kept under the narrator. */}
    <Sfx id="thud" at={6} volume={0.42} />
    <Sfx id="pop" at={START.s2 + 198} volume={0.28} />
    <Sfx id="ding" at={START.s2 + 236} volume={0.3} />
    <Sfx id="pop" at={START.s3 + 108} volume={0.24} />
    <Sfx id="whoosh" at={WIPE_1} volume={0.42} />
    <Sfx id="pop" at={START.s4 + 24} volume={0.2} />
    <Sfx id="pop" at={START.s4 + 108} volume={0.2} />
    <Sfx id="pop" at={START.s4 + 192} volume={0.2} />
    <Sfx id="pop" at={START.s4 + 276} volume={0.2} />
    <Sfx id="pop" at={START.s5 + 18} volume={0.22} />
    <Sfx id="pop" at={START.s5 + 92} volume={0.22} />
    <Sfx id="pop" at={START.s5 + 166} volume={0.22} />
    <Sfx id="thud" at={DROP} volume={0.52} />
    <Sfx id="pop" at={DROP + 55 + 54} volume={0.2} />
    <Sfx id="pop" at={DROP + 55 + 124} volume={0.2} />
    <Sfx id="ding" at={DROP + 55 + 196} volume={0.24} />
    <Sfx id="pop" at={START.s7 + 24} volume={0.2} />
    <Sfx id="pop" at={START.s8 + 30} volume={0.2} />
    <Sfx id="whoosh" at={WIPE_2} volume={0.42} />
    <Sfx id="typing" at={START.s9} frames={TYPE} volume={0.22} />
    <Sfx id="ding" at={START.s9 + TYPE + 12} volume={0.24} />
    <Sfx id="pop" at={START.s10 + 18} volume={0.2} />
    <Sfx id="pop" at={START.s10 + 150} volume={0.2} />
    <Sfx id="pop" at={START.s11 + 30} volume={0.2} />
    <Sfx id="ding" at={START.s11 + 104} volume={0.26} />

    {guide && <TikTokGuide />}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Bulletin,
  durationInFrames: TOTAL,
};
