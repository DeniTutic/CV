import { get, put } from "@vercel/blob";

// Remembers which free Gemini model answered last in the private Blob store, so a
// freshly started server asks a working model first instead of rediscovering it.

const PATH = "state/preferred-model.txt";
const enabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function loadPreferredModel() {
  if (!enabled) return undefined;
  try {
    const result = await get(PATH, { access: "private", useCache: false });
    if (result?.statusCode !== 200 || !result.stream) return undefined;
    return (await new Response(result.stream).text()).trim() || undefined;
  } catch (error) {
    console.error("[chat] reading the preferred model failed:", error);
    return undefined;
  }
}

export async function savePreferredModel(model: string) {
  if (!enabled) return;
  await put(PATH, model, { access: "private", contentType: "text/plain", addRandomSuffix: false, allowOverwrite: true });
}
