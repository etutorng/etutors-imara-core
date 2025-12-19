import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import {
    apiAuthPrefix,
    authRoutes,
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,
} from "./routes";

export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    const isApiAuth = request.nextUrl.pathname.startsWith(apiAuthPrefix);

    const isPublicRoute = publicRoutes.some((route) => {
        if (route === "/") {
            return request.nextUrl.pathname === "/";
        }
        return request.nextUrl.pathname.startsWith(route);
    });

    const isAuthRoute = () => {
        return authRoutes.some((path) => request.nextUrl.pathname.startsWith(path));
    };

    if (isApiAuth || request.nextUrl.pathname === "/api/system/status") {
        return NextResponse.next();
    }

    if (isAuthRoute()) {
        if (sessionCookie) {
            // Verify the session is actually valid before redirecting
            try {
                const fetchUrl = process.env.NODE_ENV === "production"
                    ? "http://127.0.0.1:3000/api/auth/get-session"
                    : `${request.nextUrl.origin}/api/auth/get-session`;

                const res = await fetch(fetchUrl, {
                    headers: {
                        cookie: request.headers.get("cookie") || "",
                    },
                });
                const sessionData = await res.json();

                // Only redirect if session is valid and user exists
                if (sessionData && sessionData.user) {
                    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
                }
            } catch (error) {
                console.error("Session validation error:", error);
                // If session validation fails, allow access to auth routes
            }
        }
        return NextResponse.next();
    }

    // Check System Settings (Maintenance & Registration)
    try {
        const fetchUrl = process.env.NODE_ENV === "production"
            ? "http://127.0.0.1:3000/api/system/status"
            : `${request.nextUrl.origin}/api/system/status`;

        const settingsRes = await fetch(fetchUrl);
        if (settingsRes.ok) {
            const { maintenanceMode, allowRegistration } = await settingsRes.json();

            // Enforce Maintenance Mode
            // Block all except:
            // - Public/Auth (to allow login)
            // - Admin (checked via RBAC later)
            // - Api Auth (Better Auth)
            // - /maintenance page itself

            const isMaintenancePage = request.nextUrl.pathname === "/maintenance";

            if (maintenanceMode) {
                // Allow:
                // 1. API Auth routes (for login)
                // 2. Auth Routes (Signin) -> checked by isAuthRoute()
                // 3. Admin Routes (will be RBAC checked) -> checked by startsWith("/admin")
                // 4. The Maintenance Page itself
                // 5. Static files (handled by matcher)

                // If it's NOT one of the allowed, redirect to maintenance.

                const isAllowedDuringMaintenance =
                    isApiAuth ||
                    isAuthRoute() ||
                    request.nextUrl.pathname.startsWith("/admin") ||
                    isMaintenancePage;

                if (!isAllowedDuringMaintenance) {
                    // Logic: If user is logged in as Super Admin, they *might* want to see the site.
                    // But middleware session parsing is heavy. 
                    // Let's rely on the fact that if they go to /admin they are fine.
                    // If they go to home page, they get maintenance screen unless we decode session here.
                    // Existing code decodes session later for RBAC. Let's do it if we need to exempt Super Admin on frontend.
                    // For now, strict: If maintenance, user sees maintenance unless accessing admin/auth.
                    return NextResponse.redirect(new URL("/maintenance", request.url));
                }
            } else if (isMaintenancePage) {
                // If NOT in maintenance mode, redirect away from /maintenance to home
                return NextResponse.redirect(new URL("/", request.url));
            }

            // Enforce Registration
            if (!allowRegistration && request.nextUrl.pathname === "/signup") {
                // Redirect to signin or a dedicated "closed" page. 
                // For now, redirect to signin with a query param? Or just rewrite to an error page?
                // Let's redirect to signin for simplicity or keep valid URL but show content.
                // Redirecting to signin is safest.
                return NextResponse.redirect(new URL("/signin?error=registration_closed", request.url));
            }
        }
    } catch (e) {
        console.error("Middleware settings fetch error", e);
        // Fail open (allow access) if settings fetch fails to avoid lockout
    }

    if (!sessionCookie && !isPublicRoute) {
        // If maintenance is on, we already redirected above.
        // If here, normal auth check.
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // RBAC Logic
    if (sessionCookie && request.nextUrl.pathname.startsWith("/admin")) {
        try {
            const fetchUrl = process.env.NODE_ENV === "production"
                ? "http://127.0.0.1:3000/api/auth/get-session"
                : `${request.nextUrl.origin}/api/auth/get-session`;

            const res = await fetch(fetchUrl, {
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            });
            const sessionData = await res.json();

            if (!sessionData || !sessionData.user) {
                return NextResponse.redirect(new URL("/signin", request.url));
            }

            const role = sessionData.user.role;

            // 1. Protect All Admin Routes
            if (request.nextUrl.pathname.startsWith("/admin/legal")) {
                if (role !== "SUPER_ADMIN" && role !== "LEGAL_PARTNER") {
                    return NextResponse.redirect(new URL("/unauthorized", request.url));
                }
            }

            if (request.nextUrl.pathname.startsWith("/admin/content")) {
                if (role !== "SUPER_ADMIN" && role !== "CONTENT_EDITOR") {
                    return NextResponse.redirect(new URL("/unauthorized", request.url));
                }
            }


            // General /admin access check
            if (role === "USER") {
                return NextResponse.redirect(new URL("/unauthorized", request.url));
            }
        } catch (error) {
            console.error("Middleware session fetch error:", error);
            // Fallback to signin if we can't verify session
            return NextResponse.redirect(new URL("/signin", request.url));
        }
    }

    const response = NextResponse.next();
    response.headers.set("x-pathname", request.nextUrl.pathname);
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
