import AppLayout from '../components/AppLayout';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-2 text-slate-600">Analytics and stats arrive in Phase 6.</p>
      </div>
    </AppLayout>
  );
}
