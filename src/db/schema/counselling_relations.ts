import { relations } from "drizzle-orm";
import { user } from "./auth/user";
import { counsellingMessages, counsellingSessions } from "./counselling";

export const counsellingSessionRelations = relations(counsellingSessions, ({ one, many }) => ({
    user: one(user, {
        fields: [counsellingSessions.userId],
        references: [user.id],
        relationName: "user_sessions"
    }),
    counsellor: one(user, {
        fields: [counsellingSessions.counsellorId],
        references: [user.id],
        relationName: "counsellor_sessions"
    }),
    messages: many(counsellingMessages),
}));

export const counsellingMessageRelations = relations(counsellingMessages, ({ one }) => ({
    session: one(counsellingSessions, {
        fields: [counsellingMessages.sessionId],
        references: [counsellingSessions.id],
    }),
    sender: one(user, {
        fields: [counsellingMessages.senderId],
        references: [user.id],
    }),
}));
