import { and, count, desc, eq, ilike, ne, type SQL } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { db } from '../db';
import { students } from '../db/schema';
import {
  createStudentSchema,
  parseDob,
  updateStudentSchema,
} from '../schemas/student.schema';
import { listStudentsQuerySchema } from '../schemas/studentList.schema';
import { logActivity } from '../services/activityLog.service';
import { generateAdmissionNumber } from '../services/admissionNumber.service';
import { AppError } from '../utils/AppError';
import { deletePhotoFile, toPhotoUrl } from '../utils/photo';
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

function parseStudentId(id: string | string[]): number {
  const raw = Array.isArray(id) ? id[0] : id;
  const studentId = Number(raw);
  if (!Number.isInteger(studentId) || studentId <= 0) {
    throw new AppError('Invalid student id', 400);
  }
  return studentId;
}

function buildListFilters(query: ReturnType<typeof listStudentsQuerySchema.parse>): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.search) {
    conditions.push(ilike(students.name, `%${query.search}%`));
  }
  if (query.course) {
    conditions.push(eq(students.course, query.course));
  }
  if (query.year !== undefined) {
    conditions.push(eq(students.year, query.year));
  }
  if (query.gender) {
    conditions.push(eq(students.gender, query.gender));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function listStudents(req: Request, res: Response): Promise<void> {
  const query = listStudentsQuerySchema.parse(req.query);
  const where = buildListFilters(query);
  const offset = (query.page - 1) * query.limit;

  const [countResult] = await db
    .select({ total: count() })
    .from(students)
    .where(where);

  const total = countResult?.total ?? 0;
  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);

  const rows = await db
    .select()
    .from(students)
    .where(where)
    .orderBy(desc(students.createdAt))
    .limit(query.limit)
    .offset(offset);

  res.json({
    success: true,
    message: 'Students fetched successfully',
    data: rows.map(formatStudent),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
    },
  });
}

export async function getStudentsMeta(_req: Request, res: Response): Promise<void> {
  const courseRows = await db
    .selectDistinct({ course: students.course })
    .from(students)
    .orderBy(students.course);

  const yearRows = await db
    .selectDistinct({ year: students.year })
    .from(students)
    .orderBy(students.year);

  res.json({
    success: true,
    message: 'Student filters fetched successfully',
    data: {
      courses: courseRows.map((row) => row.course),
      years: yearRows.map((row) => row.year),
    },
  });
}

export async function createStudent(req: Request, res: Response): Promise<void> {
  const input = createStudentSchema.parse(req.body);
  await assertUniqueEmail(input.email);

  const admissionNumber = await generateAdmissionNumber(db);
  const photoUrl = req.file ? toPhotoUrl(req.file.filename) : null;

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
      photoUrl,
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

  const photoUrl = req.file ? toPhotoUrl(req.file.filename) : existing.photoUrl;

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
      photoUrl,
      updatedAt: new Date(),
    })
    .where(eq(students.id, studentId))
    .returning();

  if (req.file && existing.photoUrl && existing.photoUrl !== photoUrl) {
    deletePhotoFile(existing.photoUrl);
  }

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
  deletePhotoFile(existing.photoUrl);

  await logActivity('DELETED', null, {
    changedFields: [],
    snapshot: studentSnapshot(existing),
  });

  res.status(204).send();
}
