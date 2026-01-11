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
        address: formData.get("address") as string,
        qualification: formData.get("qualification") as string,
        skill: formData.get("skill") as string,
        essay: formData.get("essay") as string,
    };

    // Note: Certificate upload removed as per request.
    // Address field added.

    const validation = createApplicationSchema.safeParse({ ...rawData });

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

    // Send email notification to admin
    try {
        const { sendEmail } = await import("@/lib/email");
        const adminEmail = process.env.ADMIN_EMAIL_NOTIFY || "admin@imara.etutors.ng"; // Fallback or env

        await sendEmail({
            to: adminEmail,
            subject: `New Scholarship Application: ${newApplication.fullName}`,
            text: `
New Application Received

Name: ${newApplication.fullName}
Email: ${newApplication.email || "N/A"}
Phone: ${newApplication.phone}
State/LGA: ${newApplication.state}, ${newApplication.lga}
Qualification: ${newApplication.qualification}
Skill Interest: ${newApplication.skill}

Essay:
${newApplication.essay}
            `,
            html: `
<h2>New Scholarship Application Received</h2>
<p><strong>Name:</strong> ${newApplication.fullName}</p>
<p><strong>Email:</strong> ${newApplication.email || "N/A"}</p>
<p><strong>Phone:</strong> ${newApplication.phone}</p>
<p><strong>Location:</strong> ${newApplication.state}, ${newApplication.lga}</p>
<p><strong>Address:</strong> ${newApplication.address}</p>
<p><strong>Qualification:</strong> ${newApplication.qualification}</p>
<p><strong>Skill Interest:</strong> ${newApplication.skill}</p>
<hr/>
<h3>Essay</h3>
<p style="white-space: pre-wrap;">${newApplication.essay}</p>
            `
        });
    } catch (emailError) {
        console.error("Failed to send admin notification:", emailError);
        // We don't block success if email fails, just log it
    }

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
