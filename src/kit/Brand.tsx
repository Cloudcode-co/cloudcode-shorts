import { Img, staticFile } from "remotion";
import { SAFE, sans } from "./theme";

// Space the opening shot leaves above its content for the lockup.
export const BRAND_SPACE = 84;

// Cloudcode lockup as the portal's Wordmark sets it: white cloud, "cloud" in
// `color` and "code" in the accent. Meant for the opening shot on a dark
// background, at the top of the safe area (TikTok's tabs and search bar sit
// above it); start that shot's content BRAND_SPACE lower.
export const Brand: React.FC<{ color?: string }> = ({ color = "#FFFFFF" }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      top: SAFE.top,
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: sans,
      fontWeight: 700,
      fontSize: 30,
      color,
    }}
  >
    <Img src={staticFile("brand/cloudcode-logo.png")} style={{ height: 48 }} />
    <span>
      cloud<span style={{ color: "#EC8686" }}>code</span>
    </span>
  </div>
);
