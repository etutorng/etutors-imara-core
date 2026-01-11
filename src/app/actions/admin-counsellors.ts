"use server";

import { db } from "@/db";
import { user } from "@/db/schema/auth/user";
import { counsellingSessions } from "@/db/schema/counselling";
import { auth } from "@/lib/auth/server";
import { eq, and, desc, sql, like, or } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getAdminCounsellors({ page = 1, limit = 10, search = "" }: { page?: number; limit?: number; search?: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "CONTENT_EDITOR") {
        // Adjust RBAC as needed - assume SUPER_ADMIN and CONTENT_EDITOR (or maybe separate admin role)
        return { error: "Unauthorized", counsellors: [], total: 0, totalPages: 0 };
    }

    const offset = (page - 1) * limit;

    let whereClause = and(
        eq(user.role, "COUNSELLOR"),
        search ? or(
            like(user.name, `%${search}%`),
            like(user.email, `%${search}%`)
        ) : undefined
    );

    try {
        // Get total count
        const [countResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(user)
            .where(whereClause);

        const total = Number(countResult.count);
        const totalPages = Math.ceil(total / limit);

        // Fetch Counsellors with basic info
        const counsellors = await db.query.user.findMany({
            where: whereClause,
            limit: limit,
            offset: offset,
            orderBy: desc(user.createdAt),
            columns: {
                id: true,
                name: true,
                email: true,
                image: true,
                isActive: true,
                bio: true,
                specialization: true,
                createdAt: true,
            },
            with: {
                // Ideally we want to aggregate sessions here, but Drizzle relation aggregation is tricky in query builder
                // We might need a separate raw query or client-side aggregation if volume is low.
                // For "Industry Standard" efficiency, let's do a separate query to fetch stats for these users.
            }
        });

        // Enrich with stats
        // This acts as a N+1 query but for pagination of 10 it's acceptable vs complex SQL join
        // Or we could group by counsellorId in sessions table.
        const enrichedCounsellors = await Promise.all(counsellors.map(async (c) => {
            const [activeSessions] = await db
                .select({ count: sql<number>`count(*)` })
                .from(counsellingSessions)
                .where(and(
                    eq(counsellingSessions.counsellorId, c.id),
                    eq(counsellingSessions.status, "ACTIVE")
                ));

            const [totalSessions] = await db
                .select({ count: sql<number>`count(*)` })
                .from(counsellingSessions)
                .where(eq(counsellingSessions.counsellorId, c.id));

            return {
                ...c,
                stats: {
                    activeCases: Number(activeSessions.count),
                    totalCases: Number(totalSessions.count),
                    rating: 5.0 // Placeholder
                }
            };
        }));

        return { counsellors: enrichedCounsellors, total, totalPages };

    } catch (error) {
        console.error("Failed to fetch admin counsellors:", error);
        return { error: "Failed to fetch counsellors", counsellors: [], total: 0, totalPages: 0 };
    }
}

export async function updateCounsellorStatus(counsellorId: string, isActive: boolean) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await db.update(user)
            .set({ isActive, updatedAt: new Date() })
            .where(eq(user.id, counsellorId));

        revalidatePath("/admin/counsellors");
        revalidatePath("/counselling");
        revalidatePath(`/counselling/${counsellorId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to update status" };
    }
}

export async function adminUpdateCounsellorProfile(counsellorId: string, data: { bio?: string, specialization?: string, experience?: string, featuredVideo?: string, image?: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await db.update(user)
            .set({
                bio: data.bio,
                specialization: data.specialization,
                experience: data.experience,
                featuredVideo: data.featuredVideo,
                image: data.image,
                updatedAt: new Date()
            })
            .where(eq(user.id, counsellorId));

        revalidatePath("/admin/counsellors");
        revalidatePath(`/admin/counsellors/${counsellorId}`);
        revalidatePath("/counselling");
        revalidatePath(`/counselling/${counsellorId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to update profile" };
    }
}

export async function getAdminCounsellorById(counsellorId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role !== "SUPER_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const counsellor = await db.query.user.findFirst({
            where: eq(user.id, counsellorId),
            columns: {
                id: true,
                name: true,
                email: true,
                image: true,
                isActive: true,
                bio: true,
                specialization: true,
                experience: true,
                featuredVideo: true,
                createdAt: true,
            }
        });

        if (!counsellor) return { error: "Counsellor not found" };

        // Enrich with stats
        const [activeSessions] = await db
            .select({ count: sql<number>`count(*)` })
            .from(counsellingSessions)
            .where(and(
                eq(counsellingSessions.counsellorId, counsellor.id),
                eq(counsellingSessions.status, "ACTIVE")
            ));

        const [totalSessions] = await db
            .select({ count: sql<number>`count(*)` })
            .from(counsellingSessions)
            .where(eq(counsellingSessions.counsellorId, counsellor.id));

        return {
            counsellor: {
                ...counsellor,
                stats: {
                    activeCases: Number(activeSessions.count),
                    totalCases: Number(totalSessions.count)
                }
            }
        };

    } catch (error) {
        return { error: "Failed to fetch counsellor" };
    }
}
