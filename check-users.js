const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany({ take: 5, select: { email: true, name: true } })
  .then(r => { console.log(r); p.$disconnect(); });