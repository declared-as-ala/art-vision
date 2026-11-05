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
    "/api/admin/certificates/**": [
      "./public/certification/**",
      "./src/lib/certificates/fonts/**",
    ],
  },
  async redirects() {
    return [
      // 301 Permanent Redirects for legacy /en/ and /ar/ paths reported by Google Search Console
      {
        source: "/en/impression-cartes-de-visite",
        destination: "/impression/cartes-de-visite",
        permanent: true,
      },
      {
        source: "/en/impression-affiches",
        destination: "/impression/affiches",
        permanent: true,
      },
      {
        source: "/ar/impression-affiches",
        destination: "/impression/affiches",
        permanent: true,
      },
      {
        source: "/en/community-management",
        destination: "/community-management",
        permanent: true,
      },
      {
        source: "/ar/design-graphique",
        destination: "/identite-visuelle",
        permanent: true,
      },
      {
        source: "/en/agence-graphique-france",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ar/agence-graphique-lyon",
        destination: "/",
        permanent: true,
      },
      // Generic fallback for any other legacy /en/* or /ar/* URLs
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/ar/:path*",
        destination: "/:path*",
        permanent: true,
      },
      // 301 Redirects for obsolete legacy URLs reported in GSC "Exclue par la balise noindex"
      {
        source: "/creation-design-graphique",
        destination: "/design-graphique",
        permanent: true,
      },
      {
        source: "/impression-pro",
        destination: "/impression",
        permanent: true,
      },
      {
        source: "/impression/affiche",
        destination: "/impression/affiches",
        permanent: true,
      },
      {
        source: "/impression-lille",
        destination: "/impression",
        permanent: true,
      },
      {
        source: "/impression-nantes",
        destination: "/impression",
        permanent: true,
      },
      {
        source: "/conception-3d-design-produit",
        destination: "/rendu-3d-produit",
        permanent: true,
      },
      {
        source: "/community-management-reseaux",
        destination: "/community-management",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
