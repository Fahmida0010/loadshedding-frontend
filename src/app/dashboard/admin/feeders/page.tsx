"use client";

import React, { useEffect, useState } from "react";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure"; 
import { useAuthStore } from "@/src/store/useAuthStore";     
import Swal from "sweetalert2";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBolt } from "react-icons/fa";

interface Substation {
  id: string;
  name: string;
  code: string;
}

interface Feeder {
  id: string;
  substationId: string;
  name: string;
  code: string;
  capacityMw?: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  substation?: Substation;
  createdAt: string;
}

export default function Feeders() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();

  const [feeders, setFeeders] = useState<Feeder[]>([]);
  const [substations, setSubstations] = useState<Substation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [substationFilter, setSubstationFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedFeederId, setSelectedFeederId] = useState<string | null>(null);
  
  // Form fields based on Prisma Schema & Route API
  const [formData, setFormData] = useState({
    substationId: "",
    name: "",
    code: "",
    capacityMw: "",
    priority: "MEDIUM",
  });

  // Fetch Substations for Dropdown in Form & Filter
  const fetchSubstations = async () => {
    try {
      const response = await axiosSecure.get(`/substations`);
      setSubstations(response.data?.data || response.data || []);
    } catch (error: any) {
      console.error("Failed to load substations", error);
    }
  };

  // Fetch Feeders with Query Params
  const fetchFeeders = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/feeders`, {
        params: { 
          searchTerm, 
          substationId: substationFilter || undefined, 
          priority: priorityFilter || undefined, 
          page, 
          limit 
        },
      });
      setFeeders(response.data?.data || response.data || []);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message || "Failed to load feeders!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubstations();
  }, []);

  useEffect(() => {
    fetchFeeders();
  }, [searchTerm, substationFilter, priorityFilter, page, limit]);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedFeederId(null);
    setFormData({ substationId: "", name: "", code: "", capacityMw: "", priority: "MEDIUM" });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (feeder: Feeder) => {
    setIsEditMode(true);
    setSelectedFeederId(feeder.id);
    setFormData({
      substationId: feeder.substationId,
      name: feeder.name,
      code: feeder.code,
      capacityMw: feeder.capacityMw ? feeder.capacityMw.toString() : "",
      priority: feeder.priority,
    });
    setIsModalOpen(true);
  };

  // Handle Submit (POST /feeders or PATCH /feeders/:id)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        capacityMw: formData.capacityMw ? Number(formData.capacityMw) : undefined,
      };

      if (isEditMode && selectedFeederId) {
        await axiosSecure.patch(`/feeders/${selectedFeederId}`, payload);
        Swal.fire({
          icon: "success",
          title: "Successful!",
          text: "Feeder successfully updated.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await axiosSecure.post(`/feeders`, payload);
        Swal.fire({
          icon: "success",
          title: "Successful!",
          text: "New feeder successfully created.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setIsModalOpen(false);
      fetchFeeders();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: error?.response?.data?.message || "Something went wrong while processing your request.",
      });
    }
  };

  // Handle Delete (DELETE /feeders/:id)
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this feeder? It cannot be deleted if it contains active areas!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/feeders/${id}`);
          Swal.fire("Deleted!", "Feeder has been deleted successfully.", "success");
          fetchFeeders();
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: error?.response?.data?.message || "Feeder may contain active areas or other dependencies.",
          });
        }
      }
    });
  };

  // Priority Badge Color Helper
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-700";
      case "HIGH": return "bg-orange-100 text-orange-700";
      case "MEDIUM": return "bg-yellow-100 text-yellow-700";
      case "LOW": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaBolt className="text-blue-600" /> Feeders Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage power distribution feeders efficiently as an admin.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-md"
        >
          <FaPlus /> Add Feeder
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
            placeholder="Search feeders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={substationFilter}
            onChange={(e) => setSubstationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">All Substations</option>
            {substations.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : feeders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-16 text-gray-500">
          No feeders found.
        </div>
      ) : (
        <>
          {/* Mobile & Small Screen: Card Method (Visible on screens smaller than md) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {feeders.map((feeder) => (
              <div key={feeder.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-base">{feeder.name}</h3>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold shrink-0">
                      {feeder.code}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium">Substation:</span> {feeder.substation?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    <span className="font-medium">Capacity:</span> {feeder.capacityMw ? `${feeder.capacityMw} MW` : "N/A"}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityBadgeClass(feeder.priority)}`}>
                      {feeder.priority}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(feeder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenEditModal(feeder)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-medium transition"
                  >
                    <FaEdit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(feeder.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Medium & Large Screen: Table Method (Hidden on small screens, visible on md and up) */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Code</th>
                    <th className="py-3 px-4 font-semibold">Substation</th>
                    <th className="py-3 px-4 font-semibold">Capacity (MW)</th>
                    <th className="py-3 px-4 font-semibold">Priority</th>
                    <th className="py-3 px-4 font-semibold">Created At</th>
                    <th className="py-3 px-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {feeders.map((feeder) => (
                    <tr key={feeder.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-4 font-medium text-gray-900">{feeder.name}</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {feeder.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{feeder.substation?.name || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-600">{feeder.capacityMw ? `${feeder.capacityMw} MW` : "N/A"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getPriorityBadgeClass(feeder.priority)}`}>
                          {feeder.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(feeder.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(feeder)}
                          className="inline-flex items-center justify-center p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                          title="Edit Feeder"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(feeder.id)}
                          className="inline-flex items-center justify-center p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="Delete Feeder"
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

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {isEditMode ? "Update Feeder" : "Create Feeder"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Substation</label>
                <select
                  name="substationId"
                  required
                  value={formData.substationId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">Select Substation</option>
                  {substations.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feeder Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kumargaon Feeder 01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feeder Code</label>
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. SYL-KGS-F01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (MW)</label>
                <input
                  type="number"
                  step="any"
                  name="capacityMw"
                  value={formData.capacityMw}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
                >
                  {isEditMode ? "Update Feeder" : "Create Feeder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}