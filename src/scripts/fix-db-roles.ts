import "dotenv/config";
import { db } from "@/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("🔧 Fixing user roles in database...");

    try {
        // Update 'user' to 'USER'
        await db.execute(sql`UPDATE "user" SET "role" = 'USER' WHERE "role" = 'user'`);
        console.log("✅ Updated 'user' roles to 'USER'");

        // Update 'member' to 'USER' (just in case)
        await db.execute(sql`UPDATE "user" SET "role" = 'USER' WHERE "role" = 'member'`);
        console.log("✅ Updated 'member' roles to 'USER'");

        console.log("🎉 Data fixed. You can now run the migration.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Failed to fix data:", err);
        process.exit(1);
    }
}

main();
