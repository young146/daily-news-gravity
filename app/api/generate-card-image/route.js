import { ImageResponse } from '@vercel/og';

export async function GET(request) {
    const now = new Date();
    const vietnamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const year = vietnamTime.getFullYear();
    const month = vietnamTime.getMonth() + 1;
    const day = vietnamTime.getDate();
    const hours = vietnamTime.getHours();
    const minutes = vietnamTime.getMinutes().toString().padStart(2, '0');
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[vietnamTime.getDay()];
    const dateStr = `${year}년 ${month}월 ${day}일 ${weekday} ${hours}:${minutes}`;

    try {
        return new ImageResponse(
            (
                <div
                    style={{
                        width: '1200px',
                        height: '630px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
                        fontFamily: 'sans-serif',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#8B0000',
                            color: '#ffffff',
                            fontSize: '54px',
                            fontWeight: 'bold',
                            padding: '18px 60px',
                            borderRadius: '50px',
                            marginBottom: '50px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                    >
                        {dateStr}
                    </div>
                    <h1
                        style={{
                            color: '#ffffff',
                            fontSize: '90px',
                            fontWeight: 'bold',
                            margin: 0,
                            textAlign: 'center',
                            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                        }}
                    >
                        씬짜오 오늘의 뉴스
                    </h1>
                    <p
                        style={{
                            color: '#ffffff',
                            fontSize: '70px',
                            marginTop: '30px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                        }}
                    >
                        XinChao Today's News
                    </p>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e) {
        console.error('Error generating image:', e);
        return new Response(JSON.stringify({ error: 'Failed to generate image', details: e.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
