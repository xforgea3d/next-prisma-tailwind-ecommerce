-- Add fullName and title to Address table
-- Run manually: npx prisma db execute --file prisma/migrations/manual_address_fields.sql
ALTER TABLE "Address" ADD COLUMN IF NOT EXISTS "fullName" TEXT;
ALTER TABLE "Address" ADD COLUMN IF NOT EXISTS "title" TEXT;
