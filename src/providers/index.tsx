"use client";

import { Toaster } from "sonner";
import { LanguageProvider } from "@/lib/i18n/language-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
      <Toaster position="top-center" />
    </LanguageProvider>
  );
}
