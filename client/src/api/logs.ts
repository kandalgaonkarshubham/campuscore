import type { PaginationMeta } from '../validators/student';
import api from './client';

export interface ActivityLog {
  id: number;
  action: 'CREATED' | 'UPDATED' | 'DELETED';
  studentId: number | null;
  studentName: string | null;
  admissionNumber: string | null;
  changedFields: string[];
  createdAt: string;
}

export interface LogListResponse {
  data: ActivityLog[];
  pagination: PaginationMeta;
}

export async function listLogs(params: {
  page?: number;
  limit?: number;
}): Promise<LogListResponse> {
  const res = await api.get('/activity-logs', { params });
  return {
    data: res.data.data,
    pagination: res.data.pagination,
  };
}
