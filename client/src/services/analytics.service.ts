import api from './api';

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

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const res = await api.get('/analytics/overview');
  return res.data.data;
}
