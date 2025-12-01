"use client";

import { getMentors } from "@/app/actions/mentorship";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChatShell } from "@/components/chat-shell";
import { useLanguage } from "@/lib/i18n/language-context";
import { useEffect, useState } from "react";
import { MessageCircle, ShieldCheck } from "lucide-react";

type Mentor = {
    id: string;
    name: string;
    imageUrl: string | null;
    expertise: string;
    bio: string;
    verified: boolean;
};

export default function DashboardCounsellingPage() {
    const { t } = useLanguage();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    useEffect(() => {
        async function loadMentors() {
            try {
                const data = await getMentors();
                setMentors(data);
            } catch (error) {
                console.error("Failed to load mentors:", error);
            } finally {
                setLoading(false);
            }
        }
        loadMentors();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4 space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{t("mentorship.title")}</h1>
                    <p className="text-muted-foreground">{t("mentorship.description")}</p>
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
                <h1 className="text-3xl font-bold tracking-tight">{t("mentorship.title")}</h1>
                <p className="text-muted-foreground">
                    {t("mentorship.description")}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mentors.map((mentor) => (
                    <Card key={mentor.id} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={mentor.imageUrl || undefined} />
                                <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {mentor.name}
                                    {mentor.verified && (
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                    )}
                                </CardTitle>
                                <Badge variant="secondary" className="w-fit">
                                    {mentor.expertise}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <CardDescription className="line-clamp-3">
                                {mentor.bio}
                            </CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full" onClick={() => setSelectedMentor(mentor)}>
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        {t("mentorship.requestMentorship")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none">
                                    {selectedMentor && (
                                        <ChatShell
                                            mentorName={selectedMentor.name}
                                            mentorImage={selectedMentor.imageUrl}
                                            onClose={() => setSelectedMentor(null)}
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                ))}
                {mentors.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        {t("mentorship.noMentors")}
                    </div>
                )}
            </div>
        </div>
    );
}
