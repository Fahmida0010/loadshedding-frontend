'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import { useAuthStore } from '@/src/store/useAuthStore';
import Loading from '../loading';

export default function Outages() {
  const { user, token } = useAuthStore();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure(); 

  const [form, setForm] = useState({
    title: '',
    description: '',
    areaId: '',
    priority: 'MEDIUM',
  });

  // 1. Fetch Areas for the Dropdown
  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: async () => {
      const res = await axiosSecure.get('/areas');
      return res.data?.data || res.data;
    },
  });

  // Fetch Outages using TanStack Query
  const { data: outages = [], isLoading } = useQuery({
    queryKey: ['outages'],
    queryFn: async () => {
      const res = await axiosSecure.get('/outages');
      return res.data;
    },
  });

  // Mutation to report unexpected outage
  const reportMutation = useMutation({
    mutationFn: async (newOutage: any) => {
      const res = await axiosSecure.post('/outages',
        newOutage,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outages'] });
      setForm({ title: '', description: '', areaId: '', priority: 'MEDIUM' });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Outage reported successfully!',
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err: any) => {
      const errorMsg = err?.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMsg,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Direct validation check for title and area
    if (!form.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Title',
        text: 'Please add a valid outage title!',
      });
      return;
    }

    if (!form.areaId) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Area',
        text: 'Please select an area before submitting!',
      });
      return;
    }

    reportMutation.mutate(form);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold">Unexpected Outages & Reports 🛠️</h1>
        <p className="text-sm opacity-90 mt-1">Track active power outages or report a sudden failure in your zone instantly.</p>
      </div>

      {/* Report Form Card */}
      {user && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">Report an Unexpected Outage</h2>
            <p className="text-sm text-gray-500">Fill out the details below to notify administrators about power failures.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Outage Title</label>
              <input
                type="text"
                placeholder="e.g., Transformer Failure or Line Snapped"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-red-500 outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase">Select Area</label>
              <select
                value={form.areaId}
                onChange={(e) => setForm({ ...form, areaId: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white text-gray-900 focus:ring-2 focus:ring-red-500 outline-none transition"
              >
                <option value="">-- Choose Your Area --</option>
                {areas.map((area: any) => (
                  <option key={area.id} value={area.id}>
                    {area.name} {area.zone ? `- ${area.zone}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase">Priority Level</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white text-gray-900 focus:ring-2 focus:ring-red-500 outline-none transition"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Description (Optional)</label>
              <textarea
                rows={3}
                placeholder="Provide additional details if needed..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-red-500 outline-none transition"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={reportMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition shadow-md disabled:opacity-50"
              >
                {reportMutation.isPending ? 'Submitting Report...' : 'Submit Outage Report 🚀'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Outages List Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Active Outage Reports</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {outages.map((item: any) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                    📍 {item.area?.name || item.Area?.name || 'Specified Area'} {item.area?.zone ? `(${item.area.zone})` : ''}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-semibold uppercase tracking-wide">
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description || 'No additional details provided.'}</p>
              </div>

              <div className="text-xs text-gray-500 pt-3 border-t flex justify-between items-center">
                <span className="font-medium text-gray-700">Priority: <span className="font-bold text-red-600">{item.priority}</span></span>
                <span>{new Date(item.reportedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}