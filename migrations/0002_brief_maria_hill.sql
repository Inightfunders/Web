ALTER TABLE "partners" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "partners" ALTER COLUMN "id" SET DEFAULT auth.uid();--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "occupation" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "company_name" text;