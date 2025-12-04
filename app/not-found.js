import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
                Return Home
            </Link>
        </div>
    );
}
