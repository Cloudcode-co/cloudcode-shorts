// Reads web pages as research, in the Chrome that Remotion already ships: the
// rendered text (so pages built by JavaScript work too), the page's links,
// and a few phone-sized screenshots the builder can show in the video.
import { openBrowser } from "@remotion/renderer";

const VIEWPORT = { width: 430, height: 932, deviceScaleFactor: 2.5 };
const SHOTS = 3; // screens per page, top down
const TEXT = 12000; // characters of text kept per page

export const isWebUrl = (value) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Opens a browser for a batch of pages; call close() when done.
export const webReader = async () => {
  const browser = await openBrowser("chrome", { logLevel: "error" });
  let index = 0;

  const read = async (url) => {
    const page = await browser.newPage({
      context: () => null,
      logLevel: "error",
      indent: false,
      pageIndex: index++,
      onBrowserLog: null,
      onLog: () => {},
    });
    try {
      await page.setViewport(VIEWPORT);
      await page.goto({ url, timeout: 45_000 });
      await sleep(2500); // client-side rendering and web fonts
      const info = await page.evaluate(() => {
        const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? null;
        const icons = [...document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']")]
          .map((l) => ({ href: l.href, size: parseInt(l.getAttribute("sizes") ?? "0", 10) || 0 }))
          .sort((a, b) => b.size - a.size);
        return {
          url: location.href,
          title: document.title,
          description: meta("meta[name='description']") ?? meta("meta[property='og:description']"),
          image: meta("meta[property='og:image']"),
          icon: icons[0]?.href ?? null,
          text: document.body.innerText,
          links: [...document.querySelectorAll("a[href]")].map((a) => ({
            href: a.href.split("#")[0],
            text: a.innerText.trim().replace(/\s+/g, " ").slice(0, 80),
          })),
          height: document.documentElement.scrollHeight,
        };
      });

      const client = page._client();
      const shots = [];
      for (let i = 0; i < SHOTS && i * VIEWPORT.height < info.height; i++) {
        await page.evaluate((y) => window.scrollTo(0, y), i * VIEWPORT.height);
        await sleep(600);
        // Remotion's CDP session wraps each result in { value }.
        const { value } = await client.send("Page.captureScreenshot", { format: "jpeg", quality: 85 });
        shots.push(Buffer.from(value.data, "base64"));
      }

      const origin = new URL(info.url).origin;
      const seen = new Set();
      const links = info.links.filter((l) => {
        if (!l.href.startsWith(origin) || l.href === info.url || seen.has(l.href)) return false;
        seen.add(l.href);
        return true;
      });
      return {
        ...info,
        text: info.text.replace(/\n{3,}/g, "\n\n").trim().slice(0, TEXT),
        links: links.slice(0, 40),
        shots,
      };
    } catch (err) {
      console.log(`skip ${url}: ${err.message}`);
      return null;
    } finally {
      await page.close().catch(() => {});
    }
  };

  return { read, close: () => browser.close({ silent: true }).catch(() => {}) };
};

// A page as research text for the script writer.
export const pageBrief = (p) =>
  [
    `## ${p.title || p.url}`,
    `URL: ${p.url}`,
    p.description && `Description: ${p.description}`,
    "",
    p.text,
  ]
    .filter((x) => x !== null && x !== undefined && x !== false)
    .join("\n");
