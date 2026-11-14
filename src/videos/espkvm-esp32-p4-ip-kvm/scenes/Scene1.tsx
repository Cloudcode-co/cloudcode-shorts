import React from "react";
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, Img, interpolate } from "remotion";
import { videoAsset } from "../../../kit";
import { getCameraShake } from "../theme";
import { LiveCounter, SerifSubtitle, Vignette, ColorGrade, CornerCredit } from "../SimulationHud";
import { BiosScreenOverlay } from "../SimulationOverlays";

const SLUG = "espkvm-esp32-p4-ip-kvm";

export const Scene1: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Subtle camera shake that grows with tension
  const shakeIntensity = interpolate(frame, [0, len], [3, 9], { extrapolateRight: "clamp" });
  const shake = getCameraShake(frame, shakeIntensity);
  const driftScale = interpolate(frame, [0, len], [1.04, 1.12]);

  // Fast cuts:
  // Cut 1: 0 - 80 (Footage 1)
  // Cut 2: 80 - 165 (Photo macro blinking server rack)
  // Cut 3: 165 - 250 (Footage 1 closer zoom + glitch)
  // Cut 4: 250 - 353 (BIOS error screen overlay)
  const cut = frame < 80 ? 1 : frame < 165 ? 2 : frame < 250 ? 3 : 4;

  // Live counter ticks with story
  const secondsCount = Math.floor(frame / 60) + 12;
  const value1 = `04:${secondsCount < 10 ? "0" + secondsCount : secondsCount}`;

  // Subtitle lines synchronized
  const subtitle =
    frame < 110
      ? "Server sập ở BIOS thì Remote Desktop chịu chết..."
      : frame < 220
      ? "...kết nối mạng tê liệt, không thể can thiệp từ xa..."
      : "...còn mua PiKVM thì lại tốn tiền triệu?";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#05070B" }}>
      {/* World moving with camera shake */}
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.rot}deg) scale(${driftScale})`,
        }}
      >
        {cut === 1 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/frustrated-developer-server-rack-pixabay-171185.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }}
          />
        )}
        {cut === 2 && (
          <Img
            src={videoAsset(SLUG, "images/server-rack-blinking-lights-pixabay-197303.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.7) contrast(1.1)",
              transform: `scale(${1 + (frame - 80) * 0.002})`,
            }}
          />
        )}
        {cut === 3 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/frustrated-developer-server-rack-pixabay-171185.mp4")}
            muted
            trimBefore={180}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }}
          />
        )}
        {cut === 4 && <BiosScreenOverlay />}
      </AbsoluteFill>

      {/* Color grade shifting to red for crisis */}
      <ColorGrade mode="red" intensity={0.45} alertPulse />
      <Vignette intensity={0.85} />

      {/* Live Counter (isOpening true so it clears <Brand />) */}
      <LiveCounter
        label="INCIDENT METRIC · DOWNTIME DURATION"
        value1={value1}
        unit1="SEC"
        value2="PANIC"
        unit2="BIOS DEAD"
        color="#F87171"
        isOpening
      />

      <SerifSubtitle text={subtitle} />
      <CornerCredit text="Footage: Pixabay / MozoMozo" />
    </AbsoluteFill>
  );
};
