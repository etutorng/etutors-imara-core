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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "@/db/schema/auth/user";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { RoleModal } from "./role-modal";

interface UserTableProps {
    users: UserType[];
}

export function UserTable({ users }: UserTableProps) {
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    return (
        <>
            <div className="rounded-md border">
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
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.image || ""} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{user.role}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.isActive ? "default" : "secondary"}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit Role</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {selectedUser && (
                <RoleModal
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    userId={selectedUser.id}
                    currentRole={selectedUser.role || "USER"}
                    userName={selectedUser.name}
                />
            )}
        </>
    );
}
