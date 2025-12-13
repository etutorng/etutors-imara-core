"use server";

import { db } from "@/db";
import { tickets, evidence, courses, modules, progress, userBadges, messages, mentors } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq, and, desc, count, not, or } from "drizzle-orm";
import { headers } from "next/headers";
import { Scale, GraduationCap, Users, Award } from "lucide-react";

export async function getUserDashboardStats() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null; // Or throw unauthorized
    }

    const userId = session.user.id;

    // 1. Active Cases (Tickets not resolved/closed)
    // Assuming 'closed' or 'resolved' is the final status. Let's assume 'resolved' for now based on typical flows, or just count all for now.
    // Actually, let's just count all tickets for "Active Cases" if status != 'resolved'.
    // Since we don't have a strict enum in schema (it's text), let's just count all for simplicity or verify schema.
    // Schema says: status: text("status").default("pending").notNull()
    const activeCasesCount = await db.select({ count: count() })
        .from(tickets)
        .where(
            and(
                eq(tickets.userId, userId),
                not(eq(tickets.status, "resolved")) // Assuming 'resolved' is the done state
            )
        );

    // 2. Courses in Progress
    // Count unique courses where user has at least one completed module?
    // Or just distinct courseIds from progress table.
    // This is a bit complex with standard Drizzle query builder without distinct count easily in one go.
    // Let's just fetch progress and count unique courses in memory (assuming not huge data).
    const userProgress = await db.query.progress.findMany({
        where: eq(progress.userId, userId),
        with: {
            module: true,
        },
    });
    const coursesInProgress = new Set(userProgress.map(p => p.module.courseId)).size;

    // 3. Badges Earned
    const badgesCount = await db.select({ count: count() })
        .from(userBadges)
        .where(eq(userBadges.userId, userId));

    // 4. Unread Mentor Messages
    const unreadMessagesCount = await db.select({ count: count() })
        .from(messages)
        .where(
            and(
                eq(messages.receiverId, userId),
                eq(messages.read, false)
            )
        );

    // 5. Recent Activity
    // Fetch top items from each category and merge/sort
    const recentTickets = await db.query.tickets.findMany({
        where: eq(tickets.userId, userId),
        limit: 3,
        orderBy: [desc(tickets.createdAt)],
    });

    // For courses, we want the most recent progress
    const recentProgress = await db.query.progress.findMany({
        where: eq(progress.userId, userId),
        with: {
            module: {
                with: {
                    course: true
                }
            }
        },
        limit: 3,
        orderBy: [desc(progress.createdAt)],
    });

    const recentMessages = await db.query.messages.findMany({
        where: eq(messages.receiverId, userId),
        limit: 3,
        orderBy: [desc(messages.createdAt)],
    });

    // Normalize and merge
    const activityFeed = [
        ...recentTickets.map(t => ({
            type: "legal",
            title: `Legal Case: ${t.category}`,
            status: t.status,
            date: t.createdAt,
            icon: "Scale",
            color: "text-accent",
            id: t.id
        })),
        ...recentProgress.map(p => ({
            type: "course",
            title: `Learned: ${p.module.title}`,
            subtitle: p.module.course.title,
            date: p.createdAt,
            icon: "GraduationCap",
            color: "text-primary",
            id: p.id
        })),
        ...recentMessages.map(m => ({
            type: "mentor",
            title: "New Message",
            subtitle: m.content.substring(0, 30) + "...",
            date: m.createdAt,
            icon: "Users",
            color: "text-primary",
            id: m.id
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

    // 6. Learning Progress
    // Overall Progress: (Completed Modules / Total Modules in Started Courses) * 100
    // If no started courses, 0.

    // Get all distinct course IDs the user has started (has progress in)
    const startedCourseIds = Array.from(new Set(userProgress.map(p => p.module.courseId)));

    let overallProgress = 0;
    if (startedCourseIds.length > 0) {
        // Count total modules in these courses
        // We need to fetch modules for these courses.
        // Drizzle `inArray` might be useful if we import it, or just fetch all modules if list is small.
        // Let's assume list is small for now.
        // Actually, let's just query modules where courseId in startedCourseIds.
        // Note: Drizzle's `inArray` needs to be imported from `drizzle-orm`.
        // If not imported, we can do separate queries or a loop (inefficient but works for MVP).
        // Let's rely on importing `inArray` or just fetching all modules and filtering in memory if we assume few courses.
        // Safer to use `inArray`. I will add import for `inArray` if possible, but let's see imports.
        // Imports: `eq, and, desc, count, not, or`
        // I'll assume I can add `inArray` to imports.

        // Wait, I can't easily add import via `replace_file_content` without touching top of file.
        // I will do two edits or just fetch all modules (mock style) but `courses` table has count? No.
        // Let's fetch all modules for now, optimization later.
        const allModules = await db.query.modules.findMany({
            columns: { id: true, courseId: true }
        });
        const totalModulesInStartedCourses = allModules.filter(m => startedCourseIds.includes(m.courseId)).length;
        const totalCompletedModules = userProgress.filter(p => p.completed).length;

        if (totalModulesInStartedCourses > 0) {
            overallProgress = Math.round((totalCompletedModules / totalModulesInStartedCourses) * 100);
        }
    }

    // Weekly Progress: Modules completed in last 7 days vs Target (e.g. 5)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const completedThisWeek = userProgress.filter(p =>
        p.completed && p.createdAt >= oneWeekAgo
    ).length;

    const weeklyTarget = 5; // Arbitrary target
    const weeklyProgress = Math.min(Math.round((completedThisWeek / weeklyTarget) * 100), 100);


    return {
        stats: {
            activeCases: activeCasesCount[0].count,
            coursesInProgress: coursesInProgress,
            badgesEarned: badgesCount[0].count,
            mentorMessages: unreadMessagesCount[0].count,
        },
        recentActivity: activityFeed,
        learningProgress: {
            overall: overallProgress,
            thisWeek: weeklyProgress
        }
    };
}
