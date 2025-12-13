"use client";

import { useState } from "react";
import { assignCounsellor } from "@/app/actions/counselling";
import { CounsellingChat } from "@/components/counselling/counselling-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CounsellorDashboardProps {
    queue: {
        pending: any[];
        active: any[];
    };
    currentUser: any;
}

export function CounsellorDashboard({ queue, currentUser }: CounsellorDashboardProps) {
    const [selectedSession, setSelectedSession] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState("pending");
    const router = useRouter();

    const handleAssign = async (sessionId: string) => {
        try {
            const res = await assignCounsellor(sessionId);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Session assigned successfully");
                // Refresh data
                router.refresh();
                // In a real app we might want to optimistically move it, but refresh is safer for sync
                setSelectedSession(null);
            }
        } catch (error) {
            toast.error("Failed to assign session");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* Sidebar List */}
            <Card className="md:col-span-1 flex flex-col h-full">
                <CardHeader className="py-4">
                    <CardTitle>Sessions</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                    <Tabs defaultValue="pending" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
                        <div className="px-4 mb-2">
                            <TabsList className="w-full">
                                <TabsTrigger value="pending" className="flex-1">Queue ({queue.pending.length})</TabsTrigger>
                                <TabsTrigger value="active" className="flex-1">My Active ({queue.active.length})</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="pending" className="flex-1 overflow-hidden m-0">
                            <ScrollArea className="h-full">
                                <div className="space-y-1 p-2">
                                    {queue.pending.length === 0 && (
                                        <p className="text-center text-muted-foreground py-8 text-sm">No pending requests.</p>
                                    )}
                                    {queue.pending.map((session) => (
                                        <button
                                            key={session.id}
                                            onClick={() => setSelectedSession(session)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 hover:bg-muted ${selectedSession?.id === session.id ? "bg-muted" : ""
                                                }`}
                                        >
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={session.user.image} />
                                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-sm truncate">{session.user.name}</span>
                                                    <Badge variant="outline" className="text-[10px]">NEW</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    Requested {new Date(session.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="active" className="flex-1 overflow-hidden m-0">
                            <ScrollArea className="h-full">
                                <div className="space-y-1 p-2">
                                    {queue.active.length === 0 && (
                                        <p className="text-center text-muted-foreground py-8 text-sm">No active sessions.</p>
                                    )}
                                    {queue.active.map((session) => (
                                        <button
                                            key={session.id}
                                            onClick={() => setSelectedSession(session)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 hover:bg-muted ${selectedSession?.id === session.id ? "bg-muted" : ""
                                                }`}
                                        >
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={session.user.image} />
                                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-sm truncate">{session.user.name}</span>
                                                    <span className="text-[10px] text-green-600 flex items-center gap-1">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Online
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    Active since {new Date(session.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Main Area */}
            <div className="md:col-span-2 h-full flex flex-col">
                {selectedSession ? (
                    selectedSession.status === "PENDING" ? (
                        <Card className="h-full flex flex-col justify-center items-center text-center p-8">
                            <div className="bg-primary/10 p-6 rounded-full mb-6">
                                <User className="h-12 w-12 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{selectedSession.user.name}</h2>
                            <p className="text-muted-foreground mb-8 max-w-md">
                                This user is requesting a counselling session. Review their profile and accept the request to start chatting.
                            </p>
                            <Button size="lg" onClick={() => handleAssign(selectedSession.id)}>
                                <Check className="mr-2 h-4 w-4" /> Accept Request
                            </Button>
                        </Card>
                    ) : (
                        <CounsellingChat session={selectedSession} currentUser={currentUser} />
                    )
                ) : (
                    <Card className="h-full flex flex-col justify-center items-center text-center text-muted-foreground p-8">
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <p>Select a session from the list to view details or start chatting.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
