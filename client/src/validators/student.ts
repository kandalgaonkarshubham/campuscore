import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  course: z.string().trim().min(1, 'Course is required').max(100),
  year: z.coerce.number().int().min(1, 'Year must be at least 1').max(10),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date of birth'),
  email: z.string().trim().email('Invalid email address').max(255),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{10,20}$/, 'Invalid mobile number'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  address: z.string().trim().min(1, 'Address is required'),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export interface Student {
  id: number;
  admissionNumber: string;
  name: string;
  course: string;
  year: number;
  dob: string;
  email: string;
  mobile: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
