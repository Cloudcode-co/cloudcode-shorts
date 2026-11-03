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

// GEMINI_MODEL if the API knows it, else the newest Flash model it lists.
export const pickGeminiModel = async () => {
  const key = need("GEMINI_API_KEY");
  const wanted = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const res = await fetch(`${GEMINI}/models?pageSize=1000&key=${key}`);
  if (!res.ok) throw new Error(`Gemini models: ${res.status} ${await res.text()}`);
  const models = (await res.json()).models
    .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
    .map((m) => m.name.replace(/^models\//, ""));
  if (models.includes(wanted)) return wanted;
  const version = (id) => Number(id.match(/^gemini-(\d+(?:\.\d+)?)/)?.[1] ?? 0);
  const flash = models
    .filter((id) => /^gemini-[\d.]+-flash$/.test(id))
    .sort((a, b) => version(b) - version(a));
  if (!flash.length) throw new Error(`no Gemini Flash model found; set GEMINI_MODEL`);
  console.log(`${wanted} not available, using ${flash[0]}`);
  return flash[0];
};

// One generateContent call. Returns the text of the first candidate.
export const gemini = async (model, body) => {
  const key = need("GEMINI_API_KEY");
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${GEMINI}/models/${model}:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? "")
        .join("");
      if (!text) throw new Error(`Gemini returned no text: ${JSON.stringify(data).slice(0, 500)}`);
      return text;
    }
    // Rate limits and overloads are worth a couple of retries.
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await new Promise((r) => setTimeout(r, attempt * 15000));
      continue;
    }
    throw new Error(`Gemini ${model}: ${res.status} ${await res.text()}`);
  }
};

// This GitHub Actions run's page, or null outside Actions.
export const runUrl = process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null;
