import { getCounsellorById, requestCounselling } from "@/app/actions/counselling";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Calendar, Clock, GraduationCap, MapPin, MessageSquare, ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { GradientCard } from "@/components/ui/gradient-card";
import { AuthActionButton } from "@/components/auth-action-button";
import Link from "next/link";

interface PageProps {
    params: Promise<{
        counsellorId: string;
    }>;
}

export default async function CounsellorBioPage({ params }: PageProps) {
    const { counsellorId } = await params;
    const counsellor = await getCounsellorById(counsellorId);

    if (!counsellor) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            <Link href="/counselling" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Counsellors
            </Link>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="md:col-span-1">
                    <GradientCard variant="default" className="p-6 sticky top-24">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="relative">
                                <Avatar className="h-40 w-40 border-4 border-background shadow-xl">
                                    <AvatarImage src={counsellor.image || undefined} alt={counsellor.name} />
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                        {counsellor.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-1 right-1 bg-background rounded-full p-1.5 shadow-sm">
                                    <BadgeCheck className="h-8 w-8 text-primary fill-background" />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold">{counsellor.name}</h1>
                                {counsellor.specialization && (
                                    <p className="text-primary font-medium mt-1">{counsellor.specialization}</p>
                                )}
                            </div>

                            <div className="w-full pt-4 border-t space-y-3">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                                    <GraduationCap className="h-4 w-4" />
                                    <span>{counsellor.experience || "Verified Professional"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground justify-center">
                                    <MapPin className="h-4 w-4" />
                                    <span>Online / Remote</span>
                                </div>
                            </div>

                            <AuthActionButton
                                dashboardUrl={`/dashboard/counselling?counsellorId=${counsellor.id}`}
                                className="w-full mt-4"
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Request Session
                            </AuthActionButton>
                        </div>
                    </GradientCard>
                </div>

                {/* Right Column: Bio & Details */}
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">About Me</h2>
                        <div className="prose prose-stone max-w-none text-muted-foreground">
                            {counsellor.bio ? (
                                <p className="whitespace-pre-line leading-relaxed">
                                    {counsellor.bio}
                                </p>
                            ) : (
                                <p className="italic">No biography available.</p>
                            )}
                        </div>
                    </section>

                    {(counsellor as any).featuredVideo && (
                        <section>
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted shadow-sm">
                                {(counsellor as any).featuredVideo.includes("youtube") || (counsellor as any).featuredVideo.includes("youtu.be") ? (
                                    <iframe
                                        src={(counsellor as any).featuredVideo.replace("watch?v=", "embed/")}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        src={(counsellor as any).featuredVideo}
                                        controls
                                        className="w-full h-full object-cover"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Areas of Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {/* Mock tags if they don't have separate DB field yet, or parse from specialization */}
                            {counsellor.specialization ? (
                                counsellor.specialization.split(',').map((spec, i) => (
                                    <span key={i} className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary/50">
                                        {spec.trim()}
                                    </span>
                                ))
                            ) : (
                                <span className="text-muted-foreground">General Counselling</span>
                            )}
                        </div>
                    </section>

                    <GradientCard variant="accent" className="p-6 mt-8">
                        <div className="flex items-start gap-4">
                            <div className="rounded-full bg-accent/10 p-3">
                                <Calendar className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Availability</h3>
                                <p className="text-muted-foreground mb-4">
                                    I am generally available for sessions during weekdays. Request a session to discuss specific timing.
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Clock className="h-4 w-4" />
                                    <span>Typically responds within 24 hours</span>
                                </div>
                            </div>
                        </div>
                    </GradientCard>
                </div>
            </div>
        </div>
    );
}
