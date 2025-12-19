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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Eye, Mail, Phone, MapPin, GraduationCap, Laptop } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/scholarship";
import { type Application } from "@/lib/schemas/scholarship";

interface ScholarshipApplicationsTableProps {
    applications: Application[];
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    approved: "default",
    rejected: "destructive",
};

export function ScholarshipApplicationsTable({ applications }: ScholarshipApplicationsTableProps) {
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    const handleStatusChange = async (id: string, newStatus: "pending" | "approved" | "rejected") => {
        setUpdating(id);
        try {
            const result = await updateApplicationStatus(id, newStatus);
            if (result.success) {
                toast.success("Application status updated");
                // In a real app with server actions and revalidatePath, the page would reload or we'd router.refresh()
                // Here we might need to manually update state if we want instant feedback without refresh in this mock
                // For now, let's assume the parent page revalidates or we just show toast
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
        <div className="rounded-md border bg-card">
            <Dialog open={!!selectedApp} onOpenChange={(val) => !val && setSelectedApp(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            Application Details
                            <Badge variant={selectedApp ? statusColors[selectedApp.status] : "default"} className="capitalize">
                                {selectedApp?.status}
                            </Badge>
                        </DialogTitle>
                        <DialogDescription>
                            Submitted {selectedApp && formatDistanceToNow(new Date(selectedApp.createdAt), { addSuffix: true })}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedApp && (
                        <div className="flex-1 overflow-y-auto pr-4 -mr-4 pl-1">
                            <div className="space-y-6 py-4">
                                <div className="flex items-start gap-4 p-4 border rounded-lg bg-muted/20">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                        {selectedApp.fullName.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg">{selectedApp.fullName}</h3>
                                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3" /> {selectedApp.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-3 w-3" /> {selectedApp.phone}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3 w-3" /> {selectedApp.lga}, {selectedApp.state} State
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                                            <GraduationCap className="h-4 w-4" /> Qualification
                                        </div>
                                        <div className="font-semibold">{selectedApp.qualification}</div>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                                            <Laptop className="h-4 w-4" /> Selected Skill
                                        </div>
                                        <div className="font-semibold">{selectedApp.skill}</div>
                                    </div>
                                </div>

                                {selectedApp.certificateUrl && (
                                    <div className="p-4 border rounded-lg bg-muted/10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <GraduationCap className="h-4 w-4" /> O-Level Certificate
                                            </div>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={selectedApp.certificateUrl} target="_blank" rel="noopener noreferrer">
                                                    <Eye className="h-4 w-4 mr-2" /> View Certificate
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Statement of Purpose</h4>
                                    <div className="p-4 bg-muted/10 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedApp.essay}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Skill</TableHead>
                        <TableHead>Qualification</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                No applications found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        applications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{app.fullName}</span>
                                        <span className="text-xs text-muted-foreground">{app.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{app.skill}</TableCell>
                                <TableCell>{app.qualification}</TableCell>
                                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                                    {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusColors[app.status]} className="capitalize">
                                        {app.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)}>
                                            <Eye className="h-4 w-4 mr-1" /> View
                                        </Button>
                                        <Select
                                            defaultValue={app.status}
                                            onValueChange={(val: any) => handleStatusChange(app.id, val)}
                                            disabled={updating === app.id}
                                        >
                                            <SelectTrigger className="w-[100px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approve</SelectItem>
                                                <SelectItem value="rejected">Reject</SelectItem>
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
