import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep generated compiler output away from Windows' slower Desktop write path.
  distDir: "node_modules/.cache/art-vision-next",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
