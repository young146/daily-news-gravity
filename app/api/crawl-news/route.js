import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function crawlVnExpress() {
    const cheerio = await import('cheerio');
    const axios = (await import('axios')).default;
    
    const items = [];
    try {
        const { data } = await axios.get('https://e.vnexpress.net/news/business', { timeout: 15000 });
        const $ = cheerio.load(data);
        
        $('article.item-news').slice(0, 5).each((i, el) => {
            const title = $(el).find('h3.title-news a, h2.title-news a').text().trim();
            const link = $(el).find('h3.title-news a, h2.title-news a').attr('href');
            const summary = $(el).find('p.description a').text().trim();
            const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            
            if (title && link) {
                items.push({
                    title,
                    summary: summary || title,
                    originalUrl: link,
                    imageUrl: img || null,
                    source: 'VnExpress',
                    category: 'Economy'
                });
            }
        });
    } catch (e) {
        console.error('VnExpress crawl error:', e.message);
    }
    return items;
}

async function crawlVnExpressVN() {
    const cheerio = await import('cheerio');
    const axios = (await import('axios')).default;
    
    const items = [];
    try {
        const { data } = await axios.get('https://vnexpress.net/kinh-doanh', { timeout: 15000 });
        const $ = cheerio.load(data);
        
        $('article.item-news').slice(0, 5).each((i, el) => {
            const title = $(el).find('h3.title-news a, h2.title-news a').text().trim();
            const link = $(el).find('h3.title-news a, h2.title-news a').attr('href');
            const summary = $(el).find('p.description a').text().trim();
            const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            
            if (title && link) {
                items.push({
                    title,
                    summary: summary || title,
                    originalUrl: link,
                    imageUrl: img || null,
                    source: 'VnExpress VN',
                    category: 'Economy'
                });
            }
        });
    } catch (e) {
        console.error('VnExpress VN crawl error:', e.message);
    }
    return items;
}

async function crawlYonhap() {
    const cheerio = await import('cheerio');
    const axios = (await import('axios')).default;
    const https = await import('https');
    
    const items = [];
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const { data } = await axios.get('https://www.yna.co.kr/international/index', { 
            timeout: 15000,
            httpsAgent: agent 
        });
        const $ = cheerio.load(data);
        
        $('.list-type038 li').slice(0, 5).each((i, el) => {
            const title = $(el).find('.tit-wrap .tit').text().trim();
            const link = $(el).find('a').attr('href');
            const summary = $(el).find('.lead').text().trim();
            const img = $(el).find('img').attr('src');
            
            if (title && link) {
                items.push({
                    title,
                    summary: summary || title,
                    originalUrl: link.startsWith('http') ? link : `https://www.yna.co.kr${link}`,
                    imageUrl: img || null,
                    source: 'Yonhap News',
                    category: 'Korea-Vietnam'
                });
            }
        });
    } catch (e) {
        console.error('Yonhap crawl error:', e.message);
    }
    return items;
}

async function crawlInsideVina() {
    const cheerio = await import('cheerio');
    const axios = (await import('axios')).default;
    
    const items = [];
    try {
        const { data } = await axios.get('https://www.insidevina.com/news/articleList.html?sc_section_code=S1N2', { timeout: 15000 });
        const $ = cheerio.load(data);
        
        $('#section-list .article-list li, .type2 li').slice(0, 5).each((i, el) => {
            const title = $(el).find('.titles, .article-title').text().trim();
            const linkEl = $(el).find('a').attr('href');
            const summary = $(el).find('.sub-title, .article-summary').text().trim();
            const img = $(el).find('img').attr('src');
            
            if (title && linkEl) {
                items.push({
                    title,
                    summary: summary || title,
                    originalUrl: linkEl.startsWith('http') ? linkEl : `https://www.insidevina.com${linkEl}`,
                    imageUrl: img ? (img.startsWith('http') ? img : `https://www.insidevina.com${img}`) : null,
                    source: 'InsideVina',
                    category: 'Society'
                });
            }
        });
    } catch (e) {
        console.error('InsideVina crawl error:', e.message);
    }
    return items;
}

async function crawlTuoitre() {
    const cheerio = await import('cheerio');
    const axios = (await import('axios')).default;
    
    const items = [];
    try {
        const { data } = await axios.get('https://tuoitre.vn/kinh-doanh.htm', { timeout: 15000 });
        const $ = cheerio.load(data);
        
        $('.box-category-item, .news-item').slice(0, 5).each((i, el) => {
            const title = $(el).find('h3 a, .title-name a').text().trim();
            const link = $(el).find('h3 a, .title-name a').attr('href');
            const summary = $(el).find('.sapo, .description').text().trim();
            const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            
            if (title && link) {
                items.push({
                    title,
                    summary: summary || title,
                    originalUrl: link.startsWith('http') ? link : `https://tuoitre.vn${link}`,
                    imageUrl: img || null,
                    source: 'TuoiTre',
                    category: 'Economy'
                });
            }
        });
    } catch (e) {
        console.error('TuoiTre crawl error:', e.message);
    }
    return items;
}

async function crawlThanhNien() {
    const cheerio = await import('cheerio');
    const axios = (await import('axios')).default;
    
    const items = [];
    try {
        const { data } = await axios.get('https://thanhnien.vn/kinh-te.htm', { timeout: 15000 });
        const $ = cheerio.load(data);
        
        $('.story, .box-news').slice(0, 5).each((i, el) => {
            const title = $(el).find('h3 a, .story-title a').text().trim();
            const link = $(el).find('h3 a, .story-title a').attr('href');
            const summary = $(el).find('.summary, .story-summary').text().trim();
            const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            
            if (title && link) {
                items.push({
                    title,
                    summary: summary || title,
                    originalUrl: link.startsWith('http') ? link : `https://thanhnien.vn${link}`,
                    imageUrl: img || null,
                    source: 'ThanhNien',
                    category: 'Economy'
                });
            }
        });
    } catch (e) {
        console.error('ThanhNien crawl error:', e.message);
    }
    return items;
}

async function crawlVnaNet() {
    const cheerio = await import('cheerio');
    const axios = (await import('axios')).default;
    const https = await import('https');
    
    const items = [];
    try {
        const agent = new https.Agent({ 
            rejectUnauthorized: false,
            secureOptions: require('constants').SSL_OP_LEGACY_SERVER_CONNECT
        });
        const { data } = await axios.get('https://en.vnanet.vn/vi/anh/cat_1', { 
            timeout: 15000,
            httpsAgent: agent
        });
        const $ = cheerio.load(data);
        
        $('.box-news-item, .news-item').slice(0, 5).each((i, el) => {
            const title = $(el).find('h3 a, .title a').text().trim();
            const link = $(el).find('h3 a, .title a').attr('href');
            const summary = $(el).find('.sapo, .description').text().trim();
            const img = $(el).find('img').attr('src');
            
            if (title && link) {
                items.push({
                    title,
                    summary: summary || title,
                    originalUrl: link.startsWith('http') ? link : `https://en.vnanet.vn${link}`,
                    imageUrl: img || null,
                    source: 'VNA',
                    category: 'Policy'
                });
            }
        });
    } catch (e) {
        console.error('VNA crawl error:', e.message);
    }
    return items;
}

export async function POST(request) {
    try {
        console.log('🚀 Starting News Crawl (7 Sources)...');
        
        const [vnItems, vnvnItems, yhItems, ivItems, ttItems, tnItems, vnaItems] = await Promise.all([
            crawlVnExpress(),
            crawlVnExpressVN(),
            crawlYonhap(),
            crawlInsideVina(),
            crawlTuoitre(),
            crawlThanhNien(),
            crawlVnaNet()
        ]);
        
        const allItems = [...vnItems, ...vnvnItems, ...yhItems, ...ivItems, ...ttItems, ...tnItems, ...vnaItems];
        console.log(`Total items found: ${allItems.length}`);
        
        let savedCount = 0;
        const sources = {
            'VnExpress': vnItems.length,
            'VnExpress VN': vnvnItems.length,
            'Yonhap News': yhItems.length,
            'InsideVina': ivItems.length,
            'TuoiTre': ttItems.length,
            'ThanhNien': tnItems.length,
            'VNA': vnaItems.length
        };
        
        for (const item of allItems) {
            const exists = await prisma.newsItem.findFirst({
                where: { originalUrl: item.originalUrl }
            });
            
            if (!exists) {
                await prisma.newsItem.create({ data: item });
                savedCount++;
                console.log(`✅ Saved[${item.source}]: ${item.title.substring(0, 50)}...`);
            }
        }
        
        await prisma.crawlerLog.create({
            data: {
                status: 'SUCCESS',
                itemsFound: savedCount,
                message: `API Crawl completed. Total: ${allItems.length}, New: ${savedCount}`
            }
        });
        
        console.log(`🎉 Crawl finished. New items: ${savedCount}`);
        
        return Response.json({
            success: true,
            message: `뉴스 수집 완료!`,
            total: allItems.length,
            newItems: savedCount,
            sources
        });
        
    } catch (error) {
        console.error('Crawl failed:', error);
        return Response.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
