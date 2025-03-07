ALTER TABLE "referrals" ALTER COLUMN "partner_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "referrals" ALTER COLUMN "referred_user_id" SET DEFAULT NULL;--> statement-breakpoint
ALTER TABLE "referrals" ALTER COLUMN "referred_user_id" DROP NOT NULL;