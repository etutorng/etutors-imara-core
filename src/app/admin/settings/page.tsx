import { getSystemSettings } from "@/app/actions/settings";
import { SettingsForm } from "@/components/admin/settings/settings-form";

export default async function SettingsPage() {
    const settings = await getSystemSettings();

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">System configuration and settings.</p>
            </div>

            <SettingsForm initialSettings={settings} />
        </div>
    );
}
