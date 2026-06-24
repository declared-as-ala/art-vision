/**
 * Seeds SEO landing pages from the predefined templates in src/lib/seo-seeder.ts.
 * Idempotent: upserts by slug. Run with:
 *   npx tsx prisma/seed-seo.ts
 * For Turso/production, set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN env vars.
 */
import { seedSEOLandingPages } from "../src/lib/seo-seeder";

seedSEOLandingPages()
  .catch((e) => { console.error(e); process.exit(1); });
