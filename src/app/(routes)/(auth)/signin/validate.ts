import { createPasswordSchema } from "@/lib/auth/password";
import { z } from "zod";
import { TranslationKey } from "@/lib/i18n/translations";

export const createSignInSchema = (t: (key: TranslationKey) => string) => z.object({
  identifier: z
    .string()
    .min(3, { message: t("auth.identifier.invalid") })
    .refine((val) => {
      const isEmail = z.string().email().safeParse(val).success;
      const isPhone = /^[0-9+\s]+$/.test(val) && val.length >= 10;
      return isEmail || isPhone;
    }, { message: t("auth.identifier.invalid") }),
  password: z.string().min(1, { message: t("auth.password.min") }),
});

export type SignInValues = z.infer<ReturnType<typeof createSignInSchema>>;
