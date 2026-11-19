import { AbsoluteFill, Series } from "remotion";
import { Music, Sfx, TikTokGuide, Voice, typingFrames, type VideoDef, type VideoProps } from "../../kit";
import { CutFlash } from "./parts";
import durations from "./durations.json";
import script from "./script.json";
import timeline from "./timeline.json";
import { SLUG } from "./palette";
import { HookStat, OneFlow, SixPlaces } from "./scenes/Hook";
import { ComposeInstall, OwnerFirst, StillNeed } from "./scenes/BuildInstall";
import { LocalConfig, OneParent } from "./scenes/BuildSetup";
import { FreshProject, JellyfinPlay, MusicGap, SmallVps } from "./scenes/Reveal";
import { SaveIt } from "./scenes/Outro";

const FPS = 60;
const DUR = durations as Record<string, number>;
const TL = timeline as { scenes: Record<string, { start: number; length: number }> };

type SceneMeta = { id: string; len: number; start: number; voice: number };
const SCENES: SceneMeta[] = [];
{
  let at = 0;
  for (const s of (script as { scenes: { id: string }[] }).scenes) {
    const len = Math.round((TL.scenes[s.id]?.length ?? 3) * FPS);
    SCENES.push({ id: s.id, len, start: at, voice: Math.round((DUR[s.id] ?? 3) * FPS) });
    at += len;
  }
}
const byId = (id: string) => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`missing scene ${id}`);
  return s;
};

// Five long shots, each one building in place. Every shot cut lands on a
// music section or a phrase; the scene layouts reframe inside the shot.
const SHOTS: { name: string; base: string; ids: string[] }[] = [
  { name: "Hook", base: "#141110", ids: ["s1", "s2", "s3"] },
  { name: "Install", base: "#141110", ids: ["s4", "s5", "s6"] },
  { name: "Setup", base: "#F2EEE7", ids: ["s7", "s8"] },
  { name: "Reveal", base: "#141110", ids: ["s9", "s10", "s11", "s12"] },
  { name: "Outro", base: "#F2EEE7", ids: ["s13"] },
];

const shotLen = (ids: string[]) => ids.reduce((n, id) => n + byId(id).len, 0);
const TOTAL = SCENES.reduce((n, s) => n + s.len, 0);

const VOICE_RANGES: [number, number][] = SCENES.map((s) => [s.start, s.start + s.voice]);

const SceneById: React.FC<{ id: string }> = ({ id }) => {
  const s = byId(id);
  switch (id) {
    case "s1":
      return <HookStat len={s.len} />;
    case "s2":
      return <SixPlaces len={s.len} voice={s.voice} />;
    case "s3":
      return <OneFlow len={s.len} voice={s.voice} />;
    case "s4":
      return <StillNeed len={s.len} voice={s.voice} />;
    case "s5":
      return <ComposeInstall len={s.len} voice={s.voice} />;
    case "s6":
      return <OwnerFirst len={s.len} voice={s.voice} />;
    case "s7":
      return <OneParent len={s.len} voice={s.voice} />;
    case "s8":
      return <LocalConfig len={s.len} voice={s.voice} />;
    case "s9":
      return <JellyfinPlay len={s.len} voice={s.voice} />;
    case "s10":
      return <MusicGap len={s.len} voice={s.voice} />;
    case "s11":
      return <FreshProject len={s.len} voice={s.voice} />;
    case "s12":
      return <SmallVps len={s.len} voice={s.voice} />;
    case "s13":
      return <SaveIt len={s.len} />;
    default:
      return null;
  }
};

const SfxFor: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case "s1":
      return (
        <>
          <Sfx id="thud" volume={0.5} />
          <Sfx id="pop" at={34} volume={0.3} />
        </>
      );
    case "s2":
      return (
        <>
          <Sfx id="whoosh" />
          <Sfx id="pop" at={20} volume={0.28} />
        </>
      );
    case "s3":
      return (
        <>
          <Sfx id="whoosh" />
          <Sfx id="pop" at={150} volume={0.3} />
          <Sfx id="thud" at={520} volume={0.4} />
          <Sfx id="ding" at={520} volume={0.32} />
        </>
      );
    case "s4":
      return (
        <>
          <Sfx id="thud" volume={0.5} />
          {[22, 70, 118, 166, 330, 372].map((at) => (
            <Sfx key={at} id="pop" at={at} volume={0.22} />
          ))}
        </>
      );
    case "s5":
      return (
        <>
          <Sfx id="whoosh" />
          <Sfx id="typing" at={256} frames={typingFrames(["docker compose up -d"])} volume={0.3} />
        </>
      );
    case "s6":
      return (
        <>
          <Sfx id="whoosh" />
          <Sfx id="typing" at={86} frames={typingFrames(["docker exec -i holyarrs /holyarrs reset-owner"])} volume={0.28} />
        </>
      );
    case "s7":
      return (
        <>
          <Sfx id="whoosh" />
          <Sfx
            id="typing"
            at={186}
            frames={typingFrames([
              "mkdir -p /srv/data/downloads/{torrents,usenet} /srv/data/media/{movies,tv,music}",
              "chown -R 1000:1000 /srv/data",
            ])}
            volume={0.28}
          />
        </>
      );
    case "s8":
      return (
        <>
          <Sfx id="thud" volume={0.4} />
          <Sfx id="pop" at={24} volume={0.28} />
        </>
      );
    case "s9":
      return (
        <>
          <Sfx id="whoosh" />
          <Sfx id="ding" at={340} volume={0.3} />
          <Sfx id="pop" at={560} volume={0.25} />
        </>
      );
    case "s10":
      return (
        <>
          <Sfx id="whoosh" />
          <Sfx id="pop" at={400} volume={0.3} />
        </>
      );
    case "s11":
      return (
        <>
          <Sfx id="thud" volume={0.4} />
          <Sfx id="pop" at={320} volume={0.22} />
          <Sfx id="pop" at={450} volume={0.22} />
          <Sfx id="pop" at={600} volume={0.22} />
        </>
      );
    case "s12":
      return (
        <>
          <Sfx id="thud" volume={0.4} />
          <Sfx id="ding" at={80} volume={0.3} />
          <Sfx id="pop" at={260} volume={0.25} />
        </>
      );
    case "s13":
      return (
        <>
          <Sfx id="whoosh" />
          <Sfx id="ding" at={51} volume={0.32} />
          <Sfx id="pop" at={92} volume={0.26} />
        </>
      );
    default:
      return null;
  }
};

const HolyArrs: React.FC<VideoProps> = ({ guide }) => (
  <AbsoluteFill>
    <Series>
      {SHOTS.map((shot, si) => (
        <Series.Sequence key={shot.name} name={shot.name} durationInFrames={shotLen(shot.ids)}>
          <AbsoluteFill style={{ backgroundColor: shot.base }} />
          <Series>
            {shot.ids.map((id) => (
              <Series.Sequence key={id} name={id} durationInFrames={byId(id).len}>
                <SceneById id={id} />
                <Voice slug={SLUG} id={id} />
                <SfxFor id={id} />
                {id !== "s1" ? <CutFlash strength={0.4} dur={5} /> : null}
              </Series.Sequence>
            ))}
          </Series>
          {si > 0 ? <CutFlash /> : null}
        </Series.Sequence>
      ))}
    </Series>
    <Music slug={SLUG} total={TOTAL} voiceRanges={VOICE_RANGES} />
    {guide ? <TikTokGuide /> : null}
  </AbsoluteFill>
);

export const video: VideoDef = {
  id: SLUG,
  component: HolyArrs,
  durationInFrames: TOTAL,
};
