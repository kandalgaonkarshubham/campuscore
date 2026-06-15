import type { students } from '../db/schema';

export type StudentRow = typeof students.$inferSelect;

export function formatStudent(student: StudentRow) {
  return {
    id: student.id,
    admissionNumber: student.admissionNumber,
    name: student.name,
    course: student.course,
    year: student.year,
    dob: student.dob.toISOString().split('T')[0],
    email: student.email,
    mobile: student.mobile,
    gender: student.gender,
    address: student.address,
    photoUrl: student.photoUrl,
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  };
}

export function studentSnapshot(student: StudentRow) {
  return {
    admissionNumber: student.admissionNumber,
    name: student.name,
    course: student.course,
    year: student.year,
    dob: student.dob.toISOString().split('T')[0],
    email: student.email,
    mobile: student.mobile,
    gender: student.gender,
    address: student.address,
    photoUrl: student.photoUrl,
  };
}

const TRACKED_FIELDS = [
  'name',
  'course',
  'year',
  'dob',
  'email',
  'mobile',
  'gender',
  'address',
  'photoUrl',
] as const;

export function getChangedFields(
  before: StudentRow,
  after: StudentRow,
): string[] {
  const changed: string[] = [];

  for (const field of TRACKED_FIELDS) {
    if (field === 'dob') {
      if (before.dob.toISOString() !== after.dob.toISOString()) {
        changed.push(field);
      }
      continue;
    }

    if (before[field] !== after[field]) {
      changed.push(field);
    }
  }

  return changed;
}
