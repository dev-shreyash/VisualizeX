import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-4xl font-bold text-red-600">403 - Forbidden</h1>
      <p>You do not have permission to access this page.</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
