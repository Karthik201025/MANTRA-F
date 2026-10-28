import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const envText = await fs.readFile(path.join(root, ".env.local"), "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = "mantra-character-assets";
if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase service configuration is missing.");

const headers = {
  Authorization: `Bearer ${serviceRoleKey}`,
  apikey: serviceRoleKey,
};

const uploads = [];
const processedDir = path.join(root, "public", "images", "characters", "processed");
for (const name of await fs.readdir(processedDir)) {
  if (name.toLowerCase().endsWith(".png")) {
    uploads.push({ file: path.join(processedDir, name), object: `characters/processed/${name}`, contentType: "image/png" });
  }
}

const modelsDir = path.join(root, "models");
for (const name of await fs.readdir(modelsDir)) {
  if (name.toLowerCase().endsWith(".glb")) {
    uploads.push({ file: path.join(modelsDir, name), object: `characters/models/${name}`, contentType: "model/gltf-binary" });
  }
}

for (const upload of uploads) {
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${encodeURIComponent(upload.object).replaceAll("%2F", "/")}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": upload.contentType, "x-upsert": "true", "Cache-Control": "public, max-age=31536000, immutable" },
    body: await fs.readFile(upload.file),
  });
  if (!response.ok) throw new Error(`Upload failed for ${upload.object}: HTTP ${response.status} ${await response.text()}`);
  console.log(`uploaded ${upload.object}`);
}

const listResponse = await fetch(`${supabaseUrl}/storage/v1/object/list/${bucket}`, {
  method: "POST",
  headers: { ...headers, "Content-Type": "application/json" },
  body: JSON.stringify({ prefix: "characters", limit: 1000, sortBy: { column: "name", order: "asc" } }),
});
if (!listResponse.ok) throw new Error(`Object listing failed: HTTP ${listResponse.status} ${await listResponse.text()}`);
const listed = await listResponse.json();
console.log(JSON.stringify({ uploaded: uploads.length, listed: listed.length, sample: listed.slice(0, 3).map(({ name }) => name) }, null, 2));
