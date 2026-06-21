import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// libSQL works the same locally (file:./dev.db) and in production (Turso).
//  - Local dev / build: DATABASE_URL = "file:./dev.db" (no token)
//  - Production (Vercel): TURSO_DATABASE_URL = "libsql://<db>.turso.io" + TURSO_AUTH_TOKEN
const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql({ url, authToken });

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  const globalWithPrisma = global as typeof globalThis & { prisma?: PrismaClient };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
