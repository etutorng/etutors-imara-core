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
                    <Card key={course.id} className="flex flex-col">
                        <div className="aspect-video w-full bg-muted relative">
                            {/* Placeholder for thumbnail */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <PlayCircle className="h-12 w-12 opacity-50" />
                            </div>
                        </div>
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
                            <Link href={`/lms/${course.id}`} className="w-full">
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
