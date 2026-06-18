import { count } from 'drizzle-orm';
import { db } from '../db';
import { students } from '../db/schema';
import type { AppRequest, AppResponse } from '../types/http';

export async function getOverview(_req: AppRequest, res: AppResponse): Promise<void> {
  const [totalResult] = await db.select({ total: count() }).from(students);
  const totalStudents = totalResult?.total ?? 0;

  const genderRows = await db
    .select({ gender: students.gender, count: count() })
    .from(students)
    .groupBy(students.gender);

  const genderRatio = { male: 0, female: 0, other: 0 };
  for (const row of genderRows) {
    if (row.gender in genderRatio) {
      genderRatio[row.gender as keyof typeof genderRatio] = row.count;
    }
  }

  const courseRows = await db
    .select({ course: students.course, count: count() })
    .from(students)
    .groupBy(students.course)
    .orderBy(students.course);

  res.json({
    success: true,
    message: 'OK',
    data: {
      totalStudents,
      genderRatio,
      courseWiseCount: courseRows.map((row) => ({
        course: row.course,
        count: row.count,
      })),
    },
  });
}
