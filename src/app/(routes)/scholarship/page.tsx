"use client";

import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n/language-context";
import { GraduationCap, ArrowRight, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitApplication } from "@/app/actions/scholarship";
import { createApplicationSchema } from "@/lib/schemas/scholarship";

export default function ScholarshipPage() {
    const { t } = useLanguage();
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);



        try {
            const result = await submitApplication(formData);
            if (result.success) {
                setShowSuccess(true);
                toast.success(t("scholarship.form.success"));
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error(result.error || t("scholarship.form.error"));
            }
        } catch (error) {
            toast.error(t("scholarship.form.error"));
        } finally {
            setSubmitting(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center p-4">
                <GradientCard variant="primary" className="max-w-md w-full p-8 text-center space-y-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-800">{t("common.success")}!</h2>
                    <p className="text-muted-foreground">
                        {t("scholarship.form.success")}
                    </p>
                    <Button onClick={() => setShowSuccess(false)} className="w-full">
                        Submit Another Application
                    </Button>
                </GradientCard>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-background to-purple-50 py-16 md:py-24">
                <div className="container px-4 mx-auto text-center space-y-6 max-w-4xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
                        <GraduationCap className="h-4 w-4" />
                        <span>{t("home.feature.scholarship.title")}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                        {t("scholarship.description")}
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        We are committed to empowering the vulnerable and underserved girl child with the digital skills needed to thrive in today's economy.
                    </p>
                </div>
            </section>

            {/* Application Form */}
            <section className="container px-4 mx-auto pb-20">
                <div className="max-w-3xl mx-auto">
                    <GradientCard variant="primary" className="p-8 md:p-10 border-indigo-200 bg-white/50 backdrop-blur-sm">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-indigo-900 mb-2">{t("scholarship.form.title")}</h2>
                            <p className="text-slate-600">Please fill out the form below carefully.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">{t("scholarship.form.fullName")}</Label>
                                    <Input id="fullName" name="fullName" required placeholder="e.g. Amina Yusuf" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("scholarship.form.email")} <span className="text-muted-foreground font-normal text-xs">(Optional)</span></Label>
                                    <Input id="email" name="email" type="email" placeholder="e.g. amina@example.com" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t("scholarship.form.phone")}</Label>
                                    <Input id="phone" name="phone" type="tel" required placeholder="e.g. 08012345678" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="qualification">{t("scholarship.form.qualification")}</Label>
                                    <Select name="qualification" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Qualification" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SSCE">SSCE / O-Level</SelectItem>
                                            <SelectItem value="OND">OND / NCE</SelectItem>
                                            <SelectItem value="HND">HND / Degree</SelectItem>
                                            <SelectItem value="Masters">Masters</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-amber-600 font-medium">{t("scholarship.olevel.required")}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="state">State of Residence</Label>
                                    <Input id="state" name="state" required placeholder="e.g. Kano" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lga">LGA of Residence</Label>
                                    <Input id="lga" name="lga" required placeholder="e.g. Nassarawa" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Input id="address" name="address" required placeholder="e.g. No 123, Street Name, Area" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="skill">{t("scholarship.form.skill")}</Label>
                                <Select name="skill" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Skill" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Web Development">Web Development</SelectItem>
                                        <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                                        <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                        <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                                        <SelectItem value="Product Management">Product Management</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="essay">{t("scholarship.form.essay")}</Label>
                                <Textarea
                                    id="essay"
                                    name="essay"
                                    required
                                    placeholder="Tell us about yourself and your goals..."
                                    className="min-h-[120px]"
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("scholarship.form.submitting")}
                                    </>
                                ) : (
                                    <>
                                        {t("scholarship.form.submit")}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </GradientCard>
                </div>
            </section>
        </div>
    );
}
