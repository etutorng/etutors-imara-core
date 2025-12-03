import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";

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

    const role = (session.user as any).role;
    const user = {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar role={role} user={user} />

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 lg:hidden dark:bg-gray-800/40">
                    <MobileSidebar role={role} user={user} />
                    <div className="font-semibold">Imara Admin</div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
