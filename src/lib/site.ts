// Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time (e.g. "deni-tutic.vercel.app").
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
