export default function AdBanner({ className = "" }) {
    return (
        <div className={`w-full bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 text-center ${className}`}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Advertisement</span>
            <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 font-medium">광고 배너 영역 (Google Ads / Custom)</span>
            </div>
        </div>
    );
}
