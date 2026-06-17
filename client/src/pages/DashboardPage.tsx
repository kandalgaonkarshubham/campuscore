import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AppLayout from '../components/AppLayout';
import type { AnalyticsOverview } from '../services/analytics.service';
import { getAnalyticsOverview } from '../services/analytics.service';

const GENDER_COLORS = {
  male: '#3b82f6',
  female: '#ec4899',
  other: '#8b5cf6',
};

const GENDER_LABELS: Record<keyof AnalyticsOverview['genderRatio'], string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
};

export default function DashboardPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalyticsOverview()
      .then(setOverview)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setIsLoading(false));
  }, []);

  const genderChartData = overview
    ? (Object.entries(overview.genderRatio) as [keyof AnalyticsOverview['genderRatio'], number][])
        .map(([key, value]) => ({
          name: GENDER_LABELS[key],
          value,
          color: GENDER_COLORS[key],
        }))
        .filter((item) => item.value > 0)
    : [];

  const hasGenderData = genderChartData.length > 0;
  const hasCourseData = (overview?.courseWiseCount.length ?? 0) > 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Overview of student enrollment</p>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-500">Loading analytics...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 shadow-sm">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!isLoading && !error && overview && (
          <>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <p className="mt-2 text-4xl font-bold text-slate-900">{overview.totalStudents}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Gender Distribution</h2>
                {hasGenderData ? (
                  <div className="mt-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {genderChartData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="mt-8 text-center text-sm text-slate-500">No student data yet</p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Students by Course</h2>
                {hasCourseData ? (
                  <div className="mt-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={overview.courseWiseCount} margin={{ bottom: 20 }}>
                        <XAxis
                          dataKey="course"
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={overview.courseWiseCount.length > 4 ? -25 : 0}
                          textAnchor={overview.courseWiseCount.length > 4 ? 'end' : 'middle'}
                          height={overview.courseWiseCount.length > 4 ? 60 : 30}
                        />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="mt-8 text-center text-sm text-slate-500">No student data yet</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
