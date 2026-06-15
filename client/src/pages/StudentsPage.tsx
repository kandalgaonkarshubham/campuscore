import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

export default function StudentsPage() {
  return (
    <AppLayout>
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Students</h1>
          </div>
          <Link
            to="/students/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Student
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
