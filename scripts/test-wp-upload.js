const WP_URL = 'https://chaovietnam.co.kr';
const WP_USER = 'chaovietnam';
const WP_PASSWORD = 'O4nR g8aV JBZc juF8 CO9y j46L'; // App Password

async function uploadImageToWordPress(imageUrl) {
    if (!imageUrl) return null;
    console.log(`[Test] Uploading image to WP: ${imageUrl}`);

    try {
        const auth = Buffer.from(`${WP_USER}:${WP_PASSWORD}`).toString('base64');

        // 1. Fetch the image data
        console.log('[Test] Fetching image...');
        const imageRes = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageRes.status} ${imageRes.statusText}`);

        const imageBuffer = await imageRes.arrayBuffer();
        const contentType = imageRes.headers.get('content-type') || 'image/jpeg';
        const fileName = `test-google-${Date.now()}.png`;

        console.log(`[Test] Image fetched. Size: ${imageBuffer.byteLength} bytes. Type: ${contentType}`);

        // 2. Upload to WP
        console.log('[Test] Posting to WordPress Media endpoint...');
        const response = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${fileName}"`
            },
            body: Buffer.from(imageBuffer)
        });

        if (!response.ok) {
            const err = await response.json();
            console.error('[Test] WP Upload Failed:', JSON.stringify(err, null, 2));
            return null;
        }

        const mediaData = await response.json();
        console.log(`[Test] Success! Media ID: ${mediaData.id}`);
        console.log(`[Test] Media Link: ${mediaData.source_url}`);
        return mediaData.id;

    } catch (error) {
        console.error('[Test] Error:', error);
        return null;
    }
}

// Test with Google Logo (Reliable)
const testImageUrl = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';

async function run() {
    await uploadImageToWordPress(testImageUrl);
}

run();
