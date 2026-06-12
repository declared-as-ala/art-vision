import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const rootDbPath = path.join(process.cwd(), "dev.db");
const nextDbPath = path.join(process.cwd(), ".next", "server", "dev.db");

const effectiveUrl = process.env.DATABASE_URL;
let sqliteUrl = effectiveUrl
  ? effectiveUrl
  : pathToFileURL(rootDbPath).href;

if (!effectiveUrl || effectiveUrl.startsWith("file:")) {
  const dbPath = effectiveUrl?.startsWith("file:")
    ? fileURLToPath(effectiveUrl)
    : rootDbPath;

  if (!fs.existsSync(dbPath) && fs.existsSync(nextDbPath)) {
    sqliteUrl = pathToFileURL(nextDbPath).href;
  }
}

const adapter = new PrismaBetterSqlite3({ url: sqliteUrl });

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma?: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
