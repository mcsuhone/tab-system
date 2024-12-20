CREATE TYPE "public"."product_category" AS ENUM('BEER', 'CIDER', 'LIQUOR', 'GIN', 'VODKA', 'WHISKEY', 'RUM', 'TEQUILA', 'WINE', 'SODA', 'ENERGY_DRINK', 'NON_ALCOHOLIC', 'OTHER');--> statement-breakpoint

CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" "product_category" NOT NULL,
	"price" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" real NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"tab" integer DEFAULT 0 NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "transaction_user_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "transaction_product_idx" ON "transactions" USING btree ("product_id");