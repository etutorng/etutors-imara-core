import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
            <p className="mb-8">You do not have permission to access this page.</p>
            <Link href="/" className="text-blue-500 hover:underline">
                Go back home
            </Link>
        </div>
    );
}
