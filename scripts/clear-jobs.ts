import { prisma } from "../lib/prisma";
import { aiQueue } from "../lib/queue";

async function cleanup() {
  const result = await prisma.aIJob.deleteMany({
    where: { status: { in: ["pending", "processing", "failed"] as unknown as string[] } },
  });
  console.log("Deleted", result.count, "stuck jobs from database");

  const jobs = await aiQueue.getJobs(["active", "pending", "delayed"] as any);
  for (const job of jobs) {
    await job.remove();
  }
  console.log("Removed", jobs.length, "jobs from BullMQ queue");

  await prisma.$disconnect();
  process.exit(0);
}

cleanup().catch((e) => {
  console.error(e);
  process.exit(1);
});