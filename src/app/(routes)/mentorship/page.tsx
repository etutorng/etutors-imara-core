"use client";

import { getMentors } from "@/app/actions/mentorship";
import { ChatShell } from "@/components/chat-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/lib/i18n/language-context";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Mentor = {
    id: string;
    name: string;
    imageUrl: string | null;
    expertise: string;
    bio: string;
    verified: boolean;
};

const FILTERS = ["All", "Health", "Legal", "Vocational"];

export default function MentorshipPage() {
    const { t } = useLanguage();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    useEffect(() => {
        loadMentors();
    }, []);

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

    const filteredMentors = activeFilter === "All"
        ? mentors
        : mentors.filter(m => m.expertise === activeFilter);

    if (loading) {
        return (
            <div className="container mx-auto p-4 space-y-6 text-center py-12 text-muted-foreground">
                {t("common.loading")}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t("mentorship.title")}</h1>
                        <p className="text-muted-foreground">{t("mentorship.description")}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {FILTERS.map((filter) => (
                    <Button
                        key={filter}
                        variant={activeFilter === filter ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveFilter(filter)}
                        className="rounded-full"
                    >
                        {filter}
                    </Button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMentors.map((mentor) => (
                    <Card key={mentor.id} className="flex flex-col">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={mentor.imageUrl || undefined} />
                                <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-lg">{mentor.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary">{mentor.expertise}</Badge>
                                    {mentor.verified && (
                                        <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-1 flex flex-col">
                            <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                                {mentor.bio}
                            </p>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full" onClick={() => setSelectedMentor(mentor)}>
                                        {t("mentorship.requestMentorship")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
                                    {selectedMentor && (
                                        <ChatShell
                                            mentorName={selectedMentor.name}
                                            mentorImage={selectedMentor.imageUrl}
                                            onClose={() => setSelectedMentor(null)} // Close logic handled by Dialog usually, but passed for custom close
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                ))}

                {filteredMentors.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        {t("mentorship.noMentors")}
                    </div>
                )}
            </div>
        </div>
    );
}
