import Link from "next/link";
import { XCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100 space-y-6">
        {/* ব্যাকগ্রাউন্ড রিমুভ করা হয়েছে এবং আইকন লাল রঙের XCircle করা হয়েছে */}
        <div className="flex items-center justify-center mx-auto text-red-500">
          <XCircle className="w-16 h-16" />
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-red-900">404</h1>
          <h2 className="text-xl font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-sm text-gray-600">
            The page you are looking for does not exist or has been moved. Please check the URL or return to the homepage.
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition shadow-sm"
          >
            <Home className="w-5 h-5 mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}