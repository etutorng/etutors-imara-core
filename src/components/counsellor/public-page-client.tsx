"use client";

import { GradientCard } from "@/components/ui/gradient-card";
import { Users, Heart, Shield } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { AuthActionButton } from "@/components/auth-action-button";

interface PublicCounsellingClientProps {
    counsellorGrid: React.ReactNode;
}

export function PublicCounsellingClient({ counsellorGrid }: PublicCounsellingClientProps) {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32">
                {/* Background Effects */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 animate-blob" />
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 animate-blob animation-delay-4000" />
                </div>

                <div className="container px-4 mx-auto text-center space-y-8 max-w-4xl relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-background/50 backdrop-blur-sm border px-4 py-1.5 text-sm font-medium text-foreground shadow-sm">
                        <Heart className="h-4 w-4 text-primary fill-primary" />
                        <span>Safe & Confidential Support</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 pb-2">
                        Speak to a <span className="text-primary">Counsellor</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
                        Verified female professionals ready to listen. Expert advice on health, education, and personal growth.
                    </p>

                    <div className="flex justify-center pt-8">
                        <AuthActionButton
                            dashboardUrl="/dashboard/counselling"
                            size="lg"
                            className="text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
                        >
                            Chat with a Counsellor
                        </AuthActionButton>
                    </div>
                </div>
            </section>

            {/* Counsellors Grid Section */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container px-4 mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Counsellors</h2>
                        <p className="text-muted-foreground text-lg">
                            Highly qualified professionals dedicated to your well-being.
                        </p>
                    </div>

                    {counsellorGrid}
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
