import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";

// Every video keeps its own files under public/videos/<slug>/.
export const videoAsset = (slug: string, path: string) =>
  staticFile(`videos/${slug}/${path}`);

// Voiceover clip public/videos/<slug>/voiceover/<id>.mp3, from scripts/voiceover.mjs.
export const Voice: React.FC<{ slug: string; id: string }> = ({ slug, id }) => (
  <Audio src={videoAsset(slug, `voiceover/${id}.mp3`)} name={`voice: ${id}`} />
);

// Shared sound effect public/sfx/<id>.mp3 at frame `at` of the current
// sequence, kept well under the voice. Ids: whoosh, pop, thud, pixel, typing, ding.
export const Sfx: React.FC<{ id: string; at?: number; volume?: number; frames?: number }> = ({
  id,
  at = 0,
  volume = 0.35,
  frames,
}) => (
  <Sequence from={at} durationInFrames={frames} layout="none" name={`sfx: ${id}`}>
    <Audio src={staticFile(`sfx/${id}.mp3`)} volume={volume} />
  </Sequence>
);

const MUSIC_UP = 0.22;
const MUSIC_UNDER_VOICE = 0.08;
const DUCK_RAMP = 10;

// Background track public/videos/<slug>/music.mp3, ducked while the voice
// talks (`voiceRanges` = [start, end] frames) and faded in and out.
export const Music: React.FC<{
  slug: string;
  total: number;
  voiceRanges: [number, number][];
}> = ({ slug, total, voiceRanges }) => {
  const volume = (f: number) => {
    const duck = Math.max(
      0,
      ...voiceRanges.map(([start, end]) =>
        interpolate(f, [start - DUCK_RAMP, start, end, end + DUCK_RAMP], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      ),
    );
    const fade = interpolate(f, [0, 30, total - 90, total], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (MUSIC_UP - (MUSIC_UP - MUSIC_UNDER_VOICE) * duck) * fade;
  };
  return <Audio src={videoAsset(slug, "music.mp3")} volume={volume} name="Music" />;
};
