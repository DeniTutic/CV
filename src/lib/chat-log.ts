import { get, list, put } from "@vercel/blob";

// Saves each assistant exchange so Deni can read them at /admin. In production
// they go to the private Vercel Blob store (BLOB_READ_WRITE_TOKEN is set by Vercel
// when the store is connected); in local dev without a token they stay in memory.

export type ChatEntry = {
  time: string;
  session: string;
  question: string;
  answer: string;
  answered: boolean;
  model: string;
  country?: string;
  city?: string;
  device: string;
  from?: string;
};

const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const devLog: ChatEntry[] = [];

export const storageConnected = useBlob || process.env.NODE_ENV !== "production";

export async function saveChat(entry: ChatEntry) {
  if (!useBlob) {
    if (process.env.NODE_ENV !== "production") devLog.unshift(entry);
    return;
  }
  // Reversed timestamp, so the store lists the newest chats first.
  const order = String(10 ** 13 - Date.parse(entry.time)).padStart(13, "0");
  await put(`chats/${order}-${entry.session.slice(0, 8)}.json`, JSON.stringify(entry), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: true,
  });
}

export async function readChats(limit = 300): Promise<ChatEntry[]> {
  if (!useBlob) return devLog.slice(0, limit);
  const { blobs } = await list({ prefix: "chats/", limit });
  const entries = await Promise.all(
    blobs.map(async ({ pathname }) => {
      const result = await get(pathname, { access: "private" });
      if (result?.statusCode !== 200 || !result.stream) return null;
      return JSON.parse(await new Response(result.stream).text()) as ChatEntry;
    }),
  );
  return entries.filter((e): e is ChatEntry => e !== null).sort((a, b) => b.time.localeCompare(a.time));
}

const OS: [RegExp, string][] = [
  [/iPhone|iPad/, "iOS"],
  [/Android/, "Android"],
  [/Mac OS X/, "Mac"],
  [/Windows/, "Windows"],
  [/Linux/, "Linux"],
];
const BROWSERS: [RegExp, string][] = [
  [/Edg\//, "Edge"],
  [/OPR\//, "Opera"],
  [/Firefox\//, "Firefox"],
  [/Chrome\//, "Chrome"],
  [/Safari\//, "Safari"],
];

export function describeDevice(userAgent: string) {
  const match = (table: [RegExp, string][], fallback: string) =>
    table.find(([pattern]) => pattern.test(userAgent))?.[1] ?? fallback;
  const kind = /Mobi|Android|iPhone/.test(userAgent) ? "Phone" : "Computer";
  return `${kind} · ${match(OS, "unknown OS")} · ${match(BROWSERS, "other browser")}`;
}
