import { prisma } from "../lib/prisma";

prisma.report.findFirst({ orderBy: { createdAt: "desc" } }).then((r) => {
  console.log(JSON.stringify(r, null, 2));
  prisma.$disconnect();
});