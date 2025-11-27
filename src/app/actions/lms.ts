"use server";

import { db } from "@/db";
import { badges, courses, progress, userBadges } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getCourses() {
    const allCourses = await db.query.courses.findMany({
        with: {
            modules: {
                orderBy: (modules, { asc }) => [asc(modules.order)],
            },
        },
    });
    return allCourses;
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

export async function updateProgress(moduleId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Check if already completed
    const existingProgress = await db.query.progress.findFirst({
        where: and(eq(progress.userId, userId), eq(progress.moduleId, moduleId)),
    });

    if (existingProgress?.completed) {
        return { success: true };
    }

    await db.insert(progress).values({
        userId,
        moduleId,
        completed: true,
    }).onConflictDoUpdate({
        target: [progress.userId, progress.moduleId],
        set: { completed: true },
    });

    // Check for badges (Simple logic: Complete 1 module = "First Step" badge)
    // In a real app, this would be more complex.
    const completedCount = await db.$count(progress, eq(progress.userId, userId));

    if (completedCount === 1) {
        const firstStepBadge = await db.query.badges.findFirst({
            where: eq(badges.name, "First Step"),
        });

        if (firstStepBadge) {
            await db.insert(userBadges).values({
                userId,
                badgeId: firstStepBadge.id,
            }).onConflictDoNothing();
        }
    }

    return { success: true };
}

export async function getUserProgress() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return [];
    }

    const userProgress = await db.query.progress.findMany({
        where: eq(progress.userId, session.user.id),
    });

    return userProgress;
}
