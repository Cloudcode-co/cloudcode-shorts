import React from "react";
import { AbsoluteFill, useCurrentFrame, OffthreadVideo, interpolate } from "remotion";
import { videoAsset } from "../../../kit";
import { getCameraShake } from "../theme";
import { LiveCounter, SerifSubtitle, Vignette, ColorGrade, CornerCredit } from "../SimulationHud";
import { WireguardTunnelOverlay } from "../SimulationOverlays";

const SLUG = "espkvm-esp32-p4-ip-kvm";

export const Scene9: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();

  const shake = getCameraShake(frame, 3.5);
  const driftScale = interpolate(frame, [0, len], [1.04, 1.15]);

  // Fast cuts:
  // Cut 1: 0 - 85 (Cyber network tunnel footage)
  // Cut 2: 85 - 175 (Wireguard tunnel warning overlay)
  // Cut 3: 175 - 260 (Cyber tunnel footage zoom)
  // Cut 4: 260 - 355 (Wireguard tunnel secure mesh)
  // Cut 5: 355 - 465 (Cyber tunnel footage final flythrough)
  const cut =
    frame < 85
      ? 1
      : frame < 175
      ? 2
      : frame < 260
      ? 3
      : frame < 355
      ? 4
      : 5;

  const isDanger = frame < 220;

  const subtitle =
    frame < 110
      ? "Vì Secure Boot và mã hóa flash chưa được bật..."
      : frame < 230
      ? "...tuyệt đối không mở port thẳng ra Internet..."
      : frame < 340
      ? "...mà hãy đi qua Tailscale hoặc WireGuard..."
      : "...bảo mật mã hóa an toàn tuyệt đối cho homelab!";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#06030C" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.rot}deg) scale(${driftScale})`,
        }}
      >
        {cut === 1 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/cyber-security-digital-network-tunnel-pixabay-337317.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9)" }}
          />
        )}
        {cut === 2 && <WireguardTunnelOverlay />}
        {cut === 3 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/cyber-security-digital-network-tunnel-pixabay-337317.mp4")}
            muted
            trimBefore={90}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.9) contrast(1.15)",
              transform: "scale(1.2)",
            }}
          />
        )}
        {cut === 4 && <WireguardTunnelOverlay />}
        {cut === 5 && (
          <OffthreadVideo
            src={videoAsset(SLUG, "footage/cyber-security-digital-network-tunnel-pixabay-337317.mp4")}
            muted
            trimBefore={180}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.95)" }}
          />
        )}
      </AbsoluteFill>

      {/* Red danger transitioning to cool secure cyan */}
      <ColorGrade
        mode={isDanger ? "red" : "cold-blue"}
        intensity={0.45}
        alertPulse={isDanger}
      />
      <Vignette intensity={0.82} />

      <LiveCounter
        label="NETWORK SECURITY · VPN TUNNEL"
        value1={isDanger ? "0.0.0.0" : "100.64.1"}
        unit1={isDanger ? "DROP" : "VPN"}
        value2="TUNNEL"
        unit2={isDanger ? "WARN" : "SECURE"}
        color={isDanger ? "#F87171" : "#10B981"}
      />

      <SerifSubtitle text={subtitle} />
      <CornerCredit text="Footage: Pixabay / MrWashingt0n" />
    </AbsoluteFill>
  );
};
