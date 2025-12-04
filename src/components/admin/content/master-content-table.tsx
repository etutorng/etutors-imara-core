"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Video, FileText, Image as ImageIcon } from "lucide-react";
import { MultilingualModal } from "./multilingual-modal";

interface Resource {
    id: string;
    groupId: string;
    title: string;
    description: string | null;
    url: string;
    language: string;
    category: string;
    format: string;
    thumbnail: string | null;
    createdAt: Date;
}

interface GroupedResource extends Resource {
    translations: Resource[];
}

interface MasterContentTableProps {
    data: GroupedResource[];
}

const LANGUAGES = ["en", "ha", "ig", "yo", "pcm"];

export function MasterContentTable({ data }: MasterContentTableProps) {
    const [selectedGroup, setSelectedGroup] = useState<GroupedResource | null>(null);

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Translations</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No content found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.groupId}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {item.format === "video" ? <Video className="h-4 w-4 text-blue-500" /> :
                                                item.format === "image" ? <ImageIcon className="h-4 w-4 text-purple-500" /> :
                                                    <FileText className="h-4 w-4 text-orange-500" />}
                                            {item.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{item.category}</TableCell>
                                    <TableCell className="capitalize">{item.format}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {LANGUAGES.map((lang) => {
                                                const hasTranslation = item.translations.some(t => t.language === lang) || item.language === lang;
                                                return (
                                                    <Badge
                                                        key={lang}
                                                        variant={hasTranslation ? "default" : "secondary"}
                                                        className={`uppercase text-[10px] px-1.5 ${hasTranslation ? "bg-green-600 hover:bg-green-700" : "text-muted-foreground"}`}
                                                    >
                                                        {lang}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedGroup(item)}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedGroup && (
                <MultilingualModal
                    isOpen={!!selectedGroup}
                    onClose={() => setSelectedGroup(null)}
                    resource={selectedGroup}
                    translations={selectedGroup.translations}
                />
            )}
        </>
    );
}
