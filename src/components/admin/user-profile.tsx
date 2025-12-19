"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Globe } from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfileProps {
    name: string;
    email: string;
    image?: string | null;
}

export function UserProfile({ name, email, image }: UserProfileProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin");
                },
            },
        });
    };

    return (
        <div className="flex items-center gap-3 p-4 border-t mt-auto">
            <Avatar>
                <AvatarImage src={image || ""} alt={name} />
                <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{name}</p>
                <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
            <div className="flex items-center">
                <Button variant="ghost" size="icon" asChild title="Back to Site">
                    <Link href="/">
                        <Globe className="h-4 w-4" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign Out">
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
