"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createResource } from "@/app/admin/content/actions";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

export function ContentUploadForm({ onSuccess }: { onSuccess?: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (!file) {
            toast.error("Please select a file");
            return;
        }

        setUploading(true);

        try {
            // 1. Upload File
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            if (!uploadRes.ok) {
                throw new Error("Upload failed");
            }

            const { url } = await uploadRes.json();

            // 2. Create Resource
            startTransition(async () => {
                await createResource({
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    category: formData.get("category") as string,
                    format: formData.get("format") as string,
                    language: formData.get("language") as string,
                    url: url,
                });
                toast.success("Content uploaded successfully");
                onSuccess?.();
            });
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required placeholder="e.g. Women Rights 101" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Brief description of the content" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required defaultValue="education">
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="career">Career</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select name="format" required defaultValue="pdf">
                        <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pdf">PDF Document</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select name="language" required defaultValue="en">
                    <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="file"
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                        accept=".pdf,.mp4,.jpg,.png,.jpeg"
                    />
                </div>
            </div>

            <Button type="submit" disabled={uploading || isPending} className="w-full">
                {uploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </>
                ) : isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Content
                    </>
                )}
            </Button>
        </form>
    );
}
