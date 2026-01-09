"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { updateProfile } from "@/app/actions/settings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const profileSchema = z.object({
    bio: z.string().optional(),
    specialization: z.string().optional(),
    experience: z.string().optional(),
    featuredVideo: z.string().optional(),
});

interface ProfileFormProps {
    initialData: {
        bio?: string | null;
        specialization?: string | null;
        experience?: string | null;
        featuredVideo?: string | null;
    };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            bio: initialData.bio || "",
            specialization: initialData.specialization || "",
            experience: initialData.experience || "",
            featuredVideo: initialData.featuredVideo || "",
        },
    });

    function onSubmit(values: z.infer<typeof profileSchema>) {
        startTransition(async () => {
            const res = await updateProfile({
                bio: values.bio || "",
                specialization: values.specialization || "",
                experience: values.experience || "",
                featuredVideo: values.featuredVideo || "",
            });

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Profile updated!");
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Professional Profile</CardTitle>
                <CardDescription>
                    This information will be displayed on your public counsellor profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="specialization"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Specialization</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Clinical Psychology, Career Counselling" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Experience / Qualifications</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 5 Years Experience, PhD in Psychology" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us about yourself..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Write a short bio that introduces you to potential clients.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="featuredVideo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Featured Video (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Add a video introduction to showcase on your profile.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
