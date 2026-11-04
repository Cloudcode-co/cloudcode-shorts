import { AbsoluteFill, Img, Series } from "remotion";
import { Music, Sfx, Voice, videoAsset } from "./audio";
import { BRAND_SPACE, Brand } from "./Brand";
import { Terminal, TYPE_DELAY, typingFrames } from "./Terminal";
import { CONTENT_W, SAFE, display, enter, sans, useIn } from "./theme";
import { FPS, fit, type VideoDef, type VideoProps } from "./timing";
import { Shot, TikTokGuide } from "./ui";

// The shapes of script.json and facts.json that write-script.mjs produces.
export type ScriptScene = {
  id: string;
  text: string;
  headline: string;
  lines: string[];
  commands: string[];
  repos: string[];
};
export type RepoFact = {
  asked: string;
  name: string;
  stars: number;
  avatar: string | null;
};

// Plain kinetic-type video straight from the script: one shot per scene,
// headline, lines, typed commands and repo logos. The pipeline falls back to
// it when a custom build does not pass its checks, so a run always ends with
// a watchable video.
const ACCENTS = ["#FFC800", "#4FD1C5", "#FF7A59", "#9F7AEA", "#7BD389"];

const SceneShot: React.FC<{
  slug: string;
  scene: ScriptScene;
  repos: RepoFact[];
  accent: string;
  len: number;
  first: boolean;
}> = ({ slug, scene, repos, accent, len, first }) => {
  const head = useIn(0, 12);
  const body = useIn(10);
  const logos = useIn(18);
  const shown = scene.repos
    .map((r) => repos.find((f) => f.asked === r))
    .filter((r): r is RepoFact => Boolean(r?.avatar));
  return (
    <Shot
      bg="#121212"
      len={len}
      style={{ gap: 36, justifyContent: "center", paddingTop: SAFE.top + (first ? BRAND_SPACE : 0) }}
    >
      <div
        style={{
          ...enter(head, 30),
          fontFamily: display,
          fontWeight: 800,
          fontSize: scene.headline.length > 40 ? 76 : 96,
          lineHeight: 1.02,
          color: "#FFFFFF",
        }}
      >
        {scene.headline}
      </div>
      {shown.length > 0 && (
        <div style={{ ...enter(logos), display: "flex", flexWrap: "wrap", gap: 24 }}>
          {shown.map((r) => (
            <div key={r.asked} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Img
                src={videoAsset(slug, r.avatar as string)}
                style={{ width: 88, height: 88, borderRadius: 22, background: "#FFFFFF" }}
              />
              <div style={{ fontFamily: sans, color: "#FFFFFF" }}>
                <div style={{ fontSize: 38, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 30, color: accent }}>
                  {r.stars.toLocaleString("en-US")} sao GitHub
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {scene.lines.length > 0 && (
        <div style={{ ...enter(body), display: "flex", flexDirection: "column", gap: 14 }}>
          {scene.lines.map((line) => (
            <div
              key={line}
              style={{
                fontFamily: sans,
                fontSize: 46,
                fontWeight: 700,
                lineHeight: 1.25,
                color: "#FFFFFF",
                borderLeft: `8px solid ${accent}`,
                paddingLeft: 22,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
      {scene.commands.length > 0 && (
        <Terminal cmds={scene.commands} width={CONTENT_W} accent={accent} minHeight={0} />
      )}
    </Shot>
  );
};

export const makeFallbackVideo = ({
  slug,
  scenes,
  durations,
  repos,
  silent = false,
}: {
  slug: string;
  scenes: ScriptScene[];
  durations: Record<string, number>;
  repos: RepoFact[];
  // A meme: no voiceover, louder music.
  silent?: boolean;
}): VideoDef => {
  const accent = ACCENTS[[...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % ACCENTS.length];
  const lens = scenes.map((s) =>
    fit(
      durations[s.id] ?? 3,
      s.commands.length ? TYPE_DELAY + typingFrames(s.commands) + 60 : 120,
    ),
  );
  // The last shot holds 1.5s after its line.
  lens[lens.length - 1] += 90;
  const total = lens.reduce((sum, n) => sum + n, 0);
  let at = 0;
  const voiceRanges = scenes.map((s, i): [number, number] => {
    const start = at;
    at += lens[i];
    return [start, start + Math.round((durations[s.id] ?? 0) * FPS)];
  });

  const Fallback: React.FC<VideoProps> = ({ guide }) => (
    <AbsoluteFill>
      <Series>
        {scenes.map((s, i) => (
          <Series.Sequence key={s.id} name={s.id} durationInFrames={lens[i]}>
            <SceneShot
              slug={slug}
              scene={s}
              repos={repos}
              accent={accent}
              len={lens[i]}
              first={i === 0}
            />
            {!silent && <Voice slug={slug} id={s.id} />}
            <Sfx id={i === 0 ? "thud" : "whoosh"} volume={i === 0 ? 0.5 : 0.35} />
            {s.commands.length > 0 && (
              <Sfx id="typing" at={TYPE_DELAY} frames={typingFrames(s.commands)} volume={0.25} />
            )}
            {i === 0 && <Brand />}
          </Series.Sequence>
        ))}
      </Series>
      <Music slug={slug} total={total} voiceRanges={silent ? [] : voiceRanges} level={silent ? 0.55 : undefined} />
      {guide && <TikTokGuide />}
    </AbsoluteFill>
  );

  return { id: slug, component: Fallback, durationInFrames: total };
};
