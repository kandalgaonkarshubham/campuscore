import type { PaginationMeta, Student, StudentFormData } from '../validators/student';
import api from './client';

export interface StudentListParams {
  page?: number;
  limit?: number;
  search?: string;
  course?: string;
  year?: number;
  gender?: string;
}

export interface StudentListResponse {
  data: Student[];
  pagination: PaginationMeta;
}

export interface FilterOptions {
  courses: string[];
  years: number[];
}

function buildFormData(data: StudentFormData, photo: File): FormData {
  const form = new FormData();
  form.append('name', data.name);
  form.append('course', data.course);
  form.append('year', String(data.year));
  form.append('dob', data.dob);
  form.append('email', data.email);
  form.append('mobile', data.mobile);
  form.append('gender', data.gender);
  form.append('address', data.address);
  form.append('photo', photo);
  return form;
}

export async function listStudents(params: StudentListParams): Promise<StudentListResponse> {
  const res = await api.get('/students', { params });
  return {
    data: res.data.data,
    pagination: res.data.pagination,
  };
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const res = await api.get('/students/meta');
  return res.data.data;
}

export async function createStudent(data: StudentFormData, photo?: File): Promise<Student> {
  const res = photo
    ? await api.post('/students', buildFormData(data, photo))
    : await api.post('/students', data);
  return res.data.data;
}

export async function getStudent(id: number): Promise<Student> {
  const res = await api.get(`/students/${id}`);
  return res.data.data;
}

export async function updateStudent(
  id: number,
  data: StudentFormData,
  photo?: File,
): Promise<Student> {
  const res = photo
    ? await api.put(`/students/${id}`, buildFormData(data, photo))
    : await api.put(`/students/${id}`, data);
  return res.data.data;
}

export async function deleteStudent(id: number): Promise<void> {
  await api.delete(`/students/${id}`);
}

export type { PaginationMeta };
