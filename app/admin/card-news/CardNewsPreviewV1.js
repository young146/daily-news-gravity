'use client';

import { useRef, useState } from 'react';

export default function CardNewsPreviewV1({ data, mode = 'preview' }) {
    const { topNews, cardNewsItems, weather, rates } = data;
    const cardRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

    const generateCanvas = async () => {
        if (!cardRef.current) return null;
        const html2canvas = (await import('html2canvas')).default;
        const images = cardRef.current.querySelectorAll('img');
        const originalSrcs = [];

        await Promise.all(Array.from(images).map(async (img, i) => {
            originalSrcs[i] = img.src;
            if (img.src.startsWith('/') || img.src.includes(window.location.origin)) return;
            try {
                const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(img.src)}`;
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error('Proxy fetch failed');
                const blob = await response.blob();
                img.src = URL.createObjectURL(blob);
            } catch (e) {
                console.warn('Failed to proxy image:', img.src);
            }
        }));

        const canvas = await html2canvas(cardRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
        });

        images.forEach((img, i) => {
            if (originalSrcs[i]) {
                URL.revokeObjectURL(img.src);
                img.src = originalSrcs[i];
            }
        });
        return canvas;
    };

    const handleDownloadImage = async () => {
        setIsGenerating(true);
        try {
            const canvas = await generateCanvas();
            if (canvas) {
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `daily-news-v1-${new Date().toISOString().split('T')[0]}.png`;
                link.click();
            }
        } catch (error) {
            alert(`Failed: ${error.message}`);
        }
        setIsGenerating(false);
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            const canvas = await generateCanvas();
            if (canvas) {
                const { jsPDF } = await import('jspdf');
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4');
                pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                pdf.save(`daily-news-v1-${new Date().toISOString().split('T')[0]}.pdf`);
            }
        } catch (error) {
            alert(`Failed: ${error.message}`);
        }
        setIsGenerating(false);
    };

    return (
        <div className={mode === 'print' ? "w-[1200px] h-[630px] overflow-hidden m-0 p-0" : "flex flex-col items-center"}>
            {/* --- CARD CONTAINER V1 (Compact Footer) --- */}
            <div id="capture-target" ref={cardRef} className="w-[1200px] h-[630px] flex overflow-hidden relative bg-white shadow-xl">

                {/* === LEFT PANEL: TOP NEWS (60%) === */}
                <div className="w-[60%] relative h-full group">
                    <div className="absolute inset-0">
                        {topNews?.imageUrl ? (
                            <img src={topNews.imageUrl} alt="Top News" className="w-full h-full object-cover"
                                onError={(e) => {
                                    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(topNews.imageUrl)}`;
                                    if (e.target.src !== window.location.origin + proxyUrl) e.target.src = proxyUrl;
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">No Image</div>
                        )}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.8) 100%)' }} />
                    </div>

                    <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                        <img src="/logo.png" alt="Logo" className="w-12 h-auto drop-shadow-md" onError={(e) => e.target.style.display = 'none'} />
                        <div className="flex flex-col">
                            <span className="font-serif italic text-lg leading-none text-white drop-shadow-md">Xin Chao</span>
                            <span className="text-xs font-bold tracking-widest uppercase text-orange-400 drop-shadow-md">Today News</span>
                        </div>
                    </div>

                    <div className="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-medium bg-black/40 text-white">
                        {today}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-10 text-white">
                        <h1 className="text-4xl font-bold leading-tight mb-4 text-balance drop-shadow-lg">
                            {topNews?.translatedTitle || topNews?.title || "Top News Title Here"}
                        </h1>
                        <p className="text-lg line-clamp-3 leading-relaxed opacity-90 max-w-2xl drop-shadow-md">
                            {topNews?.translatedSummary || topNews?.summary || "Summary of the top news will appear here."}
                        </p>
                    </div>
                </div>

                {/* === RIGHT PANEL: SIDEBAR (40%) === */}
                <div className="w-[40%] flex flex-col h-full border-l bg-slate-50 border-gray-200">
                    <div className="flex-1 p-6 grid grid-cols-2 grid-rows-2 gap-4">
                        {cardNewsItems.map((item) => (
                            <div key={item.id} className="relative rounded-lg shadow-sm overflow-hidden border bg-white border-gray-100">
                                <div className="h-24 relative">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(item.imageUrl)}`;
                                                if (e.target.src !== window.location.origin + proxyUrl) e.target.src = proxyUrl;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200" />
                                    )}
                                    <span className="absolute bottom-0 left-0 text-white text-[9px] font-bold px-1.5 py-0.5 bg-orange-600">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="p-3 flex-1 flex flex-col">
                                    <h4 className="text-xs font-bold leading-snug line-clamp-2 mb-1 text-gray-800">
                                        {item.translatedTitle || item.title}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Info: Weather & Rates - Compact Design (V1) */}
                    <div className="px-6 py-4 border-t bg-slate-50 border-slate-200">
                        <div className="mb-3">
                            <img src="/logo-full.png" alt="Xin Chao Vietnam" className="h-10 w-auto object-contain" />
                        </div>
                        <div className="flex gap-12">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Seoul Weather</p>
                                <div className="flex items-center gap-2 text-gray-800">
                                    <span className="text-xl">{weather ? getWeatherIcon(weather.code) : '☀️'}</span>
                                    <span className="text-lg font-bold">{weather?.temp ?? '--'}°</span>
                                    <span className="text-xs text-slate-600">{weather?.condition}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Exchange Rates</p>
                                <div className="flex gap-4 text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-500">USD</span>
                                        <span className="font-bold text-gray-800">{rates?.usdVnd?.toLocaleString() ?? '---'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-500">KRW</span>
                                        <span className="font-bold text-gray-800">{rates?.krwVnd?.toLocaleString() ?? '---'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {mode !== 'print' && (
                <div className="mt-4 flex gap-4">
                    <button onClick={handleDownloadPDF} disabled={isGenerating} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
                        Download V1 PDF
                    </button>
                    <button onClick={handleDownloadImage} disabled={isGenerating} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">
                        Download V1 Image
                    </button>
                </div>
            )}
        </div>
    );
}

function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if (code > 0 && code < 3) return '⛅';
    if (code >= 3 && code < 50) return '☁️';
    if (code >= 50 && code < 80) return '🌧️';
    if (code >= 80) return '❄️';
    return '☀️';
}
