"use client";

import { Button } from "@/components/ui/button";
import { Download, Languages, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";
import { toast } from "sonner";

interface Module {
    id: string;
    title: string;
    videoUrl: string;
    duration: number;
}

interface Course {
    id: string;
    title: string;
    description: string;
    language: string;
    modules: Module[];
}

interface CoursePlayerProps {
    course: Course;
    alternateCourseId?: string;
    isPreview?: boolean;
}

export function CoursePlayer({ course, alternateCourseId, isPreview = false }: CoursePlayerProps) {
    const router = useRouter();
    const { t } = useLanguage();
    const activeModule = course.modules[0]; // Default to first module for now

    const handleSwitchAudio = () => {
        if (alternateCourseId) {
            router.push(`/lms/${alternateCourseId}`);
        } else {
            toast.error(t("lms.noAlternateAudio"));
        }
    };

    const handleDownload = () => {
        if (isPreview) {
            toast.error(t("lms.signupToAccess", "Sign up to download lessons"));
            return;
        }
        console.log("Downloading course:", course.title);
        toast.success(t("lms.downloadStarted"));
    };

    if (!activeModule) {
        return (
            <div className="aspect-video w-full bg-muted flex items-center justify-center rounded-lg border">
                <p className="text-muted-foreground">{t("lms.noModules")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Video Player */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-black shadow-sm">
                <video
                    src={activeModule.videoUrl}
                    controls
                    className="h-full w-full object-contain"
                    poster={course.thumbnailUrl || undefined}
                >
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold">{activeModule.title}</h2>
                    <p className="text-sm text-muted-foreground">
                        {Math.floor(activeModule.duration / 60)} mins
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSwitchAudio}>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("lms.switchAudio")}
                    </Button>
                    <Button variant="secondary" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        {t("lms.download")}
                    </Button>
                </div>
            </div>

            {/* Description */}
            <div className="rounded-lg border p-4 bg-card text-card-foreground shadow-sm">
                <h3 className="font-semibold mb-2">{t("lms.aboutLesson")}</h3>
                <p className="text-sm text-muted-foreground">{course.description}</p>
            </div>
        </div>
    );
}
