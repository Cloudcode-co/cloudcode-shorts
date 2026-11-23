import gsap from "gsap";
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Select = (selector: string) => Element[];

// A scene written the HyperFrames way: plain HTML and CSS animated by a GSAP
// timeline, which Remotion seeks to the current frame instead of letting it
// play, so every rendered frame is exact (frames render out of order and in
// several tabs). Give the markup as JSX children or as an `html` string, the
// styles as `css` (scope them under `className`), and build the animation in
// `timeline`: `tl` starts paused at 0 (seconds, local to the scene's
// Sequence), `q` selects inside this scene only.
//
//   <GsapScene className="s2" css={`.s2 h1 { font-size: 120px }`}
//     html={`<h1>Docker</h1><p>chạy mọi nơi</p>`}
//     timeline={(tl, q) => {
//       tl.fromTo(q("h1"), { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0.2);
//     }} />
//
// Use fromTo (not from), never tl.play(), and no CSS transitions or keyframes:
// only the timeline moves things.
export const GsapScene: React.FC<{
  timeline: (tl: gsap.core.Timeline, q: Select) => void;
  html?: string;
  css?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}> = ({ timeline, html, css, children, className, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Built once per mount; `timeline` is a new function on every render, so it
  // is deliberately not a dependency.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true });
      timeline(t, gsap.utils.selector(root.current));
      tl.current = t;
    }, root);
    return () => {
      ctx.revert();
      tl.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    tl.current?.seek(frame / fps, false);
  }, [frame, fps]);

  return (
    <AbsoluteFill ref={root} className={className} style={style}>
      {css ? <style>{css}</style> : null}
      {html !== undefined ? <AbsoluteFill dangerouslySetInnerHTML={{ __html: html }} /> : children}
    </AbsoluteFill>
  );
};
