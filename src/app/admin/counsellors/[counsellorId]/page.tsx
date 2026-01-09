import { getAdminCounsellorById, adminUpdateCounsellorProfile } from "@/app/actions/admin-counsellors";
import { AdminCounsellorProfile } from "@/components/admin/counsellors/admin-counsellor-profile";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
    params: Promise<{
        counsellorId: string;
    }>;
}

export default async function AdminCounsellorDetailPage({ params }: PageProps) {
    const { counsellorId } = await params;
    const result = await getAdminCounsellorById(counsellorId);

    if ('error' in result || !result.counsellor) {
        notFound();
    }

    const { counsellor } = result;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/counsellors">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{counsellor.name}</h1>
                    <p className="text-muted-foreground">Manage profile, view stats, and update details.</p>
                </div>
            </div>

            <AdminCounsellorProfile counsellor={counsellor} />
        </div>
    );
}
