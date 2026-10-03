'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get('tran_id');

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
          ✅
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
          <p className="text-sm text-gray-500">
            Your electricity bill payment has been processed successfully through SSLCommerz.
          </p>
          {tranId && (
            <p className="text-xs font-mono bg-gray-50 p-2 rounded-lg text-gray-600 border mt-2">
              Transaction ID: {tranId}
            </p>
          )}
        </div>

        <div className="pt-4 space-y-3">
          <Link
            href="/dashboard/customer/payments"
            className="w-full block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-md text-sm"
          >
            View My Bills 💳
          </Link>
        </div>
      </div>
    </div>
  );
}