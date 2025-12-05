"use server";

import { db } from "@/db";
import { evidence, tickets } from "@/db/schema";
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
