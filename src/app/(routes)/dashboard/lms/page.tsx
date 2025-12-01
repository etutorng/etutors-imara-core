"use client";

import { getCourses } from "@/app/actions/lms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useEffect, useState } from "react";

type Course = {
    id: string;
    title: string;
    description: string;
    category: string;
    modules: any[];
    thumbnailUrl: string | null;
};

export default function LMSPage() {
    const { t } = useLanguage();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCourses() {
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (error) {
                console.error("Failed to load courses:", error);
            } finally {
                setLoading(false);
            }
        }
        loadCourses();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4 space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{t("lms.title")}</h1>
                    <p className="text-muted-foreground">{t("lms.description")}</p>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                    {t("common.loading")}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{t("lms.title")}</h1>
                <p className="text-muted-foreground">
                    {t("lms.description")}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <Card key={course.id} className="flex flex-col overflow-hidden">
                        <Link href={`/dashboard/lms/${course.id}`} className="block relative aspect-video w-full bg-muted hover:opacity-90 transition-opacity">
                            {course.thumbnailUrl ? (
                                <img
                                    src={course.thumbnailUrl}
                                    alt={course.title}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <img
                                    src="/thumbnail.png"
                                    alt={course.title}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                        // Fallback if thumbnail.png is missing or fails
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                        const icon = document.createElement('div');
                                        icon.innerHTML = '<svg class="h-12 w-12 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16"/></svg>';
                                        e.currentTarget.parentElement?.appendChild(icon);
                                    }}
                                />
                            )}

                            {/* Play overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
                                <PlayCircle className="h-12 w-12 text-white opacity-80 drop-shadow-md" />
                            </div>
                        </Link>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                <Badge variant="secondary">{course.category}</Badge>
                            </div>
                            <CardDescription className="line-clamp-2">
                                {course.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-sm text-muted-foreground">
                                {course.modules.length} {t("lms.modules")}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/dashboard/lms/${course.id}`} className="w-full">
                                <Button className="w-full">{t("lms.startLearning")}</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                {courses.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        {t("lms.noCourses")}
                    </div>
                )}
            </div>
        </div>
    );
}
