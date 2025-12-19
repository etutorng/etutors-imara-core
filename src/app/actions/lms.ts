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

export async function updateCourse(id: string, data: Partial<z.infer<typeof createCourseSchema>>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await db.transaction(async (tx) => {
            // Update course details
            if (data.title || data.description || data.category || data.thumbnailUrl !== undefined) {
                await tx.update(courses)
                    .set({
                        title: data.title,
                        description: data.description,
                        category: data.category,
                        thumbnailUrl: data.thumbnailUrl || null,
                    })
                    .where(eq(courses.id, id));
            }

            // Update modules if provided
            // Strategy: Delete existing and re-insert (simplest for reordering/updates in this context)
            // Ideally we'd diff, but for MVP this ensures consistency.
            if (data.modules) {
                await tx.delete(modules).where(eq(modules.courseId, id));

                if (data.modules.length > 0) {
                    await tx.insert(modules).values(
                        data.modules.map((mod, index) => ({
                            courseId: id,
                            title: mod.title,
                            videoUrl: mod.videoUrl,
                            duration: mod.duration,
                            order: index + 1,
                        }))
                    );
                }
            }
        });

        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to update course:", error);
        return { error: "Failed to update course" };
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
    // ... existing code ...
    return masterCourses.map(course => ({
        ...course,
        moduleCount: course.modules.length,
    }));
}

export async function getCourses() {
    // Public fetch for all master courses
    const allCourses = await db.query.courses.findMany({
        where: eq(courses.isMaster, true),
        with: {
            modules: {
                orderBy: (modules, { asc }) => [asc(modules.order)],
            },
        },
        orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

    return allCourses.map(course => ({
        ...course,
        moduleCount: course.modules.length,
    }));
}

export async function getCourse(id: string) {
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, id),
        with: {
            modules: {
                orderBy: (modules, { asc }) => [asc(modules.order)],
            },
        },
    });
    return course;
}

export async function deleteCourse(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await db.transaction(async (tx) => {
            await tx.delete(modules).where(eq(modules.courseId, id));
            await tx.delete(courses).where(eq(courses.id, id));
        });

        revalidatePath("/admin/content");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete course:", error);
        return { error: "Failed to delete course" };
    }
}

export async function getAlternateCourse(groupId: string, currentLanguage: string) {
    // Find a course with the same groupId but different language
    // Prefer user's likely alternate (e.g. if en, try ha/local? or just any other)
    // For now, just find ANY other one.
    const alt = await db.query.courses.findFirst({
        where: (courses, { and, eq, ne }) => and(
            eq(courses.groupId, groupId),
            ne(courses.language, currentLanguage)
        ),
    });
    return alt;
}
