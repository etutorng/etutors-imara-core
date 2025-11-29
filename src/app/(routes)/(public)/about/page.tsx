"use client";

import { GradientCard } from "@/components/ui/gradient-card";
import { Shield, Heart, Globe, Users, Github, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";

export default function AboutPage() {
    const { t } = useLanguage();

    const values = [
        {
            icon: Shield,
            title: t("about.values.barriers.title"),
            description: t("about.values.barriers.desc"),
        },
        {
            icon: Heart,
            title: t("about.values.privacy.title"),
            description: t("about.values.privacy.desc"),
        },
        {
            icon: Globe,
            title: t("about.values.multilingual.title"),
            description: t("about.values.multilingual.desc"),
        },
        {
            icon: Users,
            title: t("about.values.community.title"),
            description: t("about.values.community.desc"),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <div className="space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {t("about.title")}{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Project Imara
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {t("about.subtitle")}
                    </p>
                </div>

                {/* Mission */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">{t("about.mission.title")}</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                            {t("about.mission.p1")}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            <strong>Project Imara</strong> is more than an app—it's an <strong>Empowerment Ecosystem</strong> that
                            provides tangible services (Legal Aid, Trade Skills, Mentorship) wrapped in a low-data,
                            multilingual interface accessible to any girl with a basic smartphone.
                        </p>
                    </div>
                </section>

                {/* Problem Statement */}
                <GradientCard variant="primary" className="p-8">
                    <h3 className="text-2xl font-bold mb-4">{t("about.problem.title")}</h3>
                    <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>{t("about.problem.legal").split(":")[0]}:</strong>{t("about.problem.legal").split(":")[1]}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>{t("about.problem.economic").split(":")[0]}:</strong>{t("about.problem.economic").split(":")[1]}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>{t("about.problem.language").split(":")[0]}:</strong>{t("about.problem.language").split(":")[1]}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>{t("about.problem.info").split(":")[0]}:</strong>{t("about.problem.info").split(":")[1]}</span>
                        </li>
                    </ul>
                </GradientCard>

                {/* Core Values */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">{t("about.values.title")}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {values.map((value) => {
                            const Icon = value.icon;
                            return (
                                <div key={value.title} className="flex items-start gap-4">
                                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{value.title}</h3>
                                        <p className="text-muted-foreground text-sm">{value.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Target Audience */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">{t("about.audience.title")}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <GradientCard variant="accent">
                            <h3 className="text-xl font-semibold mb-3">{t("about.audience.amina.title")}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>{t("about.audience.amina.profile").split(":")[0]}:</strong>{t("about.audience.amina.profile").split(":")[1]}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>{t("about.audience.amina.needs").split(":")[0]}:</strong>{t("about.audience.amina.needs").split(":")[1]}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong>{t("about.audience.amina.solution").split(":")[0]}:</strong>{t("about.audience.amina.solution").split(":")[1]}
                            </p>
                        </GradientCard>

                        <GradientCard variant="primary">
                            <h3 className="text-xl font-semibold mb-3">{t("about.audience.chidinma.title")}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>{t("about.audience.chidinma.profile").split(":")[0]}:</strong>{t("about.audience.chidinma.profile").split(":")[1]}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>{t("about.audience.chidinma.needs").split(":")[0]}:</strong>{t("about.audience.chidinma.needs").split(":")[1]}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong>{t("about.audience.chidinma.solution").split(":")[0]}:</strong>{t("about.audience.chidinma.solution").split(":")[1]}
                            </p>
                        </GradientCard>
                    </div>
                </section>

                {/* Open Source */}
                <section className="space-y-4">
                    <h2 className="text-3xl font-bold">{t("about.opensource.title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {t("about.opensource.p1")}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        {t("about.opensource.p2")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button asChild className="bg-[#008080] hover:bg-[#006666] text-white">
                            <a href="https://github.com/etutorng/etutors-imara-core.git" target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" />
                                {t("about.opensource.github")}
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white">
                            <Link href="/docs">
                                <BookOpen className="mr-2 h-4 w-4" />
                                {t("about.opensource.docs")}
                            </Link>
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
