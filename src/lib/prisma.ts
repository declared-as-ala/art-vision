import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const root = process.cwd();
const rootDbPath = path.join(root, "dev.db");
const nextDbPath = path.join(root, ".next", "server", "dev.db");
const defaultDbUrl = pathToFileURL(rootDbPath).href;
const rawSqliteUrl = process.env.DATABASE_URL ?? defaultDbUrl;
let sqliteUrl = rawSqliteUrl.startsWith("file:")
  ? new URL(rawSqliteUrl, pathToFileURL(root + path.sep)).href
  : rawSqliteUrl;

const dbFilePath = sqliteUrl.startsWith("file:")
  ? fileURLToPath(sqliteUrl)
  : sqliteUrl;

if (!fs.existsSync(dbFilePath) && fs.existsSync(nextDbPath)) {
  sqliteUrl = pathToFileURL(nextDbPath).href;
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
