import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">Coming in a future phase.</p>
        <Link to="/" className="mt-6 inline-block text-sm text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
