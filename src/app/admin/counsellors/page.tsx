import { CounsellorDataTable } from "@/components/admin/counsellors/counsellor-data-table";

export default function CounsellorManagementPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Counsellor Management</h1>
                <p className="text-muted-foreground">Monitor performance, manage profiles, and oversee counselling operations.</p>
            </div>

            <CounsellorDataTable />
        </div>
    );
}
