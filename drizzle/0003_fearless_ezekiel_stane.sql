ALTER TABLE "orders" DROP CONSTRAINT "orders_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "invoice" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "item_id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "quantity";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "price";