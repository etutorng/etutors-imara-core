import { createPasswordSchema } from "@/lib/auth/password";
import { z } from "zod";
import { TranslationKey } from "@/lib/i18n/translations";

export const createSignInSchema = (t: (key: TranslationKey) => string) => z.object({
  phoneNumber: z
    .string()
    .min(10, { message: t("auth.phone.invalid") })
    .regex(/^[0-9+\s]+$/, t("auth.phone.invalid")),
  password: createPasswordSchema(t),
});

export type SignInValues = z.infer<ReturnType<typeof createSignInSchema>>;
