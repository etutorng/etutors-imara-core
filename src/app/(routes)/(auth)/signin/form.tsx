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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/language-context";
import { createSignInSchema, SignInValues } from "./validate";
import InputStartIcon from "../components/input-start-icon";
import InputPasswordContainer from "../components/input-password";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";

export default function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useLanguage();

  const form = useForm<SignInValues>({
    resolver: zodResolver(createSignInSchema(t)),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  function onSubmit(data: SignInValues) {
    startTransition(async () => {
      // Clean phone number to use as username
      const cleanPhone = data.phoneNumber.replace(/[^0-9]/g, "");

      const response = await signIn.username({
        username: cleanPhone,
        password: data.password,
      });

      if (response.error) {
        console.log("SIGN_IN:", response.error.message);
        toast.error(response.error.message);
      } else {
        router.push("/dashboard");
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
        className="z-50 my-8 flex w-full flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputStartIcon icon={Phone}>
                  <Input
                    placeholder="Phone Number"
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
                    id="input-23"
                    className={cn("pe-9", getInputClassName("password"))}
                    placeholder="Password"
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
          Sign In
        </Button>
      </form>
    </Form>
  );
}
