CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(150) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "session_id_idx" ON "sessions" USING btree ("id");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "user_idx" ON "users" USING btree ("id");