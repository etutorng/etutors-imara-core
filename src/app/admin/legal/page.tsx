import { getAllTickets } from "@/app/actions/legal";
import { LegalCaseTable } from "@/components/admin/legal/legal-case-table";

export default async function LegalAdminPage() {
    const tickets = await getAllTickets();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Legal Cases</h1>
                <p className="text-muted-foreground">Manage and track legal support tickets.</p>
            </div>

            <LegalCaseTable tickets={tickets} />
        </div>
    );
}
