// The Cloudcode Shorts website (shorts.cloudcode.io.vn): sign in with TikTok,
// see the channel's finished videos, and send one to your TikTok drafts.
//
//   GET  /                 what the app does, and the TikTok login button
//   GET  /login            redirects to TikTok's login (Login Kit)
//   GET  /tiktok/callback  TikTok's redirect; starts a session
//   GET  /app              the signed-in account and the finished videos
//   POST /app/send         { key } uploads that video to the account's inbox
//   POST /app/post         { key } posts it as Only me with its caption (from the
//                          video's script.json in GITHUB_REPO), with Direct Post
//   GET  /app/status?id=   where that upload stands
//   POST /logout           revokes the app's access and ends the session
//   GET  /terms, /privacy  the app's own terms and privacy policy
//
// Sessions are a random id in an HttpOnly cookie, kept 30 days in the TIKTOK
// KV namespace. ALLOWED_TIKTOK_OPEN_IDS (comma-separated), when set, limits
// who may sign in.
import { canPost, checkState, connect, directPost, disconnect, loginUrl, sendToInbox, uploadStatus, userInfo } from "./tiktok.js";

const COOKIE = "ccs_session";
const SESSION_TTL = 30 * 86400;
const VIDEOS = "tiktok-shorts/";
const TERMS = "/terms";
const PRIVACY = "/privacy";
const UPDATED = "4 November 2026";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const html = (body, status = 200, headers = {}) =>
  new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", ...headers } });

const layout = (title, main) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="icon" href="https://cloudcode.io.vn/icon.png">
<style>
  :root { --bg: #0b0b0c; --panel: #161618; --line: #2a2a2e; --text: #f4f4f5; --muted: #a1a1aa; --accent: #f07a7a; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif; }
  a { color: inherit; }
  header, main, footer { max-width: 960px; margin: 0 auto; padding: 0 20px; }
  header { display: flex; align-items: center; justify-content: space-between; height: 72px; }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 700; text-decoration: none; }
  .brand img { width: 36px; height: 36px; }
  h1 { font-size: clamp(32px, 6vw, 52px); line-height: 1.1; margin: 56px 0 16px; letter-spacing: -0.02em; text-wrap: balance; }
  .lead { color: var(--muted); font-size: 18px; max-width: 620px; }
  .btn { display: inline-flex; align-items: center; gap: 10px; border: 0; border-radius: 999px; padding: 12px 22px;
         font: inherit; font-weight: 600; cursor: pointer; text-decoration: none; background: var(--text); color: #000; }
  .btn.ghost { background: transparent; color: var(--text); border: 1px solid var(--line); }
  .btn:disabled { opacity: .5; cursor: default; }
  .btn:active:not(:disabled) { transform: scale(0.97); }
  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 48px 0; padding: 0; list-style: none; counter-reset: s; }
  .steps li { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 20px; counter-increment: s; }
  .steps li::before { content: counter(s); display: block; color: var(--accent); font-weight: 700; margin-bottom: 6px; }
  .me { display: flex; align-items: center; gap: 12px; }
  .me img { width: 40px; height: 40px; border-radius: 50%; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin: 32px 0 56px; }
  .card { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
  .card video { width: 100%; aspect-ratio: 9 / 16; background: #000; display: block; }
  .card .body { padding: 14px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .card .name { font-weight: 600; word-break: break-word; }
  .card .date, .status { color: var(--muted); font-size: 14px; }
  .status.ok { color: #7ee2a8; } .status.err { color: var(--accent); }
  .notice { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; color: var(--muted); }
  footer { color: var(--muted); font-size: 14px; padding: 32px 20px 48px; border-top: 1px solid var(--line); display: flex; gap: 20px; flex-wrap: wrap; }
</style>
</head>
<body>
<header>
  <a class="brand" href="/"><img src="https://cloudcode.io.vn/icon.png" alt="">Cloudcode Shorts</a>
</header>
<main>${main}</main>
<footer>
  <span>© <a href="https://cloudcode.io.vn">Cloudcode</a></span>
  <a href="${TERMS}">Terms of Service</a>
  <a href="${PRIVACY}">Privacy Policy</a>
</footer>
</body>
</html>`;

const cookieOf = (request) =>
  (request.headers.get("Cookie") ?? "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) ?? null;

const sessionOpenId = async (request, env) => {
  const id = cookieOf(request);
  return id ? env.TIKTOK.get(`session:${id}`) : null;
};

const allowed = (env, openId) => {
  const list = (env.ALLOWED_TIKTOK_OPEN_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return !list.length || list.includes(openId);
};

// Requests that change something must come from this site's own pages.
const sameOrigin = (request) => request.headers.get("Origin") === new URL(request.url).origin;

const landing = (signedIn) =>
  layout(
    "Cloudcode Shorts",
    `<h1>Short tech videos, straight to your TikTok drafts.</h1>
<p class="lead">Cloudcode Shorts makes short videos about self-hosting and developer tools for Cloudcode's TikTok channel.
Sign in with TikTok, pick a finished video, and it lands in your TikTok inbox as a draft. You add the caption and post it from the TikTok app.</p>
<p><a class="btn" href="${signedIn ? "/app" : "/login"}">${signedIn ? "Open your videos" : "Continue with TikTok"}</a></p>
<ol class="steps">
  <li>Continue with TikTok and allow access to your basic profile and to uploading videos as drafts.</li>
  <li>Choose a finished video and press <b>Send to TikTok drafts</b>.</li>
  <li>Open TikTok, tap the inbox notification, edit, and post it yourself.</li>
</ol>
<p class="notice">Videos go to your drafts. If you also allow posting, they are posted as <b>Only me</b> with their caption, and you choose in TikTok when to make them public. You can disconnect at any time.</p>`,
  );

const legal = (title, sections) =>
  layout(
    `${title} · Cloudcode Shorts`,
    `<h1>${title}</h1><p class="date">Last updated ${UPDATED}</p>` +
      sections.map(([h, text]) => `<h2 style="margin-top:32px">${h}</h2><p class="lead">${text}</p>`).join(""),
  );

const terms = () =>
  legal("Terms of Service", [
    ["What Cloudcode Shorts is", "Cloudcode Shorts is a tool run by Cloudcode (cloudcode.io.vn) that lets you send finished short videos made for Cloudcode's TikTok channel to your own TikTok drafts."],
    ["Your TikTok account", "You sign in with TikTok and choose what the app may access. The app only reads your basic profile and uploads the videos you choose to your TikTok inbox as drafts. If you also allow posting (video.publish), a video is posted as Only me with its caption, and you decide in TikTok whether to make it public. The app never edits or deletes anything on your account."],
    ["Using the app", "Use it only for videos you are allowed to post, and follow TikTok's Terms of Service and Community Guidelines when you post them. We may limit or end access to the app at any time."],
    ["Disconnecting", "Press Disconnect TikTok on your videos page at any time. This revokes the app's access and deletes your tokens. You can also remove the app from TikTok's settings."],
    ["No warranty", "The app is provided as is, without warranties. Cloudcode is not liable for indirect losses arising from its use, to the extent the law allows."],
    ["Contact", 'Questions about these terms: reach Cloudcode support through <a href="https://cloudcode.io.vn">cloudcode.io.vn</a>.'],
  ]);

const privacy = () =>
  legal("Privacy Policy", [
    ["What we collect", "When you sign in with TikTok we receive your TikTok open ID, display name and avatar (the user.info.basic scope), and the access and refresh tokens TikTok issues to the app. We also set one cookie that keeps you signed in."],
    ["How we use it", "Your display name and avatar are shown on your videos page so you can see which account is connected. The tokens are used only to upload Cloudcode's finished videos to your TikTok inbox as drafts (the video.upload scope), or, if you allowed it, to post them as Only me with their caption (the video.publish scope), and to check each upload's status. We do not use your data for advertising, and we do not sell or share it."],
    ["Where it is kept", "Tokens and sessions are stored in Cloudflare Workers KV. Your session ends after 30 days; your tokens stay until you disconnect, or until TikTok expires them."],
    ["Deleting your data", "Press Disconnect TikTok on your videos page: the app revokes its access with TikTok and deletes your tokens and session. You can also remove the app from TikTok's settings."],
    ["Contact", 'Privacy questions: reach Cloudcode support through <a href="https://cloudcode.io.vn">cloudcode.io.vn</a>.'],
  ]);

const prettyName = (key) =>
  key
    .slice(VIDEOS.length)
    .split("/")
    .pop()
    .replace(/\.mp4$/, "")
    .replace(/-/g, " ");

const dashboard = (env, user, videos, posting) =>
  layout(
    "Your videos · Cloudcode Shorts",
    `<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-top:32px">
  <div class="me">${user.avatar_url ? `<img src="${esc(user.avatar_url)}" alt="">` : ""}
    <div><div style="font-weight:600">${esc(user.display_name)}</div><div class="date">Signed in with TikTok</div></div></div>
  <form method="post" action="/logout"><button class="btn ghost">Disconnect TikTok</button></form>
</div>
<h1 style="margin-top:40px">Finished videos</h1>
<p class="lead">Send a video to your TikTok drafts. It appears in your TikTok inbox in a minute or two.</p>
<div class="grid">
${
  videos.length
    ? videos
        .map(
          (v) => `<div class="card">
  <video src="${esc(`${env.MEDIA_URL}/${v.key}`)}" controls preload="metadata" playsinline></video>
  <div class="body">
    <div class="name">${esc(prettyName(v.key))}</div>
    <div class="date">${esc(v.uploaded.toISOString().slice(0, 10))} · ${(v.size / 1048576).toFixed(1)} MB</div>
    <button class="btn" data-key="${esc(v.key)}" data-action="send">Send to TikTok drafts</button>
    ${posting ? `<button class="btn ghost" data-key="${esc(v.key)}" data-action="post">Post as Only me</button>` : ""}
    <div class="status" aria-live="polite"></div>
  </div>
</div>`,
        )
        .join("\n")
    : `<p class="notice">No finished videos yet.</p>`
}
</div>
<script>
const label = { PROCESSING_UPLOAD: "Uploading to TikTok…", PROCESSING_DOWNLOAD: "TikTok is processing…",
  SEND_TO_USER_INBOX: "In your TikTok inbox. Open TikTok to finish posting.",
  PUBLISH_COMPLETE: "Posted as Only me, with its caption. Make it public from TikTok.", FAILED: "TikTok could not take it" };
for (const button of document.querySelectorAll("button[data-key]")) {
  button.addEventListener("click", async () => {
    const status = button.parentElement.querySelector(".status");
    button.disabled = true;
    status.className = "status";
    status.textContent = "Sending…";
    const res = await fetch("/app/" + button.dataset.action, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: button.dataset.key }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { status.className = "status err"; status.textContent = data.error || "Could not send"; button.disabled = false; return; }
    for (let i = 0; i < 40; i++) {
      const s = await fetch("/app/status?id=" + encodeURIComponent(data.publish_id)).then((r) => r.json()).catch(() => ({}));
      status.textContent = label[s.status] || s.status || "Waiting for TikTok…";
      if (s.status === "SEND_TO_USER_INBOX" || s.status === "PUBLISH_COMPLETE") { status.className = "status ok"; return; }
      if (s.status === "FAILED") { status.className = "status err"; status.textContent += ": " + (s.fail_reason || "unknown reason"); button.disabled = false; return; }
      await new Promise((r) => setTimeout(r, 3000));
    }
  });
}
</script>`,
  );

// A video's TikTok caption and hashtags, from its script.json in the repo.
const captionFor = async (env, key) => {
  const slug = key.slice(VIDEOS.length).split("/")[0];
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/src/videos/${slug}/script.json`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.raw+json",
      "User-Agent": "cloudcode-shorts-bot",
    },
  });
  if (!res.ok) throw new Error(`no script for ${slug} (${res.status})`);
  const script = await res.json();
  return `${script.caption}\n\n${(script.hashtags ?? []).join(" ")}`.trim();
};

const finishedVideos = async (env) => {
  const found = [];
  let cursor;
  do {
    const page = await env.MEDIA.list({ prefix: VIDEOS, cursor, limit: 1000 });
    found.push(...page.objects.filter((o) => o.key.endsWith(".mp4")));
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return found.sort((a, b) => b.uploaded - a.uploaded).slice(0, 30);
};

// Handles the site's routes; null when the path is not one of them.
export const site = async (request, env) => {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method;

  if (pathname === "/" && method === "GET") return html(landing(Boolean(await sessionOpenId(request, env))));

  if (pathname === "/terms" && method === "GET") return html(terms());
  if (pathname === "/privacy" && method === "GET") return html(privacy());

  if (pathname === "/login" && method === "GET") return Response.redirect(await loginUrl(request, env), 302);

  if (pathname === "/tiktok/callback" && method === "GET") {
    if (!(await checkState(env, url.searchParams.get("state")))) {
      return html(layout("Sign-in expired", `<h1>That sign-in link expired.</h1><p><a class="btn" href="/login">Try again</a></p>`), 400);
    }
    const code = url.searchParams.get("code");
    if (!code) {
      return html(layout("Not connected", `<h1>TikTok was not connected.</h1><p class="lead">${esc(url.searchParams.get("error_description") ?? "You cancelled the sign-in.")}</p><p><a class="btn" href="/login">Try again</a></p>`), 400);
    }
    let openId;
    try {
      openId = await connect(request, env, code);
    } catch (err) {
      return html(layout("Not connected", `<h1>TikTok sign-in failed.</h1><p class="lead">${esc(err.message)}</p>`), 502);
    }
    if (!allowed(env, openId)) {
      await disconnect(env, openId);
      return html(layout("Not allowed", `<h1>This TikTok account can't use Cloudcode Shorts.</h1>`), 403);
    }
    // The Discord drafts button sends to the account that signed in last.
    await env.TIKTOK.put("owner", openId);
    const session = crypto.randomUUID();
    await env.TIKTOK.put(`session:${session}`, openId, { expirationTtl: SESSION_TTL });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/app",
        "Set-Cookie": `${COOKIE}=${session}; Path=/; Max-Age=${SESSION_TTL}; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  }

  if (!["/app", "/app/send", "/app/post", "/app/status", "/logout"].includes(pathname)) return null;
  const openId = await sessionOpenId(request, env);
  if (!openId) {
    return method === "GET" && pathname === "/app"
      ? Response.redirect(`${url.origin}/`, 302)
      : Response.json({ error: "Sign in with TikTok first" }, { status: 401 });
  }

  if (pathname === "/app" && method === "GET") {
    try {
      const [user, videos, posting] = await Promise.all([userInfo(env, openId), finishedVideos(env), canPost(env, openId)]);
      return html(dashboard(env, user, videos, posting));
    } catch (err) {
      return html(layout("Sign in again", `<h1>Please sign in again.</h1><p class="lead">${esc(err.message)}</p><p><a class="btn" href="/login">Continue with TikTok</a></p>`), 401);
    }
  }

  if (method !== "GET" && !sameOrigin(request)) return Response.json({ error: "Bad origin" }, { status: 403 });

  if ((pathname === "/app/send" || pathname === "/app/post") && method === "POST") {
    const { key } = (await request.json().catch(() => ({}))) ?? {};
    if (typeof key !== "string" || !key.startsWith(VIDEOS) || !key.endsWith(".mp4") || key.includes("..")) {
      return Response.json({ error: "Unknown video" }, { status: 400 });
    }
    try {
      if (pathname === "/app/post") {
        if (!(await canPost(env, openId))) return Response.json({ error: "Posting was not allowed at sign-in" }, { status: 403 });
        return Response.json({ publish_id: await directPost(env, openId, key, await captionFor(env, key)) });
      }
      return Response.json({ publish_id: await sendToInbox(env, openId, key) });
    } catch (err) {
      return Response.json({ error: err.message }, { status: 502 });
    }
  }

  if (pathname === "/app/status" && method === "GET") {
    try {
      return Response.json(await uploadStatus(env, openId, url.searchParams.get("id") ?? ""));
    } catch (err) {
      return Response.json({ error: err.message }, { status: 502 });
    }
  }

  if (pathname === "/logout" && method === "POST") {
    await disconnect(env, openId);
    if ((await env.TIKTOK.get("owner")) === openId) await env.TIKTOK.delete("owner");
    await env.TIKTOK.delete(`session:${cookieOf(request)}`);
    return new Response(null, {
      status: 303,
      headers: { Location: "/", "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` },
    });
  }
  return null;
};
