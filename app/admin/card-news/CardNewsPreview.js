'use client';

import { useState } from 'react';
import CardNewsPreviewV1 from './CardNewsPreviewV1';
import CardNewsPreviewMars from './CardNewsPreviewMars';

export default function CardNewsPreview({ data, mode = 'preview' }) {
    // Default to 'mars' to show the new design first, but allow switching back to 'v1'
    const [activeDesign, setActiveDesign] = useState('mars');

    // If in print mode, we might want to support a query param or just default to one.
    // For now, let's default to Mars for printing as it's the latest.
    // Ideally, the print page would pass a prop, but let's keep it simple.

    if (mode === 'print') {
        // You could check URL params here if needed, but defaulting to Mars is safe for "trying it out".
        return <CardNewsPreviewMars data={data} mode="print" />;
    }

    return (
        <div className="min-h-screen bg-gray-200 p-8 font-sans flex flex-col items-center">
            <div className="mb-8 flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Card News Design Preview</h1>

                <div className="flex bg-white p-1 rounded-lg shadow-md">
                    <button
                        onClick={() => setActiveDesign('v1')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeDesign === 'v1'
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        Version 1 (Original)
                    </button>
                    <button
                        onClick={() => setActiveDesign('mars')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeDesign === 'mars'
                                ? 'bg-orange-600 text-white shadow-sm'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        Version 2 (Mars Explorer)
                    </button>
                </div>

                <p className="text-gray-500 text-xs">
                    {activeDesign === 'v1' ? 'Clean, compact footer design.' : 'Modern, dark theme with wave separator.'}
                </p>
            </div>

            {activeDesign === 'v1' ? (
                <CardNewsPreviewV1 data={data} mode="preview" />
            ) : (
                <CardNewsPreviewMars data={data} mode="preview" />
            )}
        </div>
    );
}
