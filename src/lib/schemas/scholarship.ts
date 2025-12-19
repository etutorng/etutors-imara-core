import { z } from "zod";

// Define the schema for the application form
export const createApplicationSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address").or(z.literal("")).optional(),
    phone: z.string().min(10, "Valid phone number is required"),
    state: z.string().min(1, "State is required"),
    lga: z.string().min(1, "LGA is required"),
    qualification: z.string().min(1, "Qualification is required"),
    skill: z.string().min(1, "Skill is required"),
    essay: z.string().min(20, "Please tell us more about why you want this"),
    certificateUrl: z.string().optional(),
});

export type Application = z.infer<typeof createApplicationSchema> & {
    id: string;
    status: "pending" | "approved" | "rejected";
    createdAt: Date;
};
