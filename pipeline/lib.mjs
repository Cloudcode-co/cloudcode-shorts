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

// The script writer is any OpenAI-compatible chat API (by default a Gemini
// gateway): LLM_BASE_URL, LLM_API_KEY, and LLM_MODEL, a comma-separated list
// tried in order.
const LLM_BASE_URL = (process.env.LLM_BASE_URL || "https://be-ag.harumi.io.vn/v1").replace(/\/+$/, "");
// Longest a single call may take before it counts as failed.
const LLM_TIMEOUT = 180_000;

export const llmModels = () =>
  (process.env.LLM_MODEL || "ag/gemini-3.8-flash-high")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

// Gemini-style schema ({type: "OBJECT", ...}) to JSON Schema for
// response_format, with every property required and nothing extra allowed.
const toJsonSchema = (s) => {
  const out = { type: s.type.toLowerCase() };
  if (s.description) out.description = s.description;
  if (s.items) out.items = toJsonSchema(s.items);
  if (s.properties) {
    out.properties = Object.fromEntries(Object.entries(s.properties).map(([k, v]) => [k, toJsonSchema(v)]));
    out.required = Object.keys(s.properties);
    out.additionalProperties = false;
  }
  return out;
};

// The JSON in a reply, without the ```json fence some models wrap it in.
const parseJson = (text) => {
  const t = text.trim();
  const fenced = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const body = fenced ? fenced[1] : t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1);
  return JSON.parse(body);
};

// Asks for a JSON answer matching `schema`, trying each model in order.
// Overloads and rate limits get one retry; a model that times out, is
// unknown or keeps failing hands over to the next.
export const llmJson = async (prompt, schema, temperature = 0.7) => {
  const key = need("LLM_API_KEY");
  const jsonSchema = toJsonSchema(schema);
  const errors = [];
  for (const model of llmModels()) {
    for (let attempt = 1; ; attempt++) {
      const started = Date.now();
      const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          stream: false,
          temperature,
          messages: [
            {
              role: "user",
              content: `${prompt}\n\nAnswer with only a JSON object matching this JSON Schema:\n${JSON.stringify(jsonSchema)}`,
            },
          ],
          response_format: { type: "json_schema", json_schema: { name: "answer", schema: jsonSchema } },
        }),
        signal: AbortSignal.timeout(LLM_TIMEOUT),
      }).catch((err) => new Response(String(err), { status: 599 }));
      const took = `${Math.round((Date.now() - started) / 1000)}s`;
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        try {
          const value = parseJson(text ?? "");
          console.log(`LLM: ${model}, ${took}, ${data.usage?.total_tokens ?? "?"} tokens`);
          return value;
        } catch {
          errors.push(`${model}: unparseable answer ${String(text).slice(0, 300)}`);
          if (attempt < 2) {
            console.log(`LLM ${model}: answer was not JSON, asking again`);
            continue;
          }
          break;
        }
      }
      const detail = await res.text();
      errors.push(`${model}: ${res.status} ${detail.slice(0, 300)}`);
      if (res.status === 599) {
        console.log(`LLM ${model}: no answer in ${took}, trying the next model`);
        break;
      }
      if ((res.status >= 500 || res.status === 429) && attempt < 2) {
        console.log(`LLM ${model}: ${res.status} after ${took}, retrying in 15s`);
        await new Promise((r) => setTimeout(r, 15_000));
        continue;
      }
      if (res.status === 429 || res.status === 404 || res.status >= 500) {
        console.log(`LLM ${model} failed (${res.status}), trying the next model`);
        break;
      }
      throw new Error(`LLM ${errors.at(-1)}`);
    }
  }
  throw new Error(`every LLM model failed:\n${errors.join("\n")}`);
};

// This GitHub Actions run's page, or null outside Actions.
export const runUrl = process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : null;
