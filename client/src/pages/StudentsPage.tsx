import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import SearchFilterBar, { type StudentFilters } from '../components/SearchFilterBar';
import StudentTable from '../components/StudentTable';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { Student, PaginationMeta } from '../validators/student';
import { getFilterOptions, listStudents } from '../api/students';

const EMPTY_FILTERS: StudentFilters = {
  search: '',
  course: '',
  year: '',
  gender: '',
};

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export default function StudentsPage() {
  const [filters, setFilters] = useState<StudentFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [courses, setCourses] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedSearch = useDebouncedValue(filters.search, 300);

  useEffect(() => {
    getFilterOptions()
      .then((meta) => {
        setCourses(meta.courses);
        setYears(meta.years);
      })
      .catch(() => {
        // Filter dropdowns stay empty if meta fails
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError('');

    listStudents({
      page,
      limit: 10,
      search: debouncedSearch || undefined,
      course: filters.course || undefined,
      year: filters.year ? Number(filters.year) : undefined,
      gender: filters.gender || undefined,
    })
      .then((result) => {
        setStudents(result.data);
        setPagination(result.pagination);
      })
      .catch(() => setError('Failed to load students'))
      .finally(() => setIsLoading(false));
  }, [page, debouncedSearch, filters.course, filters.year, filters.gender]);

  const handleFiltersChange = (next: StudentFilters) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Students</h1>
            <p className="mt-1 text-sm text-slate-500">
              {pagination.total} student{pagination.total !== 1 ? 's' : ''} total
            </p>
          </div>
          <Link
            to="/students/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Student
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <SearchFilterBar
            filters={filters}
            courses={courses}
            years={years}
            onChange={handleFiltersChange}
          />

          <div className="mt-6">
            {isLoading && <LoadingSpinner className="py-12" />}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {!isLoading && !error && <StudentTable students={students} />}
          </div>

          {!isLoading && !error && pagination.totalPages > 0 && (
            <div className="mt-6">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
