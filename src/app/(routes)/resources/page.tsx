"use client";

import { getResources } from "@/app/actions/resources";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Download, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { useEffect, useState } from "react";

type Resource = {
    id: string;
    title: string;
    description: string;
    category: string;
    url: string;
    format: string;
};

export default function ResourcesPage() {
    const { t } = useLanguage();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadResources() {
            try {
                const data = await getResources();
                // @ts-ignore - format is new
                setResources(data);
            } catch (error) {
                console.error("Failed to load resources:", error);
            } finally {
                setLoading(false);
            }
        }
        loadResources();
    }, []);

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "health": return "destructive"; // Red-ish
            case "legal": return "default"; // Blue/Dark
            case "safety": return "secondary"; // Gray/Orange depending on theme
            default: return "outline";
        }
    };

    const getFormatIcon = (format: string) => {
        switch (format.toLowerCase()) {
            case "pdf": return <Download className="h-4 w-4" />;
            case "link": return <LinkIcon className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">{t("resources.title")}</h1>
                    <p className="text-muted-foreground">{t("resources.description")}</p>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                    {t("common.loading")}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{t("resources.title")}</h1>
                <p className="text-muted-foreground">
                    {t("resources.description")}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => (
                    <Card key={resource.id} className="hover:bg-muted/50 transition-colors flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={getCategoryColor(resource.category) as any}>
                                    {resource.category}
                                </Badge>
                                <div className="text-muted-foreground">
                                    {getFormatIcon(resource.format)}
                                </div>
                            </div>
                            <CardTitle className="text-lg line-clamp-2">
                                {resource.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                            <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                                {resource.description}
                            </p>
                            <Button asChild variant="outline" className="w-full mt-auto group">
                                <Link href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                    {t("resources.visitResource")}
                                    <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {resources.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        {t("resources.noResources")}
                    </div>
                )}
            </div>
        </div>
    );
}
