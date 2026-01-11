"use server";

import { db } from "@/db";
import {
    counsellingSessions,
    counsellingMessages,
    counsellingStatusEnum
} from "@/db/schema/counselling";

import { auth } from "@/lib/auth/server";
import { eq, and, or, desc, asc } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function requestCounselling(counsellorId?: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    try {
        // Check for existing active/pending session
        // If counsellorId is provided, check for session with THAT counsellor
        // If no counsellorId (generic request), check for any general pending request? 
        // For now, let's assume we always want to avoid duplicates.

        let whereClause;
        if (counsellorId) {
            whereClause = and(
                eq(counsellingSessions.userId, session.user.id),
                eq(counsellingSessions.counsellorId, counsellorId),
                or(
                    eq(counsellingSessions.status, "PENDING"),
                    eq(counsellingSessions.status, "ACTIVE")
                )
            );
        } else {
            // Generic legacy check
            whereClause = and(
                eq(counsellingSessions.userId, session.user.id),
                or(
                    eq(counsellingSessions.status, "PENDING"),
                    eq(counsellingSessions.status, "ACTIVE")
                )
            );
        }

        const existingSession = await db.query.counsellingSessions.findFirst({
            where: whereClause
        });

        if (existingSession) {
            // If requesting specific, just return success so UI opens it
            if (counsellorId) return { success: true, session: existingSession };
            return { error: "You already have an active or pending counselling request." };
        }

        const [newSession] = await db.insert(counsellingSessions)
            .values({
                userId: session.user.id,
                status: "PENDING",
                counsellorId: counsellorId || undefined, // Assign directly if targeted
            })
            .returning();

        // Send Email Notification
        try {
            const { sendEmail } = await import("@/lib/email");

            // Determine recipient: Specific counsellor or fallback to Admin/Head
            let recipientEmail = process.env.ADMIN_EMAIL_NOTIFY || "admin@imara.etutors.ng";
            let recipientName = "Admin";

            // If a specific counsellor was requested, fetch their email
            if (counsellorId) {
                const counsellor = await db.query.user.findFirst({
                    where: eq(user.id, counsellorId),
                    columns: { email: true, name: true }
                });
                if (counsellor) {
                    recipientEmail = counsellor.email;
                    recipientName = counsellor.name;
                }
            }

            // Create notification content
            const subject = `New Counselling Request from ${session.user.name}`;
            const messageText = `
Hello ${recipientName},

You have received a new counselling request.

Applicant: ${session.user.name}
Email: ${session.user.email}
Date: ${new Date().toLocaleString()}

Please log in to your dashboard to review and respond to this request.
            `;

            await sendEmail({
                to: recipientEmail,
                subject: subject,
                text: messageText,
                html: `
<h2>New Counselling Request</h2>
<p>Hello ${recipientName},</p>
<p>You have received a new counselling request.</p>
<ul>
    <li><strong>Applicant:</strong> ${session.user.name}</li>
    <li><strong>Email:</strong> ${session.user.email}</li>
    <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
</ul>
<p>Please log in to your dashboard to review and respond.</p>
<hr/>
<p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://imara.etutors.ng'}/dashboard">Go to Dashboard</a></p>
                `
            });

        } catch (emailError) {
            console.error("Failed to send counselling notification:", emailError);
        }

        revalidatePath("/dashboard/counselling");
        return { success: true, session: newSession };
    } catch (error) {
        console.error("Failed to request counselling:", error);
        return { error: "Failed to request counselling." };
    }
}

export async function getUserSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    try {
        const counsellingSession = await db.query.counsellingSessions.findFirst({
            where: and(
                eq(counsellingSessions.userId, session.user.id),
                or(
                    eq(counsellingSessions.status, "PENDING"),
                    eq(counsellingSessions.status, "ACTIVE")
                )
            ),
            with: {
                counsellor: true,
                messages: {
                    orderBy: asc(counsellingMessages.createdAt)
                }
            }
        });

        return { session: counsellingSession };
    } catch (error) {
        console.error("Failed to get session:", error);
        return { error: "Failed to retrieve session." };
    }
}

export async function getMentorSession(counsellorId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    try {
        const counsellingSession = await db.query.counsellingSessions.findFirst({
            where: and(
                eq(counsellingSessions.userId, session.user.id),
                eq(counsellingSessions.counsellorId, counsellorId),
                or(
                    eq(counsellingSessions.status, "PENDING"),
                    eq(counsellingSessions.status, "ACTIVE")
                )
            ),
            with: {
                counsellor: true,
                messages: {
                    orderBy: asc(counsellingMessages.createdAt)
                }
            }
        });

        return { session: counsellingSession };
    } catch (error) {
        console.error("Failed to get mentor session:", error);
        return { error: "Failed to retrieve session." };
    }
}

export async function sendMessage(sessionId: string, content: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { error: "Unauthorized" };
    }

    try {
        // Verify user is part of session (either user or counsellor)
        const counsellingSession = await db.query.counsellingSessions.findFirst({
            where: eq(counsellingSessions.id, sessionId),
        });

        if (!counsellingSession) {
            return { error: "Session not found" };
        }

        const isParticipant =
            counsellingSession.userId === session.user.id ||
            counsellingSession.counsellorId === session.user.id;

        if (!isParticipant) {
            return { error: "Unauthorized" };
        }

        await db.insert(counsellingMessages).values({
            sessionId: sessionId,
            senderId: session.user.id,
            content: content,
        });

        revalidatePath("/dashboard/counselling");
        revalidatePath("/admin/counselling");
        return { success: true };
    } catch (error) {
        console.error("Failed to send message:", error);
        return { error: "Failed to send message." };
    }
}

// Admin / Counsellor Actions

export async function getCounsellingQueue() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role === "USER") {
        // Allow SUPER_ADMIN, COUNSELLOR, etc. but strictly not plain USER
        return { error: "Unauthorized" };
    }

    try {
        const pendingSessions = await db.query.counsellingSessions.findMany({
            where: eq(counsellingSessions.status, "PENDING"),
            with: {
                user: true
            },
            orderBy: desc(counsellingSessions.createdAt)
        });

        // Also fetch active sessions for this counsellor
        const myActiveSessions = await db.query.counsellingSessions.findMany({
            where: and(
                eq(counsellingSessions.status, "ACTIVE"),
                eq(counsellingSessions.counsellorId, session.user.id)
            ),
            with: {
                user: true
            },
            orderBy: desc(counsellingSessions.updatedAt)
        });

        return { pending: pendingSessions, active: myActiveSessions };
    } catch (error) {
        console.error("Failed to get queue:", error);
        return { error: "Failed to fetch queue." };
    }
}

export async function assignCounsellor(sessionId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role === "USER") {
        return { error: "Unauthorized" };
    }

    try {
        await db.update(counsellingSessions)
            .set({
                counsellorId: session.user.id,
                status: "ACTIVE",
                updatedAt: new Date(),
            })
            .where(eq(counsellingSessions.id, sessionId));

        revalidatePath("/admin/counselling");
        return { success: true };
    } catch (error) {
        console.error("Failed to assign counsellor:", error);
        return { error: "Failed to assign session." };
    }
}

export async function getSessionMessages(sessionId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || (session.user as any).role === "USER") {
        return { error: "Unauthorized" };
    }

    try {
        const messages = await db.query.counsellingMessages.findMany({
            where: eq(counsellingMessages.sessionId, sessionId),
            orderBy: asc(counsellingMessages.createdAt),
            with: {
                sender: true
            }
        });
        return { messages };
    } catch (error) {
    }
}


export async function getCounsellors() {
    try {
        const counsellors = await db.query.user.findMany({
            where: and(
                eq(user.role, "COUNSELLOR"),
                eq(user.isActive, true)
            ),
            columns: {
                id: true,
                name: true,
                image: true,
                bio: true,
                specialization: true,
                experience: true
            }
        });

        return counsellors;
    } catch (error) {
        console.error("Failed to get counsellors:", error);
        return [];
    }
}

export async function getCounsellorById(counsellorId: string) {
    try {
        const counsellor = await db.query.user.findFirst({
            where: and(
                eq(user.id, counsellorId),
                eq(user.role, "COUNSELLOR")
            ),
            columns: {
                id: true,
                name: true,
                image: true,
                bio: true,
                specialization: true,
                experience: true,
                featuredVideo: true
            }
        });

        return counsellor;
    } catch (error) {
        console.error("Failed to get counsellor:", error);
        return null;
    }
}
