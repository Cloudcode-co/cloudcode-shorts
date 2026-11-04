import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, interpolate } from "remotion";

// TikTok-style presentations for <TransitionSeries.Transition presentation={...}>,
// next to @remotion/transitions' own fade, slide, wipe, flip and clockWipe.
// They are short and hard: use them with linearTiming or springTiming of about
// 8–14 frames. Blur is the costly part on a CPU render, so it stays light.

type Empty = Record<string, never>;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// Whip pan: both shots fly sideways with a little motion blur.
const Whip: React.FC<TransitionPresentationComponentProps<{ direction: 1 | -1 }>> = ({
  children,
  presentationProgress: p,
  presentationDirection,
  passedProps,
}) => {
  const t = ease(p);
  const sign = passedProps.direction;
  const x = presentationDirection === "entering" ? (1 - t) * 100 * sign : -t * 100 * sign;
  const blur = Math.sin(p * Math.PI) * 6;
  return (
    <AbsoluteFill style={{ transform: `translateX(${x}%)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};
export const whip = (direction: 1 | -1 = 1): TransitionPresentation<{ direction: 1 | -1 }> => ({
  component: Whip,
  props: { direction },
});

// Zoom punch: the old shot rushes at the camera and fades, the new one lands
// from slightly too big.
const ZoomPunch: React.FC<TransitionPresentationComponentProps<Empty>> = ({
  children,
  presentationProgress: p,
  presentationDirection,
}) => {
  const t = ease(p);
  const style =
    presentationDirection === "exiting"
      ? { transform: `scale(${1 + t * 0.6})`, opacity: 1 - t }
      : { transform: `scale(${1.25 - t * 0.25})`, opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }) };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
export const zoomPunch = (): TransitionPresentation<Empty> => ({ component: ZoomPunch, props: {} });

// Flash: a white flash hides the cut at its peak.
const Flash: React.FC<TransitionPresentationComponentProps<{ color: string }>> = ({
  children,
  presentationProgress: p,
  presentationDirection,
  passedProps,
}) => {
  const visible = presentationDirection === "entering" ? p >= 0.5 : p < 0.5;
  return (
    <AbsoluteFill>
      {visible && children}
      {presentationDirection === "entering" && (
        <AbsoluteFill style={{ backgroundColor: passedProps.color, opacity: 1 - Math.abs(p - 0.5) * 2 }} />
      )}
    </AbsoluteFill>
  );
};
export const flash = (color = "#ffffff"): TransitionPresentation<{ color: string }> => ({
  component: Flash,
  props: { color },
});
