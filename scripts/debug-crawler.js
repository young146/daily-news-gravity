const axios = require('axios');
const fs = require('fs');

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

async function debugVnExpress() {
    console.error('--- Debugging VnExpress ---');
    try {
        const url = 'https://e.vnexpress.net/';
        const { data } = await axios.get(url, { headers });
        fs.writeFileSync('vnexpress.html', data);
        console.error('Saved vnexpress.html');
    } catch (e) {
        console.error('VnExpress error:', e.message);
    }
}

async function debugYonhap() {
    console.error('--- Debugging Yonhap ---');
    try {
        const url = 'https://www.yna.co.kr/international/asia-australia';
        const { data } = await axios.get(url, { headers });
        fs.writeFileSync('yonhap.html', data);
        console.error('Saved yonhap.html');
    } catch (e) {
        console.error('Yonhap error:', e.message);
    }
}

(async () => {
    await debugVnExpress();
    await debugYonhap();
})();
