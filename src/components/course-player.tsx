"use client";

import { Button } from "@/components/ui/button";
import { Download, Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

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
    thumbnailUrl: string | null;
    language: string;
    modules: Module[];
}

interface Translation {
    id: string;
    language: string;
    title: string;
}

interface CoursePlayerProps {
    course: Course;
    translations?: Translation[];
    isPreview?: boolean;
}

const LANGUAGE_LABELS: Record<string, string> = {
    en: "English",
    ha: "Hausa",
    yo: "Yoruba",
    ig: "Igbo",
    pcm: "Pidgin",
};

function getYouTubeEmbedUrl(url: string) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
}

export function CoursePlayer({ course, translations = [], isPreview = false }: CoursePlayerProps) {

    const { t } = useLanguage();
    const activeModule = course.modules[0]; // Default to first module for now

    const handleDownload = () => {
        if (isPreview) {
            toast.error(t("lms.signupToAccess"));
            return;
        }

        // Trigger download
        const link = document.createElement('a');
        link.href = activeModule.videoUrl;
        link.download = activeModule.title || 'video';
        link.target = "_blank"; // Fallback for some browsers
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(t("lms.downloadStarted"));
    };

    // Sort translations: Current first, then others
    const otherTranslations = translations.filter(t => t.id !== course.id);

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
                {getYouTubeEmbedUrl(activeModule.videoUrl) ? (
                    <iframe
                        src={getYouTubeEmbedUrl(activeModule.videoUrl)}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={activeModule.title}
                    />
                ) : (
                    <video
                        src={activeModule.videoUrl}
                        controls
                        className="h-full w-full object-contain"
                        poster={course.thumbnailUrl || undefined}
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
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
                    {otherTranslations.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Languages className="mr-2 h-4 w-4" />
                                    {t("lms.switchAudio")}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {translations.map((trans) => (
                                    <DropdownMenuItem key={trans.id} asChild>
                                        <Link href={`/lms/${trans.id}`} className="flex items-center justify-between w-full cursor-pointer">
                                            <span>{LANGUAGE_LABELS[trans.language] || trans.language.toUpperCase()}</span>
                                            {trans.id === course.id && <span className="ml-2 text-xs text-muted-foreground">({t("lms.current")})</span>}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {!getYouTubeEmbedUrl(activeModule.videoUrl) && (
                        <Button variant="secondary" onClick={handleDownload} className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            {t("lms.download")}
                        </Button>
                    )}
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

