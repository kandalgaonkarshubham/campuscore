CREATE TYPE "public"."activity_action" AS ENUM('CREATED', 'UPDATED', 'DELETED');
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_number" varchar(20) NOT NULL,
	"name" varchar(200) NOT NULL,
	"course" varchar(100) NOT NULL,
	"year" integer NOT NULL,
	"dob" timestamp NOT NULL,
	"email" varchar(255) NOT NULL,
	"mobile" varchar(20) NOT NULL,
	"gender" varchar(20) NOT NULL,
	"address" text NOT NULL,
	"photo_url" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_admission_number_unique" UNIQUE("admission_number")
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"action" "activity_action" NOT NULL,
	"student_id" integer,
	"details" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "students_name_idx" ON "students" USING btree ("name");
--> statement-breakpoint
CREATE INDEX "students_course_idx" ON "students" USING btree ("course");
