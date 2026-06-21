/**
 * Production-safe DB bootstrap, run during the Vercel build.
 *
 *  1. Ensures the schema exists:
 *     - Turso (TURSO_DATABASE_URL set): generate CREATE TABLE/INDEX SQL from the
 *       Prisma schema and apply it to Turso via the libSQL client (Prisma's CLI
 *       can't push to Turso directly). `IF NOT EXISTS` makes it safe to re-run.
 *     - Local / file DB: `prisma db push`.
 *  2. Seeds content ONLY when the database is empty (first deploy), so later
 *     deploys never overwrite admin edits.
 *
 *  NOTE: the Turso path creates missing tables but does not ALTER existing ones.
 *  After changing the schema in production, run `npm run db:push:turso` once.
 */
import "dotenv/config";
import { execSync } from "child_process";
import { makePrisma } from "../prisma/seed-client";

const TURSO = process.env.TURSO_DATABASE_URL;

function tursoSchemaSql(): string {
  const raw = execSync(
    "npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script",
    { encoding: "utf8" }
  );
  return raw
    .replace(/CREATE TABLE\s+/gi, "CREATE TABLE IF NOT EXISTS ")
    .replace(/CREATE UNIQUE INDEX\s+/gi, "CREATE UNIQUE INDEX IF NOT EXISTS ")
    .replace(/CREATE INDEX\s+/gi, "CREATE INDEX IF NOT EXISTS ");
}

async function ensureSchema() {
  if (TURSO) {
    console.log("[db-deploy] Provisioning Turso schema…");
    const { createClient } = await import("@libsql/client");
    const client = createClient({ url: TURSO, authToken: process.env.TURSO_AUTH_TOKEN });
    await client.executeMultiple(tursoSchemaSql());
    console.log("[db-deploy] Turso schema ready.");
  } else {
    console.log("[db-deploy] Local schema via prisma db push…");
    execSync("npx prisma db push --schema prisma/schema.prisma", { stdio: "inherit" });
  }
}

async function seedIfEmpty() {
  const prisma = makePrisma();
  let count = 0;
  try { count = await prisma.service.count(); } catch { count = 0; }
  await prisma.$disconnect();
  if (count > 0) {
    console.log(`[db-deploy] DB already populated (${count} services) — skipping seed.`);
    return;
  }
  console.log("[db-deploy] Empty database — seeding initial content…");
  execSync("npm run seed && npm run seed:blog && npm run seed:services", { stdio: "inherit" });
}

(async () => {
  await ensureSchema();
  await seedIfEmpty();
  console.log("[db-deploy] Done.");
})().catch((e) => {
  console.error("[db-deploy] FAILED:", e);
  process.exit(1);
});
