import { GradientCard } from "@/components/ui/gradient-card";
import { Shield, Heart, Globe, Users, Github, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const values = [
    {
        icon: Shield,
        title: "Zero Barriers",
        description: "No IDs required. No English required. No complex barriers. Just empowerment.",
    },
    {
        icon: Heart,
        title: "Privacy First",
        description: "Zero-knowledge encryption for legal aid and mentorship. Your safety is our priority.",
    },
    {
        icon: Globe,
        title: "Truly Multilingual",
        description: "Full support for English, Hausa, Igbo, Yoruba, and Pidgin. Speak your language.",
    },
    {
        icon: Users,
        title: "Community Driven",
        description: "Built by the community, for the community. Open source and transparent.",
    },
];

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <div className="space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        About{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Project Imara
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        A Digital Life Support System for Young Women
                    </p>
                </div>

                {/* Mission */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Our Mission</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed">
                            The Nigerian girl child faces a multi-dimensional crisis: lack of legal protection,
                            economic dependency, language barriers, and information gaps. Most EdTech and health
                            platforms are in high-level English, excluding the rural population who speak Hausa,
                            Igbo, Yoruba, or Pidgin.
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
                    <h3 className="text-2xl font-bold mb-4">The Problem We're Solving</h3>
                    <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>Lack of Legal Protection:</strong> Victims of abuse often have no access to legal counsel due to poverty and isolation.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>Economic Dependency:</strong> Without vocational skills, girls remain financially dependent and vulnerable.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>Language Barrier:</strong> Most platforms are in high-level English, excluding rural populations.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-primary mt-1">•</span>
                            <span><strong>Information Gap:</strong> Critical health and rights information is often shrouded in taboo.</span>
                        </li>
                    </ul>
                </GradientCard>

                {/* Core Values */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Our Core Values</h2>
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
                    <h2 className="text-3xl font-bold">Who We Serve</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <GradientCard variant="accent">
                            <h3 className="text-xl font-semibold mb-3">Rural Amina</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>Profile:</strong> 16 years old, lives in a village in Kano. Speaks only Hausa.
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>Needs:</strong> Wants to learn tailoring to make money but has no teacher.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong>Imara Solution:</strong> She selects "Hausa" language and watches vocational
                                training videos with Hausa audio. The app works on 2G.
                            </p>
                        </GradientCard>

                        <GradientCard variant="primary">
                            <h3 className="text-xl font-semibold mb-3">City Chidinma</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>Profile:</strong> 19 years old, lives in Lagos. Speaks English and Pidgin.
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>Needs:</strong> Facing workplace harassment and needs legal help but can't afford a lawyer.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <strong>Imara Solution:</strong> She uses the "Legal Aid" button to submit an anonymous
                                report. A pro-bono partner lawyer responds via secure chat.
                            </p>
                        </GradientCard>
                    </div>
                </section>

                {/* Open Source */}
                <section className="space-y-4">
                    <h2 className="text-3xl font-bold">Open Source & Transparent</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Project Imara is proudly open source under the MIT License. We believe in transparency,
                        community collaboration, and building tools that truly serve the people. Every line of code,
                        every feature, and every decision is made in the open.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        This project is being submitted to the <strong>UNICEF Venture Fund</strong> as part of our
                        commitment to creating sustainable, scalable solutions for the most vulnerable populations.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button asChild className="bg-[#008080] hover:bg-[#006666] text-white">
                            <a href="https://github.com/etutorng/etutors-imara-core.git" target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" />
                                View on GitHub
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white">
                            <Link href="/docs">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Read the Docs
                            </Link>
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
