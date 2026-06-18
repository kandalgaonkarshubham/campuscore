import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AppLayoutProps {
  children: ReactNode;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition ${isActive ? 'font-medium text-blue-600' : 'text-slate-600 hover:text-slate-900'}`;

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <nav className="flex items-center gap-6">
            <NavLink to="/dashboard" className="text-lg font-semibold text-slate-900">
              Compuscore
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/students" className={navLinkClass}>
              Students
            </NavLink>
            <NavLink to="/activity-logs" className={navLinkClass}>
              Activity Log
            </NavLink>
          </nav>
          <div className="flex items-center gap-4">
            {/* <span className="text-sm text-slate-600">{user?.username}</span> */}
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
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
