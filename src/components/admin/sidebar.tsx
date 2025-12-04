import { SidebarNav } from "./sidebar-nav";
import { UserProfile } from "./user-profile";
import Link from "next/link";

import { FullLogo } from "@/components/full-logo";

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
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r bg-gray-100/40 dark:bg-gray-800/40 z-40">
            <div className="p-6 border-b">
                <Link href="/admin">
                    <FullLogo className="h-8 w-auto" />
                </Link>
            </div>
            <div className="flex-1 px-4 overflow-y-auto">
                <SidebarNav role={role} />
            </div>
            <UserProfile name={user.name} email={user.email} image={user.image} />
        </aside>
    );
}
