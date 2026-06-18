import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import type { ActivityLog } from '../services/activityLog.service';
import { listActivityLogs } from '../services/activityLog.service';
import type { PaginationMeta } from '../services/student.service';

const ACTION_STYLES: Record<ActivityLog['action'], string> = {
  CREATED: 'bg-green-100 text-green-800',
  UPDATED: 'bg-blue-100 text-blue-800',
  DELETED: 'bg-red-100 text-red-800',
};

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setError('');

    listActivityLogs({ page, limit: 20 })
      .then((result) => {
        setLogs(result.data);
        setPagination(result.pagination);
      })
      .catch(() => setError('Failed to load activity logs'))
      .finally(() => setIsLoading(false));
  }, [page]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Activity Log</h1>
          <p className="mt-1 text-sm text-slate-500">
            Recent student create, update, and delete events
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {isLoading && <LoadingSpinner className="py-12" />}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!isLoading && !error && logs.length === 0 && (
            <p className="py-12 text-center text-sm text-slate-500">No activity recorded yet.</p>
          )}

          {!isLoading && !error && logs.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Action</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Student</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Admission No.</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">Changed Fields</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ACTION_STYLES[log.action]}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-900">{log.studentName ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{log.admissionNumber ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {log.changedFields.length > 0 ? log.changedFields.join(', ') : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !error && pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
