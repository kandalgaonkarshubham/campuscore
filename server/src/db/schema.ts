import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const activityActionEnum = pgEnum('activity_action', [
  'CREATED',
  'UPDATED',
  'DELETED',
]);

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const students = pgTable(
  'students',
  {
    id: serial('id').primaryKey(),
    admissionNumber: varchar('admission_number', { length: 20 }).notNull().unique(),
    name: varchar('name', { length: 200 }).notNull(),
    course: varchar('course', { length: 100 }).notNull(),
    year: integer('year').notNull(),
    dob: timestamp('dob', { mode: 'date' }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    mobile: varchar('mobile', { length: 20 }).notNull(),
    gender: varchar('gender', { length: 20 }).notNull(),
    address: text('address').notNull(),
    photoUrl: varchar('photo_url', { length: 500 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('students_name_idx').on(table.name),
    index('students_course_idx').on(table.course),
  ],
);

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  action: activityActionEnum('action').notNull(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'set null' }),
  details: jsonb('details').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const studentsRelations = relations(students, ({ many }) => ({
  activityLogs: many(activityLogs),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  student: one(students, {
    fields: [activityLogs.studentId],
    references: [students.id],
  }),
}));
