import React from "react";
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, Img, interpolate } from "remotion";
import { videoAsset } from "../../../kit";
import { getCameraShake } from "../theme";
import { LiveCounter, SerifSubtitle, Vignette, ColorGrade, CornerCredit } from "../SimulationHud";
import { Scanlines } from "../SimulationOverlays";

const SLUG = "espkvm-esp32-p4-ip-kvm";

export const Scene3: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const shakeIntensity = interpolate(frame, [0, len], [2, 5], { extrapolateRight: "clamp" });
  const shake = getCameraShake(frame, shakeIntensity);
  const driftScale = interpolate(frame, [0, len], [1.04, 1.12]);

  // Fast cuts:
  // Cut 1: 0 - 80 (Microchip circuit footage)
  // Cut 2: 80 - 165 (Macro motherboard photo)
  // Cut 3: 165 - 250 (Microchip circuit footage reverse angle)
  // Cut 4: 250 - 330 (Macro photo laser scan)
  // Cut 5: 330 - 411 (Microchip circuit footage zoom)
  const cut = frame < 80 ? 1 : frame < 165 ? 2 : frame < 250 ? 3 : frame < 330 ? 4 : 5;

  const mhz = Math.min(400, Math.floor(360 + (frame / len) * 40));

  const subtitle =
    frame < 120
      ? "Còn espkvm giải quyết bằng vi điều khiển ESP32-P4..."
      : frame < 250
      ? "...biến một con chip nhỏ thành IP-KVM hoàn chỉnh..."
      : "...chạy thẳng bare-metal, không cần cài đặt Linux!";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#040914" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.rot}deg) scale(${driftScale})`,
        }}
      >
        {cut === 1 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/circuit-board-microchip-pixabay-13370.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)" }}
          />
        )}
        {cut === 2 && (
          <AbsoluteFill>
            <Img
              src={videoAsset(SLUG, "images/circuit-motherboard-processor-macro-pixabay-564811.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.75) contrast(1.1)",
                transform: `scale(${1 + (frame - 80) * 0.002})`,
              }}
            />
            <Scanlines opacity={0.2} />
          </AbsoluteFill>
        )}
        {cut === 3 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/circuit-board-microchip-pixabay-13370.mp4")}
            muted
            trimBefore={120}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.8)",
              transform: "scaleX(-1)",
            }}
          />
        )}
        {cut === 4 && (
          <AbsoluteFill>
            <Img
              src={videoAsset(SLUG, "images/circuit-motherboard-processor-macro-pixabay-564811.jpg")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.8) hue-rotate(180deg)",
                transform: `scale(${1.08 + (frame - 250) * 0.002})`,
              }}
            />
            <Scanlines opacity={0.25} />
          </AbsoluteFill>
        )}
        {cut === 5 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/circuit-board-microchip-pixabay-13370.mp4")}
            muted
            trimBefore={240}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.8)" }}
          />
        )}
      </AbsoluteFill>

      {/* Thin cold blue grade */}
      <ColorGrade mode="cold-blue" intensity={0.4} />
      <Vignette intensity={0.82} />

      <LiveCounter
        label="MCU ARCHITECTURE · CORE FREQUENCY"
        value1={mhz}
        unit1="MHZ"
        value2="0"
        unit2="MB LINUX"
        color="#38BDF8"
      />

      <SerifSubtitle text={subtitle} />
      <CornerCredit text="Footage: Pixabay / Art-Production" />
    </AbsoluteFill>
  );
};
