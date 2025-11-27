import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const resources = pgTable("resources", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    category: text("category").notNull(),
    description: text("description"),
    language: text("language").default("en").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
