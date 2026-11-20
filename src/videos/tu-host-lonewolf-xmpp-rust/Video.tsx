import { AbsoluteFill, Series } from "remotion";
import {
  Brand,
  Music,
  Sfx,
  TikTokGuide,
  Voice,
  type VideoDef,
  type VideoProps,
} from "../../kit";
import { SLUG } from "./palette";
import { byId, SHOTS, TOTAL, VOICE_RANGES, shotLen } from "./plan";
import { Backdrop, SceneIn, Ticker, TopBar, Wipe } from "./parts";
import { Hook } from "./scenes/Hook";
import { StoryOne } from "./scenes/StoryOne";
import { Compile, Lonewolf, Redb, Run } from "./scenes/StoryTwo";
import { Certs, Federation } from "./scenes/StoryThree";
import { Caveats, Cta } from "./scenes/Outro";

const SceneById: React.FC<{ id: string }> = ({ id }) => {
  const start = byId(id).start;
  switch (id) {
    case "s1":
      return <Hook />;
    case "s2":
      return <StoryOne start={start} />;
    case "s3":
      return <Lonewolf start={start} />;
    case "s4":
      return <Redb start={start} />;
    case "s5":
      return <Compile start={start} />;
    case "s6":
      return <Run start={start} />;
    case "s7":
      return <Federation start={start} />;
    case "s8":
      return <Certs start={start} />;
    case "s9":
      return <Caveats start={start} />;
    case "s10":
      return <Cta />;
    default:
      return null;
  }
};

type ShotStyle = {
  kicker: string;
  index: number | null;
  clip: string;
  clipFrames: number;
  rate?: number;
  pos?: string;
  appearAt: number;
  hideAt?: number;
};

const SHOT_STYLE: Record<string, ShotStyle> = {
  "Story 1": {
    kicker: "ĐỐI THỦ TRUYỀN THỐNG",
    index: 1,
    clip: "footage/data-center-server-room-pixabay-380334.mp4",
    clipFrames: 480,
    pos: "50% 50%",
    appearAt: 373,
  },
  "Story 2": {
    kicker: "LONEWOLF · RUST",
    index: 2,
    clip: "footage/rust-code-on-computer-screen-pixabay-14214.mp4",
    clipFrames: 2400,
    pos: "50% 50%",
    appearAt: 0,
  },
  "Story 3": {
    kicker: "TÍNH NĂNG V0.3.0",
    index: 3,
    clip: "footage/ethernet-cables-network-switch-pixabay-14900.mp4",
    clipFrames: 1440,
    pos: "50% 55%",
    appearAt: 0,
  },
  Outro: {
    kicker: "LƯU Ý & TỔNG KẾT",
    index: 3,
    clip: "footage/programmer-typing-code-close-up-pixabay-4733.mp4",
    clipFrames: 900,
    rate: 0.75,
    pos: "50% 40%",
    appearAt: 0,
    hideAt: byId("s10").start - byId("s9").start + 4,
  },
};

// The hook is the only shot with the Cloudcode lockup and no bulletin chrome.
const HOOK_STYLE = { clip: "footage/man-typing-on-laptop-at-desk-pixabay-43559.mp4", clipFrames: 1080, pos: "50% 45%" };

const Bulletin: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill style={{ backgroundColor: "#030C18" }}>
    <Series>
      {SHOTS.map((shot) => {
        const style = SHOT_STYLE[shot.name];
        const hook = shot.name === "Hook";
        const len = shotLen(shot.ids);
        const start = byId(shot.ids[0]).start;
        return (
          <Series.Sequence key={shot.name} name={shot.name} durationInFrames={len}>
            <Backdrop
              clip={hook ? HOOK_STYLE.clip : style.clip}
              clipFrames={hook ? HOOK_STYLE.clipFrames : style.clipFrames}
              rate={hook ? undefined : style.rate}
              pos={hook ? HOOK_STYLE.pos : style.pos}
              len={len}
              start={start}
            />
            <Series>
              {shot.ids.map((id) => (
                <Series.Sequence key={id} name={id} durationInFrames={byId(id).len}>
                  <SceneIn>
                    <SceneById id={id} />
                  </SceneIn>
                  <Voice slug={SLUG} id={id} />
                  {id === "s1" ? <Brand /> : null}
                </Series.Sequence>
              ))}
            </Series>
            {hook ? (
              <Sfx id="thud" volume={0.5} />
            ) : (
              <>
                <TopBar kicker={style.kicker} index={style.index} hideAt={style.hideAt} />
                <Ticker start={start} appearAt={style.appearAt} />
                <Wipe flash={shot.ids[0] === "s7"} />
                <Sfx id="whoosh" volume={0.42} />
                <Sfx id="thud" volume={0.24} />
              </>
            )}
          </Series.Sequence>
        );
      })}
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide ? <TikTokGuide /> : null}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: Bulletin,
  durationInFrames: TOTAL,
};
