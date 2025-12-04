import { db } from "@/db";
import { resources } from "@/db/schema/resources";
import { desc, eq } from "drizzle-orm";
import { ContentUploadForm } from "@/components/admin/content-upload-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasterContentTable } from "@/components/admin/content/master-content-table";

export default async function ContentPage() {
    // Fetch all resources
    const allResources = await db.select().from(resources).orderBy(desc(resources.createdAt));

    // Group resources by groupId
    const groupedMap = new Map();

    allResources.forEach(res => {
        if (!groupedMap.has(res.groupId)) {
            // Initialize with the first item found (preferably master)
            groupedMap.set(res.groupId, { ...res, translations: [] });
        }

        const group = groupedMap.get(res.groupId);

        // If this is the master, update the main entry properties
        if (res.isMaster) {
            Object.assign(group, { ...res, translations: group.translations });
        }

        // Add to translations list
        group.translations.push(res);
    });

    const groupedResources = Array.from(groupedMap.values());

    // Filter by category for tabs
    const vocationalCourses = groupedResources.filter(r => r.category === "vocational" || r.category === "education"); // Adjust categories as needed
    const resourceLibrary = groupedResources.filter(r => r.category !== "vocational" && r.category !== "education");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
                    <p className="text-muted-foreground">Manage multilingual educational resources.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Content
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload New Content</DialogTitle>
                            <DialogDescription>
                                Upload the master (English) version of the content.
                            </DialogDescription>
                        </DialogHeader>
                        <ContentUploadForm />
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="vocational" className="w-full">
                <TabsList>
                    <TabsTrigger value="vocational">Vocational Courses</TabsTrigger>
                    <TabsTrigger value="library">Resource Library</TabsTrigger>
                </TabsList>
                <TabsContent value="vocational" className="mt-4">
                    <MasterContentTable data={vocationalCourses} />
                </TabsContent>
                <TabsContent value="library" className="mt-4">
                    <MasterContentTable data={resourceLibrary} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
