"use server";

import { db } from "@/db";
import { resources } from "@/db/schema/resources";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createResource(data: {
    title: string;
    description?: string;
    url: string;
    category: string;
    format: string;
    language: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const role = (session.user as any).role;
    if (role !== "SUPER_ADMIN" && role !== "CONTENT_EDITOR") {
        throw new Error("Forbidden");
    }

    await db.insert(resources).values({
        title: data.title,
        description: data.description,
        url: data.url,
        category: data.category,
        format: data.format,
        language: data.language,
    });

    revalidatePath("/admin/content");
}
