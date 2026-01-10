import { getAdminCounsellors } from "@/app/actions/admin-counsellors";
import { getVocationalCourses } from "@/app/actions/lms";
import { getResources } from "@/app/actions/resources";
import { VocationalTab } from "@/components/admin/content/vocational-tab";
import { ResourceTab } from "@/components/admin/content/resource-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ContentPage() {
    const courses = await getVocationalCourses();
    const resources = await getResources();
    const { counsellors } = await getAdminCounsellors({ limit: 100 });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Content CMS</h1>
                <p className="text-muted-foreground">Manage vocational courses and resource library.</p>
            </div>

            <Tabs defaultValue="vocational" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="vocational">Vocational Courses</TabsTrigger>
                    <TabsTrigger value="resources">Resource Library</TabsTrigger>
                </TabsList>
                <TabsContent value="vocational" className="space-y-4">
                    <VocationalTab courses={courses} />
                </TabsContent>
                <TabsContent value="resources" className="space-y-4">
                    <ResourceTab resources={resources} counsellors={counsellors} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
