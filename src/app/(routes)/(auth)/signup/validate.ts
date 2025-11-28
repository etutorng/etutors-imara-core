import { createPasswordSchema } from "@/lib/auth/password";
import { z } from "zod";
import { TranslationKey } from "@/lib/i18n/translations";

export const createSignUpSchema = (t: (key: TranslationKey) => string) => z
  .object({
    name: z.string().min(2, { message: t("auth.name.required") }),
    phoneNumber: z
      .string()
      .min(10, { message: t("auth.phone.invalid") })
      .regex(/^[0-9+\s]+$/, t("auth.phone.invalid")),
    password: createPasswordSchema(t),
    confirmPassword: z.string().min(6, {
      message: t("auth.password.min"),
    }),
    language: z.enum(["en", "ha", "ig", "yo", "pcm"]).default("en"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: t("auth.acceptTerms"), // Using existing key, though it's a bit long for an error message, it works.
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("auth.password.match"),
    path: ["confirmPassword"],
  });

export type SignUpValues = z.infer<ReturnType<typeof createSignUpSchema>>;
