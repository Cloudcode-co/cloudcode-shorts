// Renders one video and encodes it on the Intel iGPU (QuickSync).
// Remotion's bundled ffmpeg only knows NVENC/VideoToolbox, so this runs in two steps:
//   1. Remotion renders the frames (JPEG sequence) and the mixed audio (WAV).
//   2. A full ffmpeg build encodes them with h264_qsv.
//
//   npm run render:qsv -- <slug>                 # -> out/<slug>.mp4
//   FFMPEG=C:\path\ffmpeg.exe npm run render:qsv -- <slug>
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const COMP = process.argv[2];
if (!COMP) throw new Error("usage: render-qsv.mjs <slug>");
const FPS = 60;
const FRAMES = `out/${COMP}-frames`;
const AUDIO = `out/${COMP}.wav`;
const OUT = `out/${COMP}.mp4`;

// winget's Gyan.FFmpeg puts the binary under its package folder.
const findFfmpeg = () => {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  const root = join(process.env.LOCALAPPDATA ?? "", "Microsoft", "WinGet", "Packages");
  if (existsSync(root)) {
    for (const pkg of readdirSync(root).filter((d) => d.startsWith("Gyan.FFmpeg"))) {
      for (const build of readdirSync(join(root, pkg))) {
        const exe = join(root, pkg, build, "bin", "ffmpeg.exe");
        if (existsSync(exe)) return exe;
      }
    }
  }
  return "ffmpeg";
};

const run = (cmd, args) => {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: cmd === "npx" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

rmSync(FRAMES, { recursive: true, force: true });

run("npx", [
  "remotion", "render", COMP, FRAMES,
  "--sequence",
  "--image-format=jpeg",
  "--jpeg-quality=95",
  "--image-sequence-pattern=frame-[frame].[ext]",
]);
run("npx", ["remotion", "render", COMP, AUDIO, "--codec=wav"]);

// Remotion zero-pads [frame]; read the width from the first file.
const first = readdirSync(FRAMES).filter((f) => f.startsWith("frame-")).sort()[0];
const pad = first.slice("frame-".length, first.lastIndexOf(".")).length;

run(findFfmpeg(), [
  "-y",
  "-framerate", String(FPS),
  "-i", `${FRAMES}/frame-%0${pad}d.jpeg`,
  "-i", AUDIO,
  "-c:v", "h264_qsv",
  "-preset", "medium",
  "-global_quality", "20",
  "-pix_fmt", "nv12",
  "-c:a", "aac",
  "-b:a", "192k",
  "-shortest",
  "-movflags", "+faststart",
  OUT,
]);

rmSync(FRAMES, { recursive: true, force: true });
console.log(`\nDone: ${OUT}`);
