"use client";

import { StatCard } from "@/components/ui/stat-card";
import { GradientCard } from "@/components/ui/gradient-card";
import { Users, Scale, GraduationCap, Heart, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export default function ImpactPage() {
    const { t } = useLanguage();

    const metrics = [
        {
            title: t("impact.metric.women"),
            value: "5,247",
            icon: Users,
            description: t("impact.metric.women.desc"),
            trend: { value: 23, label: "vs last month", positive: true },
            variant: "primary" as const,
        },
        {
            title: t("impact.metric.legal"),
            value: "127",
            icon: Scale,
            description: t("impact.metric.legal.desc"),
            trend: { value: 15, label: "vs last month", positive: true },
            variant: "accent" as const,
        },
        {
            title: t("impact.metric.skills"),
            value: "892",
            icon: GraduationCap,
            description: t("impact.metric.skills.desc"),
            trend: { value: 31, label: "vs last month", positive: true },
            variant: "primary" as const,
        },
        {
            title: t("impact.metric.mentorship"),
            value: "1,456",
            icon: Heart,
            description: t("impact.metric.mentorship.desc"),
            trend: { value: 18, label: "vs last month", positive: true },
            variant: "accent" as const,
        },
    ];

    const testimonials = [
        {
            name: "Amina K.",
            location: "Kano State",
            quote: "I learned tailoring through Imara in Hausa. Now I make money for my family. Thank you!",
            category: "Vocational Training",
        },
        {
            name: "Chidinma O.",
            location: "Lagos",
            quote: "The free legal aid helped me report workplace harassment. I got justice without paying a lawyer.",
            category: "Legal Aid",
        },
        {
            name: "Blessing A.",
            location: "Enugu",
            quote: "My mentor helped me understand my rights and gave me confidence to pursue education.",
            category: "Counselling",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
            <div className="space-y-16">
                {/* Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        {t("impact.title").split(" ")[0]}{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {t("impact.title").split(" ")[1]}
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {t("impact.subtitle")}
                    </p>
                </div>

                {/* Live Metrics */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        <h2 className="text-3xl font-bold">{t("impact.metrics.title")}</h2>
                    </div>
                    <p className="text-muted-foreground">
                        {t("impact.metrics.desc")}
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {metrics.map((metric) => (
                            <StatCard key={metric.title} {...metric} />
                        ))}
                    </div>
                </section>

                {/* Success Stories */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">{t("impact.stories.title")}</h2>
                    <p className="text-muted-foreground">
                        {t("impact.stories.desc")}
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <GradientCard key={index} variant={index % 2 === 0 ? "primary" : "accent"}>
                                <div className="space-y-4">
                                    <p className="text-sm italic">"{testimonial.quote}"</p>
                                    <div className="pt-4 border-t">
                                        <p className="font-semibold text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                                        <div className="mt-2 inline-block px-3 py-1 rounded-full bg-background text-xs font-medium">
                                            {testimonial.category}
                                        </div>
                                    </div>
                                </div>
                            </GradientCard>
                        ))}
                    </div>
                </section>

                {/* Transparency Commitment */}
                <GradientCard variant="primary" className="p-8">
                    <h2 className="text-2xl font-bold mb-4">{t("impact.transparency.title")}</h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            {t("impact.transparency.p1")}
                        </p>
                        <ul className="space-y-2 ml-6">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>{t("impact.transparency.data").split(":")[0]}:</strong>{t("impact.transparency.data").split(":")[1]}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>{t("impact.transparency.source").split(":")[0]}:</strong>{t("impact.transparency.source").split(":")[1]}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>{t("impact.transparency.governance").split(":")[0]}:</strong>{t("impact.transparency.governance").split(":")[1]}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>{t("impact.transparency.privacy").split(":")[0]}:</strong>{t("impact.transparency.privacy").split(":")[1]}</span>
                            </li>
                        </ul>
                    </div>
                </GradientCard>

                {/* Language Breakdown */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">{t("impact.language.title")}</h2>
                    <p className="text-muted-foreground">
                        {t("impact.language.desc")}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { lang: "English", percentage: 35 },
                            { lang: "Hausa", percentage: 28 },
                            { lang: "Igbo", percentage: 18 },
                            { lang: "Yoruba", percentage: 12 },
                            { lang: "Pidgin", percentage: 7 },
                        ].map((item) => (
                            <div key={item.lang} className="text-center p-4 rounded-lg border">
                                <div className="text-3xl font-bold text-primary mb-1">{item.percentage}%</div>
                                <div className="text-sm text-muted-foreground">{item.lang}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
