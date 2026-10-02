"use client";

import React, { useEffect, useState } from "react";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure"; 
import { useAuthStore } from "@/src/store/useAuthStore";     
import Swal from "sweetalert2";
import { FaExclamationTriangle, FaEdit, FaTrash, FaSearch, FaEye, FaCheckCircle } from "react-icons/fa";

interface Area {
  id: string;
  name: string;
  code: string;
}

interface UserReporter {
  id: string;
  name: string;
  email: string;
}

interface UnexpectedOutage {
  id: string;
  areaId: string;
  reportedById: string;
  title: string;
  description?: string;
  reason?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "REPORTED" | "CONFIRMED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "CANCELLED";
  reportedAt: string;
  estimatedRestoreAt?: string;
  area?: Area;
  reportedBy?: UserReporter;
}

export default function Outages() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();

  const [outages, setOutages] = useState<UnexpectedOutage[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [areaFilter, setAreaFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Modal State for Status Update / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOutage, setSelectedOutage] = useState<UnexpectedOutage | null>(null);
  
  // Form fields for updating status & estimated time
  const [updateFormData, setUpdateFormData] = useState({
    status: "REPORTED" as UnexpectedOutage["status"],
    reason: "",
    estimatedRestoreAt: "",
  });

  // Fetch Areas for Filter & Details
  const fetchAreas = async () => {
    try {
      const response = await axiosSecure.get(`/areas`);
      setAreas(response.data?.data || response.data || []);
    } catch (error: any) {
      console.error("Failed to load areas", error);
    }
  };

  // Fetch Outages with Query Params
  const fetchOutages = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/outages`, {
        params: {
          searchTerm,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          areaId: areaFilter || undefined,
          page,
          limit,
        },
      });
      setOutages(response.data?.data || response.data || []);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message || "Failed to load outages!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    fetchOutages();
  }, [searchTerm, statusFilter, priorityFilter, areaFilter, page, limit]);

  // Open Status Update Modal
  const handleOpenStatusModal = (outage: UnexpectedOutage) => {
    setSelectedOutage(outage);
    setUpdateFormData({
      status: outage.status,
      reason: outage.reason || "",
      estimatedRestoreAt: outage.estimatedRestoreAt ? new Date(outage.estimatedRestoreAt).toISOString().slice(0, 16) : "",
    });
    setIsModalOpen(true);
  };

  // Handle Status Update Submit (`PATCH /outages/:id/status` and `PATCH /outages/:id`)
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOutage) return;

    try {
      // 1. Update Status via endpoint: PATCH /outages/:id/status
      await axiosSecure.patch(`/outages/${selectedOutage.id}/status`, {
        status: updateFormData.status,
        reason: updateFormData.reason,
        estimatedRestoreAt: updateFormData.estimatedRestoreAt ? new Date(updateFormData.estimatedRestoreAt).toISOString() : null,
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Outage status successfully updated.",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      fetchOutages();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: error?.response?.data?.message || "Failed to update outage status.",
      });
    }
  };

  // Handle Delete (Soft Delete via DELETE /outages/:id)
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Assigned or active outages cannot be deleted easily. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/outages/${id}`);
          Swal.fire("Deleted!", "Outage has been deleted successfully.", "success");
          fetchOutages();
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: error?.response?.data?.message || "Assigned or active outage cannot be deleted.",
          });
        }
      }
    });
  };

  // Badge Color Helpers
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-700";
      case "HIGH": return "bg-orange-100 text-orange-700";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700";
      case "LOW": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "REPORTED": return "bg-purple-100 text-purple-700";
      case "CONFIRMED": return "bg-blue-100 text-blue-700";
      case "ASSIGNED": return "bg-indigo-100 text-indigo-700";
      case "IN_PROGRESS": return "bg-amber-100 text-amber-700";
      case "RESOLVED": return "bg-emerald-100 text-emerald-700";
      case "CLOSED": return "bg-gray-100 text-gray-700";
      case "CANCELLED": return "bg-rose-100 text-rose-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-600" /> Unexpected Outages Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor, manage status, and track unexpected power outages reported by customers.
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search outages by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Content Section: Loader / Empty / Responsive Data Display */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
        </div>
      ) : outages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-16 text-gray-500">
          No unexpected outages found.
        </div>
      ) : (
        <>
          {/* Mobile & Small Screen: Card Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {outages.map((outage) => (
              <div key={outage.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-base">{outage.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${getStatusBadgeClass(outage.status)}`}>
                      {outage.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium">Area:</span> {outage.area?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium">Reporter:</span> {outage.reportedBy?.name || "N/A"}
                  </p>
                  <div className="flex items-center justify-between my-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityBadgeClass(outage.priority)}`}>
                      {outage.priority}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(outage.reportedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenStatusModal(outage)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
                  >
                    <FaEdit size={12} /> Status
                  </button>
                  <button
                    onClick={() => handleDelete(outage.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Medium & Large Screen: Table Method */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Title / Description</th>
                    <th className="py-3 px-4 font-semibold">Area</th>
                    <th className="py-3 px-4 font-semibold">Reported By</th>
                    <th className="py-3 px-4 font-semibold">Priority</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Reported At</th>
                    <th className="py-3 px-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {outages.map((outage) => (
                    <tr key={outage.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{outage.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{outage.description || "No description"}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{outage.area?.name || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-600">{outage.reportedBy?.name || "N/A"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getPriorityBadgeClass(outage.priority)}`}>
                          {outage.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(outage.status)}`}>
                          {outage.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {new Date(outage.reportedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => handleOpenStatusModal(outage)}
                          className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="Update Status"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(outage.id)}
                          className="inline-flex items-center justify-center p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="Delete Outage"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal for Updating Status & Reason */}
      {isModalOpen && selectedOutage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="bg-red-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="text-lg font-semibold">Update Outage Status</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={updateFormData.status}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                >
                  <option value="REPORTED">REPORTED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Notes</label>
                <textarea
                  rows={3}
                  value={updateFormData.reason}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, reason: e.target.value })}
                  placeholder="Provide status reason or explanation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Restoration Time</label>
                <input
                  type="datetime-local"
                  value={updateFormData.estimatedRestoreAt}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, estimatedRestoreAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}