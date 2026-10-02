"use client";

import Loading from '@/src/app/loading';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import { useAuthStore } from '@/src/store/useAuthStore';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Substation {
  id: string;
  zoneId: string;
  name: string;
  code: string;
  location?: string;
  capacityMw?: number;
  voltageLevel?: string;
  zone?: {
    name: string;
  };
}

interface Zone {
  id: string;
  name: string;
}

const Substations = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();

  const [substations, setSubstations] = useState<Substation[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentSubstationId, setCurrentSubstationId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    zoneId: '',
    name: '',
    code: '',
    location: '',
    capacityMw: '',
    voltageLevel: ''
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('');

  // Fetch Substations
  const fetchSubstations = async () => {
    try {
      setLoading(true);
      let query = `/substations?`;
      if (searchTerm) query += `searchTerm=${encodeURIComponent(searchTerm)}&`;
      if (selectedZone) query += `zoneId=${selectedZone}&`;

      const res = await axiosSecure.get(query);
      setSubstations(res.data.data || res.data);
    } catch (error: any) {
      console.error('Error fetching substations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Zones
  const fetchZones = async () => {
    try {
      const res = await axiosSecure.get('/distribution-zones');
      setZones(res.data.data || res.data);
    } catch (error: any) {
      console.error('Error fetching zones:', error);
    }
  };

  useEffect(() => {
    fetchSubstations();
    fetchZones();
  }, [searchTerm, selectedZone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ zoneId: '', name: '', code: '', location: '', capacityMw: '', voltageLevel: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Substation) => {
    setModalMode('edit');
    setCurrentSubstationId(sub.id);
    setFormData({
      zoneId: sub.zoneId || '',
      name: sub.name || '',
      code: sub.code || '',
      location: sub.location || '',
      capacityMw: sub.capacityMw ? sub.capacityMw.toString() : '',
      voltageLevel: sub.voltageLevel || ''
    });
    setIsModalOpen(true);
  };

  // Submit Handler (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        capacityMw: formData.capacityMw ? Number(formData.capacityMw) : undefined
      };

      if (modalMode === 'create') {
        await axiosSecure.post('/substations', payload);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Substation created successfully!',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await axiosSecure.patch(`/substations/${currentSubstationId}`, payload);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Substation updated successfully!',
          timer: 1500,
          showConfirmButton: false
        });
      }

      setIsModalOpen(false);
      fetchSubstations();
    } catch (error: any) {
      console.error('Error saving substation:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'Something went wrong!'
      });
    }
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this substation?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/substations/${id}`);
          Swal.fire(
            'Deleted!',
            'Substation deleted successfully!',
            'success'
          );
          fetchSubstations();
        } catch (error: any) {
          console.error('Error deleting substation:', error);
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: error.response?.data?.message || 'Failed to delete (might have active feeders)'
          });
        }
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Substation Management</h1>
          <p className="text-sm text-gray-500">Manage power distribution substations securely using axiosSecure.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow transition duration-200 flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span>+ Add New Substation</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, code or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">All Distribution Zones</option>
            {zones.map((zone) => (
              <option key={zone.id} value={zone.id}>{zone.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content List / Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <Loading/>
        : substations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No substations found.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="p-4">Name & Code</th>
                    <th className="p-4">Zone</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Capacity (MW)</th>
                    <th className="p-4">Voltage Level</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {substations.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">
                        {sub.name}
                        <span className="block text-xs font-normal text-gray-500">{sub.code}</span>
                      </td>
                      <td className="p-4">{sub.zone?.name || 'N/A'}</td>
                      <td className="p-4 text-gray-500">{sub.location || 'N/A'}</td>
                      <td className="p-4">{sub.capacityMw ? `${sub.capacityMw} MW` : 'N/A'}</td>
                      <td className="p-4">{sub.voltageLevel || 'N/A'}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="text-blue-600 hover:text-blue-900 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="text-red-600 hover:text-red-900 font-medium text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
              {substations.map((sub) => (
                <div key={sub.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{sub.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{sub.code}</span>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {sub.capacityMw ? `${sub.capacityMw} MW` : 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 pt-2 border-t border-gray-100">
                    <p><span className="font-medium text-gray-700">Zone:</span> {sub.zone?.name || 'N/A'}</p>
                    <p><span className="font-medium text-gray-700">Location:</span> {sub.location || 'N/A'}</p>
                    <p><span className="font-medium text-gray-700">Voltage:</span> {sub.voltageLevel || 'N/A'}</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(sub)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {modalMode === 'create' ? 'Create New Substation' : 'Edit Substation'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Distribution Zone *</label>
                <select
                  name="zoneId"
                  value={formData.zoneId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Select Zone</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Substation Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kumargaon Grid Substation"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Substation Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. SYL-KGS-001"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kumargaon, Sylhet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Capacity (MW)</label>
                  <input
                    type="number"
                    name="capacityMw"
                    value={formData.capacityMw}
                    onChange={handleChange}
                    placeholder="e.g. 80"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Voltage Level</label>
                  <input
                    type="text"
                    name="voltageLevel"
                    value={formData.voltageLevel}
                    onChange={handleChange}
                    placeholder="e.g. 132/33 KV"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow"
                >
                  {modalMode === 'create' ? 'Create Substation' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Substations;
