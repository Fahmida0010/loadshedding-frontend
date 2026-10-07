'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useAuthStore } from '@/src/store/useAuthStore';
import Loading from '../loading';
import axios from 'axios';

// Zod schema for filter validation
const scheduleFilterSchema = z.object({
  status: z.string().optional(),
  areaId: z.string().optional(),
});

export default function SchedulesPage() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  // Fetch areas for the dropdown filter (Fixed with safe fallback array)
  const { data: areas = [] } = useQuery({
    queryKey: ['areas-list'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/areas`);
      return res.data?.data || res.data?.areas || res.data || [];
    },
  });

  // TanStack Query for schedules (handling error properly as queryError)
  const { data: schedules = [], isLoading, error: queryError } = useQuery({
    queryKey: ['schedules', statusFilter, areaFilter],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schedules`, {
        params: { 
          status: statusFilter,
          areaId: areaFilter,
        },
      });
      return res.data?.data || res.data?.schedules || res.data || [];
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            Load Shedding & Planned Schedules ⚡
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Check current and upcoming power disruption schedules across different areas.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value="">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Area Filter */}
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          <option value="">All Areas</option>
          {Array.isArray(areas) && areas.map((area: any) => (
            <option key={area.id} value={area.id}>
              {area.name} {area.code ? `(${area.code})` : ''}
            </option>
          ))}
        </select>

        {(statusFilter || areaFilter) && (
          <button
            onClick={() => {
              setStatusFilter('');
              setAreaFilter('');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium underline px-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Schedules List Grid */}
      {!Array.isArray(schedules) || schedules.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm">No schedules found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {schedules.map((item: any) => {
            // Status badge color switcher
            const getStatusBadge = (status: string) => {
              switch (status) {
                case 'ACTIVE':
                  return 'bg-red-100 text-red-700 border-red-200';
                case 'SCHEDULED':
                  return 'bg-amber-100 text-amber-800 border-amber-200';
                case 'COMPLETED':
                  return 'bg-green-100 text-green-700 border-green-200';
                default:
                  return 'bg-gray-100 text-gray-700 border-gray-200';
              }
            };

            return (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      {/* Area Badge */}
                      {item.area && (
                        <span className="inline-block text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 mb-2 border border-blue-100">
                          📍 {item.area.name} {item.area.code ? `• ${item.area.code}` : ''}
                        </span>
                      )}
                      <h3 className="font-bold text-lg text-gray-900 leading-snug">{item.title}</h3>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-semibold shrink-0 ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description || 'No description provided for this schedule.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-red-600">Start:</span>
                    <span>{new Date(item.scheduledStart).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-600">End:</span>
                    <span>{new Date(item.scheduledEnd).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}