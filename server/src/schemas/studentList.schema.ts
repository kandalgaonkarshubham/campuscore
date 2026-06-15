import { z } from 'zod';

export const listStudentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  course: z.string().trim().optional(),
  year: z.coerce.number().int().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export type ListStudentsQuery = z.infer<typeof listStudentsQuerySchema>;
