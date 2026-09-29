'use client';

import { useLoadSheddingQuery } from '@/hooks/useLoadSheddingQuery';
import { useAuthStore } from '@/store/useAuthStore';

export default function SchedulesPage() {
  const { schedules, isLoading, error } = useLoadSheddingQuery();
  const { user } = useAuthStore(); // Zustand theke logged-in user er info nilam

  if (isLoading) return <p className="text-center py-10">Loading schedules...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Failed to load data.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Load Shedding Schedules</h1>
      {user && <p className="text-sm text-gray-600 mb-4">Welcome, {user.name} ({user.role})</p>}
      
      <div className="grid gap-4">
        {schedules.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="font-semibold text-lg">{item.areaName}</h3>
            <p className="text-sm text-gray-500">Time: {item.scheduleTime}</p>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}