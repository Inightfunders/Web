DO $$ BEGIN
 CREATE TYPE "public"."aal_level" AS ENUM('aal1', 'aal2', 'aal3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."action" AS ENUM('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."business_structure" AS ENUM('Sole Proprietorship', 'Partnership', 'Corporation', 'S Corporation', 'Limited Liability Company');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."code_challenge_method" AS ENUM('s256', 'plain');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."company_stage" AS ENUM('Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Series E', 'Series F', 'Public');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."equality_op" AS ENUM('eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."factor_status" AS ENUM('unverified', 'verified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."factor_type" AS ENUM('totp', 'webauthn', 'phone');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."faqs_tabs" AS ENUM('General Questions', 'For Startups', 'For Investors');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."future_investment_amounts" AS ENUM('Less than $250K', '$250K - $1M', 'S1M - $5M', '$5M+', 'Not sure');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."geographies_served" AS ENUM('United States', 'Canada', 'Mexico', 'United Kingdom', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."industry_and_sector" AS ENUM('Technology', 'Healthcare', 'Financial Services', 'Consumer Goods', 'Industrial Goods', 'Energy', 'Real Estate', 'Retail', 'Media and Entertainment', 'Transportation', 'Telecommunications', 'Agriculture', 'Education', 'Hospitality and Leisure', 'Utilities', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."institution_types" AS ENUM('Corporation', 'Family Office', 'Fund', 'Registered Investment Advisor (RIA)', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."investor_type" AS ENUM('Individual', 'Institution');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."key_status" AS ENUM('default', 'valid', 'invalid', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."key_type" AS ENUM('aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."max_facility_size" AS ENUM('N/A', '<$1M', '$1-10M', '$10-50M', '$50-250M', '$250M+');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."minimum_revenue_requirement" AS ENUM('N/A', '<$1M', '$1-10M', '$10-50M', '$50-100M', '$100M+');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."notification_type" AS ENUM('Contract', 'Request', 'Payment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."one_time_token_type" AS ENUM('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_interval" AS ENUM('week', 'month', 'quarter', 'year');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_status" AS ENUM('Paid', 'Due', 'Pending');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."products_offered" AS ENUM('Venture Debt', 'Asset-Based Lending', 'Warehouse Lending', 'Invoice and Contract Factoring', 'Revenue-Based Financing', 'Equipment Leasing', 'M&A', 'Recapitalizations and Refinancing', 'Buyouts', 'Bridge Loans', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('startup', 'investor', 'partner');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bank_accounts" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"bank_id" text,
	"account_id" text,
	"access_token" text,
	"funding_source_url" text,
	"shareable_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cap_tables" (
	"id" bigint PRIMARY KEY NOT NULL,
	"startup_id" bigint,
	"name" text,
	"document_link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contracts" (
	"id" bigint PRIMARY KEY NOT NULL,
	"investor_id" bigint NOT NULL,
	"startup_id" bigint NOT NULL,
	"amount_invested" numeric NOT NULL,
	"interest_rate" numeric,
	"accepted" boolean NOT NULL,
	"total_return_paid" numeric,
	"maturity_date" date,
	"payment_interval" "payment_interval",
	"createdAt" timestamp with time zone DEFAULT now(),
	"term_sheet" text,
	"investment_amount_paid" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faqs" (
	"id" bigint PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text,
	"tab" "faqs_tabs"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financial_details_requests" (
	"id" bigint PRIMARY KEY NOT NULL,
	"startup_id" bigint NOT NULL,
	"investor_id" bigint,
	"accepted" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financial_rounds" (
	"id" bigint PRIMARY KEY NOT NULL,
	"investor" text[] NOT NULL,
	"round" "company_stage",
	"date" date,
	"amount" numeric,
	"startup_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "financial_statements" (
	"id" bigint PRIMARY KEY NOT NULL,
	"startup_id" bigint,
	"name" text,
	"document_link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "investors" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"submitted" boolean DEFAULT false,
	"company_email" text,
	"company_name" text,
	"company_website" text,
	"minimum_revenue_requirement" "minimum_revenue_requirement",
	"max_facility_size" "max_facility_size",
	"products_offered" products_offered[],
	"geographies_served" geographies_served[],
	"investor_type" "investor_type",
	"future_investment_amount" "future_investment_amounts",
	"institution_type" "institution_types",
	"accreditation" text,
	CONSTRAINT "investors_id_key" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "legal_documents" (
	"id" bigint PRIMARY KEY NOT NULL,
	"startup_id" bigint,
	"name" text,
	"document_link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid,
	"type" "notification_type",
	"content" text,
	"is_read" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "partners" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"partner_name" text,
	CONSTRAINT "partners_id_key" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" timestamp with time zone,
	"status" "payment_status",
	"contract_id" bigint,
	"amount" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pitch_decks" (
	"id" bigint PRIMARY KEY NOT NULL,
	"startup_id" bigint,
	"name" text,
	"document_link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "startups" (
	"id" bigint PRIMARY KEY NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"company_name" text,
	"business_structure" "business_structure",
	"EIN" text,
	"phone_number" text,
	"email" text,
	"address" text,
	"industry_sector" "industry_and_sector",
	"other_industry_and_sector" text,
	"submitted" boolean DEFAULT false NOT NULL,
	"recent_raise" numeric,
	"stage" "company_stage",
	CONSTRAINT "startups_id_key" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "startups_owners" (
	"id" bigint PRIMARY KEY NOT NULL,
	"startup_id" bigint NOT NULL,
	"name" text,
	"share" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tax_returns" (
	"id" bigint PRIMARY KEY NOT NULL,
	"startup_id" bigint,
	"name" text,
	"document_link" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sender_id" uuid,
	"receiver_id" uuid,
	"amount" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT auth.uid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"role" "user_role",
	"dwolla_customer_url" text,
	"dwolla_customer_id" text,
	"plaid_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cap_tables" ADD CONSTRAINT "cap_tables_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contracts" ADD CONSTRAINT "contracts_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contracts" ADD CONSTRAINT "contracts_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "financial_details_requests" ADD CONSTRAINT "financial_details_requests_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "financial_details_requests" ADD CONSTRAINT "financial_details_requests_investor_id_investors_id_fk" FOREIGN KEY ("investor_id") REFERENCES "public"."investors"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "financial_rounds" ADD CONSTRAINT "financial_rounds_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "financial_statements" ADD CONSTRAINT "financial_statements_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "investors" ADD CONSTRAINT "investors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "legal_documents" ADD CONSTRAINT "legal_documents_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partners" ADD CONSTRAINT "partners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pitch_decks" ADD CONSTRAINT "pitch_decks_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "startups" ADD CONSTRAINT "startups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "startups_owners" ADD CONSTRAINT "startups_owners_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tax_returns" ADD CONSTRAINT "tax_returns_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_id_idx" ON "users" USING btree ("id");