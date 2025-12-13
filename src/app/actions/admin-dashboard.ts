"use server";

import { db } from "@/db";
import { user } from "@/db/schema/auth/user";
import { tickets } from "@/db/schema/legal";
import { courses, modules } from "@/db/schema/lms";
import { resources } from "@/db/schema/resources";
import { auth } from "@/lib/auth/server";
import { count, eq, sql, desc, and, not } from "drizzle-orm";
import { headers } from "next/headers";

export async function getAdminDashboardStats() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const role = (session.user as any).role;

    const stats = {
        totalUsers: 0,
        activeCases: 0,
        totalCourses: 0,
        pendingApprovals: 0, // Placeholder for now, maybe pending tickets or content reviews
        missingTranslations: 0,
        myActiveCases: 0,
        pendingRequests: 0,
        resolvedCases: 0,
    };

    if (role === "SUPER_ADMIN") {
        // Total Users
        const usersCount = await db.select({ count: count() }).from(user);
        stats.totalUsers = usersCount[0].count;

        // Active Legal Cases (not resolved)
        const casesCount = await db.select({ count: count() })
            .from(tickets)
            .where(not(eq(tickets.status, "resolved")));
        stats.activeCases = casesCount[0].count;

        // Total Courses (Master only)
        const coursesCount = await db.select({ count: count() })
            .from(courses)
            .where(eq(courses.isMaster, true));
        stats.totalCourses = coursesCount[0].count;

        // Pending Approvals (e.g. pending tickets)
        const pendingTickets = await db.select({ count: count() })
            .from(tickets)
            .where(eq(tickets.status, "pending"));
        stats.pendingApprovals = pendingTickets[0].count;
    }
    else if (role === "CONTENT_EDITOR") {
        // Total Courses Uploaded
        const coursesCount = await db.select({ count: count() })
            .from(courses)
            .where(eq(courses.isMaster, true));
        stats.totalCourses = coursesCount[0].count;

        // Missing Translations (Courses with isMaster=true but no linked course in other active languages? Simplified: Just count all master courses for now or mock)
        // Let's count resources instead for variety
        const resourcesCount = await db.select({ count: count() }).from(resources);

        // Let's reuse "Active Cases" field for "Total Resources"
        stats.activeCases = resourcesCount[0].count;

        // Pending Approvals -> maybe Draft content?
        stats.pendingApprovals = 0;
    }
    else if (role === "LEGAL_PARTNER") {
        // My Active Cases
        // Ideally tickets assigned to this user, but we don't have assignment logic fully yet or it's just by category?
        // Let's assume all active tickets for now or filter if we had an 'assignedTo' field.
        // The schema has `userId` (creator). It doesn't seem to have `assignedTo`.
        // So we'll just show All Active Cases for now.
        const casesCount = await db.select({ count: count() })
            .from(tickets)
            .where(not(eq(tickets.status, "resolved")));
        stats.myActiveCases = casesCount[0].count;

        const pendingCount = await db.select({ count: count() })
            .from(tickets)
            .where(eq(tickets.status, "pending"));
        stats.pendingRequests = pendingCount[0].count;

        const resolvedCount = await db.select({ count: count() })
            .from(tickets)
            .where(eq(tickets.status, "resolved"));
        stats.resolvedCases = resolvedCount[0].count;
    }

    return stats;
}

export async function getRecentSystemActivity() {
    // Fetch recent users and tickets to mix into an activity feed
    const recentUsers = await db.query.user.findMany({
        limit: 5,
        orderBy: [desc(user.createdAt)],
    });

    const recentTickets = await db.query.tickets.findMany({
        limit: 5,
        orderBy: [desc(tickets.createdAt)],
    });

    // Merge and format
    const activities = [
        ...recentUsers.map(u => ({
            user: u.name,
            action: "registered an account",
            date: u.createdAt,
            type: "user"
        })),
        ...recentTickets.map(t => ({
            user: "User", // We'd need to fetch the user name if we want it, or just say "A user"
            action: `submitted legal ticket: ${t.category}`,
            date: t.createdAt,
            type: "ticket"
        }))
    ].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    }).slice(0, 5);

    return activities;
}
