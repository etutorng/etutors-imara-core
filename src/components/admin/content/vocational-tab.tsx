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
import { Plus, Trash, Video, Upload, Link as LinkIcon, FileVideo } from "lucide-react";
import { createCourse, deleteCourse, updateCourse } from "@/app/actions/lms";
import { uploadFile } from "@/app/actions/upload";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Course {
    id: string;
    title: string;
    category: string;
    thumbnailUrl: string | null;
    moduleCount: number;
    language: string;
    groupId: string;
    translations?: Course[];
}

interface VocationalTabProps {
    courses: Course[];
}

export function VocationalTab({ courses }: VocationalTabProps) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [language, setLanguage] = useState("en");
    const [groupId, setGroupId] = useState<string | undefined>(undefined);

    const [modules, setModules] = useState<{ title: string; videoUrl: string; duration: number }[]>([]);
    const [currentModule, setCurrentModule] = useState({ title: "", videoUrl: "", duration: 0 });

    const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);

    // Check if we are adding a translation (group ID set, not editing same ID)
    const isAddingTranslation = !!groupId && !editingId;

    // Upload States
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [videoSourceType, setVideoSourceType] = useState<"url" | "upload">("url");

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setDescription("");
        setCategory("");
        setThumbnailUrl("");
        setLanguage("en");
        setGroupId(undefined);
        setModules([]);
        setCurrentModule({ title: "", videoUrl: "", duration: 0 });
        setEditingModuleIndex(null);
        setStep(1);
    };

    const handleEdit = (course: any) => {
        setEditingId(course.id);
        setTitle(course.title);
        setDescription(course.description);
        setCategory(course.category);
        setThumbnailUrl(course.thumbnailUrl || "");
        setLanguage(course.language || "en");
        setGroupId(course.groupId);
        setModules(course.modules?.map((m: any) => ({ title: m.title, videoUrl: m.videoUrl, duration: m.duration || 0 })) || []);

        setStep(1);
        setOpen(true);
    };

    const handleAddTranslation = (masterCourse: Course) => {
        resetForm();
        setGroupId(masterCourse.groupId);
        setCategory(masterCourse.category); // Pre-fill category
        setThumbnailUrl(masterCourse.thumbnailUrl || ""); // Pre-fill thumbnail
        setLanguage("ha"); // Default to Hausa for now
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
            setCurrentModule({ title: "", videoUrl: "", duration: 0 });
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingThumbnail(true);
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadFile(formData, "courses");
        if (result.success && result.url) {
            setThumbnailUrl(result.url);
            toast.success("Thumbnail uploaded");
        } else {
            toast.error("Thumbnail upload failed");
        }
        setIsUploadingThumbnail(false);
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingVideo(true);
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadFile(formData, "modules");
        if (result.success && result.url) {
            setCurrentModule({ ...currentModule, videoUrl: result.url });
            toast.success("Video uploaded");
        } else {
            toast.error("Video upload failed");
        }
        setIsUploadingVideo(false);
    };

    const handleEditModule = (index: number) => {
        const module = modules[index];
        setCurrentModule(module);
        setEditingModuleIndex(index);
        if (module.videoUrl.startsWith("/uploads")) {
            setVideoSourceType("upload");
        } else {
            setVideoSourceType("url");
        }
    };

    const handleRemoveModule = (index: number) => {
        const newModules = [...modules];
        newModules.splice(index, 1);
        setModules(newModules);
        if (editingModuleIndex === index) {
            setEditingModuleIndex(null);
            setCurrentModule({ title: "", videoUrl: "", duration: 0 });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let result;
            if (editingId) {
                result = await updateCourse(editingId, {
                    title,
                    description,
                    category,
                    thumbnailUrl,
                    modules,
                    // Note: Language and GroupID typically don't change on edit
                });
            } else {
                result = await createCourse({
                    title,
                    description,
                    category,
                    thumbnailUrl,
                    language,
                    groupId,
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

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            const result = await deleteCourse(deleteId);
            if (result.success) {
                toast.success("Course deleted");
                setDeleteId(null);
            } else {
                toast.error(result.error || "Failed to delete course");
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
                <Dialog open={!!deleteId} onOpenChange={(val) => !val && setDeleteId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Course</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this course? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                                {loading ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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
                            <DialogTitle>
                                {editingId
                                    ? "Edit Vocational Course"
                                    : isAddingTranslation
                                        ? "Add Translation"
                                        : "Create Vocational Course"
                                }
                            </DialogTitle>
                            <DialogDescription>
                                {editingId ? "Edit course details and modules." : "Add a new vocational course with modules."}
                            </DialogDescription>
                        </DialogHeader>

                        {step === 1 && (
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Language</Label>
                                        <Select
                                            value={language}
                                            onValueChange={setLanguage}
                                            disabled={!!editingId && language === 'en'} // Lock EN if editing master (simplification)
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English (Default)</SelectItem>
                                                <SelectItem value="ha">Hausa</SelectItem>
                                                <SelectItem value="yo">Yoruba</SelectItem>
                                                <SelectItem value="ig">Igbo</SelectItem>
                                                <SelectItem value="pidgin">Pidgin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {isAddingTranslation && (
                                            <p className="text-xs text-muted-foreground">Adding translation to existing group.</p>
                                        )}
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
                                </div>
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course Title" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course description..." />
                                </div>

                                <div className="space-y-2">
                                    <Label>Thumbnail Image</Label>
                                    <div className="flex items-start gap-4">
                                        {thumbnailUrl && (
                                            <div className="relative h-20 w-32 border rounded-md overflow-hidden bg-muted">
                                                <img src={thumbnailUrl} alt="Preview" className="h-full w-full object-cover" />
                                                <button
                                                    onClick={() => setThumbnailUrl("")}
                                                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                                                >
                                                    <Trash className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="grid w-full gap-1.5">
                                            <Label htmlFor="thumbnail-upload" className="cursor-pointer">
                                                <div className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-muted/50 transition-colors w-full justify-center border-dashed">
                                                    <Upload className="h-4 w-4" />
                                                    {isUploadingThumbnail ? "Uploading..." : "Upload Thumbnail"}
                                                </div>
                                                <Input
                                                    id="thumbnail-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleThumbnailUpload}
                                                    disabled={isUploadingThumbnail}
                                                />
                                            </Label>
                                            <p className="text-xs text-muted-foreground">Or paste URL manually:</p>
                                            <Input
                                                value={thumbnailUrl}
                                                onChange={(e) => setThumbnailUrl(e.target.value)}
                                                placeholder="https://..."
                                                className="text-xs h-8"
                                            />
                                        </div>
                                    </div>
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
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Video Source</Label>
                                                <Tabs value={videoSourceType} onValueChange={(v) => setVideoSourceType(v as any)} className="w-full">
                                                    <TabsList className="grid w-full grid-cols-2">
                                                        <TabsTrigger value="url" className="flex items-center gap-2">
                                                            <LinkIcon className="h-4 w-4" /> External URL
                                                        </TabsTrigger>
                                                        <TabsTrigger value="upload" className="flex items-center gap-2">
                                                            <FileVideo className="h-4 w-4" /> Upload Video
                                                        </TabsTrigger>
                                                    </TabsList>

                                                    <TabsContent value="url" className="mt-2 space-y-2">
                                                        <Label>Video URL (YouTube/Vimeo)</Label>
                                                        <Input
                                                            value={currentModule.videoUrl}
                                                            onChange={(e) => setCurrentModule({ ...currentModule, videoUrl: e.target.value })}
                                                            placeholder="https://youtube.com/..."
                                                        />
                                                    </TabsContent>

                                                    <TabsContent value="upload" className="mt-2 space-y-2">
                                                        <Label>Upload Video File</Label>
                                                        {currentModule.videoUrl && currentModule.videoUrl.startsWith("/uploads") ? (
                                                            <div className="flex items-center gap-2 border p-2 rounded bg-muted/20">
                                                                <Video className="h-4 w-4 text-primary" />
                                                                <span className="text-xs truncate flex-1">{currentModule.videoUrl.split('/').pop()}</span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setCurrentModule({ ...currentModule, videoUrl: "" })}
                                                                >
                                                                    <Trash className="h-3 w-3 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="grid w-full gap-1.5">
                                                                <Label htmlFor="video-upload" className="cursor-pointer">
                                                                    <div className="flex flex-col items-center gap-2 border rounded-md px-3 py-6 text-sm hover:bg-muted/50 transition-colors w-full justify-center border-dashed">
                                                                        <Upload className="h-6 w-6 text-muted-foreground" />
                                                                        <span className="font-medium text-muted-foreground">
                                                                            {isUploadingVideo ? "Uploading..." : "Click to select video"}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground/70">MP4, WebM up to 50MB</span>
                                                                    </div>
                                                                    <Input
                                                                        id="video-upload"
                                                                        type="file"
                                                                        accept="video/*"
                                                                        className="hidden"
                                                                        onChange={handleVideoUpload}
                                                                        disabled={isUploadingVideo}
                                                                    />
                                                                </Label>
                                                            </div>
                                                        )}
                                                    </TabsContent>
                                                </Tabs>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleAddModule} type="button" variant="secondary" size="sm" className="w-full">
                                            {editingModuleIndex !== null ? "Update Module" : "Add Module"}
                                        </Button>
                                        {editingModuleIndex !== null && (
                                            <Button onClick={() => {
                                                setEditingModuleIndex(null);
                                                setCurrentModule({ title: "", videoUrl: "", duration: 0 });
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
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditModule(idx)}>Edit</Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveModule(idx)}>
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
                                    {loading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Course" : "Create Course")}
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
                                <TableHead>Translations</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
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
                                        <TableCell className="font-medium">
                                            <div>{course.title}</div>
                                            <div className="text-xs text-muted-foreground">Master (English)</div>
                                        </TableCell>
                                        <TableCell>{course.category}</TableCell>
                                        <TableCell>{course.moduleCount}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {/* Master Badge */}
                                                <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                                                    EN
                                                </div>
                                                {/* Translations */}
                                                {(course as any).translations?.map((t: any) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => handleEdit(t)}
                                                        className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                                                    >
                                                        {t.language.toUpperCase()}
                                                    </button>
                                                ))}
                                                {/* Add Translation Button */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-5 w-5 rounded-full p-0"
                                                    onClick={() => handleAddTranslation(course)}
                                                    title="Add Translation"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(course)}>Edit</Button>
                                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(course.id)}>
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
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
