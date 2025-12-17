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
import { getTicketReplies, sendReply } from "@/app/actions/legal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ... existing interfaces ...

export function LegalCaseTable({ tickets }: LegalCaseTableProps) {
    const [updating, setUpdating] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [replies, setReplies] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [sending, setSending] = useState(false);

    const handleStatusChange = async (ticketId: string, newStatus: string) => {
        // ... existing logic ...
    };

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

    return (
        <div className="rounded-md border">
            <Dialog open={!!selectedTicket} onOpenChange={(val) => !val && setSelectedTicket(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Case Details</DialogTitle>
                        <DialogDescription>
                            Review case information and communicate with the user.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTicket && (
                        <div className="flex-1 overflow-hidden flex flex-col gap-4">
                            <div className="grid gap-2 p-4 bg-muted/30 rounded-lg text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <div><span className="font-semibold">User ID:</span> {selectedTicket.userId || "Anonymous"}</div>
                                    <div><span className="font-semibold">Category:</span> {selectedTicket.category}</div>
                                    <div><span className="font-semibold">Status:</span> <Badge variant={statusColors[selectedTicket.status]}>{selectedTicket.status}</Badge></div>
                                    <div><span className="font-semibold">Date:</span> {new Date(selectedTicket.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="mt-2">
                                    <span className="font-semibold">Description:</span>
                                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{selectedTicket.description}</p>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col border rounded-md overflow-hidden min-h-[300px]">
                                <div className="p-2 bg-muted border-b text-sm font-medium">Conversation</div>
                                <ScrollArea className="flex-1 p-4">
                                    {loadingReplies ? (
                                        <div className="text-center text-muted-foreground text-sm py-8">Loading messages...</div>
                                    ) : replies.length === 0 ? (
                                        <div className="text-center text-muted-foreground text-sm py-8">No messages yet. Start the conversation.</div>
                                    ) : (
                                        <div className="space-y-4">
                                            {replies.map((reply) => (
                                                <div key={reply.id} className={cn("flex flex-col max-w-[80%]", reply.senderId ? "ml-auto items-end" : "items-start")}>
                                                    <div className={cn("p-3 rounded-lg text-sm", reply.senderId ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                                        {reply.message}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground mt-1">
                                                        {reply.senderId ? "Admin" : "System"} • {formatDistanceToNow(new Date(reply.createdAt))} ago
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

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>User ID</TableHead>
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
                                <TableCell className="whitespace-nowrap">
                                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell className="capitalize">{ticket.category.replace("_", " ")}</TableCell>
                                <TableCell className="max-w-[300px] truncate" title={ticket.description}>
                                    {ticket.description}
                                </TableCell>
                                <TableCell className="font-mono text-xs">
                                    {ticket.userId ? ticket.userId.slice(0, 8) + "..." : "Anonymous"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusColors[ticket.status] || "secondary"}>
                                        {ticket.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(ticket)}>
                                            <MessageSquare className="h-4 w-4 mr-1" /> View
                                        </Button>
                                        <Select
                                            defaultValue={ticket.status}
                                            onValueChange={(val) => handleStatusChange(ticket.id, val)}
                                            disabled={updating === ticket.id}
                                        >
                                            <SelectTrigger className="w-[110px] h-8">
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
