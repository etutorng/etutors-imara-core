import { navTranslations } from "./translations/nav";
import { authTranslations } from "./translations/auth";
import { dashboardTranslations } from "./translations/dashboard";
import { homeTranslations } from "./translations/home";
import { pagesTranslations } from "./translations/pages";

export const languages = {
    en: { name: "English", nativeName: "English" },
    ha: { name: "Hausa", nativeName: "Hausa" },
    ig: { name: "Igbo", nativeName: "Igbo" },
    yo: { name: "Yoruba", nativeName: "Yorùbá" },
    pcm: { name: "Pidgin", nativeName: "Pidgin" },
} as const;

export type LanguageCode = keyof typeof languages;

// Merge all translation modules
function mergeTranslations<T extends LanguageCode>(lang: T) {
    return {
        ...navTranslations[lang],
        ...authTranslations[lang],
        ...dashboardTranslations[lang],
        ...homeTranslations[lang],
        ...pagesTranslations[lang],
    };
}

export const translations = {
    en: mergeTranslations("en"),
    ha: mergeTranslations("ha"),
    ig: mergeTranslations("ig"),
    yo: mergeTranslations("yo"),
    pcm: mergeTranslations("pcm"),
} as const;

export type TranslationKey = keyof typeof translations.en;
