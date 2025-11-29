import Image from "next/image";
import { cn } from "@/lib/utils";

interface FullLogoProps {
    className?: string;
}

export function FullLogo({ className }: FullLogoProps) {
    return (
        <div className={cn("relative h-10 w-auto", className)}>
            <Image
                src="/imara-logo.png"
                alt="Imara Logo"
                fill
                className="object-contain object-left"
                priority
            />
        </div>
    );
}
