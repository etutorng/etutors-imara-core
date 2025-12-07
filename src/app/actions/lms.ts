"use server";

import { db } from "@/db";
import { courses, modules } from "@/db/schema/lms";
import { auth } from "@/lib/auth/server";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCourseSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    thumbnailUrl: z.string().url().optional().or(z.literal("")),
    modules: z.array(z.object({
        title: z.string().min(1),
        videoUrl: z.string().url(),
        duration: z.number().default(0),
    })),
});

export async function createCourse(data: z.infer<typeof createCourseSchema>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await db.transaction(async (tx) => {
            const [course] = await tx.insert(courses).values({
                title: data.title,
                description: data.description,
                category: data.category,
                thumbnailUrl: data.thumbnailUrl || null,
                language: "en",
                isMaster: true,
            }).returning();

            if (data.modules.length > 0) {
                await tx.insert(modules).values(
                    data.modules.map((mod, index) => ({
                        courseId: course.id,
                        title: mod.title,
                        videoUrl: mod.videoUrl,
                        duration: mod.duration,
                        order: index + 1,
                    }))
                );
            }
        });

        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to create course:", error);
        return { error: "Failed to create course" };
    }
}

export async function getVocationalCourses() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return [];
    }

    // Fetch master courses with module count
    // Drizzle doesn't support count aggregation in query builder easily with relations yet in a single simple call without raw sql or separate queries usually.
    // But we can use `db.query` and map.

    const masterCourses = await db.query.courses.findMany({
        where: eq(courses.isMaster, true),
        with: {
            modules: true,
        },
        orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

    return masterCourses.map(course => ({
        ...course,
        moduleCount: course.modules.length,
    }));
}
