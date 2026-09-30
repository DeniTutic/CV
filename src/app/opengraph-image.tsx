import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetch just the glyphs we need (incl. "ć") from Google Fonts at build time.
async function loadFont(family: string, weight: number, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!src) return null;
    return await (await fetch(src[1])).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const title = profile.name;
  const role = profile.role;
  const mono = "~/deni  react · node.js · next.js · llm integrations  sarajevo → u.s.";

  const [inter, jet] = await Promise.all([
    loadFont("Inter", 600, title + role),
    loadFont("JetBrains+Mono", 400, mono + "$"),
  ]);

  const fonts = [
    inter && { name: "Inter", data: inter, weight: 600 as const, style: "normal" as const },
    jet && { name: "JetBrains Mono", data: jet, weight: 400 as const, style: "normal" as const },
  ].filter((f): f is NonNullable<typeof f> => Boolean(f));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07090d",
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(34,211,238,0.22), transparent 45%), radial-gradient(circle at 90% 90%, rgba(167,139,250,0.2), transparent 45%)",
          color: "#e6edf3",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 28, color: "#8593a1" }}>
          <span style={{ color: "#22d3ee" }}>~</span>/deni
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, letterSpacing: -3, lineHeight: 1 }}>{title}</div>
          <div
            style={{
              marginTop: 24,
              fontSize: 48,
              backgroundImage: "linear-gradient(90deg, #22d3ee, #a78bfa)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {role}
          </div>
        </div>
        <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 26, color: "#c3ccd5" }}>
          <span style={{ color: "#4ade80", marginRight: 14 }}>$</span>
          react · node.js · next.js · llm integrations
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
