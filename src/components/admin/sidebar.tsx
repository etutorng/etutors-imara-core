import { SidebarNav } from "./sidebar-nav";
import { UserProfile } from "./user-profile";
import Link from "next/link";

interface SidebarProps {
    role: string;
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
}

export function Sidebar({ role, user }: SidebarProps) {
    return (
        <aside className="hidden lg:flex h-screen w-64 flex-col border-r bg-gray-100/40 dark:bg-gray-800/40">
            <div className="p-6">
                <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
                    <span>Imara Admin</span>
                </Link>
            </div>
            <div className="flex-1 px-4">
                <SidebarNav role={role} />
            </div>
            <UserProfile name={user.name} email={user.email} image={user.image} />
        </aside>
    );
}
