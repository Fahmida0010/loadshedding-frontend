'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import Loading from '../loading';


// Zod schema for filter validation
const scheduleFilterSchema = z.object({
  status: z.string().optional(),
});

export default function SchedulesPage() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('');
 const axiosSecure= useAxiosSecure(); // Axios instance with auth token

 // TanStack Query (ekhane 'error: queryError' thik vabe destructure korte hobe)
  const { data: schedules = [], isLoading, error: queryError } = useQuery({
    queryKey: ['schedules', statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get('/schedules', {
        params: { status: statusFilter },
      });
      return res.data;
    },
  });

  if (isLoading) return <Loading />;
  
  if (queryError) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center text-red-500">
        <h2 className="text-xl font-bold">Failed to load schedules</h2>
        <p className="text-sm">{(queryError as any)?.message || 'Something went wrong.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Load Shedding & Planned Schedules ⚡</h1>
          <p className="text-sm text-gray-600">Check current and upcoming power disruption schedules in your area.</p>
        </div>
        {user && (
          <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
            Role: {user.role}
          </span>
        )}
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Schedules List Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {schedules.map((item: any) => (
          <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                {item.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.description || 'No description provided.'}</p>
            <div className="text-xs text-gray-500 pt-2 border-t flex justify-between">
              <span>Start: {new Date(item.scheduledStart).toLocaleString()}</span>
              <span>End: {new Date(item.scheduledEnd).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}