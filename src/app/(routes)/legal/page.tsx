"use client";

import { submitTicket } from "@/app/actions/legal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/language-context";

export default function LegalPage() {
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    async function onSubmit(formData: FormData) {
        setLoading(true);
        const category = formData.get("category") as string;
        const description = formData.get("description") as string;

        if (!category || !description) {
            toast.error(t("legal.fillAllFields"));
            setLoading(false);
            return;
        }

        try {
            const result = await submitTicket({ category, description });
            if (result.success) {
                toast.success(t("legal.successMessage"));
                // Reset form or redirect
            }
        } catch (error) {
            toast.error(t("legal.errorMessage"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>{t("legal.title")}</CardTitle>
                    <CardDescription>
                        {t("legal.description")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium">{t("legal.category")}</label>
                            <Select name="category" required>
                                <SelectTrigger>
                                    <SelectValue placeholder={t("legal.categoryPlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="abuse">{t("legal.abuse")}</SelectItem>
                                    <SelectItem value="domestic_violence">{t("legal.domesticViolence")}</SelectItem>
                                    <SelectItem value="workplace_harassment">{t("legal.workplaceHarassment")}</SelectItem>
                                    <SelectItem value="rights_violation">{t("legal.rightsViolation")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">{t("legal.descriptionLabel")}</label>
                            <Textarea
                                name="description"
                                placeholder={t("legal.descriptionPlaceholder")}
                                required
                                className="min-h-[100px]"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? t("legal.submitting") : t("legal.submitButton")}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
