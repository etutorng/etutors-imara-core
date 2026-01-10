"use client";

import { useState } from "react";
import { adminUpdateCounsellorProfile } from "@/app/actions/admin-counsellors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Calendar, Mail, MapPin, Video, Save, Loader2, Upload } from "lucide-react";

interface AdminCounsellorProfileProps {
    counsellor: {
        id: string;
        name: string;
        email: string;
        image: string | null;
        isActive: boolean;
        bio: string | null;
        specialization: string | null;
        experience: string | null;
        featuredVideo: string | null;
        createdAt: Date | null;
        stats: {
            activeCases: number;
            totalCases: number;
        };
    };
}

export function AdminCounsellorProfile({ counsellor }: AdminCounsellorProfileProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        bio: counsellor.bio || "",
        specialization: counsellor.specialization || "",
        experience: counsellor.experience || "",
        featuredVideo: counsellor.featuredVideo || "",
        image: counsellor.image || ""
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await adminUpdateCounsellorProfile(counsellor.id, formData);
            if (res.success) {
                toast.success("Profile updated successfully");
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Left Column: Quick Info */}
            <Card className="md:col-span-1 border-none shadow-none bg-muted/40">
                <CardHeader className="flex flex-col items-center text-center">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 mb-4">
                            <AvatarImage src={formData.image || ""} alt={counsellor.name} className="object-cover" />
                            <AvatarFallback className="text-2xl">{counsellor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Label
                            htmlFor="image-upload"
                            className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer h-32 w-32"
                        >
                            <Upload className="h-6 w-6" />
                            <span className="sr-only">Upload Image</span>
                        </Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const uploadFormData = new FormData();
                                uploadFormData.append("file", file);

                                const toastId = toast.loading("Uploading image...");

                                try {
                                    // Dynamic import to avoid potential client/server boundary issues if any
                                    const { uploadFile } = await import("@/app/actions/upload");
                                    const res = await uploadFile(uploadFormData, "counsellors");

                                    if (res.error || !res.url) throw new Error(res.error || "Upload failed");

                                    setFormData(prev => ({ ...prev, image: res.url! }));

                                    // Auto-save the image change
                                    await adminUpdateCounsellorProfile(counsellor.id, {
                                        ...formData,
                                        image: res.url!
                                    });

                                    toast.success("Image updated successfully", { id: toastId });
                                } catch (error) {
                                    console.error(error);
                                    toast.error("Upload failed", { id: toastId });
                                }
                            }}
                        />
                    </div>
                    <CardTitle>{counsellor.name}</CardTitle>
                    <CardDescription>{counsellor.email}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant={counsellor.isActive ? "default" : "secondary"}>
                            {counsellor.isActive ? "Active" : "Suspended"}
                        </Badge>
                        <Badge variant="outline">Counsellor</Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${counsellor.email}`} className="hover:underline">{counsellor.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {counsellor.createdAt ? new Date(counsellor.createdAt).toLocaleDateString() : "N/A"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{counsellor.stats.activeCases}</div>
                            <div className="text-xs text-muted-foreground">Active Cases</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{counsellor.stats.totalCases}</div>
                            <div className="text-xs text-muted-foreground">Total Cases</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Right Column: Editing Form */}
            <div className="md:col-span-1 lg:col-span-2 space-y-6">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList>
                        <TabsTrigger value="profile">Profile Details</TabsTrigger>
                        <TabsTrigger value="content">Media & Content</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Public Profile</CardTitle>
                                <CardDescription>
                                    Manage the information displayed to users seeking counselling.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Input
                                        id="specialization"
                                        placeholder="e.g. Trauma, Career, Family"
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="experience">Experience</Label>
                                    <Input
                                        id="experience"
                                        placeholder="e.g. 5+ Years, Certified Therapist"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="bio">Biography</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell users about this counsellor..."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="min-h-[150px]"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Profile
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="content">
                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Content</CardTitle>
                                <CardDescription>
                                    Add a video introduction to showcase this counsellor.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Tabs defaultValue={formData.featuredVideo && !formData.featuredVideo.includes("youtube") ? "upload" : "youtube"} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="youtube">YouTube Link</TabsTrigger>
                                        <TabsTrigger value="upload">Upload Video</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="youtube" className="space-y-4 pt-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="video-url">YouTube URL</Label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Video className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="video-url"
                                                        placeholder="https://youtube.com/watch?v=..."
                                                        className="pl-8"
                                                        value={formData.featuredVideo?.includes("youtube") ? formData.featuredVideo : ""}
                                                        onChange={(e) => setFormData({ ...formData, featuredVideo: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="upload" className="space-y-4 pt-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="video-upload">Video File</Label>
                                            <Input
                                                id="video-upload"
                                                type="file"
                                                accept="video/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    const uploadFormData = new FormData();
                                                    uploadFormData.append("file", file);

                                                    const toastId = toast.loading("Uploading video...");

                                                    try {
                                                        const { uploadFile } = await import("@/app/actions/upload");
                                                        const res = await uploadFile(uploadFormData, "videos");

                                                        if (res.error || !res.url) throw new Error(res.error || "Upload failed");

                                                        setFormData({ ...formData, featuredVideo: res.url });
                                                        toast.success("Video uploaded successfully", { id: toastId });
                                                    } catch (error) {
                                                        console.error(error);
                                                        toast.error("Upload failed", { id: toastId });
                                                    }
                                                }}
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Upload MP4, WebM or Ogg video. Max size determined by server settings.
                                            </p>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                {formData.featuredVideo && (
                                    <div className="mt-4 rounded-md overflow-hidden bg-black/10 aspect-video shadow-sm border">
                                        {formData.featuredVideo.includes("youtube") ? (
                                            <iframe
                                                src={formData.featuredVideo.replace("watch?v=", "embed/")}
                                                className="w-full h-full"
                                                title="Video Preview"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video
                                                src={formData.featuredVideo}
                                                controls
                                                className="w-full h-full"
                                            />
                                        )}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="justify-between">
                                <Button variant="outline" onClick={() => setFormData({ ...formData, featuredVideo: "" })}>
                                    Clear Video
                                </Button>
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Content
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
