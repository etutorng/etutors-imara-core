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
import { formatDistanceToNow } from "date-fns";
import { updateTicketStatus } from "@/app/actions/legal";
import { toast } from "sonner";
import { useState } from "react";

interface Ticket {
    id: string;
    userId: string | null;
    category: string;
    description: string;
    status: string;
    createdAt: Date;
}

interface LegalCaseTableProps {
    tickets: Ticket[];
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    assigned: "outline",
    in_progress: "default",
    resolved: "outline",
};

export function LegalCaseTable({ tickets }: LegalCaseTableProps) {
    const [updating, setUpdating] = useState<string | null>(null);

    const handleStatusChange = async (ticketId: string, newStatus: string) => {
        setUpdating(ticketId);
        try {
            const result = await updateTicketStatus(ticketId, newStatus);
            if (result.success) {
                toast.success("Status updated successfully");
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="rounded-md border">
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
                                    <Select
                                        defaultValue={ticket.status}
                                        onValueChange={(val) => handleStatusChange(ticket.id, val)}
                                        disabled={updating === ticket.id}
                                    >
                                        <SelectTrigger className="w-[130px] h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="assigned">Assigned</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
