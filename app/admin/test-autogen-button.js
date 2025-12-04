'use client';

import { useState } from 'react';

export default function TestAutoGenButton() {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleServerGenerate = async () => {
        if (!confirm('This will trigger the server to open a hidden browser and generate the PDF/Image automatically. Continue?')) return;
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-daily-content', { method: 'POST' });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Server error');

            alert('Success! Server generated files.\nOpening them now...');
            window.open(result.pdfUrl, '_blank');
            window.open(result.pngUrl, '_blank');

        } catch (error) {
            console.error('Server generation failed:', error);
            alert(`Server generation failed: ${error.message}`);
        }
        setIsGenerating(false);
    };

    return (
        <button
            onClick={handleServerGenerate}
            disabled={isGenerating}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50"
            title="Test Server-Side Generation"
        >
            {isGenerating ? 'Working...' : 'Test Auto-Gen 🤖'}
        </button>
    );
}
