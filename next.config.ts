import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep generated compiler output away from Windows' slower Desktop write path,
  // but use the default .next folder on Vercel so deployment can find it.
  distDir: process.env.VERCEL ? ".next" : "node_modules/.cache/art-vision-next",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
