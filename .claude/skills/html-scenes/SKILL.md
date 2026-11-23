---
name: html-scenes
description: Write a scene as plain HTML and CSS animated by a GSAP timeline instead of Remotion's interpolate/spring, in two ways - <GsapScene> inside the Remotion video (default), or a separate HyperFrames project rendered to a clip and played with <HfClip>. Use when a scene is easier to write as a web page (layouts, text reveals, cards, UI mockups, charts), or when you are more fluent in HTML/CSS/GSAP than in Remotion.
---

# HTML scenes

The video stays a Remotion video: voice, music, captions, `<Brand />`, scene timing and `Sequence`s are Remotion as usual. Only a scene's picture can be written as a web page. Two ways, pick per scene:

| | `<GsapScene>` (default) | HyperFrames clip (`<HfClip>`) |
| --- | --- | --- |
| Where the code lives | Inside `Video.tsx` | `src/videos/<slug>/hf/<name>/index.html` |
| Renders | With the video, frame-exact | Separately, to an MP4 the video plays |
| Use for | Most HTML scenes | A scene that needs a full web page of its own: many elements, heavy CSS, its own fonts, a long self-contained sequence |
| Cost | Nothing extra | About 10 s of render per second of clip, plus a lint gate |

Both use GSAP. The rules that matter in both:

- Build every move with `tl.fromTo(...)` (never `from`, which drifts when a frame is seeked back), at an absolute position in seconds: `tl.fromTo(el, {...}, {...}, 0.4)`.
- Never `tl.play()`, `setTimeout`, `requestAnimationFrame`, CSS `transition`, CSS `@keyframes`, or `animation:`. Only the timeline moves things: Remotion and HyperFrames render frames out of order, and anything running on the clock shows the wrong state.
- The canvas is 1080 × 1920. Keep text inside the TikTok safe area (BUILDER.md: x 60–880, y 220–1480), at least 34 px.
- Time the moves to the voice: a scene's timeline starts at 0 when its `Sequence` starts. `timeline.json` (when present) gives each phrase's start; otherwise spread the beats over the scene's length from `durations.json`.

## 1. `<GsapScene>` inside Remotion

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import { GsapScene } from "../../kit";

<Sequence from={start} durationInFrames={len}>
  <GsapScene
    className="s3"
    css={`
      .s3 { background: #0f1115; }
      .s3 .title { position: absolute; left: 80px; top: 520px; width: 800px;
                   font: 800 112px/1.05 "Be Vietnam Pro", sans-serif; color: #fff; margin: 0; }
      .s3 .card  { position: absolute; left: 80px; width: 800px; height: 150px; border-radius: 28px;
                   background: #1c2028; color: #e8e8e8; font: 600 44px/150px "Be Vietnam Pro", sans-serif;
                   padding: 0 40px; box-sizing: border-box; }
    `}
    html={`
      <h1 class="title">3 lệnh là chạy</h1>
      <div class="card" style="top: 820px">docker compose up -d</div>
      <div class="card" style="top: 1000px">docker compose logs -f</div>
      <div class="card" style="top: 1180px">docker compose down</div>
    `}
    timeline={(tl, q) => {
      tl.fromTo(q(".title"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.1);
      tl.fromTo(q(".card"), { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.6 }, 0.8);
    }}
  />
</Sequence>
```

- `className` scopes the CSS: start every selector with it (`.s3 ...`), so two scenes never style each other.
- `html` is a string of plain HTML. JSX children work too, when you need data from `script.json` or `facts.json` in the markup (`{facts.repos[0].stars}`).
- `q(".card")` selects only inside this scene.
- Fonts: use the ones the video already loads (the kit `display` family, or one loaded with `@remotion/google-fonts` at the top of `Video.tsx`), by name in the CSS.
- Images: put them under `public/videos/<slug>/` (through `npm run image`) and use `staticFile(...)` in JSX children, or the full path from `staticFile` inside the `html` string.

## 2. A HyperFrames clip

A HyperFrames project is a single HTML page with a paused GSAP timeline, rendered to an MP4. Write it at `src/videos/<slug>/hf/<name>/index.html`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.1/dist/gsap.min.js"></script>
    <style>
      body { margin: 0; }
      #root { position: absolute; inset: 0; background: #0b3d2e; overflow: hidden; }
      #chart-title { position: absolute; left: 80px; top: 360px; width: 800px; margin: 0;
                     color: #fff; font: 900 96px/1.05 Montserrat, sans-serif; }
      .bar { position: absolute; left: 80px; height: 90px; border-radius: 18px; background: #ffd43b;
             transform-origin: left center; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="5" data-width="1080" data-height="1920">
      <h1 id="chart-title" class="clip" data-start="0" data-duration="5">Ai nhanh hơn?</h1>
      <div id="bar-a" class="bar clip" data-start="0" data-duration="5" style="top: 760px; width: 760px"></div>
      <div id="bar-b" class="bar clip" data-start="0" data-duration="5" style="top: 900px; width: 420px"></div>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#chart-title", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.2);
      tl.fromTo(".bar", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.out", stagger: 0.4 }, 0.8);
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
```

The format, strictly:

- The root is `<div id="root" data-composition-id="main" data-start="0" data-duration="<seconds>" data-width="1080" data-height="1920">`, and the timeline is stored as `window.__timelines["main"]`. Same id in both.
- `data-duration` is the scene's length in seconds (its frames ÷ 60). The clip holds its last frame if the scene runs longer.
- Every visible element directly in the root gets `class="clip"`, a unique `id`, `data-start` and `data-duration` (seconds).
- Load GSAP with exactly the `<script src=...gsap.min.js>` line above; the lint fails without it.
- Fonts that resolve by name: Inter, Montserrat, Outfit, Nunito, Oswald, League Gothic, Archivo Black, Space Mono, IBM Plex Mono, JetBrains Mono, EB Garamond, Playfair Display, Source Code Pro, Roboto, Open Sans, Lato, Poppins. Check Vietnamese text renders in the stills: Inter, Montserrat, Roboto, Open Sans and Playfair Display carry it.
- No sound in the clip: the voice and music stay in Remotion.

Render it, then play it in the video:

```bash
npm run hyperframes -- <slug> <name>
```

This lints the project and renders `public/videos/<slug>/hf/<name>.mp4`. A lint error prints `✗ ...` and a `Fix:` line: fix it and run again. Then:

```tsx
import { HfClip } from "../../kit";

<Sequence from={start} durationInFrames={len}>
  <HfClip slug="<slug>" name="<name>" />
  {/* captions, Brand, anything else in Remotion goes on top */}
</Sequence>
```

The MP4 is not kept in the repo: the pipeline renders it again from your `index.html`. A clip that does not render fails your build, so run `npm run hyperframes -- <slug>` before you finish and keep it passing.
