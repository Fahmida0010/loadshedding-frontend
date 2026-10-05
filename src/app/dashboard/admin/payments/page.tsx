"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Filter, 
  Eye, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  X,
  CreditCard,
} from "lucide-react";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure";
import { useAuthStore } from "@/src/store/useAuthStore";
import Loading from "@/src/app/loading";

// TypeScript Interfaces based on your Prisma Schema
interface User {
  id: string;
  name: string;
  email: string;
}

interface Bill {
  id: string;
  userId: string;
  billNumber: string;
  month: string;
  amount: number;
  dueDate: string;
  status: "UNPAID" | "PAID" | "OVERDUE" | "CANCELLED";
  transactionId?: string;
  paymentMethod?: string;
  paidAt?: string;
  user: User;
}

export default function AdminPaymentsPage() {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuthStore();

  const [payments, setPayments] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedPayment, setSelectedPayment] = useState<Bill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Fetch payments using useAxiosSecure
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/payments");
      setPayments(response.data.data || response.data || []);
    } catch (error) {
      console.error("Failed to fetch payment records:", error);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    if (currentUser) {
      fetchPayments();
    }
  }, [currentUser, fetchPayments]);

  // Filter and Search logic
  const filteredPayments = payments.filter((item) => {
    const matchesSearch = 
      item.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedData = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status Badge Component
  const renderStatusBadge = (status: Bill["status"]) => {
    const styles: Record<Bill["status"], { bg: string; text: string; icon: React.ReactNode }> = {
      PAID: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "Paid", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
      UNPAID: { bg: "bg-amber-50 text-amber-700 border-amber-200", text: "Unpaid", icon: <Clock className="w-3.5 h-3.5" /> },
      OVERDUE: { bg: "bg-rose-50 text-rose-700 border-rose-200", text: "Overdue", icon: <AlertCircle className="w-3.5 h-3.5" /> },
      CANCELLED: { bg: "bg-slate-100 text-slate-600 border-slate-200", text: "Cancelled", icon: <X className="w-3.5 h-3.5" /> },
    };

    const current = styles[status] || styles.UNPAID;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${current.bg}`}>
        {current.icon}
        {current.text}
      </span>
    );
  };

  // Metrics calculations
  const totalRevenue = payments
    .filter(p => p.status === "PAID")
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const pendingBillsCount = payments.filter(p => p.status === "UNPAID" || p.status === "OVERDUE").length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Payment Management</h1>
            <p className="text-sm text-slate-500 mt-1">Monitor electricity bills, gateway transactions, and customer payment statuses.</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-xl shadow-xs text-sm transition-all"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Collected</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">৳{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Dues</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingBillsCount} Bills</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Tracked Bills</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{payments.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by bill #, customer name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm text-slate-600 shrink-0">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Status:</span>
            </div>
            {["ALL", "PAID", "UNPAID", "OVERDUE"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  statusFilter === status 
                    ? "bg-indigo-600 text-white shadow-xs" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table / Card View with Custom Loading State */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <Loading />
          ) : paginatedData.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-sm">
              No payment records found matching your filters.
            </div>
          ) : (
            <>
              {/* Desktop & Mobile Responsive Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-6">Bill Number</th>
                      <th className="py-3.5 px-6">Customer</th>
                      <th className="py-3.5 px-6">Billing Month</th>
                      <th className="py-3.5 px-6">Amount</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-slate-900">{item.billNumber}</td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-slate-800">{item.user?.name || "N/A"}</p>
                          <p className="text-xs text-slate-400">{item.user?.email || "N/A"}</p>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{item.month}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900">৳{item.amount?.toLocaleString()}</td>
                        <td className="py-4 px-6">{renderStatusBadge(item.status)}</td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => { setSelectedPayment(item); setIsModalOpen(true); }}
                            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all inline-flex items-center gap-1 text-xs font-medium"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden xl:inline">Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">
                <p className="text-xs text-slate-500">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredPayments.length)}</span> of <span className="font-medium">{filteredPayments.length}</span> entries
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium text-slate-700 px-2">Page {currentPage} of {totalPages || 1}</span>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Payment Details Modal */}
        {isModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-900">Payment & Bill Details</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                  <div>
                    <span className="text-xs text-slate-400 block">Bill Number</span>
                    <span className="font-semibold text-slate-800">{selectedPayment.billNumber}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Status</span>
                    <div className="mt-0.5">{renderStatusBadge(selectedPayment.status)}</div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer Name:</span>
                    <span className="font-medium text-slate-800">{selectedPayment.user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email Address:</span>
                    <span className="font-medium text-slate-800">{selectedPayment.user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Billing Month:</span>
                    <span className="font-medium text-slate-800">{selectedPayment.month}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Amount:</span>
                    <span className="font-bold text-slate-900">৳{selectedPayment.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Due Date:</span>
                    <span className="font-medium text-slate-800">{new Date(selectedPayment.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedPayment.status === "PAID" && (
                  <div className="space-y-2 border-t border-slate-100 pt-4 bg-emerald-50/50 p-4 rounded-xl">
                    <h4 className="font-semibold text-emerald-900 text-xs uppercase tracking-wider">Gateway Information</h4>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-700">Transaction ID:</span>
                      <span className="font-mono font-medium text-emerald-900">{selectedPayment.transactionId || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-700">Payment Gateway:</span>
                      <span className="font-medium text-emerald-900">{selectedPayment.paymentMethod || "SSLCOMMERZ"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-700">Paid At:</span>
                      <span className="font-medium text-emerald-900">
                        {selectedPayment.paidAt ? new Date(selectedPayment.paidAt).toLocaleString() : "N/A"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-xl text-xs transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}