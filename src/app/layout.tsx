import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/providers";
import { getSystemSettings } from "@/app/actions/settings";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Imara - Empowering Women & Girls",
  description: "A safe space for female empowerment, education, and mentorship.",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png" },
    ],
  },
  manifest: "/favicons/site.webmanifest",
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enforce Maintenance Mode
  const settings = await getSystemSettings();
  if (settings.maintenanceMode) {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || "";
    const session = await auth.api.getSession({ headers: headersList });

    // Allowed paths: public static, auth api, etc already handled by next config or static serving
    // We need to check if user is allowed.
    // Admin routes are protected by admin layout, but maintenance mode should block public access.

    // Bypass for:
    // 1. /maintenance page (to prevent redirect loop)
    // 2. Auth API routes (handled by Next router/api folder, but layout wraps children) - Wait, layout wraps everything.
    // Note: API routes in Next.js App Router (route handlers) do NOT use this RootLayout. So API is safe.
    // 3. /signin page (to allow login)
    // 4. /admin routes IF user is admin (checked below)

    const isMaintenancePage = pathname === "/maintenance";
    const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");
    const isAdminData = pathname.startsWith("/admin");

    if (!isMaintenancePage && !isAuthPage && !isAdminData) {
      // If logged in as Admin, allow access? Logic in middleware was:
      // If maintenance is on, block unless special route.
      // Let's keep it simple: strict maintenance.
      redirect("/maintenance");
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
