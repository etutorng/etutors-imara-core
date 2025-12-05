import { pgTable, text, uuid, boolean, timestamp } from "drizzle-orm/pg-core";

export const systemSettings = pgTable("system_settings", {
    id: uuid("id").primaryKey().defaultRandom(),
    siteName: text("site_name").default("Imara").notNull(),
    supportEmail: text("support_email"),
    maintenanceMode: boolean("maintenance_mode").default(false).notNull(),
    allowRegistration: boolean("allow_registration").default(true).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
