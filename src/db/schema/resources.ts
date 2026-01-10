import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth/user";

export const resources = pgTable("resources", {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id").defaultRandom().notNull(), // Groups translations together
    title: text("title").notNull(),
    url: text("url").notNull(),
    thumbnail: text("thumbnail"), // For master view
    category: text("category").notNull(),
    format: text("format").default("article").notNull(),
    content: text("content"), // For Article type content
    description: text("description"),
    language: text("language").default("en").notNull(),
    isMaster: boolean("is_master").default(false).notNull(), // Identifies the primary entry

    // Video / Counsellor specific fields
    authorId: text("author_id").references(() => user.id), // Link to counsellor (User table uses text ID generally)
    videoUrl: text("video_url"), // YouTube link or internal path
    duration: text("duration"), // e.g. "5:30"

    createdAt: timestamp("created_at").defaultNow().notNull(),
});
