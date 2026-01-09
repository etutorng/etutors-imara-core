import { PublicCounsellingClient } from "@/components/counsellor/public-page-client";
import { CounsellorGrid } from "@/components/counsellor-grid";

export default function PublicCounsellingPage() {
    return (
        <PublicCounsellingClient
            counsellorGrid={<CounsellorGrid />}
        />
    );
}
