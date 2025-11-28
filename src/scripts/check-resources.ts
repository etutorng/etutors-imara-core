import "dotenv/config";
import { db } from "../db";
import { resources } from "../db/schema/resources";

async function checkResources() {
    const all = await db.select().from(resources);
    console.log("Current Resources in DB:");
    console.log(JSON.stringify(all, null, 2));
    process.exit(0);
}

checkResources();
