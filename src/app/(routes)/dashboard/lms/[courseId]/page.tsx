import { getAlternateCourse, getCourse } from "@/app/actions/lms";
import { CoursePlayer } from "@/components/course-player";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        courseId: string;
    }>;
}

export default async function CoursePage({ params }: PageProps) {
    const { courseId } = await params;
    const course = await getCourse(courseId);

    if (!course) {
        notFound();
    }

    const alternateCourse = await getAlternateCourse(course.groupId, course.language);

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/lms">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <CoursePlayer
                        course={course}
                        alternateCourseId={alternateCourse?.id}
                    />
                </div>

                <div className="space-y-6">
                    {/* Future: Course Progress, Related Courses, etc. */}
                    <div className="rounded-lg border p-4 bg-muted/50">
                        <h3 className="font-semibold mb-2">Course Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Category</span>
                                <span className="font-medium">{course.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Language</span>
                                <span className="font-medium uppercase">{course.language}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Modules</span>
                                <span className="font-medium">{course.modules.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
