import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth/user";

export const mentors = pgTable("mentors", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id).notNull(),
    expertise: text("expertise").notNull(), // Health, Career, Education
    bio: text("bio").notNull(),
    verified: boolean("verified").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: text("sender_id").references(() => user.id).notNull(),
    receiverId: text("receiver_id").references(() => user.id).notNull(),
    content: text("content").notNull(),
    read: boolean("read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
