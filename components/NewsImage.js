'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

export default function NewsImage({ src, alt, className, fill, priority }) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={`bg-slate-200 flex items-center justify-center ${className} ${fill ? 'absolute inset-0' : ''}`}>
                <div className="text-slate-400 flex flex-col items-center">
                    <ImageIcon size={48} className="mb-2" />
                    <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
                </div>
            </div>
        );
    }

    // Some domains block Next.js image optimization or have issues with it.
    // We bypass optimization for these known problematic domains.
    const isUnoptimized = src && (
        src.includes('yna.co.kr') ||
        src.includes('yonhapnews.co.kr') ||
        src.includes('insidevina.com')
    );

    return (
        <Image
            src={src}
            alt={alt}
            fill={fill}
            className={className}
            priority={priority}
            unoptimized={isUnoptimized}
            onError={() => setError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
    );
}
