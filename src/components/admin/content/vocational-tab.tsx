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
import { Plus, Trash, Video } from "lucide-react";
import { createCourse } from "@/app/actions/lms";
import { toast } from "sonner";

interface Course {
    id: string;
    title: string;
    category: string;
    thumbnailUrl: string | null;
    moduleCount: number;
}

interface VocationalTabProps {
    courses: Course[];
}

export function VocationalTab({ courses }: VocationalTabProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State (extended for edit)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [modules, setModules] = useState<{ title: string; videoUrl: string }[]>([]);
    const [currentModule, setCurrentModule] = useState({ title: "", videoUrl: "" });

    const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setCategory("");
        setThumbnailUrl("");
        setModules([]);
        setCurrentModule({ title: "", videoUrl: "" });
        setEditingModuleIndex(null);
        setStep(1);
    };

    const handleEdit = (course: any) => {
        setEditingId(course.id);
        setTitle(course.title);
        setDescription(course.description);
        setCategory(course.category);
        setThumbnailUrl(course.thumbnailUrl || "");
        setModules(course.modules?.map((m: any) => ({ title: m.title, videoUrl: m.videoUrl })) || []);

        setStep(1);
        setOpen(true);
    };

    const handleAddModule = () => {
        if (currentModule.title && currentModule.videoUrl) {
            if (editingModuleIndex !== null) {
                const newModules = [...modules];
                newModules[editingModuleIndex] = currentModule;
                setModules(newModules);
                setEditingModuleIndex(null);
            } else {
                setModules([...modules, currentModule]);
            }
            setCurrentModule({ title: "", videoUrl: "" });
        }
    };

    const handleEditModule = (index: number) => {
        setCurrentModule(modules[index]);
        setEditingModuleIndex(index);
    };

    const handleRemoveModule = (index: number) => {
        const newModules = [...modules];
        newModules.splice(index, 1);
        setModules(newModules);
        if (editingModuleIndex === index) {
            setEditingModuleIndex(null);
            setCurrentModule({ title: "", videoUrl: "" });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let result;
            if (editingId) {
                const { updateCourse } = await import("@/app/actions/lms");
                result = await updateCourse(editingId, {
                    title,
                    description,
                    category,
                    thumbnailUrl,
                    modules,
                });
            } else {
                result = await createCourse({
                    title,
                    description,
                    category,
                    thumbnailUrl,
                    modules,
                });
            }

            if (result.success) {
                toast.success(editingId ? "Course updated" : "Course created");
                setOpen(false);
                resetForm();
            } else {
                toast.error(result.error || "Failed to save course");
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
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Add Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Vocational Course" : "Create Vocational Course"}</DialogTitle>
                            <DialogDescription>
                                {editingId ? "Edit course details and modules." : "Add a new vocational course with modules."}
                            </DialogDescription>
                        </DialogHeader>

                        {step === 1 && (
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Title (English Master)</Label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Intro to Fashion Design" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course description..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Fashion">Fashion</SelectItem>
                                            <SelectItem value="Digital Skills">Digital Skills</SelectItem>
                                            <SelectItem value="Agriculture">Agriculture</SelectItem>
                                            <SelectItem value="Catering">Catering</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Thumbnail URL</Label>
                                    <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 py-4">
                                <div className="border rounded-md p-4 space-y-4 bg-muted/50">
                                    <h4 className="font-medium text-sm">{editingModuleIndex !== null ? "Edit Module" : "Add Module"}</h4>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Module Title</Label>
                                            <Input
                                                value={currentModule.title}
                                                onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                                                placeholder="Module 1: Basics"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Video URL</Label>
                                            <Input
                                                value={currentModule.videoUrl}
                                                onChange={(e) => setCurrentModule({ ...currentModule, videoUrl: e.target.value })}
                                                placeholder="YouTube/Vimeo Link"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleAddModule} type="button" variant="secondary" size="sm" className="w-full">
                                            {editingModuleIndex !== null ? "Update Module" : "Add Module"}
                                        </Button>
                                        {editingModuleIndex !== null && (
                                            <Button onClick={() => {
                                                setEditingModuleIndex(null);
                                                setCurrentModule({ title: "", videoUrl: "" });
                                            }} type="button" variant="outline" size="sm">
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Modules List ({modules.length})</Label>
                                    {modules.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">No modules added yet.</p>
                                    ) : (
                                        <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                                            {modules.map((mod, idx) => (
                                                <div key={idx} className={`flex items-center justify-between bg-background p-2 rounded border ${editingModuleIndex === idx ? 'border-primary ring-1 ring-primary' : ''}`}>
                                                    <div className="flex items-center gap-2">
                                                        <Video className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm font-medium">{mod.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="ghost" size="xs" onClick={() => handleEditModule(idx)}>Edit</Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveModule(idx)}>
                                                            <Trash className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            {step === 2 && (
                                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                            )}
                            {step === 1 ? (
                                <Button onClick={() => setStep(2)} disabled={!title || !category}>Next: Modules</Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={loading || modules.length === 0}>
                                    {loading ? "{editingId ? 'Updating...' : 'Creating...'}" : editingId ? "Update Course" : "Create Course"}
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vocational Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Thumbnail</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Modules</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No courses found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                courses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>
                                            {course.thumbnailUrl ? (
                                                <img src={course.thumbnailUrl} alt={course.title} className="h-10 w-16 object-cover rounded" />
                                            ) : (
                                                <div className="h-10 w-16 bg-muted rounded flex items-center justify-center text-xs">No Img</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{course.title}</TableCell>
                                        <TableCell>{course.category}</TableCell>
                                        <TableCell>{course.moduleCount}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(course)}>Edit</Button>
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
