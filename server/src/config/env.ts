import { z } from 'zod';

const envSchema = z
  .object({
    PORT: z.coerce.number().default(5000),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    COOKIE_NAME: z.string().default('campuscore_token'),
    ADMIN_USERNAME: z.string().default('admin'),
    ADMIN_PASSWORD: z.string().default('admin123'),
    CLIENT_URL: z.string().url().default('http://localhost:5173'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    UPLOAD_DIR: z.string().default('uploads'),
    MAX_FILE_SIZE_MB: z.coerce.number().default(5),
    UPLOAD_STORAGE: z.enum(['local', 'vercel-blob']).default('local'),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.UPLOAD_STORAGE === 'vercel-blob' && !data.BLOB_READ_WRITE_TOKEN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'BLOB_READ_WRITE_TOKEN is required when UPLOAD_STORAGE=vercel-blob',
        path: ['BLOB_READ_WRITE_TOKEN'],
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors);
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();
