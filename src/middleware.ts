import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

import {
    apiAuthPrefix,
    authRoutes,
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,
} from "./routes";

export async function middleware(request: NextRequest) {
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

    if (isApiAuth) {
        return NextResponse.next();
    }

    if (isAuthRoute()) {
        if (sessionCookie) {
            return NextResponse.redirect(
                new URL(DEFAULT_LOGIN_REDIRECT, request.url),
            );
        }
        return NextResponse.next();
    }

    if (!sessionCookie && !isPublicRoute) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // RBAC Logic
    if (sessionCookie && request.nextUrl.pathname.startsWith("/admin")) {
        try {
            const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
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

    return NextResponse.next();
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
