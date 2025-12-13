import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { getUserSession, requestCounselling } from "@/app/actions/counselling";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ActiveSession } from "@/components/counselling/active-session";
import { MessageCircle, HeartHandshake } from "lucide-react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function CounsellingPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signin");
    }

    const { session: counsellingSession } = await getUserSession();

    async function handleRequest() {
        "use server";
        await requestCounselling();
        // Page triggers re-render via revalidate in action
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Counselling Support</h1>
                <p className="text-muted-foreground">
                    Connect with a verified counsellor for confidential support and guidance.
                </p>
            </div>

            {counsellingSession ? (
                <ActiveSession session={counsellingSession} currentUser={session.user} />
            ) : (
                <Card className="max-w-2xl mx-auto mt-12 text-center">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                            <HeartHandshake className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Need someone to talk to?</CardTitle>
                        <CardDescription className="text-lg mt-2">
                            Our counsellors are here to listen and support you. Start a private session now.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleRequest}>
                            <Button size="lg" className="w-full sm:w-auto">
                                <MessageCircle className="mr-2 h-5 w-5" />
                                Request Counselling Session
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
