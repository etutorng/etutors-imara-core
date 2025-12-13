"use client";

import { getMentors } from "@/app/actions/mentorship";
import {
    requestCounselling,
    getMentorSession
} from "@/app/actions/counselling";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CounsellingChat } from "@/components/counselling/counselling-chat";
import { useLanguage } from "@/lib/i18n/language-context";
import { useEffect, useState } from "react";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

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
    const [currentSession, setCurrentSession] = useState<any>(null);
    const [isRequesting, setIsRequesting] = useState(false);

    // Fetch user for chat context
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch User
                const authRes = await fetch("/api/auth/get-session");
                const authData = await authRes.json();
                if (authData?.user) {
                    setCurrentUser(authData.user);
                }

                // Fetch Mentors
                const data = await getMentors();
                setMentors(data);
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleOpenChat = async (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setIsRequesting(true);
        setCurrentSession(null);

        try {
            // 1. Check for existing session
            const res = await getMentorSession(mentor.id);
            if (res.session) {
                setCurrentSession(res.session);
            } else {
                // 2. If no session, create one immediately
                const createRes = await requestCounselling(mentor.id);
                if (createRes.success && createRes.session) {
                    // Fetch full session with relations
                    const fullRes = await getMentorSession(mentor.id);
                    if (fullRes.session) setCurrentSession(fullRes.session);
                } else if (createRes.error) {
                    toast.error(createRes.error);
                }
            }
        } catch (err) {
            toast.error("Failed to connect");
        } finally {
            setIsRequesting(false);
        }
    };

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
                <h1 className="text-3xl font-bold tracking-tight">Find a Counsellor</h1>
                <p className="text-muted-foreground">
                    Connect with experienced women who can guide you.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mentors.map((mentor) => (
                    <Card key={mentor.id} className="flex flex-col hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
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
                                <Badge variant="outline" className="w-fit">
                                    {mentor.expertise}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <CardDescription className="line-clamp-3 text-sm">
                                {mentor.bio}
                            </CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full" onClick={() => handleOpenChat(mentor)}>
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Request Counselling
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none w-full max-w-[400px]">
                                    {selectedMentor && currentUser && (
                                        <div className="bg-background rounded-lg shadow-xl overflow-hidden flex flex-col h-[600px]">
                                            {isRequesting ? (
                                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                    <p className="text-muted-foreground">Connecting to {selectedMentor.name}...</p>
                                                </div>
                                            ) : currentSession ? (
                                                <CounsellingChat session={currentSession} currentUser={currentUser} />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <p className="text-destructive">Failed to load session.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                ))}
                {mentors.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        No counsellors are available at the moment.
                    </div>
                )}
            </div>
        </div>
    );
}
