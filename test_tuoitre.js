const crawlTuoitre = require('./scripts/crawlers/tuoitre');

async function test() {
    console.log('Testing Tuoi Tre...');
    const items = await crawlTuoitre();
    console.log('Items found:', items.length);
    if (items.length > 0) {
        console.log('First item:', items[0]);
    }
}

test();
