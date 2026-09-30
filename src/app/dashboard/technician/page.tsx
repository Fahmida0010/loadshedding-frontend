'use client';

import { useAuthStore } from '@/src/store/useAuthStore';

export default function TechnicianDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name || 'Technician'}! 🛠️</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your field tasks, line maintenance, and emergency reports here.</p>
        </div>
        <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Technician Panel
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Pending Tasks</p>
          <h3 className="text-3xl font-extrabold text-amber-600 mt-2">04</h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">Requires immediate action</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Completed Today</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">02</h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">Great performance</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Assigned</p>
          <h3 className="text-3xl font-extrabold text-blue-600 mt-2">12</h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">This month</span>
        </div>
      </div>

      {/* Task List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Assigned Field Tasks</h3>
          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-lg">Live Updates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Task ID</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Issue Type</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">#TSK-401</td>
                <td className="px-4 py-3">Mirpur Section 10 Grid</td>
                <td className="px-4 py-3">Transformer Overload</td>
                <td className="px-4 py-3">
                  <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium">Pending</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-900">#TSK-402</td>
                <td className="px-4 py-3">Dhanmondi Road 27</td>
                <td className="px-4 py-3">Line Maintenance</td>
                <td className="px-4 py-3">
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">In Progress</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}