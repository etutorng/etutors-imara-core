import { publicRoutes } from "../routes";

const pathname = "/dashboard";

const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") {
        return pathname === "/";
    }
    return pathname.startsWith(route);
});

console.log("Path:", pathname);
console.log("Public Routes:", publicRoutes);
console.log("Is Public:", isPublicRoute);
