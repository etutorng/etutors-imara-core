import { db } from "@/db";
import { user } from "@/db/schema/auth/user";
import { UserTable } from "@/components/admin/user-table";
import { desc } from "drizzle-orm";

export default async function UserManagementPage() {
    const users = await db.select().from(user).orderBy(desc(user.createdAt));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">Manage system users, roles, and permissions.</p>
            </div>
            <UserTable users={users} />
        </div>
    );
}
