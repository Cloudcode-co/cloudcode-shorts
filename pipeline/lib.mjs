// Shared helpers for the pipeline scripts.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";


export const need = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
};

export const readJson = (file, fallback) =>
  existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : fallback;

export const writeJson = (file, data) =>
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");

// Hands a script's result to run.mjs (through the file in RESULT_FILE, so
// the script's own output can stream straight into the log) and prints it.
export const report = (value) => {
  console.log(typeof value === "string" ? value : JSON.stringify(value));
  if (process.env.RESULT_FILE) writeFileSync(process.env.RESULT_FILE, JSON.stringify(value));
};

// Runs a command with inherited output; throws when it fails.
export const run = (cmd, args, opts = {}) => {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
  if (r.status !== 0) throw new Error(`${cmd} ${args[0] ?? ""} exited with ${r.status}`);
};

// "Coolify và Dokploy" -> "coolify-va-dokploy"
export const slugify = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");

const GEMINI = "https://generativelanguage.googleapis.com/v1beta";
// Longest a single Gemini call may take before it counts as failed.
const GEMINI_TIMEOUT = 180_000;

// Models to try, best first: GEMINI_MODEL (default gemini-3.8-flash) if the
// API lists it, then the other Flash models, newest first. A key on the free
// tier may have no quota for the newest ones.
export const pickGeminiModels = async () => {
  const key = need("GEMINI_API_KEY");
  const wanted = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const res = await fetch(`${GEMINI}/models?pageSize=1000&key=${key}`, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Gemini models: ${res.status} ${await res.text()}`);
  const models = (await res.json()).models
    .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""));
  const version = (id) => Number(id.match(/^gemini-(\d+(?:\.\d+)?)/)?.[1] ?? 0);
  const flash = models
    .filter((id) => /^gemini-[\d.]+-flash$/.test(id) && id !== wanted)
    .sort((a, b) => version(b) - version(a));
  const list = models.includes(wanted) ? [wanted, ...flash] : flash;
  if (!list.length) throw new Error("no Gemini Flash model found; set GEMINI_MODEL");
  return list;
};

// The model that last answered, per kind of call: on the free tier only
// Gemini 2.x may use Google Search, while plain calls can use the newest.
const lastGood = {};

// One generateContent call, trying `models` in order (after the one that last
// answered the same kind of call). Overloads and short rate limits get
// retried; a model out of quota hands over to the next one.
// Returns the text of the first candidate.
export const gemini = async (models, body) => {
  const key = need("GEMINI_API_KEY");
  const kind = body.tools?.some((t) => t.google_search) ? "search" : "plain";
  const order = lastGood[kind] ? [lastGood[kind], ...models.filter((m) => m !== lastGood[kind])] : models;
  const errors = [];
  for (const model of order) {
    for (let attempt = 1; ; attempt++) {
      const started = Date.now();
      const res = await fetch(`${GEMINI}/models/${model}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(GEMINI_TIMEOUT),
      }).catch((err) => new Response(String(err), { status: 504 }));
      const took = `${Math.round((Date.now() - started) / 1000)}s`;
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("");
        if (!text) throw new Error(`Gemini returned no text: ${JSON.stringify(data).slice(0, 500)}`);
        console.log(`Gemini (${kind}): ${model}, ${took}`);
        lastGood[kind] = model;
        return text;
      }
      const detail = await res.text();
      if ((res.status >= 500 && attempt < 3) || (res.status === 429 && attempt < 2)) {
        const wait = attempt * 10;
        console.log(`Gemini ${model}: ${res.status} after ${took}, retrying in ${wait}s`);
        await new Promise((r) => setTimeout(r, wait * 1000));
        continue;
      }
      errors.push(`${model}: ${res.status} ${detail.slice(0, 300)}`);
      if (res.status === 429 || res.status === 404 || res.status >= 500) {
        console.log(`Gemini ${model} failed (${res.status}), trying the next model`);
        break;
      }
      throw new Error(`Gemini ${errors.at(-1)}`);
    }
  }
  throw new Error(`every Gemini model failed:\n${errors.join("\n")}`);
};

// This GitHub Actions run's page, or null outside Actions.
export const runUrl = process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null;
