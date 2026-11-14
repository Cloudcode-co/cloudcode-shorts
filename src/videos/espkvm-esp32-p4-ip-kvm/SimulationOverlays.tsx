import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { mono, sans, SAFE } from "./theme";

export const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.15 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background:
        "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.45) 0px, rgba(0, 0, 0, 0.45) 2px, transparent 2px, transparent 4px)",
      pointerEvents: "none",
      zIndex: 30,
      opacity,
    }}
  />
);

export const BiosScreenOverlay: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000066",
        color: "#AAAAAA",
        fontFamily: mono,
        fontSize: 34,
        padding: `${SAFE.top + 215}px ${SAFE.right}px ${SAFE.bottom + 100}px ${SAFE.left}px`,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Scanlines opacity={0.25} />
      {/* BIOS Tabs */}
      <div
        style={{
          borderBottom: "2px solid #888888",
          paddingBottom: 8,
          marginBottom: 16,
          color: "#DDDDDD",
          fontSize: 32,
        }}
      >
        Main &nbsp; Advanced &nbsp; Chipset &nbsp; <span style={{ color: "#FFFF55", fontWeight: 700 }}>[ Boot ]</span> &nbsp; Exit
      </div>

      <div style={{ lineHeight: 1.5 }}>
        <div style={{ color: "#FFFF55", fontWeight: 700 }}>
          Boot Option Priorities:
        </div>
        <div style={{ color: "#FFFFFF", marginTop: 6 }}>
          #1 &nbsp;[&nbsp;<span style={{ color: "#55FF55", fontWeight: 700 }}>ESP-KVM Virtual Media USB</span>&nbsp;]
        </div>
        <div style={{ color: "#888888", marginTop: 4 }}>
          #2 &nbsp;[&nbsp;NVMe SSD 1TB: OS Corrupt&nbsp;]
        </div>

        <div style={{ marginTop: 24, color: "#FFFF55", fontWeight: 700 }}>
          Hardware Status:
        </div>
        <div style={{ color: "#FF6666", marginTop: 4 }}>
          [ERR] Remote Desktop: Unreachable
        </div>
        <div style={{ color: "#55FF55", marginTop: 4 }}>
          [OK] USB Virtual ISO Mounted: 100%
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const KernelPanicOverlay: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080A0E",
        color: "#EEEEEE",
        fontFamily: mono,
        fontSize: 34,
        padding: `${SAFE.top + 215}px ${SAFE.right}px ${SAFE.bottom + 100}px ${SAFE.left}px`,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Scanlines opacity={0.3} />
      <div style={{ color: "#FF4444", fontWeight: 700, marginBottom: 12 }}>
        [CRITICAL ERROR] KERNEL PANIC DETECTED
      </div>
      <div style={{ color: "#999999", lineHeight: 1.5 }}>
        <div>[ 1.482910] Call Trace:</div>
        <div>[ 1.482931] &nbsp;&lt;TASK&gt; panic+0x138/0x310</div>
        <div>[ 1.482974] &nbsp;mount_block_root+0x1a4</div>
        <div style={{ color: "#FF5555", fontWeight: 700 }}>
          [ 1.483018] &nbsp;Kernel panic - not syncing: VFS: Unable to mount root fs
        </div>
        <div>[ 1.483065] &nbsp;Hardware: ProLiant MicroServer</div>
        <div style={{ color: "#FFAA00", marginTop: 12 }}>
          [ 1.483088] ---[ end Kernel panic ]---
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CsiPipelineOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const flow = (frame * 8) % 24;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030814",
        color: "#FFFFFF",
        fontFamily: sans,
        padding: `${SAFE.top + 215}px ${SAFE.right}px ${SAFE.bottom + 90}px ${SAFE.left}px`,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Scanlines opacity={0.2} />

      {/* Block 1 */}
      <div
        style={{
          border: "2px solid #0284C7",
          backgroundColor: "rgba(2, 132, 199, 0.2)",
          padding: 14,
          borderRadius: 8,
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 24, color: "#93C5FD", textTransform: "uppercase" }}>Target Video Out</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#FFFFFF" }}>HDMI 1080p 60Hz</div>
      </div>

      {/* Connector line */}
      <div style={{ height: 24, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ width: 4, height: "100%", background: "#0284C7" }} />
        <div style={{ position: "absolute", width: 10, height: 10, borderRadius: 5, background: "#38BDF8", top: `${flow}px` }} />
      </div>

      {/* Block 2 */}
      <div
        style={{
          border: "2px solid #10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          padding: 14,
          borderRadius: 8,
          marginBottom: 8,
        }}
      >
        <div style={{ fontSize: 24, color: "#A7F3D0", textTransform: "uppercase" }}>HDMI-to-CSI Bridge</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#FFFFFF" }}>Toshiba TC358743</div>
        <div style={{ fontSize: 26, fontFamily: mono, color: "#6EE7B7", marginTop: 2 }}>2-Lane MIPI CSI-2</div>
      </div>

      {/* Connector line */}
      <div style={{ height: 24, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ width: 4, height: "100%", background: "#10B981" }} />
      </div>

      {/* Block 3 */}
      <div
        style={{
          border: "2px solid #F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.2)",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 24, color: "#FDE68A", textTransform: "uppercase" }}>Hardware Video Encoder</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#FFFFFF" }}>ESP32-P4 RISC-V</div>
        <div style={{ fontSize: 26, fontFamily: mono, color: "#FCD34D", marginTop: 2 }}>H.264 &amp; MJPEG Hardware Codec</div>
      </div>
    </AbsoluteFill>
  );
};

export const LatencyScopeOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const radius = 50 + ((frame * 5) % 100);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#020713",
        color: "#FFFFFF",
        fontFamily: sans,
        padding: `${SAFE.top + 215}px ${SAFE.right}px ${SAFE.bottom + 90}px ${SAFE.left}px`,
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Scanlines opacity={0.2} />

      {/* Radar circle simulation */}
      <div
        style={{
          position: "relative",
          width: 260,
          height: 260,
          borderRadius: 130,
          border: "2px dashed #0284C7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        {/* Pulsing ring */}
        <div
          style={{
            position: "absolute",
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            border: "2px solid #38BDF8",
            opacity: Math.max(0, 1 - radius / 150),
          }}
        />
        {/* Crosshair */}
        <div style={{ position: "absolute", width: "100%", height: 1, background: "rgba(56, 189, 248, 0.4)" }} />
        <div style={{ position: "absolute", height: "100%", width: 1, background: "rgba(56, 189, 248, 0.4)" }} />
        {/* Center dot */}
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "#38BDF8", boxShadow: "0 0 15px #38BDF8" }} />
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <div style={{ fontFamily: mono, fontSize: 44, fontWeight: 800, color: "#38BDF8" }}>
          SILICON REV 3.X
        </div>
        <div style={{ fontFamily: sans, fontSize: 30, color: "#94A3B8", marginTop: 4 }}>
          Web Console: 70 KB Gzipped Bundle
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const WebSerialFlashOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const pct = Math.min(100, Math.floor(frame * 1.8));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070B12",
        color: "#EEEEEE",
        fontFamily: mono,
        fontSize: 32,
        padding: `${SAFE.top + 215}px ${SAFE.right}px ${SAFE.bottom + 90}px ${SAFE.left}px`,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Scanlines opacity={0.2} />
      <div style={{ color: "#94A3B8", lineHeight: 1.5 }}>
        <div>&gt; Web Serial: /dev/ttyACM0 connected</div>
        <div>&gt; Chip: ESP32-P4 (32MB Flash)</div>
        <div style={{ color: "#34D399", marginTop: 8 }}>
          &gt; Writing firmware at 921,600 baud...
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: 32,
          backgroundColor: "#1E293B",
          borderRadius: 6,
          border: "2px solid #334155",
          marginTop: 18,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, #0284C7, #38BDF8)",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: mono, fontSize: 30, color: "#38BDF8" }}>
        <span>FLASH PROGRESS</span>
        <span>{pct}% COMPLETE</span>
      </div>

      {pct >= 100 && (
        <div style={{ color: "#34D399", marginTop: 16, fontWeight: 700 }}>
          ✓ FLASH SUCCESS! REBOOTING KVM...
        </div>
      )}
    </AbsoluteFill>
  );
};

export const PinoutGotchaOverlay: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0608",
        color: "#EEEEEE",
        fontFamily: sans,
        fontSize: 32,
        padding: `${SAFE.top + 215}px ${SAFE.right}px ${SAFE.bottom + 90}px ${SAFE.left}px`,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Scanlines opacity={0.25} />

      <div
        style={{
          border: "2px solid #DC2626",
          backgroundColor: "rgba(220, 38, 38, 0.18)",
          padding: 14,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 24, color: "#FCA5A5", textTransform: "uppercase" }}>USB-C Port</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#FFFFFF" }}>Flash &amp; Serial Log Only</div>
        <div style={{ fontSize: 26, color: "#F87171", marginTop: 2 }}>Không cắm vào máy chủ để điều khiển phím chuột</div>
      </div>

      <div
        style={{
          border: "2px solid #10B981",
          backgroundColor: "rgba(16, 185, 129, 0.18)",
          padding: 14,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 24, color: "#6EE7B7", textTransform: "uppercase" }}>MX1.25 Header (USB OTG)</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#FFFFFF" }}>Cổng nối phím chuột máy chủ</div>
        <div style={{ fontSize: 26, color: "#A7F3D0", marginTop: 2 }}>Cáp MX1.25 sang USB-A cắm vào máy tính</div>
      </div>

      <div
        style={{
          border: "2px solid #F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.18)",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 24, color: "#FCD34D", textTransform: "uppercase" }}>HTTPS Security</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#FFFFFF" }}>Cài chứng chỉ cert.pem</div>
        <div style={{ fontSize: 26, color: "#FDE68A", marginTop: 2 }}>Trình duyệt cần CA để kích hoạt chuột &amp; H.264</div>
      </div>
    </AbsoluteFill>
  );
};

export const WireguardTunnelOverlay: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#020712",
        color: "#FFFFFF",
        fontFamily: sans,
        padding: `${SAFE.top + 215}px ${SAFE.right}px ${SAFE.bottom + 90}px ${SAFE.left}px`,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Scanlines opacity={0.2} />

      <div
        style={{
          border: "2px solid #EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.18)",
          padding: 14,
          borderRadius: 8,
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 800, color: "#FCA5A5" }}>
          KHÔNG MỞ PORT RA INTERNET!
        </div>
        <div style={{ fontSize: 26, color: "#FFFFFF", marginTop: 4 }}>
          Secure Boot &amp; Flash Encryption đang tắt
        </div>
      </div>

      <div
        style={{
          border: "2px solid #10B981",
          backgroundColor: "rgba(16, 185, 129, 0.18)",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 24, color: "#6EE7B7", textTransform: "uppercase" }}>Encrypted Mesh VPN</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: "#FFFFFF" }}>Tailscale / WireGuard</div>
        <div style={{ fontSize: 26, color: "#34D399", marginTop: 4 }}>
          ✓ Mã hóa an toàn truy cập máy chủ từ xa
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const HomelabRestoredOverlay: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#020E08",
        color: "#FFFFFF",
        fontFamily: sans,
        padding: `${SAFE.top + 215}px ${SAFE.right}px ${SAFE.bottom + 90}px ${SAFE.left}px`,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Scanlines opacity={0.15} />

      <div
        style={{
          border: "2px solid #10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          padding: 16,
          borderRadius: 8,
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 24, color: "#A7F3D0" }}>SYSTEM RESCUE STATUS</div>
        <div style={{ fontSize: 38, fontWeight: 800, color: "#FFFFFF" }}>100% BIOS RECOVERED</div>
        <div style={{ fontSize: 26, color: "#6EE7B7", marginTop: 4 }}>
          Chi phí: chỉ bằng 1/4 so với PiKVM
        </div>
      </div>

      <div
        style={{
          border: "2px solid #38BDF8",
          backgroundColor: "rgba(56, 189, 248, 0.18)",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 24, color: "#BAE6FD" }}>KẾT NỐI SẴN SÀNG</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#FFFFFF" }}>https://espkvm.local</div>
        <div style={{ fontSize: 26, color: "#7DD3FC", marginTop: 2 }}>
          Chuột 60ms · Web 70KB · Boot ISO từ xa
        </div>
      </div>
    </AbsoluteFill>
  );
};
