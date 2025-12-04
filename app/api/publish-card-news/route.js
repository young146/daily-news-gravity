import prisma from '@/lib/prisma';
import { publishCardNewsToWordPress } from '@/lib/publisher';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const imageFile = formData.get('image');
        
        if (!imageFile) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'No image provided' 
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        
        const arrayBuffer = await imageFile.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);
        
        const date = new Date().toISOString().split('T')[0];
        
        const topNews = await prisma.newsItem.findFirst({
            where: { isTopNews: true },
            select: { translatedTitle: true, title: true }
        });
        
        console.log('[CardNews API] Publishing to WordPress...');
        
        const result = await publishCardNewsToWordPress(imageBuffer, date, {
            topNewsTitle: topNews?.translatedTitle || topNews?.title,
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
