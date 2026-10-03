'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('message') || 'The transaction was cancelled or failed.';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
          ❌
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Payment Failed!</h1>
          <p className="text-sm text-gray-500">{reason}</p>
        </div>

        <div className="pt-4 space-y-3">
          <Link
            href="/dashboard/customer/payments"
            className="w-full block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition shadow-md text-sm"
          >
            Try Again 🔄
          </Link>
        </div>
      </div>
    </div>
  );
}