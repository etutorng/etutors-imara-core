import { getCounsellors } from "@/app/actions/counselling";
import { GradientCard } from "@/components/ui/gradient-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

export async function CounsellorGrid() {
    const counsellors = await getCounsellors();

    if (!counsellors || counsellors.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Our counsellors are currently being onboarded. Please check back soon.</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {counsellors.map((counsellor) => (
                <div
                    key={counsellor.id}
                    className="group relative bg-background rounded-2xl p-8 border hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full"
                >
                    <div className="flex flex-col items-center text-center flex-1 w-full">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Avatar className="h-28 w-28 border-4 border-background shadow-xl relative z-10">
                                <AvatarImage src={counsellor.image || undefined} alt={counsellor.name} className="object-cover" />
                                <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                                    {counsellor.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1.5 shadow-md z-20">
                                <BadgeCheck className="h-5 w-5 text-primary fill-background" />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2 tracking-tight">{counsellor.name}</h3>

                        {counsellor.specialization && (
                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                {counsellor.specialization.split(',').slice(0, 2).map((s, i) => (
                                    <span key={i} className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                        {s.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        {counsellor.bio && (
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                                {counsellor.bio}
                            </p>
                        )}

                        <Button asChild className="w-full mt-auto rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="outline">
                            <Link href={`/counselling/${counsellor.id}`}>
                                View Profile <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
