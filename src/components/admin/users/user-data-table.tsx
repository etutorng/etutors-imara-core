"use client";

import { useEffect, useState } from "react";
import { UserType } from "@/db/schema/auth/user";
import { getUsers, updateUser, deleteUser, createUser } from "@/app/actions/admin";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MoreHorizontal, Pencil, Trash2, Plus, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function UserDataTable() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Edit/Create State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [formData, setFormData] = useState<Partial<UserType>>({});
    const [saving, setSaving] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, roleFilter, page]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers({ page, limit: 10, search, role: roleFilter === "ALL" ? "" : roleFilter });
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setTotalUsers(data.total);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: UserType) => {
        setCurrentUser(user);
        setFormData({ ...user });
        setIsEditOpen(true);
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            const res = await deleteUser(userId);
            if (res.error) {
                toast.error(res.error);
                return;
            }
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const handleSaveUser = async () => {
        if (!currentUser) return;
        setSaving(true);
        try {
            const res = await updateUser({
                id: currentUser.id,
                name: formData.name!,
                email: formData.email!,
                role: formData.role as any,
                isActive: formData.isActive || false,
            });

            if (res.error) {
                toast.error(res.error);
                return;
            }

            toast.success("User updated successfully");
            setIsEditOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    // Placeholder for Create - logic requires handling connection/password which we skipped in actions.ts for now.
    // We will show UI but maybe just a simplified version or "Invite" style.
    const handleCreateUser = async () => {
        toast.info("User creation is currently disabled in this demo.");
        setIsCreateOpen(false);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Roles</SelectItem>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            <SelectItem value="CONTENT_EDITOR">Content Editor</SelectItem>
                            <SelectItem value="LEGAL_PARTNER">Legal Partner</SelectItem>
                            <SelectItem value="USER">User</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Loading...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.image || ""} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{user.role.replace("_", " ").toLowerCase()}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.isActive ? "default" : "secondary"}>
                                            {user.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
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

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {users.length} of {totalUsers} users
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

            {/* Edit User Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Make changes to the user profile here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name || ""}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={formData.email || ""}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select
                                value={formData.role}
                                onValueChange={(val: any) => setFormData({ ...formData, role: val })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                    <SelectItem value="CONTENT_EDITOR">Content Editor</SelectItem>
                                    <SelectItem value="LEGAL_PARTNER">Legal Partner</SelectItem>
                                    <SelectItem value="COUNSELLOR">Counsellor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="active" className="text-right">
                                Active
                            </Label>
                            <div className="flex items-center space-x-2 col-span-3">
                                <Switch
                                    id="active"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                                <Label htmlFor="active">{formData.isActive ? "Enabled" : "Disabled"}</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleSaveUser} disabled={saving}>
                            {saving ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create User Modal (Simplified) */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            User creation is handled via public registration for now.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm">Please ask the user to sign up at /signin or implement a full invite system.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
