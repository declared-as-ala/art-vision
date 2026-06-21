import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Single source of truth for the DB connection used by seed/util scripts.
// Local: DATABASE_URL=file:./dev.db. Production: TURSO_DATABASE_URL + TURSO_AUTH_TOKEN.
export function dbUrl(): string {
  let url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./dev.db";
  if (!/^(file:|libsql:|https?:|wss?:)/.test(url)) url = `file:${url}`;
  return url;
}

export function makePrisma(): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaLibSql({ url: dbUrl(), authToken: process.env.TURSO_AUTH_TOKEN }),
  });
}
