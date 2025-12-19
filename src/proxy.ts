import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    // Middleware is now lightweight.
    // Maintenance Mode is handled in RootLayout.
    // RBAC is handled in Admin Layout.
    // We keep this file if needed for simple path matching or future headers.

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
