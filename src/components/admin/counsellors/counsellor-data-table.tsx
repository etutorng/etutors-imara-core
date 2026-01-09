"use client";

import { useEffect, useState } from "react";
import { getAdminCounsellors, updateCounsellorStatus, adminUpdateCounsellorProfile } from "@/app/actions/admin-counsellors";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreHorizontal, Pencil, Search, Shield, Ban, CheckCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CounsellorType {
    id: string;
    name: string;
    email: string;
    image: string | null;
    isActive: boolean;
    bio: string | null;
    specialization: string | null;
    experience?: string | null; // This might be missing from schema in types but added in DB
    stats: {
        activeCases: number;
        totalCases: number;
        rating: number;
    };
}

export function CounsellorDataTable() {
    const [counsellors, setCounsellors] = useState<CounsellorType[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Dialog State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCounsellor, setSelectedCounsellor] = useState<CounsellorType | null>(null);
    const [formData, setFormData] = useState({ bio: "", specialization: "", experience: "" });
    const [saving, setSaving] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCounsellors();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, page]);

    const fetchCounsellors = async () => {
        setLoading(true);
        try {
            const data = await getAdminCounsellors({ page, limit: 10, search });
            // Type assertion here to match our enriched type
            setCounsellors(data.counsellors as unknown as CounsellorType[]);
            setTotalPages(data.totalPages);
            setTotalUsers(data.total);
        } catch (error) {
            toast.error("Failed to fetch counsellors");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (counsellor: CounsellorType) => {
        const newStatus = !counsellor.isActive;
        const confirmMsg = newStatus
            ? "Are you sure you want to activate this counsellor?"
            : "Are you sure you want to suspend this counsellor? They will not be able to log in.";

        if (!confirm(confirmMsg)) return;

        try {
            const res = await updateCounsellorStatus(counsellor.id, newStatus);
            if (res.success) {
                toast.success(`Counsellor ${newStatus ? 'activated' : 'suspended'}`);
                fetchCounsellors();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleEditClick = (counsellor: CounsellorType) => {
        setSelectedCounsellor(counsellor);
        setFormData({
            bio: counsellor.bio || "",
            specialization: counsellor.specialization || "",
            experience: counsellor.experience || ""
        });
        setIsEditOpen(true);
    };

    const handleSaveProfile = async () => {
        if (!selectedCounsellor) return;
        setSaving(true);
        try {
            const res = await adminUpdateCounsellorProfile(selectedCounsellor.id, formData);
            if (res.success) {
                toast.success("Profile updated");
                setIsEditOpen(false);
                fetchCounsellors();
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const handleSendMessage = (email: string) => {
        // Since we don't have a real chat for admin->counsellor yet, open mailto
        window.location.href = `mailto:${email}`;
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search counsellors..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Counsellor</TableHead>
                            <TableHead>Specialization</TableHead>
                            <TableHead className="text-center">Active Cases</TableHead>
                            <TableHead className="text-center">Total Cases</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Loading...
                                </TableCell>
                            </TableRow>
                        ) : counsellors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No counsellors found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            counsellors.map((counsellor) => (
                                <TableRow key={counsellor.id}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={counsellor.image || ""} alt={counsellor.name} />
                                            <AvatarFallback>{counsellor.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <Link href={`/admin/counsellors/${counsellor.id}`} className="font-medium text-sm hover:underline hover:text-primary cursor-pointer">
                                                {counsellor.name}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">{counsellor.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {counsellor.specialization ? (
                                            <Badge variant="outline">{counsellor.specialization}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center font-medium">
                                        {counsellor.stats.activeCases}
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {counsellor.stats.totalCases}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={counsellor.isActive ? "default" : "secondary"}>
                                            {counsellor.isActive ? "Active" : "Suspended"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/counsellors/${counsellor.id}`} className="flex items-center cursor-pointer">
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleSendMessage(counsellor.email)}>
                                                    <Mail className="mr-2 h-4 w-4" /> Send Email
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleToggleStatus(counsellor)} className={counsellor.isActive ? "text-red-600" : "text-green-600"}>
                                                    {counsellor.isActive ? (
                                                        <>
                                                            <Ban className="mr-2 h-4 w-4" /> Suspend
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Activate
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Logic similar to UserTable can be added here */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {counsellors.length} of {totalUsers} counsellors
                </p>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Counsellor Profile</DialogTitle>
                        <DialogDescription>
                            Update the public profile details for {selectedCounsellor?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="specialization" className="text-right">Specialization</Label>
                            <Input
                                id="specialization"
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="experience" className="text-right">Experience</Label>
                            <Input
                                id="experience"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">Bio</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="col-span-3 min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveProfile} disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
