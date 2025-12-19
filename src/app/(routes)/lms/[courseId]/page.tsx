import { getAlternateCourse, getCourse } from "@/app/actions/lms";
import { AuthActionButton } from "@/components/auth-action-button";
import { CoursePlayer } from "@/components/course-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Course = {
    id: string;
    title: string;
    description: string;
    category: string;
    language: string;
    thumbnailUrl: string | null;
    groupId: string;
    modules: any[];
};

export default async function PublicCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;

    const course = await getCourse(courseId);
    if (!course) {
        notFound();
    }

    const alternateCourse = await getAlternateCourse(course.groupId, course.language);
    const alternateCourseId = alternateCourse?.id;

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <Link href="/lms" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Courses
                    </Link>
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge>{course.category}</Badge>
                                <Badge variant="outline">{course.language === 'en' ? 'English' : 'Hausa'}</Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{course.title}</h1>
                            <p className="text-lg text-slate-600 max-w-2xl">
                                {course.description}
                            </p>
                            <div className="pt-4 hidden lg:block">
                                <AuthActionButton
                                    dashboardUrl={`/dashboard/lms/${course.id}`}
                                    size="lg"
                                    className="text-lg px-8"
                                >
                                    Start Learning
                                </AuthActionButton>
                            </div>
                        </div>

                        {/* Course Player (Preview Mode) */}
                        <div className="w-full lg:w-[600px]">
                            <CoursePlayer
                                course={course}
                                alternateCourseId={alternateCourseId}
                                isPreview={true}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content Preview */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                    <div className="space-y-4">
                        {course.modules.map((module, index) => (
                            <div key={module.id} className="flex items-center p-4 bg-white rounded-lg border hover:border-primary/50 transition-colors">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium mr-4">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-slate-900">{module.title}</h3>
                                    <p className="text-sm text-slate-500">{Math.round(module.duration / 60)} mins</p>
                                </div>
                                <AuthActionButton
                                    dashboardUrl={`/dashboard/lms/${course.id}`}
                                    variant="ghost"
                                    size="sm"
                                >
                                    <PlayCircle className="h-5 w-5 text-primary" />
                                </AuthActionButton>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Banner */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-lg">Join Imara to unlock full access</h3>
                        <p className="text-sm text-muted-foreground">Get offline downloads, progress tracking, and certificates.</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Link href={`/signup?redirect=/dashboard/lms/${course.id}`} className="w-full md:w-auto">
                            <Button size="lg" className="w-full md:w-auto">
                                Join for Free
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
