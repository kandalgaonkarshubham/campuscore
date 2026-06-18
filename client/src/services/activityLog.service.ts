import api from './api';
import type { PaginationMeta } from './student.service';

export interface ActivityLog {
  id: number;
  action: 'CREATED' | 'UPDATED' | 'DELETED';
  studentId: number | null;
  studentName: string | null;
  admissionNumber: string | null;
  changedFields: string[];
  createdAt: string;
}

export interface ActivityLogListResponse {
  data: ActivityLog[];
  pagination: PaginationMeta;
}

export async function listActivityLogs(params: {
  page?: number;
  limit?: number;
}): Promise<ActivityLogListResponse> {
  const res = await api.get('/activity-logs', { params });
  return {
    data: res.data.data,
    pagination: res.data.pagination,
  };
}
