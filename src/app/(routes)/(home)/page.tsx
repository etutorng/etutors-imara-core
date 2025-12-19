"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import {
  Scale,
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  Github,
  Heart,
  Shield,
  Globe
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export default function HomePage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Scale,
      title: t("home.feature.legal.title"),
      description: t("home.feature.legal.description"),
      variant: "primary" as const,
      href: "/legal",
    },
    {
      icon: GraduationCap,
      title: t("home.feature.lms.title"),
      description: t("home.feature.lms.description"),
      variant: "accent" as const,
      href: "/lms",
    },
    {
      icon: Users,
      title: t("home.feature.mentorship.title"),
      description: t("home.feature.mentorship.description"),
      variant: "primary" as const,
      href: "/counselling",
    },
    {
      icon: BookOpen,
      title: t("home.feature.resources.title"),
      description: t("home.feature.resources.description"),
      variant: "accent" as const,
      href: "/resources",
    },
    {
      icon: GraduationCap,
      title: t("home.feature.scholarship.title"),
      description: t("home.feature.scholarship.description"),
      variant: "primary" as const,
      href: "/scholarship",
    },
  ];

  const stats = [
    { value: "5,000+", label: t("home.stats.womenEmpowered") },
    { value: "100+", label: t("home.stats.casesResolved") },
    { value: "500+", label: t("home.stats.skillsLearned") },
    { value: "5", label: t("home.stats.languagesSupported") },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Heart className="h-4 w-4" />
              {t("home.hero.badge")}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t("home.hero.title.your")}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("home.hero.title.digital")}
              </span>{" "}
              {t("home.hero.title.system")}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/signup">
                  {t("home.hero.getStarted")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/about">
                  {t("home.hero.learnMore")}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.features.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("home.features.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href} className="block group">
                  <GradientCard variant={feature.variant} className="p-8 h-full transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-3 ${feature.variant === "primary"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                        }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </GradientCard>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Multilingual Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Globe className="h-4 w-4" />
              {t("home.multilingual.badge")}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">
              {t("home.multilingual.title")}
            </h2>

            <p className="text-lg text-muted-foreground">
              {t("home.multilingual.description")}
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              {["English", "Hausa", "Igbo", "Yoruba", "Pidgin"].map((lang) => (
                <div
                  key={lang}
                  className="px-6 py-3 rounded-full bg-background border border-primary/20 text-sm font-medium"
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <GradientCard variant="primary" className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium">
                    <Github className="h-4 w-4" />
                    {t("home.opensource.badge")}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold">
                    {t("home.opensource.title")}
                  </h2>

                  <p className="text-muted-foreground">
                    {t("home.opensource.description")}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button variant="secondary" asChild>
                      <Link href="/open-source">
                        {t("home.opensource.viewRoadmap")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        {t("home.opensource.github")}
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <Shield className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </GradientCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("home.cta.title")}
            </h2>

            <p className="text-lg text-muted-foreground">
              {t("home.cta.description")}
            </p>

            <Button size="lg" asChild>
              <Link href="/signup">
                {t("home.cta.createAccount")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="text-sm text-muted-foreground">
              {t("home.cta.poweredBy")}{" "}
              <a
                href="https://etutors.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                eTutors Nigeria Ltd
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
