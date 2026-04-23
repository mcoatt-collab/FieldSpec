import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email address: npx tsx scripts/verify-user.ts user@example.com");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });
    console.log(`User ${user.email} is now verified.`);
  } catch (error) {
    console.error(`Error: Could not find or update user with email ${email}`);
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
