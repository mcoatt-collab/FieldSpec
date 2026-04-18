import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function reconcilePhotoCounts() {
  console.log("Starting DB Reconciliation...");
  
  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { images: true }
      }
    }
  });

  console.log(`Found ${projects.length} projects to check.`);

  let fixCount = 0;

  for (const project of projects) {
    const actualCount = project._count.images;
    if (project.photoCount !== actualCount) {
      console.log(`Updating Project [${project.name}]: ${project.photoCount} -> ${actualCount}`);
      await prisma.project.update({
        where: { id: project.id },
        data: { photoCount: actualCount }
      });
      fixCount++;
    }
  }

  console.log(`Reconciliation Complete. Fixed ${fixCount} projects.`);
}

reconcilePhotoCounts()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
