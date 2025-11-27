"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LanguageCode, translations, TranslationKey } from "./translations";

interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<LanguageCode>("en");

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem("language") as LanguageCode;
        if (savedLang && translations[savedLang]) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: LanguageCode) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations.en[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
