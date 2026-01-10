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
    type: z.enum(["article", "pdf", "link", "video"]),
    content: z.string().optional(), // Text for article, URL for others
    language: z.string().default("en"),
    // New fields
    videoUrl: z.string().optional(),
    duration: z.string().optional(),
    authorId: z.string().optional(),
});

export async function createResource(data: z.infer<typeof createResourceSchema>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "CONTENT_EDITOR") {
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
            isMaster: data.language === "en",
            // New fields
            videoUrl: data.videoUrl,
            duration: data.duration,
            authorId: data.authorId,
        });

        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to create resource:", error);
        return { error: "Failed to create resource" };
    }
}

export async function updateResource(id: string, data: any) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "CONTENT_EDITOR") {
        return { error: "Unauthorized" };
    }

    try {
        await db.update(resources)
            .set({
                title: data.title,
                category: data.category,
                format: data.type,
                content: data.type === "article" ? data.content : null,
                url: data.type !== "article" && data.type !== "video" ? data.url : "#",
                language: data.language,
                videoUrl: data.videoUrl,
                duration: data.duration,
                authorId: data.authorId,
            })
            .where(eq(resources.id, id));

        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to update resource:", error);
        return { error: "Failed to update resource" };
    }
}

export async function getResources() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "CONTENT_EDITOR") {
        return [];
    }

    const allResources = await db.query.resources.findMany({
        orderBy: (resources, { desc }) => [desc(resources.createdAt)],
    });

    return allResources;
}

export async function getCounsellorResources(counsellorId: string) {
    try {
        const videos = await db.query.resources.findMany({
            where: (resources, { eq, and }) => and(
                eq(resources.authorId, counsellorId),
                eq(resources.format, "video")
            ),
            orderBy: (resources, { desc }) => [desc(resources.createdAt)],
        });
        return videos;
    } catch (error) {
        console.error("Failed to fetch counsellor resources:", error);
        return [];
    }
}
