"use client";

import React, { useEffect, useState } from "react";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure"; // Apnar project er path onujayi thik kore neben
import { useAuthStore } from "@/src/store/useAuthStore";     // Apnar project er path onujayi thik kore neben
import Swal from "sweetalert2";
import { FaTasks, FaEdit, FaTrash, FaSearch, FaUserPlus, FaEye } from "react-icons/fa";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface OutageInfo {
  id: string;
  title: string;
  priority: string;
  status: string;
}

interface TechnicianAssignment {
  id: string;
  outageId: string;
  technicianId: string;
  assignedById: string;
  status: "ASSIGNED" | "ACCEPTED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED";
  notes?: string;
  assignedAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  outage?: OutageInfo;
  technician?: UserInfo;
  assignedBy?: UserInfo;
}

export default function AdminAssignments() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();

  const [assignments, setAssignments] = useState<TechnicianAssignment[]>([]);
  const [technicians, setTechnicians] = useState<UserInfo[]>([]);
  const [outages, setOutages] = useState<OutageInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter & Pagination States
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Modal State for Assign / Reassign
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<TechnicianAssignment | null>(null);
  
  // Create / Edit Form Data
  const [formData, setFormData] = useState({
    outageId: "",
    technicianId: "",
    notes: "",
  });

  // Fetch Technicians (Assuming users with role TECHNICIAN)
  const fetchTechnicians = async () => {
    try {
      const response = await axiosSecure.get(`/users?role=TECHNICIAN`);
      setTechnicians(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Failed to load technicians", error);
    }
  };

  // Fetch Unassigned or Active Outages for assignment selection
  const fetchOutages = async () => {
    try {
      const response = await axiosSecure.get(`/outages?status=REPORTED,CONFIRMED`);
      setOutages(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Failed to load outages", error);
    }
  };

  // Fetch Assignments with Query Params
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/assignments`, {
        params: {
          status: statusFilter || undefined,
          search: searchQuery || undefined,
          page,
          limit,
        },
      });
      setAssignments(response.data?.data || response.data || []);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message || "Failed to load technician assignments!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
    fetchOutages();
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [statusFilter, searchQuery, page, limit]);

  // Handle Create or Update Assignment Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedAssignment) {
        // Update / Reassign: PATCH /assignments/:id
        await axiosSecure.patch(`/assignments/${selectedAssignment.id}`, {
          technicianId: formData.technicianId,
          notes: formData.notes,
        });
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Assignment successfully updated.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Create: POST /assignments
        await axiosSecure.post(`/assignments`, {
          outageId: formData.outageId,
          technicianId: formData.technicianId,
          notes: formData.notes,
        });
        Swal.fire({
          icon: "success",
          title: "Assigned!",
          text: "Technician assigned to outage successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setIsAssignModalOpen(false);
      setSelectedAssignment(null);
      setFormData({ outageId: "", technicianId: "", notes: "" });
      fetchAssignments();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: error?.response?.data?.message || "Operation failed. Please try again.",
      });
    }
  };

  // Open Modal for New Assignment
  const handleOpenCreateModal = () => {
    setSelectedAssignment(null);
    setFormData({ outageId: "", technicianId: "", notes: "" });
    setIsAssignModalOpen(true);
  };

  // Open Modal for Reassign / Edit Notes
  const handleOpenEditModal = (assignment: TechnicianAssignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      outageId: assignment.outageId,
      technicianId: assignment.technicianId,
      notes: assignment.notes || "",
    });
    setIsAssignModalOpen(true);
  };

  // Handle Soft Delete: DELETE /assignments/:id
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this assignment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/assignments/${id}`);
          Swal.fire("Deleted!", "Assignment has been deleted.", "success");
          fetchAssignments();
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: error?.response?.data?.message || "Failed to delete assignment.",
          });
        }
      }
    });
  };

  // Badge Color Helper for Assignment Status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ASSIGNED": return "bg-purple-100 text-purple-700";
      case "ACCEPTED": return "bg-blue-100 text-blue-700";
      case "REJECTED": return "bg-rose-100 text-rose-700";
      case "IN_PROGRESS": return "bg-amber-100 text-amber-700";
      case "COMPLETED": return "bg-emerald-100 text-emerald-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaTasks className="text-red-600" /> Technician Assignments Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Assign technicians to unexpected outages and track progress in real-time.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
        >
          <FaUserPlus /> Assign Technician
        </button>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search by notes or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Content Section: Loader / Empty / Responsive Display */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-16 text-gray-500">
          No technician assignments found.
        </div>
      ) : (
        <>
          {/* Mobile & Small Screen: Card Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {assignments.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {item.outage?.title || "Outage Details N/A"}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium">Technician:</span> {item.technician?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium">Assigned By:</span> {item.assignedBy?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mb-2 italic">
                    <span className="font-medium">Notes:</span> {item.notes || "No notes provided"}
                  </p>
                  <span className="text-xs text-gray-400 block mb-2">
                    Assigned At: {new Date(item.assignedAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
                  >
                    <FaEdit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
                    <th className="py-3 px-4 font-semibold">Outage Title</th>
                    <th className="py-3 px-4 font-semibold">Technician</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Notes</th>
                    <th className="py-3 px-4 font-semibold">Assigned At</th>
                    <th className="py-3 px-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {assignments.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{item.outage?.title || "N/A"}</p>
                        <span className="text-xs text-gray-400">Priority: {item.outage?.priority || "N/A"}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <p className="font-medium">{item.technician?.name || "N/A"}</p>
                        <p className="text-xs text-gray-400">{item.technician?.email || ""}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs max-w-xs truncate">
                        {item.notes || "No notes"}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {new Date(item.assignedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="Edit/Reassign"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center justify-center p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="Delete Assignment"
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

      {/* Modal for Creating / Reassigning Technician */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="bg-red-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {selectedAssignment ? "Reassign Technician / Update" : "Assign Technician"}
              </h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {!selectedAssignment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Outage</label>
                  <select
                    required
                    value={formData.outageId}
                    onChange={(e) => setFormData({ ...formData, outageId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                  >
                    <option value="">Select an unexpected outage...</option>
                    {outages.map((outage) => (
                      <option key={outage.id} value={outage.id}>
                        {outage.title} ({outage.priority})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Technician</label>
                <select
                  required
                  value={formData.technicianId}
                  onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
                >
                  <option value="">Select a technician...</option>
                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} ({tech.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Check transformer and feeder connection..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
                >
                  {selectedAssignment ? "Update Assignment" : "Assign Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}