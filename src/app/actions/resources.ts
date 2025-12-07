"use server";

import { db } from "@/db";
import { resources } from "@/db/schema/resources";
import { auth } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createResourceSchema = z.object({
    title: z.string().min(1),
    category: z.string().min(1),
    type: z.enum(["article", "pdf", "link"]),
    content: z.string().optional(), // Text for article, URL for others
    language: z.string().default("en"),
});

export async function createResource(data: z.infer<typeof createResourceSchema>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        let url = "";
        let content = null;

        if (data.type === "article") {
            content = data.content;
            url = "#"; // Placeholder or slug
        } else {
            url = data.content || "";
        }

        await db.insert(resources).values({
            title: data.title,
            category: data.category,
            format: data.type,
            url: url,
            content: content,
            language: data.language,
            isMaster: data.language === "en", // Assume EN is master for now based on PRD
        });

        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to create resource:", error);
        return { error: "Failed to create resource" };
    }
}

export async function getResources() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return [];
    }

    const allResources = await db.query.resources.findMany({
        where: eq(resources.isMaster, true),
        orderBy: (resources, { desc }) => [desc(resources.createdAt)],
    });

    return allResources;
}
