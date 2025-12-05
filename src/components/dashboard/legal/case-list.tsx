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

export function CaseList({ tickets }: CaseListProps) {
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
        <Card>
            <CardHeader>
                <CardTitle>My Cases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex flex-col space-y-2 border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">{ticket.category.replace("_", " ")}</span>
                            <Badge variant={statusColors[ticket.status] || "secondary"}>
                                {statusLabels[ticket.status] || ticket.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {ticket.description}
                        </p>
                        <span className="text-xs text-muted-foreground">
                            Submitted {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
