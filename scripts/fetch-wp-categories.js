const https = require('https');

const wpUrl = process.env.WORDPRESS_URL || 'https://chaovietnam.co.kr';
const wpUser = process.env.WORDPRESS_USERNAME || 'chaovietnam';
const wpPassword = process.env.WORDPRESS_APP_PASSWORD || 'O4nR g8aV JBZc juF8 CO9y j46L';

if (!wpUrl || !wpUser || !wpPassword) {
    console.error("Missing credentials");
    process.exit(1);
}

const auth = Buffer.from(`${wpUser}:${wpPassword}`).toString('base64');

const options = {
    hostname: wpUrl.replace('https://', '').replace('http://', ''),
    path: '/wp-json/wp/v2/categories?per_page=100',
    method: 'GET',
    headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            const categories = JSON.parse(data);
            console.log("Categories found:");
            categories.forEach(cat => {
                console.log(`ID: ${cat.id}, Name: ${cat.name}, Slug: ${cat.slug}, Parent: ${cat.parent}`);
            });
        } else {
            console.error(`Error: ${res.statusCode} ${res.statusMessage}`);
            console.error(data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
