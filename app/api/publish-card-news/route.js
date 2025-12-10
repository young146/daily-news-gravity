import prisma from '@/lib/prisma';
import { publishCardNewsToWordPress, uploadImageToWordPress } from '@/lib/publisher';
import { getSeoulWeather, getExchangeRates } from '@/lib/external-data';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        console.log('[CardNews API] Starting server-side image generation...');
        
        const topNews = await prisma.newsItem.findFirst({
            where: { isTopNews: true },
            orderBy: { publishedAt: 'desc' }
        });
        
        if (!topNews) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'No top news selected' 
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        const weather = await getSeoulWeather();
        const rates = await getExchangeRates();
        
        const title = topNews.translatedTitle || topNews.title || '오늘의 뉴스';
        const summary = topNews.translatedSummary || topNews.summary || '';
        let imageUrl = topNews.imageUrl || '';
        
        if (imageUrl) {
            console.log('[CardNews API] Original image URL:', imageUrl);
            
            const uploadedImage = await uploadImageToWordPress(imageUrl, `cardnews-bg-${Date.now()}`);
            
            if (uploadedImage && uploadedImage.url) {
                imageUrl = uploadedImage.url;
                console.log('[CardNews API] Using WordPress image URL:', imageUrl);
            } else {
                console.log('[CardNews API] Image upload failed, using original URL');
            }
        }
        
        const weatherTemp = weather?.temp ?? '25';
        const usdRate = rates?.usdVnd?.toLocaleString() ?? '25,400';
        const krwRate = rates?.krwVnd?.toLocaleString() ?? '17.8';
        
        console.log('[CardNews API] Generating image with data:', { title, imageUrl: imageUrl.substring(0, 50) + '...' });
        
        const params = new URLSearchParams({
            title,
            summary,
            image: imageUrl,
            weather: String(weatherTemp),
            usd: String(usdRate),
            krw: String(krwRate)
        });
        
        const baseUrl = process.env.REPLIT_DEV_DOMAIN 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
            : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000');
        console.log('[CardNews API] Using base URL:', baseUrl);
        const imageResponse = await fetch(`${baseUrl}/api/generate-card-image?${params.toString()}`);
        
        if (!imageResponse.ok) {
            const errorText = await imageResponse.text();
            console.error('[CardNews API] Image generation error response:', errorText);
            throw new Error(`Image generation failed: ${imageResponse.status}`);
        }
        
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer);
        
        console.log(`[CardNews API] Image generated: ${imageBuffer.length} bytes`);
        console.log('[CardNews API] Publishing to WordPress...');
        
        const dateStr = new Date().toISOString().split('T')[0];
        
        const result = await publishCardNewsToWordPress(imageBuffer, dateStr, {
            topNewsTitle: title,
            terminalUrl: 'https://chaovietnam.co.kr/daily-news-terminal/'
        });
        
        console.log('[CardNews API] Success:', result);
        
        return new Response(JSON.stringify({
            success: true,
            terminalUrl: result.terminalUrl,
            imageUrl: result.imageUrl
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('[CardNews API] Error:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
