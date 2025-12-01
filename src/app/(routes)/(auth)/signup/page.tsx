"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SignUpForm from "./form";
import { useLanguage } from "@/lib/i18n/language-context";

export default function SignUpPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const signInHref = redirect ? `/signin?redirect=${encodeURIComponent(redirect)}` : "/signin";

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-10">
      <div className="flex w-full flex-col rounded-2xl border border-foreground/10 px-8 py-5 md:w-96">
        <h1>{t("auth.signup.title")}</h1>
        <SignUpForm />
        <div className="flex items-center justify-center gap-2">
          <small>{t("auth.haveAccount")}</small>
          <Link href={signInHref} className="text-sm font-bold leading-none">
            {t("auth.signin.link")}
          </Link>
        </div>
      </div>
    </div>
  );
}
