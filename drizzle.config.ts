import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './migrations/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
    // database: "postgres",
    // port: 5432,
    // host: "aws-0-ap-south-1.pooler.supabase.com",
    // user: "postgres.user",
    // password: process.env.PW || "",
    database: "postgres",
    port: 5432,
    host: "aws-0-us-east-1.pooler.supabase.com",
    user: "postgres.zaizjasuduohwngmlxil",
    password: process.env.DATABASE_PW || "",
  },
});
