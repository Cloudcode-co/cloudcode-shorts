// The Chromium OpenGL renderer a video needs. 3D videos (they import
// @remotion/three or the kit's Stage3D) need WebGL: "swangle" renders it in
// software, which works on CI machines without a GPU; "angle" uses the GPU
// on a desktop. 2D videos keep Remotion's default.
import { readFileSync, readdirSync } from "node:fs";

export const uses3d = (slug) =>
  readdirSync(`src/videos/${slug}`, { recursive: true })
    .filter((f) => /\.tsx?$/.test(String(f)))
    .some((f) => /@remotion\/three|Stage3D|useImageTexture/.test(readFileSync(`src/videos/${slug}/${f}`, "utf8")));

export const glFor = (slug) => (uses3d(slug) ? (process.env.CI ? "swangle" : "angle") : null);
