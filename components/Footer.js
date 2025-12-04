import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-serif font-bold text-white mb-4">
                            씬짜오<span className="text-accent">뉴스레터</span>
                        </h2>
                        <p className="text-sm leading-relaxed max-w-xs text-slate-400">
                            베트남과 한국의 가장 관련성 높은 뉴스를 전달합니다.
                            문화를 잇고 당신의 일상에 통찰력을 더해드립니다.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">카테고리</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/category/society" className="hover:text-white transition-colors">사회</Link></li>
                            <li><Link href="/category/economy" className="hover:text-white transition-colors">경제</Link></li>
                            <li><Link href="/category/culture" className="hover:text-white transition-colors">문화</Link></li>
                            <li><Link href="/category/policy" className="hover:text-white transition-colors">정책</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">연결하기</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">페이스북</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">텔레그램</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">문의하기</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} XinchaoNewsLetter. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-slate-400">개인정보처리방침</Link>
                        <Link href="/terms" className="hover:text-slate-400">이용약관</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
