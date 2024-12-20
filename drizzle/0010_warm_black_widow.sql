ALTER TYPE "public"."product_category" ADD VALUE 'OTHER_LIQUOR' BEFORE 'OTHER';--> statement-breakpoint
CREATE TABLE "measurements" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" real NOT NULL,
	"unit" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "measure_id" integer;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_measure_id_measurements_id_fk" FOREIGN KEY ("measure_id") REFERENCES "public"."measurements"("id") ON DELETE no action ON UPDATE no action;