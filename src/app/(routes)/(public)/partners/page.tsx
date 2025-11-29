"use client";

import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { Handshake, Scale, GraduationCap, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";

export default function PartnersPage() {
    const { t } = useLanguage();

    const partners = [
        {
            name: "UNICEF Venture Fund",
            type: "Funding & Support",
            description: "Potential funding partner for scaling our impact across Nigeria.",
            logo: Building2,
        },
        {
            name: "Lagos State Ministry of Justice",
            type: "Legal Aid",
            description: "Collaborating to provide pro-bono legal services to victims.",
            logo: Scale,
        },
        {
            name: "Tech4Dev",
            type: "Technical Training",
            description: "Providing curriculum and certification for vocational skills.",
            logo: GraduationCap,
        },
    ];

    const roles = [
        {
            icon: Scale,
            title: t("partners.lawyers.title"),
            description: t("partners.lawyers.desc"),
            action: t("partners.lawyers.cta"),
        },
        {
            icon: GraduationCap,
            title: t("partners.mentors.title"),
            description: t("partners.mentors.desc"),
            action: t("partners.mentors.cta"),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
            <div className="space-y-16">
                {/* Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {t("partners.title").split(" ")[0]}{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {t("partners.title").split(" ")[1]}
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {t("partners.subtitle")}
                    </p>
                </div>

                {/* Current Partners */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">{t("partners.current.title")}</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {partners.map((partner) => {
                            const Logo = partner.logo;
                            return (
                                <GradientCard key={partner.name} variant="primary" className="text-center p-6">
                                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                        <Logo className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">{partner.name}</h3>
                                    <p className="text-xs font-medium text-primary mb-3">{partner.type}</p>
                                    <p className="text-sm text-muted-foreground">{partner.description}</p>
                                </GradientCard>
                            );
                        })}
                    </div>
                </section>

                {/* Join Network */}
                <section className="space-y-6">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold mb-4">{t("partners.join.title")}</h2>
                        <p className="text-muted-foreground">
                            {t("partners.join.desc")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <GradientCard key={role.title} variant="accent" className="flex flex-col items-center text-center p-8">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                                    <p className="text-muted-foreground mb-6">{role.description}</p>
                                    <Button className="w-full sm:w-auto">
                                        {role.action}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </GradientCard>
                            );
                        })}
                    </div>
                </section>

                {/* Organization Partnership */}
                <div className="rounded-2xl bg-primary/5 border border-primary/20 p-8 md:p-12 text-center">
                    <Handshake className="h-12 w-12 text-primary mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">{t("partners.become.title")}</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        {t("partners.become.desc")}
                    </p>
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                        {t("partners.become.contact")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
