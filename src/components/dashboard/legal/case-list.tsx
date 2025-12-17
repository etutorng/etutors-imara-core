"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Ticket {
    id: string;
    category: string;
    description: string;
    status: string;
    createdAt: Date;
}

interface CaseListProps {
    tickets: Ticket[];
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    assigned: "outline",
    in_progress: "default",
    resolved: "outline", // Greenish usually, but using outline for now or custom class
};

const statusLabels: Record<string, string> = {
    pending: "Pending Review",
    assigned: "Assigned to Partner",
    in_progress: "In Progress",
    resolved: "Resolved",
};

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import { getTicketReplies, sendReply } from "@/app/actions/legal";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ... existing interfaces ...

export function CaseList({ tickets }: CaseListProps) {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [replies, setReplies] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [sending, setSending] = useState(false);

    const handleViewDetails = async (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setLoadingReplies(true);
        try {
            const data = await getTicketReplies(ticket.id);
            setReplies(data);
        } catch (error) {
            toast.error("Failed to load messages");
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleSendReply = async () => {
        if (!selectedTicket || !newMessage.trim()) return;
        setSending(true);
        try {
            const result = await sendReply(selectedTicket.id, newMessage);
            if (result.success) {
                setNewMessage("");
                const data = await getTicketReplies(selectedTicket.id);
                setReplies(data);
                toast.success("Reply sent");
            } else {
                toast.error("Failed to send reply");
            }
        } catch (error) {
            toast.error("Error sending reply");
        } finally {
            setSending(false);
        }
    };

    if (tickets.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Cases</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">You haven't submitted any cases yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Dialog open={!!selectedTicket} onOpenChange={(val) => !val && setSelectedTicket(null)}>
                <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Case Details</DialogTitle>
                        <DialogDescription>
                            Review current status and communicate with support.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTicket && (
                        <div className="flex-1 overflow-hidden flex flex-col gap-4">
                            <div className="p-4 bg-muted/30 rounded-lg text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold capitalize">{selectedTicket.category.replace("_", " ")}</span>
                                    <Badge variant={statusColors[selectedTicket.status] || "secondary"}>
                                        {statusLabels[selectedTicket.status] || selectedTicket.status}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground whitespace-pre-wrap">{selectedTicket.description}</p>
                                <div className="text-xs text-muted-foreground pt-2 border-t mt-2">
                                    Submitted {new Date(selectedTicket.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col border rounded-md overflow-hidden min-h-[300px]">
                                <div className="p-2 bg-muted border-b text-sm font-medium">Conversation</div>
                                <ScrollArea className="flex-1 p-4">
                                    {loadingReplies ? (
                                        <div className="text-center text-muted-foreground text-sm py-8">Loading messages...</div>
                                    ) : replies.length === 0 ? (
                                        <div className="text-center text-muted-foreground text-sm py-8">No messages yet. We will reply shortly.</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {replies.map((reply) => (
                                                <div key={reply.id} className={cn("flex flex-col max-w-[80%]", !reply.senderId || reply.senderId === selectedTicket.userId ? "ml-auto items-end" : "items-start")}>
                                                    <div className={cn("p-3 rounded-lg text-sm", !reply.senderId || reply.senderId === selectedTicket.userId ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                                        {reply.message}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground mt-1">
                                                        {!reply.senderId || reply.senderId === selectedTicket.userId ? "You" : "Support"} • {formatDistanceToNow(new Date(reply.createdAt))} ago
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                                <div className="p-3 border-t flex gap-2">
                                    <Input
                                        placeholder="Type your reply..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendReply()}
                                    />
                                    <Button size="icon" onClick={handleSendReply} disabled={sending || !newMessage.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <CardTitle>My Cases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="flex flex-col space-y-2 border-b pb-4 last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                            onClick={() => handleViewDetails(ticket)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium capitalize">{ticket.category.replace("_", " ")}</span>
                                <Badge variant={statusColors[ticket.status] || "secondary"}>
                                    {statusLabels[ticket.status] || ticket.status}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {ticket.description}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                </span>
                                <Button variant="ghost" size="xs" className="h-6 text-xs">
                                    View & Reply
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    );
}
