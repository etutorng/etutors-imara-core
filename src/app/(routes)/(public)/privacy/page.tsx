import { GradientCard } from "@/components/ui/gradient-card";
import { Shield, Lock, Eye, Trash2, FileKey } from "lucide-react";

const principles = [
    {
        icon: Shield,
        title: "Zero-Knowledge Encryption",
        description: "Legal aid reports and mentorship chats are end-to-end encrypted. Even our admin staff cannot read your private conversations.",
    },
    {
        icon: Eye,
        title: "Anonymous Reporting",
        description: "Submit legal aid requests without revealing your identity. Your public profile is never linked to your reports.",
    },
    {
        icon: Trash2,
        title: "Data Minimization",
        description: "We only collect what's absolutely necessary. No home addresses unless required for legal cases. No unnecessary tracking.",
    },
    {
        icon: FileKey,
        title: "Secure Evidence Vault",
        description: "Upload voice notes or images that are encrypted and automatically deleted after case resolution.",
    },
];

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
            <div className="space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Lock className="h-4 w-4" />
                        Your Privacy, Our Priority
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Privacy{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            & Safety
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        How we protect your data and ensure your safety.
                    </p>
                </div>

                {/* Core Principles */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Our Privacy Principles</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {principles.map((principle) => {
                            const Icon = principle.icon;
                            return (
                                <div key={principle.title} className="flex items-start gap-4">
                                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{principle.title}</h3>
                                        <p className="text-muted-foreground text-sm">{principle.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* What We Collect */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">What We Collect</h2>
                    <GradientCard variant="primary">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Required Information</h3>
                                <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                                    <li>• Phone number (for sign-up and account recovery)</li>
                                    <li>• Self-attestation of gender (checkbox only)</li>
                                    <li>• Preferred language</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Optional Information</h3>
                                <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                                    <li>• Display name (can be anonymous)</li>
                                    <li>• Profile picture (optional)</li>
                                    <li>• Course progress and badges</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">We DO NOT Collect</h3>
                                <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                                    <li>• Email addresses (unless you choose to provide one)</li>
                                    <li>• Home addresses (unless required for legal cases)</li>
                                    <li>• Government IDs or verification documents</li>
                                    <li>• Location data or device tracking</li>
                                </ul>
                            </div>
                        </div>
                    </GradientCard>
                </section>

                {/* How We Use Data */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">How We Use Your Data</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-muted-foreground">
                            We use your information solely to provide and improve our services:
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><strong>Account Management:</strong> To create and maintain your account</li>
                            <li><strong>Service Delivery:</strong> To provide legal aid, courses, mentorship, and resources</li>
                            <li><strong>Communication:</strong> To send important updates about your cases or courses</li>
                            <li><strong>Improvement:</strong> To analyze aggregate usage patterns and improve the platform</li>
                        </ul>
                    </div>
                </section>

                {/* Data Sharing */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Data Sharing</h2>
                    <GradientCard variant="accent">
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                We <strong>never sell</strong> your data. We only share information when:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                                <li>• You explicitly request legal aid (shared with pro-bono lawyers only)</li>
                                <li>• You engage with a mentor (shared with that specific mentor only)</li>
                                <li>• Required by law (e.g., court orders)</li>
                                <li>• To protect safety (e.g., preventing imminent harm)</li>
                            </ul>
                            <p className="text-sm text-muted-foreground pt-4">
                                All sharing is done with encryption and strict access controls.
                            </p>
                        </div>
                    </GradientCard>
                </section>

                {/* Your Rights */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Your Rights</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Access</h3>
                            <p className="text-sm text-muted-foreground">
                                Request a copy of all data we have about you
                            </p>
                        </div>
                        <div className="p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Deletion</h3>
                            <p className="text-sm text-muted-foreground">
                                Request deletion of your account and all associated data
                            </p>
                        </div>
                        <div className="p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Correction</h3>
                            <p className="text-sm text-muted-foreground">
                                Update or correct any inaccurate information
                            </p>
                        </div>
                        <div className="p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Portability</h3>
                            <p className="text-sm text-muted-foreground">
                                Export your data in a machine-readable format
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <GradientCard variant="primary" className="p-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold">Questions About Privacy?</h2>
                        <p className="text-muted-foreground">
                            We're committed to transparency. If you have any questions or concerns
                            about how we handle your data, please reach out.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Email: <a href="mailto:privacy@projectimara.org" className="text-primary hover:underline">
                                privacy@projectimara.org
                            </a>
                        </p>
                        <p className="text-xs text-muted-foreground pt-4">
                            Last updated: November 25, 2025
                        </p>
                    </div>
                </GradientCard>
            </div>
        </div>
    );
}
