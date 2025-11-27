import { GradientCard } from "@/components/ui/gradient-card";
import { Button } from "@/components/ui/button";
import { Building2, Scale, Users, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

const partners = [
    {
        name: "eTutors Nigeria Ltd",
        role: "Technology Partner & Sponsor",
        description: "Leading EdTech platform providing technical infrastructure and expertise.",
        website: "https://etutors.com.ng",
        logo: Building2,
    },
    {
        name: "UNICEF Venture Fund",
        role: "Target Funding Partner",
        description: "Supporting innovative open-source solutions for vulnerable populations.",
        website: "https://www.unicef.org/innovation/venturefund",
        logo: Heart,
    },
];

const callouts = [
    {
        icon: Scale,
        title: "Pro-bono Lawyers",
        description: "Join our network of legal professionals providing free aid to abuse victims.",
        cta: "Become a Legal Partner",
        href: "/signup",
    },
    {
        icon: Users,
        title: "Mentors",
        description: "Guide young women on health, career, and education through 1-on-1 mentorship.",
        cta: "Become a Mentor",
        href: "/signup",
    },
];

export default function PartnersPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <div className="space-y-16">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Our{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Partners
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Together, we're building a better future for young women in Nigeria.
                    </p>
                </div>

                {/* Current Partners */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Current Partners</h2>
                    <div className="space-y-6">
                        {partners.map((partner) => {
                            const Logo = partner.logo;
                            return (
                                <GradientCard key={partner.name} variant="primary">
                                    <div className="flex items-start gap-6">
                                        <div className="rounded-lg bg-background p-4">
                                            <Logo className="h-12 w-12 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-1">{partner.name}</h3>
                                            <p className="text-sm text-primary mb-2">{partner.role}</p>
                                            <p className="text-muted-foreground mb-4">{partner.description}</p>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={partner.website} target="_blank" rel="noopener noreferrer">
                                                    Visit Website
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </GradientCard>
                            );
                        })}
                    </div>
                </section>

                {/* Join Us */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Join Our Network</h2>
                    <p className="text-muted-foreground">
                        We're always looking for passionate professionals to join our mission.
                        Whether you're a lawyer, mentor, or organization, there's a place for you.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {callouts.map((callout) => {
                            const Icon = callout.icon;
                            return (
                                <GradientCard key={callout.title} variant="accent">
                                    <div className="space-y-4">
                                        <div className="rounded-lg bg-background p-3 w-fit">
                                            <Icon className="h-6 w-6 text-accent" />
                                        </div>
                                        <h3 className="text-xl font-semibold">{callout.title}</h3>
                                        <p className="text-muted-foreground">{callout.description}</p>
                                        <Button asChild className="w-full">
                                            <Link href={callout.href}>
                                                {callout.cta}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </GradientCard>
                            );
                        })}
                    </div>
                </section>

                {/* Become a Partner */}
                <GradientCard variant="primary" className="p-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold">Become a Partner</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Are you an organization interested in supporting Project Imara?
                            We're open to partnerships that align with our mission of empowering young women.
                        </p>
                        <Button size="lg" variant="secondary" asChild>
                            <a href="mailto:partnerships@projectimara.org">
                                Contact Us
                            </a>
                        </Button>
                    </div>
                </GradientCard>
            </div>
        </div>
    );
}
