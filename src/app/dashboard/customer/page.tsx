'use client';

import { useAuthStore } from '@/src/store/useAuthStore';

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome, {user?.name || 'Customer'}! 👋</h2>
          <p className="text-sm text-slate-500 mt-1">Check local load shedding schedules, track reports, and view bill updates.</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Customer Panel
        </span>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Power Status</p>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">🟢 Active</h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">No interruption currently</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">My Reports</p>
          <h3 className="text-3xl font-extrabold text-blue-600 mt-2">01</h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">1 active support ticket</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase">Bills & Payments</p>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-2">Paid</h3>
          <span className="text-xs text-slate-500 mt-1 inline-block">All dues cleared</span>
        </div>
      </div>

      {/* Schedule Alert Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Area Load Shedding Notice</h3>
        <p className="text-sm text-slate-500 mb-4">Upcoming power cuts scheduled for your registered zone.</p>
        
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
          <div>
            <p className="font-semibold text-sm">Shift: Evening Block</p>
            <p className="text-xs text-amber-700 mt-0.5">Expected Outage Time: 05:00 PM - 07:00 PM</p>
          </div>
          <span className="bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg">
            Scheduled Today
          </span>
        </div>
      </div>
    </div>
  );
}