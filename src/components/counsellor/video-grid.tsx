"use client";

import { useState } from "react";
import { Clock, PlayCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoResource {
    id: string;
    title: string;
    videoUrl?: string | null;
    duration?: string | null;
    category: string;
}

interface VideoGridProps {
    resources: VideoResource[];
}

export function VideoGrid({ resources }: VideoGridProps) {
    const [showAll, setShowAll] = useState(false);
    const INITIAL_COUNT = 4;

    const displayedResources = showAll ? resources : resources.slice(0, INITIAL_COUNT);
    const hasMore = resources.length > INITIAL_COUNT;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedResources.map((res) => (
                    <div key={res.id} className="rounded-xl overflow-hidden border bg-card text-card-foreground shadow-sm group hover:shadow-md transition-all">
                        <div className="aspect-video w-full bg-muted relative">
                            {res.videoUrl && (res.videoUrl.includes("youtube") || res.videoUrl.includes("youtu.be")) ? (
                                <iframe
                                    src={res.videoUrl.replace("watch?v=", "embed/")}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : res.videoUrl ? (
                                <video
                                    src={res.videoUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                                    <PlayCircle className="h-12 w-12 text-muted-foreground/50" />
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                                    {res.category || "Education"}
                                </span>
                                {res.duration && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {res.duration}
                                    </span>
                                )}
                            </div>
                            <a
                                href={res.videoUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group/title"
                            >
                                <h3 className="font-semibold text-lg line-clamp-1 group-hover/title:text-primary transition-colors flex items-center gap-2">
                                    {res.title}
                                    <span className="opacity-0 group-hover/title:opacity-100 transition-opacity text-xs text-muted-foreground font-normal">
                                        (Open)
                                    </span>
                                </h3>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowAll(!showAll)}
                        className="group"
                    >
                        {showAll ? (
                            <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
                        ) : (
                            <>Show All ({resources.length}) <ChevronDown className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
