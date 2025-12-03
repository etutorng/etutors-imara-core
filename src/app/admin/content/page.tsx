import { db } from "@/db";
import { resources } from "@/db/schema/resources";
import { desc } from "drizzle-orm";
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
import { Plus, FileText, Video, Image as ImageIcon } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function ContentPage() {
    const contentList = await db.select().from(resources).orderBy(desc(resources.createdAt));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
                    <p className="text-muted-foreground">Upload and manage educational resources.</p>
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
                                Upload a file and provide details to add it to the library.
                            </DialogDescription>
                        </DialogHeader>
                        <ContentUploadForm />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contentList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No content found. Upload your first resource.
                                </TableCell>
                            </TableRow>
                        ) : (
                            contentList.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {item.format === "video" ? <Video className="h-4 w-4 text-blue-500" /> :
                                                item.format === "image" ? <ImageIcon className="h-4 w-4 text-purple-500" /> :
                                                    <FileText className="h-4 w-4 text-orange-500" />}
                                            {item.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{item.format}</Badge>
                                    </TableCell>
                                    <TableCell className="capitalize">{item.category}</TableCell>
                                    <TableCell className="uppercase">{item.language}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">View</a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
