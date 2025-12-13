import { relations } from "drizzle-orm";
import { user } from "./user";
import { account } from "./account";

export const userRelations = relations(user, ({ many }) => ({
    accounts: many(account),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));
