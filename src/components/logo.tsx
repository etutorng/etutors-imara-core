import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="relative h-10 w-10 shrink-0">
                <Image
                    src="/imara-icon.png"
                    alt="Imara Logo"
                    fill
                    className="object-contain drop-shadow-sm"
                    priority
                />
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Imara
            </span>
        </div>
    );
}
