CREATE TABLE IF NOT EXISTS "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"referred_user_id" uuid NOT NULL,
	"earnings" numeric NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "startups" ADD COLUMN "ref" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ref" text;