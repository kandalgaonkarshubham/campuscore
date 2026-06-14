import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">ScholarDesk</h1>
        <p className="mt-2 text-slate-600">Student Management System</p>
      </div>
    </div>
  );
}
