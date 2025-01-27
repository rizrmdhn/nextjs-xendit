ALTER TABLE "orders" ALTER COLUMN "external_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "status" varchar(50) NOT NULL;