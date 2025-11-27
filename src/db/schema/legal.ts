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

export const ticketsRelations = relations(tickets, ({ many }) => ({
  evidence: many(evidence),
}));

export const evidenceRelations = relations(evidence, ({ one }) => ({
  ticket: one(tickets, {
    fields: [evidence.ticketId],
    references: [tickets.id],
  }),
}));
