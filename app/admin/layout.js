import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold font-serif">관리자 콘솔</h1>
                    <p className="text-xs text-slate-400 mt-1">신짜오 뉴스레터</p>
                </div>

                <nav className="flex-grow p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-slate-800 text-white"
                    >
                        <LayoutDashboard size={20} />
                        <span>대시보드</span>
                    </Link>
                    <Link
                        href="/admin/drafts"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <FileText size={20} />
                        <span>초안</span>
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <Settings size={20} />
                        <span>설정</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-slate-800 transition-colors">
                        <LogOut size={20} />
                        <span>로그아웃</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-auto">
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
                    <h2 className="text-lg font-semibold text-gray-800">개요</h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                            A
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
