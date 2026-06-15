import { eq, ne, and } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { db } from '../db';
import { students } from '../db/schema';
import {
  createStudentSchema,
  parseDob,
  updateStudentSchema,
} from '../schemas/student.schema';
import { logActivity } from '../services/activityLog.service';
import { generateAdmissionNumber } from '../services/admissionNumber.service';
import { AppError } from '../utils/AppError';
import { formatStudent, getChangedFields, studentSnapshot } from '../utils/student';

async function assertUniqueEmail(email: string, excludeId?: number): Promise<void> {
  const conditions = excludeId
    ? and(eq(students.email, email), ne(students.id, excludeId))
    : eq(students.email, email);

  const [existing] = await db.select({ id: students.id }).from(students).where(conditions).limit(1);

  if (existing) {
    throw new AppError('A student with this email already exists', 409);
  }
}

function parseStudentId(id: string): number {
  const studentId = Number(id);
  if (!Number.isInteger(studentId) || studentId <= 0) {
    throw new AppError('Invalid student id', 400);
  }
  return studentId;
}

export async function createStudent(req: Request, res: Response): Promise<void> {
  const input = createStudentSchema.parse(req.body);
  await assertUniqueEmail(input.email);

  const admissionNumber = await generateAdmissionNumber(db);

  const [student] = await db
    .insert(students)
    .values({
      admissionNumber,
      name: input.name,
      course: input.course,
      year: input.year,
      dob: parseDob(input.dob),
      email: input.email,
      mobile: input.mobile,
      gender: input.gender,
      address: input.address,
    })
    .returning();

  await logActivity('CREATED', student.id, {
    changedFields: [],
    snapshot: studentSnapshot(student),
  });

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: formatStudent(student),
  });
}

export async function getStudent(req: Request, res: Response): Promise<void> {
  const studentId = parseStudentId(req.params.id);

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  res.json({
    success: true,
    message: 'Student fetched successfully',
    data: formatStudent(student),
  });
}

export async function updateStudent(req: Request, res: Response): Promise<void> {
  const studentId = parseStudentId(req.params.id);
  const input = updateStudentSchema.parse(req.body);

  const [existing] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!existing) {
    throw new AppError('Student not found', 404);
  }

  await assertUniqueEmail(input.email, studentId);

  const [updated] = await db
    .update(students)
    .set({
      name: input.name,
      course: input.course,
      year: input.year,
      dob: parseDob(input.dob),
      email: input.email,
      mobile: input.mobile,
      gender: input.gender,
      address: input.address,
      updatedAt: new Date(),
    })
    .where(eq(students.id, studentId))
    .returning();

  await logActivity('UPDATED', updated.id, {
    changedFields: getChangedFields(existing, updated),
    snapshot: studentSnapshot(updated),
  });

  res.json({
    success: true,
    message: 'Student updated successfully',
    data: formatStudent(updated),
  });
}

export async function deleteStudent(req: Request, res: Response): Promise<void> {
  const studentId = parseStudentId(req.params.id);

  const [existing] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  if (!existing) {
    throw new AppError('Student not found', 404);
  }

  await db.delete(students).where(eq(students.id, studentId));

  await logActivity('DELETED', null, {
    changedFields: [],
    snapshot: studentSnapshot(existing),
  });

  res.status(204).send();
}
