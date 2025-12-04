const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const counts = await prisma.newsItem.groupBy({
        by: ['source'],
        _count: {
            id: true
        }
    });
    const fs = require('fs');
    let output = '--- Database Counts by Source ---\n';
    counts.forEach(c => {
        output += `Source: ${c.source.padEnd(20)} | Count: ${c._count.id}\n`;
    });
    output += '---------------------------------\n';
    fs.writeFileSync('db_counts.txt', output);
    console.log('Saved to db_counts.txt');
}

check()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
