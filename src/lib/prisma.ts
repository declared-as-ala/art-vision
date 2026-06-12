import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const root = process.cwd();
const rootDbPath = path.join(root, "dev.db");
const nextDbPath = path.join(root, ".next", "server", "dev.db");
const rawSqliteUrl = process.env.DATABASE_URL;
let sqliteUrl = rawSqliteUrl?.startsWith("file:")
  ? fileURLToPath(new URL(rawSqliteUrl, pathToFileURL(root + path.sep)))
  : rawSqliteUrl || rootDbPath;

const dbFilePath = sqliteUrl;

if (!fs.existsSync(dbFilePath) && fs.existsSync(nextDbPath)) {
  sqliteUrl = nextDbPath;
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
