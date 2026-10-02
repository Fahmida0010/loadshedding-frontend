"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Search, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  PlusCircle,
  X
} from "lucide-react";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure";
import { useAuthStore } from "@/src/store/useAuthStore";
import Loading from "../../loading";


type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type OutageStatus = "REPORTED" | "CONFIRMED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "CANCELLED";

interface Area {
  id: string;
  name: string;
  code: string;
}

interface UnexpectedOutage {
  id: string;
  title: string;
  description: string | null;
  reason: string | null;
  priority: Priority;
  status: OutageStatus;
  reportedAt: string;
  estimatedRestoreAt: string | null;
  area: Area;
}

export default function CurrentOutagesSection() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();

  const [outages, setOutages] = useState<UnexpectedOutage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");

  // Report Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    areaId: "",
    title: "",
    description: "",
    reason: "",
    priority: "MEDIUM" as Priority,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch Outages using useAxiosSecure
  const fetchOutages = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        limit: "6", // Show top active outages on the home page section
        ...(searchTerm && { searchTerm }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedPriority && { priority: selectedPriority }),
      });

      const response = await axiosSecure.get(`/outages?${queryParams.toString()}`);
      setOutages(response.data.data || response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch current outages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutages();
  }, [searchTerm, selectedStatus, selectedPriority]);

  // Handle Report Outage Submission
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFormError("You must be logged in to report an outage.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      await axiosSecure.post("/outages", formData);
      setSuccessMessage("Outage reported successfully!");
      setIsModalOpen(false);
      setFormData({ areaId: "", title: "", description: "", reason: "", priority: "MEDIUM" });
      fetchOutages();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Failed to report outage.");
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-800 border-red-200";
      case "HIGH": return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW": return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getStatusBadge = (status: OutageStatus) => {
    switch (status) {
      case "REPORTED": return "bg-gray-100 text-gray-700";
      case "CONFIRMED": return "bg-blue-100 text-blue-700";
      case "ASSIGNED": return "bg-purple-100 text-purple-700";
      case "IN_PROGRESS": return "bg-amber-100 text-amber-700";
      case "RESOLVED": return "bg-emerald-100 text-emerald-700";
      case "CLOSED": return "bg-slate-100 text-slate-700";
      case "CANCELLED": return "bg-red-50 text-red-600";
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="text-amber-500 w-7 h-7" />
            Current Power Outages & Area Status
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Track real-time power failures reported across different areas and submit new reports.
          </p>
        </div>

        {user ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Report Outage
          </button>
        ) : (
          <p className="text-xs text-gray-500 italic">Login required to report unexpected outages</p>
        )}
      </div>

      {successMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm">
          {successMessage}
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by area or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Outages Grid */}
      {loading ? <Loading/>
       : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-sm">
          {error}
        </div>
      ) : outages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-base font-medium text-gray-900">No active outages</h3>
          <p className="text-gray-500 text-xs mt-1">All monitored areas have stable power right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outages.map((outage) => (
            <div 
              key={outage.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getPriorityBadge(outage.priority)}`}>
                    {outage.priority}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(outage.status)}`}>
                    {outage.status.replace("_", " ")}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-1">{outage.title}</h3>
                <p className="text-gray-600 text-xs mb-4 line-clamp-2">
                  {outage.description || "No description provided."}
                </p>

                <div className="space-y-1.5 text-xs text-gray-500 mb-4 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Area: <strong className="text-gray-800">{outage.area?.name || "N/A"}</strong></span>
                  </div>
                  {outage.reason && (
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">Reason: <strong className="text-gray-800">{outage.reason}</strong></span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Reported: {new Date(outage.reportedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Est. Restoration:</span>
                <span className="font-semibold text-gray-700">
                  {outage.estimatedRestoreAt ? new Date(outage.estimatedRestoreAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Outage Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">Report Unexpected Outage</h3>

            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Area ID</label>
                <input
                  type="text"
                  required
                  placeholder="Enter Area UUID"
                  value={formData.areaId}
                  onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sudden power outage"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details about the outage..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
                  <input
                    type="text"
                    placeholder="e.g., Line fault"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}