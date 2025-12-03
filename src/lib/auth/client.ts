import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";

export const { signIn, signUp, signOut, useSession, getSession } =
  createAuthClient({
    baseURL:
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    emailAndPassword: {
      enabled: true,
    },
    plugins: [usernameClient(), nextCookies()],
  });
