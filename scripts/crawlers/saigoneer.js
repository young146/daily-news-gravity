const axios = require('axios');
const cheerio = require('cheerio');

async function crawlSaigoneer() {
    console.log('Starting crawl of Saigoneer (Lifestyle/Food/Culture)...');
    try {
        const { data } = await axios.get('https://saigoneer.com/', {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const listItems = [];
        const seen = new Set();

        $('a[href*="saigoneer.com"]').each((index, element) => {
            if (listItems.length >= 10) return;

            const href = $(element).attr('href');
            const title = $(element).text().trim();

            if (!title || title.length < 20 || title.length > 200) return;
            if (!href) return;
            if (href.includes('/tag/') || href.includes('/author/') || href.includes('/category/')) return;

            const isArticle = href.match(/\/\d+-/) || href.includes('/saigon-') || href.includes('/vietnam-');
            if (!isArticle) return;

            if (seen.has(href)) return;
            seen.add(href);

            let category = 'Culture';
            if (href.includes('food') || href.includes('drink') || href.includes('restaurant')) category = 'Culture';
            if (href.includes('travel') || href.includes('explore')) category = 'Culture';
            if (href.includes('event')) category = 'Culture';

            listItems.push({
                title,
                summary: '',
                originalUrl: href,
                imageUrl: '',
                category,
                source: 'Saigoneer',
                publishedAt: new Date(),
                status: 'DRAFT'
            });
        });

        console.log(`Saigoneer list items found: ${listItems.length}`);

        const detailedItems = [];
        for (const item of listItems) {
            try {
                console.log(`Fetching details for: ${item.title.substring(0, 50)}...`);
                const { data: detailData } = await axios.get(item.originalUrl, {
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                const $detail = cheerio.load(detailData);

                let content = $detail('.item-page, .itemFullText, .article-content').html();

                const metaImage = $detail('meta[property="og:image"]').attr('content');
                if (metaImage) {
                    item.imageUrl = metaImage;
                }

                if (content) {
                    item.content = content.trim();
                    const textContent = $detail('.item-page').text().trim();
                    item.summary = textContent.substring(0, 300);
                }

                detailedItems.push(item);
                await new Promise(r => setTimeout(r, 500));
            } catch (err) {
                console.error(`Error fetching details for ${item.originalUrl}:`, err.message);
                detailedItems.push(item);
            }
        }

        console.log(`Saigoneer: ${detailedItems.length} items with details`);
        return detailedItems;
    } catch (error) {
        console.error('Error crawling Saigoneer:', error.message);
        return [];
    }
}

module.exports = crawlSaigoneer;
