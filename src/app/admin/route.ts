import { createHash, timingSafeEqual } from "node:crypto";
import { readChats, storageConnected, type ChatEntry } from "@/lib/chat-log";

// Deni's private log of what visitors asked the assistant. The browser asks for a
// password (any username); set ADMIN_PASSWORD in Vercel to enable the page.

const failures = new Map<string, number[]>();

function tooManyFailures(ip: string) {
  const recent = (failures.get(ip) ?? []).filter((t) => Date.now() - t < 15 * 60_000);
  failures.set(ip, recent);
  return recent.length >= 10;
}

const digest = (value: string) => createHash("sha256").update(value).digest();

function isAuthorized(request: Request, password: string) {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString();
  return timingSafeEqual(digest(decoded.slice(decoded.indexOf(":") + 1)), digest(password));
}

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const regions = new Intl.DisplayNames(["en"], { type: "region" });
const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { timeZone: "Europe/Sarajevo", dateStyle: "medium", timeStyle: "short" });

function visitor(entry: ChatEntry) {
  const place = [entry.city, entry.country && regions.of(entry.country)].filter(Boolean).join(", ") || "Unknown location";
  return [place, entry.device, entry.from && `came from ${entry.from}`].filter(Boolean).map((v) => escape(v!)).join(" · ");
}

function exchange(entry: ChatEntry) {
  return `<div class="qa${entry.answered ? "" : " miss"}">
    <p class="q"><span>${formatTime(entry.time).split(", ")[1] ?? ""}</span> ${escape(entry.question)}</p>
    <p class="a">${escape(entry.answer)}</p>
    ${entry.answered ? "" : `<p class="tag">${entry.model ? "Not answered: add it to src/data/knowledge.ts" : "The assistant was down, so this visitor was shown your email instead"}</p>`}
  </div>`;
}

function page(chats: ChatEntry[], onlyMissed: boolean) {
  const missed = chats.filter((c) => !c.answered);
  const sessions = new Map<string, ChatEntry[]>();
  for (const chat of chats) sessions.set(chat.session, [...(sessions.get(chat.session) ?? []), chat]);

  const body = onlyMissed
    ? missed.length
      ? missed
          .map((c) => `<section><p class="meta">${formatTime(c.time)} · ${visitor(c)}</p>${exchange(c)}</section>`)
          .join("")
      : `<p class="empty">Every question so far was answered.</p>`
    : chats.length
      ? [...sessions.values()]
          .map((entries) => {
            const ordered = [...entries].reverse();
            return `<section><p class="meta">${formatTime(ordered[0].time)} · ${visitor(ordered[0])} · ${ordered.length} question${ordered.length === 1 ? "" : "s"}</p>${ordered.map(exchange).join("")}</section>`;
          })
          .join("")
      : `<p class="empty">No chats yet.</p>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Chat log</title>
<style>
  :root { color-scheme: dark; --bg: #07090d; --surface: #0e141b; --line: #1b2530; --fg: #e6edf3; --soft: #c3ccd5; --muted: #8593a1; --accent: #22d3ee; --warn: #fbbf24; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.55 ui-sans-serif, system-ui, sans-serif; }
  main { max-width: 760px; margin: 0 auto; padding: 32px 16px 64px; }
  h1 { font: 600 22px ui-monospace, monospace; margin: 0 0 4px; }
  .sub { color: var(--muted); margin: 0 0 20px; }
  nav { display: flex; gap: 8px; margin-bottom: 20px; }
  nav a { padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px; color: var(--soft); text-decoration: none; font-size: 13px; }
  nav a.on { border-color: var(--accent); color: var(--fg); }
  section { border: 1px solid var(--line); background: var(--surface); border-radius: 14px; padding: 16px; margin-bottom: 14px; }
  .meta { margin: 0 0 12px; color: var(--muted); font-size: 13px; }
  .qa { border-left: 2px solid var(--line); padding-left: 12px; margin-top: 12px; }
  .qa.miss { border-left-color: var(--warn); }
  .q { margin: 0; font-weight: 600; }
  .q span { color: var(--muted); font: 12px ui-monospace, monospace; margin-right: 6px; }
  .a { margin: 4px 0 0; color: var(--soft); white-space: pre-wrap; }
  .tag { margin: 6px 0 0; color: var(--warn); font-size: 12px; }
  .empty, .note { color: var(--muted); }
  .note { border: 1px solid var(--warn); border-radius: 10px; padding: 10px 12px; }
</style>
</head>
<body>
<main>
  <h1>~/chat-log</h1>
  <p class="sub">${chats.length} question${chats.length === 1 ? "" : "s"} from ${sessions.size} visitor${sessions.size === 1 ? "" : "s"} · ${missed.length} not answered · times in Sarajevo time</p>
  ${storageConnected ? "" : `<p class="note">Chat storage isn't connected, so nothing is being saved. Connect the Blob store to this project in Vercel.</p>`}
  <nav>
    <a href="/admin"${onlyMissed ? "" : ` class="on"`}>All chats</a>
    <a href="/admin?show=unanswered"${onlyMissed ? ` class="on"` : ""}>Not answered (${missed.length})</a>
  </nav>
  ${body}
</main>
</body>
</html>`;
}

export async function GET(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new Response("Set ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then redeploy.", { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooManyFailures(ip)) return new Response("Too many wrong passwords. Try again in 15 minutes.", { status: 429 });
  if (!isAuthorized(request, password)) {
    if (request.headers.has("authorization")) failures.get(ip)?.push(Date.now());
    return new Response("Password required.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Chat log", charset="UTF-8"' },
    });
  }

  const chats = await readChats();
  const onlyMissed = new URL(request.url).searchParams.get("show") === "unanswered";
  return new Response(page(chats, onlyMissed), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
