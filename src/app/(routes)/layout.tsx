import { Navbar } from "@/components/navigation/navbar";
import { BottomNav } from "@/components/mobile/bottom-nav";
import { Footer } from "@/components/footer";
import { getSystemSettings } from "@/app/actions/settings";


export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // We can fetch settings here or pass them through if needed, 
    // but fetching here keeps it self-contained for the public layout.
    const settings = await getSystemSettings();

    return (
        <>
            <Navbar logoUrl={settings.siteLogoUrl} />
            <main className="min-h-screen pb-16 md:pb-0">
                {children}
            </main>
            <BottomNav />
            <Footer />
        </>
    );
}
