import "dotenv/config";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Creates (or resets) the OWNER account of THIS project's database only.
const email = process.env.ADMIN_EMAIL ?? "admin@art-visions.tn";
const password = process.env.ADMIN_PASSWORD ?? randomBytes(9).toString("base64url");

async function main() {
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.upsert({
    where: { email },
    update: { passwordHash, role: "OWNER" },
    create: { email, name: "Admin", passwordHash, role: "OWNER" },
  });
  console.log(`Admin ready\n  email:    ${email}\n  password: ${password}`);
  await db.$disconnect();
}
main();
