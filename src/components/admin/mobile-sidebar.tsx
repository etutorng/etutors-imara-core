"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { UserProfile } from "./user-profile";
import Link from "next/link";
import { useState } from "react";

interface MobileSidebarProps {
    role: string;
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
}

export function MobileSidebar({ role, user }: MobileSidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
                <div className="p-6">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-xl" onClick={() => setOpen(false)}>
                        <span>Imara Admin</span>
                    </Link>
                </div>
                <div className="flex-1 px-4">
                    <SidebarNav role={role} onClick={() => setOpen(false)} />
                </div>
                <UserProfile name={user.name} email={user.email} image={user.image} />
            </SheetContent>
        </Sheet>
    );
}
