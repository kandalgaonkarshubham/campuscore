import { db } from '../db';
import { activityLogs } from '../db/schema';

type ActivityAction = 'CREATED' | 'UPDATED' | 'DELETED';

export async function logActivity(
  action: ActivityAction,
  studentId: number | null,
  details: Record<string, unknown>,
): Promise<void> {
  await db.insert(activityLogs).values({
    action,
    studentId,
    details,
  });
}
