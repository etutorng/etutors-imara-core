import "dotenv/config";
import { db } from "../db";
import { sql } from "drizzle-orm";

async function migrate() {
    try {
        console.log("Running manual migration...");
        await db.execute(sql`ALTER TABLE "resources" ADD COLUMN IF NOT EXISTS "format" text DEFAULT 'article' NOT NULL;`);
        console.log("Migration successful");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
