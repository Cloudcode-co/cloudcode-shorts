// Research from primary sources, free: GitHub (repos, READMEs, releases) and
// Hacker News (what developers are talking about). The video's facts and
// install commands come from the projects' own READMEs.
const GH = "https://api.github.com";
const headers = {
  "User-Agent": "cloudcode-shorts",
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const gh = async (path, accept) => {
  const res = await fetch(`${GH}${path}`, { headers: accept ? { ...headers, Accept: accept } : headers });
  if (!res.ok) return null;
  return accept?.endsWith("raw") ? res.text() : res.json();
};

const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const REPO = /^[\w.-]+\/[\w.-]+$/;

// Repos trending with developers right now: new and fast-growing on GitHub in
// the channel's areas, plus GitHub links on Hacker News' front page.
export const trendingCandidates = async (skip = []) => {
  const found = new Map();
  const add = (r, why) => {
    if (!r || skip.includes(r.full_name.toLowerCase()) || r.archived || r.fork) return;
    const prev = found.get(r.full_name);
    found.set(r.full_name, {
      repo: r.full_name,
      description: r.description,
      stars: r.stargazers_count,
      created: r.created_at?.slice(0, 10),
      why: prev ? `${prev.why}; ${why}` : why,
    });
  };

  for (const topic of ["self-hosted", "ai-agents", "llm", "devops", "homelab", "mcp"]) {
    const q = encodeURIComponent(`topic:${topic} created:>${daysAgo(120)} stars:>300`);
    const data = await gh(`/search/repositories?q=${q}&sort=stars&order=desc&per_page=8`);
    for (const r of data?.items ?? []) add(r, `new and rising on GitHub (#${topic})`);
  }

  const since = Math.floor(Date.now() / 1000) - 14 * 86400;
  const hn = await fetch(
    `https://hn.algolia.com/api/v1/search?query=github.com&restrictSearchableAttributes=url&tags=story` +
      `&numericFilters=created_at_i>${since},points>60&hitsPerPage=40`,
  )
    .then((r) => (r.ok ? r.json() : { hits: [] }))
    .catch(() => ({ hits: [] }));
  for (const hit of hn.hits) {
    const m = hit.url?.match(/github\.com\/([\w.-]+\/[\w.-]+)/);
    if (!m) continue;
    const r = await gh(`/repos/${m[1].replace(/\.git$/, "")}`);
    add(r, `on Hacker News: "${hit.title}" (${hit.points} points)`);
  }
  return [...found.values()].sort((a, b) => b.stars - a.stars).slice(0, 40);
};

// Checks repo names a model guessed, and runs its search queries; returns
// real owner/name pairs, most-starred match first for each query.
export const resolveRepos = async ({ repos = [], queries = [] }, limit = 6) => {
  const out = [];
  const push = (full) => {
    if (full && !out.some((x) => x.toLowerCase() === full.toLowerCase())) out.push(full);
  };
  for (const guess of repos) {
    if (!REPO.test(guess)) continue;
    const r = await gh(`/repos/${guess}`);
    if (r) push(r.full_name);
  }
  for (const q of queries) {
    const data = await gh(`/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=1`);
    push(data?.items?.[0]?.full_name);
  }
  return out.slice(0, limit);
};

// README text without images, badges and HTML, trimmed to `max` characters.
const cleanReadme = (md, max) =>
  md
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/^\s*\[!\[.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);

// Everything the script writer needs to know about one repo, as text.
export const repoBrief = async (full, readmeChars = 9000) => {
  const r = await gh(`/repos/${full}`);
  if (!r) return null;
  const [readme, release] = await Promise.all([
    gh(`/repos/${full}/readme`, "application/vnd.github.raw"),
    gh(`/repos/${full}/releases/latest`),
  ]);
  return [
    `## ${r.full_name} (https://github.com/${r.full_name})`,
    `Description: ${r.description ?? "-"}`,
    `Homepage: ${r.homepage || "-"}`,
    `Language: ${r.language ?? "-"}; license: ${r.license?.spdx_id ?? "none"}; ` +
      `created ${r.created_at.slice(0, 10)}; last push ${r.pushed_at.slice(0, 10)}`,
    release ? `Latest release: ${release.tag_name} (${release.published_at?.slice(0, 10)})` : "No releases",
    `README (start):\n${readme ? cleanReadme(readme, readmeChars) : "(none)"}`,
  ].join("\n");
};
