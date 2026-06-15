import type { Student, StudentFormData } from '../schemas/student.schema';
import api from './api';

export async function createStudent(data: StudentFormData): Promise<Student> {
  const res = await api.post('/students', data);
  return res.data.data;
}

export async function getStudent(id: number): Promise<Student> {
  const res = await api.get(`/students/${id}`);
  return res.data.data;
}

export async function updateStudent(id: number, data: StudentFormData): Promise<Student> {
  const res = await api.put(`/students/${id}`, data);
  return res.data.data;
}

export async function deleteStudent(id: number): Promise<void> {
  await api.delete(`/students/${id}`);
}
