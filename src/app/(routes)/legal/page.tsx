"use client";

import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { Shield, Phone, MessageCircle, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { AuthActionButton } from "@/components/auth-action-button";

export default function PublicLegalPage() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-background to-blue-50 py-16 md:py-24">
                <div className="container px-4 mx-auto text-center space-y-6 max-w-4xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
                        <Shield className="h-4 w-4" />
                        <span>Confidential & Secure</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                        You Are Not Alone. <br />
                        <span className="text-primary">Get Legal Help Now.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        We provide free legal aid to women and girls in Nigeria. Choose the option that feels safest for you right now.
                    </p>
                </div>
            </section>

            {/* Split Options */}
            <section className="container px-4 mx-auto pb-20">
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Option A: Immediate Contact */}
                    <GradientCard variant="accent" className="p-8 md:p-10 flex flex-col h-full border-red-200 bg-red-50/50">
                        <div className="mb-6 rounded-full bg-red-100 w-16 h-16 flex items-center justify-center">
                            <Phone className="h-8 w-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-red-900">Immediate Help</h2>
                        <p className="text-slate-600 mb-8 flex-1">
                            Speak to a lawyer immediately and anonymously. Best for urgent situations or if you just want to talk.
                        </p>

                        <div className="space-y-4">
                            <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white text-lg h-14" asChild>
                                <a href="tel:08000000000">
                                    <Phone className="mr-2 h-5 w-5" />
                                    Call Helpline
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="w-full border-red-200 hover:bg-red-50 text-red-700 hover:text-red-700 text-lg h-14" asChild>
                                <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    WhatsApp Us
                                </a>
                            </Button>
                        </div>
                    </GradientCard>

                    {/* Option B: Secure Case Management */}
                    <GradientCard variant="primary" className="p-8 md:p-10 flex flex-col h-full border-blue-200 bg-blue-50/50">
                        <div className="mb-6 rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center">
                            <Lock className="h-8 w-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-blue-900">Secure Case File</h2>
                        <p className="text-slate-600 mb-8 flex-1">
                            Create a secure account to track your case, upload evidence, and communicate with pro-bono lawyers.
                        </p>

                        <div className="space-y-4">
                            <AuthActionButton
                                dashboardUrl="/dashboard/legal"
                                size="lg"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg h-14"
                            >
                                <Shield className="mr-2 h-5 w-5" />
                                Open a Case File
                            </AuthActionButton>
                            <p className="text-xs text-center text-slate-500">
                                Requires a secure account. Your data is encrypted.
                            </p>
                        </div>
                    </GradientCard>

                </div>
            </section>
        </div>
    );
}
