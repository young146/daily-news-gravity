const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.newsItem.count();
  console.log(`Total NewsItems: ${count}`);
  const logs = await prisma.crawlerLog.findMany({
    orderBy: { runAt: 'desc' },
    take: 5
  });
  console.log('Recent Logs:', logs);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
