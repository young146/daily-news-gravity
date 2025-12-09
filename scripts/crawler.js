const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const crawlVnExpress = require('./crawlers/vnexpress');
const crawlYonhap = require('./crawlers/yonhap');
const crawlInsideVina = require('./crawlers/insidevina');
const crawlTuoitre = require('./crawlers/tuoitre');
const crawlThanhNien = require('./crawlers/thanhnien');
const crawlVnaNet = require('./crawlers/vnanet');
const crawlVnExpressVN = require('./crawlers/vnexpress-vn');
const { sendCrawlerAlert } = require('../lib/telegram');

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function translateTitle(title, source) {
  if (!process.env.OPENAI_API_KEY) {
    console.log('[번역] API 키 없음, 원문 유지');
    return null;
  }

  if (source === 'Yonhap News') {
    return title;
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{
        role: "user",
        content: `Translate this news headline to Korean. Keep it concise and professional (news style). Only return the translated text, nothing else.

Headline: "${title}"`
      }],
      model: "gpt-4o-mini",
      max_tokens: 200,
    });
    
    const translated = completion.choices[0].message.content.trim();
    return translated.replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error(`[번역 실패] ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 크롤러 시작 (7개 소스 + 제목 번역)...');
  console.log('================================================');

  const crawlers = [
    { name: 'VnExpress', fn: crawlVnExpress },
    { name: 'Yonhap', fn: crawlYonhap },
    { name: 'InsideVina', fn: crawlInsideVina },
    { name: 'TuoiTre', fn: crawlTuoitre },
    { name: 'ThanhNien', fn: crawlThanhNien },
    { name: 'VNA', fn: crawlVnaNet },
    { name: 'VnExpressVN', fn: crawlVnExpressVN }
  ];

  const results = await Promise.allSettled(crawlers.map(c => c.fn()));
  
  const allItems = [];
  const successSources = [];
  const failedSources = [];
  const errorDetails = {};

  results.forEach((result, index) => {
    const crawler = crawlers[index];
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
      successSources.push(`${crawler.name}(${result.value.length})`);
      console.log(`✅ ${crawler.name}: ${result.value.length}개 수집`);
    } else {
      const errorMsg = result.reason?.message || String(result.reason);
      const errorStack = result.reason?.stack || '';
      failedSources.push(crawler.name);
      errorDetails[crawler.name] = {
        message: errorMsg,
        stack: errorStack.split('\n').slice(0, 5).join('\n'),
        time: new Date().toISOString()
      };
      console.error(`❌ ${crawler.name} 실패:`, errorMsg);
    }
  });

  console.log('================================================');
  console.log(`📰 총 수집: ${allItems.length}개 (${failedSources.length}개 소스 실패)`);
  console.log('================================================');

  let savedCount = 0;
  let translatedCount = 0;

  for (const item of allItems) {
    const exists = await prisma.newsItem.findFirst({
      where: { originalUrl: item.originalUrl }
    });

    if (exists) {
      continue;
    }

    if (item.source === 'Yonhap News') {
      item.category = 'Korea-Vietnam';
    }

    console.log(`\n📝 [${item.source}] ${item.title.substring(0, 50)}...`);

    const translatedTitle = await translateTitle(item.title, item.source);
    
    if (translatedTitle) {
      console.log(`   → 번역: ${translatedTitle.substring(0, 50)}...`);
      translatedCount++;
    }

    await prisma.newsItem.create({
      data: {
        ...item,
        translatedTitle: translatedTitle || null,
      }
    });
    
    savedCount++;
    console.log(`   ✅ 저장 완료`);
  }

  const status = failedSources.length === 0 ? 'SUCCESS' : 
                 failedSources.length === crawlers.length ? 'FAILED' : 'PARTIAL';
  
  await prisma.crawlerLog.create({
    data: {
      status,
      itemsFound: savedCount,
      message: `완료. 성공: ${successSources.join(', ') || '없음'}. 실패: ${failedSources.join(', ') || '없음'}. 번역: ${translatedCount}개`,
      errorDetails: Object.keys(errorDetails).length > 0 ? JSON.stringify(errorDetails, null, 2) : null
    }
  });

  console.log('================================================');
  console.log(`🎉 크롤링 완료!`);
  console.log(`   - 새 뉴스 저장: ${savedCount}개`);
  console.log(`   - 제목 번역: ${translatedCount}개`);
  if (failedSources.length > 0) {
    console.log(`   - 실패 소스: ${failedSources.join(', ')}`);
  }
  console.log('================================================');

  try {
    await sendCrawlerAlert(status, savedCount, successSources, failedSources, errorDetails);
  } catch (e) {
    console.log('[텔레그램] 알림 스킵:', e.message);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
