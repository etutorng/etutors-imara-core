"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SignUpValues } from "./validate";
import InputStartIcon from "../components/input-start-icon";
import InputPasswordContainer from "../components/input-password";
import { cn } from "@/lib/utils";
import { Phone, UserIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { languages } from "@/lib/i18n/translations";
import { createSignUpSchema, SignUpValues } from "./validate";

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(createSignUpSchema(t)),
    defaultValues: {
      name: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      language: "en",
      acceptTerms: false,
    },
  });

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  function onSubmit(data: SignUpValues) {
    startTransition(async () => {
      // Save language preference to localStorage
      localStorage.setItem("language", data.language);

      // Generate dummy email and username from phone number
      // Remove spaces and special chars from phone for username
      const cleanPhone = data.phoneNumber.replace(/[^0-9]/g, "");
      const dummyEmail = `${cleanPhone}@imara.app`;

      const response = await signUp.email({
        email: dummyEmail,
        password: data.password,
        name: data.name,
        username: cleanPhone, // Use phone number as username
        gender: true, // Implicitly female
        image: undefined, // Optional
      });

      if (response.error) {
        console.log("SIGN_UP:", response.error.status);
        toast.error(response.error.message);
      } else {
        router.push(redirectUrl);
      }
    });
  }

  const getInputClassName = (fieldName: keyof SignUpValues) =>
    cn(
      form.formState.errors[fieldName] &&
      "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20",
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-8 flex w-full flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputStartIcon icon={UserIcon}>
                  <Input
                    placeholder={t("auth.placeholder.name")}
                    className={cn("peer ps-9", getInputClassName("name"))}
                    disabled={isPending}
                    {...field}
                  />
                </InputStartIcon>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputStartIcon icon={Phone}>
                  <Input
                    placeholder={t("auth.placeholder.phoneExample")}
                    className={cn("peer ps-9", getInputClassName("phoneNumber"))}
                    disabled={isPending}
                    {...field}
                  />
                </InputStartIcon>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputPasswordContainer>
                  <Input
                    className={cn("pe-9", getInputClassName("password"))}
                    placeholder={t("auth.password")}
                    disabled={isPending}
                    {...field}
                  />
                </InputPasswordContainer>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputPasswordContainer>
                  <Input
                    className={cn("pe-9", getInputClassName("confirmPassword"))}
                    placeholder={t("auth.confirmPassword")}
                    disabled={isPending}
                    {...field}
                  />
                </InputPasswordContainer>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Language Selection */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.language")}</FormLabel>
              <FormControl>
                <select
                  {...field}
                  disabled={isPending}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Object.entries(languages).map(([code, lang]) => (
                    <option key={code} value={code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Privacy Policy Acceptance */}
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal block leading-normal">
                  {t("auth.acceptTerms")}{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline inline"
                    target="_blank"
                  >
                    {t("auth.privacyPolicy")}
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="mt-5 w-full">
          {t("auth.signup.button")}
        </Button>
      </form>
    </Form>
  );
}
