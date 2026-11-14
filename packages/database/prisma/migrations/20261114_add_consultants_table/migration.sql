-- CreateTable
CREATE TABLE IF NOT EXISTS "consultants" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "specialty" TEXT,
    "photo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "consultants_email_key" ON "consultants"("email");

-- AlterTable
ALTER TABLE "consultation_requests" ADD COLUMN IF NOT EXISTS "consultant_id" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "consultation_requests_consultant_id_idx" ON "consultation_requests"("consultant_id");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "consultation_requests" 
    ADD CONSTRAINT "consultation_requests_consultant_id_fkey" 
    FOREIGN KEY ("consultant_id") REFERENCES "consultants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

