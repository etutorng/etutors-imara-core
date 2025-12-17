"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSystemSettings, uploadLogo } from "@/app/actions/settings";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

interface Settings {
    id: string;
    siteName: string;
    supportEmail: string | null;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    siteLogoUrl: string | null;
}

interface SettingsFormProps {
    initialSettings: Settings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState(initialSettings);
    const [uploading, setUploading] = useState(false);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadLogo(formData);
            if (result.success && result.url) {
                setSettings({ ...settings, siteLogoUrl: result.url });
                toast.success("Logo uploaded successfully");
            } else {
                toast.error("Failed to upload logo");
            }
        } catch (error) {
            toast.error("Upload error");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateSystemSettings({
                siteName: settings.siteName,
                supportEmail: settings.supportEmail || "",
                maintenanceMode: settings.maintenanceMode,
                allowRegistration: settings.allowRegistration,
                siteLogoUrl: settings.siteLogoUrl || undefined,
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
                        <Label>Site Logo</Label>
                        <div className="flex items-center gap-4">
                            {settings.siteLogoUrl && (
                                <div className="h-16 w-16 relative border rounded-md overflow-hidden bg-muted">
                                    <img src={settings.siteLogoUrl} alt="Site Logo" className="object-contain w-full h-full" />
                                </div>
                            )}
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="logo" className="cursor-pointer">
                                    <div className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-muted/50 transition-colors">
                                        <Upload className="h-4 w-4" />
                                        {uploading ? "Uploading..." : "Upload Logo"}
                                    </div>
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoUpload}
                                        disabled={uploading}
                                    />
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input
                            id="siteName"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            required
                        />
                    </div>

                    {/* ... other fields ... */}

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
                        <Button type="submit" disabled={isPending || uploading}>
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
