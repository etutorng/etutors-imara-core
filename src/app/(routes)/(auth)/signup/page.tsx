import { Suspense } from "react";
import { SignUpContent } from "./signup-content";
import { getSystemSettings } from "@/app/actions/settings";

export default async function SignUpPage() {
  const settings = await getSystemSettings();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent allowRegistration={settings.allowRegistration} />
    </Suspense>
  );
}
