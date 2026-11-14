-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "ConsultationStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "consultation_requests" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "current_education" TEXT,
    "desired_degree" TEXT,
    "desired_program" TEXT NOT NULL,
    "preferred_destination" TEXT NOT NULL,
    "target_intake" TEXT,
    "test_status" TEXT,
    "budget_range" TEXT,
    "consultation_mode" TEXT NOT NULL,
    "preferred_date" TEXT,
    "notes" TEXT,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'PENDING',
    "assigned_consultant" JSONB,
    "internal_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "consultation_requests_reference_key" ON "consultation_requests"("reference");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "consultation_requests_reference_idx" ON "consultation_requests"("reference");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "consultation_requests_status_idx" ON "consultation_requests"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "consultation_requests_email_idx" ON "consultation_requests"("email");

