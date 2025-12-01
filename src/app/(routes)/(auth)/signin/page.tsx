"use client";

import SignInForm from "./form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/language-context";

export default function SignInPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const signUpHref = redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/signup";

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex w-full flex-col rounded-2xl border border-foreground/10 px-8 py-5 md:w-96">
        <h1>{t("auth.signin.title")}</h1>
        <SignInForm />
        <div className="flex items-center justify-center gap-2">
          <small>{t("auth.noAccount")}</small>
          <Link href={signUpHref} className="text-sm font-bold leading-none">
            {t("auth.signup.link")}
          </Link>
        </div>
      </div>
    </div>
  );
}
