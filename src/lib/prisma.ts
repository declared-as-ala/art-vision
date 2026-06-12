import path from "path";
import { pathToFileURL } from "url";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const sqliteUrl =
  process.env.DATABASE_URL ??
  pathToFileURL(path.join(process.cwd(), "dev.db")).href;

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
