import { z } from 'zod';

const genderEnum = z.enum(['male', 'female', 'other']);

export const createStudentSchema = z.object({
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
  gender: genderEnum,
  address: z.string().trim().min(1, 'Address is required'),
});

export const updateStudentSchema = createStudentSchema;

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

export function parseDob(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}
