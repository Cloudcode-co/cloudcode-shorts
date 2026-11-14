import React from "react";
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, interpolate, Easing } from "remotion";
import { videoAsset } from "../../../kit";
import { getCameraShake } from "../theme";
import { LiveCounter, SerifSubtitle, Vignette, ColorGrade, CornerCredit } from "../SimulationHud";
import { LatencyScopeOverlay } from "../SimulationOverlays";

const SLUG = "espkvm-esp32-p4-ip-kvm";

export const Scene5: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  // Drop impact slam on frame 0
  const slam = interpolate(frame, [0, 12], [14, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const flash = interpolate(frame, [0, 8], [0.8, 0], {
    extrapolateRight: "clamp",
  });

  const baseShake = getCameraShake(frame, 4 + slam);
  const driftScale = interpolate(frame, [0, len], [1.04, 1.12]);

  // Fast cuts:
  // Cut 1: 0 - 85 (DROP HIT! Mouse click vertical footage)
  // Cut 2: 85 - 170 (Latency scope radar telemetry)
  // Cut 3: 170 - 255 (Mouse click vertical footage zoom)
  // Cut 4: 255 - 340 (Latency scope telemetry)
  // Cut 5: 340 - 425 (Mouse click vertical footage high speed)
  // Cut 6: 425 - 516 (Latency scope summary)
  const cut =
    frame < 85
      ? 1
      : frame < 170
      ? 2
      : frame < 255
      ? 3
      : frame < 340
      ? 4
      : frame < 425
      ? 5
      : 6;

  // Latency ticks down from 120ms to 60ms on the drop slam
  const latency = Math.round(
    interpolate(frame, [0, 20], [140, 60], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.23, 1, 0.32, 1),
    }),
  );

  const subtitle =
    frame < 120
      ? "Nhờ vậy, độ trễ chuột chỉ khoảng 60 mili-giây..."
      : frame < 250
      ? "...phản hồi siêu nhạy trên chip rev 3.x..."
      : frame < 380
      ? "...toàn bộ giao diện web chỉ nặng đúng 70 kilobyte..."
      : "...thao tác mượt mà như cắm trực tiếp!";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#020713" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${baseShake.x}px, ${baseShake.y}px) rotate(${baseShake.rot}deg) scale(${driftScale})`,
        }}
      >
        {cut === 1 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/computer-mouse-hand-click-pixabay-154373.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9)" }}
          />
        )}
        {cut === 2 && <LatencyScopeOverlay />}
        {cut === 3 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/computer-mouse-hand-click-pixabay-154373.mp4")}
            muted
            trimBefore={90}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.85) contrast(1.1)",
              transform: "scale(1.2)",
            }}
          />
        )}
        {cut === 4 && <LatencyScopeOverlay />}
        {cut === 5 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/computer-mouse-hand-click-pixabay-154373.mp4")}
            muted
            trimBefore={160}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.9)",
              transform: "scaleX(-1)",
            }}
          />
        )}
        {cut === 6 && <LatencyScopeOverlay />}
      </AbsoluteFill>

      {/* Drop Flash */}
      {flash > 0.01 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#38BDF8",
            opacity: flash,
            pointerEvents: "none",
            mixBlendMode: "screen",
            zIndex: 43,
          }}
        />
      )}

      <ColorGrade mode="cold-blue" intensity={0.5} />
      <Vignette intensity={0.8} />

      <LiveCounter
        label="INPUT LATENCY · CONSOLE SIZE"
        value1={latency}
        unit1="MS"
        value2="70"
        unit2="KB WEB"
        color="#38BDF8"
      />

      <SerifSubtitle text={subtitle} />
      <CornerCredit text="Footage: Pixabay / berctk" />
    </AbsoluteFill>
  );
};
