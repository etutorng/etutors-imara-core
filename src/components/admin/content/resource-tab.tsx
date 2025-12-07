"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, Link as LinkIcon, File } from "lucide-react";
import { createResource } from "@/app/actions/resources";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Resource {
    id: string;
    title: string;
    category: string;
    format: string;
    language: string;
}

interface ResourceTabProps {
    resources: Resource[];
}

export function ResourceTab({ resources }: ResourceTabProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState<"article" | "pdf" | "link">("article");
    const [content, setContent] = useState("");
    const [language, setLanguage] = useState("en");

    const resetForm = () => {
        setTitle("");
        setCategory("");
        setType("article");
        setContent("");
        setLanguage("en");
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const result = await createResource({
                title,
                category,
                type,
                content,
                language,
            });

            if (result.success) {
                toast.success("Resource created successfully");
                setOpen(false);
                resetForm();
            } else {
                toast.error(result.error || "Failed to create resource");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Add Resource
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add Resource</DialogTitle>
                            <DialogDescription>
                                Add a new resource to the library.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource Title" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Health">Health</SelectItem>
                                            <SelectItem value="Legal">Legal</SelectItem>
                                            <SelectItem value="Safety">Safety</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={type} onValueChange={(val: any) => setType(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="article">Article</SelectItem>
                                            <SelectItem value="pdf">PDF Document</SelectItem>
                                            <SelectItem value="link">External Link</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="ha">Hausa</SelectItem>
                                            <SelectItem value="ig">Igbo</SelectItem>
                                            <SelectItem value="yo">Yoruba</SelectItem>
                                            <SelectItem value="pcm">Pidgin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    {type === "article" ? "Content (Text)" : type === "pdf" ? "PDF URL" : "External URL"}
                                </Label>
                                {type === "article" ? (
                                    <Textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write article content here..."
                                        className="min-h-[150px]"
                                    />
                                ) : (
                                    <Input
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder={type === "pdf" ? "https://.../document.pdf" : "https://example.com"}
                                    />
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleSubmit} disabled={loading || !title || !category || !content}>
                                {loading ? "Creating..." : "Create Resource"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Resource Library</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Language</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resources.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No resources found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                resources.map((res) => (
                                    <TableRow key={res.id}>
                                        <TableCell className="font-medium">{res.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize flex w-fit items-center gap-1">
                                                {res.format === "article" && <FileText className="h-3 w-3" />}
                                                {res.format === "pdf" && <File className="h-3 w-3" />}
                                                {res.format === "link" && <LinkIcon className="h-3 w-3" />}
                                                {res.format}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{res.category}</TableCell>
                                        <TableCell className="uppercase text-xs font-bold text-muted-foreground">{res.language}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
