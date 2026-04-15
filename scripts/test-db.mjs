import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import jwt from "jsonwebtoken";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:6Q8QZH7m@localhost:5432/fieldspec?schema=public";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "test@example.com" } });
  if (!user) { console.log("No user found"); return; }
  
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  console.log("Generated token:", token.substring(0, 30) + "...");
  
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log("Decoded:", decoded);
}

main();