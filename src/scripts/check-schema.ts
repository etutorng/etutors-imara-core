
import { db } from "@/db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Checking courses table columns...");
    const result = await db.execute(sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'courses';
  `);

    console.log("Columns found:", result);
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
