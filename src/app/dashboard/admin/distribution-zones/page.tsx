"use client";

import React, { useEffect, useState } from "react";
import { useAxiosSecure } from "@/src/hooks/useAxiosSecure"; 
import { useAuthStore } from "@/src/store/useAuthStore";     
import Swal from "sweetalert2";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaWarehouse } from "react-icons/fa";
import Loading from "@/src/app/loading";

interface DistributionZone {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
}

export default function AdminDistributionZones() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();

  const [zones, setZones] = useState<DistributionZone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  
  // Form fields based on Prisma Schema
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  // Fetch Distribution Zones
  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get(`/distribution-zones`, {
        params: { searchTerm, page, limit },
      });
      setZones(response.data?.data || response.data || []);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message || "Failed to load distribution zones!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, [searchTerm, page, limit]);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedZoneId(null);
    setFormData({ name: "", code: "", description: "" });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (zone: DistributionZone) => {
    setIsEditMode(true);
    setSelectedZoneId(zone.id);
    setFormData({
      name: zone.name,
      code: zone.code,
      description: zone.description || "",
    });
    setIsModalOpen(true);
  };

  // Handle Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedZoneId) {
        await axiosSecure.patch(`/distribution-zones/${selectedZoneId}`, formData);
        Swal.fire({
          icon: "success",
          title: "Successful!",
          text: "Distribution zone successfully updated.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await axiosSecure.post(`/distribution-zones`, formData);
        Swal.fire({
          icon: "success",
          title: "Successful!",
          text: "New distribution zone successfully created.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setIsModalOpen(false);
      fetchZones();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: error?.response?.data?.message || "Something went wrong while processing your request.",
      });
    }
  };

  // Handle Delete (DELETE /distribution-zones/:id)
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this distribution zone? It cannot be deleted if it contains substations!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/distribution-zones/${id}`);
          Swal.fire("Deleted!", "Distribution zone has been deleted successfully.", "success");
          fetchZones();
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: error?.response?.data?.message || "Zone may contain active substations or other dependencies.",
          });
        }
      }
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaWarehouse className="text-blue-600" /> Distribution Zones Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your power distribution zones efficiently as an admin.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-md"
        >
          <FaPlus /> Add Distribution Zone
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search zones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Content Section: Loader / Empty / Responsive Data Display */}
      {loading ? (
      <Loading/>
      ) : zones.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-16 text-gray-500">
          No distribution zones found.
        </div>
      ) : (
        <>
          {/* Mobile & Small Screen: Card Method (Visible on screens smaller than md) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {zones.map((zone) => (
              <div key={zone.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-base">{zone.name}</h3>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold shrink-0">
                      {zone.code}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {zone.description || "No description provided."}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Created: {new Date(zone.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleOpenEditModal(zone)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-medium transition"
                  >
                    <FaEdit size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(zone.id)}
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
                    <th className="py-3 px-4 font-semibold">Description</th>
                    <th className="py-3 px-4 font-semibold">Created At</th>
                    <th className="py-3 px-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {zones.map((zone) => (
                    <tr key={zone.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-3 px-4 font-medium text-gray-900">{zone.name}</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {zone.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 truncate max-w-xs">
                        {zone.description || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(zone.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(zone)}
                          className="inline-flex items-center justify-center p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                          title="Edit Zone"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(zone.id)}
                          className="inline-flex items-center justify-center p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                          title="Delete Zone"
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
                {isEditMode ? "Update Distribution Zone" : "Create Distribution Zone"}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Zone Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. North Zone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zone Code</label>
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. NZ-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional details about this zone..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition"
                >
                  {isEditMode ? "Update Zone" : "Create Zone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}