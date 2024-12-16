ALTER TABLE "users" RENAME COLUMN "tab" TO "balance";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "member_no" text;
UPDATE "users" SET "member_no" = '0';
ALTER TABLE "users" ALTER COLUMN "member_no" SET NOT NULL;