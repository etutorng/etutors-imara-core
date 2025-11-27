"use client";

import { getResources } from "@/app/actions/resources";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { useEffect, useState } from "react";

type Resource = {
    id: string;
    title: string;
    description: string;
    category: string;
    url: string;
};

export default function ResourcesPage() {
    const { t } = useLanguage();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadResources() {
            try {
                const data = await getResources();
                setResources(data);
            } catch (error) {
                console.error("Failed to load resources:", error);
            } finally {
                setLoading(false);
            }
        }
        loadResources();
    }, []);

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
                    <Card key={resource.id} className="hover:bg-muted/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                {resource.title}
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>{resource.category}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {resource.description}
                            </p>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                                    {t("resources.visitResource")}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {resources.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        {t("resources.noResources")}
                    </div>
                )}
            </div>
        </div>
    );
}
