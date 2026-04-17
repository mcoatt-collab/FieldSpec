const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function main() {
  console.log("Synchronizing image counts...");
  const result = await prisma.$executeRaw`
    UPDATE "Project" p
    SET "photoCount" = (SELECT COUNT(*)::int FROM "Image" i WHERE i."projectId" = p.id);
  `;
  console.log("Database synced successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
