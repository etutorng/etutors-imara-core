"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { resources } from "@/db/schema/resources";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function createResource(data: {
    title: string;
    description: string;
    category: string;
    format: string;
    language: string;
    url: string;
    groupId?: string;
    isMaster?: boolean;
    thumbnail?: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role === "USER") {
        return { error: "Unauthorized" };
    }

    try {
        const groupId = data.groupId || uuidv4();
        const isMaster = data.isMaster ?? (data.language === "en");

        await db.insert(resources).values({
            title: data.title,
            description: data.description,
            category: data.category,
            format: data.format,
            language: data.language,
            url: data.url,
            groupId: groupId,
            isMaster: isMaster,
            thumbnail: data.thumbnail,
        });

        revalidatePath("/admin/content");
        return { success: true, groupId };
    } catch (error) {
        console.error("Failed to create resource:", error);
        return { error: "Failed to create resource" };
    }
}

export async function upsertResourceTranslation(data: {
    groupId: string;
    language: string;
    title: string;
    description: string;
    url: string;
    category: string;
    format: string;
    thumbnail?: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role === "USER") {
        return { error: "Unauthorized" };
    }

    try {
        // Check if translation exists
        const existing = await db.query.resources.findFirst({
            where: and(
                eq(resources.groupId, data.groupId),
                eq(resources.language, data.language)
            ),
        });

        if (existing) {
            await db.update(resources)
                .set({
                    title: data.title,
                    description: data.description,
                    url: data.url,
                    thumbnail: data.thumbnail,
                })
                .where(eq(resources.id, existing.id));
        } else {
            await db.insert(resources).values({
                groupId: data.groupId,
                language: data.language,
                title: data.title,
                description: data.description,
                url: data.url,
                category: data.category,
                format: data.format,
                isMaster: false, // Translations are never master unless explicitly set (which we handle in create)
                thumbnail: data.thumbnail,
            });
        }

        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to upsert translation:", error);
        return { error: "Failed to save translation" };
    }
}
