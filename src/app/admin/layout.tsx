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
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Desktop Sidebar - Fixed */}
            <Sidebar role={role} user={user} />

            {/* Main Content Area - with left margin for sidebar */}
            <div className="flex flex-col flex-1 lg:ml-64">
                {/* Mobile Header */}
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6 lg:hidden">
                    <MobileSidebar role={role} user={user} />
                    <div className="font-semibold">Imara Admin</div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto p-6 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
