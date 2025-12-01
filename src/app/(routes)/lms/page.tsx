"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, PlayCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { getCourses } from "@/app/actions/lms";
import { useEffect, useState } from "react";
import { AuthActionButton } from "@/components/auth-action-button";

type Course = {
    id: string;
    title: string;
    description: string;
    category: string;
    modules: any[];
    thumbnailUrl: string | null;
};

export default function PublicLMSPage() {
    const { t } = useLanguage();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCourses() {
            try {
                const data = await getCourses();
                // Show only first 3 courses as preview
                setCourses(data.slice(0, 3));
            } catch (error) {
                console.error("Failed to load courses:", error);
            } finally {
                setLoading(false);
            }
        }
        loadCourses();
    }, []);

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-accent/5 via-background to-primary/5 py-20 md:py-32">
                <div className="container px-4 mx-auto text-center space-y-8 max-w-4xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                        <GraduationCap className="h-4 w-4" />
                        <span>Vocational Training</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Learn a Skill, <span className="text-accent">Own Your Future</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Master practical skills in fashion, technology, and business. Our courses are designed to help you achieve economic independence.
                    </p>

                    <div className="flex justify-center pt-4">
                        <AuthActionButton
                            dashboardUrl="/dashboard/lms"
                            size="lg"
                            className="text-lg px-8 py-6 h-auto"
                        >
                            Start Learning
                        </AuthActionButton>
                    </div>
                </div>
            </section>

            {/* Course Preview */}
            <section className="py-20 container px-4 mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-bold">Popular Courses</h2>
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard/lms">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">
                        {t("common.loading")}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <Card key={course.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                                <Link href={`/lms/${course.id}`} className="block relative aspect-video w-full bg-muted group">
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
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                                const icon = document.createElement('div');
                                                icon.innerHTML = '<svg class="h-12 w-12 opacity-50" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16"/></svg>';
                                                e.currentTarget.parentElement?.appendChild(icon);
                                            }}
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center text-white bg-black/10 group-hover:bg-black/20 transition-colors">
                                        <PlayCircle className="h-12 w-12 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md" />
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
                                    <Link href={`/lms/${course.id}`} className="w-full">
                                        <Button variant="outline" className="w-full">
                                            Preview Course
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
