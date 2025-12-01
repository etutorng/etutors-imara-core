"use client";

import { GradientCard } from "@/components/ui/gradient-card";
import { Users, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { AuthActionButton } from "@/components/auth-action-button";

export default function PublicCounsellingPage() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32">
                <div className="container px-4 mx-auto text-center space-y-8 max-w-4xl">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Heart className="h-4 w-4" />
                        <span>Safe & Confidential Support</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Speak to a <span className="text-primary">Counsellor</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        We have verified female counsellors ready to listen. Whether you need advice on health, education, or personal matters, we are here for you.
                    </p>

                    <div className="flex justify-center pt-4">
                        <AuthActionButton
                            dashboardUrl="/dashboard/counselling"
                            size="lg"
                            className="text-lg px-8 py-6 h-auto"
                        >
                            Chat with a Counsellor
                        </AuthActionButton>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 container px-4 mx-auto">
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <GradientCard variant="primary" className="p-8 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">100% Confidential</h3>
                        <p className="text-muted-foreground">Your conversations are private and secure. We prioritize your safety above all else.</p>
                    </GradientCard>

                    <GradientCard variant="accent" className="p-8 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold">Verified Experts</h3>
                        <p className="text-muted-foreground">Connect with trained female professionals who understand your challenges.</p>
                    </GradientCard>

                    <GradientCard variant="primary" className="p-8 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">Free Support</h3>
                        <p className="text-muted-foreground">Access professional guidance without any cost. We believe support should be accessible to all.</p>
                    </GradientCard>
                </div>
            </section>
        </div>
    );
}
