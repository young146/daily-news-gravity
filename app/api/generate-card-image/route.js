import { ImageResponse } from '@vercel/og';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || '오늘의 뉴스';
    const imageUrl = searchParams.get('image') || '';
    const weatherTemp = searchParams.get('weather') || '--';
    const usdRate = searchParams.get('usd') || '--';
    const krwRate = searchParams.get('krw') || '--';
    
    const now = new Date();
    const vietnamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const year = vietnamTime.getFullYear();
    const month = vietnamTime.getMonth() + 1;
    const day = vietnamTime.getDate();
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[vietnamTime.getDay()];
    const dateStr = `${year}년 ${month}월 ${day}일 ${weekday}`;

    const fontSize = title.length > 40 ? 42 : 52;

    let imageDataUrl = null;
    
    if (imageUrl) {
        try {
            const https = require('https');
            const crypto = require('crypto');
            
            const agent = new https.Agent({
                rejectUnauthorized: false,
                secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
            });
            
            const response = await fetch(imageUrl, {
                agent,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            if (response.ok) {
                const buffer = await response.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                const contentType = response.headers.get('content-type') || 'image/jpeg';
                imageDataUrl = `data:${contentType};base64,${base64}`;
                console.log('[CardImage] Image fetched successfully:', imageUrl.substring(0, 50) + '...');
            } else {
                console.log('[CardImage] Image fetch failed:', response.status);
            }
        } catch (e) {
            console.log('[CardImage] Image fetch error:', e.message);
        }
    }

    try {
        return new ImageResponse(
            (
                <div
                    style={{
                        width: '1200px',
                        height: '630px',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {imageDataUrl ? (
                        <img
                            src={imageDataUrl}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '1200px',
                                height: '630px',
                                objectFit: 'cover',
                                filter: 'brightness(0.4)',
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '1200px',
                                height: '630px',
                                background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
                            }}
                        />
                    )}
                    
                    <div
                        style={{
                            position: 'relative',
                            zIndex: 10,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '40px 60px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    color: '#ffffff',
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                }}
                            >
                                Xin Chào Vietnam
                            </div>
                            <div
                                style={{
                                    backgroundColor: 'rgba(139, 0, 0, 0.9)',
                                    color: '#ffffff',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    padding: '10px 30px',
                                    borderRadius: '30px',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                }}
                            >
                                {dateStr}
                            </div>
                        </div>
                        
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <div
                                style={{
                                    color: '#fbbf24',
                                    fontSize: '28px',
                                    fontWeight: 'bold',
                                    marginBottom: '20px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                }}
                            >
                                오늘의 뉴스
                            </div>
                            <h1
                                style={{
                                    color: '#ffffff',
                                    fontSize: `${fontSize}px`,
                                    fontWeight: 'bold',
                                    margin: 0,
                                    lineHeight: 1.3,
                                    maxWidth: '1000px',
                                    textShadow: '0 4px 8px rgba(0,0,0,0.7)',
                                }}
                            >
                                {title}
                            </h1>
                        </div>
                        
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '40px',
                                paddingTop: '20px',
                                borderTop: '1px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            <div
                                style={{
                                    color: '#ffffff',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                }}
                            >
                                🌡️ 서울 {weatherTemp}°C
                            </div>
                            <div
                                style={{
                                    color: '#ffffff',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                }}
                            >
                                💵 USD {usdRate}₫
                            </div>
                            <div
                                style={{
                                    color: '#ffffff',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                }}
                            >
                                💴 KRW {krwRate}₫
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        console.error('[CardImage] Generation error:', e);
        return new Response(JSON.stringify({ error: 'Failed to generate image', details: e.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
