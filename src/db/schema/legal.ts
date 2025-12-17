import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth/user";

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => user.id), // Optional for anonymous
  category: text("category").notNull(), // Abuse, Domestic Violence, etc.
  status: text("status").default("pending").notNull(), // pending, assigned, in_progress, resolved
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const evidence = pgTable("evidence", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id").references(() => tickets.id).notNull(),
  fileUrl: text("file_url").notNull(),
  type: text("type").notNull(), // image, audio, video
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ticketReplies = pgTable("ticket_replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id").references(() => tickets.id).notNull(),
  senderId: text("sender_id").references(() => user.id), // Nullable for system messages if needed, but usually admin/user id
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ticketsRelations = relations(tickets, ({ many }) => ({
  evidence: many(evidence),
  replies: many(ticketReplies),
}));

export const evidenceRelations = relations(evidence, ({ one }) => ({
  ticket: one(tickets, {
    fields: [evidence.ticketId],
    references: [tickets.id],
  }),
}));

export const ticketRepliesRelations = relations(ticketReplies, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketReplies.ticketId],
    references: [tickets.id],
  }),
  sender: one(user, {
    fields: [ticketReplies.senderId],
    references: [user.id],
  }),
}));
