import { readFile } from "node:fs/promises";
import path from "node:path";

const modelDirectory = path.resolve(process.cwd(), "models");

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;
  const safeFilename = path.basename(filename);

  if (safeFilename !== filename || !safeFilename.toLowerCase().endsWith(".glb")) {
    return new Response("Invalid model filename.", { status: 400 });
  }

  try {
    const file = await readFile(path.join(modelDirectory, safeFilename));
    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": "model/gltf-binary",
      },
    });
  } catch {
    return new Response("Model not found.", { status: 404 });
  }
}
