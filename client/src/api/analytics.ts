import api from './client';

export interface GenderRatio {
  male: number;
  female: number;
  other: number;
}

export interface CourseCount {
  course: string;
  count: number;
}

export interface AnalyticsOverview {
  totalStudents: number;
  genderRatio: GenderRatio;
  courseWiseCount: CourseCount[];
}

export async function getOverview(): Promise<AnalyticsOverview> {
  const res = await api.get('/analytics/overview');
  return res.data.data;
}
