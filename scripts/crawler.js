const { PrismaClient } = require('@prisma/client');
const crawlVnExpress = require('./crawlers/vnexpress');
const crawlYonhap = require('./crawlers/yonhap');
const crawlInsideVina = require('./crawlers/insidevina');
const crawlTuoitre = require('./crawlers/tuoitre');
const crawlThanhNien = require('./crawlers/thanhnien');
const crawlVnaNet = require('./crawlers/vnanet');
const crawlVnExpressVN = require('./crawlers/vnexpress_vn');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Multi-Source Crawler (7 Sites)...');

  // Run all crawlers in parallel
  const [vnItems, yhItems, ivItems, ttItems, tnItems, vnaItems, vnvnItems] = await Promise.all([
    crawlVnExpress(),
    crawlYonhap(),
    crawlInsideVina(),
    crawlTuoitre(),
    crawlThanhNien(),
    crawlVnaNet(),
    crawlVnExpressVN()
  ]);

  const allItems = [
    ...vnItems,
    ...yhItems,
    ...ivItems,
    ...ttItems,
    ...tnItems,
    ...vnaItems,
    ...vnvnItems
  ];
  console.log(`Total items found: ${allItems.length} `);

  let savedCount = 0;

  for (const item of allItems) {
    // Check for duplicates
    const exists = await prisma.newsItem.findFirst({
      where: { originalUrl: item.originalUrl }
    });

    if (!exists) {
      // Auto-categorize Korean news
      if (item.source === 'Yonhap News') {
        item.category = 'Korea-Vietnam';
      }

      await prisma.newsItem.create({
        data: item
      });
      savedCount++;
      console.log(`✅ Saved[${item.source}]: ${item.title} `);
    } else {
      console.log(`Duplicate[${item.source}]: ${item.title} `);
    }
  }

  // Log run
  await prisma.crawlerLog.create({
    data: {
      status: 'SUCCESS',
      itemsFound: savedCount,
      message: `Run completed. Sources: VnExpress(${vnItems.length}), Yonhap(${yhItems.length}), InsideVina(${ivItems.length}), TuoiTre(${ttItems.length}), ThanhNien(${tnItems.length}), VNA(${vnaItems.length}), VnExpressVN(${vnvnItems.length})`
    }
  });

  console.log(`🎉 Crawl finished. New items saved: ${savedCount} `);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
