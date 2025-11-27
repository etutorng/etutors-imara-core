"use server";

import { db } from "@/db";
import { resources } from "@/db/schema";

export async function getResources() {
    const allResources = await db.query.resources.findMany({
        orderBy: (resources, { desc }) => [desc(resources.createdAt)],
    });
    return allResources;
}
