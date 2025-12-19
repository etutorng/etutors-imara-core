"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getTicketReplies, sendReply } from "@/app/actions/legal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Phone, Mail, User as UserIcon, ArrowLeft } from "lucide-react";

interface Ticket {
    id: string;
    description: string;
    category: string;
    status: string;
    priority: string;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
    user?: {
        name: string;
        email: string;
        phoneNumber: string | null;
        image: string | null;
    } | null;
}

interface LegalCaseTableProps {
    tickets: Ticket[];
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "destructive", // Pending usually needs attention
    assigned: "secondary",
    in_progress: "default",
    resolved: "outline",
};

export function LegalCaseTable({ tickets }: LegalCaseTableProps) {
    const [viewMode, setViewMode] = useState<"details" | "chat">("details");
    const [updating, setUpdating] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [replies, setReplies] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [sending, setSending] = useState(false);

    const handleStatusChange = async (ticketId: string, newStatus: string) => {
        setUpdating(ticketId);
        try {
            const { updateTicketStatus } = await import("@/app/actions/legal");
            const result = await updateTicketStatus(ticketId, newStatus);
            if (result.success) {
                toast.success("Status updated");
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setUpdating(null);
        }
    };

    const handleViewDetails = async (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setViewMode("details");
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

    return (
        <div className="rounded-md border bg-card">
            <Dialog open={!!selectedTicket} onOpenChange={(val) => !val && setSelectedTicket(null)}>
                <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                    <div className="p-6 border-b bg-muted/20">
                        <DialogHeader>
                            <div className="flex items-center justify-between">
                                <DialogTitle className="flex items-center gap-2 text-xl">
                                    {viewMode === "chat" && (
                                        <Button variant="ghost" size="icon" onClick={() => setViewMode("details")} className="mr-2 h-8 w-8">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Button>
                                    )}
                                    Case #{selectedTicket?.id.slice(0, 8)}
                                    <Badge variant={selectedTicket ? statusColors[selectedTicket.status] : "default"} className="uppercase text-xs">
                                        {selectedTicket?.status.replace("_", " ")}
                                    </Badge>
                                </DialogTitle>
                                {viewMode === "details" && selectedTicket && (
                                    <Button size="sm" onClick={() => setViewMode("chat")} className="gap-2">
                                        <MessageSquare className="h-4 w-4" /> Open Chat
                                    </Button>
                                )}
                            </div>
                            <DialogDescription>
                                Created {selectedTicket && formatDistanceToNow(new Date(selectedTicket.createdAt), { addSuffix: true })}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    {selectedTicket && (
                        <div className="flex flex-1 overflow-hidden">
                            {viewMode === "details" ? (
                                <ScrollArea className="flex-1 p-6">
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/10">
                                            <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                                <AvatarImage src={selectedTicket.user?.image || ""} />
                                                <AvatarFallback className="text-lg">{selectedTicket.user?.name.charAt(0) || "?"}</AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1 flex-1">
                                                <h3 className="font-semibold text-lg">{selectedTicket.user?.name || "Anonymous User"}</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3" /> {selectedTicket.user?.email || "N/A"}
                                                    </div>
                                                    {selectedTicket.user?.phoneNumber && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3" /> {selectedTicket.user.phoneNumber}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 capitalize">
                                                        <UserIcon className="h-3 w-3" /> {selectedTicket.user ? "Registered User" : "Guest"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Description</h4>
                                            <Card className="p-4 bg-muted/5 border-none shadow-inner">
                                                <p className="whitespace-pre-wrap leading-relaxed text-sm">{selectedTicket.description}</p>
                                            </Card>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Latest Activity</h4>
                                            {loadingReplies ? (
                                                <div className="text-sm text-muted-foreground animate-pulse">Checking for updates...</div>
                                            ) : replies.length > 0 ? (
                                                <div
                                                    className="p-4 rounded-lg border bg-muted/5 cursor-pointer hover:bg-muted/10 transition-colors group"
                                                    onClick={() => setViewMode("chat")}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-sm">
                                                            {replies[replies.length - 1].senderId === selectedTicket.userId ? selectedTicket.user?.name || "User" : "Support Team"}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                                            Click to view full chat &rarr;
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {replies[replies.length - 1].message}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-muted-foreground italic flex items-center gap-2">
                                                    <MessageSquare className="h-4 w-4" /> No replies yet. Start the conversation.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </ScrollArea>
                            ) : (
                                <div className="flex-1 flex flex-col bg-background min-w-0">
                                    <div className="p-3 border-b bg-muted/5 text-sm font-medium flex justify-between items-center sticky top-0 z-10 glass">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4" /> Secure Communication Channel
                                        </div>
                                    </div>
                                    <ScrollArea className="flex-1 p-4 bg-muted/5">
                                        <div className="space-y-6">
                                            {loadingReplies ? (
                                                <div className="flex justify-center p-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                </div>
                                            ) : replies.length === 0 ? (
                                                <div className="text-center text-muted-foreground py-10 space-y-2">
                                                    <MessageSquare className="h-10 w-10 mx-auto opacity-20" />
                                                    <p>No messages yet. Start the secure conversation.</p>
                                                </div>
                                            ) : (
                                                replies.map((reply) => (
                                                    <div key={reply.id} className={cn("flex w-full", reply.senderId === selectedTicket.userId ? "justify-start" : "justify-end")}>
                                                        <div className={cn(
                                                            "max-w-[75%] rounded-2xl p-3 shadow-sm text-sm relative px-4 py-3",
                                                            reply.senderId === selectedTicket.userId ? "bg-white border text-foreground rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none"
                                                        )}>
                                                            <p>{reply.message}</p>
                                                            <div className={cn("text-[10px] mt-1 flex gap-1", reply.senderId === selectedTicket.userId ? "text-muted-foreground" : "text-primary-foreground/70 justify-end")}>
                                                                <span>{reply.senderId === selectedTicket.userId ? selectedTicket?.user?.name || "User" : "Support Team"}</span>
                                                                <span>•</span>
                                                                {formatDistanceToNow(new Date(reply.createdAt))} ago
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>
                                    <div className="p-4 border-t bg-background mt-auto">
                                        <div className="flex gap-2 relative">
                                            <Textarea
                                                placeholder="Type a secure reply..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                className="min-h-[50px] max-h-[150px] resize-none pr-12"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendReply();
                                                    }
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                onClick={handleSendReply}
                                                disabled={sending || !newMessage.trim()}
                                                className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full"
                                            >
                                                {sending ? <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" /> : <Send className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                            Messages are end-to-end encrypted and secure.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                No legal cases found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        tickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                                <TableCell>
                                    {ticket.user ? (
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={ticket.user.image || ""} />
                                                <AvatarFallback>{ticket.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{ticket.user.name}</span>
                                                <span className="text-xs text-muted-foreground">{ticket.user.email}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground italic text-xs">Anonymous</span>
                                    )}
                                </TableCell>
                                <TableCell className="capitalize">{ticket.category.replace("_", " ")}</TableCell>
                                <TableCell className="max-w-[250px] truncate text-muted-foreground text-sm" title={ticket.description}>
                                    {ticket.description}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusColors[ticket.status] || "secondary"} className="capitalize">
                                        {ticket.status.replace("_", " ")}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(ticket)}>
                                            <MessageSquare className="h-4 w-4 mr-1" /> Details
                                        </Button>
                                        <Select
                                            defaultValue={ticket.status}
                                            onValueChange={(val) => handleStatusChange(ticket.id, val)}
                                            disabled={updating === ticket.id}
                                        >
                                            <SelectTrigger className="w-[100px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="assigned">Assigned</SelectItem>
                                                <SelectItem value="in_progress">In Progress</SelectItem>
                                                <SelectItem value="resolved">Resolved</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
