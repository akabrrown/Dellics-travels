-- AlterTable StudyTest
ALTER TABLE "StudyTest" ADD COLUMN IF NOT EXISTS "test_date" TIMESTAMPTZ;

-- CreateTable past_questions
CREATE TABLE IF NOT EXISTS "past_questions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "exam" VARCHAR(50) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "year" INTEGER,
  "file_url" TEXT NOT NULL,
  "resource_type" VARCHAR(20) NOT NULL DEFAULT 'PDF',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_past_questions_exam_active" ON "past_questions"("exam", "is_active");

-- Enable Row Level Security (RLS) on past_questions table
ALTER TABLE "past_questions" ENABLE ROW LEVEL SECURITY;

-- Update master_admin permissions (both dictionary key and array)
UPDATE "AdminRole"
SET permissions = jsonb_set(
  COALESCE(permissions, '{}'::jsonb),
  '{consult.past_questions.manage}',
  'true'::jsonb
)
WHERE id = 'master_admin';

UPDATE "AdminRole"
SET permissions = jsonb_set(
  COALESCE(permissions, '{}'::jsonb),
  '{consult}',
  COALESCE(permissions->'consult', '[]'::jsonb) || '["consult.past_questions.manage"]'::jsonb
)
WHERE id = 'master_admin'
  AND NOT COALESCE(permissions->'consult', '[]'::jsonb) ? 'consult.past_questions.manage';

