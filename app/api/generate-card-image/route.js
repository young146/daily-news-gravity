import { ImageResponse } from '@vercel/og';

export async function GET(request) {
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
                    <h1
                        style={{
                            color: 'white',
                            fontSize: '80px',
                            fontWeight: 'bold',
                            margin: 0,
                            textAlign: 'center',
                        }}
                    >
                        씬짜오 오늘의 뉴스
                    </h1>
                    <p
                        style={{
                            color: '#94a3b8',
                            fontSize: '40px',
                            marginTop: '30px',
                            textAlign: 'center',
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
