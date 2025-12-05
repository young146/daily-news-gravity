'use client';

import { useState } from 'react';

export default function CrawlNewsButton() {
    const [isCrawling, setIsCrawling] = useState(false);
    const [result, setResult] = useState(null);

    const handleCrawl = async () => {
        if (!confirm('7개 소스에서 뉴스를 수집합니다. 진행하시겠습니까?')) return;
        
        setIsCrawling(true);
        setResult(null);
        
        try {
            const response = await fetch('/api/crawl-news', { method: 'POST' });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Server error');

            setResult(data);
            alert(`뉴스 수집 완료!\n\n총 ${data.total}개 발견\n새로 저장: ${data.newItems}개\n\n페이지를 새로고침합니다.`);
            window.location.reload();

        } catch (error) {
            console.error('Crawl failed:', error);
            alert(`뉴스 수집 실패: ${error.message}`);
        }
        setIsCrawling(false);
    };

    return (
        <button
            onClick={handleCrawl}
            disabled={isCrawling}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            title="7개 소스에서 뉴스 수집"
        >
            {isCrawling ? '수집 중...' : '뉴스 수집'}
        </button>
    );
}
