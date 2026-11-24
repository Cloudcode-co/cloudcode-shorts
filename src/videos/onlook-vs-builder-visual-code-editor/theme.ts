// News-desk palette: deep navy and paper white, one red accent.
export const C = {
  ink: "#060F20",
  navy: "#0A1830",
  panel: "#102544",
  steel: "#1C3B66",
  paper: "#F6F8FC",
  red: "#E01B2E",
  muted: "#A9BCD6",
  blue: "#61DAFB",
};

export const SLUG = "onlook-vs-builder-visual-code-editor";

// 27,839 → "27.839" (Vietnamese thousands separator).
export const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
