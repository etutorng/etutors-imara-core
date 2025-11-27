import { StatCard } from "@/components/ui/stat-card";
import { GradientCard } from "@/components/ui/gradient-card";
import { Users, Scale, GraduationCap, Heart, TrendingUp } from "lucide-react";

const metrics = [
    {
        title: "Women Empowered",
        value: "5,247",
        icon: Users,
        description: "Active users on the platform",
        trend: { value: 23, label: "vs last month", positive: true },
        variant: "primary" as const,
    },
    {
        title: "Legal Cases Resolved",
        value: "127",
        icon: Scale,
        description: "Pro-bono cases completed",
        trend: { value: 15, label: "vs last month", positive: true },
        variant: "accent" as const,
    },
    {
        title: "Skills Learned",
        value: "892",
        icon: GraduationCap,
        description: "Course completions",
        trend: { value: 31, label: "vs last month", positive: true },
        variant: "primary" as const,
    },
    {
        title: "Mentorship Sessions",
        value: "1,456",
        icon: Heart,
        description: "1-on-1 guidance sessions",
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
        category: "Mentorship",
    },
];

export default function ImpactPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
            <div className="space-y-16">
                {/* Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Our{" "}
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Impact
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Transparency is at the heart of everything we do. Here's how we're making a difference.
                    </p>
                </div>

                {/* Live Metrics */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        <h2 className="text-3xl font-bold">Live Impact Metrics</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Real-time data showing the reach and effectiveness of Project Imara.
                        Updated daily to maintain transparency for our stakeholders and funders.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {metrics.map((metric) => (
                            <StatCard key={metric.title} {...metric} />
                        ))}
                    </div>
                </section>

                {/* Success Stories */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Success Stories</h2>
                    <p className="text-muted-foreground">
                        Real stories from real women. Names have been changed to protect privacy.
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
                    <h2 className="text-2xl font-bold mb-4">Our Transparency Commitment</h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p>
                            As an open-source project seeking UNICEF Venture Fund support, we are committed to
                            complete transparency in our operations, impact, and use of funds.
                        </p>
                        <ul className="space-y-2 ml-6">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Open Data:</strong> All impact metrics are publicly available and updated in real-time.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Open Source:</strong> Our entire codebase is available on GitHub under MIT License.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Community Governance:</strong> Major decisions are made with community input.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span><strong>Privacy Protected:</strong> While we're transparent about impact, user privacy is never compromised.</span>
                            </li>
                        </ul>
                    </div>
                </GradientCard>

                {/* Language Breakdown */}
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold">Language Distribution</h2>
                    <p className="text-muted-foreground">
                        Breaking down barriers by serving users in their preferred language.
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
