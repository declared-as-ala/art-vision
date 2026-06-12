import fs from "fs";
import path from "path";

const root = process.cwd();
const source = path.join(root, "dev.db");
const destDir = path.join(root, ".next", "server");
const dest = path.join(destDir, "dev.db");

if (!fs.existsSync(source)) {
  console.warn("No local dev.db found to copy to .next/server.");
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(source, dest);
console.log("Copied dev.db into .next/server/dev.db");
