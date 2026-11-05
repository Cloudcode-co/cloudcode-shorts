---
name: edit-styles
description: Two edit styles Rumi picked from real videos, broken down for Remotion shorts. Use when the art direction is `pastel-3d-explainer` or `breakcore-swiss`, or when asked for a video "like the ctdozlite TikTok" or "breakcore".
---

# Edit styles

Each style was taken frame by frame from a reference video and adapted to this project: 1080×1920, 60 fps, a voiceover, and renders on a CPU without a GPU. Read the file for the style you are building; the other one doesn't apply to this video.

- **Pastel 3D explainer** — [pastel-3d-explainer.md](pastel-3d-explainer.md). Calm, springy and friendly. It walks through a product's features: problem → proof → one feature per beat → CTA. Best for an app or a self-hosted tool with a UI to show.
- **Breakcore Swiss** — [breakcore-swiss.md](breakcore-swiss.md). Regraded stock footage and white Swiss posters cut hard on a 150 BPM grid, with 2-frame inserts and almost no text. Best for a launch, a hype tool, or a short punchy topic.

## Rules both styles share

- The voiceover carries the facts. A number, price, command or name stays on screen, readable and still, for at least 1 s (60 frames), whatever the style does around it.
- The style is a grammar, not a template. Every scene keeps its own layout, and the background still matches the line (BUILDER.md).
- Keep CPU cost low. Fake `filter: blur()`, big soft shadows and glow with radial gradients and pre-blurred PNGs, and keep `@remotion/three` to one hero object per scene. Check `animation-performance` before adding any full-frame effect.
- Done means every rule in the style's file is either applied or skipped with a reason you can name.
