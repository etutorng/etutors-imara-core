import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth/user";

export const counsellingStatusEnum = pgEnum("counselling_status", [
    "PENDING",
    "ACTIVE",
    "COMPLETED",
    "CANCELLED"
]);

export const counsellingSessions = pgTable("counselling_sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id).notNull(),
    counsellorId: text("counsellor_id").references(() => user.id),
    status: counsellingStatusEnum("status").default("PENDING").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const counsellingMessages = pgTable("counselling_messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id").references(() => counsellingSessions.id).notNull(),
    senderId: text("sender_id").references(() => user.id).notNull(),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
