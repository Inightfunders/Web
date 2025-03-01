CREATE TABLE IF NOT EXISTS "financial_projection" (
	"id" bigint PRIMARY KEY NOT NULL,
	"startup_id" bigint,
	"name" text,
	"document_link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "financial_projection" ADD CONSTRAINT "financial_projection_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
