import Image from "next/image";
import { cn } from "@/lib/utils";

interface FullLogoProps {
    className?: string;
    url?: string | null;
}

export function FullLogo({ className, url }: FullLogoProps) {
    return (
        <div className={cn("relative h-10 w-auto", className)}>
            <img
                src={url || "/imara-logo.png"}
                alt="Imara Logo"
                className="h-full w-auto object-contain object-left"
            />
        </div>
    );
}
