import { NextResponse } from "next/server";
import { getSystemSettings } from "@/app/actions/settings";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const settings = await getSystemSettings();
        return NextResponse.json({
            maintenanceMode: settings?.maintenanceMode ?? false,
            allowRegistration: settings?.allowRegistration ?? true,
        });
    } catch (error) {
        return NextResponse.json(
            { maintenanceMode: false, allowRegistration: true },
            { status: 500 }
        );
    }
}
