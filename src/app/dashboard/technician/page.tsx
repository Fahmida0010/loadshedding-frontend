'use client';

import { useState, useEffect } from 'react';
import {AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useAxiosSecure } from '@/src/hooks/useAxiosSecure';
import Loading from '../../loading';

interface Assignment {
  id: string;
  status: string;
  assignedAt: string;
  outage?: {
    id: string;
    title: string;
    description?: string;
    priority?: string;
    area?: {
      name: string;
      code: string;
    };
  };
}

export default function TechnicianDashboardPage() {
  const { user } = useAuthStore();
  const axiosSecure = useAxiosSecure();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Stats count
  const [stats, setStats] = useState({
    pending: 0,
    completedToday: 0,
    totalAssigned: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/assignments/my-assignments');
      const resultData = response.data?.data || response.data;
      const list: Assignment[] = Array.isArray(resultData) ? resultData : resultData.result || [];

      setAssignments(list);

      // Calculate stats dynamically from data
      const pendingCount = list.filter(item => item.status === 'ASSIGNED' || item.status === 'ACCEPTED' || item.status === 'IN_PROGRESS').length;
      
      const todayStr = new Date().toISOString().split('T')[0];
      const completedTodayCount = list.filter(item => {
        if (item.status !== 'COMPLETED') return false;
        // Assuming there might be a completedAt or fallback to assignedAt
        return true; 
      }).length;

      setStats({
        pending: pendingCount,
        completedToday: completedTodayCount,
        totalAssigned: list.length,
      });

    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-green-600">
            Hello, {user?.name || 'Technician'}! 🛠️
          </h2>
          <p className="text-lg text-slate-500 mt-1">Manage your field tasks, line maintenance, and emergency reports here.</p>
        </div>
        <span className="bg-amber-100 text-amber-800
         text-xs font-semibold px-3 py-1.5 rounded-full 
         uppercase tracking-wider">
          Technician Panel
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Pending Tasks</p>
          <h3 className="text-3xl font-extrabold text-amber-600 mt-2">
            {String(stats.pending).padStart(2, '0')}
          </h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">Requires immediate action</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Completed Tasks</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">
            {String(stats.completedToday).padStart(2, '0')}
          </h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">Total finished tasks</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Assigned</p>
          <h3 className="text-3xl font-extrabold text-blue-600 mt-2">
            {String(stats.totalAssigned).padStart(2, '0')}
          </h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">All time records</span>
        </div>
      </div>

      {/* Task List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Assigned Field Tasks</h3>
          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-lg">Live Updates</span>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">No field tasks assigned right now.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Task ID</th>
                  <th className="px-4 py-3">Location / Area</th>
                  <th className="px-4 py-3">Issue Title</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      #{item.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3">
                      {item.outage?.area?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {item.outage?.title || 'General Maintenance'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        item.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}