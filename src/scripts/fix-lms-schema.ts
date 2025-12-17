
import 'dotenv/config'; // Load env vars
import { db } from "@/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Attempting to fix courses table schema...");

    try {
        await db.execute(sql`
        ALTER TABLE "courses" 
        ADD COLUMN IF NOT EXISTS "group_id" UUID DEFAULT gen_random_uuid() NOT NULL,
        ADD COLUMN IF NOT EXISTS "language" TEXT DEFAULT 'en' NOT NULL,
        ADD COLUMN IF NOT EXISTS "is_master" BOOLEAN DEFAULT false NOT NULL;
      `);
        console.log("Successfully altered table courses.");
    } catch (err) {
        console.error("Error altering table:", err);
    }

    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
