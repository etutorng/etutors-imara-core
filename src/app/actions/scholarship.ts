"use server";

import { z } from "zod";

import { storage } from "@/lib/storage";
import { createApplicationSchema, type Application } from "@/lib/schemas/scholarship";

// Mock in-memory storage for demonstration (since DB schema update wasn't requested/might differ)
// In a real app, this would be a database interactions
let applications: Application[] = [];

export async function submitApplication(formData: FormData) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const rawData = {
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        state: formData.get("state") as string,
        lga: formData.get("lga") as string,
        qualification: formData.get("qualification") as string,
        skill: formData.get("skill") as string,
        essay: formData.get("essay") as string,
    };

    const file = formData.get("certificate") as File;
    let certificateUrl = "";

    if (file && file.size > 0) {
        try {
            // Upload file using storage provider
            const filename = `scholarship/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
            certificateUrl = await storage.uploadFile(file, filename);
        } catch (error) {
            console.error("File upload failed:", error);
            return { error: "Failed to upload certificate" };
        }
    } else {
        return { error: "O-Level Certificate is required" };
    }

    const validation = createApplicationSchema.safeParse({ ...rawData, certificateUrl });

    if (!validation.success) {
        return { error: validation.error.errors[0].message };
    }

    const newApplication: Application = {
        id: Math.random().toString(36).substring(7),
        ...validation.data,
        status: "pending",
        createdAt: new Date(),
    };

    applications.unshift(newApplication);

    return { success: true, applicationId: newApplication.id };
}

export async function getApplications() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return applications;
}

export async function updateApplicationStatus(id: string, status: "pending" | "approved" | "rejected") {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    applications = applications.map(app =>
        app.id === id ? { ...app, status } : app
    );

    return { success: true };
}
