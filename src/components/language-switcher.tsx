"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { languages, LanguageCode } from "@/lib/i18n/translations";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">{language.toUpperCase()}</span>
                    <ChevronDown className="h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {Object.entries(languages).map(([code, lang]) => (
                    <DropdownMenuItem
                        key={code}
                        onClick={() => setLanguage(code as LanguageCode)}
                        className={language === code ? "bg-accent" : ""}
                    >
                        <span className="font-medium w-8">{code.toUpperCase()}</span>
                        <span className="ml-2">{lang.nativeName}</span>
                        {language === code && <span className="ml-auto">✓</span>}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
