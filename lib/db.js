import { neon } from "@neondatabase/serverless";

if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
