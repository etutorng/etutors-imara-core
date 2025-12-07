import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth/user";

export const courses = pgTable("courses", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(), // Fashion, Digital Literacy, etc.
    language: text("language").default("en").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    groupId: uuid("group_id").defaultRandom().notNull(), // Groups translations together
    isMaster: boolean("is_master").default(false).notNull(), // Identifies the primary entry
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const modules = pgTable("modules", {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id").references(() => courses.id).notNull(),
    title: text("title").notNull(),
    videoUrl: text("video_url").notNull(),
    duration: integer("duration").notNull(), // in seconds
    order: integer("order").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const progress = pgTable("progress", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id).notNull(),
    moduleId: uuid("module_id").references(() => modules.id).notNull(),
    completed: boolean("completed").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const badges = pgTable("badges", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    iconUrl: text("icon_url").notNull(),
    criteria: text("criteria").notNull(), // JSON or string describing criteria
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userBadges = pgTable("user_badges", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id).notNull(),
    badgeId: uuid("badge_id").references(() => badges.id).notNull(),
    awardedAt: timestamp("awarded_at").defaultNow().notNull(),
});

// Relations
export const coursesRelations = relations(courses, ({ many }) => ({
    modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one }) => ({
    course: one(courses, {
        fields: [modules.courseId],
        references: [courses.id],
    }),
}));
