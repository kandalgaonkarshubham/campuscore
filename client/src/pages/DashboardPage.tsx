import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold text-slate-900">ScholarDesk</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.username}</span>
            <button
              type="button"
              onClick={() => logout()}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
          <p className="mt-2 text-slate-600">
            Welcome back, {user?.username}.
          </p>
        </div>
      </main>
    </div>
  );
}
