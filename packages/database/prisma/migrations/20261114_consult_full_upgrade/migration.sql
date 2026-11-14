-- Add STUDENT to Role enum
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'STUDENT';

-- Add student_profile to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "student_profile" JSONB;

-- Create student_verifications table
CREATE TABLE IF NOT EXISTS "student_verifications" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "code_hash" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "verified_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "student_verifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "student_verifications_email_idx" ON "student_verifications"("email");
CREATE INDEX IF NOT EXISTS "student_verifications_expires_at_idx" ON "student_verifications"("expires_at");

-- Add size_bytes & mime_type to StudyDocument
ALTER TABLE "StudyDocument" ADD COLUMN IF NOT EXISTS "size_bytes" INTEGER;
ALTER TABLE "StudyDocument" ADD COLUMN IF NOT EXISTS "mime_type" TEXT;

-- Create catalog_schools table
CREATE TABLE IF NOT EXISTS "catalog_schools" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "flag" TEXT NOT NULL,
  "programs_count" INTEGER NOT NULL DEFAULT 0,
  "tuition" TEXT NOT NULL,
  "popular_programs" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "catalog_schools_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "catalog_schools_country_idx" ON "catalog_schools"("country");

-- Enable Row Level Security (RLS) on new tables
ALTER TABLE "consultation_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "consultants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "student_verifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "catalog_schools" ENABLE ROW LEVEL SECURITY;

