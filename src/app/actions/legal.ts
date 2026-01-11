"use server";

import { db } from "@/db";
import { evidence, tickets, ticketReplies } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createTicketSchema = z.object({
    category: z.string().min(1),
    description: z.string().min(10),
    files: z.array(z.object({
        url: z.string().url(),
        type: z.enum(["image", "audio", "video"]),
    })).optional(),
});

export async function submitTicket(data: z.infer<typeof createTicketSchema>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Allow anonymous submissions, so no session check enforcement here if we want true anonymity.
    // However, if we want to track it for a user, we use session.user.id.

    const ticketId = await db.transaction(async (tx) => {
        const [ticket] = await tx.insert(tickets).values({
            userId: session?.user?.id,
            category: data.category,
            description: data.description,
            status: "pending",
        }).returning({ id: tickets.id });

        if (data.files && data.files.length > 0) {
            await tx.insert(evidence).values(
                data.files.map((file) => ({
                    ticketId: ticket.id,
                    fileUrl: file.url,
                    type: file.type,
                }))
            );
        }
        return ticket.id;
    });

    // Send Email Notification to Legal Staff
    try {
        const { sendEmail } = await import("@/lib/email");

        // Notify Legal Admin / Staff
        // Using a dedicated env var or fallback to general admin
        const legalEmail = process.env.LEGAL_EMAIL_NOTIFY || process.env.ADMIN_EMAIL_NOTIFY || "legal@imara.etutors.ng";

        const subject = `New Legal Aid Request: ${data.category}`;
        const messageText = `
New Legal Aid Request Received.

User: ${session?.user?.name || "Anonymous"}
Category: ${data.category}
Description:
${data.description}

Please log in to the admin panel to review.
        `;

        await sendEmail({
            to: legalEmail,
            subject: subject,
            text: messageText,
            html: `
<h2>New Legal Aid Request</h2>
<p><strong>User:</strong> ${session?.user?.name || "Anonymous"} (${session?.user?.email || "No Email"})</p>
<p><strong>Category:</strong> ${data.category}</p>
<h3>Description</h3>
<p style="white-space: pre-wrap;">${data.description}</p>
<br/>
<p>Please log in to the admin panel to review and take action.</p>
            `
        });

    } catch (emailError) {
        console.error("Failed to send legal notification email. Ticket ID:", ticketId, "Error:", emailError);
        // We log clearly but do not revert the ticket creation, as the user's request was successfully saved.
    }

    return { success: true, ticketId };
}

export async function getTickets() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return [];
    }

    const userTickets = await db.query.tickets.findMany({
        where: eq(tickets.userId, session.user.id),
        with: {
            evidence: true,
        },
        orderBy: (tickets, { desc }) => [desc(tickets.createdAt)],
    });

    return userTickets;
}

export async function getAllTickets() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role === "USER") {
        return [];
    }

    const allTickets = await db.query.tickets.findMany({
        with: {
            evidence: true,
            user: true,
        },
        orderBy: (tickets, { desc }) => [desc(tickets.createdAt)],
    });

    // Fetch user details manually since we don't have a direct relation in schema yet or to be safe
    // Actually, we can just return the tickets and fetch users if needed, but for now let's return tickets.
    // If we need user names, we might need to join or fetch separately.
    // Given the schema `userId: text("user_id").references(() => user.id)`, we can try to include it if relation exists.
    // Checking schema... `tickets` has `userId`. `user` table exists.
    // Let's assume we can just get the ID and maybe fetch user details if needed, or just show ID/Anonymous.

    // Ideally we should have a relation defined in `ticketsRelations` to `users`.
    // Let's check `src/db/schema/legal.ts` again.
    // It has `userId` but no relation to `users` in `ticketsRelations`.
    // I will add the relation in a separate step if needed, but for now let's just return the tickets.

    return allTickets;
}

export async function updateTicketStatus(ticketId: string, status: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || (session.user as any).role === "USER") {
        return { error: "Unauthorized" };
    }

    try {
        await db.update(tickets)
            .set({ status, updatedAt: new Date() })
            .where(eq(tickets.id, ticketId));

        revalidatePath("/admin/legal");
        return { success: true };
    } catch (error) {
        console.error("Failed to update ticket status:", error);
        return { error: "Failed to update status" };
    }
}

export async function getTicketReplies(ticketId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return [];
    }

    // Ensure user has access (is owner or admin)
    // First, check ticket ownership if not admin
    if ((session.user as any).role === "USER") {
        const ticket = await db.query.tickets.findFirst({
            where: eq(tickets.id, ticketId),
            columns: { userId: true },
        });

        if (!ticket || ticket.userId !== session.user.id) {
            return [];
        }
    }

    const replies = await db.query.ticketReplies.findMany({
        where: eq(ticketReplies.ticketId, ticketId),
        with: {
            sender: true, // Assuming relation exists
        },
        orderBy: (replies, { asc }) => [asc(replies.createdAt)],
    });

    return replies;
}

export async function sendReply(ticketId: string, message: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "Unauthorized" };
    }

    // Verify access similar to getTicketReplies
    if ((session.user as any).role === "USER") {
        const ticket = await db.query.tickets.findFirst({
            where: eq(tickets.id, ticketId),
            columns: { userId: true },
        });

        if (!ticket || ticket.userId !== session.user.id) {
            return { error: "Unauthorized" };
        }
    }

    try {
        await db.insert(ticketReplies).values({
            ticketId,
            senderId: session.user.id,
            message,
        });

        // Optionally update ticket updated_at
        await db.update(tickets)
            .set({ updatedAt: new Date() })
            .where(eq(tickets.id, ticketId));

        revalidatePath("/admin/legal");
        revalidatePath("/dashboard/legal");
        return { success: true };
    } catch (error) {
        console.error("Failed to send reply:", error);
        return { error: "Failed to send message" };
    }
}
