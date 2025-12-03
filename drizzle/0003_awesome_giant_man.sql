CREATE TYPE "public"."user_role" AS ENUM('SUPER_ADMIN', 'CONTENT_EDITOR', 'LEGAL_PARTNER', 'COUNSELLOR', 'USER');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "full_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "gender_self_attested" boolean DEFAULT false;