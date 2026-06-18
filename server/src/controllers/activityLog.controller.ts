import { count, desc } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { db } from '../db';
import { activityLogs } from '../db/schema';
import { listActivityLogsQuerySchema } from '../schemas/activityLog.schema';

function formatActivityLog(log: typeof activityLogs.$inferSelect) {
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

export async function listActivityLogs(req: Request, res: Response): Promise<void> {
  const query = listActivityLogsQuerySchema.parse(req.query);
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
    message: 'Activity logs fetched successfully',
    data: rows.map(formatActivityLog),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    },
  });
}
