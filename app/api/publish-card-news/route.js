import prisma from '@/lib/prisma';
import { publishCardNewsToWordPress } from '@/lib/publisher';
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
        const imageUrl = topNews.imageUrl || '';
        const date = new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
        });
        const weatherTemp = weather?.temp ?? '25';
        const usdRate = rates?.usdVnd?.toLocaleString() ?? '25,400';
        const krwRate = rates?.krwVnd?.toLocaleString() ?? '17.8';
        
        console.log('[CardNews API] Generating image with data:', { title, date });
        
        const params = new URLSearchParams({
            title,
            summary,
            image: imageUrl,
            date,
            weather: String(weatherTemp),
            usd: String(usdRate),
            krw: String(krwRate)
        });
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                        process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` :
                        'http://127.0.0.1:5000';
        const imageResponse = await fetch(`${baseUrl}/api/generate-card-image?${params.toString()}`);
        
        if (!imageResponse.ok) {
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
