import { loadFont } from "@remotion/google-fonts/Oswald";
import type { CSSProperties } from "react";

const { fontFamily } = loadFont("normal", { weights: ["700"], subsets: ["vietnamese", "latin"] });

// The big outlined meme caption (yellow on a black outline). The outline is
// painted under the fill at a width tied to the font size, with room between
// letters and lines, so a thick outline never merges letters or Vietnamese
// diacritics. Place it with `style` (it is centred and fills its width).
export const MemeCaption: React.FC<{
  text: string;
  size?: number;
  color?: string;
  outline?: string;
  style?: CSSProperties;
}> = ({ text, size = 84, color = "#FFE600", outline = "#000", style }) => (
  <div
    style={{
      position: "absolute",
      fontFamily,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.3,
      letterSpacing: "0.03em",
      textAlign: "center",
      color,
      WebkitTextStroke: `${Math.round(size * 0.16)}px ${outline}`,
      paintOrder: "stroke fill",
      textShadow: `0 ${Math.round(size * 0.06)}px 0 ${outline}`,
      textWrap: "balance",
      ...style,
    }}
  >
    {text}
  </div>
);
