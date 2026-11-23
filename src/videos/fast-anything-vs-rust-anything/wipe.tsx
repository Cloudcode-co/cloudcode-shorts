import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { C } from "./theme";

type Props = Record<string, never>;

// A broadcast push-wipe: the old story drifts left, the new one slides in
// over it with a red keyline on its leading edge. Quick, hard, no blur.
const PushWipe: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const t = interpolate(presentationProgress, [0, 1], [0, 1], {
    easing: Easing.bezier(0.23, 1, 0.32, 1),
  });
  if (presentationDirection === "entering") {
    return (
      <AbsoluteFill style={{ transform: `translateX(${(1 - t) * 100}%)` }}>
        <AbsoluteFill
          style={{
            left: 0,
            top: 0,
            bottom: 0,
            width: 16,
            background: C.red,
          }}
        />
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ transform: `translateX(${-t * 16}%)` }}>{children}</AbsoluteFill>
  );
};

export const pushWipe = (): TransitionPresentation<Props> => ({
  component: PushWipe,
  props: {},
});
