import React from "react";
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, Img, interpolate } from "remotion";
import { videoAsset } from "../../../kit";
import { getCameraShake } from "../theme";
import { LiveCounter, SerifSubtitle, Vignette, ColorGrade, CornerCredit } from "../SimulationHud";
import { KernelPanicOverlay } from "../SimulationOverlays";

const SLUG = "espkvm-esp32-p4-ip-kvm";

export const Scene2: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const shakeIntensity = interpolate(frame, [0, len], [4, 8], { extrapolateRight: "clamp" });
  const shake = getCameraShake(frame, shakeIntensity);
  const driftScale = interpolate(frame, [0, len], [1.05, 1.15]);

  // Fast cuts:
  // Cut 1: 0 - 80 (Dark walk footage)
  // Cut 2: 80 - 165 (Kernel panic terminal simulation)
  // Cut 3: 165 - 250 (Dark walk footage panned)
  // Cut 4: 250 - 339 (Server rack macro lights)
  const cut = frame < 80 ? 1 : frame < 165 ? 2 : frame < 250 ? 3 : 4;

  const meters = Math.max(10, 1420 - Math.floor(frame * 4));

  const subtitle =
    frame < 110
      ? "Thường thì máy chủ lỗi kernel hoặc kẹt boot menu..."
      : frame < 220
      ? "...không có OS, Remote Desktop hoàn toàn vô dụng..."
      : "...anh em phải chạy bộ tới tận nơi cắm màn hình cơ.";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#06080E" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.rot}deg) scale(${driftScale})`,
        }}
      >
        {cut === 1 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/server-room-dark-walk-pixabay-14900.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }}
          />
        )}
        {cut === 2 && <KernelPanicOverlay />}
        {cut === 3 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/server-room-dark-walk-pixabay-14900.mp4")}
            muted
            trimBefore={120}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.65) contrast(1.1)",
              objectPosition: "60% center",
            }}
          />
        )}
        {cut === 4 && (
          <Img
            src={videoAsset(SLUG, "images/server-rack-blinking-lights-pixabay-197303.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.7) contrast(1.15)",
              transform: `scale(${1 + (frame - 250) * 0.003})`,
            }}
          />
        )}
      </AbsoluteFill>

      <ColorGrade mode="red" intensity={0.4} alertPulse />
      <Vignette intensity={0.88} />

      <LiveCounter
        label="PHYSICAL DISTANCE · BOOT STATUS"
        value1={meters}
        unit1="METERS"
        value2="PANIC"
        unit2="NO OS"
        color="#F87171"
      />

      <SerifSubtitle text={subtitle} />
      <CornerCredit text="Footage: Pixabay / cipnt" />
    </AbsoluteFill>
  );
};
