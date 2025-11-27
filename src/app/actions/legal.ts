"use server";

import { db } from "@/db";
import { evidence, tickets } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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
