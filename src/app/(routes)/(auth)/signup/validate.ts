import { passwordSchema } from "@/lib/auth/password";
import { z } from "zod";

const disallowedUsernamePatterns = [
  "admin",
  "superuser",
  "superadmin",
  "root",
  "jabirdev",
  "cakfan",
  "withcakfan",
];

export const SignUpSchema = z
  .object({
    email: z
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
    name: z.string().min(4, { message: "Must be at least 4 characters" }),
    username: z
      .string()
      .min(4, { message: "Must be at least 4 characters" })
      .regex(/^[a-zA-Z0-0_-]+$/, "Only letters, numbers, - and _ allowed")
      .refine(
        (username) => {
          for (const pattern of disallowedUsernamePatterns) {
            if (username.toLowerCase().includes(pattern)) {
              return false;
            }
          }
          return true;
        },
        { message: "Username contains disallowed words" },
      ),
    password: passwordSchema,
    confirmPassword: z.string().min(8, {
      message: "Must be at least 8 characters",
    }),
    gender: z.boolean().nonoptional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpValues = z.infer<typeof SignUpSchema>;
