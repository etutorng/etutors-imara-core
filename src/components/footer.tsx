import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    &copy; {new Date().getFullYear()} Project Imara. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/impact" className="hover:underline hover:text-primary transition-colors">Impact</Link>
                    <Link href="/open-source" className="hover:underline hover:text-primary transition-colors">Open Source</Link>
                    <Link href="/partners" className="hover:underline hover:text-primary transition-colors">Partners</Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Powered by</span>
                    <Link
                        href="https://etutors.ng"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4 hover:text-primary"
                    >
                        eTutors Nigeria Ltd.
                    </Link>
                </div>
            </div>
        </footer>
    );
}
