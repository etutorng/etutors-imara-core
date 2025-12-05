CREATE TABLE "system_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_name" text DEFAULT 'Imara' NOT NULL,
	"support_email" text,
	"maintenance_mode" boolean DEFAULT false NOT NULL,
	"allow_registration" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
