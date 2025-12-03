"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/language-context";
import { createSignInSchema, SignInValues } from "./validate";
import InputStartIcon from "../components/input-start-icon";
import InputPasswordContainer from "../components/input-password";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { z } from "zod";

export default function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useLanguage();

  const form = useForm<SignInValues>({
    resolver: zodResolver(createSignInSchema(t)),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  function onSubmit(data: SignInValues) {
    startTransition(async () => {
      const isEmail = z.string().email().safeParse(data.identifier).success;

      let response;

      if (isEmail) {
        response = await signIn.email({
          email: data.identifier,
          password: data.password,
        });
      } else {
        // Clean phone number to use as username
        const cleanPhone = data.identifier.replace(/[^0-9]/g, "");
        response = await signIn.username({
          username: cleanPhone,
          password: data.password,
        });
      }

      if (response.error) {
        console.log("SIGN_IN:", response.error.message);
        toast.error(response.error.message);
      } else {
        router.push(redirectUrl);
      }
    });
  }

  const getInputClassName = (fieldName: keyof SignInValues) =>
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
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputStartIcon icon={Mail}>
                  <Input
                    placeholder={t("auth.placeholder.identifier") || "Email or Phone"}
                    className={cn("peer ps-9", getInputClassName("identifier"))}
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
                    id="input-23"
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
        <Button type="submit" disabled={isPending} className="mt-5 w-full">
          {t("auth.signin.button")}
        </Button>
      </form>
    </Form>
  );
}
