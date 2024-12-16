CREATE TYPE "public"."user_permission" AS ENUM('default', 'admin');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "permission" "user_permission" DEFAULT 'default' NOT NULL;