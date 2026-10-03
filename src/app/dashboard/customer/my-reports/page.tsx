"use client";
import React, { useEffect, useState } from "react";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Info,
  ShieldAlert
} from "lucide-react";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure";
import { useAuthStore } from "@/src/store/useAuthStore";
import Loading from "@/src/app/loading";

// TypeScript interfaces based on your Prisma schema
interface Area {
  id: string;
  name: string;
  code: string;
  location?: string;
}

interface UnexpectedOutage {
  id: string;
  title: string;
  description?: string;
  reason?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "REPORTED" | "CONFIRMED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "CANCELLED";
  reportedAt: string;
  estimatedRestoreAt?: string;
  resolvedAt?: string;
  area: Area;
}

const MyReports: React.FC = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();

  const [reports, setReports] = useState<UnexpectedOutage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  // Fetch Reports
  const fetchMyReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosSecure.get("/outages/my-reports");
      // Adjust according to your backend response structure (e.g., response.data.data or response.data)
      setReports(response.data?.data || response.data || []);
    } catch (err: any) {
      console.error("Failed to fetch reports:", err);
      setError(err?.response?.data?.message || "Failed to load your outage reports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user]);

  // Badge Color Mappers
  const getStatusBadge = (status: UnexpectedOutage["status"]) => {
    switch (status) {
      case "REPORTED":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CONFIRMED":
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "IN_PROGRESS":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "RESOLVED":
      case "CLOSED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityBadge = (priority: UnexpectedOutage["priority"]) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-600 text-white";
      case "HIGH":
        return "bg-orange-500 text-white";
      case "MEDIUM":
        return "bg-amber-500 text-white";
      case "LOW":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Filter Logic
  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.area?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || report.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Outage Reports</h1>
                <p className="text-sm text-gray-500">Track and monitor the status of power issues you have reported.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchMyReports}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, area, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              >
                <option value="ALL">All Statuses</option>
                <option value="REPORTED">Reported</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <Loading/>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-rose-100 shadow-sm text-center px-4">
            <XCircle className="w-10 h-10 text-rose-500 mb-2" />
            <p className="text-sm font-semibold text-gray-900 mb-1">Error Loading Data</p>
            <p className="text-xs text-gray-500 max-w-md">{error}</p>
            <button
              onClick={fetchMyReports}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-center px-4">
            <div className="p-3 bg-gray-50 rounded-full text-gray-400 mb-3">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">No reports found</h3>
            <p className="text-xs text-gray-500 max-w-sm mt-1">
              You haven't submitted any outage reports matching your current filter criteria, or no records exist yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="py-4 px-6">Outage Details</th>
                      <th className="py-4 px-6">Area</th>
                      <th className="py-4 px-6">Priority</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Reported At</th>
                      <th className="py-4 px-6">Est. Restore</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-900">{report.title}</div>
                          {report.description && (
                            <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{report.description}</div>
                          )}
                          <div className="text-[10px] text-gray-400 font-mono mt-1">ID: {report.id}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="font-medium">{report.area?.name || "N/A"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${getPriorityBadge(report.priority)}`}>
                            {report.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusBadge(report.status)}`}>
                            {report.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {new Date(report.reportedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(report.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-xs whitespace-nowrap">
                          {report.estimatedRestoreAt ? (
                            <>
                              <div className="font-medium text-gray-800">
                                {new Date(report.estimatedRestoreAt).toLocaleDateString()}
                              </div>
                              <div className="text-gray-400 mt-0.5">
                                {new Date(report.estimatedRestoreAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400 italic">Pending calculation</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{report.title}</h3>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {report.id}</div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${getPriorityBadge(report.priority)}`}>
                      {report.priority}
                    </span>
                  </div>

                  {report.description && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl">
                      {report.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-medium truncate">{report.area?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-end">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${getStatusBadge(report.status)}`}>
                        {report.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 bg-gray-50/75 p-3 rounded-xl">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-semibold">Reported At</span>
                      <span className="font-medium text-gray-700">{new Date(report.reportedAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase font-semibold">Est. Restore</span>
                      <span className="font-medium text-gray-700">
                        {report.estimatedRestoreAt ? new Date(report.estimatedRestoreAt).toLocaleString() : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyReports;