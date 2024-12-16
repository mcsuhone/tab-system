-- Add COCKTAIL to the enum
ALTER TYPE "public"."product_category" ADD VALUE 'COCKTAIL';
COMMIT;--> statement-breakpoint

-- Drop columns if they exist
ALTER TABLE "products" DROP COLUMN IF EXISTS "is_open_price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "is_tap_beer";--> statement-breakpoint

-- Insert special products
INSERT INTO "products" (name, category, price, is_special_product)
VALUES 
  ('Tap Beer', 'BEER', 0, true),
  ('Cocktail', 'COCKTAIL', 0, true),
  ('Open Price', 'OTHER', 0, true);