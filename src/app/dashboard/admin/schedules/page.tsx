'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxiosSecure } from '@/hooks/useAxiosSecure';
import { useAuthStore } from '@/store/useAuthStore';

interface ISchedule {
  id: string;
  title: string;
  description?: string;
  type: 'LOAD_SHEDDING' | 'PLANNED_OUTAGE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  scheduledStart: string;
  scheduledEnd: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  area: {
    id: string;
    name: string;
    code: string;
  };
}

interface IArea {
  id: string;
  name: string;
  code: string;
}

export default function AdminSchedulesPage() {
  const { user } = useAuthStore();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    areaId: '',
    title: '',
    description: '',
    type: 'LOAD_SHEDDING',
    priority: 'MEDIUM',
    scheduledStart: '',
    scheduledEnd: '',
    status: 'SCHEDULED',
  });

  // 1. Fetch all schedules
  const { data: schedulesRes, isLoading } = useQuery({
    queryKey: ['admin-schedules'],
    queryFn: async () => {
      const res = await axiosSecure.get('/schedules');
      return res.data;
    },
  });

  // 2. Fetch areas for dropdown selection when creating schedule
  const { data: areasRes } = useQuery({
    queryKey: ['areas-list'],
    queryFn: async () => {
      const res = await axiosSecure.get('/areas'); // Apnar area route thakle ekhane connect hobe
      return res.data;
    },
  });

  const schedules: ISchedule[] = schedulesRes?.data || [];
  const areas: IArea[] = areasRes?.data || [];

  // 3. Create Schedule Mutation (Admin only route: POST /schedules)
  const createMutation = useMutation({
    mutationFn: async (newSchedule: typeof formData) => {
      const res = await axiosSecure.post('/schedules', newSchedule);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedules'] });
      setIsModalOpen(false);
      setFormData({
        areaId: '',
        title: '',
        description: '',
        type: 'LOAD_SHEDDING',
        priority: 'MEDIUM',
        scheduledStart: '',
        scheduledEnd: '',
        status: 'SCHEDULED',
      });
      alert('Schedule created successfully!');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to create schedule');
    },
  });

  // 4. Delete Schedule Mutation (Admin only route: DELETE /schedules/:id)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosSecure.delete(`/schedules/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedules'] });
      alert('Schedule deleted successfully!');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to delete schedule');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="text-center py-20 font-medium">Loading admin schedules...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Load Shedding Schedules</h1>
          <p className="text-sm text-gray-500">Create, update or monitor power outage schedules as an Admin.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          + Create New Schedule
        </button>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
              <th className="p-4">Title & Area</th>
              <th className="p-4">Type / Priority</th>
              <th className="p-4">Time Period</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No schedules found.
                </td>
              </tr>
            ) : (
              schedules.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-blue-600">📍 {item.area?.name} ({item.area?.code})</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-0.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium mb-1">
                      {item.type}
                    </span>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Priority: {item.priority}</p>
                  </td>
                  <td className="p-4 text-xs text-gray-600">
                    <p><strong>Start:</strong> {new Date(item.scheduledStart).toLocaleString()}</p>
                    <p><strong>End:</strong> {new Date(item.scheduledEnd).toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this schedule?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 text-xs font-semibold px-3 py-1 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Creating Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Load Shedding Schedule</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Select Area</label>
                <select
                  required
                  value={formData.areaId}
                  onChange={(e) => setFormData({ ...formData, areaId: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                >
                  <option value="">-- Choose Area --</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} ({area.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Maintenance in Uposhohor"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details about the outage..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                  >
                    <option value="LOAD_SHEDDING">LOAD SHEDDING</option>
                    <option value="PLANNED_OUTAGE">PLANNED OUTAGE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full border rounded-lg p-2.5 text-sm bg-gray-50"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledStart}
                    onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledEnd}
                    onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
                    className="w-full border rounded-lg p-2 text-sm bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  {createMutation.isPending ? 'Saving...' : 'Save Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}