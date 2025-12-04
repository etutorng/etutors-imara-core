import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const resources = pgTable("resources", {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id").defaultRandom().notNull(), // Groups translations together
    title: text("title").notNull(),
    url: text("url").notNull(),
    thumbnail: text("thumbnail"), // For master view
    category: text("category").notNull(),
    format: text("format").default("article").notNull(),
    description: text("description"),
    language: text("language").default("en").notNull(),
    isMaster: boolean("is_master").default(false).notNull(), // Identifies the primary entry
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
