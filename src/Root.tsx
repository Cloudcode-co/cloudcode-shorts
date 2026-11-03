import { Composition } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./kit";
import { VIDEOS } from "./videos";

// One composition per video folder; `guide` overlays TikTok's UI for checking.
export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={v.component}
        durationInFrames={v.durationInFrames}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ guide: false }}
      />
    ))}
  </>
);
