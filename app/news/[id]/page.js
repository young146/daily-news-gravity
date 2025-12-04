import { MOCK_NEWS } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return MOCK_NEWS.map((news) => ({
        id: news.id,
    }));
}

export default async function NewsDetail({ params }) {
    const { id } = await params;
    const news = MOCK_NEWS.find((item) => item.id === id);

    if (!news) {
        notFound();
    }

    return (
        <article className="bg-white min-h-screen pb-20">
            {/* Hero Image */}
            <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                    src={news.imageUrl}
                    alt={news.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" /> 뉴스 목록으로
                    </Link>
                    <div className="flex items-center space-x-4 mb-4">
                        <span className="px-3 py-1 text-sm font-semibold bg-accent text-white rounded-full">
                            {news.category}
                        </span>
                        <span className="text-white/90 flex items-center text-sm">
                            <Calendar size={16} className="mr-2" /> {news.date}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight max-w-4xl">
                        {news.title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">출처: {news.source}</p>
                            <p className="text-xs text-gray-500">데일리 뉴스 리포터</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                            <Tag size={20} />
                        </button>
                    </div>
                </div>

                <div className="prose prose-lg prose-slate max-w-none">
                    <p className="lead text-xl text-gray-600 font-serif leading-relaxed mb-8">
                        {news.summary}
                    </p>
                    <div className="text-gray-800 leading-loose space-y-6">
                        <p>{news.content}</p>
                        <p>
                            이 정책이 시행되면 베트남 경제 전반에 긍정적인 영향을 미칠 것으로 예상됩니다. 전문가들은 특히 외국인 투자 유치와 내수 시장 활성화에 큰 도움이 될 것이라고 분석하고 있습니다.
                        </p>
                        <p>
                            다만, 인플레이션 압력과 글로벌 경기 침체 우려 등 해결해야 할 과제도 남아있습니다. 정부는 이에 대한 선제적 대응책을 마련 중이라고 밝혔습니다.
                        </p>
                        <h3 className="text-2xl font-serif font-bold text-primary mt-8 mb-4">향후 전망</h3>
                        <p>
                            앞으로 양국 간의 교류는 더욱 활발해질 전망입니다. 이번 조치를 통해 문화, 경제, 사회 전반에 걸친 협력이 강화되어 양국 국민들의 삶의 질 향상에도 기여할 것으로 기대됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}
