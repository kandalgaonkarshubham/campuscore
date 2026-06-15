import { desc, like, sql } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { students } from '../db/schema';

type Db = PostgresJsDatabase<typeof schema>;

export async function generateAdmissionNumber(db: Db): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `ADM-${year}-`;

  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${year})`);

    const [latest] = await tx
      .select({ admissionNumber: students.admissionNumber })
      .from(students)
      .where(like(students.admissionNumber, `${prefix}%`))
      .orderBy(desc(students.admissionNumber))
      .limit(1);

    let sequence = 1;
    if (latest) {
      const parts = latest.admissionNumber.split('-');
      const lastSequence = Number(parts[2]);
      if (!Number.isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }

    const admissionNumber = `${prefix}${String(sequence).padStart(4, '0')}`;
    return admissionNumber;
  });
}
