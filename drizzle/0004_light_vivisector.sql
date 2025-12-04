ALTER TABLE "resources" ADD COLUMN "group_id" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "thumbnail" text;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "is_master" boolean DEFAULT false NOT NULL;