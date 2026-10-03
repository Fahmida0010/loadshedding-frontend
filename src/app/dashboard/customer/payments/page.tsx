'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import { useAuthStore } from '@/src/store/useAuthStore';
import Loading from '@/src/app/loading';

export default function CustomerPaymentsPage() {
  const { token } = useAuthStore();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch Customer Bills
  const { data: bills = [], isLoading } = useQuery({
    queryKey: ['customer-bills'],
    queryFn: async () => {
      const res = await axiosSecure.get('/bills/my-bills'); 
      return res.data?.data || res.data;
    },
  });

  // Mutation for POST /payments/initiate
  const initiatePaymentMutation = useMutation({
    mutationFn: async (billId: string) => {
      const res = await axiosSecure.post(
        '/payments/initiate',
        { billId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      // Backend response theke GatewayPageURL ba paymentUrl dhora
      const redirectUrl = data?.data?.paymentUrl || data?.paymentUrl || data?.GatewayPageURL || data?.data?.GatewayPageURL;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Payment Initiated',
          text: 'Redirecting to payment gateway...',
        });
      }
    },
    onError: (err: any) => {
      const errorMsg = err?.response?.data?.message || 'Failed to initiate payment!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMsg,
      });
    },
  });

  const handlePayNow = (billId: string) => {
    if (!billId) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Bill',
        text: 'Please select a valid bill to pay!',
      });
      return;
    }
    initiatePaymentMutation.mutate(billId);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className=" text-green-500 p-6 ">
        <h1 className="text-3xl font-bold">Electricity Bill Payments 💳</h1>
        <p className="text-lg opacity-90 mt-1">View your monthly electricity bills and securely pay online via SSLCommerz.</p>
      </div>

      {/* Bills List Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">My Bills</h2>
        
        {bills.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border text-gray-500 shadow-sm">
            No bills found for your account.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bills.map((bill: any) => (
              <div 
                key={bill.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                      Bill No: {bill.billNumber}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${
                      bill.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {bill.status}
                    </span>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-bold text-xl text-gray-900">{bill.month}</h3>
                    <p className="text-2xl font-extrabold text-indigo-600 mt-1">৳ {bill.amount}</p>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1 pt-2">
                    <p>Due Date: <span className="font-medium text-gray-700">{new Date(bill.dueDate).toLocaleDateString()}</span></p>
                    {bill.paidAt && (
                      <p>Paid At: <span className="font-medium text-green-600">{new Date(bill.paidAt).toLocaleString()}</span></p>
                    )}
                    {bill.transactionId && (
                      <p>TxID: <span className="font-mono text-gray-600">{bill.transactionId}</span></p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  {bill.status === 'PAID' ? (
                    <button
                      disabled
                      className="w-full bg-green-50 text-green-700 font-semibold py-2.5 rounded-xl border border-green-200 cursor-not-allowed text-sm"
                    >
                      Already Paid ✅
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePayNow(bill.id)}
                      disabled={initiatePaymentMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition shadow-md disabled:opacity-50 text-sm"
                    >
                      {initiatePaymentMutation.isPending ? 'Processing...' : 'Pay with SSLCommerz 🚀'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}