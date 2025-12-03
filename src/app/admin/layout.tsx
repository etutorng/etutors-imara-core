import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signin");
    }

    const role = session.user.role;

    return (
        <div className="flex h-screen w-full">
            <aside className="w-64 bg-gray-100 p-4 border-r">
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
                <div className="text-sm text-gray-500 mb-4">Role: {role}</div>
                <nav className="space-y-2">
                    <a href="/admin" className="block p-2 hover:bg-gray-200 rounded">Dashboard</a>

                    {(role === "SUPER_ADMIN" || role === "CONTENT_EDITOR") && (
                        <a href="/admin/content" className="block p-2 hover:bg-gray-200 rounded">Content</a>
                    )}

                    {(role === "SUPER_ADMIN" || role === "LEGAL_PARTNER") && (
                        <a href="/admin/legal" className="block p-2 hover:bg-gray-200 rounded">Legal</a>
                    )}

                    {role === "SUPER_ADMIN" && (
                        <a href="/admin/users" className="block p-2 hover:bg-gray-200 rounded">Users</a>
                    )}
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
