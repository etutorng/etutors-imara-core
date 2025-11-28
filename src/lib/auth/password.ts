import { z } from "zod";
import { TranslationKey } from "@/lib/i18n/translations";

export const createPasswordSchema = (t: (key: TranslationKey) => string) => z
  .string()
  .min(6, {
    message: t("auth.password.min"),
  })
  .refine((val) => {
    const weakPasswords = ["123456", "password", "password123", "12345678", "qwerty"];
    return !weakPasswords.includes(val.toLowerCase());
  }, {
    message: t("auth.password.weak"),
  });
