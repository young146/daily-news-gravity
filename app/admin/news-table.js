'use client'

import { useState } from 'react';
import Link from "next/link";
import { Edit, CheckCircle, XCircle, Globe, Share, Send } from "lucide-react";
import { translateItemAction, publishItemAction } from './actions';

export default function NewsTable({ initialNews }) {
    const [news, setNews] = useState(initialNews);
    const [loading, setLoading] = useState(null);

    const handleTranslate = async (id) => {
        setLoading(id);
        const res = await translateItemAction(id);
        if (res.success) {
            alert('번역이 완료되었습니다!');
            // In a real app, we'd update the local state or re-fetch
        } else {
            alert('번역 실패: ' + res.error);
        }
        setLoading(null);
    };

    const handlePublish = async (id, target) => {
        if (!confirm(`${target}에 발행하시겠습니까?`)) return;
        setLoading(id);
        const res = await publishItemAction(id, target);
        if (res.success) {
            alert(`${target} 발행 완료!`);
        } else {
            alert('발행 실패: ' + res.error);
        }
        setLoading(null);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="px-6 py-3 font-medium">제목</th>
                        <th className="px-6 py-3 font-medium">출처</th>
                        <th className="px-6 py-3 font-medium">날짜</th>
                        <th className="px-6 py-3 font-medium">상태</th>
                        <th className="px-6 py-3 font-medium text-right">작업</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {news.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 max-w-md">
                                <div className="truncate" title={item.title}>{item.title}</div>
                                {item.translatedTitle && (
                                    <div className="text-xs text-indigo-600 mt-1 truncate" title={item.translatedTitle}>
                                        [VI] {item.translatedTitle}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-gray-500">{item.source}</td>
                            <td className="px-6 py-4 text-gray-500">
                                {new Date(item.publishedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {item.status}
                                    </span>
                                    {item.isPublishedMain && <span className="text-xs text-green-600">메인 사이트 ✓</span>}
                                    {item.isPublishedDaily && <span className="text-xs text-blue-600">데일리 사이트 ✓</span>}
                                    {item.isSentSNS && <span className="text-xs text-pink-600">SNS 전송 ✓</span>}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() => handleTranslate(item.id)}
                                        disabled={loading === item.id}
                                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                        title="번역하기"
                                    >
                                        <Globe size={18} />
                                    </button>

                                    <button
                                        onClick={() => handlePublish(item.id, 'main')}
                                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                        title="메인 사이트 발행"
                                    >
                                        <CheckCircle size={18} />
                                    </button>

                                    <button
                                        onClick={() => handlePublish(item.id, 'daily')}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="데일리 사이트 발행"
                                    >
                                        <Share size={18} />
                                    </button>

                                    <button
                                        onClick={() => handlePublish(item.id, 'sns')}
                                        className="p-1 text-gray-400 hover:text-pink-600 transition-colors"
                                        title="SNS 전송"
                                    >
                                        <Send size={18} />
                                    </button>

                                    <Link
                                        href={`/admin/news/${item.id}`}
                                        className="p-1 text-gray-400 hover:text-primary transition-colors"
                                        title="수정"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
