CREATE TABLE IF NOT EXISTS "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" bigint NOT NULL,
	"referred_user_id" uuid DEFAULT NULL,
	"earnings" numeric NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "partners" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "partners" ALTER COLUMN "id" SET DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "occupation" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "company_name" text;--> statement-breakpoint
ALTER TABLE "startups" ADD COLUMN "ref" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ref" text;