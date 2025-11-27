"use client";

import { getMentors } from "@/app/actions/mentorship";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n/language-context";
import { useEffect, useState } from "react";

type Mentor = {
    id: string;
    expertise: string;
    bio: string;
    verified: boolean;
};

export default function MentorshipPage() {
    const { t } = useLanguage();
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);

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
                    <Card key={mentor.id}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.id}`} />
                                <AvatarFallback>M</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg">{t("mentorship.mentor")}</CardTitle>
                                <CardDescription>{mentor.expertise}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {mentor.bio}
                            </p>
                            <div className="flex items-center gap-2">
                                {mentor.verified && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                        {t("mentorship.verified")}
                                    </Badge>
                                )}
                            </div>
                            <Button className="w-full">{t("mentorship.requestMentorship")}</Button>
                        </CardContent>
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
