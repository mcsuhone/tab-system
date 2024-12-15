ALTER TYPE "public"."product_category" ADD VALUE 'LONG_DRINK' BEFORE 'CIDER';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" text NOT NULL;