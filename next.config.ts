import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep generated compiler output away from Windows' slower Desktop write path,
  // but use the default .next folder on Vercel so deployment can find it.
  distDir: process.env.VERCEL ? ".next" : "node_modules/.cache/art-vision-next",
  turbopack: {
    root: process.cwd(),
  },
  // Don't bundle the DB driver / Prisma adapters into serverless functions.
  serverExternalPackages: ["@libsql/client", "@prisma/adapter-libsql", "@prisma/client"],
  // Ship the certificate template PDFs with the certificate serverless functions
  // (fs fallback for generation when the HTTP fetch of /public isn't available).
  outputFileTracingIncludes: {
    "/api/admin/certificates/**": ["./public/certification/**"],
  },
};

export default nextConfig;
