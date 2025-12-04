"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { upsertResourceTranslation } from "@/app/admin/content/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
}

interface MultilingualModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: Resource;
    translations: Resource[];
}

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "ha", label: "Hausa" },
    { code: "ig", label: "Igbo" },
    { code: "yo", label: "Yoruba" },
    { code: "pcm", label: "Pidgin" },
];

export function MultilingualModal({ isOpen, onClose, resource, translations }: MultilingualModalProps) {
    const [activeTab, setActiveTab] = useState("en");
    const [isPending, startTransition] = useTransition();

    // Helper to get data for a specific language
    const getTranslation = (lang: string) => {
        return translations.find((t) => t.language === lang) || (lang === "en" ? resource : null);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const lang = activeTab;

        startTransition(async () => {
            const result = await upsertResourceTranslation({
                groupId: resource.groupId,
                language: lang,
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                url: formData.get("url") as string,
                category: resource.category, // Inherit category from master
                format: resource.format,     // Inherit format from master
                thumbnail: formData.get("thumbnail") as string,
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Saved ${LANGUAGES.find(l => l.code === lang)?.label} translation`);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Manage Translations: {resource.title}</DialogTitle>
                    <DialogDescription>
                        Add or edit translations for this content.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        {LANGUAGES.map((lang) => (
                            <TabsTrigger key={lang.code} value={lang.code}>
                                {lang.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {LANGUAGES.map((lang) => {
                        const translation = getTranslation(lang.code);
                        return (
                            <TabsContent key={lang.code} value={lang.code}>
                                <form onSubmit={handleSave} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`title-${lang.code}`}>Title ({lang.label})</Label>
                                        <Input
                                            id={`title-${lang.code}`}
                                            name="title"
                                            defaultValue={translation?.title || ""}
                                            required
                                            placeholder={`Title in ${lang.label}`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`desc-${lang.code}`}>Description ({lang.label})</Label>
                                        <Textarea
                                            id={`desc-${lang.code}`}
                                            name="description"
                                            defaultValue={translation?.description || ""}
                                            placeholder={`Description in ${lang.label}`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`url-${lang.code}`}>URL ({lang.label})</Label>
                                        <Input
                                            id={`url-${lang.code}`}
                                            name="url"
                                            defaultValue={translation?.url || ""}
                                            required
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`thumb-${lang.code}`}>Thumbnail URL (Optional)</Label>
                                        <Input
                                            id={`thumb-${lang.code}`}
                                            name="thumbnail"
                                            defaultValue={translation?.thumbnail || ""}
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isPending}>
                                            {isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save Translation"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
