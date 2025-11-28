"use client";

import { seedCourses } from "@/app/actions/seed";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function SeedPage() {
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        try {
            const result = await seedCourses();
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-10 flex flex-col items-center justify-center space-y-4">
            <h1 className="text-2xl font-bold">Database Seeder</h1>
            <p className="text-muted-foreground">Click the button below to inject mock courses.</p>
            <Button onClick={handleSeed} disabled={loading}>
                {loading ? "Seeding..." : "Seed Mock Courses"}
            </Button>
        </div>
    );
}
