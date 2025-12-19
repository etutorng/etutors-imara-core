"use server";

import { db } from "@/db";
import { user } from "@/db/schema/auth/user";
import { tickets } from "@/db/schema/legal";
import { courses, modules } from "@/db/schema/lms";
import { resources } from "@/db/schema/resources";
import { counsellingSessions } from "@/db/schema/counselling";
import { auth } from "@/lib/auth/server";
import { count, eq, sql, desc, and, not, or } from "drizzle-orm";
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
        // ... existing LEGAL_PARTNER logic ...
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
    else if (role === "COUNSELLOR") {
        // My Active Sessions (Active + Pending)
        const activeSessions = await db.select({ count: count() })
            .from(counsellingSessions)
            .where(and(
                eq(counsellingSessions.counsellorId, session.user.id),
                eq(counsellingSessions.status, "ACTIVE")
            ));
        stats.myActiveCases = activeSessions[0].count; // Reusing field for Active Sessions

        const pendingRequests = await db.select({ count: count() })
            .from(counsellingSessions)
            .where(and(
                eq(counsellingSessions.counsellorId, session.user.id),
                eq(counsellingSessions.status, "PENDING")
            ));
        stats.pendingRequests = pendingRequests[0].count;

        const totalSessions = await db.select({ count: count() })
            .from(counsellingSessions)
            .where(eq(counsellingSessions.counsellorId, session.user.id));
        stats.resolvedCases = totalSessions[0].count; // Reusing field for Total Sessions
    }

    return stats;
}

export async function getRecentSystemActivity() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return [];
    }

    const role = (session.user as any).role;
    let activities: any[] = [];

    // SUPER_ADMIN sees everything (Users + Tickets + Counselling Requests)
    // COUNSELLOR sees Counselling Requests + Their Sessions
    // LEGAL_PARTNER sees Legal Tickets
    // CONTENT_EDITOR sees Content updates (or just generic for now)

    if (role === "SUPER_ADMIN" || role === "COUNSELLOR") {
        // Fetch recent Counselling Requests
        const recentSessions = await db.query.counsellingSessions.findMany({
            limit: 5,
            orderBy: [desc(counsellingSessions.createdAt)],
            with: { user: true }
        });

        activities.push(...recentSessions.map(s => ({
            user: s.user.name,
            action: s.status === "PENDING" ? "requested counselling" : `counselling session ${s.status.toLowerCase()}`,
            date: s.createdAt,
            type: "counselling",
            roleAccess: ["SUPER_ADMIN", "COUNSELLOR"]
        })));
    }

    if (role === "SUPER_ADMIN" || role === "LEGAL_PARTNER") {
        // Fetch tickets
        const recentTickets = await db.query.tickets.findMany({
            limit: 5,
            orderBy: [desc(tickets.createdAt)],
        });
        activities.push(...recentTickets.map(t => ({
            user: "User",
            action: `submitted legal ticket: ${t.category}`,
            date: t.createdAt,
            type: "ticket",
            roleAccess: ["SUPER_ADMIN", "LEGAL_PARTNER"]
        })));
    }

    if (role === "SUPER_ADMIN") {
        const recentUsers = await db.query.user.findMany({
            limit: 5,
            orderBy: [desc(user.createdAt)],
        });
        activities.push(...recentUsers.map(u => ({
            user: u.name,
            action: "registered an account",
            date: u.createdAt,
            type: "user",
            roleAccess: ["SUPER_ADMIN"]
        })));
    }

    // Filter final list just in case (though we fetched based on role)
    // And Sort
    return activities
        .filter(a => a.roleAccess.includes(role)) // Double check
        .sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 5);
}
