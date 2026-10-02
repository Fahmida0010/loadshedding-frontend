'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import Loading from '../../loading';


interface ILoadSheddingSchedule {
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
    location?: string;
  };
}

export default function AreaSchedule() {
  const { user } = useAuthStore();
  const axiosSecure = useAxiosSecure();

  // useAxiosSecure diye schedules data fetch kora hocche
  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const res = await axiosSecure.get('/schedules');
      return res.data;
    },
  });

  const schedules: ILoadSheddingSchedule[] = responseData?.data || [];

  if (isLoading) {
    return <Loading/>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Failed to load schedule data.</div>;
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="my-8 max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Area Load Shedding Schedules</h2>
          <p className="text-sm text-gray-500">Upcoming and active power outage schedules in your region.</p>
        </div>
        {user && (
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 font-medium">
            Welcome, {user.name} ({user.role})
          </span>
        )}
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-sm">No schedules available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((item) => (
            <div key={item.id} className="p-5 border border-gray-200 rounded-xl shadow-sm bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm font-medium text-blue-600 mb-2">
                  📍 {item.area?.name} <span className="text-xs text-gray-400">({item.area?.code})</span>
                </p>

                {item.description && (
                  <p className="text-xs text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                )}
              </div>

              <div className="border-t pt-3 mt-2 text-xs text-gray-500 space-y-1">
                <p>
                  <strong className="text-gray-700">Start:</strong> {new Date(item.scheduledStart).toLocaleString()}
                </p>
                <p>
                  <strong className="text-gray-700">End:</strong> {new Date(item.scheduledEnd).toLocaleString()}
                </p>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase">Priority: {item.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}