import { getSystemSettings } from "@/app/actions/settings";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import { ProfileForm } from "@/components/admin/settings/profile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

export default async function SettingsPage() {
    const settings = await getSystemSettings();
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const currentUser = session?.user;

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">System configuration and settings.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                    <SettingsForm initialSettings={settings} />
                </TabsContent>
                <TabsContent value="profile" className="space-y-4">
                    {currentUser ? (
                        <ProfileForm initialData={{
                            bio: (currentUser as any).bio,
                            specialization: (currentUser as any).specialization,
                            experience: (currentUser as any).experience,
                            featuredVideo: (currentUser as any).featuredVideo
                        }} />
                    ) : (
                        <div>Loading profile...</div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
