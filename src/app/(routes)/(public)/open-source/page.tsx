import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { Github, Code, Languages, FileText, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

const roadmap = [
    {
        version: "v1.0 (Current MVP)",
        status: "In Progress",
        features: [
            "Core Empowerment Engines (Legal, LMS, Mentorship, Resources)",
            "English & Hausa support",
            "Mobile-first responsive design",
            "Anonymous legal aid reporting",
        ],
    },
    {
        version: "v1.1 (Q1 2026)",
        status: "Planned",
        features: [
            "Full 5-language support (Igbo, Yoruba, Pidgin)",
            "Offline mode for video downloads",
            "PWA installation support",
            "Enhanced badge system",
        ],
    },
    {
        version: "v2.0 (Q2 2026)",
        status: "Planned",
        features: [
            "Community forum",
            "Micro-grant integration",
            "Advanced analytics dashboard",
            "Mobile app (iOS & Android)",
        ],
    },
];

const contributionAreas = [
    {
        icon: Code,
        title: "Developers",
        description: "Help us build features, fix bugs, and improve performance.",
        skills: "Next.js, TypeScript, PostgreSQL, Drizzle ORM",
    },
    {
        icon: Languages,
        title: "Translators",
        description: "Translate content into Hausa, Igbo, Yoruba, or Pidgin.",
        skills: "Native fluency in Nigerian languages",
    },
    {
        icon: FileText,
        title: "Content Creators",
        description: "Create educational content, legal guides, and vocational tutorials.",
        skills: "Subject matter expertise, video production",
    },
    {
        icon: Heart,
        title: "Advocates",
        description: "Spread the word, recruit mentors, and connect with communities.",
        skills: "Community engagement, social media",
    },
];

export default function OpenSourcePage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
            <div className="space-y-16">
                {/* Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Github className="h-4 w-4" />
                        MIT License
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Proudly{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Open Source
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Built by the community, for the community. Join us in empowering young women across Nigeria.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button size="lg" asChild>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-5 w-5" />
                                View on GitHub
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="#contribute">
                                Start Contributing
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Why Open Source */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Why Open Source?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <GradientCard variant="primary">
                            <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                            <p className="text-sm text-muted-foreground">
                                Every line of code is public. No hidden agendas, no black boxes.
                                You can see exactly how we protect user privacy and data.
                            </p>
                        </GradientCard>
                        <GradientCard variant="accent">
                            <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                            <p className="text-sm text-muted-foreground">
                                The best solutions come from diverse perspectives. Anyone can contribute,
                                suggest features, or report issues.
                            </p>
                        </GradientCard>
                        <GradientCard variant="primary">
                            <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
                            <p className="text-sm text-muted-foreground">
                                Open source ensures the project outlives any single organization.
                                The community owns and maintains it forever.
                            </p>
                        </GradientCard>
                    </div>
                </section>

                {/* Roadmap */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Development Roadmap</h2>
                    <p className="text-muted-foreground">
                        Our transparent development plan. Track progress and see what's coming next.
                    </p>
                    <div className="space-y-6">
                        {roadmap.map((phase, index) => (
                            <GradientCard
                                key={phase.version}
                                variant={index === 0 ? "primary" : "default"}
                                className="relative"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <h3 className="text-xl font-semibold">{phase.version}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${phase.status === "In Progress"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-muted text-muted-foreground"
                                        }`}>
                                        {phase.status}
                                    </span>
                                </div>
                                <ul className="space-y-2">
                                    {phase.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="text-primary mt-1">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </GradientCard>
                        ))}
                    </div>
                </section>

                {/* How to Contribute */}
                <section id="contribute" className="space-y-6">
                    <h2 className="text-3xl font-bold">How You Can Contribute</h2>
                    <p className="text-muted-foreground">
                        Whether you're a developer, translator, content creator, or advocate,
                        there's a place for you in our community.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {contributionAreas.map((area) => {
                            const Icon = area.icon;
                            return (
                                <div key={area.title} className="flex items-start gap-4 p-6 rounded-lg border">
                                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">{area.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{area.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            <strong>Skills needed:</strong> {area.skills}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* License */}
                <GradientCard variant="primary" className="p-8">
                    <h2 className="text-2xl font-bold mb-4">MIT License</h2>
                    <p className="text-muted-foreground mb-4">
                        Project Imara is released under the MIT License, one of the most permissive
                        open-source licenses. This means:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">✓</span>
                            <span>Free to use, modify, and distribute</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">✓</span>
                            <span>Can be used in commercial projects</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">✓</span>
                            <span>No warranty or liability</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-1">✓</span>
                            <span>Attribution required</span>
                        </li>
                    </ul>
                </GradientCard>

                {/* CTA */}
                <div className="text-center space-y-6 py-12">
                    <h2 className="text-3xl font-bold">Ready to Make an Impact?</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Join our community of developers, translators, and advocates working to
                        empower young women across Nigeria.
                    </p>
                    <Button size="lg" asChild>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-5 w-5" />
                            Get Started on GitHub
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
