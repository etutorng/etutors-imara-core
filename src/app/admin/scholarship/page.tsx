import { getApplications } from "@/app/actions/scholarship";
import { ScholarshipApplicationsTable } from "@/components/admin/scholarship/scholarship-applications-table";

export default async function ScholarshipAdminPage() {
    // In a real app, this would be fetched server-side
    // For mock data in mocked action, calling it here works fine
    const applications = await getApplications();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Scholarship Applications</h1>
                <p className="text-muted-foreground">Manage and review applications for digital skills training.</p>
            </div>

            <ScholarshipApplicationsTable applications={applications} />
        </div>
    );
}
