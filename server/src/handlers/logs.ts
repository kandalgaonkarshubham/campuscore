import { count, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { activityLogs } from '../db/schema';
import type { AppRequest, AppResponse } from '../types/http';

const listQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

function formatLog(log: typeof activityLogs.$inferSelect) {
  const details = log.details ?? {};
  const snapshot = details.snapshot as Record<string, unknown> | undefined;
  const changedFields = Array.isArray(details.changedFields) ? details.changedFields : [];

  return {
    id: log.id,
    action: log.action,
    studentId: log.studentId,
    studentName: typeof snapshot?.name === 'string' ? snapshot.name : null,
    admissionNumber:
      typeof snapshot?.admissionNumber === 'string' ? snapshot.admissionNumber : null,
    changedFields,
    createdAt: log.createdAt.toISOString(),
  };
}

export async function listLogs(req: AppRequest, res: AppResponse): Promise<void> {
  const query = listQuery.parse(req.query);
  const offset = (query.page - 1) * query.limit;

  const [countResult] = await db.select({ total: count() }).from(activityLogs);
  const total = countResult?.total ?? 0;
  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);

  const rows = await db
    .select()
    .from(activityLogs)
    .orderBy(desc(activityLogs.createdAt))
    .limit(query.limit)
    .offset(offset);

  res.json({
    success: true,
    message: 'OK',
    data: rows.map(formatLog),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    },
  });
}
