export interface StudentFilters {
  search: string;
  course: string;
  year: string;
  gender: string;
}

interface SearchFilterBarProps {
  filters: StudentFilters;
  courses: string[];
  years: number[];
  onChange: (filters: StudentFilters) => void;
}

export default function SearchFilterBar({
  filters,
  courses,
  years,
  onChange,
}: SearchFilterBarProps) {
  const update = (patch: Partial<StudentFilters>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="search" className="sr-only">
          Search by name
        </label>
        <input
          id="search"
          type="search"
          placeholder="Search by name..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <select
        value={filters.course}
        onChange={(e) => update({ course: e.target.value })}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All courses</option>
        {courses.map((course) => (
          <option key={course} value={course}>
            {course}
          </option>
        ))}
      </select>

      <select
        value={filters.year}
        onChange={(e) => update({ year: e.target.value })}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All years</option>
        {years.map((year) => (
          <option key={year} value={String(year)}>
            Year {year}
          </option>
        ))}
      </select>

      <select
        value={filters.gender}
        onChange={(e) => update({ gender: e.target.value })}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
}
