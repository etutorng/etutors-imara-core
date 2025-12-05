"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSystemSettings } from "@/app/actions/settings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Settings {
    id: string;
    siteName: string;
    supportEmail: string | null;
    maintenanceMode: boolean;
    allowRegistration: boolean;
}

interface SettingsFormProps {
    initialSettings: Settings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState(initialSettings);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateSystemSettings({
                siteName: settings.siteName,
                supportEmail: settings.supportEmail || "",
                maintenanceMode: settings.maintenanceMode,
                allowRegistration: settings.allowRegistration,
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Settings updated successfully");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                        Configure the general settings for the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input
                            id="siteName"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="supportEmail">Support Email</Label>
                        <Input
                            id="supportEmail"
                            type="email"
                            value={settings.supportEmail || ""}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            placeholder="support@example.com"
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Maintenance Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Disable access to the platform for non-admin users.
                            </p>
                        </div>
                        <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base">Allow Registration</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow new users to sign up.
                            </p>
                        </div>
                        <Switch
                            checked={settings.allowRegistration}
                            onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
